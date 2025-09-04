# AskEden UI - Engineer Setup Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your API keys
touch .env
```

**Add to `.env` file:**
```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
DEBUG=true
```

**Start backend:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup

```bash
cd final_ui

# Install dependencies
npm install

# Start development server
npm start
```

### 3. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## 🔑 Required API Keys

You'll need to get your own API keys from:
1. **OpenAI** - https://platform.openai.com/api-keys
2. **Anthropic** - https://console.anthropic.com/
3. **Google AI** - https://makersuite.google.com/app/apikey
4. **Mistral** - https://console.mistral.ai/

## 📁 Project Structure

```
AskEden UI/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API routes
│   │   ├── models/   # Data models
│   │   ├── services/ # Business logic
│   │   └── main.py   # Entry point
│   └── requirements.txt
└── final_ui/         # React frontend
    ├── src/
    │   ├── components/
    │   ├── context/
    │   └── utils/
    └── package.json
```

## 🐛 Troubleshooting

- **CORS errors:** Check that frontend URL is in backend config
- **API errors:** Verify all API keys are set in `.env`
- **Port conflicts:** Change ports in startup commands

## 📞 Support

If you run into issues, check:
1. The main README.md file
2. Backend logs in terminal
3. Frontend console in browser dev tools









