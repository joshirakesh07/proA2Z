from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models, database
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    db_project = models.Project(**project.dict(), user_id=current_user.id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[schemas.ProjectResponse])
def get_projects(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Project).filter(models.Project.user_id == current_user.id).all()

@router.get("/{project_id}", response_model=schemas.ProjectResponse)
def get_project(project_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("/{project_id}/tasks", response_model=schemas.TaskResponse)
def create_task(project_id: int, task: schemas.TaskCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db_task = models.Task(**task.dict(), project_id=project.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/{project_id}/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(project_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id, models.Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.query(models.Task).filter(models.Task.project_id == project_id).all()

@router.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_update: schemas.TaskUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    task = db.query(models.Task).join(models.Project).filter(models.Task.id == task_id, models.Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for var, value in vars(task_update).items():
        if value is not None:
            setattr(task, var, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    task = db.query(models.Task).join(models.Project).filter(models.Task.id == task_id, models.Project.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
