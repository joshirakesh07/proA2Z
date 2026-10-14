from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager

from . import models
from .database import engine, get_db
from .routers import auth, profile, projects, ai_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup DB on startup
    models.Base.metadata.create_all(bind=engine)
    # Could optionally seed DB here
    yield
    pass

app = FastAPI(title="Project A-Z API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(ai_routes.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Project A-Z API"}
