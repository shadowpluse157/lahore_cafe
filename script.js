/* =========================================================
   LAHORE CAFÉ — MASTER JAVASCRIPT
   Premium 3D Café Experience
   ========================================================= */

"use strict";

/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initScrollReveal();
    initActiveNavigation();
    init3DTilt();
    initCursorGlow();
    initCounters();
    initParallax();
    initSmoothScroll();
    initContactForm();
    initMenuFilter();
    initFloatingElements();
});


/* =========================================================
   02. NAVIGATION
========================================================= */

function initNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav-links");

    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
        toggle.classList.toggle("active");

        const expanded = nav.classList.contains("active");
        toggle.setAttribute("aria-expanded", expanded);
    });

    const links = nav.querySelectorAll("a");

    links.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", event => {
        if (
            !nav.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            nav.classList.remove("active");
            toggle.classList.remove("active");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}


/* =========================================================
   03. HEADER SCROLL EFFECT
========================================================= */

const header = document.querySelector(".site-header");

window.addEventListener(
    "scroll",
    () => {
        if (!header) return;

        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    },
    { passive: true }
);


/* =========================================================
   04. SCROLL REVEAL
========================================================= */

function initScrollReveal() {
    const elements = document.querySelectorAll(
        ".reveal, .reveal-up, .reveal-left, .reveal-right, .glass-card, .menu-card, .story-card, .contact-card"
    );

    if (!elements.length) return;

    elements.forEach((element, index) => {
        element.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 70, 500)}ms`
        );
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    elements.forEach(element => observer.observe(element));
}


/* =========================================================
   05. ACTIVE NAVIGATION
========================================================= */

function initActiveNavigation() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const links = document.querySelectorAll(".nav-links a");

    if (!links.length) return;

    links.forEach(link => {
        const href = link.getAttribute("href");

        if (!href) return;

        const linkPage = href
            .split("/")
            .pop()
            .split("#")[0]
            .toLowerCase();

        if (
            (currentPage === "" && linkPage === "index.html") ||
            currentPage === linkPage
        ) {
            link.classList.add("active");
        }
    });
}


/* =========================================================
   06. 3D TILT EFFECT
========================================================= */

function init3DTilt() {
    const cards = document.querySelectorAll(
        ".tilt-card, .menu-card, .glass-card, .story-card, .contact-card, .stat-card"
    );

    if (!cards.length) return;

    const isTouch =
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) return;

    cards.forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -5;

            const rotateY =
                ((x - centerX) / centerX) * 5;

            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
            `;

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}


/* =========================================================
   07. CURSOR GLOW
========================================================= */

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");

    if (!glow) return;

    const supportsPointer =
        window.matchMedia("(hover: hover)").matches;

    if (!supportsPointer) {
        glow.style.display = "none";
        return;
    }

    window.addEventListener(
        "mousemove",
        event => {
            glow.style.left = `${event.clientX}px`;
            glow.style.top = `${event.clientY}px`;
        },
        { passive: true }
    );
}


/* =========================================================
   08. ANIMATED COUNTERS
========================================================= */

function initCounters() {
    const counters = document.querySelectorAll(
        "[data-counter]"
    );

    if (!counters.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;
                const target = parseInt(
                    counter.getAttribute("data-counter"),
                    10
                );

                if (Number.isNaN(target)) return;

                animateCounter(counter, target);

                observer.unobserve(counter);
            });
        },
        {
            threshold: 0.7
        }
    );

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(
            elapsed / duration,
            1
        );

        const eased =
            1 - Math.pow(1 - progress, 4);

        const currentValue = Math.floor(
            eased * target
        );

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}


/* =========================================================
   09. PARALLAX EFFECT
========================================================= */

function initParallax() {
    const elements = document.querySelectorAll(
        "[data-parallax]"
    );

    if (!elements.length) return;

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) return;

    window.addEventListener(
        "scroll",
        () => {
            const scrollY = window.scrollY;

            elements.forEach(element => {
                const speed =
                    parseFloat(
                        element.dataset.parallax
                    ) || 0.15;

                const rect =
                    element.getBoundingClientRect();

                if (
                    rect.bottom < 0 ||
                    rect.top > window.innerHeight
                ) {
                    return;
                }

                element.style.transform =
                    `translate3d(0, ${scrollY * speed}px, 0)`;
            });
        },
        { passive: true }
    );
}


/* =========================================================
   10. SMOOTH SCROLL
========================================================= */

function initSmoothScroll() {
    const links = document.querySelectorAll(
        'a[href^="#"]'
    );

    links.forEach(link => {
        link.addEventListener("click", event => {
            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
}


/* =========================================================
   11. CONTACT FORM
========================================================= */

function initContactForm() {
    const form =
        document.querySelector(".contact-form");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name =
            form.querySelector(
                'input[name="name"]'
            );

        const email =
            form.querySelector(
                'input[name="email"]'
            );

        const message =
            form.querySelector(
                'textarea[name="message"]'
            );

        if (
            !name ||
            !email ||
            !message
        ) {
            showFormMessage(
                form,
                "Please fill in all required fields."
            );
            return;
        }

        if (
            name.value.trim() === "" ||
            email.value.trim() === "" ||
            message.value.trim() === ""
        ) {
            showFormMessage(
                form,
                "Please complete all required fields."
            );
            return;
        }

        const button =
            form.querySelector(
                'button[type="submit"]'
            );

        if (button) {
            button.disabled = true;
            button.textContent = "Sending...";
        }

        setTimeout(() => {
            showFormMessage(
                form,
                "Thank you! Your message has been received."
            );

            form.reset();

            if (button) {
                button.disabled = false;
                button.textContent = "Send Message";
            }
        }, 900);
    });
}

function showFormMessage(form, message) {
    let status =
        form.querySelector(".form-status");

    if (!status) {
        status = document.createElement("div");
        status.className = "form-status";

        form.appendChild(status);
    }

    status.textContent = message;

    status.classList.add("show");

    setTimeout(() => {
        status.classList.remove("show");
    }, 4500);
}


/* =========================================================
   12. MENU FILTER
========================================================= */

function initMenuFilter() {
    const buttons =
        document.querySelectorAll(
            "[data-filter]"
        );

    const items =
        document.querySelectorAll(
            "[data-category]"
        );

    if (
        !buttons.length ||
        !items.length
    ) {
        return;
    }

    buttons.forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const filter =
                    button.dataset.filter;

                buttons.forEach(btn => {
                    btn.classList.remove(
                        "active"
                    );
                });

                button.classList.add("active");

                items.forEach(item => {
                    const category =
                        item.dataset.category;

                    if (
                        filter === "all" ||
                        category === filter
                    ) {
                        item.classList.remove(
                            "hidden"
                        );

                        requestAnimationFrame(() => {
                            item.classList.add(
                                "filter-visible"
                            );
                        });
                    } else {
                        item.classList.remove(
                            "filter-visible"
                        );

                        item.classList.add(
                            "hidden"
                        );
                    }
                });
            }
        );
    });
}


/* =========================================================
   13. FLOATING ELEMENTS
========================================================= */

function initFloatingElements() {
    const elements =
        document.querySelectorAll(
            ".floating, .float-card, .hero-orb"
        );

    if (!elements.length) return;

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reducedMotion) return;

    elements.forEach((element, index) => {
        const delay =
            (index % 5) * 0.7;

        const duration =
            4 + (index % 3);

        element.style.animationDelay =
            `${delay}s`;

        element.style.animationDuration =
            `${duration}s`;
    });
}


/* =========================================================
   14. HERO MOUSE MOVEMENT
========================================================= */

const hero =
    document.querySelector(".hero");

if (hero) {
    const heroVisual =
        hero.querySelector(".hero-visual");

    if (heroVisual) {
        const supportsPointer =
            window.matchMedia(
                "(hover: hover)"
            ).matches;

        if (supportsPointer) {
            hero.addEventListener(
                "mousemove",
                event => {
                    const rect =
                        hero.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                        rect.width;

                    const y =
                        (event.clientY -
                            rect.top) /
                        rect.height;

                    const moveX =
                        (x - 0.5) * 18;

                    const moveY =
                        (y - 0.5) * 18;

                    heroVisual.style.transform =
                        `translate3d(${moveX}px, ${moveY}px, 0)`;
                }
            );

            hero.addEventListener(
                "mouseleave",
                () => {
                    heroVisual.style.transform =
                        "";
                }
            );
        }
    }
}


/* =========================================================
   15. IMAGE LAZY LOADING
========================================================= */

document
    .querySelectorAll("img")
    .forEach(image => {
        image.loading = "lazy";

        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );
            }
        );
    });


/* =========================================================
   16. BUTTON RIPPLE EFFECT
========================================================= */

document
    .querySelectorAll(
        ".btn, .button, .menu-btn"
    )
    .forEach(button => {
        button.addEventListener(
            "click",
            function (event) {
                const rect =
                    this.getBoundingClientRect();

                const ripple =
                    document.createElement(
                        "span"
                    );

                ripple.className =
                    "button-ripple";

                const size = Math.max(
                    rect.width,
                    rect.height
                );

                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;

                ripple.style.left =
                    `${event.clientX - rect.left - size / 2}px`;

                ripple.style.top =
                    `${event.clientY - rect.top - size / 2}px`;

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 650);
            }
        );
    });


/* =========================================================
   17. SCROLL PROGRESS
========================================================= */

function createScrollProgress() {
    if (
        document.querySelector(
            ".scroll-progress"
        )
    ) {
        return;
    }

    const progress =
        document.createElement("div");

    progress.className =
        "scroll-progress";

    document.body.appendChild(progress);

    window.addEventListener(
        "scroll",
        () => {
            const scrollTop =
                window.scrollY;

            const scrollHeight =
                document.documentElement
                    .scrollHeight -
                window.innerHeight;

            const percentage =
                scrollHeight > 0
                    ? (scrollTop /
                          scrollHeight) *
                      100
                    : 0;

            progress.style.width =
                `${percentage}%`;
        },
        { passive: true }
    );
}

createScrollProgress();


/* =========================================================
   18. CURRENT YEAR
========================================================= */

document
    .querySelectorAll("[data-year]")
    .forEach(element => {
        element.textContent =
            new Date().getFullYear();
    });


/* =========================================================
   19. PAGE LOADER
========================================================= */

window.addEventListener("load", () => {
    document.body.classList.add(
        "page-loaded"
    );

    const loader =
        document.querySelector(
            ".page-loader"
        );

    if (loader) {
        setTimeout(() => {
            loader.classList.add(
                "hidden"
            );

            setTimeout(() => {
                loader.remove();
            }, 700);
        }, 350);
    }
});


/* =========================================================
   20. KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (event.key === "Escape") {
            const nav =
                document.querySelector(
                    ".nav-links"
                );

            const toggle =
                document.querySelector(
                    ".nav-toggle"
                );

            if (nav) {
                nav.classList.remove(
                    "active"
                );
            }

            if (toggle) {
                toggle.classList.remove(
                    "active"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    }
);


/* =========================================================
   21. PERFORMANCE SAFE RESIZE
========================================================= */

let resizeTimeout;

window.addEventListener(
    "resize",
    () => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            document.body.classList.add(
                "resized"
            );

            setTimeout(() => {
                document.body.classList.remove(
                    "resized"
                );
            }, 200);
        }, 150);
    },
    { passive: true }
);


/* =========================================================
   22. REDUCED MOTION SUPPORT
========================================================= */

const reducedMotionQuery =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

if (reducedMotionQuery.matches) {
    document.documentElement.classList.add(
        "reduce-motion"
    );
}

reducedMotionQuery.addEventListener(
    "change",
    event => {
        if (event.matches) {
            document.documentElement.classList.add(
                "reduce-motion"
            );
        } else {
            document.documentElement.classList.remove(
                "reduce-motion"
            );
        }
    }
);


/* =========================================================
   LAHORE CAFÉ — END
========================================================= */