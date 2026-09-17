/**
 * ==========================================================================
 * DEEPANSHI — AI PORTFOLIO INTERACTIVE ENGINE
 * Features:
 * - Interactive AI Neural Network Canvas with Mouse Physics
 * - Theme Switcher (Light / Cyber-Luxe Dark AI Mode)
 * - Project Filter & Rich Detail Modal
 * - Skill Category Tabs
 * - Scroll Spy & Glassmorphic Sticky Header
 * - Contact Form Validation & Toast Notification System
 * - Copy-to-Clipboard Utilities
 * - Smooth Scroll & Scroll-Reveal Observer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initNeuralCanvas();
  initFilters();
  initProjectModal();
  initContactForm();
  initClipboardActions();
  initScrollReveal();
  initBackToTop();
});

/* ==========================================================================
   1. THEME SWITCHER (Light / Dark AI Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('deepanshi_theme') || 'light';
  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('deepanshi_theme', theme);
  const themeToggleBtn = document.getElementById('themeToggle');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

/* ==========================================================================
   2. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Sticky blur shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drawer when clicking a link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.innerHTML = '☰';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Spy for Active Navigation Link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (targetNavLink && scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        links.forEach(l => l.classList.remove('active'));
        targetNavLink.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. INTERACTIVE AI NEURAL CANVAS (Canvas Particle Physics)
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];

  const mouse = {
    x: null,
    y: null,
    radius: 110
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * window.devicePixelRatio;
    height = canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    createParticles(rect.width, rect.height);
  }

  class Particle {
    constructor(w, h) {
      this.w = w;
      this.h = h;
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.9;
      this.vy = (Math.random() - 0.5) * 0.9;
      this.radius = Math.random() * 2.5 + 2;
      this.baseColor = Math.random() > 0.5 ? '236, 72, 153' : '139, 92, 246'; // Pink or Lavender
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > this.w) this.vx *= -1;
      if (this.y < 0 || this.y > this.h) this.vy *= -1;

      // Mouse attraction / interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.85)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.baseColor}, 0.5)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function createParticles(w, h) {
    particles = [];
    const count = Math.min(Math.floor((w * h) / 7500), 55);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(w, h));
    }
  }

  function drawConnections() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const alpha = 1 - dist / 115;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.38})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw connection to mouse if nearby
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = 1 - dist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.6})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });

    drawConnections();
    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse move handlers
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch support for mobile devices
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrameId);
    resize();
    animate();
  });

  resize();
  animate();
}

/* ==========================================================================
   4. FILTER TABS (Projects & Skills)
   ========================================================================== */
function initFilters() {
  // Project Filter Tabs
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Skills Category Filter Tabs
  const skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        const group = card.getAttribute('data-skill-group');
        if (filterValue === 'all' || group === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT DETAIL MODAL DATA & CONTROLLER
   ========================================================================== */
const projectDetails = {
  'chatbot': {
    category: 'Artificial Intelligence / NLP',
    title: 'AI Conversational Assistant',
    description: 'An interactive chatbot created using Python to experiment with natural language processing patterns, intent parsing, and rule-based token classification.',
    bullets: [
      'Engineered token preprocessing routines (tokenization, stemming, and stop-word filtering).',
      'Built a lightweight intent matching engine mapped to customizable responses.',
      'Designed a clean terminal & GUI interactive loop for real-time user query testing.',
      'Established modular architecture for easy integration with future modern transformer LLM APIs.'
    ],
    tags: ['Python 3', 'NLP Basics', 'Regex', 'JSON Data Structures', 'Git'],
    githubUrl: 'https://github.com/deepanshi-placeholder/ai-chatbot-starter',
    demoUrl: '#'
  },
  'portfolio': {
    category: 'Web Development / UI Design',
    title: 'Personal AI Engineering Portfolio',
    description: 'A responsive, high-performance personal portfolio website showcasing academic foundations, projects, and tech exploration with glassmorphism and interactive AI visuals.',
    bullets: [
      'Designed a light pink, white, and soft lavender aesthetic with high-contrast cyber-luxe dark mode.',
      'Constructed a custom HTML5 Canvas particle system simulating AI synaptic connections.',
      'Implemented accessible, semantic HTML5, CSS Grid, and zero external framework overhead.',
      'Integrated ATS resume viewing and print-to-PDF export pipeline.'
    ],
    tags: ['HTML5', 'Vanilla CSS', 'JavaScript ES6+', 'HTML5 Canvas', 'Responsive UI'],
    githubUrl: 'https://github.com/deepanshi-placeholder/deepanshi-portfolio',
    demoUrl: '#'
  },
  'python-mini': {
    category: 'Software Engineering / Core Python',
    title: 'Python Mini Projects & Utility Hub',
    description: 'A structured repository of foundational Python utilities designed to strengthen algorithmic problem solving, file manipulation, and modular programming.',
    bullets: [
      'Created automated command-line file organizers and text parser tools.',
      'Built algorithmic games (Number Guessing, Wordle CLI, Tic-Tac-Toe) exploring game loop state machines.',
      'Implemented unit test assertions and clean code documentation following PEP 8 standards.',
      'Practiced version control workflows with feature branching and commit tracking.'
    ],
    tags: ['Python', 'Algorithms', 'CLI Tools', 'Data Structures', 'GitHub'],
    githubUrl: 'https://github.com/deepanshi-placeholder/python-mini-projects',
    demoUrl: '#'
  },
  'ml-beginner': {
    category: 'Machine Learning / Data Science',
    title: 'AI/ML Beginner Exploration & EDA',
    description: 'A hands-on exploratory data analysis and baseline classification experiment conducted on introductory machine learning datasets.',
    bullets: [
      'Loaded and cleaned structured tabular datasets, identifying missing values and distribution outliers.',
      'Conducted Exploratory Data Analysis (EDA) calculating correlation matrices and feature distributions.',
      'Implemented baseline linear and nearest-neighbor classification concepts using basic Python math.',
      'Documented findings in structured computational notebooks and comparative performance tables.'
    ],
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'Statistics', 'Jupyter'],
    githubUrl: 'https://github.com/deepanshi-placeholder/ml-beginner-eda',
    demoUrl: '#'
  },
  'robotics': {
    category: 'Robotics / Hardware & Embedded',
    title: 'Sensor-Driven Robotics Prototype',
    description: 'A hands-on microcontroller prototype created during makerspace sessions exploring sensor integration, ultrasonic telemetry, and obstacle avoidance.',
    bullets: [
      'Interfaced ultrasonic distance sensors (HC-SR04) and motor drivers with an Arduino microcontroller.',
      'Programmed reactive obstacle detection algorithms in structured C/C++.',
      'Tested spatial clearance thresholds and optimized turnaround delays for smooth navigation.',
      'Collaborated with fellow makerspace peers during hardware soldering and chassis assembly.'
    ],
    tags: ['C / C++', 'Arduino', 'Sensors', 'Makerspace', 'Robotics Hardware'],
    githubUrl: 'https://github.com/deepanshi-placeholder/robotics-sensor-prototype',
    demoUrl: '#'
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const viewBtns = document.querySelectorAll('.btn-view-project');

  if (!modalOverlay) return;

  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalBullets = document.getElementById('modalBullets');
  const modalTags = document.getElementById('modalTags');
  const modalGithub = document.getElementById('modalGithub');
  const modalLive = document.getElementById('modalLive');

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;

    modalBullets.innerHTML = data.bullets.map(b => `<li class="modal-bullet-item">${b}</li>`).join('');
    modalTags.innerHTML = data.tags.map(t => `<span class="project-tag">${t}</span>`).join('');

    if (modalGithub) modalGithub.href = data.githubUrl;
    if (modalLive) modalLive.href = data.demoUrl;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. CONTACT FORM HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const subjectInput = document.getElementById('contactSubject');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('btnSubmitContact');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subjectVal = subjectInput ? subjectInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name) {
      showToast('⚠️ Please enter your name.');
      if (nameInput) nameInput.focus();
      return;
    }

    if (!email) {
      showToast('⚠️ Please enter your email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    // Basic email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showToast('⚠️ Please enter a valid email address.');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!message) {
      showToast('⚠️ Please enter your message.');
      if (messageInput) messageInput.focus();
      return;
    }

    // Prepare mailto link with entered subject or sensible default
    const emailSubject = subjectVal || `Portfolio Message from ${name}`;
    const subject = encodeURIComponent(emailSubject);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailtoUrl = `mailto:deepanshinawal@gmail.com?subject=${subject}&body=${body}`;

    // Provide button feedback
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Launching Email Client... ✨</span>';
    }

    // Provide friendly confirmation toast
    showToast('✨ Thank you, ' + name + '! Launching your email client...');

    // Launch mail client reliably within user gesture
    const mailLink = document.createElement('a');
    mailLink.href = mailtoUrl;
    mailLink.target = '_blank';
    mailLink.rel = 'noopener noreferrer';
    document.body.appendChild(mailLink);
    mailLink.click();
    mailLink.remove();

    setTimeout(() => {
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
      }
      showToast('💌 Message ready to send! Deepanshi will reply soon.');
    }, 1000);
  });
}

/* ==========================================================================
   7. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  // Force reflow
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ==========================================================================
   8. COPY TO CLIPBOARD UTILITIES
   ========================================================================== */
function initClipboardActions() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`📋 Copied "${textToCopy}" to clipboard!`);
      }).catch(() => {
        showToast('📋 Copied to clipboard!');
      });
    });
  });
}

/* ==========================================================================
   9. SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
