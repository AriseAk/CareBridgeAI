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
git clone https://github.com/AriseAk/CareBridgeAI.git
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
python app.py
```

The script will run the backend for the website and the model named `./my-finetuned-medical-chatbot-pytorch` can be found from the model drive link.

---

Simultaneously run 
```bash
npm run dev
```
This runs the frontend and when run together provides access to the ai model where u can access the chat bot.


### Google Collab link - [https://colab.research.google.com/drive/1XD-kanrUy_kxT8efIEYsnkBEBNCFjvsH#scrollTo=UR_cAqXy9Gt5]
---

 ### Model link - https://drive.google.com/file/d/1Ut6hJh_EBfB_reEh2cZPxai834ng10_W/view?usp=sharing
