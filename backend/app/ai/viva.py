import os
import json
import google.generativeai as genai

def generate_questions(title, description, technologies):
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return [
            {"question": "What is the main objective of this project?", "category": "Basic", "expected_answer": "To solve the problem described."},
            {"question": f"Why did you choose {technologies}?", "category": "Technical", "expected_answer": "Because it fits the requirements perfectly."}
        ]
        
    prompt = f"""
    You are a university professor conducting a project viva.
    Project: {title}
    Description: {description}
    Technologies: {technologies}
    
    Generate 5 distinct viva questions (mix of basic, technical, architecture, and difficult).
    Return ONLY a JSON array of objects with keys: question, category, expected_answer.
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

def evaluate_answer(question, expected, actual):
    if not os.environ.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") == "your_gemini_api_key_here":
        return {
            "score": 8.0,
            "feedback": "Good answer, but could be more detailed. (Fallback mode)"
        }
        
    prompt = f"""
    You are evaluating a student's answer in a project viva.
    Question: {question}
    Expected Answer context: {expected}
    Student's Answer: {actual}
    
    Evaluate the student's answer out of 10.
    Return ONLY a JSON object with keys: score (float 0-10), feedback (string with constructive criticism).
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
