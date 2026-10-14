from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date, Float, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

user_skills_table = Table(
    "user_skills",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True),
)

project_technologies_table = Table(
    "project_technologies",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("technology_name", String(100), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", secondary=user_skills_table, back_populates="users")


class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    college = Column(String(200))
    branch = Column(String(100))
    year = Column(String(50))
    interests = Column(Text)

    user = relationship("User", back_populates="profile")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)

    users = relationship("User", secondary=user_skills_table, back_populates="skills")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    problem_statement = Column(Text)
    solution = Column(Text)
    domain = Column(String(100))
    status = Column(String(50), default="Planning")  # Planning, In Progress, Testing, Completed
    start_date = Column(Date)
    expected_end_date = Column(Date)

    user = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
    viva_sessions = relationship("VivaSession", back_populates="project", cascade="all, delete-orphan")
    # simplified technologies relation for simplicity
    technologies = Column(Text) # Storing as comma-separated string for easier access, but relation exists too


class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    priority = Column(String(50), default="Medium") # Low, Medium, High
    status = Column(String(50), default="To Do") # To Do, In Progress, Completed
    due_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")


class ExistingProject(Base):
    __tablename__ = "existing_projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    domain = Column(String(100))
    source = Column(String(255))
    technologies = Column(Text)


class VivaSession(Base):
    __tablename__ = "viva_sessions"
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"))
    session_date = Column(DateTime, default=datetime.utcnow)
    overall_score = Column(Float, default=0.0)

    project = relationship("Project", back_populates="viva_sessions")
    questions = relationship("VivaQuestion", back_populates="session", cascade="all, delete-orphan")


class VivaQuestion(Base):
    __tablename__ = "viva_questions"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("viva_sessions.id", ondelete="CASCADE"))
    question = Column(Text, nullable=False)
    category = Column(String(100))
    expected_answer = Column(Text)
    
    # Store user answer directly here for simplicity
    user_answer = Column(Text)
    score = Column(Float)
    feedback = Column(Text)

    session = relationship("VivaSession", back_populates="questions")
