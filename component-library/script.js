// ===== Sidebar toggle =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const content = document.querySelector('.content');

sidebarToggle.addEventListener('click', () => {
  const isHidden = sidebar.classList.toggle('is-hidden');
  content.classList.toggle('full-width', isHidden);
  sidebarToggle.setAttribute('aria-expanded', !isHidden);
});

// ===== Active sidebar link on scroll =====
const sections = document.querySelectorAll('.doc-section');
const links = document.querySelectorAll('.sidebar__link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(link => link.classList.remove('is-active'));
      const active = document.querySelector(`.sidebar__link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('is-active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// ===== Copy buttons =====
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const code = document.getElementById(targetId)?.innerText || '';
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

// ===== Mobile sidebar close on link click =====
document.querySelectorAll('.sidebar__link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('is-open');
    }
  });
});