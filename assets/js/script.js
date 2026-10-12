(function () {
  var root = document.documentElement;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  root.classList.add('js');

  /* Links ainda sem destino não rolam a página para o topo */
  Array.prototype.forEach.call(document.querySelectorAll('a[href="#"]'), function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* Efeito de digitar e apagar */
  var typed = document.getElementById('typed');
  var phrases = ['Desenvolvedor Back-end.', 'Computação em nuvem.', 'Transformando sistemas.'];
  var pi = 0, ci = phrases[0].length, deleting = true;
  function tick() {
    var full = phrases[pi];
    ci += deleting ? -1 : 1;
    typed.textContent = full.slice(0, ci);
    var delay = deleting ? 32 : 68;
    if (!deleting && ci === full.length) { deleting = true; delay = 1900; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 380; }
    setTimeout(tick, delay);
  }
  if (typed && !reduce) { setTimeout(tick, 2200); }

  /* Atraso escalonado nos grupos de cards */
  Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (group) {
    var step = parseFloat(group.getAttribute('data-stagger')) || 0.09;
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * step).toFixed(2) + 's');
    });
  });

  /* Revelação ao rolar */
  var items = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(items, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  }

  /* Projetos extras */
  var more = document.getElementById('more-projects');
  var toggle = document.getElementById('toggle-projects');
  var label = document.getElementById('toggle-label');
  more.classList.add("grid-remove")
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    var cards = more.querySelectorAll('[data-reveal]');
    if (!open) {
      Array.prototype.forEach.call(cards, function (c) { c.classList.remove('is-in'); });
      more.hidden = false;
      more.classList.add("grid-remove")
      void more.offsetWidth;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          Array.prototype.forEach.call(cards, function (c) { c.classList.add('is-in'); });
        });
      });
      toggle.setAttribute('aria-expanded', 'true');
      label.textContent = 'Ver menos projetos';
      more.classList.remove("grid-remove")
    } else {
      more.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      label.textContent = 'Ver mais projetos';
      more.classList.add("grid-remove")
    }
  });

  /* Menu no celular */
  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('nav');
  var menuOpen = false;
  function setMenu(o) {
    menuOpen = o;
    nav.classList.toggle('is-open', o);
    menuBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  links.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* Link ativo conforme a seção visível */
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) { so.observe(s); }
    });
  }

  /* Efeitos ligados ao scroll: barra de progresso, cabeçalho, faixa e brilho do hero */
  var lastY = window.scrollY || 0, ticking = false;
  function update() {
    var y = window.scrollY || 0;
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--progress', (max > 0 ? Math.min(y / max, 1) : 0).toFixed(4));
    if (!reduce) { root.style.setProperty('--scroll', y.toFixed(1)); }
    header.classList.toggle('is-scrolled', y > 24);
    if (!menuOpen) {
      if (y > lastY + 4 && y > 240) { header.classList.add('is-hidden'); }
      else if (y < lastY - 4 || y <= 240) { header.classList.remove('is-hidden'); }
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* Brilho que acompanha o cursor nos cards */
  Array.prototype.forEach.call(document.querySelectorAll('.card, .mini'), function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* Parallax do orb do hero */
  const orb = document.querySelector('.hero-orb');
  function updateOrb(x, y) {
    // Sempre parte do ponto central (-50%, -50%)
    orb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }
})();
