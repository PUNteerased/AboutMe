const cards = Array.from(document.querySelectorAll(".work-card"));
const overlay = document.getElementById("zoom-overlay");
const overlayClose = document.getElementById("zoom-close");
const overlayBackdrop = overlay ? overlay.querySelector("[data-close-overlay]") : null;
const zoomImage = document.getElementById("zoom-image");
const zoomTitle = document.getElementById("zoom-title");
const zoomDesc = document.getElementById("zoom-desc");
let activeCard = null;
let isAnimating = false;

function currentLang() {
    return document.documentElement.lang === "th" ? "th" : "en";
}

function createGhostFromCard(card) {
    const img = card.querySelector("img");
    const rect = card.getBoundingClientRect();
    const ghost = document.createElement("figure");
    ghost.className = "zoom-ghost";
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    const ghostImg = document.createElement("img");
    ghostImg.src = img ? img.src : "image/pun.png";
    ghostImg.alt = "";
    ghost.appendChild(ghostImg);
    document.body.appendChild(ghost);
    return ghost;
}

function animateGhost(ghost, fromRect, toRect, done) {
    const dx = toRect.left - fromRect.left;
    const dy = toRect.top - fromRect.top;
    const sx = toRect.width / fromRect.width;
    const sy = toRect.height / fromRect.height;

    ghost.animate([
        { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 1 }
    ], {
        duration: 380,
        easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        fill: "forwards"
    }).finished.then(done).catch(done);
}

function openOverlay(card) {
    if (!overlay || !zoomImage || !zoomTitle || !zoomDesc || isAnimating) return;
    isAnimating = true;
    activeCard = card;
    const lang = currentLang();
    const title = lang === "th" ? card.dataset.titleTh : card.dataset.titleEn;
    const desc = lang === "th" ? card.dataset.descTh : card.dataset.descEn;
    const img = card.querySelector("img");

    zoomTitle.textContent = title || "Project";
    zoomDesc.textContent = desc || "";
    zoomImage.src = img ? img.src : "image/pun.png";

    const ghost = createGhostFromCard(card);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    const media = overlay.querySelector(".zoom-panel__media");
    const fromRect = card.getBoundingClientRect();
    const toRect = media.getBoundingClientRect();

    animateGhost(ghost, fromRect, toRect, () => {
        ghost.remove();
        isAnimating = false;
    });
}

function closeOverlay() {
    if (!overlay || !activeCard || isAnimating) {
        if (overlay) {
            overlay.classList.remove("open");
            overlay.setAttribute("aria-hidden", "true");
        }
        return;
    }

    isAnimating = true;
    const media = overlay.querySelector(".zoom-panel__media");
    const ghost = createGhostFromCard(activeCard);
    const fromRect = media.getBoundingClientRect();
    const toRect = activeCard.getBoundingClientRect();

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");

    animateGhost(ghost, fromRect, toRect, () => {
        ghost.remove();
        isAnimating = false;
        activeCard = null;
    });
}

cards.forEach((card) => {
    card.addEventListener("click", (event) => {
        event.preventDefault();
        openOverlay(card);
    });
});

if (overlayClose) overlayClose.addEventListener("click", closeOverlay);
if (overlayBackdrop) overlayBackdrop.addEventListener("click", closeOverlay);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeOverlay();
});
