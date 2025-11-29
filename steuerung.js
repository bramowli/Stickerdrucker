console.log('steuerung.js geladen – Screen:', document.body.dataset.screen);

// ===== Auswahllisten =====

// Spruch-Liste für spruchwahl.html
const phrases = [
  'Love Cats hate Fascism',            // 0 -> Cats
  'Nazi Freie Zone',                   // 1 -> NFZ
  'Ruhig Brauner',                     // 2 -> Ruhig
  'Nazis verschwinden!',               // 3 -> Verschwinden
  'Antifaschismus zum Aufkleben',      // 4 -> Anti
  'Sorry, der Nazisticker war hässlich', // 5 -> Sorry
  'Upsi, hier stand mal was Peinliches'  // 6 -> UPSI
];

// Codes in der gleichen Reihenfolge wie oben
const phraseCodes = [
  'Cats',
  'NFZ',
  'Ruhig',
  'Verschwinden',
  'Anti',
  'Sorry',
  'UPSI'
];

// Symbol-Liste für symbolwahl.html (Dateipfade)
const symbols = [
  'Symbole/JustText.png',
  'Symbole/Cat.png',
  'Symbole/Fairy.png',
  'Symbole/Fist.png',
  'Symbole/Spray.png'
];

// Codes passend zu den Dateinamen
const symbolCodes = [
  'JustText',
  'Cat',
  'Fairy',
  'Fist',
  'Spray'
];

// ===== Sounds =====
const SOUND_PATH = 'Sounds/';

// HIER trägst du deine Dateinamen ein:
const soundConfig = {
  background: 'ambient-noise-when-tuning-into-fm-radio-431515.mp3', // Dauerschleife im Hintergrund
  arrow: 'retro-select-236670.mp3',            // bei ArrowUp / ArrowDown
  confirm: 'retro-blip-2-236668.mp3',        // bei Space/Enter-Bestätigung
  printing: 'retro-game-jingleaif-14638.mp3'          // wenn der Wartescreen erscheint
};


let arrowSound = null;
let printSound = null;

// Effekte: jedes Mal eigenes Audio-Objekt
function playArrowSound() {
  const a = new Audio(SOUND_PATH + soundConfig.arrow);
  a.volume = 0.6;
  a.play().catch(() => {});
}

function playConfirmSound() {
  const a = new Audio(SOUND_PATH + soundConfig.confirm);
  a.volume = 0.6;
  a.play().catch(() => {});
}

function playPrintSound() {
  const a = new Audio(SOUND_PATH + soundConfig.printing);
  a.volume = 0.8;
  a.play().catch(() => {});
}

let currentSymbolIndex = 0;
let currentPhraseIndex = 0;
let isPrinting = false; // verhindert mehrfaches Auslösen auf dem Druck-Screen
let highlightedText = null;
let isSelected = false; // Modus-Auswahl getroffen?
let isColorSelected = false;
let currentColor = null; // 'White' oder 'Black'

// Mode-Auswahl laden (random / selbermachen)
let lastModeSelection = localStorage.getItem('modeSelection') || 'selbermachen';
console.log('Steuerung geladen, Screen:', document.body.dataset.screen);

// ===== Initialzustand beim Laden setzen =====
const initialScreen = document.body.dataset.screen || 'unknown';

// Spruchwahl: direkt ersten Spruch anzeigen & speichern
if (initialScreen === 'spruch') {
  const phraseElement = document.querySelector('.phrase-text');
  if (phraseElement) {
    currentPhraseIndex = parseInt(localStorage.getItem('selectedPhraseIndex') || '0', 10);
    if (isNaN(currentPhraseIndex) || currentPhraseIndex < 0 || currentPhraseIndex >= phrases.length) {
      currentPhraseIndex = 0;
    }
    phraseElement.textContent = phrases[currentPhraseIndex];
    localStorage.setItem('selectedPhraseIndex', currentPhraseIndex.toString());
  }
}

// Symbolwahl: erstes Symbol anzeigen & speichern
if (initialScreen === 'symbol') {
  const symbolImg = document.querySelector('.symbol-image');
  if (symbolImg) {
    currentSymbolIndex = parseInt(localStorage.getItem('selectedSymbolIndex') || '0', 10);
    if (isNaN(currentSymbolIndex) || currentSymbolIndex < 0 || currentSymbolIndex >= symbols.length) {
      currentSymbolIndex = 0;
    }
    symbolImg.src = symbols[currentSymbolIndex];
    localStorage.setItem('selectedSymbolIndex', currentSymbolIndex.toString());
  }
}

// Farbwahl: ggf. vorherige Auswahl laden
if (initialScreen === 'farbe') {
  const savedColor = localStorage.getItem('selectedColor');
  if (savedColor === 'White' || savedColor === 'Black') {
    currentColor = savedColor;
    isColorSelected = true;
  }
}

// Präsentation / Drucken & Gedruckt-Screen: Sticker setzen
if (initialScreen === 'druck' || initialScreen === 'done') {
  const stickerImg = document.querySelector('.sticker-preview');
  if (stickerImg) {
    const path = getStickerPath();
    stickerImg.src = path;
    console.log('Sticker-Pfad gesetzt:', path);
  }
  const hiddenStickerImg = document.querySelector('.hidden-preview');
  if (hiddenStickerImg) {
    const path = getStickerPath();
    hiddenStickerImg.src = path;
    console.log('Versteckter Sticker-Pfad gesetzt:', path);
  }
}

function bumpArrow(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Animation zurücksetzen, damit sie jedes Mal neu startet
  el.classList.remove('arrow-bump');
  void el.offsetWidth; // Force reflow
  el.classList.add('arrow-bump');
}

// ===== globaler Key-Listener für ALLE Seiten =====
document.addEventListener('keydown', function (event) {
  const screen = document.body.dataset.screen || 'unknown';
  const isConfirm = event.code === 'ArrowRight'; // früher Space, jetzt Pfeil rechts

  // Space soll nicht scrollen
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault();
  }

  // Pfeiltasten sollen auch nicht scrollen
  if (event.code === 'ArrowUp' || 
    event.code === 'ArrowDown' || 
    event.code === 'ArrowLeft' ||
    event.code === 'ArrowRight' ) {
    event.preventDefault();
  }

  // ========== Rückwärts-Navigation ==========
  if (event.code === 'ArrowLeft') {
    switch (screen) {
      case 'startdisplay':
        break;
      case 'mode':
        window.location.href = 'startdisplay.html';
        break;
      case 'spruch':
        window.location.href = 'modus.html';
        break;
      case 'symbol':
        window.location.href = 'spruchwahl.html';
        break;
      case 'farbe':
        window.location.href = 'symbolwahl.html';
        break;
      case 'druck': {
        if (lastModeSelection === 'random') {
          window.location.href = 'modus.html';
        } else {
          window.location.href = 'symbolwahl.html';
        }
        break;
      }
      case 'done':
        break;
      default:
        break;
    }
  }

  // ========== Vorwärts-Logik je nach Screen ==========
  switch (screen) {
    // STARTSEITE
    case 'start':
      if (isConfirm) {
          const btn = document.querySelector('.start-button');
          if (btn) {
          btn.classList.add('start-button--pressed');
        }

        playConfirmSound();
        setTimeout(() => {
          window.location.href = 'modus.html';
        }, 120);
      }
      break;

    // MODUSWAHL
    case 'mode': {
      const randomText = document.getElementById('mod-1');
      const selbText = document.getElementById('mod-2');
      if (!randomText || !selbText) break;

      if (event.code === 'ArrowDown') {
        highlightText('mod-2', randomText, selbText);
        isSelected = true;
        lastModeSelection = 'selbermachen';
        localStorage.setItem('modeSelection', 'selbermachen');
        playArrowSound();
        bumpArrow('.arrow-down');   // <– NEU
      }

      if (event.code === 'ArrowUp') {
        highlightText('mod-1', randomText, selbText);
        isSelected = true;
        lastModeSelection = 'random';
        localStorage.setItem('modeSelection', 'random');
        playArrowSound();
        bumpArrow('.arrow-up');     // <– NEU
      }

      if (isConfirm && isSelected) {
        playConfirmSound();
        
        if (lastModeSelection === 'random') {
          // finalStickerPath zurücksetzen, damit neuer Random gewählt wird
          localStorage.removeItem('finalStickerPath');
          setTimeout(() => {
            window.location.href = 'praesentation.html';
          }, 120);
        } else {
        setTimeout(() => {
          window.location.href = 'spruchwahl.html';
        }, 120);}
      }
      break;
    }

    // SPRUCHWAHL
    case 'spruch': {
      const phraseElement = document.querySelector('.phrase-text');
      if (!phraseElement) break;

      if (event.code === 'ArrowDown') {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        phraseElement.textContent = phrases[currentPhraseIndex];
        localStorage.setItem('selectedPhraseIndex', currentPhraseIndex.toString());
        playArrowSound();
        bumpArrow('.arrow-down');   // <– NEU
      }

      if (event.code === 'ArrowUp') {
        currentPhraseIndex = (currentPhraseIndex - 1 + phrases.length) % phrases.length;
        phraseElement.textContent = phrases[currentPhraseIndex];
        localStorage.setItem('selectedPhraseIndex', currentPhraseIndex.toString());
        playArrowSound();
        bumpArrow('.arrow-up');     // <– NEU
      }

      if (isConfirm) {
        playConfirmSound();
        setTimeout(() => {
          window.location.href = 'symbolwahl.html';
        }, 120);
      }
      break;
    }

    // SYMBOLWAHL
    case 'symbol': {
      const symbolImg = document.querySelector('.symbol-image');
      if (!symbolImg) break;

      if (event.code === 'ArrowDown') {
        currentSymbolIndex = (currentSymbolIndex + 1) % symbols.length;
        symbolImg.src = symbols[currentSymbolIndex];
        localStorage.setItem('selectedSymbolIndex', currentSymbolIndex.toString());
        playArrowSound();
        bumpArrow('.symbol-arrow-down');   // <– NEU
      }

      if (event.code === 'ArrowUp') {
        currentSymbolIndex = (currentSymbolIndex - 1 + symbols.length) % symbols.length;
        symbolImg.src = symbols[currentSymbolIndex];
        localStorage.setItem('selectedSymbolIndex', currentSymbolIndex.toString());
        playArrowSound();
        bumpArrow('.symbol-arrow-up');     // <– NEU
      }

      if (isConfirm) {
        playConfirmSound();
        setTimeout(() => {
          window.location.href = 'color.html';
        }, 120);
      }
      break;
    }

    // FARBWAHL
    case 'farbe': {
      const whiteText = document.getElementById('color-1');
      const blackText = document.getElementById('color-2');
      if (!whiteText || !blackText) break;

      if (event.code === 'ArrowDown') {
        highlightText('color-2', whiteText, blackText);
        isColorSelected = true;
        currentColor = 'Black';
        localStorage.setItem('selectedColor', 'Black');
        playArrowSound();
        bumpArrow('.arrow-down');   // <– NEU
      }

      if (event.code === 'ArrowUp') {
        highlightText('color-1', whiteText, blackText);
        isColorSelected = true;
        currentColor = 'White';
        localStorage.setItem('selectedColor', 'White');
        playArrowSound();
        bumpArrow('.arrow-up');     // <– NEU
      }

      if (isConfirm && isColorSelected) {
        playConfirmSound();
        // finalStickerPath zurücksetzen (falls vorher schon mal gedruckt)
        localStorage.removeItem('finalStickerPath');
          setTimeout(() => {
          window.location.href = 'praesentation.html';
        }, 120);
      }
      break;
    }

    // PRÄSENTATION / DRUCK
    case 'druck':
      if ((isConfirm || event.code === 'Enter') && !isPrinting) {
        const btn = document.querySelector('.print-button, .start-button');
        if (btn) {
          // je nach Klasse, die du im HTML verwendest
          if (btn.classList.contains('print-button')) {
            btn.classList.add('print-button--pressed');
          } else {
            btn.classList.add('start-button--pressed');
          }
        }

        playConfirmSound();
        isPrinting = true;
        startPrintAndRedirect();
      }
      break;

    // GEDRUCKT-SCREEN
    case 'done':
      if (isConfirm) {
        // Reset für neuen Durchlauf
        localStorage.removeItem('finalStickerPath');
        window.location.href = 'startdisplay.html';
      }
      break;
  }
});

// Button wieder "rauskommen" lassen, wenn Space/Enter losgelassen wird
document.addEventListener('keyup', function (event) {
  if (event.code === 'ArrowRight'  || event.code === 'Enter') {
    document
      .querySelectorAll('.start-button--pressed, .print-button--pressed')
      .forEach(btn => {
        btn.classList.remove('start-button--pressed', 'print-button--pressed');
      });
  }
});

// ===== Funktionen =====

// Startet „Drucken“ & Redirect
function startPrintAndRedirect() {
  // Schwarzes Fenster mit Drucker einblenden
  const overlay = document.getElementById('print-overlay');
  if (overlay) {
    overlay.hidden = false;
  }

  // const hiddenStickerImg = document.querySelector('.hidden-preview');

  document.querySelector('style').textContent =
  `@media print {
      * { visibility: hidden;
          margin: 0;
          padding: 0;
      }
      .hidden-preview {
        visibility: visible;
        display: block;
      }
    }`;

  if (window.print) {
    window.print();
  }

  // Druck-Sound abspielen
  playPrintSound();

  // Nach ca. 3 Sekunden zum „gedruckt“-Screen
  setTimeout(function () {
    window.location.href = 'gedruckt.html';
  }, 3000);
}

// Text größer/kleiner machen (Modus & Farbe)
function highlightText(id, oldElement1, oldElement2) {
  oldElement1.style.fontSize = '8rem';
  oldElement2.style.fontSize = '8rem';

  const newElement = document.getElementById(id);
  if (newElement) {
    newElement.style.fontSize = '10rem';
    highlightedText = id;
  }
}

// Ermittelt den finalen Sticker-Pfad
function getStickerPath() {
  // Wenn schon bestimmt → wiederverwenden (wichtig für Random)
  const existing = localStorage.getItem('finalStickerPath');
  if (existing) {
    return existing;
  }

  const mode = localStorage.getItem('modeSelection') || 'selbermachen';

  let phraseCode;
  let symbolCode;
  let colorCode;

  if (mode === 'random') {
    // Komplett zufällige Kombi
    const pIndex = Math.floor(Math.random() * phraseCodes.length);
    const sIndex = Math.floor(Math.random() * symbolCodes.length);
    const cIndex = Math.floor(Math.random() * 2); // 0 = White, 1 = Black

    phraseCode = phraseCodes[pIndex];
    symbolCode = symbolCodes[sIndex];
    colorCode = cIndex === 0 ? 'White' : 'Black';
  } else {
    // Werte aus den Auswahlscreens
    let pIndex = parseInt(localStorage.getItem('selectedPhraseIndex') || '0', 10);
    let sIndex = parseInt(localStorage.getItem('selectedSymbolIndex') || '0', 10);
    const storedColor = localStorage.getItem('selectedColor') || 'White';

    if (isNaN(pIndex) || pIndex < 0 || pIndex >= phraseCodes.length) pIndex = 0;
    if (isNaN(sIndex) || sIndex < 0 || sIndex >= symbolCodes.length) sIndex = 0;

    phraseCode = phraseCodes[pIndex];
    symbolCode = symbolCodes[sIndex];
    colorCode = storedColor === 'Black' ? 'Black' : 'White';
  }

  const finalPath = `AntiNaziSticker/${phraseCode}_${symbolCode}_${colorCode}.png`;
  localStorage.setItem('finalStickerPath', finalPath);
  return finalPath;
}