const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const targetWord = "W3LCOME";
const failureWord = "SYSTEM FAILURE";

const terminalLayer = document.getElementById("terminal-layer");
const mainText = document.getElementById("main-text");
const enterBtn = document.getElementById("enter-btn");
const denied = document.getElementById("denied");

const glitchAudio = new Audio("audio/glitch_noise.wav");

let hasStarted = false;
let deniedTimer = null;
let decodeDone = false;

function randomChar() {
    return letters[Math.floor(Math.random() * letters.length)];
}

function startDecode() {
    let iteration = 0;
    let lastLocked = 0;
    let currentLetterDuration = 1200;
    let lastTime = performance.now();
    const interval = setInterval(() => {
        const now = performance.now();
        const delta = now - lastTime;
        lastTime = now;

        mainText.textContent = targetWord
            .split("")
            .map((letter, index) => (index < iteration ? letter : randomChar()))
            .join("");

        if (iteration >= targetWord.length) {
            clearInterval(interval);
            mainText.textContent = targetWord;
            decodeDone = true;
            enterBtn.classList.add("ready");
        }

        iteration += delta / currentLetterDuration;
        const locked = Math.floor(iteration);
        if (locked > lastLocked) {
            lastLocked = locked;
            currentLetterDuration = 500 + Math.random() * 500;
        }
    }, 50);
}

function showDenied() {
    denied.classList.add("show");
    if (deniedTimer) {
        clearTimeout(deniedTimer);
    }
    deniedTimer = setTimeout(() => denied.classList.remove("show"), 500);
}

const flippedMap = {
    A: "∀",
    B: "𐐒",
    C: "Ɔ",
    D: "◖",
    E: "Ǝ",
    F: "Ⅎ",
    G: "⅁",
    H: "H",
    I: "I",
    J: "ſ",
    K: "ʞ",
    L: "⅂",
    M: "W",
    N: "N",
    O: "O",
    P: "Ԁ",
    Q: "Ό",
    R: "Я",
    S: "S",
    T: "┴",
    U: "∩",
    V: "Λ",
    W: "M",
    X: "X",
    Y: "⅄",
    Z: "Z"
};

const glitchGlyphs = "░▒▓█<>/\\|[]{}()*&^%$#@!";

function glitchText(word) {
    return word
        .split("")
        .map((char) => {
            if (Math.random() > 0.6) {
                return flippedMap[char] || char;
            }
            return glitchGlyphs[Math.floor(Math.random() * glitchGlyphs.length)];
        })
        .join("");
}

function playAudio(sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

function startGlitchPhase(durationMs = 500) {
    terminalLayer.classList.add("glitch-active");
    const original = failureWord;
    mainText.textContent = original;
    const glitchInterval = setInterval(() => {
        mainText.textContent = glitchText(original);
    }, 60);

    setTimeout(() => {
        clearInterval(glitchInterval);
        mainText.textContent = original;
        terminalLayer.classList.remove("glitch-active");
    }, durationMs);
}

function startSequence() {
    if (hasStarted || !decodeDone) return;
    hasStarted = true;
    enterBtn.classList.remove("ready");
    enterBtn.style.display = "none";
    terminalLayer.classList.add("started");

    playAudio(glitchAudio);
    const warningEnd = 1500;

    startGlitchPhase(warningEnd);

    setTimeout(() => {
        window.location.href = "home.html";
    }, warningEnd + 2500);
}

window.addEventListener("keydown", (event) => {
    if (hasStarted) return;
    if (event.key === "Enter") {
        startSequence();
    } else if (decodeDone) {
        showDenied();
    }
});

enterBtn.addEventListener("click", startSequence);

window.addEventListener("load", startDecode);
