# Productivity AI Assistant

A FastAPI-based web application that provides AI-powered productivity assistance, personalized planning, and goal roadmapping.

## Features

- Chat interface for productivity-related questions
- Personalized productivity plan generation
- Detailed goal roadmapping
- Vector-based document search and retrieval
- Integration with Google's Gemini Pro model

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory with the following variables:
```
GOOGLE_API_KEY=your_google_api_key
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
DEBUG_MODE=False
```

5. Start the FastAPI server:
```bash
uvicorn src.services.api:app --reload
```

The application will be available at `http://localhost:8000`.

## API Endpoints

### Chat
- `POST /api/chat`
  - Request body: `{"message": "your question"}`
  - Returns AI response based on context

### Generate Plan
- `POST /api/generate-plan`
  - Request body: User profile information
  - Returns personalized productivity plan

### Generate Roadmap
- `POST /api/generate-roadmap`
  - Request body: `{"goal": "your goal", "timeframe": "timeframe"}`
  - Returns detailed roadmap for achieving the goal

### Health Check
- `GET /api/health`
  - Returns application status

## Architecture

The application consists of several key components:

1. **FastAPI Backend**
   - Handles HTTP requests and responses
   - Implements API endpoints
   - Manages CORS and security

2. **RAG System**
   - Integrates vector database and LLM
   - Handles document retrieval and response generation

3. **Vector Database**
   - Stores and retrieves document chunks
   - Uses FAISS for efficient similarity search
   - Implements TF-IDF vectorization

4. **LLM Integration**
   - Interfaces with Google's Gemini Pro model
   - Manages different types of prompts
   - Handles response generation

## Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
