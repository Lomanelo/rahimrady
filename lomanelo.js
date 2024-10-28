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

  // Update the theme switcher functionality
  // Find all theme toggle buttons
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const body = document.body;

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
  }

  // Add click handler to all theme toggle buttons
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
    });
  });

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

  // Modal and Hire Me functionality
  const modal = document.getElementById('contact-modal');
  const hireMeBtn = document.getElementById('hire-me-btn');
  const closeBtn = document.querySelector('.close');

  if (hireMeBtn && modal) {
    hireMeBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      // Add this line to trigger the animation
      setTimeout(() => {
        modal.querySelector('.modal-content').style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
      }, 10);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.querySelector('.modal-content').style.opacity = '0';
      modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.querySelector('.modal-content').style.opacity = '0';
        modal.querySelector('.modal-content').style.transform = 'translateY(20px)';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
  }

  // Burger menu functionality
  const burgerMenu = document.querySelector('.burger-menu');
  const navContent = document.querySelector('.nav-content');

  if (burgerMenu && navContent) {
    burgerMenu.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling
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
      e.preventDefault();
      e.stopPropagation();
      languageDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!languageSelect.contains(e.target)) {
        languageDropdown.classList.remove('active');
      }
    });

    // Prevent dropdown from closing when clicking inside it
    languageDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
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
