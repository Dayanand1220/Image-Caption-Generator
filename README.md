# 🤖 AI Image Caption Generator

A modern, full-stack web application that generates intelligent captions for images using AI models. Built with React frontend and Flask backend, supporting both local BLIP model and cloud-based Gemini API.

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![Flask](https://img.shields.io/badge/Flask-2.0+-green)

## ✨ Features

- **Dual AI Models**: BLIP (local) and Gemini API (cloud-based)
- **Platform-Specific Captions**: Instagram, Twitter, Facebook, LinkedIn optimized
- **Customizable Styles**: Casual, Professional, Creative, Funny tones
- **Length Control**: Short, Medium, Long caption options
- **Smart Hashtags**: Automatic hashtag generation
- **User Management**: Authentication and caption history
- **Modern UI**: Responsive design with dark theme
- **Drag & Drop**: Easy image upload interface

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (optional, for user data)
- Gemini API key (optional, for advanced features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dayanand1220/Image-Caption-Generator.git
cd image-caption-generator
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
python app_minimal.py  # For quick testing
# OR
python app.py  # For full features
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5123

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB (optional)
MONGO_URI=mongodb://localhost:27017/image_caption_db

# Gemini API (optional but recommended)
GEMINI_API_KEY=your_gemini_api_key_here

# Flask settings
FLASK_ENV=development
FLASK_DEBUG=True
```

### Getting API Keys

1. **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **MongoDB**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database

## 📱 Usage

1. **Upload Image**: Drag & drop or click to select an image
2. **Choose Preferences**: 
   - AI Model (BLIP/Gemini)
   - Platform (Instagram/Twitter/etc.)
   - Tone (Casual/Professional/etc.)
   - Length (Short/Medium/Long)
3. **Generate Caption**: Click "Generate Caption"
4. **Copy & Use**: Copy the generated caption to your clipboard

## 🏗️ Architecture

```
image-caption-generator/
├── frontend/          # React.js frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   └── App.js        # Main app
│   └── package.json
├── backend/           # Flask backend
│   ├── ai_core/          # AI model handlers
│   │   ├── blip_model.py     # BLIP implementation
│   │   └── gemini_caption.py # Gemini API
│   ├── routes/           # API endpoints
│   ├── app.py           # Main Flask app
│   └── requirements.txt
└── README.md
```

## 🚀 Deployment Options

### Option 1: Vercel + Railway (Recommended)
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway
- **Database**: MongoDB Atlas

### Option 2: Heroku
- Deploy both frontend and backend to Heroku
- Use Heroku Postgres or MongoDB Atlas

### Option 3: Docker
```bash
# Build and run with Docker
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [BLIP Model](https://github.com/salesforce/BLIP) by Salesforce
- [Google Gemini API](https://ai.google.dev/) for advanced AI capabilities
- [Hugging Face Transformers](https://huggingface.co/transformers/) for model integration

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/Dayanand1220/Image-Caption-Generator/issues) page
2. Create a new issue with detailed description
3. Join our [Discussions](https://github.com/Dayanand1220/Image-Caption-Generator/discussions)

---

⭐ **Star this repository if you found it helpful!**
