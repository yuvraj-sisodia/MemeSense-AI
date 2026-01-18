# MemeSense AI
> **Your Vibe, Visualized.** An intelligent meme discovery engine powered by Sentiment Analysis and Context-Aware Contextual Routing.

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Python](https://img.shields.io/badge/Backend-Flask-blue)
![Javascript](https://img.shields.io/badge/Frontend-Vanilla%20JS-yellow)
![OCR](https://img.shields.io/badge/OCR-Tesseract.js-green)

## About The Project
MemeSense AI is a **Project** designed to demonstrate the application of Data Science concepts in a modern web application. Unlike static search engines, MemeSense uses **Natural Language Processing (NLP)** to understand the *sentiment* and *context* behind a user's text to recommend topically relevant memes from Reddit.

It also features a **Privacy-First Optical Character Recognition (OCR)** system that allows users to analyze existing memes directly in their browser without uploading images to a server.

### Key Features
* ** Context-Aware Search:** Analyzes user input (e.g., "I hate coding errors") to dynamically route requests to specific communities (e.g., `r/ProgrammerHumor`) instead of generic databases.
* ** VADER Sentiment Analysis:** Uses NLTK's VADER lexicon to calculate a compound emotion score (Positive/Negative/Neutral) for accurate "Vibe Matching."
* ** Client-Side OCR:** Implements **Edge Computing** using `Tesseract.js`. Images are processed in the user's browser, ensuring zero server latency and 100% data privacy.
* ** Real-Time Health Check:** Includes a live backend status indicator to verify API availability.
* ** Glassmorphism UI:** A modern, responsive interface inspired by Apple's design system.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Python (Flask) | API Logic, NLP (VADER), Dynamic Routing |
| **Frontend** | HTML5, CSS3, JS | UI/UX, Async Fetch Requests |
| **OCR Engine** | Tesseract.js (v4) | Client-side text extraction (WASM) |
| **External API** | Reddit (Meme-API) | Fetching live, trending content |
| **Deployment** | Vercel | Serverless hosting |

---

##  Getting Started (Run Locally)

Follow these steps to run the project on your machine for development or presentation.

### Prerequisites
* Python 3.7+
* Git

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/MemeSense-AI.git](https://github.com/YOUR_USERNAME/MemeSense-AI.git)
    cd MemeSense-AI
    ```

2.  **Create a Virtual Environment (Optional but Recommended)**
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # Mac/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Application**
    ```bash
    python app.py
    ```

5.  **Access the App**
    Open your browser and navigate to: `http://127.0.0.1:5000`

---

## Deployment
This project is optimized for **Vercel** (No Docker required).

1.  Push your code to GitHub.
2.  Import the repository on Vercel.
3.  Vercel will auto-detect the `vercel.json` and deploy.
4.  **Live Link:** [Insert Your Vercel Link Here]

---

## API Reference

### 1. Find Memes
**Endpoint:** `POST /recommend`
* **Description:** Analyzes text sentiment and fetches relevant memes from Reddit.
* **Body:** `{"text": "I passed my exams!"}`
* **Response:** JSON object containing sentiment score and a list of 6 meme URLs.

### 2. Analyze Text (OCR Backend)
**Endpoint:** `POST /analyze_text`
* **Description:** Receives text extracted by the browser and returns sentiment analysis.
* **Body:** `{"text": "extracted text from image..."}`
* **Response:** JSON object with sentiment label (Positive/Negative) and confidence score.

### 3. System Health
**Endpoint:** `GET /health`
* **Description:** Lightweight ping to check if the backend is online.
* **Response:** `{"status": "online"}`

---

## Project Structure

```text
MemeSense-AI/
├── static/
│   ├── css/
│   │   └── styles.css       # Glassmorphism Styles
│   ├── js/
│   │   └── script.js        # Logic for OCR & API calls
│   └── favicon.png
├── templates/
│   ├── index.html           # Main Dashboard
│   └── terms.html           # Privacy Policy
├── app.py                   # Flask Backend (The Brain)
├── requirements.txt         # Python Dependencies
├── vercel.json              # Deployment Config
└── README.md                # Documentation