/* ================================================
   SteppingTech — Services Section Logic (services.js)
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Check if services section exists on the page before running
    if (!document.getElementById('s-cards')) return;

    const ic = p => `<i class="${p}"></i>`;

    // Services Data
    const S = [
        {
            t: 'Website Development', i: 'fas fa-desktop', d: 'Modern, responsive websites that make your business look professional online.',
            tag: 'YOUR BUSINESS · YOUR WEBSITE', h: 'A website that works as hard as you do.',
            x: 'We create attractive, responsive websites that introduce your business, communicate your value, and help visitors take the next step.',
            l: ['Business and company websites', 'Landing pages and portfolio websites', 'Responsive layouts for mobile and desktop']
        },
        {
            t: 'E-commerce Websites', i: 'fas fa-shopping-bag', d: 'Online stores designed to showcase products and make buying simple.',
            tag: 'YOUR PRODUCTS · YOUR STORE', h: 'A store that makes buying easy.',
            x: 'We build online shops with clear product pages, smooth carts and secure checkout, so customers can find what they want and pay without friction.',
            l: ['Product catalogue and search', 'Cart, checkout and payment setup', 'Order and inventory management']
        },
        {
            t: 'Web Applications', i: 'fas fa-window-maximize', d: 'Custom online tools and platforms tailored to your workflow and ideas.',
            tag: 'YOUR WORKFLOW · YOUR TOOL', h: 'Software shaped around how you work.',
            x: 'From booking systems to dashboards, we turn your process or idea into a custom web app your team and customers can use from anywhere.',
            l: ['User accounts and dashboards', 'Booking, CRM and admin tools', 'Reports, notifications and automation']
        },
        {
            t: 'UI Design & Redesign', i: 'fas fa-pen-nib', d: 'Clean layouts and intuitive user experiences that feel right on every screen.',
            tag: 'YOUR BRAND · YOUR LOOK', h: 'Design people understand at a glance.',
            x: 'We tidy up confusing pages and design fresh interfaces that look sharp, load fast and guide visitors to the action you want.',
            l: ['Layouts and wireframes', 'Modern redesign of existing sites', 'Colour, type and component styling']
        },
        {
            t: 'Backend & API', i: 'fas fa-server', d: 'The server-side functionality that helps your website and tools work together.',
            tag: 'YOUR DATA · YOUR LOGIC', h: 'The engine behind a smooth experience.',
            x: 'We build secure servers, databases and APIs that power your site and connect it to payments, email and other tools you already use.',
            l: ['REST APIs and databases', 'Login, roles and permissions', 'Payment and email integrations']
        },
        {
            t: 'Website Updates', i: 'fas fa-sync-alt', d: 'Refresh content, improve existing pages, and add features as your business grows.',
            tag: 'YOUR GROWTH · YOUR SITE', h: 'A site that keeps up with you.',
            x: 'Need new pages, fixes or faster performance? We keep your website current, secure and ready for whatever comes next.',
            l: ['Content and page updates', 'Bug fixes and speed improvements', 'New features as you grow']
        }
    ];

    // Data for Slider (Things we build)
    const W = [
        ['Company profile', 0, 'Website'], ['Online boutique', 1, 'E-commerce'], ['Booking platform', 2, 'Web app'],
        ['App redesign', 3, 'UI design'], ['Payments API', 4, 'Backend'], ['Content refresh', 5, 'Updates'],
        ['Portfolio site', 0, 'Website'], ['Product store', 1, 'E-commerce'], ['Admin dashboard', 2, 'Web app']
    ];

    const cardsContainer = document.getElementById('s-cards');
    const panelContainer = document.getElementById('s-panel');
    let currentIndex = 0;

    // Helper: Scroll to Contact Section
    function scrollToContact() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Render Cards
    if(cardsContainer) {
        cardsContainer.innerHTML = S.map((s, k) => `
            <div class="s-card ${k === 0 ? 'active-mobile' : ''}" data-index="${k}" role="tab">
                <div class="s-card-top">
                    <div class="s-icon">${ic(s.i)}</div>
                    <span class="s-num">0${k + 1} / 06</span>
                </div>
                <h3>${s.t}</h3>
                <p>${s.d}</p>
                <div class="s-link">Explore service <i class="fas fa-arrow-up-right"></i></div>
            </div>
        `).join('');
    }

    const cardElements = cardsContainer ? cardsContainer.querySelectorAll('.s-card') : [];

    // Function to update Desktop Panel
    function updatePanel(index) {
        if(!panelContainer) return;
        currentIndex = index;
        const s = S[index];

        cardElements.forEach((c, i) => {
            c.classList.toggle('active', i === index);
            if(window.innerWidth <= 650) {
                c.classList.toggle('active-mobile', i === index);
            }
        });

        if(window.innerWidth > 650) {
            panelContainer.innerHTML = `
                <div class="s-panel-head">
                    <span><i class="dot"></i> SERVICE DETAILS</span>
                    <span>0${index + 1} — 06</span>
                </div>
                
                <div class="s-panel-icon">${ic(s.i)}</div>
                <div class="s-panel-tag">${s.tag}</div>
                <h3>${s.h}</h3>
                <p>${s.x}</p>
                
                <div class="s-divider"></div>
                
                <div class="s-features-title">WHAT WE CAN CREATE</div>
                <ul>
                    ${s.l.map(item => `<li><i class="far fa-check-circle"></i> ${item}</li>`).join('')}
                </ul>

                <div class="s-panel-foot">
                    <button class="s-btn" id="goToContactBtn">Start a project <i class="fas fa-arrow-up-right"></i></button>
                    <span class="s-note"><i class="far fa-comment-dots"></i> Let's discuss</span>
                </div>
            `;

            const goToContactBtn = panelContainer.querySelector('#goToContactBtn');
            if(goToContactBtn) {
                goToContactBtn.addEventListener('click', scrollToContact);
            }
        }
    }

    // Attach events to Cards
    cardElements.forEach((card) => {
        card.addEventListener('click', () => updatePanel(parseInt(card.dataset.index)));
        if(window.innerWidth > 650) {
            card.addEventListener('mouseenter', () => updatePanel(parseInt(card.dataset.index)));
        }
    });

    // ================================================
    // MOVING SLIDER LOGIC (AUTO SLIDER)
    // ================================================
    const track = document.getElementById('s-track');

    if(track) {
        const slideHTML = W.map(([t, k, g]) => `
            <button type="button" class="s-slide" data-index="${k}">
                <div class="s-mock"><i></i><i></i><i></i></div>
                <b>${t}</b><span>${g}</span>
            </button>
        `).join('');

        // Double the HTML to create seamless infinite loop
        track.innerHTML = `<div class="s-group">${slideHTML}</div><div class="s-group">${slideHTML}</div>`;

        // Click event for slider items
        track.addEventListener('click', e => {
            const slide = e.target.closest('.s-slide');
            if(slide) {
                e.preventDefault(); 
                updatePanel(parseInt(slide.dataset.index));
                const servicesSection = document.getElementById('services');
                if(servicesSection) servicesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // 🔥 PAUSE / PLAY LOGIC (FIXED)
        const pauseBtn = document.getElementById('s-pause');
        const statusText = document.getElementById('s-ticker-status');

        if(pauseBtn && track) {
            pauseBtn.addEventListener('click', () => {
                // Track par 'paused' class toggle karein
                const isPaused = track.classList.toggle('paused');
                
                // Button ka text aur icon badlein
                pauseBtn.innerHTML = isPaused ? '▶&nbsp; Play' : 'Ⅱ&nbsp; Pause';
                pauseBtn.setAttribute('aria-pressed', isPaused);
                
                if(statusText) {
                    statusText.textContent = isPaused ? 'SLIDING PAUSED' : 'AUTO SLIDING';
                }
            });
        }
    }

    // Initialize First Panel on Load
    updatePanel(0);
});
