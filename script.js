/* ================================================================
   EVENTENY COMPARE PAGE — JAVASCRIPT
   Dependencies: jQuery 3.7.1
   ================================================================ */

/* Global: show more / show less — single centered button controls both columns */
function toggleFeatRows(evRowsId, compRowsId, btnId) {
  var evWrap   = document.getElementById(evRowsId);
  var compWrap = document.getElementById(compRowsId);
  var btn      = document.getElementById(btnId);
  if (!evWrap || !compWrap || !btn) return;
  var expanded = btn.textContent.trim() === 'Show more';
  evWrap.classList.toggle('expanded', expanded);
  compWrap.classList.toggle('expanded', expanded);
  btn.textContent = expanded ? 'Show less' : 'Show more';
}

// ── Demo modal logic ──
(function () {
  var overlay    = document.getElementById('modalOverlay');
  var openBtn    = document.getElementById('openModal');
  var closeBtn   = document.getElementById('closeModal');
  var form       = document.getElementById('demoForm');

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on overlay click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // Also wire up "Book a Demo" CTA if present
  document.querySelectorAll('[data-open-demo]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
  });

  // Form validation
  var requiredFields = [
    { id: 'demoRole',  errId: 'demoRoleError' },
    { id: 'demoName',  errId: 'demoNameError' },
    { id: 'demoEmail', errId: 'demoEmailError' },
    { id: 'demoPhone', errId: 'demoPhoneError' },
    { id: 'demoUrl',   errId: 'demoUrlError' },
  ];

  function validateField(fieldId, errId) {
    var el  = document.getElementById(fieldId);
    var err = document.getElementById(errId);
    var ok  = el.value.trim() !== '';
    el.classList.toggle('invalid', !ok);
    err.classList.toggle('visible', !ok);
    return ok;
  }

  // Live clear on input
  requiredFields.forEach(function (f) {
    var el = document.getElementById(f.id);
    el.addEventListener('input', function () {
      validateField(f.id, f.errId);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = requiredFields.every(function (f) {
      return validateField(f.id, f.errId);
    });
    if (!allValid) return;
    // Success — replace form with confirmation
    form.innerHTML = '<div style="text-align:center;padding:40px 0;">'
      + '<div style="font-size:40px;margin-bottom:16px;">🎉</div>'
      + '<p style="font-family:Poppins,sans-serif;font-size:18px;font-weight:600;color:#0a2a28;margin:0 0 8px;">Request received!</p>'
      + '<p style="font-size:14px;color:#5a7a76;">Our team will reach out within one business day.</p>'
      + '</div>';
  });
}());



   $(function () {

    /* ── Sticky nav shadow on scroll ── */
    $(window).on('scroll', function () {
      $('#mainNav').toggleClass('scrolled', $(this).scrollTop() > 20);
    });
  
    /* ────────────────────────────────────────────
       NAV DROPDOWNS
    ─────────────────────────────────────────────── */
    function closeAllDropdowns() {
      $('.nav-btn').attr('aria-expanded', 'false');
      $('.nav-dropdown').removeClass('open');
    }
  
    $('.nav-btn').on('click', function (e) {
      e.stopPropagation();
      var $btn      = $(this);
      var $dropdown = $btn.closest('.nav-item').find('.nav-dropdown');
      var isOpen    = $btn.attr('aria-expanded') === 'true';
      closeAllDropdowns();
      if (!isOpen) {
        $btn.attr('aria-expanded', 'true');
        $dropdown.addClass('open');
      }
    });
  
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.nav-item').length) closeAllDropdowns();
    });
  
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') closeAllDropdowns();
    });
  
    /* ────────────────────────────────────────────
       SCROLL REVEAL
    ─────────────────────────────────────────────── */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          $(entry.target).addClass('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    $('.reveal').each(function () { revealObserver.observe(this); });
  
    /* ────────────────────────────────────────────
       FAQ ACCORDION
    ─────────────────────────────────────────────── */
    $('.faq-q').on('click', function () {
      var $item   = $(this).closest('.faq-item');
      var wasOpen = $item.hasClass('open');
      $('.faq-item').removeClass('open');
      if (!wasOpen) $item.addClass('open');
    });
  
    /* ────────────────────────────────────────────
       ANIMATED COUNTERS
    ─────────────────────────────────────────────── */
    function animateCounter($el) {
      var raw       = parseInt($el.data('count'));
      var suffix    = $el.data('suffix') || '';
      var isDecimal = $el.data('decimal');
      var duration  = 1800;
      var t0        = performance.now();
  
      (function tick(now) {
        var progress = Math.min((now - t0) / duration, 1);
        var ease     = 1 - Math.pow(1 - progress, 3);
        var value    = raw * ease;
        $el.text(isDecimal ? (value / 10).toFixed(1) + suffix : Math.floor(value).toLocaleString() + suffix);
        if (progress < 1) requestAnimationFrame(tick);
      })(t0);
    }
  
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter($(entry.target));
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    $('[data-count]').each(function () { counterObserver.observe(this); });
  
/* ────────────────────────────────────────────
   COMPARISON HUB
─────────────────────────────────────────────── */
(function () {

  var STRIP_DATA = {
    eventbrite: {
      text: '<strong>Eventbrite</strong> focuses on ticketing and event promotion. <strong>Eventeny</strong> manages the full event includig vendors, maps, volunteers, sponsors, and ticketing in one place.',
      badge: 'Eventeny wins 9 of 11 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-eventbrite/',
      label: 'View Comparison'
    },
    cvent: {
      text: '<strong>Cvent</strong> is built for enterprise conferences and corporate teams. <strong>Eventeny</strong> is built for festivals, conventions, and live event operations.',
      badge: 'Eventeny wins 6 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-cvent/',
      label: 'View Comparison'
    },
    leap: {
      text: '<strong>Leap Conventions</strong> handles badge sales and fan event coordination. <strong>Eventeny</strong> adds vendor management, interactive mapping, sponsors, and volunteers on top.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-leap-conventions/',
      label: 'View Comparison'
    },
    zapplication: {
      text: '<strong>Zapplication</strong> centers on jury-based artist applications. <strong>Eventeny</strong> covers applications, mapping, volunteers, sponsors, and more — no extra tools required.',
      badge: 'Eventeny wins 6 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-zapplication/',
      label: 'View Comparison'
    },
    boothcentral: {
      text: '<strong>BoothCentral</strong> specializes in booth applications and floor plans. <strong>Eventeny</strong> brings ticketing, volunteers, sponsor management, and full event logistics alongside that.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-boothcentral/',
      label: 'View Comparison'
    },
    ticketspice: {
      text: '<strong>TicketSpice</strong> specializes in customizable ticket sales. <strong>Eventeny</strong> includes ticketing plus the full event stack — vendors, mapping, volunteers, and sponsors.',
      badge: 'Eventeny wins 4 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-ticketspice/',
      label: 'View Comparison'
    },
    tixr: {
      text: '<strong>Tixr</strong> focuses on premium branded ticketing for live entertainment. <strong>Eventeny</strong> fits festivals, conventions, and markets where you need more than a ticket scanner.',
      badge: 'Eventeny wins 4 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-tixr/',
      label: 'View Comparison'
    },
    oneplan: {
      text: '<strong>OnePlan</strong> excels at event site design and safety mapping. <strong>Eventeny</strong> adds vendor management, ticketing, volunteers, and scheduling alongside interactive floor plans.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/eventeny-vs-oneplan/',
      label: 'View Comparison'
    },
    expofp: {
      text: '<strong>ExpoFP</strong> specializes in interactive floor plans for expos. <strong>Eventeny</strong> delivers the same floor plan tools plus applications, ticketing, volunteers, and full event management.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/eventeny-vs-expofp/',
      label: 'View Comparison'
    },
    managemymarket: {
      text: '<strong>Manage My Market</strong> handles vendor sign-ups for markets. <strong>Eventeny</strong> covers applications, event mapping, ticketing, and volunteers — with no fees that reset each year.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/compare/eventeny-vs-manage-my-market/',
      label: 'View Comparison'
    },
    jotform: {
      text: '<strong>Jotform</strong> is a general form builder. <strong>Eventeny</strong> is purpose-built for events — with vendor management, ticketing, interactive maps, and volunteer tools out of the box.',
      badge: 'Eventeny wins 6 of 6 features',
      href: 'https://www.eventeny.com/form-building/',
      label: 'View Comparison'
    },
    googleforms: {
      text: '<strong>Google Forms</strong> collects data. <strong>Eventeny</strong> runs events — with applications, payments, ticket sales, volunteer scheduling, and interactive site maps all in one platform.',
      badge: 'Eventeny wins 6 of 6 features',
      href: 'https://www.eventeny.com/form-building/',
      label: 'View Comparison'
    },
    regfox: {
      text: '<strong>RegFox</strong> builds flexible registration forms and ticket sales. <strong>Eventeny</strong> adds vendor and artist management, interactive mapping, volunteers, and dedicated event support.',
      badge: 'Eventeny wins 5 of 6 features',
      href: 'https://www.eventeny.com/form-building/',
      label: 'View Comparison'
    }
  };

  function activateCompetitor(comp) {
    var data = STRIP_DATA[comp];
    if (!data) return;

    /* 1. Update card states */
    $('.hub-card').removeClass('active').attr('aria-pressed', 'false');
    $('.hub-card[data-comp="' + comp + '"]').addClass('active').attr('aria-pressed', 'true');

    /* 2. Update heading above strip */
    var compName = $('.hub-card[data-comp="' + comp + '"] .hub-card-name').text().trim();
    $('#hubVsHeading').html('<span class="hub-vs-ev">Eventeny</span> Vs ' + compName);

    /* 3. Update summary strip */
    $('#hubStripText').html(data.text);
    $('#hubStripBadge').text(data.badge);
    $('#hubStripLink').attr('href', data.href).text(data.label);

    /* 4. Update table panel */
    $('.comp-panel').removeClass('active');
    $('#panel-' + comp).addClass('active');

    /* 5. On mobile, nudge scroll to strip */
    if ($(window).width() < 768) {
      var stripTop = $('#hubStrip').offset().top - 80;
      $('html, body').animate({ scrollTop: stripTop }, 320);
    }
  }

  /* Card click — guard against swipe triggering activation */
  var _swipeStartX = 0;
  $(document).on('pointerdown touchstart', '.hub-card', function (e) {
    _swipeStartX = e.touches ? e.touches[0].clientX : e.clientX;
  });
  $(document).on('click', '.hub-card', function (e) {
    var endX = e.clientX;
    if (Math.abs(endX - _swipeStartX) > 10) return; // was a swipe, not a tap
    activateCompetitor($(this).data('comp'));
  });

  /* ── Rail — 4 cards per page ─────────────── */
  var PER_PAGE = 4;
  var railPage = 0;

  function getCardStep() {
    var $overflow = $('#hubRail').parent();
    var containerW = $overflow.width();
    var gap = 16;
    var perPage = 4;
    return (containerW - gap * (perPage - 1)) / perPage + gap;
  }

  function railTotalPages() {
    return Math.ceil($('#hubRail .hub-card').length / PER_PAGE);
  }

  function buildRailDots() {
    var $dots = $('#hubDots');
    $dots.empty();
    for (var i = 0; i < railTotalPages(); i++) {
      $dots.append(
        '<button class="hub-rail-dot' + (i === 0 ? ' active' : '') +
        '" data-page="' + i + '" aria-label="Page ' + (i + 1) + '"></button>'
      );
    }
  }

  function railGoTo(p) {
    var pages = railTotalPages();
    if (p < 0) p = pages - 1;       // wrap: prev from first goes to last
    if (p >= pages) p = 0;           // wrap: next from last goes to first
    railPage = p;

    var step   = getCardStep();
    var offset = step * PER_PAGE * railPage;
    $('#hubRail').css('transform', 'translateX(-' + offset + 'px)');

    $('#hubDots .hub-rail-dot').removeClass('active').eq(railPage).addClass('active');
    // Never disable — carousel loops
    $('#hubPrev, #hubNext').prop('disabled', false);
  }

  buildRailDots();
  railGoTo(0);

  $('#hubNext').on('click', function () { railGoTo(railPage + 1); });
  $('#hubPrev').on('click', function () { railGoTo(railPage - 1); });

  /* ── Touch / pointer swipe on rail ──────────── */
  (function () {
    var rail     = document.getElementById('hubRail');
    var startX   = 0;
    var startY   = 0;
    var dragging = false;
    var THRESHOLD = 40; // px needed to count as a swipe

    function onStart(x, y) {
      startX   = x;
      startY   = y;
      dragging = true;
    }
    function onEnd(x, y) {
      if (!dragging) return;
      dragging = false;
      var dx = x - startX;
      var dy = y - startY;
      // only act if horizontal movement dominates
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) railGoTo(railPage + 1);
      else        railGoTo(railPage - 1);
    }

    /* Touch events */
    rail.addEventListener('touchstart', function (e) {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    rail.addEventListener('touchend', function (e) {
      onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, { passive: true });

    /* Pointer events (covers stylus, mouse drag on desktop) */
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return; // let mouse clicks work normally
      onStart(e.clientX, e.clientY);
    });
    rail.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'mouse') return;
      onEnd(e.clientX, e.clientY);
    });
    rail.addEventListener('pointercancel', function () { dragging = false; });
  }());

  $('#hubDots').on('click', '.hub-rail-dot', function () {
    railGoTo(parseInt($(this).data('page')));
  });

  var railResizeTimer;
  $(window).on('resize', function () {
    clearTimeout(railResizeTimer);
    railResizeTimer = setTimeout(function () { railGoTo(railPage); }, 150);
  });

  /* Arrow key nav on cards */
  $(document).on('keydown', '.hub-card', function (e) {
    if (e.key === 'ArrowRight') {
      var $next = $(this).next('.hub-card');
      if ($next.length) { $next.focus(); activateCompetitor($next.data('comp')); }
    } else if (e.key === 'ArrowLeft') {
      var $prev = $(this).prev('.hub-card');
      if ($prev.length) { $prev.focus(); activateCompetitor($prev.data('comp')); }
    }
  });

  /* Boot with first card active */
  activateCompetitor('eventbrite');

})();

/* ────────────────────────────────────────────
   SMART EVENT FIT SELECTOR
─────────────────────────────────────────────── */
(function () {

  var SINGLE_MAP = {
    'ticketing': {
      name: 'Eventbrite',
      desc: 'Eventbrite specializes in ticketing, event promotion, and attendee registration for public events.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'market': {
      name: 'Manage My Market',
      desc: 'Manage My Market focuses on vendor applications, booth assignments, and market management for festivals.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'conference': {
      name: 'Cvent',
      desc: 'Cvent specializes in enterprise event planning, corporate conferences, venue sourcing, and attendee management.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'convention': {
      name: 'Leap Conventions',
      desc: 'Leap Conventions focuses on convention and fan event management with badge sales, panels, and exhibitor coordination.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'vendors': {
      name: 'BoothCentral',
      desc: 'BoothCentral specializes in vendor and exhibitor booth applications and booth space assignment.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'corporate-projects': {
      name: 'Cvent',
      desc: 'Cvent specializes in enterprise event planning, corporate conferences, venue sourcing, and attendee management.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'mapping': {
      name: 'OnePlan',
      desc: 'OnePlan focuses on event site planning, venue layout mapping, and operational logistics.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'artists': {
      name: 'Zapplication',
      desc: 'Zapplication focuses on jury-based artist applications and management for art festivals and craft shows.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    },
    'promotion': {
      name: 'Eventbrite',
      desc: 'Eventbrite specializes in ticketing, event promotion, and attendee registration for public events.',
      btn:  { label: 'Compare with Eventeny', href: '#compare' }
    }
  };

  var selected = [];

  $(document).on('click', '.sef-chip', function () {
    var $chip = $(this);
    var val   = $chip.data('value');
    if ($chip.hasClass('selected')) {
      $chip.removeClass('selected');
      selected = selected.filter(function (v) { return v !== val; });
    } else {
      $chip.addClass('selected');
      if (selected.indexOf(val) === -1) selected.push(val);
    }
    render();
  });

  $(document).on('click', '#sefResetBtn', function () {
    selected = [];
    $('.sef-chip').removeClass('selected');
    var $el = $('#sefResult');
    $el.removeClass('show').html('');
    $('html, body').animate({ scrollTop: $('#smartFit').offset().top - 80 }, 300);
  });

  function render() {
    var $el = $('#sefResult');

    if (selected.length === 0) {
      $el.removeClass('show').html('');
      return;
    }

    var html;

    if (selected.length === 1) {
      var key  = selected[0];
      var data = SINGLE_MAP[key];
      html = '<div class="sef-result-card">'
        + '<div class="sef-fit-badge"><span class="sef-fit-badge-icon">★</span> Best Fit Identified</div>'
        + '<div class="sef-result-body">'
        +   '<div>'
        +     '<div class="sef-result-title">Recommended: ' + data.name + '</div>'
        +     '<p class="sef-result-desc">' + data.desc + '</p>'
        +   '</div>'
        +   '<div class="sef-result-ctas">'
        +     '<a href="' + data.btn.href + '" class="sef-btn-primary">' + data.btn.label + '</a>'
        +     '<button id="sefResetBtn" class="sef-reset">Start over</button>'
        +   '</div>'
        + '</div>'
        + '</div>';
    } else {
      var selectedLabels = selected.map(function (v) {
        return $('.sef-chip[data-value="' + v + '"]').text().trim();
      });
      var labelsHtml = selectedLabels.map(function (l) {
        return '<strong>' + l + '</strong>';
      }).join(', ');
      html = '<div class="sef-result-card">'
        + '<div class="sef-fit-badge"><span class="sef-fit-badge-icon">★</span> Best Fit Identified</div>'
        + '<div class="sef-result-body">'
        +   '<div>'
        +     '<div class="sef-result-title">Recommended: Eventeny</div>'
        +     '<p class="sef-result-desc">Most platforms solve one piece of the event puzzle. Eventeny tries to solve the whole thing.</p>'
        +     '<div class="sef-note">'
        +       '<span class="sef-note-icon">i</span>'
        +       '<span>You selected ' + labelsHtml + '. Eventeny handles all of these under a single login — no third-party tools required.</span>'
        +     '</div>'
        +   '</div>'
        +   '<div class="sef-result-ctas">'
        +     '<a href="#" class="sef-btn-primary">See the features</a>'
        +     '<button id="sefResetBtn" class="sef-reset">Start over</button>'
        +   '</div>'
        + '</div>'
        + '</div>';
    }

    var wasShown = $el.hasClass('show');
    $el.html(html);
    if (!wasShown) {
      $el.addClass('show');
      $('html, body').animate({ scrollTop: $el.offset().top - 120 }, 380);
    }
  }

  /* ────────────────────────────────────────────
     FEATURE CATEGORY FILTER (Eventbrite panel)
  ─────────────────────────────────────────────── */
  $(document).on('click', '.feat-cat-btn', function () {
    var $btn = $(this);
    var cat = $btn.data('cat');
    $btn.closest('.feat-col-categories').find('.feat-cat-btn').removeClass('active');
    $btn.addClass('active');
    var $panel = $btn.closest('.comp-panel');

    if (cat === 'all') {
      $panel.find('.feat-item').removeClass('hidden');
      // Restore collapsed state and show the buttons
      $panel.find('.feat-rows-wrap').removeClass('expanded').addClass('collapsible');
      $panel.find('.feat-show-more-btn').show().text('Show more');
    } else {
      $panel.find('.feat-item').each(function () {
        $(this).toggleClass('hidden', $(this).data('cat') !== cat);
      });
      // Expand fully and hide buttons for specific categories
      $panel.find('.feat-rows-wrap').addClass('expanded').removeClass('collapsible');
      $panel.find('.feat-show-more-btn').hide();
    }
  });

})();

  });