// --- DOM ELEMENTS ---
// Tab Buttons
const tabAnalyze = document.getElementById('tabAnalyze');
const tabRecommend = document.getElementById('tabRecommend');
const analyzeView = document.getElementById('analyze-view');
const recommendView = document.getElementById('recommend-view');

// Analyze View Elements
const uploadZone = document.getElementById('uploadZone');
const scanningZone = document.getElementById('scanningZone');
const resultsZone = document.getElementById('resultsZone');
const fileInput = document.getElementById('fileInput');
const scanningImage = document.getElementById('scanningImage');
const scanningStatus = document.getElementById('scanningStatus');
const resultImage = document.getElementById('resultImage');
const detectedText = document.getElementById('detectedText');
const sentimentBadge = document.getElementById('sentimentBadge');
const confidenceFill = document.getElementById('confidenceFill');
const confidenceValue = document.getElementById('confidenceValue');
const resetButton = document.getElementById('resetButton');

// Search View Elements
const vibeInput = document.getElementById('vibeInput');
const memeResultsGrid = document.getElementById('meme-results-grid');

let currentImageSrc = null;

// --- 1. TAB SWITCHING LOGIC ---
function switchTab(tabName) {
    if (tabName === 'analyze') {
        // Show Analyze, Hide Recommend
        analyzeView.classList.remove('hidden');
        recommendView.classList.add('hidden');
        
        // Update Buttons
        tabAnalyze.classList.add('active');
        tabRecommend.classList.remove('active');
    } else {
        // Show Recommend, Hide Analyze
        analyzeView.classList.add('hidden');
        recommendView.classList.remove('hidden');
        
        // Update Buttons
        tabAnalyze.classList.remove('active');
        tabRecommend.classList.add('active');
    }
}

// --- 2. RECOMMENDATION LOGIC (Find Meme) ---
async function getRecommendations() {
    const text = vibeInput.value;
    
    if(!text) {
        alert("Please describe a vibe first!");
        return;
    }

    // Show loading state
    memeResultsGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; width:100%; grid-column: 1/-1;">🧠 AI is searching for memes...</p>';

    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: text})
        });
        
        const data = await response.json();
        
        // Clear grid
        memeResultsGrid.innerHTML = ''; 
        
        if(data.memes && data.memes.length > 0) {
            data.memes.forEach(meme => {
                const img = document.createElement('img');
                img.src = meme.url;
                img.className = 'meme-thumb';
                img.alt = meme.name;
                // Optional: Open image in new tab on click
                img.onclick = () => window.open(meme.url, '_blank');
                memeResultsGrid.appendChild(img);
            });
        } else {
            memeResultsGrid.innerHTML = '<p style="text-align:center; width:100%;">No memes found. Try a different vibe!</p>';
        }
        
    } catch (error) {
        console.error(error);
        memeResultsGrid.innerHTML = '<p style="color:var(--negative); text-align:center; width:100%;">Error connecting to server.</p>';
    }
}

// --- 3. ANALYZE/UPLOAD LOGIC (Original) ---

// Event Listeners for Upload
if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.background = 'rgba(255, 255, 255, 0.05)';
    });

    uploadZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadZone.style.background = 'transparent';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.background = 'transparent';
        if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
    });
}

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) handleUpload(e.target.files[0]);
    });
}

if (resetButton) {
    resetButton.addEventListener('click', reset);
}

// Add 'Enter' key support for search
if (vibeInput) {
    vibeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getRecommendations();
    });
}

function handleUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageSrc = e.target.result;
        startAnalysis(file);
    };
    reader.readAsDataURL(file);
}

async function startAnalysis(file) {
    // UI Transition
    uploadZone.classList.add('hidden');
    scanningZone.classList.remove('hidden');
    scanningImage.src = currentImageSrc;
    scanningStatus.textContent = 'Extracting Text...';
    
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Server Error");
        const data = await response.json();

        scanningStatus.textContent = 'Analyzing Vibe...';
        setTimeout(() => displayResults(data), 800);

    } catch (error) {
        console.error(error);
        scanningStatus.textContent = 'Error: Could not analyze.';
        scanningStatus.style.color = '#FF3B30';
    }
}

function displayResults(data) {
    scanningZone.classList.add('hidden');
    resultsZone.classList.remove('hidden');
    
    resultImage.src = currentImageSrc;
    detectedText.textContent = data.text;
    
    // Format Sentiment
    const sentiment = data.sentiment;
    sentimentBadge.textContent = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
    sentimentBadge.className = `sentiment-badge ${sentiment}`;
    
    // Animate Confidence
    setTimeout(() => {
        confidenceFill.style.width = `${data.confidence}%`;
        confidenceValue.textContent = `${data.confidence}%`;
    }, 100);
}

function reset() {
    resultsZone.classList.add('hidden');
    uploadZone.classList.remove('hidden');
    fileInput.value = '';
    currentImageSrc = null;
    confidenceFill.style.width = '0%';
    confidenceValue.textContent = '0%';
    scanningStatus.style.color = 'var(--text-primary)';
}