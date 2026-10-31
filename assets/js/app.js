(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.nav-wrap');
    var menu = document.getElementById('menu');
    var links = document.getElementById('links');
    var items = links.querySelectorAll('a');
    var pill = links.querySelector('.pill');
    var current = null;

    window.addEventListener('scroll', function () {
      wrap.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    menu.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
    items.forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      });
    });

    function closeMenu() {
      links.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100) closeMenu();
    });

    function moveTo(a) {
      if (!a) { pill.style.opacity = 0; return; }
      pill.style.opacity = 1;
      pill.style.width = a.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
    }
    items.forEach(function (a) {
      a.addEventListener('mouseenter', function () { moveTo(a); });
      a.addEventListener('focus', function () { moveTo(a); });
    });
    links.addEventListener('mouseleave', function () { moveTo(current); });
    window.addEventListener('resize', function () { moveTo(current); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          current = null;
          items.forEach(function (a) {
            var on = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('active', on);
            if (on) current = a;
          });
          moveTo(current);
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      items.forEach(function (a) {
        var s = document.querySelector(a.getAttribute('href'));
        if (s) io.observe(s);
      });
    }

    var role = document.getElementById('role');
    var roles = ['Software Developer', 'IT Support Specialist', 'DevOps Enthusiasts'];
    var i = 0;
    if (!reduce) {
      setInterval(function () {
        role.classList.add('out');
        setTimeout(function () {
          i = (i + 1) % roles.length;
          role.textContent = roles[i];
          role.classList.remove('out');
        }, 260);
      }, 2800);
    }

    var card = document.getElementById('tilt');
    if (card && fine && !reduce) {
      var stage = card.parentElement;
      stage.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.classList.add('live');
        card.style.setProperty('--ry', ((x - 0.5) * 14).toFixed(2) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y) * 14).toFixed(2) + 'deg');
        card.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      stage.addEventListener('pointerleave', function () {
        card.classList.remove('live');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    }

    var bg = document.querySelector('.bg');
    if (bg && fine && !reduce) {
      var tx = 0, ty = 0, cx = 0, cy = 0, running = false;
      var tick = function () {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        bg.style.setProperty('--px', cx.toFixed(3));
        bg.style.setProperty('--py', cy.toFixed(3));
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) requestAnimationFrame(tick);
        else running = false;
      };
      window.addEventListener('pointermove', function (e) {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
        if (!running) { running = true; requestAnimationFrame(tick); }
      });
    }
  });
})();