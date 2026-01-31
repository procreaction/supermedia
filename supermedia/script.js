// ==========================================
// SHARED JAVASCRIPT FOR SALESPAGE & CHALLENGE
// ==========================================

// IMPORTANT: Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxgdno7Vmvsr1FV-FY_qGh3RBB64wM8YDXYvW8a5jCRepdlVEhjHaBNqjeeUjT7cgDo/exec';

// VIMEO VIDEO LOGIC - Hybrid Lösung (Background Loop + Click to Play)
document.addEventListener('DOMContentLoaded', function() {
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            const iframe = this.querySelector('iframe');
            const overlay = this.querySelector('.video-overlay');
            const vimeoId = this.getAttribute('data-vimeo-id');

            // Nur ausführen, wenn Iframe und ID vorhanden sind
            if (iframe && vimeoId) {
                // Tauscht den Background-Loop gegen das Video mit Ton & Controls aus
                const newSrc = `https://player.vimeo.com/video/${vimeoId}?api=1&autoplay=1&muted=0&controls=1`;
                iframe.src = newSrc;

                // Overlay sanft ausblenden
                if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.pointerEvents = 'none';
                }
            }
        });
    });
});

// ==========================================
// MODAL FUNCTIONS
// ==========================================

function openModal() {
    document.getElementById('registrationModal').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    document.getElementById('registrationModal').classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    // Reset form
    document.getElementById('registrationForm').reset();
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.style.display = 'none';
        formMessage.className = 'form-message';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('registrationModal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// ==========================================
// FORM SUBMISSION
// ==========================================

async function handleSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet...';
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || '',
        timestamp: new Date().toISOString(),
        source: window.location.pathname // Track which page the submission came from
    };

    try {
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = '✓ Anmeldung erfolgreich! Du wirst weitergeleitet...';
        formMessage.style.display = 'block';

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'https://www.streetwise.studio/danke-anmeldung';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        
        // Show error message
        formMessage.className = 'form-message error';
        formMessage.textContent = '✗ Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
        formMessage.style.display = 'block';
        
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Jetzt anmelden';
    }
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ==========================================
// COUNTDOWN TIMER (For Challenge Page)
// ==========================================

// Check if countdown elements exist (only on challenge page)
if (document.getElementById('days')) {
    const targetDate = new Date('2026-02-09T11:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Event has passed
            updateCountdownDisplay('00', '00', '00', '00');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        updateCountdownDisplay(
            String(days).padStart(2, '0'),
            String(hours).padStart(2, '0'),
            String(minutes).padStart(2, '0'),
            String(seconds).padStart(2, '0')
        );
    }

    function updateCountdownDisplay(days, hours, minutes, seconds) {
        // Update first countdown
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;

        // Update second countdown (if exists)
        const days2El = document.getElementById('days2');
        const hours2El = document.getElementById('hours2');
        const minutes2El = document.getElementById('minutes2');
        const seconds2El = document.getElementById('seconds2');
        
        if (days2El) days2El.textContent = days;
        if (hours2El) hours2El.textContent = hours;
        if (minutes2El) minutes2El.textContent = minutes;
        if (seconds2El) seconds2El.textContent = seconds;
    }

    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}
