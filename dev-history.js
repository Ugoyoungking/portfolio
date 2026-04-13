const navBar = document.querySelector('.navbar');
const scrollProgress = document.getElementById('scrollProgress');

const updateScrollEffects = () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const width = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(width, 100)}%`;
  }
  if (navBar) {
    navBar.classList.toggle('scrolled', window.scrollY > 20);
  }
};

window.addEventListener('scroll', updateScrollEffects);
updateScrollEffects();

const revealTargets = document.querySelectorAll('section, .profile-intro, .hero-content');
revealTargets.forEach((target) => target.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealTargets.forEach((target) => observer.observe(target));
