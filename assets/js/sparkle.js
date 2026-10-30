/* Twinkling sparkles in the side margins + sparkle cursor trail.
   Turn off: remove the <script> tag for this file in _layouts/minimal.html.
   Side particles only run where <body data-ambient="1">. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var ambient = document.body.getAttribute('data-ambient') === '1';
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  function palette() {
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return dark
      ? { a: [140, 196, 194], b: [232, 200, 140], line: 0.10 }
      : { a: [47, 93, 98], b: [196, 150, 70], line: 0.09 };
  }
  var pal = palette();
  try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { pal = palette(); }); } catch (e) {}

  // central text column bounds (particles stay outside it)
  var colL = 0, colR = 0;
  function measure() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var main = document.querySelector('main');
    var r = main ? main.getBoundingClientRect() : { left: W / 2 - 340, right: W / 2 + 340 };
    colL = r.left - 24; colR = r.right + 24;
  }

  // ---- ambient side particles ----
  var nodes = [];
  function sideWidth() { return Math.max(0, colL); }
  function spawnNode(n) {
    var left = Math.random() < 0.5;
    var sw = sideWidth();
    n = n || {};
    n.x = left ? Math.random() * sw : colR + Math.random() * (W - colR);
    n.y = Math.random() * H;
    n.vx = (Math.random() - 0.5) * 0.18;
    n.vy = -0.08 - Math.random() * 0.22;
    n.r = 4 + Math.random() * 6;
    n.ph = Math.random() * Math.PI * 2;
    n.sp = 0.006 + Math.random() * 0.014;
    n.c = Math.random() < 0.7 ? 'a' : 'b';
    return n;
  }
  function buildNodes() {
    nodes = [];
    if (!ambient || sideWidth() < 120) return;
    var count = Math.round(Math.min(45, (sideWidth() * 2 * H) / 22000));
    for (var i = 0; i < count; i++) nodes.push(spawnNode());
  }
  function inColumn(x) { return x > colL && x < colR; }

  // ---- cursor sparkles ----
  var sparks = [];
  var last = 0;
  if (finePointer) {
    window.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - last < 16) return;
      last = now;
      for (var i = 0; i < 1; i++) {
        sparks.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.2) * 0.8 + 0.3,
          life: 1,
          decay: 0.018 + Math.random() * 0.02,
          s: 4 + Math.random() * 5,
          c: Math.random() < 0.5 ? 'a' : 'b',
          rot: Math.random() * Math.PI
        });
      }
      if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
    }, { passive: true });
  }

  // Emoji-style sparkle: 4-point star, yellow centre -> orange tips
  function sparkle(x, y, size, a, rot) {
    if (size < 0.4 || a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0); ctx.globalAlpha = Math.max(0, Math.min(1, a));
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    g.addColorStop(0, '#fff7a8');
    g.addColorStop(0.3, '#ffe14d');
    g.addColorStop(0.75, '#ffae1a');
    g.addColorStop(1, '#f7931e');
    ctx.fillStyle = g;
    var w = size * 0.22; // waist: smaller = thinner points
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(w, -w, size, 0);
    ctx.quadraticCurveTo(w, w, 0, size);
    ctx.quadraticCurveTo(-w, w, -size, 0);
    ctx.quadraticCurveTo(-w, -w, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  var running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) requestAnimationFrame(tick); });

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);

    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      n.x += n.vx; n.y += n.vy; n.ph += n.sp;
      if (n.y < -20 || n.x < -20 || n.x > W + 20 || inColumn(n.x)) { spawnNode(n); n.y = H + 10; }
      var tw = 0.55 + 0.45 * Math.sin(n.ph);          // twinkle
      sparkle(n.x, n.y, n.r * (0.75 + 0.35 * tw), 0.35 + 0.6 * tw, 0);
    }

    for (var s = sparks.length - 1; s >= 0; s--) {
      var sp = sparks[s];
      sp.x += sp.vx; sp.y += sp.vy; sp.vy += 0.015; sp.life -= sp.decay; sp.rot += 0.05;
      if (sp.life <= 0) { sparks.splice(s, 1); continue; }
      sparkle(sp.x, sp.y, sp.s * (0.4 + 0.6 * sp.life), sp.life, 0);
    }
    requestAnimationFrame(tick);
  }

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { measure(); buildNodes(); }, 150); });
  measure(); buildNodes(); requestAnimationFrame(tick);
})();
