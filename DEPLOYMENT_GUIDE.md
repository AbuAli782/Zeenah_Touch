# 🚀 دليل نشر موقع Zena Touch

## نشر على GitHub Pages

### الخطوة 1: إنشاء مستودع GitHub
1. اذهب إلى [GitHub](https://github.com)
2. انقر على "New Repository"
3. سمّ المستودع `Zeenah_Touch`
4. اختر "Public"
5. انقر "Create repository"

### الخطوة 2: رفع الملفات
```bash
# استنساخ المستودع
git clone https://github.com/YOUR_USERNAME/Zeenah_Touch.git
cd Zeenah_Touch

# نسخ جميع ملفات المشروع إلى المجلد

# إضافة الملفات
git add .

# حفظ التغييرات
git commit -m "Initial commit - Zena Touch website v1.1.0"

# رفع إلى GitHub
git push origin main
```

### الخطوة 3: تفعيل GitHub Pages
1. اذهب إلى إعدادات المستودع (Settings)
2. اختر "Pages" من القائمة الجانبية
3. تحت "Source"، اختر "main" branch
4. انقر "Save"

### الخطوة 4: ربط النطاق المخصص (اختياري)
1. في إعدادات GitHub Pages
2. أضف النطاق في حقل "Custom domain"
3. أدخل: `zenatouchsa.com`
4. تحديث إعدادات DNS عند مزود النطاق

---

## نشر على Netlify

### الخطوة 1: الاتصال بـ GitHub
1. اذهب إلى [Netlify](https://netlify.com)
2. انقر "Sign up" واختر GitHub
3. وافق على الأذونات

### الخطوة 2: إنشاء موقع جديد
1. انقر "New site from Git"
2. اختر GitHub
3. اختر المستودع `Zeenah_Touch`
4. انقر "Deploy site"

### الخطوة 3: تكوين النطاق
1. اذهب إلى "Domain settings"
2. أضف النطاق المخصص `zenatouchsa.com`
3. حدّث إعدادات DNS

---

## نشر على Vercel

### الخطوة 1: الاتصال بـ GitHub
1. اذهب إلى [Vercel](https://vercel.com)
2. انقر "Sign Up" واختر GitHub
3. وافق على الأذونات

### الخطوة 2: استيراد المشروع
1. انقر "Import Project"
2. اختر GitHub
3. اختر المستودع `Zeenah_Touch`
4. انقر "Import"

### الخطوة 3: النشر
1. Vercel سينشر الموقع تلقائياً
2. أضف النطاق المخصص من "Settings"

---

## نشر على خادم Apache

### المتطلبات
- خادم Apache مع mod_rewrite مفعّل
- دعم HTTPS
- PHP (اختياري)

### الخطوات
1. رفع جميع الملفات إلى مجلد الجذر (public_html)
2. التأكد من وجود ملف `.htaccess`
3. تعيين النطاق في cPanel
4. تفعيل SSL Certificate

### ملف .htaccess موجود بالفعل ويتضمن:
- ضغط GZIP
- تخزين مؤقت للمتصفح
- إعادة توجيه HTTPS
- رؤوس الأمان

---

## نشر على خادم Nginx

### ملف nginx.conf
```nginx
server {
    listen 443 ssl http2;
    server_name zenatouchsa.com www.zenatouchsa.com;
    
    root /var/www/zenatouchsa;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    
    # Cache headers
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Rewrite rules
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
    
    # Security headers
    add_header X-Content-Type-Options "nosniff";
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name zenatouchsa.com www.zenatouchsa.com;
    return 301 https://$server_name$request_uri;
}
```

---

## تحسينات الأداء

### 1. تفعيل GZIP
✅ مفعّل في `.htaccess` و `nginx.conf`

### 2. تخزين مؤقت للمتصفح
✅ مفعّل - الصور تُخزّن لمدة سنة واحدة
✅ CSS/JS تُخزّن لمدة شهر واحد

### 3. CDN
- Bootstrap من CDN
- Font Awesome من CDN
- Google Fonts من CDN
- AOS من CDN
- Swiper من CDN

### 4. Lazy Loading
✅ جميع الصور تستخدم `loading="lazy"`

### 5. Service Worker
✅ مفعّل في `sw.js` للدعم الأوفلاين

---

## اختبار الأداء

### Google PageSpeed Insights
1. اذهب إلى [PageSpeed Insights](https://pagespeed.web.dev)
2. أدخل URL الموقع
3. اختبر على Desktop و Mobile

### GTmetrix
1. اذهب إلى [GTmetrix](https://gtmetrix.com)
2. أدخل URL الموقع
3. حلّل النتائج

### WebPageTest
1. اذهب إلى [WebPageTest](https://webpagetest.org)
2. أدخل URL الموقع
3. اختبر من مواقع مختلفة

---

## SEO Checklist

- ✅ Meta descriptions محسّنة
- ✅ Keywords ذات صلة
- ✅ Canonical URLs
- ✅ Open Graph Tags
- ✅ Schema.org Markup
- ✅ Sitemap.xml
- ✅ robots.txt
- ✅ Mobile-friendly
- ✅ Fast loading times
- ✅ HTTPS enabled
- ✅ Structured data

---

## الصيانة المستمرة

### تحديث المحتوى
1. تحديث الصور بانتظام
2. إضافة أعمال جديدة
3. تحديث معلومات الاتصال

### المراقبة
1. مراقبة Google Analytics
2. فحص Google Search Console
3. اختبار الأداء شهرياً

### النسخ الاحتياطية
1. عمل نسخة احتياطية أسبوعية
2. تخزين في مكان آمن
3. اختبار استعادة النسخة

---

## المساعدة والدعم

للمزيد من المعلومات:
- 📧 البريد: info@zenatouchsa.com
- 📞 الهاتف: +966 55 123 4567
- 💬 WhatsApp: +966 55 123 4567

---

**آخر تحديث**: 18 نوفمبر 2025
**الإصدار**: 1.1.0
