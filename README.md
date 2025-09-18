# CareBridgeAI - AI Medical Chatbot

Welcome to the repository for the **CareBridgeAI Medical Chatbot**. This is the core AI component of the broader CareBridgeAI platform, a comprehensive system designed to provide immediate help, support, and vital information to those in need.

This chatbot is specifically fine-tuned on medical dialogues to understand patient descriptions and provide relevant, conversational responses, simulating a doctor's initial consultation.

---

### DataSet link-https://huggingface.co/datasets/ruslanmv/ai-medical-chatbot

## 🌍 Platform Vision

CareBridgeAI aims to be an all-in-one support ecosystem. While this repository focuses on the AI chatbot, the platform's planned features include:

- **AI Chatbot & Language Translator**: An intelligent assistant with voice and text capabilities to break down communication barriers.  
- **Emergency Services**: Immediate ambulance calling and recommendations for the nearest medical facilities based on the user's illness.  
- **Resource Locator**: A powerful search tool with budget filters to find the nearest NGOs, help centers, and refugee centers.  
- **Community & Support**:  
  - A registration interface for volunteers.  
  - A messaging system to connect users with help centers for pickup and support.  
  - A voluntary funding platform with filters for transparent donations.  
- **Environmental Awareness**: Suggestions for improving local cleanliness, garbage disposal, and managing street dogs.  
- **Reporting**: A feature to generate a summary of user interactions and reports.  

---

## 🤖 Model Details

The chatbot is a fine-tuned version of the **facebook/bart-base** model, a powerful sequence-to-sequence transformer. It has been trained on the AI Medical Chatbot dataset to specialize in understanding medical contexts.

- **Base Model**: facebook/bart-base  
- **Dataset**: ruslanmv/ai-medical-chatbot  
- **Task**: Conditional Generation (Text-to-Text)  
- **Input**: A combination of the illness description and the patient's dialogue.  
- **Output**: A conversational response mimicking a doctor's advice or questions.  

---

## ⚙️ Setting Up and Training the Model

Follow these steps to set up the environment, train the model, and create your own fine-tuned version.

### Step 1: Prerequisites
Ensure you have Python 3.8 or newer installed on your machine.

### Step 2: Clone the Repository (if applicable)
```bash
git clone <your-repository-url>
cd <your-repository-directory>
```

### Step 3: Install Dependencies
The required Python libraries are listed in the `requirements.txt` file. Install them using pip.

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt` file, create one with the following content:

```
pandas
torch
scikit-learn
transformers
datasets
accelerate
```

### Step 4: Run the Training Script
Save your Python code into a file named `train_chatbot.py`.

Run the script from your terminal:

```bash
python train_chatbot.py
```

The script will print progress updates. Once training is complete, the fine-tuned model and tokenizer will be saved in a new directory named `./my-finetuned-medical-chatbot-pytorch`.

---

## 🚀 Using the Trained Chatbot

After training, you can easily load your custom chatbot and use it to generate responses.

```python
from transformers import BartTokenizer, BartForConditionalGeneration

# Define the directory where your model is saved
SAVE_DIRECTORY = "./my-finetuned-medical-chatbot-pytorch"

# Load the fine-tuned model and tokenizer from the local directory
print("Loading the fine-tuned model...")
tokenizer = BartTokenizer.from_pretrained(SAVE_DIRECTORY)
model = BartForConditionalGeneration.from_pretrained(SAVE_DIRECTORY)
print("Model loaded successfully!")

# --- Create a sample input to test the chatbot ---
description = "Sore throat and headache"
patient_dialogue = "I woke up with a really bad sore throat and a pounding headache. I don't have a fever."
input_text = f"{description} {patient_dialogue}"

# --- Generate a response from the model ---
print("\nGenerating response...")
inputs = tokenizer(input_text, return_tensors='pt', max_length=512, truncation=True)
summary_ids = model.generate(
    inputs['input_ids'], 
    max_length=150, 
    num_beams=4, 
    early_stopping=True
)
response = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

# --- Print the results ---
print("-" * 30)
print("Patient says:", patient_dialogue)
print("\nDoctor's likely response:", response)
print("-" * 30)
```

---

 ### Model link - https://drive.google.com/file/d/1Ut6hJh_EBfB_reEh2cZPxai834ng10_W/view?usp=sharing