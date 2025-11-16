// Zena Touch - App JS
(function(){
  'use strict';

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('zt_theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.checked = savedTheme === 'dark';
    toggle.addEventListener('change', () => {
      const t = toggle.checked ? 'dark' : 'light';
      root.setAttribute('data-theme', t);
      try { localStorage.setItem('zt_theme', t); } catch(e) {}
    });
  }

  // LocalStorage helper
  function getLS(key, fallback=null){
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch(e){ return fallback; }
  }

  // Media helpers from manifest
  function getManifestImages(){ return (window.ZT_MEDIA && Array.isArray(window.ZT_MEDIA.images)) ? window.ZT_MEDIA.images : []; }
  function getManifestVideos(){ return (window.ZT_MEDIA && Array.isArray(window.ZT_MEDIA.videos)) ? window.ZT_MEDIA.videos : []; }

  // Curated services preset (Arabic)
  const PRESET_SERVICES = [
    { title: 'تصميم وتركيب إضاءة المناسبات السعيدة', desc: '"حوّل مناسباتك الخاصة إلى ذكرى مضيئة لا تُنسى. فريقنا من الخبراء يصمم وينفذ إضاءة ساحرة تليق بأفراحكم، من حفلات الزفاف الأنيقة إلى التجمعات العائلية البهيجة. دع الأضواء تروي قصة سعادتكم."', category: 'lighting' },
    { title: 'إضاءة الأعياد والمواسم (رمضان، العيد الوطني، رأس السنة)', desc: '"احتفل بروح الأعياد وأضف لمسة من البهجة على منزلك. نقدم تصاميم إضاءة مبتكرة ومخصصة لكل موسم، تعكس الأجواء الاحتفالية وتجعل منزلك محط الأنظار. استقبل ضيوفك بأجواء تفيض بالجمال والدفء."', category: 'lighting' },
    { title: 'إبراز الجمال المعماري للواجهات', desc: '"لكل مبنى قصة فريدة، ودورنا هو أن نرويها بالضوء. من خلال تقنيات الإضاءة الحديثة، نبرز أدق تفاصيل واجهة منزلك أو مشروعك التجاري، لنمنحه هيبة وجمالاً يخطف الأبصار ليلاً ونهاراً."', category: 'lighting' },
    { title: 'تصميم إضاءة الحدائق والمناظر الطبيعية', desc: '"اجعل حديقتك لوحة فنية تتألق في المساء. نقوم بتصميم أنظمة إضاءة متكاملة تبرز جمال الأشجار والنباتات، وتضيء الممرات بشكل آمن وأنيق. استمتع بأمسيات هادئة في واحتك الخارجية الخاصة."', category: 'lighting' },
    { title: 'أنظمة الإضاءة الذكية والتحكم عن بعد', desc: '"تحكم بجمال منزلك بلمسة زر. نوفر أحدث حلول الإضاءة الذكية التي تتيح لك تغيير الألوان، شدة السطوع، والجداول الزمنية عبر هاتفك. اصنع الأجواء المثالية لكل لحظة بكل سهولة."', category: 'installation' },
    { title: 'إضاءة المسابح والنوافير', desc: '"أضف بُعداً جديداً من السحر إلى مساحاتك المائية. نقدم حلول إضاءة آمنة ومقاومة للماء تحوّل مسبحك أو نافورتك إلى نقطة جذب بصرية مذهلة، وتخلق أجواء استرخاء فاخرة."', category: 'lighting' },
    { title: 'خدمة الصيانة والفك والتخزين', desc: '"استمتع بالزينة دون عناء. بعد انتهاء مناسبتك، يتولى فريقنا فك الإضاءة بعناية وتغليفها وتخزينها بشكل احترافي للموسم القادم، لتبقى جديدة وجاهزة لإسعادك مرة أخرى."', category: 'installation' },
    { title: 'استشارات تصميم الإضاءة الاحترافية', desc: '"هل لديك رؤية وتحتاج إلى خبير ليحققها؟ نقدم جلسات استشارية لمساعدتك على اختيار أفضل التصاميم والتقنيات التي تناسب مساحتك وميزانيتك، لنضمن لك نتيجة تفوق توقعاتك."', category: 'lighting' },
    { title: 'تأجير معدات الإضاءة للمناسبات', desc: '"لإضاءة مبهرة بتكلفة أقل. إذا كنت تحتاج إلى إضاءة احترافية لمناسبة واحدة، فإن خدمة التأجير هي خيارك الأمثل. نوفر لك أحدث المعدات مع التركيب والفك لضمان راحتك."', category: 'lighting' },
    { title: 'تنفيذ تصاميم وشعارات ضوئية خاصة', desc: '"حوّل فكرتك إلى واقع مضيء. سواء كان شعار شركتك، أو اسم العروسين، أو أي تصميم خاص، يمكننا تنفيذه باستخدام الأضواء لنضيف لمسة شخصية فريدة ومبهرة لمناسبتك أو مشروعك."', category: 'lighting' },
  ];

  // Build a fixed mapping between service title and an image from manifest (first N images)
  function buildFixedServiceImageMap(){
    const imgs = getManifestImages();
    const map = {};
    PRESET_SERVICES.forEach((s, i)=>{ if (imgs[i]) map[s.title] = imgs[i]; });
    return map;
  }
  // Get Admin override mapping if exists: { title: imageUrl }
  function getAdminServiceImageMap(){
    const m = getLS('zt_service_images', null);
    return (m && typeof m === 'object') ? m : null;
  }
  function getServiceImageFor(title, idx){
    const admin = getAdminServiceImageMap();
    if (admin && admin[title]) return admin[title];
    const fixed = buildFixedServiceImageMap();
    if (fixed[title]) return fixed[title];
    const imgs = getManifestImages();
    return imgs[idx % (imgs.length||1)] || '';
  }
  function setHeroFromManifest(){
    const imgs = getManifestImages();
    if (!imgs.length) return;
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const bg = hero.getAttribute('style') || '';
    if (bg.includes("images/hero.jpg")) {
      hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.6)), url('${imgs[0]}')`;
    }
  }
  function populateSwiperFromManifest(selector){
    const imgs = getManifestImages();
    if (!imgs.length) return;
    const el = document.querySelector(selector);
    if (!el) return;
    const wrapper = el.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = imgs.map(src => `<div class="swiper-slide"><img src="${src}" alt="media"></div>`).join('');
  }

  function initHeroVideo(){
    const video = document.getElementById('heroVideo');
    if (!video) return;
    const vids = getManifestVideos();
    if (!vids.length) return;
    const imgs = getManifestImages();
    if (imgs.length) video.setAttribute('poster', imgs[0]);
    video.src = vids[0];
    // Attempt autoplay; ignore if blocked
    try { const p = video.play(); if (p && typeof p.then === 'function') p.catch(()=>{}); } catch(e) {}
  }

  // Contact info binding (Footer + Floating buttons + Contact page list)
  function applyContactInfo(){
    const c = getLS('zt_contact_info', { phone: '+966 55 123 4567', city: 'الرياض', address: 'الرياض، المملكة العربية السعودية', whatsapp: '966551234567' }) || {};
    const phoneDisplay = c.phone || '+966 55 123 4567';
    const phoneDigits = (c.phone || '+966551234567').replace(/[^+\d]/g, '');
    const waDigits = (c.whatsapp || '966551234567').replace(/\D/g, '');

    const fp = document.getElementById('footerPhone');
    if (fp) { fp.textContent = phoneDisplay; fp.setAttribute('href', 'tel:'+phoneDigits); }
    const fa = document.getElementById('footerAddress');
    if (fa) fa.textContent = c.address || c.city || 'المملكة العربية السعودية';
    const fw = document.getElementById('footerWhatsapp');
    if (fw) fw.setAttribute('href', 'https://wa.me/'+waDigits);

    // Floating buttons
    document.querySelectorAll('.whatsapp-float').forEach(a => a.setAttribute('href', 'https://wa.me/'+waDigits));
    document.querySelectorAll('.call-float').forEach(a => a.setAttribute('href', 'tel:'+phoneDigits));

    // Contact page list
    const cp = document.getElementById('contactPhone');
    if (cp) { cp.textContent = phoneDisplay; cp.setAttribute('href', 'tel:'+phoneDigits); }
    const cw = document.getElementById('contactWhatsapp');
    if (cw) cw.setAttribute('href', 'https://wa.me/'+waDigits);
    const cad = document.getElementById('contactAddress');
    if (cad) cad.textContent = c.address || c.city || 'المملكة العربية السعودية';
  }

  // Language handling
  function swapBootstrapForLang(lang){
    const link = document.querySelector('link[rel="stylesheet"][href*="bootstrap"]');
    if (!link) return;
    const base = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/';
    link.href = base + (lang === 'en' ? 'bootstrap.min.css' : 'bootstrap.rtl.min.css');
  }

  function applyTranslations(lang){
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isEN = lang === 'en';

    // Navbar
    const setText = (sel, ar, en) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = isEN ? en : ar;
    };
    setText('a.nav-link[href$="index.html"]', 'الرئيسية', 'Home');
    setText('a.nav-link[href$="services.html"]', 'الخدمات', 'Services');
    setText('a.nav-link[href$="gallery.html"]', 'المعرض', 'Gallery');
    setText('a.nav-link[href$="about.html"]', 'من نحن', 'About');
    setText('a.nav-link[href$="contact.html"]', 'تواصل', 'Contact');
    setText('a.btn[href$="admin-login.html"]', 'دخول الأدمن', 'Admin Login');

    // Footer headings and rights
    const footerLinks = document.querySelector('footer .col-md-4:nth-child(2) h6');
    if (footerLinks) footerLinks.textContent = isEN ? 'Links' : 'روابط';
    const footerContact = document.querySelector('footer .col-md-4:nth-child(3) h6');
    if (footerContact) footerContact.textContent = isEN ? 'Contact' : 'تواصل';
    const rights = document.querySelector('footer .border-top p');
    if (rights) {
      const y = new Date().getFullYear();
      rights.textContent = isEN ? (`© ${y} Zena Touch. All rights reserved.`) : (`© ${y} Zena Touch. جميع الحقوق محفوظة.`);
    }
    const waFooter = document.getElementById('footerWhatsapp');
    if (waFooter) waFooter.textContent = isEN ? 'WhatsApp' : 'واتساب مباشر';

    // Common CTA section
    const ctaTitle = document.querySelector('.bg-gold h3');
    if (ctaTitle) ctaTitle.textContent = isEN ? 'Got a project or idea? We are happy to help' : 'هل لديك مشروع أو فكرة؟ يسعدنا خدمتك';
    const ctaQuoteBtn = document.querySelector('.bg-gold .btn.btn-dark');
    if (ctaQuoteBtn) ctaQuoteBtn.textContent = isEN ? 'Request a Quote' : 'طلب عرض سعر';
    const ctaWaBtn = document.querySelector('.bg-gold .btn.btn-outline-dark');
    if (ctaWaBtn) ctaWaBtn.innerHTML = isEN ? '<i class="fa-brands fa-whatsapp ms-1"></i> WhatsApp' : '<i class="fa-brands fa-whatsapp ms-1"></i> واتساب';

    // Page-specific
    if (current === 'index.html'){
      setText('.hero-section p.lead', 'خبراء زينة المنازل والإضاءة – جودة، ذوق، وتركيب احترافي.', 'Home decor and lighting experts – quality, taste, and professional installation.');
      setText('#services .section-title', 'خدماتنا', 'Our Services');
      const featuresTitle = document.querySelectorAll('.section-title');
      // first is services, next could be Why us / About; safer by section content
      const whyH2 = document.querySelectorAll('.section-title')[1];
      if (whyH2) whyH2.textContent = isEN ? 'Why choose us?' : 'لماذا تختارنا؟';
      const aboutH2 = document.querySelectorAll('.section-title')[2];
      if (aboutH2) aboutH2.textContent = isEN ? 'About Us' : 'من نحن';
      setText('.section-padding.bg-body .text-muted', 'لمساتنا الراقية في منازل عملائنا.', 'Our refined touches in our clients’ homes.');
      // Services cards
      const cards = document.querySelectorAll('.feature-card .card-title');
      if (cards[0]) cards[0].textContent = isEN ? 'Indoor and Outdoor Lighting' : 'إضاءة داخلية وخارجية';
      if (cards[1]) cards[1].textContent = isEN ? 'Curtains and Furnishings' : 'ستائر ومفروشات';
      if (cards[2]) cards[2].textContent = isEN ? 'Wallpaper' : 'ورق جدران';
      if (cards[3]) cards[3].textContent = isEN ? 'Installation & Maintenance' : 'تركيب وصيانة';
    }
    if (current === 'services.html'){
      setText('.hero-section h1', 'خدماتنا', 'Our Services');
      setText('.hero-section .lead', 'حلول متكاملة لزينة المنازل والإضاءة باحترافية عالية', 'Complete home decor and lighting solutions with high professionalism');
      setText('[data-filter="all"]', 'الكل', 'All');
      setText('[data-filter="lighting"]', 'إضاءة', 'Lighting');
      setText('[data-filter="curtains"]', 'ستائر', 'Curtains');
      setText('[data-filter="wallpaper"]', 'ورق جدران', 'Wallpaper');
      setText('[data-filter="installation"]', 'تركيب وصيانة', 'Installation');
      document.querySelectorAll('#servicesGrid .btn.btn-gold').forEach(btn=> btn.textContent = isEN ? 'Contact' : 'تواصل');
    }
    if (current === 'gallery.html'){
      setText('.hero-section h1', 'معرض الأعمال', 'Portfolio');
      setText('.section-padding.bg-body .section-title', 'أعمال مميزة', 'Featured Works');
    }
    if (current === 'about.html'){
      setText('.hero-section h1', 'من نحن', 'About Us');
      setText('.hero-section .lead', 'رؤية واضحة لتجميل بيتك بلمسات ذهبية', 'A clear vision to beautify your home with golden touches');
      const story = document.querySelector('.section-title');
      if (story) story.textContent = isEN ? 'Our Story' : 'قصتنا';
      const boxes = document.querySelectorAll('.about-stats h5');
      if (boxes[0]) boxes[0].textContent = isEN ? 'Our Vision' : 'رؤيتنا';
      if (boxes[1]) boxes[1].textContent = isEN ? 'Our Mission' : 'رسالتنا';
      if (boxes[2]) boxes[2].textContent = isEN ? 'Our Values' : 'قيمنا';
    }
    if (current === 'contact.html'){
      setText('.hero-section h1', 'تواصل معنا', 'Contact Us');
      setText('.hero-section .lead', 'يسعدنا تواصلك وسنعود إليك سريعًا', 'We are happy to hear from you and will get back soon');
      setText('.service-card h5', 'نموذج التواصل', 'Contact Form');
      // Labels
      const labels = document.querySelectorAll('#contactForm .form-label');
      if (labels[0]) labels[0].textContent = isEN ? 'Full Name' : 'الاسم الكامل';
      if (labels[1]) labels[1].textContent = isEN ? 'Phone' : 'رقم الجوال';
      if (labels[2]) labels[2].textContent = isEN ? 'City' : 'المدينة';
      if (labels[3]) labels[3].textContent = isEN ? 'Message' : 'الرسالة';
      const submit = document.querySelector('#contactForm button[type="submit"]');
      if (submit) submit.textContent = isEN ? 'Send' : 'إرسال';
      const locHeading = document.querySelector('.map-wrapper')?.previousElementSibling;
      if (locHeading && locHeading.tagName === 'H5') {
        locHeading.textContent = isEN ? 'Our Location' : 'موقعنا';
      }
    }
  }

  function applyLang(lang){
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    swapBootstrapForLang(lang);
    try { localStorage.setItem('zt_lang', lang); } catch(e){}
    applyTranslations(lang);
    if (window.AOS) AOS.refresh();
  }

  function setupLanguageSwitcher(){
    const host = document.querySelector('.navbar .d-flex.align-items-center.gap-3');
    if (!host || host.querySelector('.language-switch')) return;
    const wrap = document.createElement('div');
    wrap.className = 'language-switch btn-group';
    wrap.innerHTML = `
      <button type="button" class="btn btn-sm btn-outline-light" data-lang="ar">AR</button>
      <button type="button" class="btn btn-sm btn-outline-light" data-lang="en">EN</button>
    `;
    host.appendChild(wrap);
    const lang = localStorage.getItem('zt_lang') || 'ar';
    const arBtn = wrap.querySelector('[data-lang="ar"]');
    const enBtn = wrap.querySelector('[data-lang="en"]');
    function sync(){
      const current = localStorage.getItem('zt_lang') || 'ar';
      [arBtn, enBtn].forEach(b=> b.classList.remove('active'));
      (current==='ar'?arBtn:enBtn).classList.add('active');
    }
    arBtn.addEventListener('click', ()=>{ applyLang('ar'); sync(); });
    enBtn.addEventListener('click', ()=>{ applyLang('en'); sync(); });
    sync();
  }

  // Active link highlighting
  const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar .nav-link').forEach(a => {
    const href = (a.getAttribute('href')||'').toLowerCase();
    if (href === current) a.classList.add('active'); else a.classList.remove('active');
  });

  // AOS animations
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-quart' });
  }

  // Inject dynamic content from Admin storage (services, gallery)
  function setupServicesFilter(){
    const btnsWrap = document.getElementById('servicesFilters') || document.querySelector('.filter-btns');
    const grid = document.getElementById('servicesGrid');
    if (!btnsWrap || !grid) return;
    const buttons = btnsWrap.querySelectorAll('[data-filter]');

    // Hide filter buttons that have no matching cards (except 'all')
    const cards = grid.querySelectorAll('.service-card');
    const catsSet = new Set([...cards].map(c => (c.getAttribute('data-category')||'').toLowerCase()));
    [...buttons].forEach(b => {
      const f = (b.getAttribute('data-filter')||'').toLowerCase();
      if (f && f !== 'all' && !catsSet.has(f)) { b.classList.add('d-none'); } else { b.classList.remove('d-none'); }
    });

    function applyFilter(f){
      buttons.forEach(b => b.classList.remove('btn-gold'));
      [...buttons].find(b => b.getAttribute('data-filter')===f)?.classList.add('btn-gold');
      grid.querySelectorAll('.service-card').forEach(card => {
        const cat = card.getAttribute('data-category');
        const col = card.closest('[class*="col-"]') || card.parentElement;
        const show = (f==='all' || f===cat);
        if (col) col.classList.toggle('d-none', !show);
      });
      // sync hash
      try { if (f && f !== 'all') { history.replaceState(null, '', '#'+f); } else { history.replaceState(null, '', location.pathname); } } catch(e) {}
    }
    buttons.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-filter'))));
    const initial = (location.hash || '#all').slice(1);
    const visibleButtons = [...buttons].filter(b => !b.classList.contains('d-none'));
    const valid = visibleButtons.some(b=>b.getAttribute('data-filter')===initial);
    applyFilter(valid ? initial : 'all');
    window.addEventListener('hashchange', ()=>{
      const f = (location.hash||'#all').slice(1);
      const visibleNow = [...buttons].filter(b => !b.classList.contains('d-none'));
      if (visibleNow.some(b=>b.getAttribute('data-filter')===f)) applyFilter(f);
    });
  }

  function renderServicesFromLS(){
    const grid = document.getElementById('servicesGrid');
    if (!grid) return false;
    const data = getLS('zt_services', null);
    if (!Array.isArray(data) || data.length===0) { return false; }
    grid.innerHTML = data.map((s, idx)=>`
      <div class="col-12 col-sm-6 col-lg-4" data-aos="fade-up" ${idx%3?`data-aos-delay="${(idx%3)*50}"`:''}>
        <div class="service-card h-100" data-category="${(s.category||'').toLowerCase()}">
          <div class="thumb">${s.image?`<img src="${s.image}" class="w-100" alt="${s.title||''}" loading="lazy">`:`<div class="ph w-100"></div>`}<span class="badge rounded-pill badge-category badge-overlay">${(s.category||'general')}</span></div>
          <div class="p-3">
            <h5 class="fw-bold">${s.title||''}</h5>
            <p class="text-muted">${s.desc||''}</p>
            <div class="d-flex justify-content-between align-items-center">
              <a href="contact.html" class="btn btn-sm btn-gold">تواصل</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    setupServicesFilter();
    if (window.AOS) AOS.refresh();
    return true;
  }

  function renderServicesFromPreset(){
  const grid = document.getElementById('servicesGrid');
  if (!grid) return false;
  const items = PRESET_SERVICES || [];
  if (!items.length) return false;
  grid.innerHTML = items.map((s, idx)=>`
    <div class="col-12 col-sm-6 col-lg-4" data-aos="fade-up" ${idx%3?`data-aos-delay="${(idx%3)*50}"`:''}>
      <div class="service-card h-100" data-category="${(s.category||'general').toLowerCase()}">
        <div class="thumb">${(()=>{ const src = getServiceImageFor(s.title, idx); return src?`<img src="${src}" class="w-100" alt="${s.title}" loading="lazy">`:`<div class="ph w-100"></div>`; })()}<span class="badge rounded-pill badge-category badge-overlay">${(s.category||'general')}</span></div>
        <div class="p-3">
          <h5 class="fw-bold">${s.title}</h5>
          <p class="text-muted">${s.desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            <a href="contact.html" class="btn btn-sm btn-gold">تواصل</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  setupServicesFilter();
  if (window.AOS) AOS.refresh();
  return true;
}

function renderServicesFromManifest(){
  const grid = document.getElementById('servicesGrid');
  if (!grid) return false;
  const imgs = getManifestImages();
  if (!imgs.length) return false;
  const lang = (localStorage.getItem('zt_lang') || 'ar').toLowerCase();
  grid.innerHTML = imgs.map((src, idx)=>`
    <div class="col-12 col-sm-6 col-lg-4" data-aos="fade-up" ${idx%3?`data-aos-delay="${(idx%3)*50}"`:''}>
      <div class="service-card h-100" data-category="general">
        <div class="thumb"><img src="${src}" class="w-100" alt="service ${idx+1}" loading="lazy"><span class="badge rounded-pill badge-category badge-overlay">general</span></div>
        <div class="p-3">
          <h5 class="fw-bold">${lang==='en' ? `Service #${idx+1}` : `خدمة رقم ${idx+1}`}</h5>
          <p class="text-muted">${lang==='en' ? 'Sample description from your media library.' : 'وصف تجريبي من مكتبة الوسائط لديك.'}</p>
          <div class="d-flex justify-content-between align-items-center">
            <a href="contact.html" class="btn btn-sm btn-gold">${lang==='en' ? 'Contact' : 'تواصل'}</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  setupServicesFilter();
  if (window.AOS) AOS.refresh();
  return true;
}

function renderGalleryFromLS(){
  const grid = document.getElementById('galleryGrid');
  if (!grid) return false;
  const data = getLS('zt_gallery', null);
  if (!Array.isArray(data) || data.length===0) return false;
  grid.innerHTML = data.map((g)=>`
    <div class="col-6 col-md-4 col-lg-3">
      <a href="${g.image}" data-lightbox="zt-gallery" data-title="${g.title||''}" class="d-block rounded-4 overflow-hidden shadow-sm">
        <img src="${g.image}" class="w-100" alt="${g.title||''}" loading="lazy">
      </a>
    </div>
  `).join('');
  if (window.AOS) AOS.refresh();
  return true;
}

function renderGalleryFromManifest(){
  const grid = document.getElementById('galleryGrid');
  if (!grid) return false;
  const imgs = getManifestImages();
  if (!imgs.length) return false;
  grid.innerHTML = imgs.map(src=>`
    <div class="col-6 col-md-4 col-lg-3">
      <a href="${src}" data-lightbox="zt-gallery" data-title="" class="d-block rounded-4 overflow-hidden shadow-sm">
        <img src="${src}" class="w-100" alt="gallery" loading="lazy">
      </a>
    </div>
  `).join('');
  if (window.AOS) AOS.refresh();
  return true;
}

  function renderVideosFromManifest(){
    const grid = document.getElementById('videoGrid');
    if (!grid) return false;
    const vids = getManifestVideos();
    if (!vids.length) return false;
    grid.innerHTML = vids.map(src=>`
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="gallery-video">
          <video controls playsinline preload="metadata" src="${src}"></video>
        </div>
      </div>
    `).join('');
    if (window.AOS) AOS.refresh();
    return true;
  }

  // Populate swipers from manifest (images only) before initializing Swiper
  populateSwiperFromManifest('.projects-swiper');
  populateSwiperFromManifest('.gallery-swiper');

  // Swiper for projects
  if (typeof Swiper !== 'undefined' && document.querySelector('.projects-swiper')) {
    new Swiper('.projects-swiper', {
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.projects-swiper .swiper-pagination', clickable: true },
      navigation: { nextEl: '.projects-swiper .swiper-button-next', prevEl: '.projects-swiper .swiper-button-prev' },
      breakpoints: { 0:{slidesPerView:1}, 576:{slidesPerView:2}, 992:{slidesPerView:3} }
    });
  }

  // Swiper for gallery featured
  if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
    new Swiper('.gallery-swiper', {
      spaceBetween: 16,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      pagination: { el: '.gallery-swiper .swiper-pagination', clickable: true },
      navigation: { nextEl: '.gallery-swiper .swiper-button-next', prevEl: '.gallery-swiper .swiper-button-prev' },
      breakpoints: { 0:{slidesPerView:1}, 576:{slidesPerView:2}, 992:{slidesPerView:3} }
    });
  }

  // Lightbox options (if present)
  if (window.lightbox) {
    lightbox.option({
      fadeDuration: 200,
      imageFadeDuration: 200,
      resizeDuration: 200,
      albumLabel: "صورة %1 من %2"
    });
  }

  // Render home services from PRESET_SERVICES with professional design
  function renderHomeServicesFromPreset(){
    const grid = document.getElementById('homeServicesGrid');
    if (!grid) return false;
    const items = PRESET_SERVICES || [];
    if (!items.length) return false;
    // Show first 6 services on home page
    const displayItems = items.slice(0, 6);
    grid.innerHTML = displayItems.map((s, idx)=>`
      <div class="col-12 col-sm-6 col-lg-4" data-aos="fade-up" ${idx%3?`data-aos-delay="${(idx%3)*50}"`:''}>
        <div class="service-card-pro h-100" data-category="${(s.category||'general').toLowerCase()}">
          <div class="service-card-pro-image">
            ${(()=>{ const src = getServiceImageFor(s.title, idx); return src?`<img src="${src}" class="w-100" alt="${s.title}" loading="lazy">`:`<div class="service-card-pro-placeholder w-100"></div>`; })()}
            <div class="service-card-pro-overlay">
              <i class="fa-solid fa-lightbulb"></i>
            </div>
          </div>
          <div class="service-card-pro-content">
            <h5 class="service-card-pro-title">${s.title}</h5>
            <p class="service-card-pro-desc">${s.desc}</p>
            <a href="services.html" class="btn btn-sm btn-gold w-100 mt-auto">اكتشف المزيد</a>
          </div>
        </div>
      </div>
    `).join('');
    if (window.AOS) AOS.refresh();
    return true;
  }

  // Render dynamic content and setup filters (safe on all pages)
  const params = (()=>{ try { return new URLSearchParams(location.search); } catch(e){ return null; } })();
  const forcePreset = params ? params.has('preset') : false;
  const forceLS = params ? params.has('ls') : false;
  const forceManifest = params ? params.has('manifest') : false;

  // Prefer curated preset services on Services page by default
  if (current === 'services.html') {
    if (forceLS) {
      renderServicesFromLS() || renderServicesFromPreset() || renderServicesFromManifest();
    } else if (forceManifest) {
      renderServicesFromManifest() || renderServicesFromPreset() || renderServicesFromLS();
    } else if (forcePreset) {
      renderServicesFromPreset() || renderServicesFromLS() || renderServicesFromManifest();
    } else {
      // Default: show curated preset services on Services page
      renderServicesFromPreset() || renderServicesFromLS() || renderServicesFromManifest();
    }
  } else {
    // Other pages keep previous order: LS -> PRESET -> Manifest (unless ?preset)
    if (forcePreset) {
      renderServicesFromPreset();
    } else {
      if (!renderServicesFromLS()) { if (!renderServicesFromPreset()) { renderServicesFromManifest(); } }
    }
  }
  if (!renderGalleryFromLS()) { renderGalleryFromManifest(); }
  renderVideosFromManifest();
  setupServicesFilter();
  
  // Render home services on index page
  if (current === 'index.html') {
    renderHomeServicesFromPreset();
  }

  // Apply contact info (footer + floating)
  applyContactInfo();
  setHeroFromManifest();
  initHeroVideo();

  // Setup language switcher and apply saved language
  setupLanguageSwitcher();
  applyLang(localStorage.getItem('zt_lang') || 'ar');

  // Contact form with Parsley
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    if (window.jQuery && jQuery().parsley) {
      const $form = jQuery(contactForm).parsley();
      contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        if ($form.isValid()) {
          // Simulate submit success
          const btn = contactForm.querySelector('button[type="submit"]');
          if (btn) { btn.disabled = true; btn.textContent = 'تم الإرسال ✓'; }
          setTimeout(() => { contactForm.reset(); if (btn) { btn.disabled = false; btn.textContent = 'إرسال'; } }, 1800);
        }
      });
    }
  }

  // Google Maps init (if API key provided on contact page)
  window.initMap = function() {
    const el = document.getElementById('map');
    if (!el || typeof google === 'undefined') return;
    const center = { lat: 26.445771, lng: 50.1129382 }; // User location
    const map = new google.maps.Map(el, { center, zoom: 17, disableDefaultUI: false });
    new google.maps.Marker({ position: center, map, title: 'Zena Touch' });
    const iframe = document.getElementById('map-iframe');
    if (iframe) iframe.style.display = 'none'; // hide fallback when API works
    el.style.display = 'block';
  };

})();
