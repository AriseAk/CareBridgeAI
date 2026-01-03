import os
import io
import gridfs
import speech_recognition as sr
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv
from googletrans import Translator
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGO_URI = os.getenv("MONGO_CLIENT")
SECRET_KEY = os.getenv("SECRET_KEY")

if not PINECONE_API_KEY or not GROQ_API_KEY:
    raise ValueError("Missing API Keys. Please check your .env file.")

app.secret_key = SECRET_KEY

try:
    mongo_client = MongoClient(MONGO_URI)
    user_db = mongo_client['userinfo']
    user_collection = user_db['users']
    audio_db = mongo_client["Audio"]
    fs = gridfs.GridFS(audio_db)
    print("Connected to MongoDB")
except Exception as e:
    print(f"MongoDB Connection Failed: {e}")

print("Connecting to Pinecone...")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("medical-bot")

print("Loading Embedding Model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2', device='cpu') 

print("Connecting to Groq...")
groq_client = Groq(api_key=GROQ_API_KEY)

print("Server Ready!")

@app.route("/voicesearch", methods=["POST"])
def voice_search():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    audio_file = request.files["audio"]
    try:
        audio = AudioSegment.from_file(audio_file)
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_io) as source:
            audio_data = recognizer.record(source)        
        text = recognizer.recognize_google(audio_data)
        translator = Translator()
        detection = translator.detect(text)
        user_lang = detection.lang
        if user_lang != "en":
            translated = translator.translate(text, src=user_lang, dest="en")
            english_text = translated.text
        else:
            english_text = text
        return jsonify({
            "transcribed_text": text,
            "language": user_lang,
            "english_text": english_text
        })

    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError:
        return jsonify({"error": "Speech recognition service unavailable"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict', methods=['POST'])
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_query = data.get('query') or data.get('prompt')
    
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        query_vector = embedder.encode(user_query).tolist()
        results = index.query(
            vector=query_vector, 
            top_k=3, 
            include_metadata=True
        )
        context_text = ""
        sources = []
        if results['matches']:
            for i, match in enumerate(results['matches']):
                meta = match['metadata']
                context_text += f"--- CASE {i+1} ---\n"
                context_text += f"Symptoms: {meta.get('text', 'N/A')}\n"
                context_text += f"Advice: {meta.get('response', 'N/A')}\n\n"
                
                sources.append({
                    "id": match['id'], 
                    "preview": meta.get('text', '')[:100] + "..."
                })
        else:
            context_text = "No similar cases found in the database."

        system_prompt = f"""
        You are an expert Medical AI Assistant designed to assist patients by retrieving similar past cases.
        You must answer based ONLY on the provided context.

        RULES:
        1. STRICT GROUNDING: If the answer is not in the context, say "I cannot find a similar case in my database."
        2. TONE: Professional, empathetic, and concise.
        3. STRUCTURE:
           - Summary: A 1-sentence summary of the condition found.
           - Recommendation: The specific advice given by the doctor in the similar case.
           - Disclaimer: Always end with "Consult a real doctor for a final diagnosis."

        FORMATTING:
        - Use bullet points for symptoms.
        - Never mention "Context" or "Database" to the user; just say "Based on similar cases..."
        CONTEXT:
        {context_text}
        """

        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
        )
        
        response_text = completion.choices[0].message.content

        return jsonify({
            "answer": response_text,
            "sources": sources
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)