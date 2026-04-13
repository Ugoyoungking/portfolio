(() => {
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

  const activateTilt = (selector) => {
    document.querySelectorAll(selector).forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 14;
        const rotateX = (0.5 - (y / rect.height)) * 14;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };

  activateTilt('.project');
  activateTilt('.skill');
  activateTilt('.timeline-item');
})();
