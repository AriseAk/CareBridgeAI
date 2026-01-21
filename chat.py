import os
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq
from dotenv import load_dotenv
import speech_recognition as sr
from pydub import AudioSegment
from gtts import gTTS
from deep_translator import GoogleTranslator 
import requests
import re

# 1. Setup App
app = Flask(__name__)
CORS(app)

# 2. Load Secrets
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not PINECONE_API_KEY or not GROQ_API_KEY:
    raise ValueError("❌ Missing API Keys. Please check your .env file.")

# 3. Initialize Resources
print("🔌 Connecting to Pinecone...")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("medical-bot")

print("🧠 Loading Embedding Model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2', device='cpu') 

print("✨ Connecting to Groq...")
client = Groq(api_key=GROQ_API_KEY)

print("✅ Server Ready!")

# --- Helper: Translation Function ---
def translate_text(text, source='auto', target='en'):
    try:
        return GoogleTranslator(source=source, target=target).translate(text)
    except Exception as e:
        print(f"Translation Warning: {e}")
        return text

# --- 1. Multilingual Chat Endpoint ---

@app.route('/api/chat', methods=['POST'])
@app.route('/predict', methods=['POST'])
def chat():
    data = request.json
    user_query = data.get('query') or data.get('prompt')
    
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # A. Translate to English (If you are using deep_translator)
        try:
            query_english = translate_text(user_query, target='en')
        except:
            query_english = user_query
        
        # B. Search Pinecone
        query_vector = embedder.encode(query_english).tolist()
        results = index.query(
            vector=query_vector, 
            top_k=3, 
            include_metadata=True
        )
        
        # C. Build Context
        context_text = ""
        sources = []
        if results['matches']:
            for i, match in enumerate(results['matches']):
                meta = match['metadata']
                context_text += f"Case {i+1}: {meta.get('text', '')}\nAdvice: {meta.get('response', '')}\n\n"
                sources.append({"id": match['id'], "preview": meta.get('text', '')[:100]})
        else:
            context_text = "No similar cases found."

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
        - Bold key medication names.
        - Never mention "Context" or "Database" to the user; just say "Based on similar cases..."


        # --- HIDDEN INSTRUCTION FOR MAPS ---
        CRITICAL: At the very end, strictly on a new line, write "SEARCH_TYPE:" followed by one of these categories best suited for the symptoms: 
        [General, Dentist, Pharmacy, Cardiology, Orthopedics, Neurology, Ophthalmology, Dermatology, Pediatrics]. 
        If unsure, use "General".
        # -----------------------------------

        CONTEXT DATA:
        {context_text}
        """

        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": query_english}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5,
        )
        
        full_response = completion.choices[0].message.content

        # E. Extract Search Type
        search_type = "General" 
        clean_answer = full_response
        
        # Regex to find "SEARCH_TYPE: Cardiology" at the end
        match = re.search(r"SEARCH_TYPE:\s*([A-Za-z]+)", full_response)
        if match:
            search_type = match.group(1).strip()
            # Remove the tag so the user doesn't see it
            clean_answer = full_response.replace(match.group(0), "").strip()

        return jsonify({
            "answer": clean_answer,
            "sources": sources,
            "language": "en",
            "search_type": search_type 
        })

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- 2. Multilingual Text-to-Speech ---
@app.route('/api/speak', methods=['POST'])
def speak():
    try:
        data = request.json
        text = data.get('text', '')
        lang = data.get('lang', 'en') 
        
        if not text:
            return jsonify({"error": "No text provided"}), 400

        clean_lang = lang.split('-')[0] 
        
        try:
            tts = gTTS(text=text, lang=clean_lang)
        except ValueError:
            tts = gTTS(text=text, lang='en')

        audio_io = io.BytesIO()
        tts.write_to_fp(audio_io)
        audio_io.seek(0)

        return send_file(audio_io, mimetype='audio/mpeg')
    except Exception as e:
        print(f"TTS Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- 3. Voice-to-Text Endpoint ---
@app.route("/api/voicesearch", methods=["POST"])
def voice_search():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    try:
        audio_file = request.files["audio"]
        
        audio = AudioSegment.from_file(audio_file)
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)

        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_io) as source:
            recognizer.adjust_for_ambient_noise(source)
            audio_data = recognizer.record(source)
            # Google Speech Recog Auto-Detects language fairly well
            text = recognizer.recognize_google(audio_data)
            print(f"Transcribed: {text}")

        return jsonify({"transcribed_text": text})

    except Exception as e:
        print(f"Voice Error: {e}")
        return jsonify({"error": str(e)}), 500

def get_hospitals_from_overpass(lat, lng, radius=5000, hospital_type="General"):
    overpass_url = "https://overpass-api.de/api/interpreter"
    
    # 1. Base query for general hospitals (Always a safe fallback)
    base_tag = '["amenity"="hospital"]'

    # 2. Specific Mappings based on Symptoms
    # The AI decides the type, we just map it to OpenStreetMap tags here.
    if hospital_type == "Dentist": 
        base_tag = '["amenity"="dentist"]'
    elif hospital_type == "Pharmacy": 
        base_tag = '["amenity"="pharmacy"]'
    elif hospital_type == "Clinic": 
        base_tag = '["amenity"="clinic"]'
    elif hospital_type == "Pediatrics":
        # Look for clinics specifically tagged for children OR general hospitals
        base_tag = '["healthcare:speciality"="paediatrics"]'
    elif hospital_type == "Cardiology":
        base_tag = '["healthcare:speciality"="cardiology"]'
    elif hospital_type == "Dermatology":
        base_tag = '["healthcare:speciality"="dermatology"]'
    elif hospital_type == "Ophthalmology":
        base_tag = '["healthcare:speciality"="ophthalmology"]'
    elif hospital_type == "Neurology":
        base_tag = '["healthcare:speciality"="neurology"]'
    elif hospital_type == "Orthopedics":
        base_tag = '["healthcare:speciality"="orthopaedics"]'
    query = f"""
    [out:json][timeout:25];
    (
      node{base_tag}(around:{radius},{lat},{lng});
      way{base_tag}(around:{radius},{lat},{lng});
      relation{base_tag}(around:{radius},{lat},{lng});
      
      // OPTIONAL: Fallback to general hospitals if looking for a specialist
      // Remove these 3 lines if you ONLY want specific results
      node["amenity"="hospital"](around:{radius},{lat},{lng});
      way["amenity"="hospital"](around:{radius},{lat},{lng});
      relation["amenity"="hospital"](around:{radius},{lat},{lng});
    );
    out center;
    """
    
    try:
        response = requests.get(overpass_url, params={'data': query})
        data = response.json()
        
        results = []
        seen_ids = set() # To avoid duplicates from the fallback
        
        for element in data.get('elements', []):
            if element['id'] in seen_ids: continue
            seen_ids.add(element['id'])
            
            name = element.get('tags', {}).get('name', "Unknown Medical Facility")
            lat = element.get('lat') or element.get('center', {}).get('lat')
            lon = element.get('lon') or element.get('center', {}).get('lon')
            
            # Determine the display type (e.g. "Cardiology" vs "Hospital")
            # If the tag matches our specialist search, label it correctly.
            actual_type = "Hospital"
            if "dentist" in str(element.get('tags')): actual_type = "Dentist"
            elif "pharmacy" in str(element.get('tags')): actual_type = "Pharmacy"
            elif hospital_type.lower() in str(element.get('tags')).lower(): actual_type = hospital_type
            
            if lat and lon:
                results.append({
                    "id": element['id'],
                    "name": name,
                    "lat": lat,
                    "lng": lon,
                    "type": actual_type
                })
        
        return results[:15]
        
    except Exception as e:
        print(f"Overpass Error: {e}")
        return []

@app.route('/api/hospitals', methods=['POST'])
def find_hospitals():
    data = request.json
    lat = data.get('lat')
    lng = data.get('lng')
    hospital_type = data.get('type', 'General')
    
    if not lat or not lng:
        return jsonify({"error": "Location required"}), 400
        
    hospitals = get_hospitals_from_overpass(lat, lng, hospital_type=hospital_type)
    
    return jsonify({"hospitals": hospitals})

if __name__ == '__main__':
    app.run(port=5000, debug=True)