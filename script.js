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
let currentCategory = 'all';
let currentQuote = null;
let currentCharacter = null;

// fetchRandomQuote();
loadCharacters();

function getFilteredQuotes() {
    return currentCategory === 'all'
        ? quotes
        : quotes.filter(quote => quote.category === currentCategory);
}

function getRandomQuote() {
    const filtered = getFilteredQuotes();
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function displayQuote(quote) {
    quoteText.classList.remove('fade-in');
    quoteAuthor.classList.remove('fade-in');

    void quoteText.offsetWidth; // Force reflow to reset animation.

    currentQuote = quote;
    currentCharacter = characterSelect.textContent;

    quoteText.textContent = `"${quote.dialog}"`;
    quoteAuthor.textContent = `"${currentCharacter}"`;

    requestAnimationFrame(() => {
        quoteText.classList.add('fade-in');
        quoteAuthor.classList.add('fade-in');
    });
}

async function fetchRandomQuote(e) {
   const id = e.target.value;
   if (!id) return;

    try {
        const response = await fetch(`/.netlify/functions/getQuotes?characterId=${id}`);
        if (!response.ok) throw new Error(`HTTP error status: ${error.status}`);
        const data = await response.json();

        if (data.length === 0) {
            displayQuote({
                dialog: 'No quotes found',
                character: '🤷'
            });
            return;
        }

        const randomQuote = data.docs[Math.floor(Math.random * data.docs.length)];
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

newQuoteButton.addEventListener('click', (e) => { fetchRandomQuote(e) });
characterSelect.addEventListener('change', (e) => { fetchRandomQuote(e) });

copyQuoteButton.addEventListener('click', () => {
    if (currentQuote) {
        const textToCopy = `"${currentQuote.text}" - ${currentCharacter}`;
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
        const text = `"${currentQuote.text}" - ${currentCharacter}`;
        const url = `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
});