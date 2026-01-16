document.addEventListener("DOMContentLoaded", () => {
        const originalAdd = window.addEventListener;
        window.addEventListener = function (type, listener, options) {
            if (type === "load") {
                const wrapped = function (event) {
                    setTimeout(() => listener.call(this, event), 1000);
                };
                return originalAdd.call(this, type, wrapped, options);
            }
            return originalAdd.call(this, type, listener, options);
        };

        const loader = document.getElementById("loader");
        const content = document.querySelector(".content");

        const canvas = document.getElementById("matrix");
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const fontSize = 18;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * canvas.height / fontSize));

        function drawMatrixEffect() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#FFF";
            ctx.font = fontSize + "px Courier New";

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(drawMatrixEffect, 50);

        // Wait for all resources (images, CSS, fonts, external scripts) to finish loading
        window.addEventListener("load", () => {
            loader.classList.add("fade-out");
            // Match the CSS transition duration (1.5s) before revealing content
            setTimeout(() => {
                if (content) {
                    content.classList.add("reveal");
                }
                clearInterval(interval);
            }, 1500);
        });
});
