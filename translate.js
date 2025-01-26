import { currentMode } from './script.js';

const morseCodeMap = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', ':': '---...',
    '?': '..--..', '\'': '.----.', '-': '-....-', '/': '-..-.', '(': '-.--.',
    ')': '-.--.-', '&': '.-...', '@': '.--.-.', '!': '-.-.--', '=': '-...-',
    '+': '.-.-.', '"': '.-..-.', 'À': '.--.-', 'Ä': '.-.-', 'Ñ': '--.--',
    'Ö': '---.', 'Ü': '..--', ' ': '/', '<AA>': '.-.-.-', '<AR>': '.-.-.-',
    '<AS>': '.-..-.', '<BK>': '-...-.-', '<BT>': '-...-', '<CL>': '-.-.-.-.',
    '<CT>': '-.-.-', '<DO>': '..---..', '<KA>': '.-.-.', '<KN>': '-.-.-.',
    '<SK>': '...-.', '<SN>': '...-.', '<SOS>': '...---...', 'Error': '-......-..-',
};

const reverseMorseCodeMap = Object.fromEntries(
    Object.entries(morseCodeMap).map(([letter, morse]) => [morse, letter])
);

export const textToMorse = (text) => {
    return text.toUpperCase().split('').map(char => {
        return morseCodeMap[char] || '';
    }).join(' ');
};

export function morseToText(morseCode) {
    return morseCode
        .split('   ')
        .map(word => 
            word
                .split(' ')
                .map(symbol => {
                    const decodedChar = reverseMorseCodeMap[symbol] || '?';
                    return decodedChar;
                })
                .join('')
        ).join(' ');
}

const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

inputText.addEventListener('input', (event) => {
    const text = event.target.value;
    
    if (currentMode === 'text') {
        const morse = textToMorse(text);
        outputText.value = morse;
    } else if (currentMode === 'morse') {
        const textFromMorse = morseToText(text);
        outputText.value = textFromMorse;
    }
});
