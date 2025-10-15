
// Common drawer logic and helpers
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('drawer-overlay');
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.getElementById('drawer-close');

function openDrawer(){
  drawer.classList.add('open');
  overlay.classList.add('open');
  overlay.hidden = false;
  overlay.style.opacity = '1';
  drawer.setAttribute('aria-hidden','false');
  menuBtn.setAttribute('aria-expanded','true');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  overlay.style.opacity = '0';
  setTimeout(()=>{ overlay.hidden = true; }, 200);
  drawer.setAttribute('aria-hidden','true');
  menuBtn.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}

if (menuBtn) {
  menuBtn.addEventListener('click', ()=>{
    const isOpen = drawer.classList.contains('open');
    if(isOpen){ closeDrawer(); } else { openDrawer(); }
  });
}
if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
if (overlay) overlay.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDrawer(); });
document.querySelectorAll('#drawer a').forEach(a=>a.addEventListener('click', closeDrawer));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Home-only header transparency using IntersectionObserver
const header = document.querySelector('.site-header');
const hero = document.getElementById('home');
if (header && hero) {
  const io = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      header.classList.add('transparent');
      header.classList.remove('solid');
    } else {
      header.classList.remove('transparent');
      header.classList.add('solid');
    }
  }, {threshold: 0.4});
  io.observe(hero);
} else if (header) {
  // Non-home pages: keep header solid
  header.classList.add('solid');
}
