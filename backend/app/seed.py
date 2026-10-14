from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models

models.Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    try:
        # Seed existing projects if empty
        if db.query(models.ExistingProject).count() == 0:
            projects = [
                models.ExistingProject(
                    title="AI Student Attendance System",
                    description="A facial recognition based attendance system using OpenCV and Python. It marks attendance automatically when students enter the classroom.",
                    domain="Computer Vision",
                    source="GitHub"
                ),
                models.ExistingProject(
                    title="Library Management System",
                    description="A web application to manage books, members, and issuing of books. Built using PHP and MySQL.",
                    domain="Web Development",
                    source="College Repo"
                ),
                models.ExistingProject(
                    title="Smart Agriculture IoT",
                    description="IoT based system using Arduino to monitor soil moisture and automatically trigger water pumps.",
                    domain="IoT",
                    source="GitHub"
                )
            ]
            db.add_all(projects)
            db.commit()
            print("Database seeded with sample projects.")
        else:
            print("Database already contains data.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
