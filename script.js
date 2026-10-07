/* =========================================================
   UNSER ERSTES JAHR — Interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initRevealAnimations();
    initFloatingHearts();
    initContract();
});

/* ---------- Scroll reveal ---------- */

function initRevealAnimations() {
    const elements = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => observer.observe(element));
}

/* ---------- Subtle floating hearts ---------- */

function initFloatingHearts() {
    const container = document.querySelector(".heart-background");
    if (!container) return;

    const symbols = ["♡", "♥", "✦", "·"];

    function createHeart() {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const size = 10 + Math.random() * 15;
        const duration = 12 + Math.random() * 15;

        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;

        container.appendChild(heart);

        window.setTimeout(() => heart.remove(), duration * 1000);
    }

    for (let i = 0; i < 7; i++) {
        window.setTimeout(createHeart, i * 1200);
    }

    window.setInterval(createHeart, 2600);
}

/* ---------- Contract / escaping "Nein" button ---------- */

function initContract() {
    const buttonsArea = document.getElementById("contract-buttons");
    const noButton = document.getElementById("no-button");
    const yesButton = document.getElementById("yes-button");
    const hint = document.getElementById("contract-hint");

    if (!buttonsArea || !noButton || !yesButton || !hint) return;

    let escapeCount = 0;
    let hasAccepted = false;

    const messages = [

    ];

    function moveNoButton() {
        if (hasAccepted) return;

        escapeCount += 1;

        const areaRect = buttonsArea.getBoundingClientRect();
        const noRect = noButton.getBoundingClientRect();
        const yesRect = yesButton.getBoundingClientRect();

        const padding = 4;

        const maxX = Math.max(
            padding,
            areaRect.width - noRect.width - padding
        );

        const maxY = Math.max(
            padding,
            areaRect.height - noRect.height - padding
        );

        let x;
        let y;
        let attempts = 0;

        do {
            x = padding + Math.random() * maxX;
            y = padding + Math.random() * maxY;

            const noLeft = areaRect.left + x;
            const noTop = areaRect.top + y;
            const noRight = noLeft + noRect.width;
            const noBottom = noTop + noRect.height;

            const gap = 10;

            const overlaps =
                noLeft < yesRect.right + gap &&
                noRight > yesRect.left - gap &&
                noTop < yesRect.bottom + gap &&
                noBottom > yesRect.top - gap;

            if (!overlaps) {
                break;
            }

            attempts++;

        } while (attempts < 100);

        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButton.style.transform = "none";

        if (escapeCount >= 5) {
            noButton.textContent = "Ernsthaft?";
        }

        if (escapeCount >= 8) {
            noButton.style.opacity = "0.65";
        }
    }

    // Desktop: run away as the cursor approaches.
    noButton.addEventListener("mouseenter", moveNoButton);

    // Keyboard users still get the joke.
    noButton.addEventListener("focus", moveNoButton);

    // Mobile: tapping the button makes it escape.
    noButton.addEventListener("click", (event) => {
        event.preventDefault();
        moveNoButton();
    });

    buttonsArea.addEventListener("pointermove", (event) => {
        if (window.matchMedia("(pointer: fine)").matches) {
            const rect = noButton.getBoundingClientRect();
            const distance = Math.hypot(
                event.clientX - (rect.left + rect.width / 2),
                event.clientY - (rect.top + rect.height / 2)
            );

            if (distance < 65) {
                moveNoButton();
            }
        }
    });

    yesButton.addEventListener("click", () => {
        hasAccepted = true;
        noButton.style.display = "none";
        yesButton.disabled = true;
        yesButton.textContent = "VERTRAG VERLÄNGERT! ❤️";
        hint.textContent = "Eine ausgezeichnete Entscheidung. 😉";

        showToast("Vertragsverlängerung erfolgreich! ❤️");
        launchConfetti();
        revealFinalSection();
    });
}

/* ---------- Final section ---------- */

function revealFinalSection() {
    const finalSection = document.getElementById("final-section");
    if (!finalSection) return;

    finalSection.classList.add("active");

    window.setTimeout(() => {
        finalSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        createFinalHearts();
    }, 650);
}

function createFinalHearts() {
    const container = document.querySelector(".final-hearts");
    if (!container) return;

    const symbols = ["♥", "♡", "✦", "❤"];

    for (let i = 0; i < 28; i++) {
        const heart = document.createElement("span");
        heart.className = "final-heart";
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${10 + Math.random() * 28}px`;
        heart.style.animationDuration = `${5 + Math.random() * 8}s`;
        heart.style.animationDelay = `${Math.random() * 4}s`;

        container.appendChild(heart);

        window.setTimeout(() => heart.remove(), 14000);
    }
}

/* ---------- Simple confetti without a library ---------- */

function launchConfetti() {
    const count = 90;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("span");

        piece.textContent = Math.random() > 0.25 ? "♥" : "✦";
        piece.style.position = "fixed";
        piece.style.left = `${50 + (Math.random() - 0.5) * 20}%`;
        piece.style.top = `${48 + (Math.random() - 0.5) * 10}%`;
        piece.style.zIndex = "999";
        piece.style.pointerEvents = "none";
        piece.style.fontSize = `${10 + Math.random() * 18}px`;
        piece.style.color = Math.random() > 0.5 ? "#b85c6b" : "#7e3342";

        const x = (Math.random() - 0.5) * window.innerWidth * 1.2;
        const y = window.innerHeight * (0.5 + Math.random() * 0.8);
        const rotation = (Math.random() - 0.5) * 900;
        const duration = 1200 + Math.random() * 1200;

        piece.animate(
            [
                {
                    transform: "translate(-50%, -50%) scale(0.3) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform: `translate(${x}px, ${y}px) scale(1) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ],
            {
                duration,
                easing: "cubic-bezier(.12,.75,.35,1)",
                fill: "forwards"
            }
        );

        document.body.appendChild(piece);

        window.setTimeout(() => piece.remove(), duration + 100);
    }
}

/* ---------- Toast ---------- */

let toastTimeout;

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(toastTimeout);

    toastTimeout = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
