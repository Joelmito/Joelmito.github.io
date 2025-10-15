// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Header transparency on scroll
const header = document.querySelector('.site-header');
const hero = document.getElementById('home');
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

// Drawer interactions
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

menuBtn.addEventListener('click', ()=>{
  const isOpen = drawer.classList.contains('open');
  if(isOpen){ closeDrawer(); } else { openDrawer(); }
});
closeBtn.addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDrawer(); });
document.querySelectorAll('#drawer a').forEach(a=>a.addEventListener('click', closeDrawer));

// Set hero background via CSS variable for easy swapping
document.querySelector('.hero')?.style.setProperty('--hero', "url('https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=2400&auto=format&fit=crop')");
