document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus  = document.getElementById('formStatus');

    // Your Spring Boot backend address
    const API_URL = 'https://steppingtechfullstack.onrender.com/api/contact'; 

    if (!contactForm || !formStatus) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        btn.disabled = true;
        formStatus.textContent = 'Sending your message...';
        formStatus.className = 'form-status';

        const formData = new FormData(contactForm);
        
        // 1. Send to Web3Forms in the background to trigger email notification (no password required, no need to wait for its result)
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        }).catch(err => console.log('Web3Forms notification failed:', err));

        // 2. Send data to Spring Boot to save to database
        const data = Object.fromEntries(formData.entries());
        
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error!', error.message);
            formStatus.textContent = 'Something went wrong saving to database.';
            formStatus.className = 'form-status error';
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    });
});
