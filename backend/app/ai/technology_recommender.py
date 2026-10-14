import os
import json
import google.generativeai as genai

def recommend_tech_stack(project_description, domain, skills):
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return {
            "frontend": "React.js",
            "backend": "FastAPI",
            "database": "MySQL",
            "ai_ml": "Python/Scikit-learn",
            "reasoning": "Fallback reasoning: These are standard robust technologies."
        }
    
    prompt = f"""
    You are an expert software architect.
    Project Description: {project_description}
    Domain: {domain}
    User Skills: {', '.join(skills)}
    
    Recommend a technology stack for this project.
    Return ONLY a JSON object with keys: frontend, backend, database, ai_ml (if applicable), reasoning.
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
