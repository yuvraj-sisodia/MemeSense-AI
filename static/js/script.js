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

let currentImageSrc = null;

// --- EVENTS ---
uploadZone.addEventListener('click', () => fileInput.click());
resetButton.addEventListener('click', reset);

fileInput.addEventListener('change', (e) => {
    if (e.target.files[0]) handleUpload(e.target.files[0]);
});

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

// --- LOGIC ---
function handleUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageSrc = e.target.result;
        startAnalysis(file);
    };
    reader.readAsDataURL(file);
}

async function startAnalysis(file) {
    // 1. UI Transition
    uploadZone.classList.add('hidden');
    scanningZone.classList.remove('hidden');
    scanningImage.src = currentImageSrc;
    scanningStatus.textContent = 'Extracting Text...';
    
    // 2. Prepare Data
    const formData = new FormData();
    formData.append('image', file);

    try {
        // 3. Send to Python
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Server Error");
        const data = await response.json();

        // 4. Show Results
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