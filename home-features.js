/* global THREE */

const GITHUB_USERNAME = 'Ugoyoungking';

const ensurePreloader = () => {
  if (document.getElementById('preloader')) return;
  const preloader = document.createElement('div');
  preloader.id = 'preloader';
  preloader.setAttribute('aria-hidden', 'true');
  preloader.innerHTML = '<div><div class="loader-orbit"></div><p>Loading portfolio...</p></div>';
  document.body.prepend(preloader);

  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 500);
  });
};

const ensureSocialDock = () => {
  if (document.querySelector('.social-dock')) return;
  const dock = document.createElement('div');
  dock.className = 'social-dock';
  dock.setAttribute('aria-label', 'Quick social links');
  dock.innerHTML = `
    <a href="https://github.com/Ugoyoungking" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="https://www.linkedin.com/in/ugochukwu-jonathan067" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <a href="mailto:ugochukwujonathan067@gmail.com">Email</a>
  `;
  document.body.appendChild(dock);
};

const ensureNavActions = () => {
  const nav = document.querySelector('nav');
  const darkBtn = document.getElementById('toggle-dark');
  if (!nav || !darkBtn || document.querySelector('.nav-actions')) return;

  const actions = document.createElement('div');
  actions.className = 'nav-actions';
  actions.innerHTML = `
    <button class="auth-btn" id="loginBtn" type="button">Login</button>
    <button class="auth-btn" id="signupBtn" type="button">Signup</button>
  `;
  darkBtn.replaceWith(actions);
  actions.appendChild(darkBtn);
};

const ensureHeroEnhancements = () => {
  const hero = document.querySelector('.hero');
  if (!hero || hero.querySelector('#hero3d')) return;

  const content = document.createElement('div');
  content.className = 'hero-content';
  while (hero.firstChild) content.appendChild(hero.firstChild);

  hero.appendChild(document.createElement('canvas')).id = 'hero3d';
  const glowOne = document.createElement('div');
  glowOne.className = 'hero-glow hero-glow-one';
  const glowTwo = document.createElement('div');
  glowTwo.className = 'hero-glow hero-glow-two';

  hero.appendChild(glowOne);
  hero.appendChild(glowTwo);
  hero.appendChild(content);

  if (!document.querySelector('.quick-stats')) {
    const stats = document.createElement('section');
    stats.className = 'quick-stats';
    stats.innerHTML = `
      <article class="stat-card"><span class="stat-number" data-target="20">0</span>+<p>Completed Projects</p></article>
      <article class="stat-card"><span class="stat-number" data-target="4">0</span>+<p>Years Learning</p></article>
      <article class="stat-card"><span class="stat-number" data-target="10">0</span>+<p>Technologies Used</p></article>
      <article class="stat-card"><span class="stat-number" data-target="100">0</span>%<p>Client Focus</p></article>
    `;
    hero.insertAdjacentElement('afterend', stats);
  }
};

const ensureProjectsUI = () => {
  const projectsSection = document.getElementById('projects');
  const filterBar = projectsSection?.querySelector('.filter-bar');
  if (!projectsSection || !filterBar) return;

  if (!document.getElementById('projectSort')) {
    const select = document.createElement('select');
    select.id = 'projectSort';
    select.innerHTML = `
      <option value="default">Sort: Default</option>
      <option value="az">Sort: A-Z</option>
      <option value="za">Sort: Z-A</option>
    `;
    filterBar.appendChild(select);
  }

  if (!document.getElementById('projectCount')) {
    const count = document.createElement('p');
    count.className = 'project-count';
    count.id = 'projectCount';
    count.textContent = 'Loading projects...';
    filterBar.insertAdjacentElement('afterend', count);
  }

  if (!document.getElementById('projectSyncNote')) {
    const note = document.createElement('p');
    note.className = 'project-sync-note';
    note.id = 'projectSyncNote';
    note.textContent = 'Syncing latest repositories from GitHub...';
    document.getElementById('projectCount').insertAdjacentElement('afterend', note);
  }
};

const ensureServicesSection = () => {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection || document.querySelector('.services')) return;
  const services = document.createElement('section');
  services.className = 'services';
  services.setAttribute('data-aos', 'fade-up');
  services.innerHTML = `
    <h3>Services I Offer</h3>
    <div class="services-grid">
      <article class="service-card"><h4>Frontend Development</h4><p>Responsive interfaces with modern HTML, CSS, and JavaScript.</p></article>
      <article class="service-card"><h4>React Applications</h4><p>Fast, scalable single-page apps with reusable components.</p></article>
      <article class="service-card"><h4>Backend APIs</h4><p>Node.js APIs and data handling for complete web solutions.</p></article>
      <article class="service-card"><h4>Graphic Design</h4><p>Brand-aligned visuals for social media and digital products.</p></article>
    </div>
  `;
  projectsSection.insertAdjacentElement('afterend', services);
};

const enhanceTestimonials = () => {
  const section = document.querySelector('.testimonials');
  if (!section || section.querySelector('.testimonial-slider')) return;
  const testimonials = [...section.querySelectorAll('.testimonial')];
  if (!testimonials.length) return;

  const slider = document.createElement('div');
  slider.className = 'testimonial-slider';
  testimonials.forEach((item, i) => {
    item.classList.toggle('active', i === 0);
    slider.appendChild(item);
  });

  const controls = document.createElement('div');
  controls.className = 'testimonial-controls';
  controls.innerHTML = '<button type="button" id="prevTestimonial">←</button><button type="button" id="nextTestimonial">→</button>';

  section.appendChild(slider);
  section.appendChild(controls);
};

const applyProjectTilt = (card) => {
  if (card.dataset.tiltBound) return;
  card.dataset.tiltBound = 'true';
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

const wireProjectsData = async () => {
  const projectGrid = document.getElementById('projectGrid');
  const searchInput = document.getElementById('projectSearch');
  const sortSelect = document.getElementById('projectSort');
  const projectCount = document.getElementById('projectCount');
  const projectSyncNote = document.getElementById('projectSyncNote');
  if (!projectGrid) return;

  const updateProjectCount = () => {
    if (!projectCount) return;
    const visible = [...projectGrid.querySelectorAll('.project')].filter((p) => p.style.display !== 'none').length;
    projectCount.textContent = `Showing ${visible} project${visible === 1 ? '' : 's'}`;
  };

  const createRepoCard = (repo) => {
    const card = document.createElement('article');
    card.className = 'project';
    card.dataset.title = repo.name;
    card.innerHTML = `
      <img src="${repo.owner.avatar_url}" alt="${repo.name} repository icon">
      <h4>${repo.name}</h4>
      <p>${repo.description || 'No description provided yet.'}</p>
      <div class="repo-meta"><span>${repo.language || 'Mixed'}</span><span>★ ${repo.stargazers_count}</span></div>
      <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository</a>
    `;
    applyProjectTilt(card);
    return card;
  };

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
    if (!response.ok) throw new Error(`GitHub request failed (${response.status})`);
    const repos = (await response.json())
      .filter((repo) => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    projectGrid.innerHTML = '';
    repos.forEach((repo) => projectGrid.appendChild(createRepoCard(repo)));
    if (projectSyncNote) projectSyncNote.textContent = `Live from GitHub: ${repos.length} public repositories loaded.`;
  } catch (error) {
    if (projectSyncNote) projectSyncNote.textContent = 'Could not load GitHub repositories right now. Showing local project samples instead.';
    projectGrid.querySelectorAll('.project').forEach((card) => applyProjectTilt(card));
    console.error(error);
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', () => {
      const search = searchInput.value.toLowerCase();
      projectGrid.querySelectorAll('.project').forEach((project) => {
        const title = (project.dataset.title || '').toLowerCase();
        project.style.display = title.includes(search) ? 'block' : 'none';
      });
      updateProjectCount();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(projectGrid.querySelectorAll('.project'));
      if (sortSelect.value === 'az') cards.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
      else if (sortSelect.value === 'za') cards.sort((a, b) => (b.dataset.title || '').localeCompare(a.dataset.title || ''));
      cards.forEach((card) => projectGrid.appendChild(card));
      updateProjectCount();
    });
  }

  updateProjectCount();
};

const wireTestimonialSlider = () => {
  const testimonials = document.querySelectorAll('.testimonial-slider .testimonial');
  const prev = document.getElementById('prevTestimonial');
  const next = document.getElementById('nextTestimonial');
  if (!testimonials.length) return;

  let active = 0;
  const setActive = () => testimonials.forEach((t, i) => t.classList.toggle('active', i === active));
  prev?.addEventListener('click', () => { active = (active - 1 + testimonials.length) % testimonials.length; setActive(); });
  next?.addEventListener('click', () => { active = (active + 1) % testimonials.length; setActive(); });
  setInterval(() => { active = (active + 1) % testimonials.length; setActive(); }, 5000);
  setActive();
};

const wireStatCounters = () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 50));
      const timer = setInterval(() => {
        current += step;
        el.textContent = String(Math.min(current, target));
        if (current >= target) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  statNumbers.forEach((n) => observer.observe(n));
};

const wireHero3D = () => {
  const heroCanvas = document.getElementById('hero3d');
  if (!heroCanvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
  camera.position.z = 4;

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.35, 120, 16),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.5, roughness: 0.2 })
  );
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
};

(() => {
  ensurePreloader();
  ensureSocialDock();
  ensureNavActions();
  ensureHeroEnhancements();
  ensureProjectsUI();
  ensureServicesSection();
  enhanceTestimonials();
  wireProjectsData();
  wireTestimonialSlider();
  wireStatCounters();
  wireHero3D();
})();
