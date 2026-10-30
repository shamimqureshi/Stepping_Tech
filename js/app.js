/* ================================================
   SteppingTech — Backend API Logic (app.js)
   ================================================ */

// Note: When you deploy, change this to your Render/Live URL
const API_URL = const API_URL = 'https://steppingtechfullstack.onrender.com/api';

// XSS-safe string escaper for inline onclick handlers
function esc(str) {
    return String(str ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/\n/g, ' ');
}

document.addEventListener('DOMContentLoaded', () => {

    // ================================================
    // 0) AUTHENTICATION STATE & UI TOGGLING
    // ================================================
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';

    function applyAdminState() {
        const addProjectBtn     = document.getElementById('addProjectBtn');
        const addTestimonialBtn = document.getElementById('addTestimonialBtn');
        const logoutBtn         = document.getElementById('adminLogoutBtn');
        const logoutBtnMobile   = document.getElementById('adminLogoutBtnMobile');

        if (isAdmin) {
            // 🔥 SHOW ADMIN ELEMENTS
            if (addProjectBtn)     addProjectBtn.style.display = 'inline-flex';
            if (addTestimonialBtn) addTestimonialBtn.style.display = 'inline-flex';
            
            // Show Desktop Logout
            if (logoutBtn) {
                logoutBtn.classList.remove('hidden');
                logoutBtn.classList.add('admin-btn'); 
            }
            // Show Mobile Logout
            if (logoutBtnMobile) {
                logoutBtnMobile.classList.remove('hidden');
                logoutBtnMobile.classList.add('mobile-admin');
            }
        } else {
            // 🔥 HIDE ADMIN ELEMENTS (For public users)
            if (addProjectBtn)     addProjectBtn.style.display = 'none';
            if (addTestimonialBtn) addTestimonialBtn.style.display = 'none';
            
            if (logoutBtn)         logoutBtn.classList.add('hidden');
            if (logoutBtnMobile)   logoutBtnMobile.classList.add('hidden');
        }
    }

    // Run the state check immediately
    applyAdminState();

    // ================================================
    // LOGOUT FUNCTION
    // ================================================
    window.logoutAdmin = function () {
        localStorage.removeItem('isAdminLoggedIn');
        window.location.reload();
    };

    // ================================================
    // 1) PROJECTS LOGIC
    // ================================================
    function loadProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = '<div style="text-align:center; padding:2rem; color:var(--text-muted);">Loading projects…</div>';

        fetch(`${API_URL}/projects`)
            .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
            .then(projects => {
                grid.innerHTML = '';
                if (!Array.isArray(projects) || projects.length === 0) {
                    grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; grid-column:1/-1;">No projects added yet.</p>';
                    return;
                }

                projects.forEach(project => {
                    const tagsHTML = project.tags ? project.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : '';
                    const imageHTML = project.imageUrl ? `<img src="${project.imageUrl}" style="width:100%; height:100%; object-fit:cover;" alt="${esc(project.title)}">` : `<div style="font-size:3rem; color:var(--border);"><i class="fas fa-code"></i></div>`;
                    const linkHTML = project.liveLink && project.liveLink.trim() !== '' && project.liveLink !== '#' ? `<a href="${project.liveLink}" target="_blank" rel="noopener noreferrer" style="font-size:0.8rem; color:var(--brand); border:1px solid var(--brand); padding:0.2rem 0.6rem; border-radius:4px; text-decoration:none;">Live <i class="fas fa-external-link-alt"></i></a>` : '';

                    // Only show admin buttons if isAdmin is true
                    const adminActions = isAdmin ? `
                        <div style="position:absolute; top:10px; right:10px; display:flex; gap:5px; z-index:10;">
                            <button onclick="openUpdateProject(${project.id}, '${esc(project.title)}', '${esc(project.description)}', '${esc(project.tags)}', '${esc(project.imageUrl)}', '${esc(project.liveLink)}')" style="background:#3b82f6; color:white; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer;" title="Edit"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteProject(${project.id})" style="background:#ef4444; color:white; border:none; border-radius:50%; width:32px; height:32px; cursor:pointer;" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    ` : '';

                    const card = `
                        <div class="project-card" style="position:relative;">
                            ${adminActions}
                            <div class="project-img" style="height:180px; background:var(--surface-2); display:flex; align-items: center; justify-content: center;">${imageHTML}</div>
                            <div class="project-content">
                                <div class="project-header"><div class="sq-badge">SQ</div>${linkHTML}</div>
                                <h3 style="font-size:1.2rem; font-weight:bold;">${project.title}</h3>
                                <p style="color:var(--text-muted);">${project.description}</p>
                                <div class="project-tags">${tagsHTML}</div>
                            </div>
                        </div>
                    `;
                    grid.insertAdjacentHTML('beforeend', card);
                });
            })
            .catch(err => {
                console.error('loadProjects failed:', err);
                grid.innerHTML = '<p style="color:#ef4444; text-align:center; grid-column:1/-1;">Could not load projects. Please check backend connection.</p>';
            });
    }

    // Add Project
    const addForm = document.getElementById('addProjectForm');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newProject = { 
                title: document.getElementById('title').value, 
                description: document.getElementById('description').value, 
                tags: document.getElementById('tags').value, 
                imageUrl: document.getElementById('imageUrl').value, 
                liveLink: document.getElementById('liveLink').value 
            };
            try {
                await fetch(`${API_URL}/projects`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(newProject) 
                });
                e.target.reset(); 
                toggleAdminPanel(); 
                loadProjects();
            } catch (error) {
                console.error('Error adding project:', error);
            }
        });
    }

    // Update Project
    window.openUpdateProject = function(id, title, desc, tags, img, link) {
        document.getElementById('u-id').value = id; 
        document.getElementById('u-title').value = title; 
        document.getElementById('u-description').value = desc; 
        document.getElementById('u-tags').value = tags || ''; 
        document.getElementById('u-imageUrl').value = img || ''; 
        document.getElementById('u-liveLink').value = link || '';
        document.getElementById('updateProjectModal').classList.add('open');
    };
    
    window.toggleUpdateProjectPanel = function() { 
        document.getElementById('updateProjectModal').classList.remove('open'); 
    };

    const updateForm = document.getElementById('updateProjectForm');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('u-id').value;
            const updatedProject = { 
                title: document.getElementById('u-title').value, 
                description: document.getElementById('u-description').value, 
                tags: document.getElementById('u-tags').value, 
                imageUrl: document.getElementById('u-imageUrl').value, 
                liveLink: document.getElementById('u-liveLink').value 
            };
            try {
                await fetch(`${API_URL}/projects/${id}`, { 
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updatedProject) 
                });
                toggleUpdateProjectPanel(); 
                loadProjects();
            } catch (error) {
                console.error('Error updating project:', error);
            }
        });
    }

    // Delete Project
    window.deleteProject = async function(id) {
        if(!confirm("Are you sure you want to delete this project?")) return;
        try {
            await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' }); 
            loadProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };
    
    window.toggleAdminPanel = function() { 
        document.getElementById('addProjectModal').classList.toggle('open'); 
    };

    // ================================================
    // 2) TESTIMONIALS LOGIC
    // ================================================
    function loadTestimonials() {
        const grid = document.getElementById('testimonialsGrid');
        if (!grid) return;

        fetch(`${API_URL}/testimonials`)
            .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
            .then(data => {
                grid.innerHTML = '';
                if (!Array.isArray(data) || data.length === 0) {
                    grid.innerHTML = '<p style="text-align:center; color:var(--text-muted); grid-column:1/-1;">No reviews yet.</p>';
                    return;
                }

                data.forEach(t => {
                    const adminActions = isAdmin ? `
                        <div style="position:absolute; top:10px; right:10px; display:flex; gap:5px; z-index:10;">
                            <button onclick="openUpdateTestimonial(${t.id}, '${esc(t.name)}', '${esc(t.role)}', '${esc(t.text)}')" style="background:#3b82f6; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;" title="Edit"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteTestimonial(${t.id})" style="background:#ef4444; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    ` : '';

                    grid.insertAdjacentHTML('beforeend', `
                        <div class="t-card" style="position:relative;">
                            ${adminActions}
                            <div class="t-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                            <p class="t-text">"${t.text}"</p>
                            <div class="t-author"><div class="t-avatar">${(t.name || '?').charAt(0).toUpperCase()}</div><div><h4>${t.name}</h4><span>${t.role}</span></div></div>
                        </div>
                    `);
                });
            })
            .catch(err => {
                console.error('loadTestimonials failed:', err);
                grid.innerHTML = '<p style="color:#ef4444; text-align:center; grid-column:1/-1;">Could not load testimonials. Please check backend connection.</p>';
            });
    }

    // Add Testimonial
    const addTForm = document.getElementById('addTestimonialForm');
    if (addTForm) {
        addTForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newT = { 
                name: document.getElementById('t-name').value, 
                role: document.getElementById('t-role').value, 
                text: document.getElementById('t-text').value 
            };
            try {
                await fetch(`${API_URL}/testimonials`, { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(newT) 
                });
                e.target.reset(); 
                toggleTestimonialPanel(); 
                loadTestimonials();
            } catch (error) {
                console.error('Error adding testimonial:', error);
            }
        });
    }

    // Update Testimonial
    window.openUpdateTestimonial = function(id, name, role, text) {
        document.getElementById('u-t-id').value = id; 
        document.getElementById('u-t-name').value = name; 
        document.getElementById('u-t-role').value = role; 
        document.getElementById('u-t-text').value = text;
        document.getElementById('updateTestimonialModal').classList.add('open');
    };
    
    window.toggleUpdateTestimonialPanel = function() { 
        document.getElementById('updateTestimonialModal').classList.remove('open'); 
    };

    const updateTForm = document.getElementById('updateTestimonialForm');
    if (updateTForm) {
        updateTForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('u-t-id').value;
            const updatedT = { 
                name: document.getElementById('u-t-name').value, 
                role: document.getElementById('u-t-role').value, 
                text: document.getElementById('u-t-text').value 
            };
            try {
                await fetch(`${API_URL}/testimonials/${id}`, { 
                    method: 'PUT', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(updatedT) 
                });
                toggleUpdateTestimonialPanel(); 
                loadTestimonials();
            } catch (error) {
                console.error('Error updating testimonial:', error);
            }
        });
    }

    // Delete Testimonial
    window.deleteTestimonial = async function(id) {
        if(!confirm("Are you sure you want to delete this review?")) return;
        try {
            await fetch(`${API_URL}/testimonials/${id}`, { method: 'DELETE' }); 
            loadTestimonials();
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };
    
    window.toggleTestimonialPanel = function() { 
        document.getElementById('addTestimonialModal').classList.toggle('open'); 
    };

    // ================================================
    // 3) INITIAL LOAD
    // ================================================
    loadProjects();
    loadTestimonials();
});
