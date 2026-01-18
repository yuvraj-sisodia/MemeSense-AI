from flask import Flask, render_template, request, jsonify
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import requests
import random

app = Flask(__name__)

# --- INITIALIZE VADER (The Brain) ---
try:
    analyzer = SentimentIntensityAnalyzer()
except LookupError:
    nltk.download('vader_lexicon')
    analyzer = SentimentIntensityAnalyzer()

# --- LOGIC: REDDIT MEME FETCHING ---
def get_memes_by_sentiment(sentiment_score, user_text):
    """
    Fetches memes from Reddit via meme-api.com based on Context & Sentiment.
    """
    try:
        # 1. Determine Target Subreddit (Context Aware)
        subreddit = "memes" # Default fallback
        text_lower = user_text.lower()
        
        # Priority 1: Specific Topics
        if any(w in text_lower for w in ["code", "python", "bug", "error", "java", "dev", "linux"]):
            subreddit = "ProgrammerHumor"
        elif any(w in text_lower for w in ["cat", "dog", "pet", "animal", "cute"]):
            subreddit = "aww" 
        elif any(w in text_lower for w in ["school", "exam", "study", "student", "class", "teacher"]):
            subreddit = "school_memes"
        elif any(w in text_lower for w in ["work", "job", "boss", "office", "meeting"]):
            subreddit = "antiwork" 

        # Priority 2: Sentiment Vibe
        elif sentiment_score >= 0.2:
            # Positive Vibe -> Wholesome content
            subreddit = "wholesomememes"
        elif sentiment_score <= -0.2:
            # Negative Vibe -> Relatable struggle memes
            subreddit = "2meirl4meirl"
        else:
            # Neutral/Random -> Relatable general content
            subreddit = "me_irl"

        # 2. Fetch 50 memes from that subreddit
        # API: https://meme-api.com/gimme/{subreddit}/{count}
        url = f"https://meme-api.com/gimme/{subreddit}/50"
        response = requests.get(url, timeout=5).json()
        memes = response.get('memes', [])

        # 3. Filter out NSFW (Safety First for College Project!)
        safe_memes = [m for m in memes if not m.get('nsfw', False)]

        # 4. Return Top 6 matches
        return safe_memes[:6]

    except Exception as e:
        print(f"Reddit API Error: {e}")
        return []

# --- ROUTES ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/health')
def health():
    return jsonify({"status": "online"})

@app.route('/terms')
def terms():
    return render_template('terms.html')

# 1. FIND MEME ROUTE (Reddit Version)
@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.json
        user_text = data.get('text', '')
        
        # Get Score
        scores = analyzer.polarity_scores(user_text)
        compound = scores['compound']
        
        # Get Memes
        recommended_memes = get_memes_by_sentiment(compound, user_text)
        
        return jsonify({ 
            "success": True, 
            "sentiment_score": compound, 
            "memes": recommended_memes 
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. ANALYZE MEME ROUTE (Text Version for Client-Side OCR)
@app.route('/analyze_text', methods=['POST'])
def analyze_text():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text.strip():
            return jsonify({'text': '', 'sentiment': 'neutral', 'confidence': 0})
            
        scores = analyzer.polarity_scores(text)
        compound = scores['compound']
        
        if compound >= 0.05: sentiment = "positive"
        elif compound <= -0.05: sentiment = "negative"
        else: sentiment = "neutral"

        # Calculate logical confidence
        confidence = int(abs(compound) * 100)
        confidence = min(confidence + 15, 99) if confidence > 0 else 90

        return jsonify({
            'success': True,
            'text': text,
            'sentiment': sentiment,
            'confidence': confidence
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)