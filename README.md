# Project A-Z

Project A-Z is an AI-powered platform designed for college students developing academic and software projects. It provides a complete journey from ideation to viva preparation.

## Features
- **User Authentication**: Secure JWT-based registration and login.
- **Profile & Skills**: Manage user skills and interests.
- **AI Idea Generator**: Generate tailored project ideas using AI.
- **Originality Analyzer**: Check semantic similarity of your project against existing projects using NLP (Sentence Transformers).
- **Technology Recommender**: AI-driven tech stack recommendations based on project scope.
- **Project Workspace**: Manage active projects.
- **Task Management**: Create and track tasks.
- **AI Project Planner**: Automatically generate project phases and tasks.
- **AI Viva Prep**: Generate customized viva questions and evaluate answers with AI feedback.

## Technology Stack
- **Frontend**: React.js, Tailwind CSS, React Router, Vite, Axios
- **Backend**: Python, FastAPI, SQLAlchemy, JWT Authentication
- **Database**: SQLite (default for demo/testing), easily configurable to MySQL via `.env`
- **AI/ML**: Sentence Transformers (`all-MiniLM-L6-v2`), Gemini LLM API (via `google-generativeai`)

## Folder Structure
```
Project-A-Z/
├── frontend/          # React SPA
├── backend/           # FastAPI service
│   ├── app/           # Core API logic, Routers, Models, AI Modules
│   └── .env           # Environment Variables
├── docs/              # Additional Documentation
└── test_e2e.py        # End-to-end API test script
```

## Setup Instructions

### 1. Backend Setup
1. Open terminal and navigate to `backend/`.
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\Activate.ps1` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` from the provided example and add your `GEMINI_API_KEY`.
6. Run the database seed: `python app/seed.py`
7. Start the backend: `.\run_backend.ps1` (or `uvicorn app.main:app --reload`)
   - API will run at `http://localhost:8000`

### 2. Frontend Setup
1. Open another terminal and navigate to `frontend/`.
2. Install dependencies: `npm install`
3. Start the frontend: `.\run_frontend.ps1` (or `npm run dev`)
   - App will run at `http://localhost:5173`

## Environment Variables
Create `.env` in `backend/`:
```env
# Optional: Change to mysql+pymysql://user:pass@localhost:3306/db for MySQL
DATABASE_URL=sqlite:///./project_az.db
JWT_SECRET_KEY=supersecretkey_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=your_gemini_api_key_here
```

## Demo & Testing
Run `python test_e2e.py` from the root folder to execute an automated workflow simulating a user journey (Register -> Profile -> AI Ideas -> Originality -> Project -> Viva).
