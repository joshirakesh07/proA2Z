from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os

from .. import schemas, models, database
from ..dependencies import get_current_user
from ..ai import idea_generator, originality, technology_recommender, planner, viva

router = APIRouter()

@router.post("/ideas/generate")
def generate_ideas(request: schemas.IdeaRequest, current_user: models.User = Depends(get_current_user)):
    try:
        ideas = idea_generator.generate_project_ideas(request.skills, request.interests, request.domain, request.difficulty)
        return {"ideas": ideas}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")

@router.post("/originality/analyze", response_model=schemas.OriginalityResponse)
def analyze_originality(request: schemas.OriginalityRequest, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    try:
        existing_projects = db.query(models.ExistingProject).all()
        # Fallback empty check handled inside originality.py
        result = originality.analyze_project(request.title, request.description, existing_projects)
        return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")

@router.post("/technology/recommend")
def recommend_technology(request: schemas.TechRecommendRequest, current_user: models.User = Depends(get_current_user)):
    try:
        tech = technology_recommender.recommend_tech_stack(request.project_description, request.domain, request.skills)
        return {"recommendation": tech}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")

@router.post("/planner/generate")
def generate_plan(project_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    try:
        plan = planner.generate_project_plan(project.title, project.description, project.technologies)
        # Convert plan to actual tasks
        tasks_created = []
        for phase in plan.get('phases', []):
            for task_desc in phase.get('tasks', []):
                new_task = models.Task(
                    project_id=project.id,
                    title=f"[{phase['name']}] {task_desc}",
                    description="",
                    priority="Medium",
                    status="To Do"
                )
                db.add(new_task)
                tasks_created.append(new_task)
        db.commit()
        return {"message": "Plan generated successfully", "tasks_count": len(tasks_created)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")

@router.post("/viva/{project_id}/questions")
def generate_viva_questions(project_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    try:
        questions = viva.generate_questions(project.title, project.description, project.technologies)
        session = models.VivaSession(project_id=project.id)
        db.add(session)
        db.commit()
        db.refresh(session)
        
        for q in questions:
            vq = models.VivaQuestion(
                session_id=session.id,
                question=q['question'],
                category=q['category'],
                expected_answer=q['expected_answer']
            )
            db.add(vq)
        db.commit()
        
        saved_questions = db.query(models.VivaQuestion).filter(models.VivaQuestion.session_id == session.id).all()
        return {"session_id": session.id, "questions": saved_questions}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")

@router.post("/viva/evaluate/{question_id}")
def evaluate_viva_answer(question_id: int, request: schemas.VivaAnswerRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    question = db.query(models.VivaQuestion).join(models.VivaSession).join(models.Project).filter(models.VivaQuestion.id == question_id, models.Project.user_id == current_user.id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    try:
        evaluation = viva.evaluate_answer(question.question, question.expected_answer, request.answer)
        question.user_answer = request.answer
        question.score = evaluation['score']
        question.feedback = evaluation['feedback']
        db.commit()
        return evaluation
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI service is temporarily unavailable: {str(e)}")
