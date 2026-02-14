const hiveCells = Array.from(document.querySelectorAll(".hive-cell"));
const banner = document.getElementById("project-banner");
const bannerTag = document.getElementById("project-tag");
const bannerTitle = document.getElementById("project-title");
const bannerDesc = document.getElementById("project-desc");
const bannerImage = document.getElementById("project-image");
const bannerImageWrap = bannerImage ? bannerImage.closest(".project-banner__media-wrap") : null;
const bannerClose = document.getElementById("project-close");
const bannerBackdrop = banner ? banner.querySelector("[data-close-banner]") : null;
const defaultHiveImage = "image/pun.png";

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
    const media = document.createElement("span");
    media.className = "hive-cell-media";
    const image = document.createElement("img");
    image.className = "hive-cell-image";
    image.src = imageSrc;
    image.alt = cell.dataset.titleEn || "Project thumbnail";
    media.appendChild(image);
    cell.appendChild(media);
    cell.classList.add("has-image");

    cell.addEventListener("click", () => openBanner(cell));
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
