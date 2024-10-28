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
  const themeSwitchers = document.querySelectorAll('.fa-adjust, .theme-toggle');
  if (themeSwitchers.length > 0) {
    const body = document.body;

    themeSwitchers.forEach(switcher => {
      switcher.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
          localStorage.setItem('theme', 'light');
        } else {
          localStorage.setItem('theme', 'dark');
        }
      });
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

    const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
    loadLanguage(preferredLanguage);
  }

  // Resume button functionality
  const resumeButton = document.getElementById('resume-button');
  if (resumeButton) {
    resumeButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Do you want to download my CV?')) {
        window.location.href = 'RahimCv.pdf';
      }
    });
  }

  // Modal and Hire Me functionality
  const modal = document.getElementById('contact-modal');
  const hireMeBtn = document.getElementById('hire-me-btn');
  const closeBtn = document.querySelector('.close');

  if (hireMeBtn) {
    hireMeBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Burger menu functionality
  const burgerMenu = document.querySelector('.burger-menu');
  const navContent = document.querySelector('.nav-content');

  if (burgerMenu && navContent) {
    burgerMenu.addEventListener('click', function() {
      console.log('Burger clicked');  // Debug log
      burgerMenu.classList.toggle('active');
      navContent.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navContent.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navContent.contains(e.target) && !burgerMenu.contains(e.target)) {
        burgerMenu.classList.remove('active');
        navContent.classList.remove('active');
      }
    });
  }

  // Add this to your existing DOMContentLoaded event listener
  const languageSelect = document.querySelector('.language-select');
  const languageDropdown = document.querySelector('.language-dropdown');

  if (languageSelect) {
    languageSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      languageDropdown.classList.remove('active');
    });

    // Update selected language text
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        document.querySelector('.selected-lang').textContent = lang.toUpperCase();
        languageDropdown.classList.remove('active');
      });
    });
  }
});

// Language functions
function setLanguage(lang) {
  localStorage.setItem('preferredLanguage', lang);
  loadLanguage(lang);
}

function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (data[key]) {
          element.innerHTML = data[key];
        }
      });
      document.documentElement.lang = lang;
      
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    })
    .catch(err => console.error('Error loading language file:', err));
}
