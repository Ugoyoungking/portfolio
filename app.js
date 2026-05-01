AOS.init({ duration: 1000 });

new Typed('.typed-text', {
  strings: ['Frontend Developer', 'Backend Developer', 'Web Designer', 'Graphic Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true,
});


const nav = document.querySelector('nav');
const scrollProgress = document.getElementById('scrollProgress');

const updateScrollUI = () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }
};

window.addEventListener('scroll', updateScrollUI);
updateScrollUI();

const revealSections = document.querySelectorAll('section');
revealSections.forEach((section) => section.classList.add('reveal-section'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealSections.forEach((section) => revealObserver.observe(section));
const toggleDark = document.getElementById('toggle-dark');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');
const applyTheme = (theme) => {
  document.body.classList.toggle('dark', theme === 'dark');
  if (toggleDark) {
    toggleDark.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  }
};
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  applyTheme(prefersDark.matches ? 'dark' : 'light');
}
if (toggleDark) {
  toggleDark.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  });
}
prefersDark.addEventListener('change', (event) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(event.matches ? 'dark' : 'light');
  }
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

// Modals
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const projectModal = document.getElementById('projectModal');
const quickActionsModal = document.getElementById('quickActionsModal');
const closeBtns = document.querySelectorAll('.close');

const loginBtn = document.getElementById('loginBtn');
if (loginBtn && loginModal) {
  loginBtn.onclick = () => {
    loginModal.style.display = 'flex';
  };
}

const signupBtn = document.getElementById('signupBtn');
if (signupBtn && signupModal) {
  signupBtn.onclick = () => {
    signupModal.style.display = 'flex';
  };
}

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
    if (projectModal) projectModal.style.display = 'none';
    if (quickActionsModal) quickActionsModal.style.display = 'none';
  };
});

window.addEventListener('click', (event) => {
  if (event.target === loginModal) loginModal.style.display = 'none';
  if (event.target === signupModal) signupModal.style.display = 'none';
  if (event.target === projectModal) projectModal.style.display = 'none';
  if (event.target === quickActionsModal) quickActionsModal.style.display = 'none';
});

// Demo signup/login (localStorage)
const doSignup = document.getElementById('doSignup');
if (doSignup && signupModal) {
  doSignup.onclick = () => {
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;

    if (!email || !pass) {
      alert('Please fill in email and password.');
      return;
    }

    localStorage.setItem('user', JSON.stringify({ email, pass }));
    alert('Signup successful! Please login.');
    signupModal.style.display = 'none';
  };
}

const doLogin = document.getElementById('doLogin');
if (doLogin && loginModal) {
  doLogin.onclick = () => {
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.email === email && user.pass === pass) {
      alert('Login successful! 🎉');
      loginModal.style.display = 'none';
    } else {
      alert('Invalid credentials ❌');
    }
  };
}

// Project search + category filter + count feature
const searchInput = document.getElementById('projectSearch');
const projects = document.querySelectorAll('.project');
const projectCount = document.getElementById('projectCount');
const projectEmptyState = document.getElementById('projectEmptyState');
const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
let activeFilter = 'all';

const applyProjectFilters = () => {
  const search = (searchInput?.value || '').toLowerCase().trim();

  projects.forEach((project) => {
    const title = (project.dataset.title || '').toLowerCase();
    const category = (project.dataset.category || '').toLowerCase();
    const matchesSearch = title.includes(search);
    const matchesFilter = activeFilter === 'all' || category === activeFilter;

    project.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
  });

  const visibleProjects = Array.from(projects).filter((project) => project.style.display !== 'none').length;
  if (projectCount) {
    projectCount.textContent = `Showing ${visibleProjects} project${visibleProjects === 1 ? '' : 's'}`;
  }
  if (projectEmptyState) {
    projectEmptyState.hidden = visibleProjects !== 0;
  }
};

if (searchInput) {
  searchInput.addEventListener('input', applyProjectFilters);
}

projectFilterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter || 'all';
    projectFilterBtns.forEach((node) => node.classList.remove('active'));
    btn.classList.add('active');
    applyProjectFilters();
  });
});

applyProjectFilters();

// Project details modal feature
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalLink = document.getElementById('projectModalLink');
const projectViewBtns = document.querySelectorAll('.project-view-btn');

projectViewBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const projectCard = btn.closest('.project');
    if (!projectCard || !projectModal) return;

    const title = projectCard.querySelector('h4')?.textContent || 'Project';
    const description = projectCard.querySelector('p')?.textContent || 'No description available.';
    const link = projectCard.dataset.link || '#';

    if (projectModalTitle) projectModalTitle.textContent = title;
    if (projectModalDescription) projectModalDescription.textContent = description;
    if (projectModalLink) projectModalLink.href = link;

    projectModal.style.display = 'flex';
  });
});

// Scroll-to-top button
const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const quickActionsBtn = document.getElementById('quickActionsBtn');
const quickActionItems = document.querySelectorAll('.quick-action-item');
const toggleQuickActions = (show) => {
  if (!quickActionsModal) return;
  quickActionsModal.style.display = show ? 'flex' : 'none';
};

if (quickActionsBtn) {
  quickActionsBtn.addEventListener('click', () => toggleQuickActions(true));
}

quickActionItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    const action = item.dataset.action;
    if (target) {
      const section = document.querySelector(target);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
    if (action === 'theme' && toggleDark) {
      toggleDark.click();
    }
    toggleQuickActions(false);
  });
});

window.addEventListener('keydown', (event) => {
  const isMac = navigator.platform.toLowerCase().includes('mac');
  const openShortcut = isMac ? event.metaKey && event.key.toLowerCase() === 'k' : event.ctrlKey && event.key.toLowerCase() === 'k';
  if (openShortcut) {
    event.preventDefault();
    toggleQuickActions(true);
  }
  if (event.key === 'Escape') {
    toggleQuickActions(false);
  }
  if (event.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
    event.preventDefault();
    searchInput?.focus();
  }
});

// EmailJS config with graceful fallback
const contactForm = document.getElementById('contact-form');
const EMAILJS_PUBLIC_KEY = 'YOUR_USER_ID';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_USER_ID') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (
      typeof emailjs === 'undefined' ||
      EMAILJS_PUBLIC_KEY === 'YOUR_USER_ID' ||
      EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID'
    ) {
      alert('Contact form is not configured yet. Please use direct email for now.');
      return;
    }

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        message: document.getElementById('message').value,
      })
      .then(
        () => {
          alert('✅ Message Sent Successfully!');
          contactForm.reset();
        },
        (error) => {
          alert(`❌ Failed to send message: ${JSON.stringify(error)}`);
        },
      );
  });
}
