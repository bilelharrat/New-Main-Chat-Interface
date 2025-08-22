## 🏗️  Structure

```
MVP/
├── backend/                 # FastAPI backend server
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Data models and schemas
│   │   ├── services/       # Business logic services
│   │   ├── config.py       # Configuration settings
│   │   └── main.py         # FastAPI application entry point
│   └── requirements.txt    # Python dependencies
└── final_ui/              # React frontend application
    ├── src/
    │   ├── components/     # React components
    │   ├── context/        # React context providers
    │   ├── hooks/          # Custom React hooks
    │   └── utils/          # Utility functions
    └── package.json        # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **npm** or **yarn** (for frontend dependencies)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend/` directory with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GOOGLE_API_KEY=your_google_api_key_here
   MISTRAL_API_KEY=your_mistral_api_key_here
   FRONTEND_URL=http://localhost:3000
   ENVIRONMENT=development
   DEBUG=true
   ```

5. **Install additional system dependencies (if needed):**
   - **macOS:** `brew install tesseract poppler`
   - **Ubuntu/Debian:** `sudo apt-get install tesseract-ocr poppler-utils`
   - **Windows:** Download and install Tesseract from the official website

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd final_ui
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

The backend configuration is managed in `backend/app/config.py`. Key settings include:

- **CORS Origins:** Configured to allow connections from various frontend URLs
- **LLM Models:** Default models for each provider
- **Embedding Settings:** Configuration for text embedding
- **Retry Settings:** Error handling and retry logic

### Frontend Configuration

The frontend is configured to proxy API requests to the backend at `http://localhost:8000` (see `package.json` proxy setting).

## 🛠️ Development

### Backend Development

- **API Documentation:** Available at `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs:** Available at `http://localhost:8000/redoc` (ReDoc)
- **Logs:** Application logs are written to `app.log`

### Frontend Development

- **Hot Reload:** Enabled by default with React Scripts
- **Proxy:** API requests are automatically proxied to the backend
- **Build:** Use `npm run build` for production builds

## 📦 Dependencies

### Backend Dependencies

- **FastAPI:** Web framework for building APIs
- **Uvicorn:** ASGI server for running FastAPI
- **OpenAI/Anthropic/Google/Mistral:** LLM provider SDKs
- **PyPDF2/pdfplumber:** PDF processing
- **sentence-transformers:** Text embedding
- **transformers/torch:** Machine learning libraries
- **spacy:** Natural language processing

### Frontend Dependencies

- **React 18:** UI framework
- **Tailwind CSS:** Styling framework
- **React Quill:** Rich text editor
- **Lucide React:** Icon library
- **React Beautiful DnD:** Drag and drop functionality

## 🔑 API Keys Required

You'll need API keys from the following providers:

1. **OpenAI API Key** - For GPT models
2. **Anthropic API Key** - For Claude models  
3. **Google API Key** - For Gemini models
4. **Mistral API Key** - For Mistral models

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to:
- **Railway**
- **Render**
- **Heroku**
- **AWS/GCP/Azure**

### Frontend Deployment

The frontend can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors:** Ensure the frontend URL is added to `CORS_ORIGINS` in `config.py`
2. **PDF Processing Errors:** Install system dependencies (Tesseract, Poppler)
3. **API Key Errors:** Verify all API keys are set in the `.env` file
4. **Port Conflicts:** Change ports in the startup commands if needed

### Logs

- **Backend logs:** Check `app.log` in the backend directory
- **Frontend logs:** Check browser console and terminal output

## 📝 API Endpoints

The backend provides several endpoints:

- `/api/chat` - Main chat endpoint
- `/api/upload` - File upload endpoint
- `/api/summarize` - Document summarization
- `/api/telemetry` - Usage analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note:** Make sure to keep your API keys secure and never commit them to version control! 