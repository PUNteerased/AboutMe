const hiveCells = Array.from(document.querySelectorAll(".hive-cell"));
const hiveGrid = document.querySelector(".hive-grid");
const banner = document.getElementById("project-banner");
const bannerTag = document.getElementById("project-tag");
const bannerTitle = document.getElementById("project-title");
const bannerDesc = document.getElementById("project-desc");
const bannerImage = document.getElementById("project-image");
const bannerImageWrap = bannerImage ? bannerImage.closest(".project-banner__media-wrap") : null;
const bannerClose = document.getElementById("project-close");
const bannerBackdrop = banner ? banner.querySelector("[data-close-banner]") : null;
const defaultHiveImage = "image/pun.png";

function getBaseColumns() {
    if (window.innerWidth <= 420) return 2;
    if (window.innerWidth <= 720) return 3;
    if (window.innerWidth <= 980) return 4;
    return 5;
}

function layoutHiveRows() {
    if (!hiveGrid) return;
    const baseCols = getBaseColumns();
    const altCols = Math.max(2, baseCols - 1);
    const pattern = [baseCols, altCols];
    let patternIndex = 0;
    let cursor = 0;

    hiveGrid.innerHTML = "";

    while (cursor < hiveCells.length) {
        const rowSize = pattern[patternIndex % pattern.length];
        const slice = hiveCells.slice(cursor, cursor + rowSize);
        if (!slice.length) break;

        const row = document.createElement("div");
        row.className = "hive-row";
        if (rowSize === altCols) row.classList.add("is-offset");

        slice.forEach((cell) => row.appendChild(cell));
        hiveGrid.appendChild(row);

        cursor += rowSize;
        patternIndex += 1;
    }
}

function currentLang() {
    return document.documentElement.lang === "th" ? "th" : "en";
}

function setBannerContent(cell) {
    const lang = currentLang();
    const title = lang === "th" ? cell.dataset.titleTh : cell.dataset.titleEn;
    const desc = lang === "th" ? cell.dataset.descTh : cell.dataset.descEn;
    const tag = cell.dataset.banner || "Project";
    const imageSrc = cell.dataset.image?.trim() || defaultHiveImage;

    bannerTitle.textContent = title || "Project";
    bannerDesc.textContent = desc || "";
    bannerTag.textContent = tag;

    if (!bannerImage || !bannerImageWrap) return;

    bannerImage.src = imageSrc;
    bannerImage.alt = title || "Project preview";
    bannerImageWrap.classList.add("has-image");
}

function openBanner(cell) {
    if (!banner) return;
    setBannerContent(cell);
    banner.classList.add("open");
    banner.setAttribute("aria-hidden", "false");
}

function closeBanner() {
    if (!banner) return;
    banner.classList.remove("open");
    banner.setAttribute("aria-hidden", "true");
}

hiveCells.forEach((cell) => {
    const imageSrc = cell.dataset.image?.trim() || defaultHiveImage;
    let media = cell.querySelector(".hive-cell-media");
    let image = cell.querySelector(".hive-cell-image");

    if (!media || !image) {
        media = document.createElement("span");
        media.className = "hive-cell-media";
        image = document.createElement("img");
        image.className = "hive-cell-image";
        media.appendChild(image);
        cell.appendChild(media);
    }

    image.src = imageSrc;
    image.alt = cell.dataset.titleEn || "Project thumbnail";
    cell.classList.add("has-image");

    cell.addEventListener("click", () => openBanner(cell));
});

layoutHiveRows();

let resizeFrame = null;
window.addEventListener("resize", () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
        layoutHiveRows();
        resizeFrame = null;
    });
});

if (bannerClose) {
    bannerClose.addEventListener("click", closeBanner);
}

if (bannerBackdrop) {
    bannerBackdrop.addEventListener("click", closeBanner);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeBanner();
    }
});

const htmlObserver = new MutationObserver(() => {
    if (!banner || !banner.classList.contains("open")) return;
    const openTitle = bannerTitle.textContent;
    const matchedCell = hiveCells.find((cell) => {
        const en = cell.dataset.titleEn || "";
        const th = cell.dataset.titleTh || "";
        return openTitle === en || openTitle === th;
    });
    if (matchedCell) {
        setBannerContent(matchedCell);
    }
});

htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
