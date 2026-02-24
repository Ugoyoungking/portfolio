/* global AOS, Typed, emailjs */

AOS.init({ duration: 1000 });

new Typed('.typed-text', {
  strings: ['Frontend Developer', 'Backend Developer', 'Web Designer', 'Graphic Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true
});

const toggleDark = document.getElementById('toggle-dark');
if (toggleDark) {
  toggleDark.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleDark.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');

if (loginBtn && loginModal) loginBtn.onclick = () => { loginModal.style.display = 'flex'; };
if (signupBtn && signupModal) signupBtn.onclick = () => { signupModal.style.display = 'flex'; };

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
  };
});

const doSignup = document.getElementById('doSignup');
if (doSignup && signupModal) {
  doSignup.onclick = () => {
    const email = document.getElementById('signupEmail')?.value || '';
    const pass = document.getElementById('signupPassword')?.value || '';
    localStorage.setItem('user', JSON.stringify({ email, pass }));
    alert('Signup successful! Please login.');
    signupModal.style.display = 'none';
  };
}

const doLogin = document.getElementById('doLogin');
if (doLogin && loginModal) {
  doLogin.onclick = () => {
    const email = document.getElementById('loginEmail')?.value || '';
    const pass = document.getElementById('loginPassword')?.value || '';
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.email === email && user.pass === pass) {
      alert('Login successful! 🎉');
      loginModal.style.display = 'none';
    } else {
      alert('Invalid credentials ❌');
    }
  };
}

const searchInput = document.getElementById('projectSearch');
if (searchInput) {
  searchInput.addEventListener('keyup', () => {
    const search = searchInput.value.toLowerCase();
    document.querySelectorAll('.project').forEach((project) => {
      const title = (project.dataset.title || '').toLowerCase();
      project.style.display = title.includes(search) ? 'block' : 'none';
    });
  });
}

const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (typeof emailjs !== 'undefined') {
  emailjs.init('YOUR_USER_ID');
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof emailjs === 'undefined' || 'YOUR_USER_ID' === 'YOUR_USER_ID') {
      alert('⚠️ Contact form demo mode: configure EmailJS keys to send messages.');
      contactForm.reset();
      return;
    }
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      from_name: document.getElementById('name')?.value || '',
      from_email: document.getElementById('email')?.value || '',
      message: document.getElementById('message')?.value || ''
    }).then(() => {
      alert('✅ Message Sent Successfully!');
      contactForm.reset();
    }, (error) => {
      alert(`❌ Failed to send message: ${JSON.stringify(error)}`);
    });
  });
}
