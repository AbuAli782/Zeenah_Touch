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
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');
  
  function updateThemeIcons(theme) {
    if (lightIcon && darkIcon) {
      if (theme === 'dark') {
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline';
      } else {
        lightIcon.style.display = 'inline';
        darkIcon.style.display = 'none';
      }
    }
  }
  
  updateThemeIcons(savedTheme);
  
  if (toggle) {
    toggle.checked = savedTheme === 'dark';
    toggle.addEventListener('change', () => {
      const t = toggle.checked ? 'dark' : 'light';
      root.setAttribute('data-theme', t);
      updateThemeIcons(t);
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
    { title: 'تصميم وتركيب إضاءة المناسبات السعيدة', desc: 'حول مناسباتك الخاصة إلى لحظات تنبض بالضوء والفرح. فريقنا المتخصص يقدم لك تصاميم إضاءة مميزة تضفي لمسة ساحرة على كل احتفال، سواء كان زفافاً أنيقاً أو تجمعاً عائلياً مليئاً بالبهجة. دع أضواءنا تضيء طريق سعادتك وتخلّد أجمل الذكريات.', category: 'lighting' },
    { title: 'إضاءة الأعياد والمواسم (رمضان، العيد الوطني، رأس السنة)', desc: 'عيش فرحة الأعياد وأضف لمسة من السعادة إلى بيتك. عندنا أشكال إضاءة جديدة تناسب كل موسم، تعكس جو الاحتفال وتخلي بيتك مميز ولافت للأنظار. خلّي ضيوفك يحسّوا بالراحة والجمال في كل زاوية.', category: 'lighting' },
    { title: 'إبراز الجمال المعماري للواجهات', desc: 'كل مبنى يحمل قصة خاصة به، ونحن هنا لننسجها بأشعة الضوء. باستخدام أحدث تقنيات الإضاءة، نُظهر أجمل تفاصيل واجهة منزلك أو مكان عملك، لنمنحه رونقاً وجاذبية تسرق الأنظار في كل وقت، سواء في النهار أو الليل.', category: 'lighting' },
    { title: 'تصميم إضاءة الحدائق والمناظر الطبيعية', desc: 'حوّل حديقتك إلى لوحة فنية تنبض بالحياة مع غروب الشمس. نعتني بتصميم إضاءات متكاملة تبرز جمال الأشجار والنباتات، وتضيء الممرات بأناقة وأمان. استرخِ واستمتع بأمسيات هادئة في ملاذك الخارجي الخاص.', category: 'lighting' },
    { title: 'إضاءة المسابح والنوافير', desc: 'امنح مساحات المياه في منزلك لمسة ساحرة جديدة. نقدم لك إضاءات آمنة ومضادة للماء، تجعل من المسبح أو النافورة لديك مكانًا يلفت الأنظار بجماله، ويضفي جوًا هادئًا ومريحًا يملؤه الفخامة.', category: 'lighting' },
    { title: 'خدمة الصيانة والفك والتخزين', desc: 'استمتع بجمال الزينة دون أي تعب. لما تخلص مناسبتك، فريقنا بيتكفل بفك الإضاءة بعناية، وبيرتبها ويخزنها بطريقة محترفة، عشان تظل جديدة وجاهزة تفرحك مرة ثانية في الموسم اللي جاي.', category: 'installation' },
    { title: 'استشارات تصميم الإضاءة الاحترافية', desc: 'هل لديك فكرة تتمنى تحقيقها؟ نحن هنا لنساعدك بخبرتنا. نوفر لك جلسات استشارية تختار من خلالها أفضل التصاميم وأحدث التقنيات التي تناسب مكانك وميزانيتك، كي تحصل على نتائج تتجاوز كل توقعاتك.', category: 'lighting' },
    { title: 'تأجير معدات الإضاءة للمناسبات', desc: 'إذا كنت تبحث عن إضاءة رائعة بتكلفة معقولة، فخدمة التأجير هي الحل المناسب لك، خاصة إذا كانت المناسبة لمرة واحدة فقط. نحن نوفر لك أحدث الأجهزة، ونتكفل بتركيبها وفكها، حتى تكون تجربتك سهلة ومريحة تماماً.', category: 'lighting' },
    { title: 'تنفيذ تصاميم وشعارات ضوئية خاصة', desc: 'اجعل فكرتك تنبض بالحياة والضوء. سواء كنت ترغب في شعار شركتك، أو اسم العروسين، أو أي تصميم تحبه، نحن هنا لنحولها إلى حقيقة تتلألأ بالأضواء. نضيف لمسة خاصة تميز مناسبتك أو مشروعك بطريقة فريدة وجذابة.', category: 'lighting' },
    { title: 'خدمات السباكة', desc: 'نوفر حلولاً سباكية شاملة تشمل التركيب والصيانة والإصلاح بأعلى معايير الجودة والاحترافية.', category: 'plumbing', icon: 'fa-wrench', isProfessional: true },
    { title: 'خدمات الكهرباء الآمنة', desc: 'خدمات كهربائية متخصصة تضمن السلامة والكفاءة العالية مع الالتزام بجميع المعايير الدولية.', category: 'electrical', icon: 'fa-bolt', isProfessional: true },
    { title: 'تصميم وتركيب الإضاءة', desc: 'تصاميم إضاءة مبتكرة تحول مساحاتك إلى بيئات جميلة وعملية مع أحدث التقنيات.', category: 'lighting', icon: 'fa-lightbulb', isProfessional: true },
  ];

  // Build a fixed mapping between service title and an image from manifest (first N images)
  function buildFixedServiceImageMap(){
    const imgs = getManifestImages();
    const map = {};
    PRESET_SERVICES.forEach((s, i)=>{ if (imgs[i]) map[s.title] = imgs[i]; });
    return map;
  }
  function getServiceImageFor(title, idx){
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
    console.log('Images from manifest:', imgs.length, imgs);
    if (!imgs.length) return;
    const el = document.querySelector(selector);
    console.log('Swiper element found:', !!el);
    if (!el) return;
    const wrapper = el.querySelector('.swiper-wrapper');
    console.log('Swiper wrapper found:', !!wrapper);
    if (!wrapper) return;
    wrapper.innerHTML = imgs.map(src => `<div class="swiper-slide"><img src="${src}" alt="media"></div>`).join('');
    console.log('Swiper populated with', imgs.length, 'images');
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

  // Language handling (simplified - already RTL in HTML)
  function swapBootstrapForLang(lang){
    // Bootstrap RTL already loaded in HTML, no need to swap
  }

  function applyTranslations(){
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

    // Navbar
    const setText = (sel, ar) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = ar;
    };
    setText('a.nav-link[href$="index.html"]', 'الرئيسية');
    setText('a.nav-link[href$="services.html"]', 'الخدمات');
    setText('a.nav-link[href$="gallery.html"]', 'المعرض');
    setText('a.nav-link[href$="about.html"]', 'من نحن');
    setText('a.nav-link[href$="contact.html"]', 'تواصل');

    // Footer headings and rights
    const footerLinks = document.querySelector('footer .col-md-4:nth-child(2) h6');
    if (footerLinks) footerLinks.textContent = 'روابط';
    const footerContact = document.querySelector('footer .col-md-4:nth-child(3) h6');
    if (footerContact) footerContact.textContent = 'تواصل';
    const rights = document.querySelector('footer .border-top p');
    if (rights) {
      const y = new Date().getFullYear();
      rights.textContent = `© ${y} Zena Touch. جميع الحقوق محفوظة.`;
    }
    const waFooter = document.getElementById('footerWhatsapp');
    if (waFooter) waFooter.textContent = 'واتساب مباشر';

    // Common CTA section
    const ctaTitle = document.querySelector('.bg-gold h3');
    if (ctaTitle) ctaTitle.textContent = 'هل لديك مشروع أو فكرة؟ يسعدنا خدمتك';
    const ctaQuoteBtn = document.querySelector('.bg-gold .btn.btn-dark');
    if (ctaQuoteBtn) ctaQuoteBtn.textContent = 'طلب عرض سعر';
    const ctaWaBtn = document.querySelector('.bg-gold .btn.btn-outline-dark');
    if (ctaWaBtn) ctaWaBtn.innerHTML = '<i class="fa-brands fa-whatsapp ms-1"></i> واتساب';

    // Page-specific
    if (current === 'index.html'){
      setText('.hero-section p.lead', 'خبراء زينة المنازل والإضاءة – جودة، ذوق، وتركيب احترافي.');
      setText('#services .section-title', 'خدماتنا');
      setText('#services .text-muted', 'نقدم حلولاً متكاملة لزينة المنازل والإضاءة بجودة عالية.');
      // first is services, next could be Why us / About; safer by section content
      const whyH2 = document.querySelectorAll('.section-title')[1];
      if (whyH2) whyH2.textContent = 'لماذا تختارنا؟';
      const aboutH2 = document.querySelectorAll('.section-title')[2];
      if (aboutH2) aboutH2.textContent = 'من نحن';
      setText('.section-padding.bg-body .text-muted', 'لمساتنا الراقية في منازل عملائنا.');
      // Services cards
      const cards = document.querySelectorAll('.feature-card .card-title');
      if (cards[0]) cards[0].textContent = 'إضاءة داخلية وخارجية';
      if (cards[1]) cards[1].textContent = 'ستائر ومفروشات';
      if (cards[2]) cards[2].textContent = 'ورق جدران';
      if (cards[3]) cards[3].textContent = 'تركيب وصيانة';
    }
    if (current === 'services.html'){
      setText('.hero-section h1', 'خدماتنا');
      setText('.hero-section .lead', 'حلول متكاملة لزينة المنازل والإضاءة باحترافية عالية');
      setText('[data-filter="all"]', 'الكل');
      setText('[data-filter="lighting"]', 'إضاءة');
      setText('[data-filter="curtains"]', 'ستائر');
      setText('[data-filter="wallpaper"]', 'ورق جدران');
      setText('[data-filter="installation"]', 'تركيب وصيانة');
      document.querySelectorAll('#servicesGrid .btn.btn-gold').forEach(btn=> btn.textContent = 'تواصل');
    }
    if (current === 'gallery.html'){
      setText('.hero-section h1', 'معرض الأعمال');
      setText('.section-padding.bg-body .section-title', 'أعمال مميزة');
    }
    if (current === 'about.html'){
      setText('.hero-section h1', 'من نحن');
      setText('.hero-section .lead', 'رؤية واضحة لتجميل بيتك بلمسات ذهبية');
      const story = document.querySelector('.section-title');
      if (story) story.textContent = 'قصتنا';
      const boxes = document.querySelectorAll('.about-stats h5');
      if (boxes[0]) boxes[0].textContent = 'رؤيتنا';
      if (boxes[1]) boxes[1].textContent = 'رسالتنا';
      if (boxes[2]) boxes[2].textContent = 'قيمنا';
    }
    if (current === 'contact.html'){
      setText('.hero-section h1', 'تواصل معنا');
      setText('.hero-section .lead', 'يسعدنا تواصلك وسنعود إليك سريعًا');
      setText('.service-card h5', 'نموذج التواصل');
      // Labels
      const labels = document.querySelectorAll('#contactForm .form-label');
      if (labels[0]) labels[0].textContent = 'الاسم الكامل';
      if (labels[1]) labels[1].textContent = 'رقم الجوال';
      if (labels[2]) labels[2].textContent = 'المدينة';
      if (labels[3]) labels[3].textContent = 'الرسالة';
      const submit = document.querySelector('#contactForm button[type="submit"]');
      if (submit) submit.textContent = 'إرسال';
      const locHeading = document.querySelector('.map-wrapper')?.previousElementSibling;
      if (locHeading && locHeading.tagName === 'H5') {
        locHeading.textContent = 'موقعنا';
      }
    }
  }

  function applyLang(){
    const html = document.documentElement;
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');
    swapBootstrapForLang('ar');
    applyTranslations();
    if (window.AOS) AOS.refresh();
  }

  function setupLanguageSwitcher(){
    const host = document.querySelector('.navbar .d-flex.align-items-center.gap-3');
    if (!host || host.querySelector('.language-switch')) return;
    const wrap = document.createElement('div');
    wrap.className = 'language-switch btn-group';
    wrap.innerHTML = '';
    host.appendChild(wrap);
    applyLang();
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
  
  // Separate professional cards (at the end) from regular cards
  const regularServices = items.filter(s => !s.isProfessional);
  const professionalServices = items.filter(s => s.isProfessional);
  
  let html = '';
  
  // Regular services as regular cards
  html += regularServices.map((s, idx)=>`
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
  
  // Professional services as professional cards (at the end)
  html += professionalServices.map((s, idx)=>`
    <div class="col-12 col-md-6 col-lg-4" data-aos="fade-up" ${idx?`data-aos-delay="${idx*50}"`:''}>
      <div class="service-card-professional">
        <div class="service-card-professional-icon">
          <i class="fa-solid ${s.icon || 'fa-lightbulb'}"></i>
        </div>
        <div class="service-card-professional-content">
          <h3 class="service-card-professional-title">${s.title}</h3>
          <p class="service-card-professional-desc">${s.desc}</p>
          <a href="contact.html" class="service-card-professional-btn">اطلب الخدمة</a>
        </div>
      </div>
    </div>
  `).join('');
  
  grid.innerHTML = html;
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
          <h5 class="fw-bold">خدمة رقم ${idx+1}</h5>
          <p class="text-muted">وصف تجريبي من مكتبة الوسائط لديك.</p>
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

  // Initialize Swiper after DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing swipers');
    
    // Populate swipers from manifest (images only) before initializing Swiper
    populateSwiperFromManifest('.projects-swiper');
    populateSwiperFromManifest('.gallery-swiper');
    
    // Swiper for projects
    if (typeof Swiper !== 'undefined' && document.querySelector('.projects-swiper')) {
      console.log('Initializing projects swiper');
      new Swiper('.projects-swiper', {
        spaceBetween: 16,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: '.projects-swiper .swiper-pagination', clickable: true },
        navigation: { nextEl: '.projects-swiper .swiper-button-next', prevEl: '.projects-swiper .swiper-button-prev' },
        breakpoints: { 0:{slidesPerView:1}, 576:{slidesPerView:2}, 992:{slidesPerView:3} }
      });
    } else {
      console.log('Swiper not available or projects element not found');
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
  });

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
    
    // Show first 6 regular services + professional services on home page
    const regularItems = items.filter(s => !s.isProfessional).slice(0, 6);
    const professionalItems = items.filter(s => s.isProfessional);
    
    let html = '';
    
    // Regular services with professional design
    html += regularItems.map((s, idx)=>`
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
    
    // Professional services cards
    html += professionalItems.map((s, idx)=>`
      <div class="col-12 col-md-6 col-lg-4" data-aos="fade-up" ${(idx+regularItems.length)%3?`data-aos-delay="${((idx+regularItems.length)%3)*50}"`:''}>
        <div class="service-card-professional">
          <div class="service-card-professional-icon">
            <i class="fa-solid ${s.icon || 'fa-lightbulb'}"></i>
          </div>
          <div class="service-card-professional-content">
            <h3 class="service-card-professional-title">${s.title}</h3>
            <p class="service-card-professional-desc">${s.desc}</p>
            <a href="services.html" class="service-card-professional-btn">اكتشف المزيد</a>
          </div>
        </div>
      </div>
    `).join('');
    
    grid.innerHTML = html;
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
