// Video and message maps
const videoMap = {
    welcome: 'assets/avatar - Copy.mp4',
    'loan-type': 'assets/avatar - Copy.mp4',
    income: 'assets/avatar - Copy.mp4',
    amount: 'assets/avatar - Copy.mp4',
    documents: 'assets/avatar - Copy.mp4',
    approved: 'assets/approved.mp4',
    rejected: 'assets/rejected.mp4'
};

const messageMap = {
    welcome: "Hello! Welcome to BankBuddy, your AI-powered NeoBank. Let’s get started!",
    'loan-type': "What type of loan would you like to apply for today?",
    income: "Please share your monthly income to proceed.",
    amount: "Great! How much loan amount do you need?",
    documents: "Now, upload your KYC documents for AI verification.",
    approved: "Congratulations! Your loan is approved! Complete the smart form below.",
    rejected: "Sorry, your loan was rejected. Submit details for further review."
};

// State
let currentTab = 'welcome';
let userData = { loanType: '', income: '', loanAmount: '', result: '', financialHealthScore: 0 };
let docData = { documents: [], extractedData: {} };

// DOM elements
const avatarVideo = document.getElementById('avatar-video');
const avatarMessage = document.getElementById('avatar-message');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const progressFill = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const loanTypeVideo = document.getElementById('loan-type-video');
const incomeVideo = document.getElementById('income-video');
const amountVideo = document.getElementById('amount-video');
const documentsVideo = document.getElementById('documents-video');
const resultVideo = document.getElementById('result-video');
const loanTypeSelect = document.getElementById('loan-type-select');
const loanTypeBtn = document.getElementById('loan-type-btn');
const incomeRecordBtn = document.getElementById('income-record-btn');
const amountRecordBtn = document.getElementById('amount-record-btn');
const incomeUserVideo = document.getElementById('income-user-video');
const amountUserVideo = document.getElementById('amount-user-video');
const incomeInput = document.getElementById('income-input');
const amountInput = document.getElementById('amount-input');
const docCheckboxes = document.querySelectorAll('input[name="doc"]');
const docUpload = document.getElementById('doc-upload');
const submitDoc = document.getElementById('submit-doc');
const resultText = document.getElementById('result-text');
const loanEform = document.getElementById('loan-eform');
const healthScore = document.getElementById('health-score');
const loanComparison = document.getElementById('loan-comparison');
const notifications = document.getElementById('smart-notifications');
const faceRecognitionBtn = document.getElementById('face-recognition-btn');
const fingerprintBtn = document.getElementById('fingerprint-btn');
const loyaltyPoints = document.getElementById('loyalty-points');
const logo = document.getElementById('logo');

// Ensure logo loads
logo.onerror = () => {
    console.error('Logo failed to load. Check path: assets/logo - Copy.png');
    logo.src = 'assets/logo - Copy.png';
};

// Update UI
function updateUI() {
    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(currentTab).classList.add('active');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${currentTab}"]`).classList.add('active');

    avatarMessage.textContent = messageMap[currentTab];
    const progressSteps = { welcome: 16.67, 'loan-type': 33.33, income: 50, amount: 66.67, documents: 83.33, result: 100 };
    progressFill.style.width = `${progressSteps[currentTab]}%`;

    avatarVideo.volume = 1;
    if (currentTab === 'welcome') updateFinancialHealthScore();
    if (currentTab === 'loan-type') {
        loanTypeVideo.play();
        updateLoanComparison();
    }
    if (currentTab === 'income') incomeVideo.play();
    if (currentTab === 'amount') amountVideo.play();
    if (currentTab === 'documents') documentsVideo.play();
    if (currentTab === 'result') {
        resultVideo.src = videoMap[userData.result];
        resultVideo.volume = 1;
        resultVideo.play();
        resultText.textContent = userData.result === 'approved'
            ? `Approved! Your ${userData.loanType.charAt(0).toUpperCase() + userData.loanType.slice(1)} Loan of ₹${userData.loanAmount} is approved. Fill the form below.`
            : `Rejected: Your ${userData.loanType} loan didn’t meet criteria. Submit details for review.`;
        resultText.className = `result-text ${userData.result}`;
        loanEform.querySelector('[name="loanType"]').value = userData.loanType.charAt(0).toUpperCase() + userData.loanType.slice(1);
        loanEform.querySelector('[name="loanAmount"]').value = userData.loanAmount;
        loanEform.querySelector('[name="monthlyIncome"]').value = userData.income;
    }
}

// Tab switching
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        updateUI();
    });
});

// Record function with voice support
async function recordVideo(videoElement, button, callback) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoElement.srcObject = stream;
        button.textContent = 'Recording...';
        button.disabled = true;

        setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
            button.textContent = 'Record Again';
            button.disabled = false;
            callback();
        }, 3000);
    } catch (error) {
        console.error('Camera error:', error);
        alert('Camera access denied. Please type your response.');
    }
}

// AI Features
function updateFinancialHealthScore() {
    userData.financialHealthScore = userData.income ? Math.min(100, Math.floor(userData.income / 1000)) : 50;
    healthScore.textContent = `${userData.financialHealthScore}/100`;
    if (userData.financialHealthScore < 60) {
        notify('Tip: Increase your savings to boost your Financial Health Score!');
    }
}

function updateLoanComparison() {
    const loanType = loanTypeSelect.value;
    if (loanType) {
        loanComparison.innerHTML = `AI Suggestion: For a ${loanType} loan, consider <strong>Bank X (5.5%)</strong> or <strong>NBFC Y (6.0%)</strong>.`;
    }
}

function processDocuments() {
    const files = docUpload.files;
    if (files.length > 0) {
        docData.extractedData = {
            name: 'John Doe',
            dob: '1990-01-01',
            number: '123456789012',
            address: '123 Main St, City'
        }; // Simulated OCR
        notify('AI OCR: Documents processed successfully!');
        return true;
    }
    return false;
}

function checkFraud() {
    const random = Math.random();
    if (random < 0.1) {
        notify('Fraud Alert: Suspicious activity detected! Please verify your identity.');
        return false;
    }
    return true;
}

function notify(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notifications.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Event listeners
startBtn.addEventListener('click', () => {
    currentTab = 'loan-type';
    updateUI();
});

loanTypeBtn.addEventListener('click', () => {
    if (loanTypeSelect.value) {
        userData.loanType = loanTypeSelect.value;
        avatarMessage.textContent = `You’ve chosen a ${userData.loanType} loan. Let’s check your income next.`;
        setTimeout(() => {
            currentTab = 'income';
            updateUI();
        }, 2000);
    } else {
        avatarMessage.textContent = 'Please select a loan type first!';
    }
});

incomeRecordBtn.addEventListener('click', () => {
    recordVideo(incomeUserVideo, incomeRecordBtn, () => {
        userData.income = incomeInput.value || '50000';
        avatarMessage.textContent = `Noted! Your income is ₹${userData.income}. Now, how much do you need?`;
        setTimeout(() => {
            currentTab = 'amount';
            updateUI();
        }, 2000);
    });
});

amountRecordBtn.addEventListener('click', () => {
    recordVideo(amountUserVideo, amountRecordBtn, () => {
        userData.loanAmount = amountInput.value || '200000';
        avatarMessage.textContent = `Got it! You need ₹${userData.loanAmount} for your ${userData.loanType} loan. Let’s verify your documents.`;
        setTimeout(() => {
            currentTab = 'documents';
            updateUI();
        }, 2000);
    });
});

submitDoc.addEventListener('click', () => {
    docData.documents = Array.from(docCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
    if (docData.documents.length >= 2 && processDocuments() && checkFraud()) {
        checkEligibility();
        avatarMessage.textContent = messageMap[userData.result];
        setTimeout(() => {
            currentTab = 'result';
            updateUI();
        }, 2000);
    } else {
        avatarMessage.textContent = 'Please select at least 2 documents and upload files!';
    }
});

faceRecognitionBtn.addEventListener('click', () => {
    notify('AI Face Recognition: Verification successful!');
});

fingerprintBtn.addEventListener('click', () => {
    notify('Fingerprint Authentication: Access granted!');
});

// Eligibility check
function checkEligibility() {
    const income = parseInt(userData.income) || 0;
    const loanAmount = parseInt(userData.loanAmount) || 0;
    const age = calculateAge(docData.extractedData.dob);
    const requiredDocs = userData.loanType === 'home' || userData.loanType === 'factory' ? 3 : 2;

    userData.result = 'rejected';
    if (docData.documents.length >= requiredDocs && docData.extractedData.name && checkFraud()) {
        if (age >= 21 && age <= 60 && income >= 25000) {
            if (income > 2 * (loanAmount / 36) && loanAmount < 5 * income) {
                userData.result = 'approved';
                notify('Smart Contract: Loan agreement processed on blockchain.');
            }
        }
    }
}

function calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    return today.getFullYear() - birthDate.getFullYear();
}

// E-Form submission
loanEform.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loanEform);
    const data = Object.fromEntries(formData);
    console.log('Loan Application Submitted:', data);
    avatarMessage.textContent = userData.result === 'approved'
        ? 'Thank you! Your smart application is submitted via blockchain.'
        : 'Details submitted for review. We’ll get back to you soon.';
    notify('Transaction logged on blockchain. Loyalty Points: +50');
    loyaltyPoints.textContent = '100';
    alert('Form submitted successfully!');
});

// Initial setup
updateUI();
notify('Smart Notification: Welcome! Your EMI reminder is set.');