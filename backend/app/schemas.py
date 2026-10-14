from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import date, datetime

# User Schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime
    class Config:
        orm_mode = True
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile Schemas
class ProfileUpdate(BaseModel):
    college: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[str] = None
    interests: Optional[str] = None

class ProfileResponse(ProfileUpdate):
    id: int
    user_id: int
    class Config:
        orm_mode = True
        from_attributes = True

class SkillBase(BaseModel):
    name: str

class SkillResponse(SkillBase):
    id: int
    class Config:
        orm_mode = True
        from_attributes = True

# Project Schemas
class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    solution: Optional[str] = None
    domain: Optional[str] = None
    technologies: Optional[str] = None
    status: Optional[str] = "Planning"

class ProjectResponse(ProjectCreate):
    id: int
    user_id: int
    start_date: Optional[date] = None
    expected_end_date: Optional[date] = None
    class Config:
        orm_mode = True
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "Medium"
    status: Optional[str] = "To Do"
    due_date: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None

class TaskResponse(TaskCreate):
    id: int
    project_id: int
    created_at: datetime
    class Config:
        orm_mode = True
        from_attributes = True

# AI Requests/Responses
class IdeaRequest(BaseModel):
    skills: List[str]
    interests: str
    domain: str
    difficulty: str

class OriginalityRequest(BaseModel):
    title: str
    description: str
    technologies: str

class OriginalityResponse(BaseModel):
    similarity_score: float
    originality_level: str
    analysis: str
    suggestions: List[str]

class TechRecommendRequest(BaseModel):
    project_description: str
    domain: str
    skills: List[str]

# Viva Schemas
class VivaQuestionResponse(BaseModel):
    id: int
    question: str
    category: str
    
    class Config:
        orm_mode = True
        from_attributes = True

class VivaAnswerRequest(BaseModel):
    answer: str

class VivaAnswerResponse(BaseModel):
    score: float
    feedback: str
