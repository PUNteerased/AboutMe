const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
        observer.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}
