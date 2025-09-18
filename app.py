import os              
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import gridfs
from googletrans import Translator
import speech_recognition as sr
from pydub import AudioSegment
import io
from transformers import BartTokenizer, BartForConditionalGeneration
import torch

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")
client = MongoClient(os.getenv("MONGO_CLIENT"))
db = client['userinfo']
collection = db['users']
db = client["Audio"]
fs = gridfs.GridFS(db)

@app.route("/voicesearch", methods=["POST"])
def voice_search():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]

    audio = AudioSegment.from_file(audio_file)
    wav_io = io.BytesIO()
    audio.export(wav_io, format="wav")
    wav_io.seek(0)

    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_io) as source:
        audio_data = recognizer.record(source)
    try:
        text = recognizer.recognize_google(audio_data)
    except sr.UnknownValueError:
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError:
        return jsonify({"error": "Speech recognition service unavailable"}), 500

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

print("Loading model and tokenizer...")
MODEL_PATH = "./model/content/my-finetuned-medical-chatbot-pytorch"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = BartTokenizer.from_pretrained(MODEL_PATH)
model = BartForConditionalGeneration.from_pretrained(MODEL_PATH)
model.to(device)
model.eval() 
print("Model loaded successfully!")


def generate_response(prompt_text):
    inputs = tokenizer(
        prompt_text,
        max_length=512,
        truncation=True,
        return_tensors="pt"
    ).to(device)

    with torch.no_grad():
        summary_ids = model.generate(
            inputs.input_ids,
            num_beams=4,
            max_length=150,
            early_stopping=True
        )
    
    response = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return response

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        if not prompt:
            return jsonify({"error": "No prompt provided"}), 400
        
        response_text = generate_response(prompt)
        
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__== "__main__":
    app.run(debug=False)