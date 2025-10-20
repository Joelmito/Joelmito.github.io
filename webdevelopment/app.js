// Footer year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Header transparency on scroll (index only where hero exists)
(function headerTransparency(){
  const header = document.querySelector('.site-header');
  const hero = document.getElementById('home');
  if (!header) return;
  if (!hero) { header.classList.add('solid'); header.classList.remove('transparent'); return; }

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
})();

// Drawer logic
(function drawer(){
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const menuBtn = document.querySelector('.menu-btn');
  const closeBtn = document.getElementById('drawer-close');
  if (!drawer || !overlay || !menuBtn) return;

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
    if (isOpen) closeDrawer(); else openDrawer();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeDrawer(); });
  document.querySelectorAll('#drawer a').forEach(a=>a.addEventListener('click', closeDrawer));
})();

// Collections carousel: auto-rotate + dots + loop
(function initCollectionsCarousel() {
  const carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach(setupCarousel);

  function setupCarousel(root) {
    const viewport = root.querySelector('.carousel-viewport');
    const track = root.querySelector('.carousel-track');
    const dotsWrap = root.querySelector('.carousel-dots');
    const slides = Array.from(track.children);
    if (slides.length < 2) return;

    // Clone first/last for seamless loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    track.insertBefore(lastClone, slides[0]);
    track.appendChild(firstClone);

    const allSlides = Array.from(track.children); // includes clones now
    let index = 1; // start on the first real slide
    let width = viewport.clientWidth;
    let timer = null;
    const AUTO_MS = 5000;

    function goTo(i, { smooth = true } = {}) {
      index = i;
      track.style.transition = smooth ? 'transform .7s ease-in-out' : 'none';
      track.style.transform = `translateX(${-width * index}px)`;
      updateDots();
    }

    // Build dots
    const realCount = slides.length;
    dotsWrap.innerHTML = '';
    const dots = [];
    for (let i = 0; i < realCount; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => {
        stop();
        goTo(i + 1);
        start();
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    }

    function updateDots() {
      const realIndex =
        index === 0 ? realCount - 1 :
        index === realCount + 1 ? 0 :
        index - 1;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === realIndex ? 'true' : 'false'));
    }

    // Autoplay
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function start() { if (!timer) timer = setInterval(next, AUTO_MS); }
    function stop()  { if (timer) { clearInterval(timer); timer = null; } }

    // Loop corrections
    track.addEventListener('transitionend', () => {
      if (index === 0) goTo(realCount, { smooth: false });
      if (index === realCount + 1) goTo(1, { smooth: false });
    });

    // Resize handling
    const ro = new ResizeObserver(() => {
      width = viewport.clientWidth;
      goTo(index, { smooth: false });
    });
    ro.observe(viewport);

    // Pause on hover/focus
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Basic swipe
    let startX = 0;
    let dragging = false;
    viewport.addEventListener('pointerdown', (e) => { dragging = True; startX = e.clientX; stop(); });
    window.addEventListener('pointerup', () => { if (!dragging) return; dragging = false; start(); });
    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 50) { dragging = false; dx < 0 ? next() : prev(); }
    });

    requestAnimationFrame(() => { width = viewport.clientWidth; goTo(1, { smooth: false }); start(); });
  }
})();
