import os
import json
import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

def generate_project_ideas(skills, interests, domain, difficulty):
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your_gemini_api_key_here":
        # Fallback response
        return [
            {
                "title": f"{domain} Helper System",
                "problem_statement": "Students need help with this domain.",
                "proposed_solution": "A web app to manage tasks.",
                "main_features": ["User login", "Dashboard", "Reports"],
                "target_users": "Students",
                "recommended_technology_stack": "React, FastAPI",
                "difficulty": difficulty,
                "expected_outcome": "Working prototype",
                "possible_future_enhancements": "AI integration"
            }
        ]
    
    prompt = f"""
    You are an expert project mentor. Based on these details:
    Skills: {', '.join(skills)}
    Interests: {interests}
    Domain: {domain}
    Difficulty: {difficulty}
    
    Generate 3 distinct, practical academic project ideas.
    Return ONLY a JSON array of objects with the following keys:
    title, problem_statement, proposed_solution, main_features, target_users, recommended_technology_stack, difficulty, expected_outcome, possible_future_enhancements.
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
