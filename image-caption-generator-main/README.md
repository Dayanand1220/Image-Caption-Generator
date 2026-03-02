📷 Hybrid AI Image Caption Generator

A Hybrid Deep Learning and Generative AI Image Captioning System that generates accurate and creative captions for images.
This project combines a local deep learning model (BLIP) and Google Gemini AI to produce general and platform-specific captions such as Instagram, LinkedIn, and Facebook.

🚀 Features

📤 Upload images easily

🤖 AI-based caption generation

🧠 Hybrid AI Architecture

BLIP model for general captions

Gemini AI for creative captions

🎯 Platform-specific captions

Instagram

LinkedIn

Facebook

📏 Caption length control

Short

Medium

Long

⚡ Fast caption generation (5–10 seconds)

💻 User-friendly interface

📊 Caption history storage (MongoDB)

The system generates captions by combining deep learning and generative AI techniques for better accuracy and creativity. 


🧠 System Architecture

The system consists of three main components:

Frontend

React.js

Image upload interface

Caption customization options

Backend

Flask (Python)

Handles API requests

Controls AI model selection

AI Models
BLIP Model

Runs locally

Generates general captions

Fast and cost-free

Gemini AI

Cloud-based

Generates creative captions

Platform-specific captions

The backend decides which model to use based on user input. 


🛠️ Technologies Used
Programming Languages

Python

JavaScript

Frameworks

React.js

Flask

AI Libraries

PyTorch

Transformers

Database

MongoDB

APIs

Google Gemini API

Tools

OpenCV

JSON

Requests

These tools were used to build the full-stack caption generator system. 


📂 Project Structure
image-caption-generator/
│
├── frontend/           # React Application
│
├── backend/            # Flask Server
│
├── models/             # BLIP Model Files
│
├── database/           # MongoDB Config
│
├── app.py              # Main Flask App
│
├── requirements.txt
│
└── README.md
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/Chandan1303/image-caption-generator.git
cd image-caption-generator
2️⃣ Backend Setup

Install dependencies:

pip install -r requirements.txt

Run server:

python app.py
3️⃣ Frontend Setup
cd frontend
npm install
npm start
📷 How It Works

User uploads an image

User selects platform and caption length

Backend processes request

BLIP or Gemini generates caption

Caption displayed to user

The workflow includes hybrid routing between BLIP and Gemini models. 


📊 Example Output
General Caption
A photo of a cat laying in the grass.
Instagram Caption
Golden eyes on a green throne 🐱🌿
Ruling this garden one purr at a time.
#CatOfInstagram #GardenLife
👍 Advantages

Hybrid AI architecture

Cost-efficient

Fast response

Platform customization

Scalable system

👎 Limitations

Requires internet for Gemini captions

Local model captions are simpler

API costs for high usage

🔮 Future Improvements

🌎 Multi-language captions

📱 Mobile application

🎤 Voice caption feature

🧠 Personalized caption styles

🔥 Smart hashtag suggestions

📊 Caption analytics

These enhancements are planned to improve usability and functionality.
