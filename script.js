const quoteBox = document.querySelector('.quote-box');
const quoteText = quoteBox.querySelector('#quote-text');
const quoteAuthor = quoteBox.querySelector('#quote-author');
const newQuoteButton = quoteBox.querySelector('#new-quote');
const copyQuoteButton = quoteBox.querySelector('#copy-quote');
const characterSelect = quoteBox.querySelector('#character-select');
const toggle = document.querySelector('#dark-toggle');
const themeIcon = document.getElementById('theme-icon');
const shareButton = document.querySelector('#share-bluesky');

toggle.checked = false;
let currentQuote = null;
let currentCharacter = null;
let currentCharacterId = null;

loadCharacters();

function displayQuote(quote) {
    quoteText.classList.remove('fade-in');
    quoteAuthor.classList.remove('fade-in');

    void quoteText.offsetWidth; // Force reflow to reset animation.

    currentQuote = quote;

    quoteText.textContent = `"${currentQuote}"`;
    quoteAuthor.textContent = `"${currentCharacter}"`;

    requestAnimationFrame(() => {
        quoteText.classList.add('fade-in');
        quoteAuthor.classList.add('fade-in');
    });
}

async function fetchRandomQuote(e) {
   const id = e.target.value ? e.target.value : currentCharacterId;
   currentCharacterId = id;
   if (!currentCharacterId) return;

    try {
        const response = await fetch(`/.netlify/functions/getQuotes?characterId=${currentCharacterId}`);
        if (!response.ok) throw new Error(`HTTP error status: ${error.status}`);
        const data = await response.json();

        if (data.docs.length === 0) {
            quoteText.textContent = `No quotes found for ${currentCharacter}.`;
            quoteAuthor.textContent = '';
            return;
        }

        const randomQuote = data.docs[Math.floor(Math.random() * data.docs.length)].dialog;
        displayQuote(randomQuote);
    } catch (error) {
        quoteText.textContent = '⚠️ Failed to load quote';
        quoteAuthor.textContent = '';
        console.log(`Error loading quote: ${error}`);
    }
}

async function loadCharacters() {
    const response = await fetch('/.netlify/functions/getCharacters');
    const data = await response.json();

    data.docs.forEach(character => {
        const option = document.createElement('option');
        option.value = character._id;
        option.textContent = character.name;
        characterSelect.appendChild(option);
    });
}

newQuoteButton.addEventListener('click', (e) => { 
    fetchRandomQuote(e);
    const characterIndex = e.target.selectedIndex;
    currentCharacter = e.target.options[characterIndex].textContent;
});
characterSelect.addEventListener('change', (e) => { 
    fetchRandomQuote(e);
    const characterIndex = e.target.selectedIndex;
    currentCharacter = e.target.options[characterIndex].textContent;
});

copyQuoteButton.addEventListener('click', () => {
    if (currentQuote) {
        const textToCopy = `"${currentQuote}" - ${currentCharacter}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                copyQuoteButton.textContent = 'Copied!';
                setTimeout(() => copyQuoteButton.textContent = 'Copy', 1500);
            });
    }
});

toggle.addEventListener('change', () => {
  const isDark = toggle.checked;
  document.body.classList.toggle('dark', isDark);
  themeIcon.textContent = isDark ? '🌙' : '🌞';
});

shareButton.addEventListener('click', () => {
    if (currentQuote) {
        const text = `"${currentQuote}" - ${currentCharacter}`;
        const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
});