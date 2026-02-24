/* global AOS, Typed, THREE, emailjs */

AOS.init({ duration: 1000 });

new Typed('.typed-text', {
  strings: ['Frontend Developer', 'Backend Developer', 'Web Designer', 'Graphic Designer', 'Problem Solver'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true
});

const body = document.body;
const toggleDark = document.getElementById('toggle-dark');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const preloader = document.getElementById('preloader');

if (toggleDark) {
  toggleDark.addEventListener('click', () => {
    body.classList.toggle('dark');
    toggleDark.textContent = body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
}

window.addEventListener('load', () => {
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 500);
});

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const closeBtns = document.querySelectorAll('.close');

if (loginBtn && loginModal) {
  loginBtn.onclick = () => {
    loginModal.style.display = 'flex';
  };
}

if (signupBtn && signupModal) {
  signupBtn.onclick = () => {
    signupModal.style.display = 'flex';
  };
}

closeBtns.forEach((btn) => {
  btn.onclick = () => {
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
  };
});

window.addEventListener('click', (event) => {
  if (event.target === loginModal) loginModal.style.display = 'none';
  if (event.target === signupModal) signupModal.style.display = 'none';
});

const doSignup = document.getElementById('doSignup');
if (doSignup && signupModal) {
  doSignup.onclick = () => {
    const email = document.getElementById('signupEmail')?.value || '';
    const pass = document.getElementById('signupPassword')?.value || '';

    if (!email || !pass) {
      alert('Please fill all fields.');
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

const projectGrid = document.getElementById('projectGrid');
const searchInput = document.getElementById('projectSearch');
const projectSort = document.getElementById('projectSort');
const projectCount = document.getElementById('projectCount');
const projectSyncNote = document.getElementById('projectSyncNote');
const GITHUB_USERNAME = 'Ugoyoungking';

const updateProjectCount = () => {
  if (!projectCount || !projectGrid) return;
  const visibleProjects = [...projectGrid.querySelectorAll('.project')].filter((project) => project.style.display !== 'none').length;
  projectCount.textContent = `Showing ${visibleProjects} project${visibleProjects === 1 ? '' : 's'}`;
};

const applyProjectCardEffects = (card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
};

const createRepoCard = (repo) => {
  const card = document.createElement('article');
  card.className = 'project github-project';
  card.dataset.title = repo.name;
  card.dataset.updated = repo.updated_at;
  card.innerHTML = `
    <img src="${repo.owner.avatar_url}" alt="${repo.name} repository icon">
    <h4>${repo.name}</h4>
    <p>${repo.description || 'No description provided yet.'}</p>
    <div class="repo-meta">
      <span>${repo.language || 'Mixed'}</span>
      <span>★ ${repo.stargazers_count}</span>
    </div>
    <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
  `;
  applyProjectCardEffects(card);
  return card;
};

const fetchAndRenderGitHubRepos = async () => {
  if (!projectGrid) return;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);

    const repos = await response.json();
    const sortedRepos = repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    projectGrid.innerHTML = '';
    sortedRepos.forEach((repo) => {
      projectGrid.appendChild(createRepoCard(repo));
    });

    if (projectSyncNote) {
      projectSyncNote.textContent = `Live from GitHub: ${sortedRepos.length} public repositories loaded.`;
    }

    updateProjectCount();
  } catch (error) {
    if (projectSyncNote) {
      projectSyncNote.textContent = 'Could not load GitHub repositories right now. Showing local project samples instead.';
    }
    console.error(error);
    projectGrid.querySelectorAll('.project').forEach((card) => applyProjectCardEffects(card));
    updateProjectCount();
  }
};

if (searchInput && projectGrid) {
  searchInput.addEventListener('keyup', () => {
    const search = searchInput.value.toLowerCase();
    projectGrid.querySelectorAll('.project').forEach((project) => {
      const title = (project.dataset.title || '').toLowerCase();
      project.style.display = title.includes(search) ? 'block' : 'none';
    });
    updateProjectCount();
  });
}

if (projectSort && projectGrid) {
  projectSort.addEventListener('change', () => {
    const cards = Array.from(projectGrid.querySelectorAll('.project'));
    const sortMode = projectSort.value;

    cards.sort((a, b) => {
      const first = a.dataset.title || '';
      const second = b.dataset.title || '';
      if (sortMode === 'az') return first.localeCompare(second);
      if (sortMode === 'za') return second.localeCompare(first);
      return 0;
    });

    cards.forEach((card) => projectGrid.appendChild(card));
    updateProjectCount();
  });
}

updateProjectCount();
fetchAndRenderGitHubRepos();

const scrollBtn = document.getElementById('scrollTopBtn');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const testimonialNodes = document.querySelectorAll('.testimonial-slider .testimonial');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
let activeTestimonial = 0;

const setTestimonial = (index) => {
  if (!testimonialNodes.length) return;
  testimonialNodes.forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });
};

const showNextTestimonial = () => {
  if (!testimonialNodes.length) return;
  activeTestimonial = (activeTestimonial + 1) % testimonialNodes.length;
  setTestimonial(activeTestimonial);
};

if (prevTestimonial) {
  prevTestimonial.addEventListener('click', () => {
    activeTestimonial = (activeTestimonial - 1 + testimonialNodes.length) % testimonialNodes.length;
    setTestimonial(activeTestimonial);
  });
}

if (nextTestimonial) {
  nextTestimonial.addEventListener('click', showNextTestimonial);
}

if (testimonialNodes.length) {
  setTestimonial(activeTestimonial);
  setInterval(showNextTestimonial, 5000);
}

const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = String(target);
          clearInterval(timer);
        } else {
          el.textContent = String(current);
        }
      }, 30);

      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  statNumbers.forEach((num) => observer.observe(num));
}

const heroCanvas = document.getElementById('hero3d');
if (heroCanvas && typeof THREE !== 'undefined') {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
  camera.position.z = 4;

  const geometry = new THREE.TorusKnotGeometry(1, 0.35, 120, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.5,
    roughness: 0.2
  });

  const knot = new THREE.Mesh(geometry, material);
  scene.add(knot);

  const lightOne = new THREE.PointLight(0xffffff, 2.2);
  lightOne.position.set(4, 4, 5);
  scene.add(lightOne);

  const lightTwo = new THREE.PointLight(0x1abc9c, 1.6);
  lightTwo.position.set(-4, -2, 3);
  scene.add(lightTwo);

  const animate = () => {
    knot.rotation.x += 0.005;
    knot.rotation.y += 0.008;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener('resize', () => {
    const width = heroCanvas.clientWidth;
    const height = heroCanvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

if (typeof emailjs !== 'undefined') {
  emailjs.init('YOUR_USER_ID');
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

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
