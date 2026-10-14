import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def run_test():
    print("--- Starting E2E Test ---")
    
    # 1. Register
    print("1. Registering User...")
    email = f"testuser_{int(time.time())}@example.com"
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Test User",
        "email": email,
        "password": "password123"
    })
    assert res.status_code == 200
    print("Registration successful.")

    # 2. Login
    print("2. Logging In...")
    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": email,
        "password": "password123"
    })
    assert res.status_code == 200
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 3. Profile & Skills
    print("3. Updating Profile and Skills...")
    res = requests.put(f"{BASE_URL}/profile", json={"college": "Demo College", "interests": "AI, Web"}, headers=headers)
    assert res.status_code == 200
    res = requests.post(f"{BASE_URL}/profile/skills", json=["Python", "React", "FastAPI"], headers=headers)
    assert res.status_code == 200
    print("Profile & Skills updated.")

    # 4. Generate Ideas
    print("4. Generating Ideas (AI)...")
    res = requests.post(f"{BASE_URL}/ai/ideas/generate", json={
        "skills": ["Python", "React"],
        "interests": "AI",
        "domain": "Education",
        "difficulty": "Medium"
    }, headers=headers)
    assert res.status_code == 200
    ideas = res.json()["ideas"]
    print(f"Generated {len(ideas)} ideas.")

    # 5. Check Originality
    print("5. Checking Originality (AI)...")
    idea = ideas[0]
    res = requests.post(f"{BASE_URL}/ai/originality/analyze", json={
        "title": idea["title"],
        "description": idea["problem_statement"],
        "technologies": idea["recommended_technology_stack"]
    }, headers=headers)
    assert res.status_code == 200
    print(f"Originality Score: {res.json()['similarity_score']}%")

    # 6. Tech Recommendation
    print("6. Tech Recommendation (AI)...")
    res = requests.post(f"{BASE_URL}/ai/technology/recommend", json={
        "project_description": idea["problem_statement"],
        "domain": "Education",
        "skills": ["Python", "React"]
    }, headers=headers)
    assert res.status_code == 200
    print(f"Tech Recommended: {res.json()['recommendation']}")

    # 7. Create Project
    print("7. Creating Project Workspace...")
    res = requests.post(f"{BASE_URL}/projects", json={
        "title": idea["title"],
        "description": idea["problem_statement"],
        "domain": "Education",
        "technologies": "React, FastAPI"
    }, headers=headers)
    assert res.status_code == 200
    project_id = res.json()["id"]
    print("Project Workspace created.")

    # 8. Generate Plan
    print("8. Generating Project Plan (AI)...")
    res = requests.post(f"{BASE_URL}/ai/planner/generate?project_id={project_id}", headers=headers)
    assert res.status_code == 200
    print("Project plan generated.")

    # 9. Manage Tasks
    print("9. Managing Tasks...")
    res = requests.get(f"{BASE_URL}/projects/{project_id}/tasks", headers=headers)
    assert res.status_code == 200
    tasks = res.json()
    if tasks:
        task_id = tasks[0]["id"]
        res = requests.put(f"{BASE_URL}/tasks/{task_id}", json={"status": "Completed"}, headers=headers)
        assert res.status_code == 200
        print("Task marked as completed.")

    # 10. Viva Prep
    print("10. Generating Viva Questions (AI)...")
    res = requests.post(f"{BASE_URL}/ai/viva/{project_id}/questions", headers=headers)
    assert res.status_code == 200
    viva_questions = res.json()["questions"]
    print(f"Generated {len(viva_questions)} viva questions.")
    
    if viva_questions:
        q_id = viva_questions[0]["id"]
        print("11. Evaluating Viva Answer (AI)...")
        res = requests.post(f"{BASE_URL}/ai/viva/evaluate/{q_id}", json={"answer": "I chose these technologies because they are modern and scalable."}, headers=headers)
        assert res.status_code == 200
        print(f"Viva evaluation received: Score {res.json()['score']}/10")

    print("--- E2E Test Completed Successfully! ---")

if __name__ == "__main__":
    run_test()
