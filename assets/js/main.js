/* ==========================================================================
   PHIREZ INTERNATIONAL LIMITED — Site interactions
   Nav overlay + mega panels, scroll header, fade-up reveals, stat count-up,
   logo marquee duplication, carousel init, contact form handling.
   All progressively enhanced: with JS disabled, content is fully visible
   (see html:not(.js) rules in style.css) and standard anchor links still work.
   ========================================================================== */
(function () {
  document.documentElement.classList.add('js');

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector('.header-wrapper');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Desktop "Solutions" hover dropdown ----------------
     Pure-CSS :hover closes the instant the cursor leaves the trigger's own
     box, which is too small a target to reach the panel below it — the
     panel would flash shut before a click could land. Layering on a JS
     "is-open" state with a short close delay gives the cursor time to
     travel from the link down into the panel without losing the hover. */
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    var closeTimer;
    function open() {
      clearTimeout(closeTimer);
      drop.classList.add('is-open');
    }
    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { drop.classList.remove('is-open'); }, 350);
    }
    drop.addEventListener('mouseenter', open);
    drop.addEventListener('mouseleave', scheduleClose);
    drop.addEventListener('focusin', open);
    drop.addEventListener('focusout', function (e) {
      if (!drop.contains(e.relatedTarget)) scheduleClose();
    });
    drop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { drop.classList.remove('is-open'); drop.querySelector('a').blur(); }
    });
  });

  /* ---------------- Rotating hero carousel (DJI Enterprise style) ----------------
     Cross-fades a stack of [data-hero-carousel] .hero-carousel-slide elements on
     an interval, with arrow/dot controls and hover-to-pause. Progressively
     enhanced: with JS disabled the first slide (.is-active in the markup) is the
     only one visible, so the hero still reads correctly. */
  document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-carousel-slide'));
    if (slides.length < 2) return;
    var dotsWrap = carousel.querySelector('.hero-carousel-dots');
    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      dotsWrap.appendChild(b);
      return b;
    });
    var current = 0;
    var interval = parseInt(carousel.dataset.interval, 10) || 6000;
    var timer;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
    }
    function next() { show(current + 1); }
    function prev() { show(current - 1); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, interval);
    }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { show(i); restart(); });
    });
    var prevBtn = carousel.querySelector('.hero-carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.hero-carousel-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
    carousel.addEventListener('mouseleave', restart);

    restart();
  });

  /* ---------------- Full-screen nav overlay ---------------- */
  var menuTrigger = document.querySelector('.menu-trigger');
  var navOverlay = document.querySelector('.nav-overlay');
  var body = document.body;

  function openNav() {
    navOverlay.classList.add('is-open');
    header.classList.add('nav-open');
    body.classList.add('nav-locked');
    menuTrigger.setAttribute('aria-expanded', 'true');
    navOverlay.setAttribute('aria-hidden', 'false');
  }
  function closeNav() {
    navOverlay.classList.remove('is-open');
    header.classList.remove('nav-open');
    body.classList.remove('nav-locked');
    menuTrigger.setAttribute('aria-expanded', 'false');
    navOverlay.setAttribute('aria-hidden', 'true');
    resetPanels();
  }
  if (menuTrigger && navOverlay) {
    menuTrigger.addEventListener('click', function () {
      if (navOverlay.classList.contains('is-open')) closeNav();
      else openNav();
    });
  }

  var panels = document.querySelectorAll('.nav-panel');
  function resetPanels() {
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.panel === 'root');
    });
  }
  document.querySelectorAll('[data-open-panel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-open-panel');
      panels.forEach(function (p) { p.classList.toggle('is-active', p.dataset.panel === target); });
    });
  });
  document.querySelectorAll('[data-back-panel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      panels.forEach(function (p) { p.classList.toggle('is-active', p.dataset.panel === 'root'); });
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOverlay && navOverlay.classList.contains('is-open')) closeNav();
  });
  navOverlay && navOverlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { closeNav(); });
  });

  /* ---------------- Mobile accordion nav ---------------- */
  document.querySelectorAll('[data-accordion-trigger]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });

  /* ---------------- Scroll reveal (fade-up) ---------------- */
  var revealEls = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(function () { entry.target.classList.add('aos-in'); }, parseInt(delay, 10));
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('aos-in'); });
  }

  /* ---------------- Stat count-up ---------------- */
  var counters = document.querySelectorAll('.count-target');
  if ('IntersectionObserver' in window && counters.length) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var isDecimal = el.getAttribute('data-count').indexOf('.') > -1;
        var duration = 1400;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var val = end * eased;
          el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = isDecimal ? end.toFixed(1) : end;
        }
        requestAnimationFrame(step);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------------- Logo marquee: duplicate track for seamless loop ---------------- */
  document.querySelectorAll('.marquee-track').forEach(function (track) {
    if (track.dataset.cloned) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentNode.appendChild(clone);
    track.dataset.cloned = 'true';
  });

  /* ---------------- Contact form ---------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var wrap = field.closest('.form-field');
        var ok = field.value.trim().length > 0;
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle('has-error', !ok);
        if (!ok) valid = false;
      });
      var statusEl = form.querySelector('.form-status');
      if (!valid) {
        if (statusEl) {
          statusEl.textContent = 'Please fill in all required fields with a valid email address.';
          statusEl.className = 'form-status show error';
        }
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      var payload = new FormData(form);
      payload.set('_subject', 'Website enquiry: ' + (payload.get('subject') || 'General') + ' — ' + (payload.get('name') || ''));
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Submission failed');
        return res.json();
      }).then(function (data) {
        if (data && (data.success === false || data.success === 'false')) throw new Error('Submission rejected');
        form.reset();
        if (statusEl) {
          statusEl.textContent = "Thank you — your message has been sent. Our team will get back to you shortly.";
          statusEl.className = 'form-status show success';
        }
      }).catch(function () {
        if (statusEl) {
          var fd = new FormData(form);
          var body = (fd.get('message') || '') + '\n\n' + (fd.get('name') || '') + '\n' + (fd.get('email') || '');
          var mailto = 'mailto:info@phirez.ug?subject=' + encodeURIComponent(fd.get('subject') || 'Website enquiry') +
            '&body=' + encodeURIComponent(body);
          statusEl.textContent = 'Something went wrong sending your message. ';
          var link = document.createElement('a');
          link.href = mailto;
          link.textContent = 'Email it to info@phirez.ug instead';
          statusEl.appendChild(link);
          statusEl.className = 'form-status show error';
        }
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
    });

    /* Pre-fill the subject + message from URL query parameters (?product=, ?course=,
       ?action=, ?service=, ?sector=, ?project=). Subject strings must match the
       <option> text in contact/index.html exactly. */
    if (window.location.search) {
      try {
        var params = new URLSearchParams(window.location.search);
        var subjectSelect = form.querySelector('#subject');
        var messageTextarea = form.querySelector('#message');
        var SUBJ = {
          geo: 'Geospatial & Spatial Data Infrastructure',
          gis: 'GIS & Remote Sensing',
          it: 'IT Consultancy & Supplies',
          managed: 'IT Managed Services',
          training: 'Professional Training & Consultancy',
          general: 'General Enquiry'
        };
        var label = function (slug) { return slug.replace(/-/g, ' ').toUpperCase(); };
        var matchedSubject = '';
        var noteContext = '';

        var product = params.get('product');
        var course = params.get('course');
        var action = params.get('action') || params.get('service');
        var sector = params.get('sector');
        var project = params.get('project');

        if (product) {
          matchedSubject = SUBJ.geo;
          if (/^(esri|dji|xgrids)/.test(product)) matchedSubject = SUBJ.gis;
          else if (/^(ibm|it-)/.test(product)) matchedSubject = SUBJ.it;
          noteContext = 'I would like to request pricing, technical specifications, and availability for: ' + label(product) + '.';
        } else if (course) {
          matchedSubject = SUBJ.training;
          noteContext = 'I am interested in scheduling or learning more about the ' + label(course) + ' training module.';
        } else if (action === 'service' || action === 'calibration') {
          matchedSubject = SUBJ.geo;
          noteContext = 'I would like to request instrument calibration and maintenance service for our survey equipment.';
        } else if (action === 'support') {
          matchedSubject = SUBJ.general;
          noteContext = 'I am reaching out to request technical support for our geospatial hardware/software.';
        } else if (action === 'training') {
          matchedSubject = SUBJ.training;
        } else if (action === 'sdi') {
          matchedSubject = SUBJ.geo;
          noteContext = 'I would like to discuss a spatial data infrastructure (SDI) project.';
        } else if (action === 'consultancy') {
          matchedSubject = SUBJ.it;
          noteContext = 'I would like to discuss IT consultancy and supplies.';
        } else if (action === 'assurance') {
          matchedSubject = SUBJ.managed;
          noteContext = 'I would like to discuss a technology assurance plan.';
        } else if (action === 'contracting') {
          matchedSubject = SUBJ.geo;
          noteContext = 'I would like to discuss a contract survey and engineering project.';
        } else if (sector) {
          matchedSubject = SUBJ.geo;
          noteContext = 'I would like to discuss geospatial solutions for the ' + sector.replace(/-/g, ' ') + ' sector.';
        } else if (project) {
          matchedSubject = SUBJ.geo;
          noteContext = 'I am interested in a project similar to: ' + project.replace(/-/g, ' ') + '.';
        }

        if (matchedSubject && subjectSelect) {
          for (var i = 0; i < subjectSelect.options.length; i++) {
            if (subjectSelect.options[i].value === matchedSubject || subjectSelect.options[i].text === matchedSubject) {
              subjectSelect.selectedIndex = i;
              break;
            }
          }
        }

        if (noteContext && messageTextarea && !messageTextarea.value.trim()) {
          messageTextarea.value = noteContext;
        }
      } catch (e) {
        /* Ignore query parsing errors */
      }
    }
  }

  /* ---------------- Hero floating cards that pre-filter the gallery ---------------- */
  document.querySelectorAll('.hero-agro-card[data-filter]').forEach(function (card) {
    card.addEventListener('click', function () {
      var btn = document.querySelector('.filter-btn[data-filter="' + card.dataset.filter + '"]');
      if (btn) btn.click();
    });
  });

  /* ---------------- Gallery filters + lightbox ---------------- */
  var galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    var galleryItems = Array.prototype.slice.call(galleryGrid.querySelectorAll('.gallery-item'));
    var galleryLinks = galleryItems.map(function (item) { return item.querySelector('.gallery-link'); });

    /* Filtering */
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var target = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var match = target === 'all' || item.getAttribute('data-category') === target;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });

    /* Lightbox */
    var lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
      var lbImg = lightbox.querySelector('.lightbox-img');
      var lbCaption = lightbox.querySelector('.lightbox-caption');
      var lbCurrent = lightbox.querySelector('.lightbox-count .current');
      var lbTotal = lightbox.querySelector('.lightbox-count .total');
      var lastFocused = null;
      var openIndex = 0;

      lbTotal.textContent = galleryLinks.length;

      function renderLightbox(index) {
        var visible = galleryItems.filter(function (item) { return !item.classList.contains('is-hidden'); });
        var pool = visible.length ? visible : galleryItems;
        openIndex = (index + pool.length) % pool.length;
        var item = pool[openIndex];
        var link = item.querySelector('.gallery-link');
        var img = item.querySelector('img');
        lbImg.src = link.getAttribute('href');
        lbImg.alt = img.getAttribute('alt');
        var captionEl = item.querySelector('.gallery-caption');
        lbCaption.innerHTML = captionEl ? captionEl.innerHTML : '';
        lbCurrent.textContent = openIndex + 1;
        lbTotal.textContent = pool.length;
        lightbox._pool = pool;
      }

      function openLightbox(targetItem) {
        lastFocused = document.activeElement;
        var visible = galleryItems.filter(function (item) { return !item.classList.contains('is-hidden'); });
        var pool = visible.length ? visible : galleryItems;
        var idx = typeof targetItem === 'number' ? targetItem : pool.indexOf(targetItem);
        if (idx === -1) idx = 0;
        renderLightbox(idx);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        body.classList.add('nav-locked');
        lightbox.querySelector('.lightbox-close').focus();
      }
      function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        body.classList.remove('nav-locked');
        if (lastFocused) lastFocused.focus();
      }

      galleryItems.forEach(function (item) {
        var link = item.querySelector('.gallery-link');
        if (!link) return;
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(item);
        });
      });

      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-prev').addEventListener('click', function () { renderLightbox(openIndex - 1); });
      lightbox.querySelector('.lightbox-next').addEventListener('click', function () { renderLightbox(openIndex + 1); });
      lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') renderLightbox(openIndex + 1);
        if (e.key === 'ArrowLeft') renderLightbox(openIndex - 1);
      });
    }
  }

  /* ---------------- Current year in footer ---------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
