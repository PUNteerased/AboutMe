const prefetched = new Set();

function prefetchUrl(url) {
    if (!url || prefetched.has(url)) return;
    prefetched.add(url);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
}

const links = Array.from(document.querySelectorAll("a[data-prefetch]"));

links.forEach((link) => {
    const url = link.href;
    link.addEventListener("mouseenter", () => prefetchUrl(url), { passive: true });
    link.addEventListener("touchstart", () => prefetchUrl(url), { passive: true });
    link.addEventListener("focus", () => prefetchUrl(url), { passive: true });
});

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const link = entry.target;
            prefetchUrl(link.href);
            observer.unobserve(link);
        });
    }, { rootMargin: "240px" });

    links.forEach((link) => observer.observe(link));
}
