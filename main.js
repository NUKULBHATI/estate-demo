/* ============================================================
   SIKKA HORIZONS — shared behaviour across all pages
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) {
        loader.style.transition = 'opacity 0.7s ease, visibility 0.7s ease';
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }
      document.body.classList.add('is-loaded');
      runEntranceAnimations();
    }, 500);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => { if (loader) { loader.style.opacity = '0'; loader.style.visibility = 'hidden'; } runEntranceAnimations(); }, 400);
  }

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 900, easing: 'ease-out-cubic', once: true, offset: 80 });
  }

  /* ---------- Navbar scroll state + mobile toggle ---------- */
  const navbar = document.querySelector('.navbar');
  const onScrollNav = () => {
    if (!navbar) return;
    if (window.scrollY > 60) navbar.classList.add('is-scrolled');
    else navbar.classList.remove('is-scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    }));
  }

  /* ---------- Scroll progress bar ---------- */
  const progress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    if (!progress) return;
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
  }, { passive: true });

  /* ---------- Back to top ---------- */
  const topBtn = document.querySelector('.float-top');
  window.addEventListener('scroll', () => {
    if (!topBtn) return;
    if (window.scrollY > 500) topBtn.classList.add('is-visible');
    else topBtn.classList.remove('is-visible');
  }, { passive: true });
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* ---------- Tilt hover on cards ---------- */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---------- Mouse parallax (hero corners / floating shapes) ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      parallaxEls.forEach(el => {
        const depth = parseFloat(el.dataset.parallax) || 10;
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    });
  }

  /* ---------- Number counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const runCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const decimals = el.dataset.counter.includes('.') ? 1 : 0;
      let start = 0;
      const dur = 1800;
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = start + (target - start) * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------- Progress lines ---------- */
  const bars = document.querySelectorAll('.progress-fill');
  if (bars.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.value + '%';
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(b => io2.observe(b));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('is-open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* ---------- Enquiry popup ---------- */
  const popup = document.querySelector('.enquiry-popup');
  document.querySelectorAll('[data-open-enquiry]').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    if (popup) popup.classList.add('is-open');
  }));
  document.querySelectorAll('[data-close-enquiry]').forEach(btn => btn.addEventListener('click', () => popup.classList.remove('is-open')));
  if (popup) popup.addEventListener('click', (e) => { if (e.target === popup) popup.classList.remove('is-open'); });

  /* ---------- Hero slideshow ---------- */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  if (slides.length) {
    let idx = 0;
    const show = (i) => {
      slides.forEach(s => s.classList.remove('is-active'));
      dots.forEach(d => d.classList.remove('is-active'));
      slides[i].classList.add('is-active');
      if (dots[i]) dots[i].classList.add('is-active');
      idx = i;
    };
    show(0);
    setInterval(() => show((idx + 1) % slides.length), 5500);
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
  }

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.gallery-filters button');
  const galleryItems = document.querySelectorAll('.masonry-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (match) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
        } else {
          item.style.opacity = '0'; item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 400);
        }
      });
    }));
  }

  /* ---------- Property filter (Properties page) ---------- */
  const propFilterBtns = document.querySelectorAll('.gallery-filters[data-prop-filter] button');
  const propCards = document.querySelectorAll('[data-prop-type]');
  if (propFilterBtns.length) {
    propFilterBtns.forEach(btn => btn.addEventListener('click', () => {
      propFilterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      propCards.forEach(card => {
        const match = filter === 'all' || card.dataset.propType === filter;
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; });
        } else {
          card.style.opacity = '0'; card.style.transform = 'scale(0.92)';
          setTimeout(() => { card.style.display = 'none'; }, 400);
        }
      });
    }));
  }

  /* ---------- Search widget tabs ---------- */
  document.querySelectorAll('.search-tabs button').forEach(btn => btn.addEventListener('click', () => {
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  }));

  /* ---------- Lightbox for gallery ---------- */
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.masonry-item img').forEach(img => {
      img.addEventListener('click', () => {
        lbImg.src = img.src;
        lightbox.classList.add('is-open');
      });
    });
    lightbox.addEventListener('click', () => lightbox.classList.remove('is-open'));
  }

  /* ---------- Swiper: testimonials ---------- */
  if (window.Swiper && document.querySelector('.testi-swiper')) {
    new Swiper('.testi-swiper', {
      slidesPerView: 1,
      spaceBetween: 28,
      loop: true,
      autoplay: { delay: 4200, disableOnInteraction: false },
      pagination: { el: '.testi-swiper .swiper-pagination', clickable: true },
      breakpoints: { 760: { slidesPerView: 2 }, 1100: { slidesPerView: 3 } }
    });
  }

  /* ---------- Swiper: gallery / featured preview ---------- */
  if (window.Swiper && document.querySelector('.preview-swiper')) {
    new Swiper('.preview-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 3200, disableOnInteraction: false },
      breakpoints: { 700: { slidesPerView: 2.2 }, 1100: { slidesPerView: 3.2 } }
    });
  }

  /* ---------- EMI Calculator ---------- */
  const emiForm = document.querySelector('#emi-calc');
  if (emiForm) {
    const amountEl = emiForm.querySelector('#emi-amount');
    const rateEl = emiForm.querySelector('#emi-rate');
    const tenureEl = emiForm.querySelector('#emi-tenure');
    const resultEl = emiForm.querySelector('#emi-result');
    const calc = () => {
      const P = parseFloat(amountEl.value) || 0;
      const r = (parseFloat(rateEl.value) || 0) / 12 / 100;
      const n = (parseFloat(tenureEl.value) || 0) * 12;
      let emi = 0;
      if (P && r && n) emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      resultEl.textContent = '₹ ' + Math.round(emi).toLocaleString('en-IN');
    };
    [amountEl, rateEl, tenureEl].forEach(el => el && el.addEventListener('input', calc));
    calc();
  }

  /* ---------- Investment Calculator ---------- */
  const invForm = document.querySelector('#inv-calc');
  if (invForm) {
    const principalEl = invForm.querySelector('#inv-principal');
    const growthEl = invForm.querySelector('#inv-growth');
    const yearsEl = invForm.querySelector('#inv-years');
    const resultEl = invForm.querySelector('#inv-result');
    const calc = () => {
      const P = parseFloat(principalEl.value) || 0;
      const g = (parseFloat(growthEl.value) || 0) / 100;
      const y = parseFloat(yearsEl.value) || 0;
      const future = P * Math.pow(1 + g, y);
      resultEl.textContent = '₹ ' + Math.round(future).toLocaleString('en-IN');
    };
    [principalEl, growthEl, yearsEl].forEach(el => el && el.addEventListener('input', calc));
    calc();
  }

  /* ---------- Property comparison toggle ---------- */
  document.querySelectorAll('[data-compare-toggle]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = document.querySelectorAll('[data-compare-toggle]:checked');
      const bar = document.querySelector('.compare-bar');
      if (!bar) return;
      if (checked.length >= 2) bar.classList.add('is-visible');
      else bar.classList.remove('is-visible');
      bar.querySelector('.compare-count').textContent = checked.length;
    });
  });

  /* ---------- Contact form (demo submit) ---------- */
// //   const contactForm = document.querySelector('#contact-form');
// //   if (contactForm) {
// //     contactForm.addEventListener('submit', (e) => {
// //       e.preventDefault();
// //       const btn = contactForm.querySelector('button[type="submit"]');
// //       const original = btn.innerHTML;
// //       btn.innerHTML = 'Message Sent ✓';
// //       contactForm.reset();
// //       setTimeout(() => { btn.innerHTML = original; }, 2800);
// //     });
// //   }
// // });

//         function sendWhatsAppMessage() {
//             const firstName = document.getElementById('waFirstName').value.trim();
//             const lastName = document.getElementById('waLastName').value.trim();
//             const email = document.getElementById('waEmail').value.trim();
//             const phone = document.getElementById('waPhone').value.trim();
//             const subject = document.getElementById('waSubject').value;
//             const message = document.getElementById('waMessage').value.trim();

//             if (!firstName || !lastName) {
//                 alert('Please enter your first and last name.');
//                 return;
//             }
//             if (!phone) {
//                 alert('Please enter your phone number.');
//                 return;
//             }

//             const fullName = firstName + ' ' + lastName;
//             let whatsappText = `*New Message from PowerHouse Fitness Website*%0A%0A`;
//             whatsappText += `*Name:* ${fullName}%0A`;
//             if (email) whatsappText += `*Email:* ${email}%0A`;
//             if (phone) whatsappText += `*Phone:* ${phone}%0A`;
//             whatsappText += `*Subject:* ${subject}%0A`;
//             if (message) whatsappText += `%0A*Message:*%0A${message}%0A`;
//             whatsappText += `%0A-------------------%0A`;
//             whatsappText += `Sent from: PowerHouse Fitness Website`;

//             const whatsappNumber = '919958216959';
//             const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

//             window.open(whatsappURL, '_blank');
//         }

/* ---------- Forms that submit straight to WhatsApp, formatted ---------- */
  document.querySelectorAll('.wa-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const number = form.dataset.waNumber || '919958216959';
      const title = (form.dataset.waTitle || 'New Enquiry').toUpperCase();

      // Split fields into "details" (name/phone/email) and everything else,
      // so the message reads like a structured enquiry rather than a flat list.
      const detailFields = ['Name', 'Phone', 'Email'];
      const detailLines = [];
      const infoLines = [];

      form.querySelectorAll('input[name], select[name], textarea[name]').forEach(field => {
        const label = field.name;
        const value = (field.value || '').trim();
        if (!value) return;
        const line = `- ${label}: ${value}`;
        if (detailFields.includes(label)) detailLines.push(line);
        else infoLines.push(line);
      });

      const lines = [title];
      if (detailLines.length) {
        lines.push('Client Details:', ...detailLines);
      }
      if (infoLines.length) {
        lines.push('Enquiry Info:', ...infoLines);
      }
      lines.push('This request was sent from the website contact form.');

      const message = lines.join('\n');

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;

      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');

      btn.innerHTML = '<i class="fa-solid fa-check"></i> Opening WhatsApp…';
      setTimeout(() => {
        btn.innerHTML = original;
        form.reset();
        const popup = document.querySelector('.enquiry-popup');
        if (popup && form.closest('.enquiry-popup')) popup.classList.remove('is-open');
      }, 1600);
    });
  });

/* ---------- GSAP hero + section entrance ---------- */
function runEntranceAnimations() {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (document.querySelector('.hero-coord')) {
    tl.to('.hero-coord', { opacity: 1, y: 0, duration: 0.8 }, 0.1);
  }
  const lines = document.querySelectorAll('.hero-title .line span');
  if (lines.length) {
    tl.to(lines, { y: '0%', duration: 1, stagger: 0.12 }, 0.25);
  }
  if (document.querySelector('.hero-sub')) {
    tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.9 }, 0.65);
  }
  if (document.querySelector('.hero-actions')) {
    tl.to('.hero-actions', { opacity: 1, y: 0, duration: 0.9 }, 0.8);
  }
  if (document.querySelector('.hero-corners')) {
    tl.to('.hero-corners span', { opacity: 0.75, duration: 1 }, 0.9);
  }

  if (document.querySelector('.page-hero h1')) {
    gsap.fromTo('.page-hero h1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
    gsap.fromTo('.page-hero .breadcrumb', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.5 });
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.gsap-fade').forEach(el => {
      gsap.fromTo(el, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }
}
});
