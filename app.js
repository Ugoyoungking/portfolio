/* global AOS, Typed, THREE, emailjs */
AOS.init({duration:1000});

new Typed('.typed-text', {
  strings: ['Frontend Developer', 'Backend Developer', 'Web Designer', 'Graphic Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true,
});

window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
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
const projectModal = document.getElementById('projectModal');
const closeBtns = document.querySelectorAll('.close');

const loginBtn = document.getElementById('loginBtn');
if (loginBtn && loginModal) loginBtn.onclick = () => { loginModal.style.display = 'flex'; };

const signupBtn = document.getElementById('signupBtn');
if (signupBtn && signupModal) signupBtn.onclick = () => { signupModal.style.display = 'flex'; };

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

const searchInput = document.getElementById('projectSearch');
const projects = document.querySelectorAll('.project');
const projectCount = document.getElementById('projectCount');
const projectSort = document.getElementById('projectSort');

const updateProjectCount = () => {
  const visibleProjects = Array.from(projects).filter((project) => project.style.display !== 'none').length;
  if (projectCount) projectCount.textContent = `Showing ${visibleProjects} project${visibleProjects === 1 ? '' : 's'}`;
};

if (searchInput) {
  searchInput.addEventListener('keyup', () => {
    const search = searchInput.value.toLowerCase();
    projects.forEach((project) => {
      const title = project.dataset.title.toLowerCase();
      project.style.display = title.includes(search) ? 'block' : 'none';
    });
    updateProjectCount();
  });
}

if (projectSort) {
  projectSort.addEventListener('change', () => {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    const sorted = [...projects].sort((a, b) => {
      const aTitle = a.dataset.title.toLowerCase();
      const bTitle = b.dataset.title.toLowerCase();
      if (projectSort.value === 'az') return aTitle.localeCompare(bTitle);
      if (projectSort.value === 'za') return bTitle.localeCompare(aTitle);
      return 0;
    });
    sorted.forEach((card) => grid.appendChild(card));
  });
}
updateProjectCount();

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

// Animate highlight counters
const statCards = document.querySelectorAll('.stat-card');
const animateCounter = (card) => {
  const target = Number(card.dataset.count || '0');
  let current = 0;
  const increment = Math.max(1, Math.ceil(target / 45));
  const update = () => {
    current += increment;
    if (current >= target) {
      card.childNodes[0].nodeValue = String(target);
      return;
    }
    card.childNodes[0].nodeValue = String(current);
    requestAnimationFrame(update);
  };
  update();
};

if ('IntersectionObserver' in window && statCards.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  statCards.forEach((card) => observer.observe(card));
}

// 3D tilt effect on project cards
projects.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = -((y / rect.height) - 0.5) * 14;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Hero 3D animation (Three.js)
const heroCanvas = document.getElementById('hero3d');
if (heroCanvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);

  const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 140, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.4, roughness: 0.25 });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(2, 2, 3);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  camera.position.z = 4;

  const onResize = () => {
    const width = heroCanvas.clientWidth;
    const height = heroCanvas.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', onResize);

  const animate = () => {
    mesh.rotation.x += 0.004;
    mesh.rotation.y += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}


const testimonialItems = document.querySelectorAll('.testimonial-slider .testimonial');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
let testimonialIndex = 0;

const showTestimonial = (index) => {
  if (!testimonialItems.length) return;
  testimonialItems.forEach((item, i) => item.classList.toggle('active', i === index));
};

if (testimonialItems.length) {
  if (prevTestimonial) {
    prevTestimonial.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex - 1 + testimonialItems.length) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    });
  }
  if (nextTestimonial) {
    nextTestimonial.addEventListener('click', () => {
      testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    });
  }
  setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
    showTestimonial(testimonialIndex);
  }, 4500);
  showTestimonial(testimonialIndex);
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

const contactForm = document.getElementById('contact-form');
const EMAILJS_PUBLIC_KEY = 'YOUR_USER_ID';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_USER_ID') emailjs.init(EMAILJS_PUBLIC_KEY);

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

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: document.getElementById('name').value,
      from_email: document.getElementById('email').value,
      message: document.getElementById('message').value,
    }).then(
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
