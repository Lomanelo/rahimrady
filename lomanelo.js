document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Theme switcher functionality
  const themeSwitcher = document.querySelector('.fa-adjust');
  if (themeSwitcher) {
    const body = document.body;

    themeSwitcher.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      // Save the current theme preference to localStorage
      if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      body.classList.add('light-mode');
    }
  }

  // Language switcher
  const langButtons = document.querySelectorAll('.lang-btn');
  if (langButtons.length > 0) {
    langButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Initialize language
    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguage(preferredLanguage);
  } else {
    console.warn('Language buttons not found');
  }

  console.log("Lomanelo is here");

  // Resume button functionality
  const resumeButton = document.getElementById('resume-button');
  if (resumeButton) {
    resumeButton.addEventListener('click', function(e) {
      e.preventDefault();
      const message = translations[currentLanguage]['resume.confirmDownload'] || 'Do you want to view my CV?';
      if (confirm(message)) {
        // Open the PDF in a new tab
        window.open('rahimCv.pdf', '_blank');
      }
    });
  }

  // Modal functionality
  const modal = document.getElementById('contact-modal');
  const hireMeBtn = document.getElementById('hire-me-btn');
  const closeBtn = document.querySelector('.close');
  const contactForm = document.getElementById('contact-form');

  hireMeBtn.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      to: 'rahimrady@gmail.com'
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: 'YOUR_SERVICE_ID',
          template_id: 'YOUR_TEMPLATE_ID',
          user_id: 'YOUR_PUBLIC_KEY',
          template_params: formData
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
        contactForm.reset();
        modal.style.display = 'none';
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please try again later.');
    }
  });
});

function setLanguage(lang) {
  console.log(`Attempting to set language to: ${lang}`);
  localStorage.setItem('preferredLanguage', lang);
  loadLanguage(lang);
}

function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Language data loaded:', data);
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (data[key]) {
          if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = data[key];
          } else if (element.tagName === 'A' && element.getAttribute('href') === '#') {
            element.textContent = data[key];
          } else {
            element.innerHTML = data[key];
          }
        } else {
          console.warn(`No translation found for key: ${key}`);
        }
      });
      document.documentElement.lang = lang;
      // Remove the RTL setting for Arabic to maintain consistent layout
      // document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      // Update active state of language buttons
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    })
    .catch(err => {
      console.error('Error loading language file:', err);
      alert(`Failed to load language file for ${lang}. Please check the console for more details.`);
    });
}
