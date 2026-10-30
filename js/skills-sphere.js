document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if(typeof lucide !== 'undefined') lucide.createIcons();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 2. Reveal Animations on Scroll
    const revealItems = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    // 3. 3D Tilt Effect on Cards & Chips (Desktop Only)
    const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion;
    if (canTilt) {
        document.querySelectorAll(".skill-group").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * 7;
                const rotateX = (0.5 - (y / rect.height)) * 7;
                card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
                card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            });
            card.addEventListener("pointerleave", () => {
                card.style.transform = "";
                card.style.setProperty("--mouse-x", "50%");
                card.style.setProperty("--mouse-y", "50%");
            });
        });

        document.querySelectorAll(".skill-chip").forEach((chip) => {
            chip.addEventListener("pointermove", (event) => {
                const rect = chip.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                chip.style.transform = `translateY(-3px) rotateX(${(-y * 9)}deg) rotateY(${x * 9}deg)`;
            });
            chip.addEventListener("pointerleave", () => {
                chip.style.transform = "";
            });
        });
    }

    // 4. 3D Sphere Logic
    const sphere = document.getElementById("skills-sphere");
    const sphereName = document.getElementById("sphere-name");
    const sphereHint = document.getElementById("sphere-hint");

    if(!sphere) return;

    const sphereSkills = [
        ["Java", "coffee"], ["JavaScript", "file-code-2"], ["HTML5", "code"],
        ["CSS3", "palette"], ["SQL", "database"], ["Spring Boot", "leaf"],
        ["Bootstrap", "layout-template"], ["Tailwind CSS", "wind"], ["PostgreSQL", "database"],
        ["REST API", "network"], ["VS Code", "code-2"], ["IntelliJ IDEA", "panels-top-left"],
        ["Git", "git-branch"], ["GitHub", "fa-brands fa-github"],
        ["Postman", "send"], ["Apidog", "radio-tower"], ["Vercel", "cloud-upload"], 
        ["Netlify", "globe"], ["Responsive Design", "smartphone"]
    ];

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    const sphereNodes = sphereSkills.map(([name, iconName], i) => {
        const y = 1 - (i / (sphereSkills.length - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = i * goldenAngle;

        const node = document.createElement("div");
        node.className = "sphere-node";

        if (iconName.startsWith("fa-")) {
            node.innerHTML = `<i class="${iconName}"></i>`;
        } else {
            node.innerHTML = `<i data-lucide="${iconName}"></i>`;
        }

        node.title = name;
        sphere.appendChild(node);

        node.addEventListener("pointerenter", () => {
            node.classList.add("active");
            sphereName.textContent = name.toUpperCase();
            sphereHint.textContent = "SKILL";
        });
        node.addEventListener("pointerleave", () => {
            node.classList.remove("active");
            sphereName.textContent = "FULL-STACK";
            sphereHint.textContent = "Drag or hover";
        });

        return { node, x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
    });

    if(typeof lucide !== 'undefined') lucide.createIcons();

    let sphereAx = 0.3, sphereAy = 0, sphereVx = 0.002, sphereVy = 0.006;
    let targetVx = sphereVx, targetVy = sphereVy;
    let sphereHover = false, sphereDragging = false;
    let lastPointerX = 0, lastPointerY = 0, sphereVisible = true;

    sphere.addEventListener("pointerenter", () => sphereHover = true);
    sphere.addEventListener("pointerleave", () => {
        sphereHover = false;
        sphereDragging = false;
        sphere.classList.remove("dragging");
    });

    sphere.addEventListener("pointermove", event => {
        const rect = sphere.getBoundingClientRect();
        if (sphereDragging) {
            sphereAy += (event.clientX - lastPointerX) * 0.012;
            sphereAx -= (event.clientY - lastPointerY) * 0.012;
            lastPointerX = event.clientX;
            lastPointerY = event.clientY;
        } else {
            targetVy = ((event.clientX - rect.left) / rect.width - 0.5) * 0.05;
            targetVx = -((event.clientY - rect.top) / rect.height - 0.5) * 0.05;
        }
    });

    sphere.addEventListener("pointerdown", event => {
        sphereDragging = true;
        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        sphere.classList.add("dragging");
        if (sphere.setPointerCapture) sphere.setPointerCapture(event.pointerId);
    });

    sphere.addEventListener("pointerup", () => {
        sphereDragging = false;
        sphere.classList.remove("dragging");
    });

    function animateSphere() {
        if (sphereVisible) {
            if (!sphereHover) { targetVx = 0.002; targetVy = 0.006; }
            if (sphereDragging) { targetVx = 0; targetVy = 0; }

            sphereVx += (targetVx - sphereVx) * 0.06;
            sphereVy += (targetVy - sphereVy) * 0.06;

            if (!reducedMotion) {
                sphereAx += sphereVx;
                sphereAy += sphereVy;
            }

            const radius = sphere.clientWidth * 0.39;
            const cx = Math.cos(sphereAx), sx = Math.sin(sphereAx);
            const cy = Math.cos(sphereAy), sy = Math.sin(sphereAy);

            sphereNodes.forEach(point => {
                const x1 = point.x * cy + point.z * sy;
                const z1 = -point.x * sy + point.z * cy;
                const y1 = point.y * cx - z1 * sx;
                const z2 = point.y * sx + z1 * cx;
                const depth = (z2 + 1) / 2;

                point.node.style.transform = `translate3d(${x1 * radius}px, ${y1 * radius}px, 0) scale(${0.65 + depth * 0.5})`;
                point.node.style.opacity = 0.3 + depth * 0.7;
                point.node.style.zIndex = Math.round(depth * 100);
            });
        }
        requestAnimationFrame(animateSphere);
    }

    const sphereObserver = new IntersectionObserver(entries => {
        sphereVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });

    sphereObserver.observe(sphere);
    animateSphere();

    // ================================================
    // 5. MOBILE MARQUEE CHIPS GENERATOR
    // ================================================
    const marqueeTrack = document.getElementById('mobileMarquee');
    
    if(marqueeTrack) {
        // Chips ka HTML generate karein
        let chipsHTML = '';
        sphereSkills.forEach(([name, icon]) => {
            if (icon.startsWith("fa-")) {
                chipsHTML += `<span class="skill-chip"><i class="${icon}"></i> ${name}</span>`;
            } else {
                chipsHTML += `<span class="skill-chip"><i data-lucide="${icon}"></i> ${name}</span>`;
            }
        });

        // Infinite loop ke liye track ko double karein
        marqueeTrack.innerHTML = chipsHTML + chipsHTML; 

        // Naye chips ke icons render karein
        if(typeof lucide !== 'undefined') lucide.createIcons();
    }
});
