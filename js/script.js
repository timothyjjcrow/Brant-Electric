document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== "undefined") {
    // Check if AOS is defined
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  // Initialize Rellax for parallax effect - only on desktop/tablet
  if (typeof Rellax !== "undefined" && window.innerWidth >= 768) {
    // Check if Rellax is defined and not on mobile
    const rellax = new Rellax(".parallax-section", {
      speed: -2,
      center: true,
      breakpoints: [576, 768, 1024],
    });

    // Re-initialize Rellax on window resize (debounced)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Destroy and recreate Rellax instance on resize
        if (rellax) {
          rellax.destroy();
        }

        // Only reinitialize on larger screens
        if (window.innerWidth >= 768) {
          const newRellax = new Rellax(".parallax-section", {
            speed: -2,
            center: true,
            breakpoints: [576, 768, 1024],
          });
        }
      }, 250);
    });
  }

  // Sticky Header on Scroll
  const header = document.querySelector("header");
  const heroSection = document.querySelector(".hero"); // Used for other logic, can be null on other pages

  const scrollWatcher = () => {
    if (!header) return; // Defensive check
    // console.log("scrollWatcher fired. ScrollY:", window.scrollY); // For debugging
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", scrollWatcher);
  scrollWatcher(); // Call once on load to set initial header state

  // Mobile navigation toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active"); // Toggle active class on button for X styling
      body.classList.toggle("mobile-menu-active"); // Toggle no-scroll on body

      const isExpanded = navLinks.classList.contains("active");
      navToggle.setAttribute("aria-expanded", isExpanded);
    });

    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !e.target.closest(".nav-links") &&
        !e.target.closest(".nav-toggle")
      ) {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active"); // Ensure X styling is removed
        body.classList.remove("mobile-menu-active"); // Ensure body scroll is restored
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    const mobileLinks = navLinks.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.classList.remove("active"); // Ensure X styling is removed
        body.classList.remove("mobile-menu-active"); // Ensure body scroll is restored
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const hrefAttribute = this.getAttribute("href");
      if (hrefAttribute && hrefAttribute.length > 1) {
        const targetElement = document.querySelector(hrefAttribute);
        if (targetElement) {
          e.preventDefault();
          let headerHeight = 0;
          if (header && header.classList.contains("scrolled")) {
            // Check if header exists
            headerHeight = header.offsetHeight + 20;
          } else if (header) {
            // Check if header exists
            headerHeight = header.offsetHeight + 40;
          }

          const targetPosition =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Scroll indicator fade-out on scroll
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator && heroSection) {
    window.addEventListener("scroll", () => {
      const fadeStart = 50;
      const fadeEnd = 250;
      const opacity = Math.max(
        0,
        1 - (window.scrollY - fadeStart) / (fadeEnd - fadeStart)
      );
      scrollIndicator.style.opacity = opacity.toString();
      scrollIndicator.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
    });

    scrollIndicator.addEventListener("click", () => {
      const firstContentSection = document.querySelector(
        "main > .content-wrapper > section:first-of-type, main > section.container:first-of-type"
      );
      if (firstContentSection && header) {
        // Check if header exists
        let headerOffset = header.classList.contains("scrolled")
          ? header.offsetHeight
          : header.offsetHeight || 95;
        const targetPosition =
          firstContentSection.getBoundingClientRect().top +
          window.pageYOffset -
          headerOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  }

  // Add smooth parallax effect to hero section background - only on desktop/tablet
  if (heroSection && window.innerWidth >= 768) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition < heroSection.offsetHeight) {
        heroSection.style.backgroundPositionY = `calc(50% + ${
          scrollPosition * 0.15
        }px)`;
      }
    });
  }

  // Add smooth parallax effect to .page-header background - only on desktop/tablet
  const pageHeaderSection = document.querySelector(".page-header");
  if (pageHeaderSection && window.innerWidth >= 768) {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      // Only apply effect when the element is somewhat in view and on larger screens
      if (
        scrollPosition <
        pageHeaderSection.offsetHeight + window.innerHeight
      ) {
        const parallaxOffset = Math.max(
          -pageHeaderSection.offsetHeight,
          scrollPosition * 0.15
        );
        pageHeaderSection.style.backgroundPositionY = `calc(60% + ${parallaxOffset}px)`;
      }
    });
  }

  // Update copyright year
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Optional: Basic client-side form validation feedback (example)
  const contactForm = document.querySelector(".contact-form-container form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add("input-error");
        } else {
          field.classList.remove("input-error");
        }
      });

      if (!isValid) {
        event.preventDefault();
        alert("Please fill out all required fields.");
      }
    });
  }
});

/* 
Further JavaScript enhancements could include:
- More sophisticated form validation with inline error messages.
- Image sliders or carousels if used.
- Animations on scroll (Intersection Observer API).
- Fetch requests for dynamic content loading or form submission via AJAX.
- Interactive map integration beyond a simple embed.
*/
