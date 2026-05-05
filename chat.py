import os
import io
import re
import requests
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

# 1. Setup App
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "https://carebridgeai-peach.vercel.app"
])

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
embedder.max_seq_length = 256

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
        # A. Translate to English
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

        match = re.search(r"SEARCH_TYPE:\s*([A-Za-z]+)", full_response)
        if match:
            search_type = match.group(1).strip()
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
            text = recognizer.recognize_google(audio_data)
            print(f"Transcribed: {text}")

        return jsonify({"transcribed_text": text})

    except Exception as e:
        print(f"Voice Error: {e}")
        return jsonify({"error": str(e)}), 500


# --- 4. Hospital Locator ---
OVERPASS_HEADERS = {
    "User-Agent": "CareBridgeAI/1.0 (humanitarian-aid-platform)",
    "Accept": "application/json"
}

# Try primary then fallback Overpass mirror
OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]


def build_overpass_query(lat, lng, radius, tag):
    return f"""
    [out:json][timeout:25];
    (
      node{tag}(around:{radius},{lat},{lng});
      way{tag}(around:{radius},{lat},{lng});
      relation{tag}(around:{radius},{lat},{lng});
    );
    out center;
    """


def run_overpass_query(query):
    """Try each Overpass mirror until one succeeds."""
    for url in OVERPASS_URLS:
        try:
            response = requests.get(
                url,
                params={"data": query},
                headers=OVERPASS_HEADERS,
                timeout=30
            )
            response.raise_for_status()

            text = response.text.strip()
            if not text:
                print(f"Overpass ({url}) returned empty response, trying next mirror...")
                continue

            data = response.json()
            return data.get("elements", [])

        except requests.exceptions.Timeout:
            print(f"Overpass ({url}) timed out, trying next mirror...")
        except requests.exceptions.HTTPError as e:
            print(f"Overpass ({url}) HTTP error: {e.response.status_code}, trying next mirror...")
        except ValueError as e:
            print(f"Overpass ({url}) JSON parse error: {e}, trying next mirror...")
        except Exception as e:
            print(f"Overpass ({url}) error: {e}, trying next mirror...")

    print("All Overpass mirrors failed.")
    return []


def parse_elements(elements, hospital_type):
    results = []
    seen_ids = set()

    for element in elements:
        if element["id"] in seen_ids:
            continue
        seen_ids.add(element["id"])

        name = element.get("tags", {}).get("name", "Unknown Medical Facility")
        lat = element.get("lat") or element.get("center", {}).get("lat")
        lon = element.get("lon") or element.get("center", {}).get("lon")

        if not lat or not lon:
            continue

        tags_str = str(element.get("tags", {})).lower()
        actual_type = "Hospital"
        if "dentist" in tags_str:
            actual_type = "Dentist"
        elif "pharmacy" in tags_str:
            actual_type = "Pharmacy"
        elif hospital_type.lower() in tags_str:
            actual_type = hospital_type

        results.append({
            "id": element["id"],
            "name": name,
            "lat": lat,
            "lng": lon,
            "type": actual_type
        })

    return results


def get_hospitals_from_overpass(lat, lng, radius=5000, hospital_type="General"):
    # Map hospital_type to OSM tag
    type_to_tag = {
        "Dentist":       '["amenity"="dentist"]',
        "Pharmacy":      '["amenity"="pharmacy"]',
        "Clinic":        '["amenity"="clinic"]',
        "Pediatrics":    '["healthcare:speciality"="paediatrics"]',
        "Cardiology":    '["healthcare:speciality"="cardiology"]',
        "Dermatology":   '["healthcare:speciality"="dermatology"]',
        "Ophthalmology": '["healthcare:speciality"="ophthalmology"]',
        "Neurology":     '["healthcare:speciality"="neurology"]',
        "Orthopedics":   '["healthcare:speciality"="orthopaedics"]',
    }
    general_tag = '["amenity"="hospital"]'
    primary_tag = type_to_tag.get(hospital_type, general_tag)

    # Run primary query
    query = build_overpass_query(lat, lng, radius, primary_tag)
    elements = run_overpass_query(query)
    results = parse_elements(elements, hospital_type)

    # If specialist search returned nothing, fall back to general hospitals
    if not results and primary_tag != general_tag:
        print(f"No {hospital_type} found within {radius}m, falling back to general hospitals...")
        fallback_query = build_overpass_query(lat, lng, radius, general_tag)
        fallback_elements = run_overpass_query(fallback_query)
        results = parse_elements(fallback_elements, "General")

    return results[:15]


@app.route('/api/hospitals', methods=['POST'])
def find_hospitals():
    data = request.json
    lat = data.get('lat')
    lng = data.get('lng')
    hospital_type = data.get('type', 'General')

    if not lat or not lng:
        return jsonify({"error": "Location required"}), 400

    hospitals = get_hospitals_from_overpass(lat, lng, radius=5000, hospital_type=hospital_type)

    # If still empty, widen radius to 10km and search general hospitals
    if not hospitals:
        print("No results in 5km, widening search to 10km...")
        hospitals = get_hospitals_from_overpass(lat, lng, radius=10000, hospital_type="General")

    return jsonify({"hospitals": hospitals})


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)