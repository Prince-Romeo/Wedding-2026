/* ── CUSTOM CURSOR ── */
if (window.matchMedia('(pointer:fine)').matches) {
  document.body.classList.add('has-cursor');
  const cursor = document.getElementById('cursor'), dot = document.getElementById('cursorDot');
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function animCursor(){ cx+=(mx-cx)*0.15; cy+=(my-cy)*0.15; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(animCursor); }
  animCursor();
  document.querySelectorAll('a,button,.fab,.gallery-item,.couple-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor.style.transform='translate(-50%,-50%) scale(1.8)');
    el.addEventListener('mouseleave',()=>cursor.style.transform='translate(-50%,-50%) scale(1)');
  });
}

/* ── LOADER ── */
window.addEventListener('load', () => setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000));

/* ── HAMBURGER ── */
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));

/* ── GIFT BOX OPEN ANIMATION ── */
let giftOpened = false;
function openGift() {
  if (giftOpened) return;
  giftOpened = true;

  document.getElementById('openBtn').classList.add('hide');
  document.getElementById('giftLid').classList.add('open');
  document.getElementById('giftBoxWrap').classList.add('opened');

  launchConfetti();

  setTimeout(() => {
    document.getElementById('giftIntro').classList.add('hide');
  }, 1200);
}

/* ── MUSIC PLAYER ── */
const songs = ['Tum Hi Ho', 'Teri Meri', 'Kesariya', 'Raabta', 'Pehla Nasha', 'Mere Haath Mein'];
const songUrls = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
];

let songIdx = 0, isPlaying = false, progress = 0, mpInterval = null;
let audio = null;

function initAudio() {
  if (!audio) {
    audio = new Audio();
    audio.volume = 0.55;
    audio.addEventListener('ended', () => nextSong());
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        progress = (audio.currentTime / audio.duration) * 100;
        document.getElementById('mpBar').style.width = progress + '%';
      }
    });
    audio.addEventListener('error', () => {
      startFakeProgress();
    });
  }
}

function tryPlayMusic() {
  initAudio();
  audio.src = songUrls[songIdx];
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      document.getElementById('mpPlayBtn').textContent = '⏸';
    }).catch(() => {
      isPlaying = false;
    });
  }
}

function startFakeProgress() {
  if (mpInterval) clearInterval(mpInterval);
  mpInterval = setInterval(() => {
    progress += 0.5;
    if (progress >= 100) { progress = 0; nextSong(); }
    document.getElementById('mpBar').style.width = progress + '%';
  }, 150);
}

function toggleMusicPlayer() {
  document.getElementById('musicPlayer').classList.toggle('show');
}

function togglePlay() {
  initAudio();
  if (!audio.src) audio.src = songUrls[songIdx];
  if (isPlaying) {
    audio.pause();
    if (mpInterval) clearInterval(mpInterval);
    isPlaying = false;
    document.getElementById('mpPlayBtn').textContent = '▶';
  } else {
    audio.play().then(() => {
      isPlaying = true;
      document.getElementById('mpPlayBtn').textContent = '⏸';
    }).catch(() => { startFakeProgress(); isPlaying = true; document.getElementById('mpPlayBtn').textContent = '⏸'; });
  }
}

function nextSong() {
  songIdx = (songIdx + 1) % songs.length;
  document.getElementById('mpSong').textContent = songs[songIdx];
  progress = 0;
  if (audio) { audio.src = songUrls[songIdx]; if (isPlaying) audio.play().catch(()=>{}); }
}

function prevSong() {
  songIdx = (songIdx - 1 + songs.length) % songs.length;
  document.getElementById('mpSong').textContent = songs[songIdx];
  progress = 0;
  if (audio) { audio.src = songUrls[songIdx]; if (isPlaying) audio.play().catch(()=>{}); }
}

function seekMusic(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  progress = (e.clientX - rect.left) / rect.width * 100;
  document.getElementById('mpBar').style.width = progress + '%';
  if (audio && audio.duration) { audio.currentTime = (progress / 100) * audio.duration; }
}

/* ── PAGE NAVIGATION ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(id)) a.classList.add('active');
  });
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(checkReveal, 100);
  return false;
}

/* ── FLOATING PETALS ── */
const petalEl = document.getElementById('petals');
const petalArr = ['🌸','🌺','🌼','✨','🌷','💮','🎀'];
for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = petalArr[Math.floor(Math.random() * petalArr.length)];
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDelay = Math.random() * 15 + 's';
  p.style.animationDuration = (12 + Math.random() * 10) + 's';
  p.style.fontSize = (1 + Math.random() * 0.8) + 'rem';
  petalEl.appendChild(p);
}

/* ── COUNTDOWN TIMER ── */
const weddingDate = new Date('2026-05-12T20:30:00');
function updateCD() {
  const now = new Date(), diff = Math.max(0, weddingDate - now);
  document.getElementById('cd-days').textContent = String(Math.floor(diff/86400000)).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(Math.floor(diff%86400000/3600000)).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(Math.floor(diff%3600000/60000)).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(Math.floor(diff%60000/1000)).padStart(2,'0');
}
updateCD(); setInterval(updateCD, 1000);

/* ── GALLERY WITH DELETE ── */
const defaultItems = [
  {e:'💒',l:'Wedding Venue'},{e:'💍',l:'The Ring'},{e:'🌸',l:'Floral Decor'},
  {e:'👰',l:'Bride'},{e:'🤵',l:'Groom'},{e:'🎊',l:'Sangeet Night'},
  {e:'🌿',l:'Haldi Ceremony'},{e:'🪔',l:'Tilak'},{e:'🎶',l:'Music & Dance'},
  {e:'🍽',l:'Grand Feast'},{e:'❤️',l:'Love Story'},{e:'✨',l:'Magical Moment'}
];
let lbItems = [], lbIndex = 0;
const grid = document.getElementById('galleryGrid');

function buildGallery() {
  grid.innerHTML = ''; lbItems = [];
  defaultItems.forEach((g, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item reveal';
    item.innerHTML = `<div class="gallery-ph"><div style="font-size:3rem">${g.e}</div><span>${g.l}</span></div><div class="gallery-overlay">🔍</div>`;
    item.onclick = () => openLightbox(i, 'emoji', g);
    lbItems.push({ type: 'emoji', data: g });
    grid.appendChild(item);
  });
}
buildGallery();

function handlePhotoUpload(e) {
  Array.from(e.target.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const idx = lbItems.length;
      lbItems.push({ type: 'img', src: ev.target.result });

      const item = document.createElement('div');
      item.className = 'gallery-item reveal visible';
      item.innerHTML = `<img src="${ev.target.result}" alt="Wedding Photo"><div class="gallery-overlay">🔍</div><button class="gallery-delete" title="Remove photo">✕</button>`;

      const delBtn = item.querySelector('.gallery-delete');
      delBtn.addEventListener('click', function(evt) {
        evt.stopPropagation();
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => item.remove(), 300);
      });

      item.addEventListener('click', () => openLightbox(idx, 'img', { src: ev.target.result }));
      grid.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
}

/* ── DRAG & DROP ── */
const uz = document.getElementById('uploadZone');
uz.addEventListener('dragover', e => { e.preventDefault(); uz.classList.add('dragover'); });
uz.addEventListener('dragleave', () => uz.classList.remove('dragover'));
uz.addEventListener('drop', e => { e.preventDefault(); uz.classList.remove('dragover'); handlePhotoUpload({ target: { files: e.dataTransfer.files }, value: '' }); });

/* ── LIGHTBOX ── */
function openLightbox(idx, type, data) {
  lbIndex = idx;
  const c = document.getElementById('lightboxContent');
  if (type === 'img' || data.src) { c.innerHTML = `<img src="${data.src || data}" alt="Wedding Photo">`; }
  else { c.innerHTML = `<div class="lb-placeholder"><div style="font-size:5rem;margin-bottom:1rem">${data.e}</div><p>${data.l}</p></div>`; }
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }
function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
  const item = lbItems[lbIndex];
  const c = document.getElementById('lightboxContent');
  if (item.type === 'img') { c.innerHTML = `<img src="${item.src}" alt="Wedding Photo">`; }
  else { c.innerHTML = `<div class="lb-placeholder"><div style="font-size:5rem;margin-bottom:1rem">${item.data.e}</div><p>${item.data.l}</p></div>`; }
}
document.getElementById('lightbox').addEventListener('click', function(e) { if (e.target === this) closeLightbox(); });

/* ── VENUE TABS ── */
function switchVenue(idx, btn) {
  document.querySelectorAll('.venue-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.venue-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('vp' + idx).classList.add('active');
  setTimeout(checkReveal, 100);
}

/* ── RSVP FORM ── */
function submitRsvp(e) {
  e.preventDefault();
  document.getElementById('rsvpForm').style.display = 'none';
  document.getElementById('successMsg').style.display = 'block';
  launchConfetti();
}

/* ── WISHES WALL ── */
const defaultWishes = [
  {name:'Priya Devi',text:'Khushbu aur Sujeet ko hamare dil se dheron shubhkamnaein! Bhagwan aap dono ko hamesha khush rakhe. 💕',emoji:'🌸',time:'2 days ago'},
  {name:'Rajesh Sahani',text:'Do dilon ka milan, ek naya safar shuru hota hai. Aap dono ki jodi hamesha saalamaat rahe!',emoji:'💍',time:'1 day ago'},
  {name:'Sunita Ji',text:'Bahut bahut badhaai ho! Khushbu ki tarah khushiyan hamesha bikhrti rahen aapki zindagi mein.',emoji:'🎊',time:'5 hours ago'}
];

function renderWishes() {
  const wGrid = document.getElementById('wishesGrid');
  wGrid.innerHTML = '';
  const allWishes = JSON.parse(localStorage.getItem('weddingWishes') || '[]');

  [...allWishes].reverse().forEach((w, reversedIdx) => {
    const realIdx = allWishes.length - 1 - reversedIdx;
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
      <button class="wish-remove-btn" title="Remove wish">✕</button>
      <div class="wish-emoji">${w.emoji}</div>
      <p class="wish-name">✨ ${w.name}</p>
      <p class="wish-text">"${w.text}"</p>
      <p class="wish-time">${w.time}</p>`;
    card.querySelector('.wish-remove-btn').addEventListener('click', () => {
      card.style.transition = 'opacity 0.3s, transform 0.3s';
      card.style.opacity = '0'; card.style.transform = 'scale(0.85)';
      setTimeout(() => {
        const saved = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
        saved.splice(realIdx, 1);
        localStorage.setItem('weddingWishes', JSON.stringify(saved));
        renderWishes();
      }, 300);
    });
    wGrid.appendChild(card);
  });

  [...defaultWishes].reverse().forEach(w => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `<div class="wish-emoji">${w.emoji}</div><p class="wish-name">✨ ${w.name}</p><p class="wish-text">"${w.text}"</p><p class="wish-time">${w.time}</p>`;
    wGrid.appendChild(card);
  });
}
renderWishes();

function submitWish() {
  const name = document.getElementById('wishName').value.trim();
  const text = document.getElementById('wishText').value.trim();
  if (!name || !text) { alert('Please enter your name and wish!'); return; }
  const emojis = ['💕','🌸','💍','🎊','✨','🌺','💐','🥰'];
  const wish = { name, text, emoji: emojis[Math.floor(Math.random()*emojis.length)], time: 'Just now' };
  const saved = JSON.parse(localStorage.getItem('weddingWishes') || '[]');
  saved.push(wish);
  localStorage.setItem('weddingWishes', JSON.stringify(saved));
  document.getElementById('wishName').value = '';
  document.getElementById('wishText').value = '';
  renderWishes();
  launchConfetti();
}

/* ── WHATSAPP SHARE ── */
function shareWhatsApp() {
  const msg = encodeURIComponent('🎉 Khushbu ❤ Sujeet ki Shaadi!\n\n📅 May 12, 2026 | Tuesday\n📍 Ghurahu Kothiyan, Saran, Bihar\n⏰ Muhurat: 8:30 PM\n\nAap sabko nimantran hai! 🙏\n\nMade by Prince Sahani 💍');
  window.open('https://wa.me/?text=' + msg, '_blank');
}

/* ── CONFETTI ── */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#C9A84C','#F0D080','#8B1A1A','#D4521A','#fff','#FFD700','#FF69B4'];
  const particles = Array.from({length:150}, () => ({
    x: Math.random()*canvas.width, y: -20,
    vx: (Math.random()-0.5)*4, vy: Math.random()*4+2,
    color: colors[Math.floor(Math.random()*colors.length)],
    size: Math.random()*8+4, rotation: Math.random()*360, rotSpeed: (Math.random()-0.5)*10
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.rotation+=p.rotSpeed; p.vy+=0.05;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotation*Math.PI/180);
      ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size/2);
      ctx.restore();
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.display='none'; }
  }
  draw();
}

/* ── PRINT INVITATION ── */
function showPrintCard() {
  document.getElementById('printArea').style.display = 'block';
  window.print();
  setTimeout(() => document.getElementById('printArea').style.display = 'none', 1000);
}

/* ── SCROLL REVEAL ── */
function checkReveal() {
  document.querySelectorAll('.reveal:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
  });
}
window.addEventListener('scroll', checkReveal);
setTimeout(checkReveal, 300);

/* ── PWA MANIFEST ── */
const manifest = {
  name:'Khushbu & Sujeet Wedding',
  short_name:'K❤S Wedding',
  start_url:'.',
  display:'standalone',
  background_color:'#1A0800',
  theme_color:'#C9A84C',
  icons:[{src:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💍</text></svg>',sizes:'512x512',type:'image/svg+xml'}]
};
const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
document.getElementById('manifestLink').href = URL.createObjectURL(blob);
