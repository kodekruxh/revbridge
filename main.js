document.addEventListener('DOMContentLoaded', () => {

    // ---------- Spinner ----------
    const spinner = document.getElementById('spinner');
    const hideSpinner = () => spinner && spinner.classList.remove('show');

    document.querySelectorAll('video').forEach(v =>
        v.addEventListener('canplaythrough', hideSpinner)
    );
    window.addEventListener('load', hideSpinner);
    if (document.readyState === 'complete') hideSpinner();

    // ---------- WOW.js (not a jQuery plugin) ----------
    if (typeof WOW !== 'undefined') new WOW().init();

    // ---------- Sticky navbar + back to top (one scroll listener) ----------
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    const onScroll = () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('sticky-top', y > 45);
        if (navbar) navbar.classList.toggle('shadow-sm', y > 45);
        if (backToTop) backToTop.style.display = y > 100 ? 'flex' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Dropdown on hover (desktop only) ----------
    const desktop = window.matchMedia('(min-width: 992px)');
    const megaVideo = document.getElementById('megaVideo');

    document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        const open = () => {
            if (!desktop.matches) return;
            dropdown.classList.add('show');
            menu.classList.add('show');
            toggle.setAttribute('aria-expanded', 'true');
            if (megaVideo && dropdown.contains(megaVideo)) megaVideo.play().catch(() => {});
        };
        const close = () => {
            if (!desktop.matches) return;
            dropdown.classList.remove('show');
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
            if (megaVideo && dropdown.contains(megaVideo)) {
                megaVideo.pause();
                megaVideo.currentTime = 0;
            }
        };

        dropdown.addEventListener('mouseenter', open);
        dropdown.addEventListener('mouseleave', close);

        // Mobile: Bootstrap handles tap open/close, we only control the video
        dropdown.addEventListener('shown.bs.dropdown', () => {
            if (!desktop.matches && megaVideo && dropdown.contains(megaVideo)) megaVideo.play().catch(() => {});
        });
        dropdown.addEventListener('hidden.bs.dropdown', () => {
            if (!desktop.matches && megaVideo && dropdown.contains(megaVideo)) {
                megaVideo.pause();
                megaVideo.currentTime = 0;
            }
        });
    });

    // ---------- Facts counter (replaces the counterUp plugin) ----------
    const counters = document.querySelectorAll('[data-toggle="counter-up"]');
    if (counters.length) {
        const animate = (el) => {
            const target = parseFloat(el.textContent.replace(/,/g, '')) || 0;
            const duration = 2000;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(target * progress).toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    // ---------- FAQ toggle ----------
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach(el => {
        el.addEventListener('click', () => el.parentNode.classList.toggle('faq-active'));
    });

    // ---------- Owl carousels (jQuery plugin, only runs if present) ----------
    if (window.jQuery && jQuery.fn.owlCarousel) {
        jQuery('.testimonial-carousel').owlCarousel({
            autoplay: true, smartSpeed: 1500, dots: true, loop: true, center: true,
            responsive: { 0: { items: 1 }, 576: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } }
        });
        jQuery('.vendor-carousel').owlCarousel({
            loop: true, margin: 30, dots: false, autoplay: true, smartSpeed: 1000,
            responsive: { 0: { items: 2 }, 576: { items: 3 }, 768: { items: 4 }, 992: { items: 5 } }
        });
    }
});