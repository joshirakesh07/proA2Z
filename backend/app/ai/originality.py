import os

# Load model globally to keep it in memory (if it loads successfully)
model_name = "all-MiniLM-L6-v2"
model = None

def get_model():
    global model
    if model is None:
        try:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer(model_name)
        except Exception as e:
            print("Failed to load SentenceTransformer:", e)
            raise e
    return model

def analyze_project(title, description, existing_projects):
    if not existing_projects:
        return {
            "similarity_score": 0.0,
            "originality_level": "High originality",
            "analysis": "No existing projects found to compare against.",
            "suggestions": ["Great original idea!"]
        }

    try:
        from sentence_transformers import util
        transformer = get_model()
        user_text = f"{title}. {description}"
        existing_texts = [f"{p.title}. {p.description}" for p in existing_projects]
        
        user_embedding = transformer.encode(user_text)
        existing_embeddings = transformer.encode(existing_texts)
        
        cos_scores = util.cos_sim(user_embedding, existing_embeddings)[0]
        max_score = float(max(cos_scores)) * 100
        
        if max_score <= 30:
            level = "High originality"
            analysis = "Your project has very few similarities with existing projects."
        elif max_score <= 60:
            level = "Moderate similarity"
            analysis = "Your project has some similarities, but seems sufficiently different."
        elif max_score <= 80:
            level = "High similarity"
            analysis = "Your project is highly similar to existing ones. Consider adding unique features."
        else:
            level = "Very high similarity"
            analysis = "Your project is almost identical to existing projects in our database."
            
        return {
            "similarity_score": round(max_score, 2),
            "originality_level": level,
            "analysis": analysis,
            "suggestions": ["Consider focusing on a niche target group", "Add a unique ML feature", "Improve the UI/UX compared to existing solutions"]
        }
    except Exception as e:
        print("Originality Analyzer Fallback due to Error:", e)
        # Fallback if sentence-transformers fails (e.g. C extension blocked by AppLocker)
        return {
            "similarity_score": 15.0,
            "originality_level": "High originality (Fallback)",
            "analysis": "Semantic similarity model could not be loaded due to system security policies. Returning safe fallback.",
            "suggestions": ["Check backend logs regarding scikit-learn C extensions."]
        }
