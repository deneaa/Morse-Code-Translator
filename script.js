import { textToMorse, morseToText } from './translate.js';

let toastBox = document.getElementById('toastBox');
let successCopyMessage = '<i class="fa-solid fa-circle-check"></i> You copied the text!';
let succesInsertMessage = '<i class="fa-solid fa-circle-check"></i> You inserted the text!';
let tooManyAttempts = '<i class="fa-solid fa-circle-xmark"></i> Too many attempts. Wait 5 seconds!';

// Function for toasts
function showToast(msg) {
  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  if(msg.includes('attempts')) {
    toast.classList.add('attempts');
  }

  setTimeout(() => {
    toast.remove();
  }, 6000);
}

const title = document.querySelector('.js-title');
const firstContainer = document.querySelector('.js-first-container');
const secondContainer = document.querySelector('.js-second-container');
const firstOutput = document.getElementById('inputText');
const secondOutput = document.getElementById('outputText');
const switchButton = document.getElementById('switchMode');

const modes = {
  text: {
    first: 'Text Input',
    second: 'Morse Output',
    firstPlaceholder: 'Enter Text here...',
    secondPlaceholder: 'Morse Code will appear here...'
  },
  morse: {
    first: 'Morse Input Text',
    second: 'Text Output',
    firstPlaceholder: 'Enter Morse Code here...',
    secondPlaceholder: 'Text Output will appear here...'
  }
};

export let currentMode = 'text';

function switchMode() {
  const firstValue = firstOutput.value;
  const secondValue = secondOutput.value;

  currentMode = currentMode === 'text' ? 'morse' : 'text';

  const mode = modes[currentMode];

  firstContainer.innerHTML = mode.first;
  secondContainer.innerHTML = mode.second;
  firstOutput.placeholder = mode.firstPlaceholder;
  secondOutput.placeholder = mode.secondPlaceholder;
  
  switchButton.innerHTML = `Switch between ${currentMode === 'text' ? 'Text' : 'Morse'} and ${currentMode === 'text' ? 'Morse' : 'Text'}`;

  showToast(`<i class="fa-solid fa-arrow-right"></i> Switched to ${mode.first}`);

  if (currentMode === 'text') {
    secondOutput.value = textToMorse(firstValue);
  } else {
    firstOutput.value = morseToText(secondValue);
  }

  firstOutput.value = secondValue;
  secondOutput.value = firstValue;
}

// Event listener for input in text mode
firstOutput.addEventListener('input', (event) => {
  const text = event.target.value;
  if (currentMode === 'text') {
    const morse = textToMorse(text);
    secondOutput.value = morse;
  }
});

// Event listener for input in morse mode
secondOutput.addEventListener('input', (event) => {
  const morse = event.target.value;
  if (currentMode === 'morse') {
    const text = morseToText(morse);
    firstOutput.value = text;
  }
});

// Event listener for switching modes
switchButton.addEventListener('click', () => {
  switchMode();
  handleButtonClick();
});

const insertText = document.getElementById('pasteText');
const copyInputText = document.getElementById('copyInputText');
const copyOutputText = document.getElementById('copyOutputText');

// Function for attempts
let attempts = 0;
let isBlocked = false;
const maxAttempts = 4;
const blockTime = 5000;

const showTooManyAttemptsMessage = () => {
  if (!isBlocked) {
    showToast(tooManyAttempts);
    isBlocked = true;
    disableButtons(true);
    setTimeout(() => {
      isBlocked = false;
      attempts = 0; 
      disableButtons(false);
    }, blockTime);
  }
};

const disableButtons = (disable) => {
  insertText.disabled = disable;
  copyInputText.disabled = disable;
  copyOutputText.disabled = disable;
  switchButton.disabled = disable;
};

// Function for handling button click actions
const handleButtonClick = (event) => {
  if (isBlocked) {
    showTooManyAttemptsMessage();
    return;
  }

  if (attempts >= maxAttempts) {
    showTooManyAttemptsMessage();
    return;
  }

  attempts++;

  if (event && event.target === insertText) {
    navigator.clipboard.readText()
      .then(text => {
        showToast(succesInsertMessage);
        firstOutput.value = text;
      })
      .catch(err => {
        console.error('Nu am reușit să preluăm textul din clipboard:', err);
      });
  }

  if (event && (event.target === copyInputText || event.target === copyOutputText)) {
    const text = event.target === copyInputText ? firstOutput.value : secondOutput.value;
    navigator.clipboard.writeText(text)
      .then(() => {
        showToast(successCopyMessage);
      })
      .catch(err => {
        console.error('Nu am reușit să copiem textul:', err);
      });
  }
};

insertText.addEventListener('click', handleButtonClick);
copyInputText.addEventListener('click', handleButtonClick);
copyOutputText.addEventListener('click', handleButtonClick);
