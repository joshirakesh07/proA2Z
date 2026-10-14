import os
import json
import google.generativeai as genai

def generate_project_plan(title, description, technologies):
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return {
            "phases": [
                {"name": "Phase 1 - Planning", "tasks": ["Requirements gathering", "System design"]},
                {"name": "Phase 2 - Development", "tasks": ["Backend API", "Frontend UI"]},
                {"name": "Phase 3 - Testing", "tasks": ["Unit testing", "User acceptance testing"]}
            ]
        }
    
    prompt = f"""
    You are an expert project manager.
    Project: {title}
    Description: {description}
    Technologies: {technologies}
    
    Create a detailed project plan with phases and tasks.
    Return ONLY a JSON object with a single key 'phases', which is an array of objects. 
    Each object should have 'name' (string) and 'tasks' (array of strings).
    """
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content(prompt)
    try:
        text = response.text
        if text.startswith("```json"):
            text = text[7:-3]
        return json.loads(text)
    except Exception as e:
        print("Error parsing Gemini response:", e)
        raise e
