// Admin Panel logic (UI only, no backend)
(function(){
  'use strict';

  const LS = {
    get(key, fallback){
      try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch(e){ return fallback; }
    },
    set(key, value){ try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){} }
  };

  // Simple auth (demo only)
  const LOGIN_KEY = 'zt_admin_logged_in';
  const DEFAULT_USER = { user: 'admin', pass: 'admin123' };

  function isLoginPage(){ return document.getElementById('loginForm') != null; }
  function isDashboard(){ return document.getElementById('adminDashboard') != null; }

  // Login page behavior
  if (isLoginPage()){
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const user = form.querySelector('[name="username"]').value.trim();
      const pass = form.querySelector('[name="password"]').value.trim();
      if ((user === DEFAULT_USER.user && pass === DEFAULT_USER.pass) || (user && pass)) {
        LS.set(LOGIN_KEY, true);
        location.href = 'admin-dashboard.html';
      } else {
        alert('بيانات الدخول غير صحيحة');
      }
    });
  }

  // Dashboard behavior
  if (isDashboard()){
    // Redirect if not logged in
    if (!LS.get(LOGIN_KEY, false)) {
      location.href = 'admin-login.html';
      return;
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem(LOGIN_KEY); location.href='admin-login.html'; });

    // Seed defaults
    const defaultGallery = [
      { title: 'عمل إضاءة 1', image: 'images/projects/p1.jpg' },
      { title: 'ورق جدران 1', image: 'images/projects/p2.jpg' }
    ];
    const defaultServices = [
      { title: 'إضاءة داخلية', category: 'lighting', image: 'images/services/s1.jpg', desc: 'حلول إضاءة حديثة.' },
      { title: 'ستائر فاخرة', category: 'curtains', image: 'images/services/s2.jpg', desc: 'تفصيل ستائر مميزة.' }
    ];

    let gallery = LS.get('zt_gallery', defaultGallery);
    let services = LS.get('zt_services', defaultServices);
    let stats = LS.get('zt_stats', { orders: 128, clients: 86 });
    let contact = LS.get('zt_contact_info', { phone: '+966 55 123 4567', city: 'الرياض', address: 'الرياض، المملكة العربية السعودية', whatsapp: '966551234567' });

    // Stats cards
    function renderStats(){
      const elOrders = document.getElementById('statOrders');
      const elClients = document.getElementById('statClients');
      const elServices = document.getElementById('statServices');
      const elGallery = document.getElementById('statGallery');
      if (elOrders) elOrders.textContent = stats.orders;
      if (elClients) elClients.textContent = stats.clients;
      if (elServices) elServices.textContent = services.length;
      if (elGallery) elGallery.textContent = gallery.length;
    }

    // Charts.js
    if (window.Chart) {
      const ctx = document.getElementById('ordersChart');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
            datasets: [{
              label: 'الطلبات',
              data: [12, 19, 15, 22, 30, 28, 35, 40, 32, 26, 20, 25],
              fill: false,
              borderColor: '#d4af37',
              tension: .3
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    }

    // Gallery CRUD
    const galleryList = document.getElementById('galleryList');
    const galleryForm = document.getElementById('galleryForm');
    function renderGallery(){
      if (!galleryList) return;
      galleryList.innerHTML = gallery.map((g, i)=>`
        <tr>
          <td>${i+1}</td>
          <td><img src="${g.image}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"></td>
          <td>${g.title}</td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-1" data-edit="${i}"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-del="${i}"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    }
    function saveGallery(){ LS.set('zt_gallery', gallery); renderGallery(); renderStats(); }
    renderGallery();
    if (galleryForm) galleryForm.addEventListener('submit', e=>{
      e.preventDefault();
      const title = galleryForm.querySelector('[name="gtitle"]').value.trim();
      const image = galleryForm.querySelector('[name="gimage"]').value.trim();
      if (!title || !image) return;
      gallery.push({ title, image });
      galleryForm.reset();
      saveGallery();
    });
    if (galleryList) galleryList.addEventListener('click', (e)=>{
      const del = e.target.closest('[data-del]');
      const edit = e.target.closest('[data-edit]');
      if (del){ const i = +del.getAttribute('data-del'); gallery.splice(i,1); saveGallery(); }
      if (edit){ const i = +edit.getAttribute('data-edit');
        const g = gallery[i];
        const nt = prompt('تعديل العنوان', g.title) ?? g.title;
        const ni = prompt('تعديل رابط الصورة (images/..)', g.image) ?? g.image;
        gallery[i] = { title: nt.trim()||g.title, image: ni.trim()||g.image };
        saveGallery();
      }
    });

    // Services CRUD
    const servicesList = document.getElementById('servicesList');
    const servicesForm = document.getElementById('servicesForm');
    function renderServices(){
      if (!servicesList) return;
      servicesList.innerHTML = services.map((s, i)=>`
        <tr>
          <td>${i+1}</td>
          <td><span class="badge rounded-pill badge-category">${s.category}</span></td>
          <td>${s.title}</td>
          <td class="text-truncate" style="max-width:280px">${s.desc||''}</td>
          <td><img src="${s.image}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-1" data-sedit="${i}"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-sdel="${i}"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    }
    function saveServices(){ LS.set('zt_services', services); renderServices(); renderStats(); }
    renderServices();
    if (servicesForm) servicesForm.addEventListener('submit', e=>{
      e.preventDefault();
      const title = servicesForm.querySelector('[name="stitle"]').value.trim();
      const category = servicesForm.querySelector('[name="scategory"]').value.trim();
      const image = servicesForm.querySelector('[name="simage"]').value.trim();
      const desc = servicesForm.querySelector('[name="sdesc"]').value.trim();
      if (!title || !category) return;
      services.push({ title, category, image, desc });
      servicesForm.reset();
      saveServices();
    });
    if (servicesList) servicesList.addEventListener('click', (e)=>{
      const del = e.target.closest('[data-sdel]');
      const edit = e.target.closest('[data-sedit]');
      if (del){ const i = +del.getAttribute('data-sdel'); services.splice(i,1); saveServices(); }
      if (edit){ const i = +edit.getAttribute('data-sedit');
        const s = services[i];
        const nt = prompt('تعديل العنوان', s.title) ?? s.title;
        const nc = prompt('تعديل النوع (lighting/curtains/wallpaper/installation)', s.category) ?? s.category;
        const ni = prompt('تعديل رابط الصورة (images/..)', s.image) ?? s.image;
        const nd = prompt('تعديل الوصف', s.desc||'') ?? s.desc;
        services[i] = { title: nt.trim()||s.title, category: (nc.trim()||s.category), image: (ni.trim()||s.image), desc: (nd||'') };
        saveServices();
      }
    });

    // Preset services images override (mapping title -> image URL)
    const serviceImageForm = document.getElementById('serviceImageForm');
    const serviceImageList = document.getElementById('serviceImageList');
    const PRESET_TITLES = [
      'تصميم وتركيب إضاءة المناسبات السعيدة',
      'إضاءة الأعياد والمواسم (رمضان، العيد الوطني، رأس السنة)',
      'إبراز الجمال المعماري للواجهات',
      'تصميم إضاءة الحدائق والمناظر الطبيعية',
      'أنظمة الإضاءة الذكية والتحكم عن بعد',
      'إضاءة المسابح والنوافير',
      'خدمة الصيانة والفك والتخزين',
      'استشارات تصميم الإضاءة الاحترافية',
      'تأجير معدات الإضاءة للمناسبات',
      'تنفيذ تصاميم وشعارات ضوئية خاصة'
    ];
    let serviceImages = LS.get('zt_service_images', {}) || {};

    function renderServiceImageSelect(){
      if (!serviceImageForm) return;
      const sel = serviceImageForm.querySelector('select[name="title"]');
      if (!sel) return;
      sel.innerHTML = PRESET_TITLES.map(t=>`<option value="${t}">${t}</option>`).join('');
    }
    function renderServiceImages(){
      if (!serviceImageList) return;
      const entries = Object.entries(serviceImages);
      serviceImageList.innerHTML = entries.map(([title, image], i)=>`
        <tr>
          <td>${i+1}</td>
          <td>${title}</td>
          <td><img src="${image}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"></td>
          <td class="text-end">
            <button class="btn btn-sm btn-outline-secondary me-1" data-imgedit="${encodeURIComponent(title)}"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn btn-sm btn-outline-danger" data-imgdel="${encodeURIComponent(title)}"><i class="fa-regular fa-trash-can"></i></button>
          </td>
        </tr>
      `).join('');
    }
    function saveServiceImages(){ LS.set('zt_service_images', serviceImages); renderServiceImages(); }
    renderServiceImageSelect();
    renderServiceImages();
    if (serviceImageForm) serviceImageForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = serviceImageForm.querySelector('[name="title"]').value.trim();
      const image = serviceImageForm.querySelector('[name="image"]').value.trim();
      if (!title || !image) return;
      serviceImages[title] = image;
      serviceImageForm.reset();
      renderServiceImageSelect();
      saveServiceImages();
    });
    if (serviceImageList) serviceImageList.addEventListener('click', (e)=>{
      const del = e.target.closest('[data-imgdel]');
      const edit = e.target.closest('[data-imgedit]');
      if (del){
        const key = decodeURIComponent(del.getAttribute('data-imgdel'));
        delete serviceImages[key];
        saveServiceImages();
      }
      if (edit){
        const key = decodeURIComponent(edit.getAttribute('data-imgedit'));
        const current = serviceImages[key] || '';
        const ni = prompt('تعديل رابط الصورة (images/..)', current) ?? current;
        serviceImages[key] = (ni||current).trim();
        saveServiceImages();
      }
    });

    // Contact info
    const contactForm = document.getElementById('contactInfoForm');
    if (contactForm) {
      function renderContact(){
        contactForm.querySelector('[name="phone"]').value = contact.phone||'';
        contactForm.querySelector('[name="city"]').value = contact.city||'';
        contactForm.querySelector('[name="address"]').value = contact.address||'';
        contactForm.querySelector('[name="whatsapp"]').value = contact.whatsapp||'';
      }
      renderContact();
      contactForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        contact = {
          phone: contactForm.querySelector('[name="phone"]').value.trim(),
          city: contactForm.querySelector('[name="city"]').value.trim(),
          address: contactForm.querySelector('[name="address"]').value.trim(),
          whatsapp: contactForm.querySelector('[name="whatsapp"]').value.trim(),
        };
        LS.set('zt_contact_info', contact);
        alert('تم حفظ بيانات التواصل');
      });
    }

    // Final render
    renderStats();
  }

})();
