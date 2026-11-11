
/* =========================================
   FARAJIH DESIGN
   MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       1. HERO SLIDER
    ===================================== */

    const hero = document.querySelector(".hero");
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".slider-dot");

    const nextButton = document.getElementById("hero-next");
    const prevButton = document.getElementById("hero-prev");

    const currentNumber = document.getElementById("current-slide");
    const progressBar = document.getElementById("hero-progress-bar");

    const slideDuration = 5000;

    let currentSlide = 0;
    let sliderTimer = null;
    let progressAnimation = null;
    let isPaused = false;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* SHOW SELECTED SLIDE */

    function showSlide(index) {

        slides[currentSlide].classList.remove("active");

        if (dots[currentSlide]) {
            dots[currentSlide].classList.remove("active");
        }

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");

        if (dots[currentSlide]) {
            dots[currentSlide].classList.add("active");
        }

        if (currentNumber) {
            currentNumber.textContent =
                String(currentSlide + 1).padStart(2, "0");
        }

    }


    /* PROGRESS BAR */

    function resetProgress() {

        if (!progressBar) return;

        if (progressAnimation) {
            progressAnimation.cancel();
            progressAnimation = null;
        }

        progressBar.style.width = "0%";

        if (reducedMotion) {
            progressBar.style.width = "100%";
            return;
        }

        if (typeof progressBar.animate === "function") {

            progressAnimation = progressBar.animate(
                [
                    { width: "0%" },
                    { width: "100%" }
                ],
                {
                    duration: slideDuration,
                    easing: "linear",
                    fill: "forwards"
                }
            );

        }

    }


    /* STOP SLIDER */

    function stopSlider() {

        if (sliderTimer) {
            clearInterval(sliderTimer);
            sliderTimer = null;
        }

        if (progressAnimation) {
            progressAnimation.pause();
        }

    }


    /* START SLIDER */

    function startSlider() {

        stopSlider();

        if (
            isPaused ||
            slides.length < 2 ||
            reducedMotion
        ) {
            return;
        }

        resetProgress();

        sliderTimer = setInterval(() => {

            showSlide(currentSlide + 1);
            resetProgress();

        }, slideDuration);

    }


    /* NEXT BUTTON */

    if (nextButton) {

        nextButton.addEventListener("click", () => {

            showSlide(currentSlide + 1);
            startSlider();

        });

    }


    /* PREVIOUS BUTTON */

    if (prevButton) {

        prevButton.addEventListener("click", () => {

            showSlide(currentSlide - 1);
            startSlider();

        });

    }


    /* DOT NAVIGATION */

    dots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            showSlide(index);
            startSlider();

        });

    });


    /* PAUSE ON HOVER */

    if (hero) {

        hero.addEventListener("mouseenter", () => {

            isPaused = true;
            stopSlider();

        });

        hero.addEventListener("mouseleave", () => {

            isPaused = false;
            startSlider();

        });

    }


    /* PAUSE WHEN TAB IS HIDDEN */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopSlider();
        } else {
            startSlider();
        }

    });


    /* INITIALIZE SLIDER */

    if (slides.length > 0) {

        showSlide(0);
        startSlider();

    }


    /* =====================================
       2. MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("show");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });


        /* CLOSE MENU AFTER CLICKING LINK */

        navLinks.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("show");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    console.log("Farajih Designer initialized successfully.");

});



/* =========================
   ABOUT SCROLL ANIMATION
========================= */

const revealElements = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =====================================
   ABOUT SECTION ANIMATIONS
===================================== */

const aboutElements = document.querySelectorAll(
    "[data-reveal-image], [data-reveal-about], [data-reveal-skills]"
);

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            aboutObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

aboutElements.forEach((element) => {
    aboutObserver.observe(element);
});

/* =====================================
   ANIMATED COUNTERS
===================================== */

const aboutCounters = document.querySelectorAll(".about .counter");

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const duration = 1800;
        const startTime = performance.now();

        function animateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOut * target);

            counter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(animateCounter);
        counterObserver.unobserve(counter);
    });
}, {
    threshold: 0.5
});

aboutCounters.forEach((counter) => {
    counterObserver.observe(counter);
});



/* =====================================
   SERVICES TOUCH INTERACTION
===================================== */

const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
        const isActive = card.classList.contains("is-active");

        // Close other cards
        serviceCards.forEach((otherCard) => {
            otherCard.classList.remove("is-active");
            otherCard.setAttribute("aria-expanded", "false");
        });

        // Toggle selected card
        if (!isActive) {
            card.classList.add("is-active");
            card.setAttribute("aria-expanded", "true");
        }
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            card.click();
        }

        if (event.key === "Escape") {
            card.classList.remove("is-active");
            card.setAttribute("aria-expanded", "false");
        }
    });
});

// Close cards when clicking outside
document.addEventListener("click", (event) => {
    if (!event.target.closest(".service-card")) {
        serviceCards.forEach((card) => {
            card.classList.remove("is-active");
            card.setAttribute("aria-expanded", "false");
        });
    }
});
