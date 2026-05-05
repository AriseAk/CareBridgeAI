# CareBridgeAI - AI-Powered Humanitarian Platform

**CareBridgeAI** is a full-stack humanitarian platform connecting refugees, donors, and NGOs using AI. It features a medical chatbot powered by RAG (Retrieval-Augmented Generation), real-time hospital locator, voice search, and multilingual support.

🌐 **Live Demo**: [https://carebridgeai-peach.vercel.app](https://carebridgeai-peach.vercel.app)

---

## 🏗️ Architecture

```
Frontend  →  Vercel               (React + Vite + TailwindCSS)
Backend   →  HuggingFace Spaces   (Flask + Gunicorn)
Vector DB →  Pinecone             (Medical case embeddings)
LLM       →  Groq                 (LLaMA 3.3 70B)
```

---

## 🌍 Platform Features

### 🤖 AI Medical Chatbot (RAG-Powered)
- Describe your symptoms in **any language** and get relevant medical advice
- Uses **Retrieval-Augmented Generation (RAG)**:
  - `all-MiniLM-L6-v2` SentenceTransformer converts your query to a vector
  - **Pinecone** searches 250,000+ medical dialogue embeddings for similar cases
  - **Groq LLaMA 3.3 70B** generates a professional, empathetic response grounded in real doctor-patient cases
- Trained on the [ruslanmv/ai-medical-chatbot](https://huggingface.co/datasets/ruslanmv/ai-medical-chatbot) dataset
- Automatically detects the **specialist type** needed (General, Dentist, Cardiology, etc.)
- Always ends with a disclaimer to consult a real doctor

### 🗺️ Smart Hospital Locator
- Automatically recommends nearby hospitals based on your symptoms
- Uses **OpenStreetMap Overpass API** to find real medical facilities
- Supports specialist search: General, Dentist, Pharmacy, Cardiology, Orthopedics, Neurology, Ophthalmology, Dermatology, Pediatrics
- Falls back to a wider radius if no results found nearby
- Shows facilities on an interactive **Leaflet map** with Google Maps directions

### 🎤 Voice Search
- Speak your symptoms instead of typing
- Real-time **speech-to-text** using Google Speech Recognition
- Supports multiple languages with auto-detection

### 🔊 Text-to-Speech
- Listen to AI responses read aloud
- Multilingual TTS using **gTTS**
- Hover over any bot message and click the speaker icon to hear it

### 🌐 Multilingual Support
- Input in any language — auto-translated to English for processing
- Responses delivered back in the detected language
- Powered by **deep-translator**

### 💝 Donor Platform
- Secure one-time and monthly donation options
- Real-time impact tracking with progress bars
- Active causes: Emergency Relief, Education, Healthcare, Housing

### 🏢 NGO Hub
- NGO registration and partnership portal
- Resource management and donor connection tools
- AI-powered analytics dashboard
- Verified NGO network across 34 countries

### 💡 Dark/Light Mode
- Full dark and light theme support across all pages
- Smooth animated transitions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite | Build Tool |
| TailwindCSS 4 | Styling |
| React Router DOM | Navigation |
| React Leaflet | Interactive Maps |
| Lucide React | Icons |
| GSAP | Navbar Animations |

### Backend
| Technology | Purpose |
|---|---|
| Flask | Web Framework |
| Gunicorn | WSGI Server |
| SentenceTransformers | Query Embedding |
| Pinecone | Vector Database |
| Groq (LLaMA 3.3 70B) | LLM Response Generation |
| gTTS | Text-to-Speech |
| SpeechRecognition | Voice-to-Text |
| deep-translator | Multilingual Translation |
| Pydub + ffmpeg | Audio Processing |

---

## 📁 Project Structure

```
carebridgeai/
├── src/
│   ├── components/
│   │   ├── ChatBot.jsx        # AI chatbot + map UI
│   │   ├── Navbar.jsx         # Animated navbar
│   │   ├── Main.jsx           # Landing page
│   │   ├── Donor.jsx          # Donor platform
│   │   ├── Ngo.jsx            # NGO hub
│   │   ├── About.jsx          # About page
│   │   ├── Services.jsx       # Services page
│   │   ├── HospitalLocator.jsx# Hospital finder
│   │   └── useLocation.jsx    # Geolocation hook
│   ├── App.jsx
│   └── main.jsx
├── chat.py                    # Flask backend (RAG + APIs)
├── main.ipynb                 # Pinecone data upload notebook
├── Dockerfile                 # HuggingFace Spaces deployment
├── requirements.txt
└── README.md
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Pinecone account
- Groq API key

### Step 1 — Clone the Repository
```bash
git clone https://github.com/AriseAk/CareBridgeAI.git
cd CareBridgeAI
```

### Step 2 — Setup Backend
```bash
pip install -r requirements.txt
```

Create a `.env` file in the root:
```
PINECONE_API_KEY=your_pinecone_key
GROQ_API_KEY=your_groq_key
```

Run the backend:
```bash
python chat.py
```

### Step 3 — Setup Frontend
```bash
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

### Step 4 — Open in Browser
```
http://localhost:5173
```

---

## ☁️ Deployment

### Frontend — Vercel
1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Add environment variable:
```
VITE_API_URL = https://redinferno1736-carebridgeai-backend.hf.space
```
3. Deploy

### Backend — HuggingFace Spaces
1. Create a new Space at [huggingface.co/spaces](https://huggingface.co/spaces)
2. Select **Docker** → **Blank** → **CPU Basic**
3. Upload `chat.py`, `requirements.txt`, `Dockerfile`
4. Add secrets in Space Settings:
```
PINECONE_API_KEY = your_key
GROQ_API_KEY = your_key
```
5. Space URL: `https://your-username-carebridgeai-backend.hf.space`

---

## 🗄️ Dataset & Embeddings

The RAG system is powered by the [ruslanmv/ai-medical-chatbot](https://huggingface.co/datasets/ruslanmv/ai-medical-chatbot) dataset.

- Medical dialogues were cleaned, embedded using `all-MiniLM-L6-v2`
- Uploaded to Pinecone index `medical-bot`
- See `main.ipynb` for the full data pipeline

### Google Colab Training Notebook
[Open in Colab](https://colab.research.google.com/drive/1XD-kanrUy_kxT8efIEYsnkBEBNCFjvsH#scrollTo=UR_cAqXy9Gt5)

### Fine-tuned BART Model (local use only)
[Download from Google Drive](https://drive.google.com/file/d/1Ut6hJh_EBfB_reEh2cZPxai834ng10_W/view?usp=sharing)

> Note: The production deployment uses the RAG pipeline (`chat.py`). The fine-tuned BART model (`app.py`) is available for local experimentation only.

---

## 👥 Team

| Name |
|---|
| Prateek Raghavendra |
| Akshay Bhat |
| Pranav D P |

---


