AOS.init({ duration: 1000 });

new Typed('.typed-text', {
  strings: ['Frontend Developer', 'Backend Developer', 'Web Designer', 'Graphic Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true,
});


const toggleDark = document.getElementById('toggle-dark');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}
if (toggleDark) {
  toggleDark.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  toggleDark.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleDark.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

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
  };
});

window.addEventListener('click', (event) => {
  if (event.target === loginModal) loginModal.style.display = 'none';
  if (event.target === signupModal) signupModal.style.display = 'none';
  if (event.target === projectModal) projectModal.style.display = 'none';
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
