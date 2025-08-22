# Eden AI Interface - Final UI

This is the final UI for the Eden AI Interface, featuring hierarchical summarization, EVES mode, and file upload capabilities.

## Features

- **File Upload**: Upload PDF documents for processing
- **Hierarchical Summarization**: Multi-LLM recursive summarization
- **EVES Mode**: Eden Verification and Encryption System
- **Multiple Modes**: Auto Selection, EVES, Large Document Analysis, Coding, etc.
- **Real-time Processing**: Live feedback during document processing
- **Backend Integration**: Connected to hierarchical summarizer backend

## Backend Connection

The frontend is configured to connect to the backend running on **port 8000**.

### Configuration

- **API Base URL**: `http://localhost:8000`
- **Proxy**: Configured in `package.json` for development
- **CORS**: Backend configured to accept requests from `http://localhost:3000`

### Backend Status

The UI includes a backend status indicator in the top-right corner:
- 🟢 **Green**: Backend connected successfully
- 🔴 **Red**: Backend offline
- 🟡 **Yellow**: Connection error
- ⚪ **Gray**: Connecting...

## Getting Started

### Prerequisites

1. Backend running on port 8000
2. Node.js and npm installed

### Installation

```bash
cd final_ui
npm install
```

### Development

```bash
npm start
```

The application will start on `http://localhost:3000` and automatically connect to the backend on port 8000.

### Usage

1. **Upload a PDF**: Click the "Upload PDF" button in the input area
2. **Enter a prompt**: Type your analysis request
3. **Select a mode**: Choose from available modes (EVES, Auto Selection, etc.)
4. **Process**: The system will use the hierarchical summarizer to analyze your document

## API Endpoints

The frontend connects to these backend endpoints:

- `POST /hierarchical-summarize` - Process PDF documents
- `POST /chat` - Text-only conversations
- `GET /health` - Backend health check
- `GET /system-status` - Hierarchical summarizer status

## File Upload

- **Supported format**: PDF only
- **Maximum size**: 50MB
- **Features**: Drag & drop, progress tracking, error handling

## Modes

### Hierarchical Summarizer Modes
These modes are connected to the hierarchical summarizer endpoint and will trigger multi-LLM processing when a file is uploaded:

- **EVES**: Eden Verification and Encryption System - Enhanced accuracy verification and consistency checking
- **Large Document Analysis**: Comprehensive document analysis with hierarchical summarization for large documents
- **Academic Research**: Research-focused analysis with academic rigor and citation emphasis
- **Finance**: Financial analysis with risk assessment and market insights
- **General**: General-purpose analysis suitable for diverse content
- **Enterprise Model**: Enterprise-level insights with strategic business focus

### Other Modes
- **Auto Selection**: Default mode for general queries
- **Coding**: Code-focused analysis and generation (with code execution environment)

### Visual Indicators
- **Blue dot**: Hierarchical summarizer modes are marked with a blue indicator
- **"HS" label**: Mode menu shows "HS" for hierarchical summarizer modes
- **Ready indicator**: Shows "Hierarchical Summarizer Ready" when file + hierarchical mode + prompt are ready

## Troubleshooting

### Backend Connection Issues

1. Ensure backend is running on port 8000
2. Check CORS configuration in backend
3. Verify network connectivity
4. Check browser console for error messages

### File Upload Issues

1. Ensure file is PDF format
2. Check file size (max 50MB)
3. Verify backend file processing endpoints
4. Check network connectivity

## Development

### Project Structure

```
final_ui/
├── src/
│   ├── components/
│   │   ├── Views/
│   │   │   ├── PromptConsole.jsx    # Main chat interface
│   │   │   └── FileUpload.jsx       # File upload component
│   │   └── ...
│   ├── utils/
│   │   ├── api.js                   # API utilities
│   │   └── testConnection.js        # Connection testing
│   └── ...
└── package.json
```

### Key Components

- **PromptConsole**: Main interface with file upload and mode selection
- **FileUpload**: Modal component for PDF upload
- **API Utilities**: Connection to backend services
- **Theme System**: Dark/light mode and accent colors

## Environment Variables

- `REACT_APP_API_URL`: Override backend URL (default: http://localhost:8000)

## Contributing

1. Ensure backend is running on port 8000
2. Test file upload functionality
3. Verify all modes work correctly
4. Check backend connection status indicator # AskEden-Timeline-recovery
