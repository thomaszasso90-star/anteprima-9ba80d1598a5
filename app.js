(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Lingua IT / EN ---------- */
  var EN = {
    nav_menu: 'Menu', nav_place: 'The place', nav_reviews: 'Reviews', nav_where: 'Find us', call: 'Call',
    h1a: 'Pizzeria', h1b: 'da Giorgio',
    hero_p: 'Pizza, polenta and mountain first courses in Caprile di Alleghe, between Civetta and Marmolada.',
    hero_cta: 'Call to book a table',
    about_h: 'A wooden dining room in the heart of Caprile',
    about_lead: 'Mountain-style interior with a timber ceiling and benches along the walls. You eat pizza and simple, generous first courses from the traditional kitchen, with draught beer, grappa or an amaro.',
    about_note: 'Quick service, friendly staff, fair prices. Suited to all ages, families included, with parking nearby.',
    f_where: 'Where', f_rest: 'Day off', f_rest_v: 'Tuesday', f_closed: 'Annual closing', f_closed_v: 'June and January',
    f_park: 'Parking', f_park_v: 'Free, nearby',
    menu_h2: 'The full menu', pick_h: 'The pizzas are named after the peaks', n1: 'dishes on the menu', n2: 'on Tripadvisor', n3: 'reviews', n4: 'months a year open',
    menu_note: 'Indicative prices, to be confirmed with the restaurant. Lunch and dinner.',
    c_pizze: 'The pizzas', c_cime: 'House specials', c_class: 'The classics', winter: 'winter only · cured ham, radicchio',
    house: 'House pizza', c_primi: 'First courses', soup: 'Soup of the day',
    c_piastra: 'Polenta, mushrooms and meat', sides: 'Sautéed mushrooms, grilled vegetables',
    c_dolci: 'Desserts', tartufo: 'White or dark chocolate tartufo', gelato: 'Vanilla or hazelnut ice cream', salads: 'Green or mixed salad, chips',
    c_bere: 'Drinks', beer: 'Draught beer, Moretti and Ichnusa', wine: 'House wine, red or white', bottles: 'Wines by the bottle',
    grappe: 'Mountain grappas and amari',
    gal_lead: 'Geraniums on the balcony outside, timber inside, the bar and tables laid with paper.',
    cap1: 'Corso Veneto, in the centre of Caprile', cap2: 'The bar, with draught beer', cap3: 'Pizza and the paper placemat',
    rev_h: 'What guests say', rev_score: '4.0 out of 5 · 81 reviews on Tripadvisor',
    q1: 'Welcoming, relaxing atmosphere, truly exceptional pizza, very friendly staff.', d1: 'August 2026',
    q2: 'Good variety of pizzas, also with original combinations. Good prices.', d2: 'September 2024',
    q3: 'Excellent polenta with sausage and mushrooms, then the casunziei. All for the right price.', d3: 'July 2024',
    proverb: '“Beauty does not make the pot boil.”', proverb_src: 'From the restaurant’s paper placemat',
    visit_h: 'Come and see us', h_days: 'Monday, Thursday – Sunday', h_wed: 'Wednesday', h_tue: 'Tuesday', closed: 'Closed',
    call_table: 'Call to book',
    foot_big: 'See you soon in Caprile.', foot_msg: 'We’ll be waiting with a hot pizza and polenta on the fire. Call and tell us when you arrive.',
    imprint: 'Website proposal by Thomas Zasso · not affiliated with Pizzeria da Giorgio · Photos: Visit Dolomiti Bellunesi and Tripadvisor travellers, demo only'
  };
  var IT = {};
  var nodes = document.querySelectorAll('[data-i18n]');
  nodes.forEach(function (n) { IT[n.getAttribute('data-i18n')] = n.innerHTML; });
  var lang = 'it';
  try { lang = localStorage.getItem('dg-lang') || 'it'; } catch (e) {}
  var langBtn = document.getElementById('lang');

  function setLang(l) {
    lang = l;
    root.lang = l;
    nodes.forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      n.innerHTML = (l === 'en' && EN[k] !== undefined) ? EN[k] : IT[k];
    });
    document.querySelectorAll('.cat').forEach(function (c) {});
    langBtn.textContent = l === 'it' ? 'EN' : 'IT';
    document.title = l === 'it' ? 'Pizzeria da Giorgio · Caprile di Alleghe, Dolomiti' : 'Pizzeria da Giorgio · Caprile di Alleghe, Dolomites';
    updateOpen();
    pickCap.textContent = capTxt();
    capUpdate(currentCat);
    try { localStorage.setItem('dg-lang', l); } catch (e) {}
  }
  langBtn.addEventListener('click', function () { setLang(lang === 'it' ? 'en' : 'it'); });

  /* ---------- Aperto adesso (ora di Roma) ---------- */
  function romeNow() {
    var p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, month: 'numeric' }).formatToParts(new Date());
    var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
    var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { d: days[o.weekday], m: parseInt(o.month, 10), min: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10) };
  }
  function t(h) { return String(Math.floor(h / 60)).padStart(2, '0') /* taste-skill-ignore */ + ':' + String(h % 60).padStart(2, '0') /* taste-skill-ignore */; }
  function openText() {
    var n = romeNow(), it = lang === 'it';
    if (n.m === 1 || n.m === 6) return it ? 'In pausa stagionale a gennaio e giugno' : 'Seasonal break in January and June';
    if (n.d === 2) return it ? 'Chiuso oggi, martedì · riapre domani alle 12:00' : 'Closed today, Tuesday · reopens tomorrow at 12:00';
    var slots = [[720, 840], [1020, 1260]];
    for (var i = 0; i < slots.length; i++) {
      if (n.min >= slots[i][0] && n.min < slots[i][1]) return (it ? 'Aperto ora · fino alle ' : 'Open now · until ') + t(slots[i][1]);
    }
    for (var j = 0; j < slots.length; j++) {
      if (n.min < slots[j][0]) return (it ? 'Chiuso ora · apre oggi alle ' : 'Closed now · opens today at ') + t(slots[j][0]);
    }
    if (n.d === 1) return it ? 'Chiuso ora · riapre mercoledì alle 12:00' : 'Closed now · reopens Wednesday at 12:00';
    return it ? 'Chiuso ora · riapre domani alle 12:00' : 'Closed now · reopens tomorrow at 12:00';
  }
  function updateOpen() {
    var txt = openText();
    ['openNow', 'openNow2'].forEach(function (id) { var el = document.getElementById(id); if (el) el.textContent = txt; });
  }
  updateOpen();
  setInterval(updateOpen, 60000);

  /* ---------- Hero: la pizza cresce e gira con lo scroll ---------- */
  var hero = document.getElementById('hero');
  var ticking = false;
  function heroFrame() {
    ticking = false;
    var rect = hero.getBoundingClientRect();
    var range = hero.offsetHeight - window.innerHeight;
    var p = Math.min(1, Math.max(0, -rect.top / (range * 0.9)));
    root.style.setProperty('--p', p.toFixed(3));
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(heroFrame); } }
  if (!reduce) { window.addEventListener('scroll', onScroll, { passive: true }); heroFrame(); }

  /* ---------- Scegli la tua cima ---------- */
  var pickImg = document.getElementById('pickImg');
  var pickCap = document.getElementById('pickCap');
  var picks = document.querySelectorAll('.pk');
  function capTxt() { return lang === 'en' ? 'Illustrative image' : 'Immagine illustrativa'; }
  function pick(btn) {
    picks.forEach(function (b) { b.classList.toggle('on', b === btn); });
    pickImg.classList.add('swap');
    setTimeout(function () {
      pickImg.src = 'img/' + btn.getAttribute('data-img') + '.webp';
      pickImg.alt = btn.getAttribute('data-alt');
      pickImg.classList.remove('swap');
    }, 280);
  }
  picks.forEach(function (b) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('mouseenter', function () { if (window.innerWidth > 900 && !b.classList.contains('on')) pick(b); });
  });
  pickCap.textContent = capTxt();

  /* ---------- Contatori ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCount(el) {
    var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10), t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 1400), v = to * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec).replace('.', ',');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { c.textContent = c.getAttribute('data-dec') ? '0,0' : '0'; cio.observe(c); });
  }

  /* ---------- Menù: la foto cambia con la categoria ---------- */
  var imgs = document.querySelectorAll('.mp');
  var cap = document.getElementById('menuCap');
  var currentCat = 'pizze';
  function capUpdate(cat) {
    var c = document.querySelector('.cat[data-cat="' + cat + '"]');
    if (c) cap.textContent = c.getAttribute(lang === 'en' ? 'data-cap-en' : 'data-cap-it');
  }
  function showCat(cat) {
    currentCat = cat;
    imgs.forEach(function (i) { i.classList.toggle('on', i.getAttribute('data-cat') === cat); });
    capUpdate(cat);
  }
  if ('IntersectionObserver' in window) {
    var catIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) showCat(e.target.getAttribute('data-cat')); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('.cat').forEach(function (c) { catIO.observe(c); });
  }

  /* ---------- Entrate: titolo, testo, foto a cascata ---------- */
  var groups = [
    ['.about .h2', '.about .lead', '.about-photo', '.facts'],
    ['.menu-h', '.menu-note'],
    ['.cat h3'],
    ['.gallery-lead'],
    ['.card-h']
  ];
  var targets = [];
  groups.forEach(function (g) {
    g.forEach(function (sel, gi) {
      document.querySelectorAll(sel).forEach(function (el, ei) {
        el.classList.add('rv'); el.style.setProperty('--d', (gi * 80) + 'ms'); targets.push(el);
      });
    });
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  if (lang === 'en') setLang('en');
})();
