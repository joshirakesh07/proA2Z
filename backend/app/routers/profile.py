from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import schemas, models, database
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=schemas.ProfileResponse)
def get_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/", response_model=schemas.ProfileResponse)
def update_profile(profile_in: schemas.ProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    profile = db.query(models.Profile).filter(models.Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    for var, value in vars(profile_in).items():
        if value is not None:
            setattr(profile, var, value)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/skills", response_model=List[schemas.SkillResponse])
def add_skills(skill_names: List[str], current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    for name in skill_names:
        skill = db.query(models.Skill).filter(models.Skill.name == name).first()
        if not skill:
            skill = models.Skill(name=name)
            db.add(skill)
            db.commit()
            db.refresh(skill)
        if skill not in current_user.skills:
            current_user.skills.append(skill)
    db.commit()
    db.refresh(current_user)
    return current_user.skills

@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill or skill not in current_user.skills:
        raise HTTPException(status_code=404, detail="Skill not found in user profile")
    current_user.skills.remove(skill)
    db.commit()
    return {"message": "Skill removed successfully"}
