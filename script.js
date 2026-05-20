/* ===== JAVASCRIPT ===== */

// Custom Cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px'; });
function animRing() {
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animRing);
}
animRing();
document.querySelectorAll('a,button,.filter-btn,.project-card,.service-card,.soft-skill-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)'; });
});

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

// Active nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav() {
  const scrollY = window.scrollY;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinksEl.classList.toggle('open'));
navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinksEl.classList.remove('open')));

// Hero Canvas – Particle field
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resizeCanvas() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.6 + 0.1;
    this.color = Math.random() > 0.5 ? '0,255,135' : '16,185,129';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(22,163,74,${0.15 * (1 - d/110)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  // gradient bg
  const grad = ctx.createRadialGradient(W*0.5, H*0.5, 0, W*0.5, H*0.5, W*0.7);
  grad.addColorStop(0, 'rgba(22,163,74,0.08)');
  grad.addColorStop(1, 'rgba(3,7,4,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animCanvas);
}
animCanvas();

// Scroll Reveal
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

// Counter animation
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = +e.target.dataset.count;
      let count = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        e.target.textContent = count;
      }, 30);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// Skill bars
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(s => skillObs.observe(s));

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.style.display = show ? '' : 'none';
      card.style.animation = show ? 'fadeIn .4s ease' : '';
    });
  });
});

// Contact form
const form = document.getElementById('contactForm');
const btnText = document.getElementById('btnText');
const btnLoading = document.getElementById('btnLoading');
const formNote = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline-flex';
  setTimeout(() => {
    btnText.style.display = 'inline-flex';
    btnLoading.style.display = 'none';
    formNote.textContent = '✅ Message sent! I\'ll get back to you soon.';
    formNote.style.color = '#00ff87';
    form.reset();
    setTimeout(() => formNote.textContent = '', 4000);
  }, 1800);
});

// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    // Only intercept if target exists and we want to scroll
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Lightbox Modal & Suite Showcase Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxTag = document.getElementById('lightboxTag');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const defaultSuites = {
  branding: [
    { id: 'b1', img: 'mind_frame_logo.jpg', title: 'Mindframes Design Logo', tag: 'Brand Identity', desc: 'Dynamic M/D monogram with bold neon green on deep forest green — custom studio identity.' },
    { id: 'b2', img: 'BERRY .JPG.jpg', title: 'Berry Juice Factory Logo', tag: 'Logo Design', desc: "Modern 'B' lettermark with organic fruit & droplet concept. Glowing neon elements." },
    { id: 'b3', img: 'SHAMNAD .JPG.jpg', title: 'Shamnad Brandmark', tag: 'Logo Design', desc: 'Elegant \'S\' lettermark with custom geometric balance. Designed in cream on deep forest green.' },
    { id: 'b4', img: 'project1_logo.png', title: 'Apex Tech Brandmark', tag: 'Logo Design', desc: 'Futuristic geometric symbol and logotype designed for a high-performance tech startup.' },
    { id: 'b5', img: 'project2_branding.png', title: 'Nova Studio Identity', tag: 'Brand Identity', desc: 'Minimalist brand packaging and print collateral showcase in a cohesive dark theme.' }
  ],
  posters: [
    { id: 'p1', img: 'shirt.jpg.jpg', title: 'Classic Summer Shirt Creative', tag: 'Social Media Posters', desc: 'Minimalist product mockup display featuring a patterned shirt with elegant typography, optimized for e-commerce.' },
    { id: 'p2', img: 'TRAVELON EID POSTER.jpg.jpg', title: 'Tax Loop Eid Greetings', tag: 'Social Media Posters', desc: 'Festive branding campaign creative illustrating professionals collaborating around a futuristic crescent moon table.' },
    { id: 'p3', img: 'finacial year.jpg', title: 'Tax Loop Financial New Year', tag: 'Social Media Posters', desc: 'Corporate new financial year campaign post featuring custom bar charts, coin stacks, and progress visuals.' },
    { id: 'p4', img: 'tax.jpg.jpg', title: 'Tax Loop Corporate Ladder', tag: 'Social Media Posters', desc: 'Motivational corporate ladder banner highlighting professional growth, stepping up building blocks towards success.' },
    { id: 'p5', img: 'travalon.jpg.jpg', title: 'Travelon Handbag Campaign', tag: 'Social Media Posters', desc: 'High-fashion editorial style banner showcase displaying premium leather handbags in a serene mountain landscape.' }
  ],
  products: [
    { id: 'pr1', img: 'LIPSTICK.jpg.jpg', title: 'Luxe Premium Lipstick', tag: 'Product Posters', desc: 'Elegant matte red lipstick layout with custom stripe background and modern typography.' },
    { id: 'pr2', img: 'jbl head phone.jpg.jpg', title: 'JBL Wireless Tune 720BT', tag: 'Product Posters', desc: 'Minimalist clean wireless headphones poster highlighting features on a soft lavender color.' },
    { id: 'pr3', img: 'porsche jpg.jpg', title: 'Porsche 911 Turbo S Specs', tag: 'Product Posters', desc: 'High-performance specifications brochure detailing acceleration, speeds, and structural metrics.' },
    { id: 'pr4', img: 'pain relief. jpg.jpg', title: 'Denix Pain Relief Roll-On', tag: 'Product Posters', desc: 'Creative pain relief display design with 3D product mockup layout and feature callouts.' },
    { id: 'pr5', img: 'ATITUDE 2 .jpg.jpg', title: 'Pentingnya Attitude Creative', tag: 'Product Posters', desc: 'Inspirational quote banner featuring a motorcycle and rider overlay layout.' }
  ]
};

let suites = JSON.parse(localStorage.getItem('mind_frame_projects')) || defaultSuites;

// Backwards compatibility check
Object.keys(suites).forEach(cat => {
  suites[cat].forEach((proj, index) => {
    if (!proj.id) {
      proj.id = cat.substring(0, 2) + '-' + index + '-' + Math.random().toString(36).substr(2, 4);
    }
  });
});

let currentSuite = suites.branding;
let activeIndex = 0;
let isLightboxTransitioning = false;

const lightboxGridContainer = document.getElementById('lightboxGridContainer');
const lightboxBody = document.getElementById('lightboxBody');
const lightboxBackToGrid = document.getElementById('lightboxBackToGrid');

function renderGridThumbnails() {
  if (!lightboxGridContainer) return;
  lightboxGridContainer.innerHTML = '';
  currentSuite.forEach((project, idx) => {
    const gridItem = document.createElement('div');
    gridItem.className = `lightbox-grid-item item-${idx}`;
    
    const img = document.createElement('img');
    img.src = project.img;
    img.alt = project.title;
    
    gridItem.appendChild(img);
    
    // Zoom/expand click handler
    gridItem.addEventListener('click', () => {
      updateLightboxSlide(idx, 'next', false);
      switchLightboxMode('single');
    });
    
    // Custom cursor hovers
    gridItem.addEventListener('mouseenter', () => {
      ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)';
    });
    gridItem.addEventListener('mouseleave', () => {
      ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)';
    });

    lightboxGridContainer.appendChild(gridItem);
  });
}

function switchLightboxMode(mode) {
  const navs = document.querySelectorAll('.lightbox-nav');
  if (mode === 'grid') {
    lightbox.classList.remove('mode-single');
    lightbox.classList.add('mode-grid');
    
    lightboxBody.style.opacity = '0';
    lightboxBody.style.transform = 'scale(0.96)';
    navs.forEach(nav => nav.style.opacity = '0');
    
    setTimeout(() => {
      lightboxBody.style.display = 'none';
      lightboxGridContainer.style.display = 'grid';
      lightboxGridContainer.offsetWidth; // Reflow
      lightboxGridContainer.style.opacity = '1';
      lightboxGridContainer.style.transform = 'scale(1)';
    }, 200);
  } else {
    lightbox.classList.remove('mode-grid');
    lightbox.classList.add('mode-single');
    
    lightboxGridContainer.style.opacity = '0';
    lightboxGridContainer.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      lightboxGridContainer.style.display = 'none';
      lightboxBody.style.display = 'flex';
      navs.forEach(nav => nav.style.opacity = '1');
      lightboxBody.offsetWidth; // Reflow
      lightboxBody.style.opacity = '1';
      lightboxBody.style.transform = 'scale(1)';
      
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.opacity = '1';
    }, 200);
  }
}

function updateLightboxSlide(index, direction = 'next', isSwitching = true) {
  if (isLightboxTransitioning) return;
  const project = currentSuite[index];
  if (!project) return;

  if (isSwitching) {
    isLightboxTransitioning = true;
    
    const exitClass = direction === 'next' ? 'blur-out-next' : 'blur-out-prev';
    lightboxImg.classList.add(exitClass);
    
    const infoPanel = document.querySelector('.lightbox-info');
    if (infoPanel) infoPanel.classList.add('transitioning');
    
    setTimeout(() => {
      activeIndex = index;
      lightboxImg.src = project.img;
      lightboxImg.alt = project.title;
      lightboxTitle.textContent = project.title;
      lightboxTag.textContent = project.tag;
      lightboxDesc.textContent = project.desc;
      lightboxCounter.textContent = `${activeIndex + 1} / ${currentSuite.length}`;
      
      lightboxImg.classList.remove(exitClass);
      const entryClass = direction === 'next' ? 'blur-in-next' : 'blur-in-prev';
      lightboxImg.classList.add(entryClass);
      
      lightboxImg.offsetWidth; // Reflow
      
      lightboxImg.classList.remove(entryClass);
      if (infoPanel) infoPanel.classList.remove('transitioning');
      
      isLightboxTransitioning = false;
    }, 250);
  } else {
    // Immediate load on open
    activeIndex = index;
    lightboxImg.src = project.img;
    lightboxImg.alt = project.title;
    lightboxTitle.textContent = project.title;
    lightboxTag.textContent = project.tag;
    lightboxDesc.textContent = project.desc;
    lightboxCounter.textContent = `${activeIndex + 1} / ${currentSuite.length}`;
  }
}

document.querySelectorAll('.project-suite-trigger, .featured-suite-card').forEach(trigger => {
  trigger.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    
    const cardEl = trigger.closest('.project-card');
    const suiteId = trigger.getAttribute('data-suite') || (cardEl ? cardEl.getAttribute('data-suite') : null);
    if (suiteId && suites[suiteId]) {
      currentSuite = suites[suiteId];
      
      // Set to loading/intro state
      lightbox.classList.add('mode-grid');
      lightboxGridContainer.style.opacity = '0';
      lightboxGridContainer.style.transform = 'scale(0.96)';
      lightboxGridContainer.style.display = 'grid';
      lightboxBody.style.display = 'none';
      
      renderGridThumbnails();
      lightbox.classList.add('active');
      
      setTimeout(() => {
        lightboxGridContainer.style.opacity = '1';
        lightboxGridContainer.style.transform = 'scale(1)';
      }, 50);
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.classList.remove('mode-single');
  lightbox.classList.remove('mode-grid');
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

if (lightboxPrev) {
  lightboxPrev.addEventListener('click', e => {
    e.stopPropagation();
    if (isLightboxTransitioning) return;
    let nextIndex = activeIndex - 1;
    if (nextIndex < 0) nextIndex = currentSuite.length - 1;
    updateLightboxSlide(nextIndex, 'prev');
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener('click', e => {
    e.stopPropagation();
    if (isLightboxTransitioning) return;
    let nextIndex = activeIndex + 1;
    if (nextIndex >= currentSuite.length) nextIndex = 0;
    updateLightboxSlide(nextIndex, 'next');
  });
}

// Close on Escape, Navigate on Arrows
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  
  if (!lightbox.classList.contains('mode-single') || isLightboxTransitioning) return;
  if (e.key === 'ArrowRight') {
    let nextIndex = activeIndex + 1;
    if (nextIndex >= currentSuite.length) nextIndex = 0;
    updateLightboxSlide(nextIndex, 'next');
  }
  if (e.key === 'ArrowLeft') {
    let nextIndex = activeIndex - 1;
    if (nextIndex < 0) nextIndex = currentSuite.length - 1;
    updateLightboxSlide(nextIndex, 'prev');
  }
});

// Gesture Swipe / Drag Handling
const imgContainer = document.getElementById('lightboxImgContainer');
if (imgContainer) {
  let touchStartX = 0;
  let touchStartY = 0;
  let dragStartX = 0;
  let isDragging = false;

  imgContainer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  imgContainer.addEventListener('touchend', e => {
    if (isLightboxTransitioning || !lightbox.classList.contains('mode-single')) return;
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    
    if (Math.abs(diffX) > 50 && Math.abs(diffY) < 100) {
      if (diffX < 0) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= currentSuite.length) nextIndex = 0;
        updateLightboxSlide(nextIndex, 'next');
      } else {
        let nextIndex = activeIndex - 1;
        if (nextIndex < 0) nextIndex = currentSuite.length - 1;
        updateLightboxSlide(nextIndex, 'prev');
      }
    }
  }, { passive: true });

  imgContainer.addEventListener('mousedown', e => {
    if (!lightbox.classList.contains('mode-single')) return;
    dragStartX = e.clientX;
    isDragging = true;
    imgContainer.style.cursor = 'grabbing';
  });

  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    imgContainer.style.cursor = 'grab';
    
    const diffX = e.clientX - dragStartX;
    if (Math.abs(diffX) > 60) {
      if (diffX < 0) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= currentSuite.length) nextIndex = 0;
        updateLightboxSlide(nextIndex, 'next');
      } else {
        let nextIndex = activeIndex - 1;
        if (nextIndex < 0) nextIndex = currentSuite.length - 1;
        updateLightboxSlide(nextIndex, 'prev');
      }
    }
  });

  imgContainer.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      imgContainer.style.cursor = 'grab';
    }
  });
}

// Back to grid event
if (lightboxBackToGrid) {
  lightboxBackToGrid.addEventListener('click', e => {
    e.stopPropagation();
    switchLightboxMode('grid');
  });
  lightboxBackToGrid.addEventListener('mouseenter', () => {
    ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)';
  });
  lightboxBackToGrid.addEventListener('mouseleave', () => {
    ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)';
  });
}
// Add cursor ring hover indicators for lightbox elements
document.querySelectorAll('.lightbox-close, .lightbox-nav, .project-suite-trigger, .featured-suite-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)'; });
});

// Interactive 3D Card Tilt Effect
document.querySelectorAll('.featured-suite-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    const rotX = -(dy / yc) * 12; // Max 12deg tilt
    const rotY = (dx / xc) * 12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});



// Add cursor ring hover indicators for lightbox and carousel elements
document.querySelectorAll('.lightbox-close, .lightbox-nav, .project-suite-trigger, .featured-suite-card, .carousel-arrow').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)'; });
});

// Add fade-in keyframe
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn{from{opacity:0;transform:scale(0.95);}to{opacity:1;transform:scale(1);}}';
document.head.appendChild(style);

// Hero intro animation is handled via CSS keyframes for smoother sliding effects.

// Parallax Scroll Animation for Product Posters Card Image
const productCardEl = document.querySelector('.product-parallax-card');
if (productCardEl) {
  function applyParallax() {
    const rect = productCardEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Check visibility
    if (rect.top < viewportHeight && rect.bottom > 0) {
      // Fraction of item progression through viewport
      const visibleRange = viewportHeight + rect.height;
      const scrolledPast = viewportHeight - rect.top;
      const scrolledPercent = scrolledPast / visibleRange;
      
      // Shift range: -24px to +24px
      const shiftY = (scrolledPercent - 0.5) * 48;
      productCardEl.style.setProperty('--parallax-y', `${shiftY}px`);
    }
  }
  
  window.addEventListener('scroll', applyParallax);
  window.addEventListener('resize', applyParallax);
  applyParallax();
}

// Interactive 3D Hero Parallax Tilt Effect
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  heroVisual.addEventListener('mousemove', e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const mx = (x - xc) / xc; // Ranges from -1 to 1
    const my = (y - yc) / yc; // Ranges from -1 to 1
    
    heroVisual.style.setProperty('--mx', mx.toFixed(3));
    heroVisual.style.setProperty('--my', my.toFixed(3));
  });
  
  heroVisual.addEventListener('mouseleave', () => {
    heroVisual.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
    heroVisual.style.setProperty('--mx', '0');
    heroVisual.style.setProperty('--my', '0');
  });
  
  heroVisual.addEventListener('mouseenter', () => {
    heroVisual.style.transition = 'none';
  });
}

// Interactive 3D Skills Section Container Tilt Effect (Full Size)
const skillsSect = document.getElementById('skills');
const skillsContainer = document.querySelector('.skills .section-container');

if (skillsSect && skillsContainer) {
  skillsSect.addEventListener('mousemove', e => {
    const rect = skillsSect.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    
    // Smooth angle rotation (max 4.5 degrees)
    const rotX = -(dy / yc) * 4.5;
    const rotY = (dx / xc) * 4.5;
    
    skillsContainer.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  
  skillsSect.addEventListener('mouseleave', () => {
    skillsContainer.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    skillsContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
  
  skillsSect.addEventListener('mouseenter', () => {
    skillsContainer.style.transition = 'transform 0.15s ease-out';
  });
}

// ==========================================================================
// ADMIN PORTAL & SECURE LOGIN SYSTEM LOGIC
// ==========================================================================

// Global admin configurations & modes
let dbMode = 'local';
let db = null;
let auth = null;
let activeDashboardTab = 'branding';
let uploadedBase64Image = '';

// DOM Elements
const adminBtn = document.getElementById('adminBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminDashboardModal = document.getElementById('adminDashboardModal');
const loginModalClose = document.getElementById('loginModalClose');
const dashboardClose = document.getElementById('dashboardClose');
const loginFormView = document.getElementById('loginFormView');
const setupFormView = document.getElementById('setupFormView');
const forgotFormView = document.getElementById('forgotFormView');

// Actions buttons
const adminLogoutBtn = document.getElementById('adminLogoutBtn');
const openAddProjectBtn = document.getElementById('openAddProjectBtn');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const dbSettingsClose = document.getElementById('dbSettingsClose');
const projectFormClose = document.getElementById('projectFormClose');
const projectFormModal = document.getElementById('projectFormModal');
const dbSettingsModal = document.getElementById('dbSettingsModal');

// Forms & alerts
const adminLoginForm = document.getElementById('adminLoginForm');
const adminSetupForm = document.getElementById('adminSetupForm');
const adminForgotForm = document.getElementById('adminForgotForm');
const projectForm = document.getElementById('projectForm');
const firebaseConfigForm = document.getElementById('firebaseConfigForm');

const loginErrorAlert = document.getElementById('loginErrorAlert');
const loginSuccessAlert = document.getElementById('loginSuccessAlert');
const setupErrorAlert = document.getElementById('setupErrorAlert');
const forgotErrorAlert = document.getElementById('forgotErrorAlert');
const forgotSuccessAlert = document.getElementById('forgotSuccessAlert');
const projectFormErrorAlert = document.getElementById('projectFormErrorAlert');
const dbSettingsSuccessAlert = document.getElementById('dbSettingsSuccessAlert');

// Image upload controls
const projectImgFile = document.getElementById('projectImgFile');
const fileDropArea = document.getElementById('fileDropArea');
const fileUploadPreview = document.getElementById('fileUploadPreview');
const filePreviewImg = document.getElementById('filePreviewImg');
const removeFileBtn = document.getElementById('removeFileBtn');

// Initialize Database connection on start
const storedFbConfig = JSON.parse(localStorage.getItem('mind_frame_firebase_config'));
if (storedFbConfig && storedFbConfig.apiKey) {
  try {
    firebase.initializeApp(storedFbConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    dbMode = 'firebase';
    console.log("Database Mode: Connected to Firebase Cloud Services.");
  } catch (error) {
    console.error("Failed to connect to Firebase. Falling back to local storage.", error);
    dbMode = 'local';
  }
}

function initDatabase() {
  const authStatusText = document.getElementById('authStatusText');
  if (dbMode === 'firebase') {
    authStatusText.textContent = 'Connected: Firebase Cloud';
    authStatusText.style.backgroundColor = 'rgba(59, 130, 246, 0.15)';
    authStatusText.style.borderColor = 'rgba(59, 130, 246, 0.3)';
    authStatusText.style.color = '#60a5fa';
    
    // Read projects dynamically from cloud doc
    db.collection('config').doc('projects').get().then(doc => {
      if (doc.exists) {
        suites = doc.data();
        localStorage.setItem('mind_frame_projects', JSON.stringify(suites));
        updateFeaturedCards();
      } else {
        // Doc not found -> seed
        db.collection('config').doc('projects').set(defaultSuites)
          .then(() => {
            suites = defaultSuites;
            updateFeaturedCards();
          });
      }
    }).catch(err => {
      console.error("Firestore read error:", err);
      updateFeaturedCards();
    });
  } else {
    authStatusText.textContent = 'Connected: Local Database';
    authStatusText.style.backgroundColor = 'rgba(22, 163, 74, 0.15)';
    authStatusText.style.borderColor = 'rgba(22, 163, 74, 0.3)';
    authStatusText.style.color = 'var(--purple-light)';
    
    suites = JSON.parse(localStorage.getItem('mind_frame_projects')) || defaultSuites;
    updateFeaturedCards();
  }
}

// Initial Sync call
initDatabase();

// Redraw featured cards values dynamically
function updateFeaturedCards() {
  document.querySelectorAll('.featured-suite-card').forEach(card => {
    const suiteId = card.getAttribute('data-suite');
    if (suiteId && suites[suiteId]) {
      const count = suites[suiteId].length;
      const countText = suiteId === 'branding' ? `${count} Projects` : `${count} Posters`;
      
      const triggerLink = card.querySelector('.project-suite-trigger');
      if (triggerLink) {
        triggerLink.innerHTML = `Explore ${countText} <i class="fa-solid fa-arrow-right"></i>`;
      }
      
      const coverImg = card.querySelector('.project-img');
      if (coverImg && suites[suiteId].length > 0) {
        coverImg.src = suites[suiteId][0].img;
        coverImg.alt = suites[suiteId][0].title;
      }
    }
  });
}

function saveProjectsToStorage() {
  if (dbMode === 'firebase') {
    db.collection('config').doc('projects').set(suites)
      .then(() => console.log('Firestore Database synced.'))
      .catch(err => console.error('Firestore Database sync error:', err));
  } else {
    localStorage.setItem('mind_frame_projects', JSON.stringify(suites));
  }
}

// Handle Check Login State
function checkLoginState() {
  if (dbMode === 'firebase') {
    auth.onAuthStateChanged(user => {
      if (user) {
        onLoginSuccess();
      } else {
        onLogoutSuccess();
      }
    });
  } else {
    const isLoggedInLocal = sessionStorage.getItem('mind_frame_logged_in') === 'true';
    if (isLoggedInLocal) {
      onLoginSuccess();
    } else {
      onLogoutSuccess();
    }
  }
}

function onLoginSuccess() {
  adminLoginModal.classList.remove('active');
  adminDashboardModal.classList.add('active');
  const adminBtnIcon = document.querySelector('#adminBtn i');
  if (adminBtnIcon) {
    adminBtnIcon.className = 'fa-solid fa-user-gear';
  }
  renderDashboardProjects();
}

function onLogoutSuccess() {
  adminDashboardModal.classList.remove('active');
  const adminBtnIcon = document.querySelector('#adminBtn i');
  if (adminBtnIcon) {
    adminBtnIcon.className = 'fa-solid fa-user-lock';
  }
  sessionStorage.removeItem('mind_frame_logged_in');
}

// Open login modal / portal click listener
if (adminBtn) {
  adminBtn.addEventListener('click', () => {
    if (dbMode === 'firebase') {
      if (auth.currentUser) {
        adminDashboardModal.classList.add('active');
        renderDashboardProjects();
      } else {
        showLoginView();
        adminLoginModal.classList.add('active');
      }
    } else {
      // Local Mode credentials validation check
      let localCreds = localStorage.getItem('mind_frame_admin_credentials');
      if (!localCreds) {
        // Seed default local credentials requested by the user
        localStorage.setItem('mind_frame_admin_credentials', JSON.stringify({
          email: 'sydramees2001@gmail.com',
          password: 'Ramees@2001'
        }));
        showLoginView();
        adminLoginModal.classList.add('active');
      } else {
        const isLoggedInLocal = sessionStorage.getItem('mind_frame_logged_in') === 'true';
        if (isLoggedInLocal) {
          adminDashboardModal.classList.add('active');
          renderDashboardProjects();
        } else {
          showLoginView();
          adminLoginModal.classList.add('active');
        }
      }
    }
  });
}

function showLoginView() {
  loginFormView.style.display = 'block';
  setupFormView.style.display = 'none';
  forgotFormView.style.display = 'none';
  if (adminLoginForm) adminLoginForm.reset();
  if (loginErrorAlert) loginErrorAlert.style.display = 'none';
  if (loginSuccessAlert) loginSuccessAlert.style.display = 'none';
}

function showSetupView() {
  loginFormView.style.display = 'none';
  setupFormView.style.display = 'block';
  forgotFormView.style.display = 'none';
  if (adminSetupForm) adminSetupForm.reset();
  if (setupErrorAlert) setupErrorAlert.style.display = 'none';
}

function showForgotView() {
  loginFormView.style.display = 'none';
  setupFormView.style.display = 'none';
  forgotFormView.style.display = 'block';
  if (adminForgotForm) adminForgotForm.reset();
  if (forgotErrorAlert) forgotErrorAlert.style.display = 'none';
  if (forgotSuccessAlert) forgotSuccessAlert.style.display = 'none';
}

// Close Modals actions
if (loginModalClose) {
  loginModalClose.addEventListener('click', () => {
    adminLoginModal.classList.remove('active');
  });
}
if (dashboardClose) {
  dashboardClose.addEventListener('click', () => {
    adminDashboardModal.classList.remove('active');
  });
}

// Link navigation inside modal
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', e => {
    e.preventDefault();
    showForgotView();
  });
}

const backToLoginBtn = document.getElementById('backToLoginBtn');
if (backToLoginBtn) {
  backToLoginBtn.addEventListener('click', () => {
    showLoginView();
  });
}

// Setup Form Listener (Local Wizard Credentials)
if (adminSetupForm) {
  adminSetupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('setupEmail').value;
    const password = document.getElementById('setupPassword').value;
    
    if (password.length < 6) {
      setupErrorAlert.textContent = 'Password must be at least 6 characters long!';
      setupErrorAlert.style.display = 'block';
      return;
    }
    
    // Store credentials locally
    localStorage.setItem('mind_frame_admin_credentials', JSON.stringify({ email, password }));
    
    // Log them in immediately
    sessionStorage.setItem('mind_frame_logged_in', 'true');
    onLoginSuccess();
  });
}

// Login Form Submit Listener
if (adminLoginForm) {
  adminLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (loginErrorAlert) loginErrorAlert.style.display = 'none';
    if (loginSuccessAlert) loginSuccessAlert.style.display = 'none';
    
    if (dbMode === 'firebase') {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          onLoginSuccess();
        })
        .catch(error => {
          loginErrorAlert.textContent = error.message;
          loginErrorAlert.style.display = 'block';
        });
    } else {
      const localCreds = JSON.parse(localStorage.getItem('mind_frame_admin_credentials'));
      if (localCreds && localCreds.email === email && localCreds.password === password) {
        sessionStorage.setItem('mind_frame_logged_in', 'true');
        onLoginSuccess();
      } else {
        loginErrorAlert.textContent = 'Invalid administrator email or password.';
        loginErrorAlert.style.display = 'block';
      }
    }
  });
}

// Forgot Password link email reset logic
if (adminForgotForm) {
  adminForgotForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    
    if (forgotErrorAlert) forgotErrorAlert.style.display = 'none';
    if (forgotSuccessAlert) forgotSuccessAlert.style.display = 'none';
    
    if (dbMode === 'firebase') {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          forgotSuccessAlert.textContent = 'Password reset email sent! Check your inbox.';
          forgotSuccessAlert.style.display = 'block';
        })
        .catch(error => {
          forgotErrorAlert.textContent = error.message;
          forgotErrorAlert.style.display = 'block';
        });
    } else {
      const localCreds = JSON.parse(localStorage.getItem('mind_frame_admin_credentials'));
      if (localCreds && localCreds.email === email) {
        // Reset password to 'password123' locally for convenience and show notification
        localCreds.password = 'password123';
        localStorage.setItem('mind_frame_admin_credentials', JSON.stringify(localCreds));
        
        forgotSuccessAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> Reset link simulated. Local Admin password has been set to: <strong>password123</strong>`;
        forgotSuccessAlert.style.display = 'block';
      } else {
        forgotErrorAlert.textContent = 'No administrator account matches that email address.';
        forgotErrorAlert.style.display = 'block';
      }
    }
  });
}

// Logout script trigger
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener('click', () => {
    if (dbMode === 'firebase') {
      auth.signOut().then(() => {
        onLogoutSuccess();
      });
    } else {
      onLogoutSuccess();
    }
  });
}

// Dashboard Categories view filters
document.querySelectorAll('.dash-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeDashboardTab = tab.getAttribute('data-tab');
    renderDashboardProjects();
  });
});

function renderDashboardProjects() {
  const listContainer = document.getElementById('adminProjectsList');
  if (!listContainer) return;
  listContainer.innerHTML = '';
  
  const categoryProjects = suites[activeDashboardTab] || [];
  
  if (categoryProjects.length === 0) {
    listContainer.innerHTML = `
      <div style="padding: 4rem 2rem; text-align: center; color: var(--gray);">
        <i class="fa-regular fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: rgba(22, 163, 74, 0.4);"></i>
        <p>No projects in this suite yet. Click "Add New Work" to upload!</p>
      </div>
    `;
    return;
  }
  
  categoryProjects.forEach((proj, idx) => {
    const row = document.createElement('div');
    row.className = 'project-list-row';
    
    row.innerHTML = `
      <div class="col-img">
        <img src="${proj.img}" alt="${proj.title}" class="list-row-img" onerror="this.src='mind_frame_logo.jpg';" />
      </div>
      <div class="col-title">${proj.title}</div>
      <div class="col-tag"><span class="dashboard-tag-pill">${proj.tag}</span></div>
      <div class="col-desc">${proj.desc}</div>
      <div class="col-actions">
        <button class="btn-row-edit" data-id="${proj.id}" aria-label="Edit project"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="btn-row-delete" data-id="${proj.id}" aria-label="Delete project"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
    
    // Add custom cursor triggers
    row.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mouseenter', () => { ring.style.width='46px'; ring.style.height='46px'; ring.style.borderColor='rgba(0,255,135,0.8)'; });
      btn.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)'; });
    });
    
    row.querySelector('.btn-row-edit').addEventListener('click', () => openEditProjectForm(proj.id));
    row.querySelector('.btn-row-delete').addEventListener('click', () => deleteProjectItem(proj.id));
    
    listContainer.appendChild(row);
  });
}

// File drop and select listeners
if (projectImgFile) {
  projectImgFile.addEventListener('change', handleFileSelect);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 800 * 1024) {
    alert('File size exceeds the 800KB Firestore limit! Please compress the image or use an External URL.');
    projectImgFile.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(evt) {
    uploadedBase64Image = evt.target.result;
    filePreviewImg.src = uploadedBase64Image;
    fileDropArea.style.display = 'none';
    fileUploadPreview.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

if (removeFileBtn) {
  removeFileBtn.addEventListener('click', () => {
    uploadedBase64Image = '';
    projectImgFile.value = '';
    fileDropArea.style.display = 'flex';
    fileUploadPreview.style.display = 'none';
  });
}

// Setup dragover styles for file uploads
if (fileDropArea) {
  ['dragenter', 'dragover'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, e => {
      e.preventDefault();
      fileDropArea.classList.add('drag-over');
    }, false);
  });
  ['dragleave', 'drop'].forEach(eventName => {
    fileDropArea.addEventListener(eventName, e => {
      e.preventDefault();
      fileDropArea.classList.remove('drag-over');
    }, false);
  });
  fileDropArea.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length) {
      projectImgFile.files = files;
      handleFileSelect({ target: { files: files } });
    }
  });
}

// Handle Form switches (URL vs File)
const imgSrcRadioButtons = document.querySelectorAll('input[name="imgSrcType"]');
imgSrcRadioButtons.forEach(radio => {
  radio.addEventListener('change', e => {
    if (e.target.value === 'url') {
      document.getElementById('imgUrlGroup').style.display = 'block';
      document.getElementById('imgFileGroup').style.display = 'none';
    } else {
      document.getElementById('imgUrlGroup').style.display = 'none';
      document.getElementById('imgFileGroup').style.display = 'block';
    }
  });
});

// Modal views controls
if (openAddProjectBtn) {
  openAddProjectBtn.addEventListener('click', openAddProjectForm);
}
if (projectFormClose) {
  projectFormClose.addEventListener('click', () => {
    projectFormModal.classList.remove('active');
  });
}

function openAddProjectForm() {
  document.getElementById('projectFormTitle').textContent = 'Add New Portfolio Work';
  document.getElementById('editProjectId').value = '';
  projectForm.reset();
  
  uploadedBase64Image = '';
  document.getElementById('fileDropArea').style.display = 'flex';
  document.getElementById('fileUploadPreview').style.display = 'none';
  
  // Set category dropdown to current tab
  document.getElementById('projectCategory').value = activeDashboardTab;
  
  // Set default radio selection
  document.querySelector('input[name="imgSrcType"][value="url"]').checked = true;
  document.getElementById('imgUrlGroup').style.display = 'block';
  document.getElementById('imgFileGroup').style.display = 'none';
  
  if (projectFormErrorAlert) projectFormErrorAlert.style.display = 'none';
  projectFormModal.classList.add('active');
}

function openEditProjectForm(id) {
  let project = null;
  let catFound = '';
  Object.keys(suites).forEach(cat => {
    const found = suites[cat].find(p => p.id === id);
    if (found) {
      project = found;
      catFound = cat;
    }
  });
  
  if (!project) return;
  
  document.getElementById('projectFormTitle').textContent = 'Edit Portfolio Work';
  document.getElementById('editProjectId').value = project.id;
  document.getElementById('projectCategory').value = catFound;
  document.getElementById('projectTag').value = project.tag;
  document.getElementById('projectName').value = project.title;
  document.getElementById('projectDescription').value = project.desc;
  
  if (project.img && project.img.startsWith('data:image')) {
    document.querySelector('input[name="imgSrcType"][value="file"]').checked = true;
    document.getElementById('imgUrlGroup').style.display = 'none';
    document.getElementById('imgFileGroup').style.display = 'block';
    
    uploadedBase64Image = project.img;
    filePreviewImg.src = project.img;
    fileDropArea.style.display = 'none';
    fileUploadPreview.style.display = 'flex';
  } else {
    document.querySelector('input[name="imgSrcType"][value="url"]').checked = true;
    document.getElementById('imgUrlGroup').style.display = 'block';
    document.getElementById('imgFileGroup').style.display = 'none';
    
    document.getElementById('projectImgUrl').value = project.img || '';
    uploadedBase64Image = '';
  }
  
  if (projectFormErrorAlert) projectFormErrorAlert.style.display = 'none';
  projectFormModal.classList.add('active');
}

function deleteProjectItem(id) {
  if (confirm('Are you sure you want to delete this work from your portfolio?')) {
    Object.keys(suites).forEach(cat => {
      suites[cat] = suites[cat].filter(p => p.id !== id);
    });
    
    saveProjectsToStorage();
    initDatabase();
    renderDashboardProjects();
  }
}

// Project Add/Edit Form submit listener
if (projectForm) {
  projectForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const editId = document.getElementById('editProjectId').value;
    const category = document.getElementById('projectCategory').value;
    const tag = document.getElementById('projectTag').value;
    const title = document.getElementById('projectName').value;
    const desc = document.getElementById('projectDescription').value;
    
    const imgSrcType = document.querySelector('input[name="imgSrcType"]:checked').value;
    let img = '';
    
    if (imgSrcType === 'url') {
      img = document.getElementById('projectImgUrl').value || 'mind_frame_logo.jpg';
    } else {
      img = uploadedBase64Image || 'mind_frame_logo.jpg';
    }
    
    if (editId) {
      let originalCat = '';
      Object.keys(suites).forEach(cat => {
        const found = suites[cat].find(p => p.id === editId);
        if (found) originalCat = cat;
      });
      
      if (originalCat) {
        if (originalCat === category) {
          const index = suites[category].findIndex(p => p.id === editId);
          if (index > -1) {
            suites[category][index] = { id: editId, img, title, tag, desc };
          }
        } else {
          suites[originalCat] = suites[originalCat].filter(p => p.id !== editId);
          suites[category].push({ id: editId, img, title, tag, desc });
        }
      }
    } else {
      const newProj = {
        id: category.substring(0, 2) + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        img,
        title,
        tag,
        desc
      };
      suites[category].push(newProj);
    }
    
    saveProjectsToStorage();
    initDatabase();
    
    projectFormModal.classList.remove('active');
    renderDashboardProjects();
  });
}

// Settings Database Config Forms Control
if (openSettingsBtn) {
  openSettingsBtn.addEventListener('click', () => {
    const config = JSON.parse(localStorage.getItem('mind_frame_firebase_config')) || {};
    document.getElementById('fbApiKey').value = config.apiKey || '';
    document.getElementById('fbAuthDomain').value = config.authDomain || '';
    document.getElementById('fbProjectId').value = config.projectId || '';
    document.getElementById('fbStorageBucket').value = config.storageBucket || '';
    document.getElementById('fbAppId').value = config.appId || '';
    
    if (dbSettingsSuccessAlert) dbSettingsSuccessAlert.style.display = 'none';
    dbSettingsModal.classList.add('active');
  });
}

if (dbSettingsClose) {
  dbSettingsClose.addEventListener('click', () => {
    dbSettingsModal.classList.remove('active');
  });
}

if (firebaseConfigForm) {
  firebaseConfigForm.addEventListener('submit', e => {
    e.preventDefault();
    const config = {
      apiKey: document.getElementById('fbApiKey').value.trim(),
      authDomain: document.getElementById('fbAuthDomain').value.trim(),
      projectId: document.getElementById('fbProjectId').value.trim(),
      storageBucket: document.getElementById('fbStorageBucket').value.trim(),
      appId: document.getElementById('fbAppId').value.trim()
    };
    
    if (config.apiKey) {
      localStorage.setItem('mind_frame_firebase_config', JSON.stringify(config));
      dbSettingsSuccessAlert.textContent = 'Firebase Cloud Configured! Restarting app...';
      dbSettingsSuccessAlert.style.display = 'block';
    } else {
      localStorage.removeItem('mind_frame_firebase_config');
      dbSettingsSuccessAlert.textContent = 'Configuration reset! Restarting app...';
      dbSettingsSuccessAlert.style.display = 'block';
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
}

const disconnectDbBtn = document.getElementById('disconnectDbBtn');
if (disconnectDbBtn) {
  disconnectDbBtn.addEventListener('click', () => {
    localStorage.removeItem('mind_frame_firebase_config');
    dbSettingsSuccessAlert.textContent = 'Disconnected! Reverting back to local browser mode...';
    dbSettingsSuccessAlert.style.display = 'block';
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
}

// Bind custom cursor rings for new interactive admin elements
document.querySelectorAll('#adminBtn, .admin-modal-close, .admin-modal-close-dash, .dash-tab, .btn-ghost, .btn-primary').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,255,135,0.8)'; });
  el.addEventListener('mouseleave', () => { ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,135,0.5)'; });
});

// Initial session verification check
checkLoginState();

// ==========================================================================
// 3D BACKGROUND ANIMATION IN SKILLS SECTION
// ==========================================================================

const skillsCanvas = document.getElementById('skillsCanvas');
if (skillsCanvas) {
  const sCtx = skillsCanvas.getContext('2d');
  let sW, sH;
  let spacing = 65;
  
  function resizeSkillsCanvas() {
    sW = skillsCanvas.width = skillsCanvas.offsetWidth;
    sH = skillsCanvas.height = skillsCanvas.offsetHeight;
    spacing = Math.max(50, sW / 25); // Dynamically scale spacing to cover full viewport width
  }
  resizeSkillsCanvas();
  window.addEventListener('resize', resizeSkillsCanvas);
  
  // Grid parameters
  const cols = 38;
  const rows = 24;
  const points = [];
  
  // Generate static mesh coordinates centered around origin
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      points.push({
        gridX: c - cols / 2,
        gridZ: r - rows / 2
      });
    }
  }
  
  let time = 0;
  let mouseX = 0, mouseY = 0;
  let mouseActive = false;
  
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    skillsSection.addEventListener('mousemove', e => {
      const rect = skillsSection.getBoundingClientRect();
      mouseX = e.clientX - rect.left - sW / 2;
      mouseY = e.clientY - rect.top - sH / 2;
      mouseActive = true;
    });
    skillsSection.addEventListener('mouseleave', () => {
      mouseActive = false;
    });
  }
  
  // Camera tilt angles
  const angleX = 0.70; // steeper top-down angle to cover vertical height
  const angleY = 0.10; // flatter side angle to cover horizontal width
  
  const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
  const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
  
  function animateSkillsCanvas() {
    sCtx.clearRect(0, 0, sW, sH);
    time += 0.025;
    
    const projectedPoints = [];
    
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      const rawX = pt.gridX * spacing;
      const rawZ = pt.gridZ * spacing;
      
      // Compute Y coordinate as dynamic 3D waves
      const distFromCenter = Math.sqrt(rawX * rawX + rawZ * rawZ);
      let waveY = Math.sin(distFromCenter * 0.0055 - time * 1.5) * 35;
      waveY += Math.cos(rawX * 0.012 + time) * 15;
      
      // Interactive mouse ripple distortion
      if (mouseActive) {
        const rotX_m = rawX * cosY - rawZ * sinY;
        const rotZ_m = rawX * sinY + rawZ * cosY;
        const rotY_m = waveY * cosX - rotZ_m * sinX;
        
        const dx = rotX_m - mouseX;
        const dy = rotY_m - mouseY;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < 220) {
          const force = (220 - distToMouse) / 220;
          waveY += force * force * 45; // lift wave points near mouse
        }
      }
      
      // Apply 3D Rotations
      // 1. Rotation around Y-axis
      const rx = rawX * cosY - rawZ * sinY;
      const rz1 = rawX * sinY + rawZ * cosY;
      
      // 2. Rotation around X-axis
      const ry = waveY * cosX - rz1 * sinX;
      const rz2 = waveY * sinX + rz1 * cosX;
      
      // Perspective projection
      const cameraDepth = 550;
      const projectedZ = rz2 + 160;
      
      if (projectedZ > 0) {
        const scale = cameraDepth / (cameraDepth + projectedZ);
        const screenX = sW / 2 + rx * scale;
        const screenY = sH / 2 + ry * scale;
        
        projectedPoints.push({
          x: screenX,
          y: screenY,
          depth: projectedZ,
          scale: scale,
          gridXIndex: pt.gridX,
          gridZIndex: pt.gridZ
        });
      }
    }
    
    // Sort points back-to-front
    projectedPoints.sort((a, b) => b.depth - a.depth);
    
    // Draw 3D wireframe mesh connections
    sCtx.lineWidth = 0.45;
    sCtx.strokeStyle = 'rgba(22, 163, 74, 0.08)';
    
    // Columns
    for (let c = -cols/2; c < cols/2; c++) {
      sCtx.beginPath();
      let first = true;
      for (let r = -rows/2; r < rows/2; r++) {
        const p = projectedPoints.find(pt => pt.gridXIndex === c && pt.gridZIndex === r);
        if (p) {
          if (first) {
            sCtx.moveTo(p.x, p.y);
            first = false;
          } else {
            sCtx.lineTo(p.x, p.y);
          }
        }
      }
      sCtx.stroke();
    }
    
    // Rows
    for (let r = -rows/2; r < rows/2; r++) {
      sCtx.beginPath();
      let first = true;
      for (let c = -cols/2; c < cols/2; c++) {
        const p = projectedPoints.find(pt => pt.gridXIndex === c && pt.gridZIndex === r);
        if (p) {
          if (first) {
            sCtx.moveTo(p.x, p.y);
            first = false;
          } else {
            sCtx.lineTo(p.x, p.y);
          }
        }
      }
      sCtx.stroke();
    }
    
    // Draw grid dot vertices
    for (let i = 0; i < projectedPoints.length; i++) {
      const p = projectedPoints[i];
      const radius = 1.35 * p.scale;
      const alpha = Math.max(0, Math.min(0.38, (1 - p.depth / 900) * 0.38));
      
      sCtx.beginPath();
      sCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(0, 255, 135, ${alpha})`;
      sCtx.fill();
    }
    
    requestAnimationFrame(animateSkillsCanvas);
  }
  
  requestAnimationFrame(animateSkillsCanvas);
}


