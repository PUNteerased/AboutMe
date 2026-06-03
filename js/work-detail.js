const params = new URLSearchParams(window.location.search);
const workId = params.get("id") || "work-01";
const data = (window.PORTFOLIO_WORKS && window.PORTFOLIO_WORKS[workId]) || window.PORTFOLIO_WORKS["work-01"];

const tagEl = document.getElementById("work-tag");
const titleEl = document.getElementById("work-title");
const descEl = document.getElementById("work-desc");
const imageEl = document.getElementById("work-image");
const titleTag = document.getElementById("work-title-tag");

if (tagEl) {
    tagEl.dataset.en = data.tagEn;
    tagEl.dataset.th = data.tagTh;
    tagEl.textContent = data.tagEn;
}

if (titleEl) {
    titleEl.dataset.en = data.titleEn;
    titleEl.dataset.th = data.titleTh;
    titleEl.textContent = data.titleEn;
}

if (descEl) {
    descEl.dataset.en = data.descEn;
    descEl.dataset.th = data.descTh;
    descEl.textContent = data.descEn;
}

if (imageEl) {
    imageEl.src = data.image;
    imageEl.alt = data.titleEn;
    imageEl.style.viewTransitionName = `${workId}-media`;
}

if (titleTag) {
    titleTag.textContent = `${data.titleEn} | PUNteerased`;
}
