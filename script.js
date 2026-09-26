// Mobile navigation drawer toggle
const mobileToggle = document.getElementById('mobile-toggle');
const mobileDrawer = document.getElementById('mobile-drawer');

if (mobileToggle && mobileDrawer) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close drawer when any mobile link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ Accordion — single open item at a time
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  if (btn) {
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => {
        i.classList.remove('open');
        const qBtn = i.querySelector('.faq-q');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }
});

// Audit Form Submission & Storage Handling
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyvb_K16dIXUlQvZ3rqlxWjGgyk765mB-trI6wDjFUnpJX6pTQv2X1xa3dhYmzzLxs_/exec';

const auditForm = document.getElementById('audit-form');
if (auditForm) {
  auditForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('user-name')?.value.trim() || '';
    const phone = document.getElementById('user-phone')?.value.trim() || '';
    const brand = document.getElementById('brand-name')?.value.trim() || '';
    const spend = document.getElementById('monthly-spend')?.value || '';
    const challenge = document.getElementById('current-challenge')?.value || '';

    const leadPayload = {
      name: name,
      phone: phone,
      brand: brand,
      spend: spend,
      challenge: challenge,
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage for thankyou page
    try {
      localStorage.setItem('lead_name', name);
      localStorage.setItem('lead_phone', phone);
      localStorage.setItem('lead_brand', brand);
      localStorage.setItem('lead_spend', spend);
      localStorage.setItem('lead_challenge', challenge);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Build URL parameters for cross-browser fallback
    const params = new URLSearchParams({
      name,
      phone,
      brand,
      spend,
      challenge
    });

    // Provide immediate visual feedback
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Securing your slot...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.85';
    }

    // Asynchronously send to Google Sheets using standard form-urlencoded + JSON fallback
    try {
      if (GOOGLE_SHEET_ENDPOINT) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('brand', brand);
        formData.append('spend', spend);
        formData.append('challenge', challenge);
        formData.append('submittedAt', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

        fetch(GOOGLE_SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        }).catch(err => console.warn('Sheet submission error:', err));
      }
    } catch (err) {
      console.warn('Network error while posting lead:', err);
    }

    // Redirect to Thank You / Confirmation Page
    setTimeout(() => {
      window.location.href = `thankyou.html?${params.toString()}`;
    }, 600);
  });
}

// Smooth scroll reveal via IntersectionObserver
if ('IntersectionObserver' in window) {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

