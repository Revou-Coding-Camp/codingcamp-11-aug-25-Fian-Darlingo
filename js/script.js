// Smooth update of time
function updateClock() {
  const el = document.getElementById('timeNow');
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  el.textContent = `Current time : ${now.toString()} (${tz})`;
}
setInterval(updateClock, 1000);
updateClock();

// Welcome title updates from Name (live + persist)
const nameInput = document.getElementById('name');
const welcomeTitle = document.getElementById('welcomeTitle');
const heroInput = document.getElementById('heroName');
const heroSet = document.getElementById('heroSet');
const askFormBtn = document.getElementById('askform');

// Fungsi untuk render welcome title dengan style LinkedOn
function renderWelcome(name) {
  const safe = (name || '').toString().trim();
  let hi = safe ? `Hi ${safe}, Welcome to ` : 'Hi, Welcome to ';
  welcomeTitle.innerHTML = `${hi}<span class="linkedon-logo-text">Linked<span class="linkedon-logo-on">on</span></span>`;
}

// Load from localStorage if exists
const savedName = localStorage.getItem('visitor_name');
if (savedName) {
  renderWelcome(savedName);
  if (heroInput) heroInput.value = savedName;
}

// helper to set name (persist and update welcome)
function setVisitorName(v){
  const safe = (v || '').toString().trim();
  if (safe) {
    renderWelcome(safe);
    localStorage.setItem('visitor_name', safe);
    if (heroInput) heroInput.value = safe;
    if (heroSet) {
      heroSet.textContent = '✓ Set!';
      heroSet.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      setTimeout(() => {
        heroSet.textContent = 'Set Name';
        heroSet.style.background = '';
      }, 2000);
    }
  }
}

heroInput?.addEventListener('keydown', (ev)=>{
  if(ev.key === 'Enter') setVisitorName(heroInput.value);
});

heroSet?.addEventListener('click', ()=> setVisitorName(heroInput.value));

askFormBtn?.addEventListener('click', ()=>{
  if(heroInput && nameInput) nameInput.value = heroInput.value;
  const contact = document.getElementById('contact');
  if(contact) {
    contact.scrollIntoView({behavior:'smooth', block:'start'});
  }
});

// Enhanced typewriter implementation with better timing
function typewriteWelcome(text){
  if(!welcomeTitle) return;
  let i = 0;
  welcomeTitle.textContent = '';
  welcomeTitle.style.opacity = '0.8';
  
  const id = setInterval(()=>{
    welcomeTitle.textContent += text.charAt(i);
    i++;
    if(i >= text.length) {
      clearInterval(id);
      welcomeTitle.style.opacity = '1';
      // Add a subtle bounce effect
      welcomeTitle.style.transform = 'scale(1.02)';
      setTimeout(() => {
        welcomeTitle.style.transform = 'scale(1)';
      }, 200);
    }
  }, 25);
}

// live update from main form input (no persistence until submit)
nameInput?.addEventListener('input', (e) => {
  const v = e.target.value.trim();
  renderWelcome(v);
});

// Form validation + output (safe rendering)
const form = document.getElementById('contactForm');
const result = document.getElementById('result');

function clearChildren(el){ while(el && el.firstChild) el.removeChild(el.firstChild); }

function renderResultSafe(fields){
  if(!result) return;
  clearChildren(result);
  
  // Add fade-in animation
  result.style.opacity = '0';
  result.style.transform = 'translateY(10px)';
  
  Object.entries(fields).forEach(([label, value])=>{
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = label + ' :';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(' ' + (value || '-')));
    result.appendChild(p);
  });
  
  // Animate in
  setTimeout(() => {
    result.style.transition = 'all 0.3s ease';
    result.style.opacity = '1';
    result.style.transform = 'translateY(0)';
  }, 50);
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const email = (data.get('email') || '').toString().trim();
  const phone = (data.get('phone') || '').toString().trim();
  const dob = data.get('dob');
  const gender = data.get('gender');
  const message = (data.get('message') || '').toString().trim();

  const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneOK = /^0\d{9,13}$/.test(phone); // sederhana: mulai 0, 10–14 digit

  const errors = [];
  if (!name) errors.push('Nama wajib diisi.');
  if (!emailOK) errors.push('Email tidak valid.');
  if (!phoneOK) errors.push('No. HP tidak valid (contoh: 08xxxxxxxxxx).');
  if (!dob) errors.push('Tanggal lahir wajib diisi.');
  if (!gender) errors.push('Pilih jenis kelamin.');
  if (!message) errors.push('Pesan wajib diisi.');

  if (errors.length) {
    // render errors in result box (more accessible than alert)
    renderResultSafe({ 'Errors': errors.join(' | ') });
    // show inline errors with animation
    document.getElementById('err-name').textContent = !name ? 'Nama wajib diisi.' : '';
    document.getElementById('err-email').textContent = !emailOK ? 'Email tidak valid.' : '';
    document.getElementById('err-phone').textContent = !phoneOK ? 'No. HP tidak valid.' : '';
    document.getElementById('err-dob').textContent = !dob ? 'Tanggal lahir wajib diisi.' : '';
    document.getElementById('err-gender').textContent = !gender ? 'Pilih jenis kelamin.' : '';
    document.getElementById('err-message').textContent = !message ? 'Pesan wajib diisi.' : '';
    return;
  }

  // Render to the right box safely
  renderResultSafe({
    'Nama': name,
    'Email': email,
    'No. HP': phone,
    'Tanggal Lahir': dob,
    'Jenis Kelamin': gender,
    'Pesan': message
  });

  // Update welcome + persist
  setVisitorName(name);

  // clear inline errors on success
  ['err-name','err-email','err-phone','err-dob','err-gender','err-message'].forEach(id=>{
    const el = document.getElementById(id); if(el) el.textContent = '';
  });

  // Success animation for submit button
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.textContent = '✓ Submitted!';
    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      submitBtn.textContent = 'Submit';
      submitBtn.style.background = '';
    }, 3000);
  }

  // Optional: reset message only (biar UX enak)
  // form.reset(); // uncomment jika ingin form kosong lagi
});

// Enhanced active nav link highlighting with smooth transitions
const sections = ['home','profile','network','portofolio','contact'].map(id => document.getElementById(id));
const links = Array.from(document.querySelectorAll('.nav a'));

function setActiveNav() {
  let idx = 0;
  let fromTop = window.scrollY + 120;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i] && sections[i].offsetTop <= fromTop) {
      idx = i;
    }
  }
  links.forEach((a, i) => a.classList.toggle('active', i === idx));
}

window.addEventListener('scroll', setActiveNav);
setActiveNav();

/* --- Network interactivity --- */
const networkSearch = document.getElementById('networkSearch');
const networkGrid = document.getElementById('networkGrid');
const tagButtons = Array.from(document.querySelectorAll('.tag'));

function matchesFilter(card, q, tag){
  const text = (card.textContent || '').toLowerCase();
  const tags = (card.getAttribute('data-tags') || '').toLowerCase();
  const qOk = !q || text.includes(q.toLowerCase());
  const tagOk = !tag || tag === 'all' || tags.split(' ').includes(tag);
  return qOk && tagOk;
}

function refreshNetwork(){
  const q = networkSearch?.value || '';
  const active = tagButtons.find(b=>b.classList.contains('active'))?.dataset.filter || 'all';
  
  Array.from(networkGrid.children).forEach((card, index) => {
    const shouldShow = matchesFilter(card, q, active);
    
    if (shouldShow) {
      card.style.display = '';
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    } else {
      card.style.display = 'none';
    }
  });
}

networkSearch?.addEventListener('input', refreshNetwork);

tagButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    tagButtons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
    refreshNetwork();
  });
});

// Expandable card logic untuk networkGrid
networkGrid?.addEventListener('click', (e)=>{
  const card = e.target.closest('.card');
  if(!card) return;
  const details = card.querySelector('.card-details');
  if(!details) return;
  
  const isHidden = details.hasAttribute('hidden');
  
  if(isHidden) {
    details.removeAttribute('hidden');
    details.style.maxHeight = '0';
    details.style.opacity = '0';
    setTimeout(() => {
      details.style.maxHeight = '500px';
      details.style.opacity = '1';
    }, 10);
  } else {
    details.setAttribute('hidden','');
  }
  card.setAttribute('aria-expanded', String(!isHidden));
  card.style.transform = 'scale(1.02)';
  setTimeout(() => card.style.transform = '', 200);
});

networkGrid?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter' || e.key === ' ') {
    const card = e.target.closest('.card');
    if(!card) return;
    const details = card.querySelector('.card-details');
    if(!details) return;
    e.preventDefault();
    const isHidden = details.hasAttribute('hidden');
    if(isHidden) {
      details.removeAttribute('hidden');
      details.style.maxHeight = '500px';
      details.style.opacity = '1';
    } else {
      details.setAttribute('hidden','');
    }
  }
});

// initialize active tag
if(tagButtons.length) tagButtons[0].classList.add('active');

/* Profile toggles with enhanced animations */
document.querySelectorAll('.profile-toggle').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const parent = btn.closest('.profile-card');
    const details = parent.querySelector('.card-details');
    const isOpen = details.classList.contains('open');

    if(!isOpen){ 
      details.style.display = 'block';
      // Force reflow for transition
      void details.offsetWidth;
      details.classList.add('open');
      btn.setAttribute('aria-expanded','true');
      btn.textContent = 'Hide';
    } else { 
      details.classList.remove('open');
      // Setelah transisi selesai, sembunyikan display
      setTimeout(() => {
        if(!details.classList.contains('open')) details.style.display = 'none';
      }, 300);
      btn.setAttribute('aria-expanded','false');
      btn.textContent = 'Detail';
    }

    btn.style.transform = 'scale(0.95)';
    setTimeout(() => btn.style.transform = '', 150);
  });
});

// auto-open first profile card for better discovery
const firstProfile = document.querySelector('.profile-card');
if(firstProfile){ 
  const d = firstProfile.querySelector('.card-details'); 
  if(d) { 
    d.classList.add('open');
    d.style.display = 'block';
    const t = firstProfile.querySelector('.profile-toggle'); 
    if(t) {
      t.setAttribute('aria-expanded','true');
      t.textContent = 'Hide';
    }
  }
}

/* Hero CTA and modal + theme */
const heroCTA = document.getElementById('heroCTA');
const quickSignup = document.getElementById('quickSignup');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const quickForm = document.getElementById('quickForm');

heroCTA?.addEventListener('click', ()=>{
  const contact = document.getElementById('contact');
  if(contact) {
    contact.scrollIntoView({behavior:'smooth', block:'start'});
    
    // Add button animation
    heroCTA.style.transform = 'scale(0.95)';
    setTimeout(() => heroCTA.style.transform = '', 150);
  }
});

quickSignup?.addEventListener('click', ()=>{
  if(modalBackdrop) { 
    modalBackdrop.style.display='flex'; 
    modalBackdrop.setAttribute('aria-hidden','false');
    
    // Add entrance animation
    modalBackdrop.style.opacity = '0';
    setTimeout(() => modalBackdrop.style.opacity = '1', 10);
  }
});

modalClose?.addEventListener('click', ()=>{ 
  if(modalBackdrop){
    modalBackdrop.style.opacity = '0';
    setTimeout(() => {
      modalBackdrop.style.display='none'; 
      modalBackdrop.setAttribute('aria-hidden','true');
    }, 200);
  }
});

modalBackdrop?.addEventListener('click', (e)=>{ 
  if(e.target === modalBackdrop){
    modalBackdrop.style.opacity = '0';
    setTimeout(() => {
      modalBackdrop.style.display='none'; 
      modalBackdrop.setAttribute('aria-hidden','true');
    }, 200);
  }
});

quickForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  // fake submit: show success and close
  const btn = quickForm.querySelector('button[type="submit"]');
  if(btn) {
    btn.textContent = '✓ Terkirim!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  }
  
  setTimeout(()=>{ 
    if(modalBackdrop){
      modalBackdrop.style.opacity = '0';
      setTimeout(() => {
        modalBackdrop.style.display='none'; 
        modalBackdrop.setAttribute('aria-hidden','true');
      }, 200);
    } 
    if(btn) {
      btn.textContent = 'Kirim';
      btn.style.background = '';
    }
  }, 2000);
});

// Add smooth scroll behavior for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add intersection observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards and sections for fade-in effect
document.querySelectorAll('.card, .profile-card, .section').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Add loading animation for the page
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});
