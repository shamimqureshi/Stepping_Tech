/* ================================================
   SteppingTech — Main UI Logic (main.js)
   Fixed: reveal class (active), removed duplicate contact handler,
          autoplay timer cleanup
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // 1. NAVBAR SCROLL EFFECT
    // ================================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });
    }

    // ================================================
    // 2. MOBILE MENU TOGGLE
    // ================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('active')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }
        });
    }

    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // ================================================
    // 3. HERO LOGO 3D TILT
    // ================================================
    const logoCard = document.getElementById('logoCard');
    if (logoCard && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
        logoCard.addEventListener('mousemove', (e) => {
            const rect = logoCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rx = ((y - cy) / cy) * -10;
            const ry = ((x - cx) / cx) * 10;
            logoCard.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
            logoCard.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
            logoCard.style.setProperty('--my', `${(y / rect.height) * 100}%`);
        });
        logoCard.addEventListener('mouseleave', () => {
            logoCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            logoCard.style.setProperty('--mx', '50%');
            logoCard.style.setProperty('--my', '50%');
        });
    }

    // ================================================
    // 4. HERO WORD ROTATOR
    // ================================================
    const rotatingWord = document.getElementById('rotatingWord');
    if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const words = ['full-stack', 'scalable', 'modern', 'interactive'];
        let index = 0;
        rotatingWord.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        rotatingWord.style.display = 'inline-block';

        const rotatorInterval = setInterval(() => {
            rotatingWord.style.opacity = '0';
            rotatingWord.style.transform = 'translateY(10px)';
            setTimeout(() => {
                index = (index + 1) % words.length;
                rotatingWord.textContent = words[index];
                rotatingWord.style.opacity = '1';
                rotatingWord.style.transform = 'translateY(0)';
            }, 300);
        }, 3000);

        // Cleanup on page unload (harmless but tidy)
        window.addEventListener('beforeunload', () => clearInterval(rotatorInterval));
    }

    // ================================================
    // 5. SCROLL REVEAL  →  uses `active` (matches CSS)
    // ================================================
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');   // ✅ was 'is-visible'
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('active'));
        }
    }

    // Contact form is handled exclusively in contact.js (mailto:). No duplicate here.
});