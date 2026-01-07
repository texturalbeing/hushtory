// Get elements
const letterInput = document.getElementById('letterInput');
const saveBtn = document.getElementById('saveBtn');
const lettersList = document.getElementById('lettersList');

// Load letters when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadLetters();
    initializeTextarea();
});

// Save button click
saveBtn.addEventListener('click', saveLetter);

// Allow Ctrl/Cmd + Enter to save
letterInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        saveLetter();
    }
});

// Initialize textarea with greeting and closing
function initializeTextarea() {
    const placeholderText = 'Write the note from Love here.';

    // Focus on the textarea when clicked and select the placeholder text
    letterInput.addEventListener('focus', function() {
        if (this.value.includes(placeholderText)) {
            const startPos = this.value.indexOf(placeholderText);
            const endPos = startPos + placeholderText.length;
            this.setSelectionRange(startPos, endPos);
        }
    });

    // Position cursor at the placeholder text on load
    const text = letterInput.value;
    if (text.includes(placeholderText)) {
        const startPos = text.indexOf(placeholderText);
        const endPos = startPos + placeholderText.length;
        letterInput.setSelectionRange(startPos, endPos);
    }
}

// Reset textarea to initial state
function resetTextarea() {
    letterInput.value = `Dear Jo,

Write the note from Love here.

Infinitely yours,
L🩷ve`;
    const placeholderText = 'Write the note from Love here.';
    const startPos = letterInput.value.indexOf(placeholderText);
    const endPos = startPos + placeholderText.length;
    letterInput.setSelectionRange(startPos, endPos);
    letterInput.focus();
}

function saveLetter() {
    const content = letterInput.value.trim();

    if (content === '') {
        alert('Please write something before saving!');
        return;
    }

    // Get existing letters from localStorage
    const letters = getLettersFromStorage();

    // Create new letter object
    const newLetter = {
        id: Date.now(),
        date: new Date().toISOString(),
        content: content
    };

    // Add to beginning of array (most recent first)
    letters.unshift(newLetter);

    // Save to localStorage
    localStorage.setItem('lettersFromLove', JSON.stringify(letters));

    // Reset textarea to initial state
    resetTextarea();

    // Reload display
    loadLetters();

    // Show confirmation
    showConfirmation();
}

function loadLetters() {
    const letters = getLettersFromStorage();

    if (letters.length === 0) {
        lettersList.innerHTML = '<p class="empty-state">No letters yet. Write your first letter above!</p>';
        return;
    }

    // Clear list
    lettersList.innerHTML = '';

    // Display each letter
    letters.forEach(letter => {
        const letterCard = createLetterCard(letter);
        lettersList.appendChild(letterCard);
    });
}

function createLetterCard(letter) {
    const card = document.createElement('div');
    card.className = 'letter-card';

    const date = new Date(letter.date);
    const dateString = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="letter-date">${dateString}</div>
        <div class="letter-content">${escapeHtml(letter.content)}</div>
        <button class="delete-btn" onclick="deleteLetter(${letter.id})">Delete</button>
    `;

    return card;
}

function deleteLetter(id) {
    if (!confirm('Are you sure you want to delete this letter?')) {
        return;
    }

    let letters = getLettersFromStorage();
    letters = letters.filter(letter => letter.id !== id);
    localStorage.setItem('lettersFromLove', JSON.stringify(letters));
    loadLetters();
}

function getLettersFromStorage() {
    const stored = localStorage.getItem('lettersFromLove');
    return stored ? JSON.parse(stored) : [];
}

function showConfirmation() {
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Letter Saved! ✓';
    saveBtn.style.background = '#27ae60';

    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '#d4a5a5';
    }, 2000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
