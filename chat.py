import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from groq import Groq  # <--- CHANGED: New Library
from dotenv import load_dotenv

# 1. Setup App
app = Flask(__name__)
CORS(app)

# 2. Load Secrets
load_dotenv()
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY") # <--- CHANGED: Now looking for Groq Key

if not PINECONE_API_KEY or not GROQ_API_KEY:
    raise ValueError("❌ Missing API Keys. Please check your .env file for GROQ_API_KEY and PINECONE_API_KEY.")

# 3. Initialize Resources
print("🔌 Connecting to Pinecone...")
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index("medical-bot")

print("🧠 Loading Embedding Model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2', device='cpu') 

# <--- CHANGED: Initialize Groq Client
print("✨ Connecting to Groq...")
client = Groq(api_key=GROQ_API_KEY)

print("✅ Server Ready (Powered by Llama 3 on Groq)!")

@app.route('/predict', methods=['POST'])
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    # Handle both frontend variable names (query or prompt)
    user_query = data.get('query') or data.get('prompt')
    
    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # A. Search Pinecone
        query_vector = embedder.encode(user_query).tolist()
        results = index.query(
            vector=query_vector, 
            top_k=3, 
            include_metadata=True
        )
        
        # B. Build Context
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
            context_text = "No similar cases found."

        # C. Generate with Groq
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

        CONTEXT DATA:
        {context_text}
        """

        # <--- CHANGED: Groq API Call
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="llama-3.3-70b-versatile", # The latest stable model
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