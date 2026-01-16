const menuToggle = document.getElementById("menu-toggle");
const menuPanel = document.getElementById("menu-panel");
const menuItems = Array.from(document.querySelectorAll(".menu-item"));
const translationToggle = document.getElementById("translation-toggle");
const themeToggle = document.getElementById("theme-toggle");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
const cookieDays = 365;

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax${secureFlag}`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function toggleMenu(forceOpen) {
    const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !menuPanel.classList.contains("open");
    menuPanel.classList.toggle("open", shouldOpen);
    menuToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    menuPanel.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
}

menuToggle.addEventListener("click", () => toggleMenu());

document.addEventListener("click", (event) => {
    if (!menuPanel.contains(event.target) && event.target !== menuToggle) {
        toggleMenu(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        toggleMenu(false);
    }
});

function setLanguage(lang) {
    const elements = Array.from(document.querySelectorAll("[data-en][data-th]"));
    elements.forEach((el) => {
        const text = lang === "th" ? el.dataset.th : el.dataset.en;
        const label = el.querySelector(".menu-label") || el;
        label.textContent = text;
        if (el.classList.contains("menu-item")) {
            el.dataset.label = text;
        }
    });
    translationToggle.dataset.mode = lang;
    document.documentElement.lang = lang;
    setCookie("pte_lang", lang, cookieDays);
}

function setTheme(mode) {
    document.body.classList.toggle("theme-light", mode === "day");
    themeToggle.dataset.theme = mode;
    setCookie("pte_theme", mode, cookieDays);
}

translationToggle.addEventListener("click", () => {
    const nextLang = translationToggle.dataset.mode === "en" ? "th" : "en";
    setLanguage(nextLang);
});

themeToggle.addEventListener("click", () => {
    const nextTheme = themeToggle.dataset.theme === "night" ? "day" : "night";
    setTheme(nextTheme);
});

const savedLang = getCookie("pte_lang");
const savedTheme = getCookie("pte_theme");
setLanguage(savedLang === "th" ? "th" : "en");
setTheme(savedTheme === "day" ? "day" : "night");

menuItems.forEach((item) => {
    const labelSpan = item.querySelector(".menu-label") || item;
    const label = item.dataset.label || labelSpan.textContent.trim();
    item.dataset.label = label;

    if (item.classList.contains("is-current")) return;

    let interval = null;

    item.addEventListener("mouseenter", () => {
        if (item.classList.contains("menu-action")) return;
        let iteration = 0;
        const currentLabel = item.dataset.label;
        const length = currentLabel.length;
        if (interval) clearInterval(interval);

        interval = setInterval(() => {
            const text = currentLabel
                .split("")
                .map((char, index) => {
                    if (index < iteration) return char;
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");

            labelSpan.textContent = text;
            iteration += 1 / 2;
            if (iteration >= length) {
                clearInterval(interval);
                labelSpan.textContent = currentLabel;
            }
        }, 40);
    });

    item.addEventListener("mouseleave", () => {
        if (item.classList.contains("menu-action")) return;
        if (interval) clearInterval(interval);
        labelSpan.textContent = item.dataset.label;
    });
});
