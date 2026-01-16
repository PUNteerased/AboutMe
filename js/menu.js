const menuToggle = document.getElementById("menu-toggle");
const menuPanel = document.getElementById("menu-panel");
const menuItems = Array.from(document.querySelectorAll(".menu-item"));
const translationToggle = document.getElementById("translation-toggle");
const themeToggle = document.getElementById("theme-toggle");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

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
}

function setTheme(mode) {
    document.body.classList.toggle("theme-light", mode === "day");
    themeToggle.dataset.theme = mode;
}

translationToggle.addEventListener("click", () => {
    const nextLang = translationToggle.dataset.mode === "en" ? "th" : "en";
    setLanguage(nextLang);
});

themeToggle.addEventListener("click", () => {
    const nextTheme = themeToggle.dataset.theme === "night" ? "day" : "night";
    setTheme(nextTheme);
});

setLanguage("en");
setTheme("night");

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
