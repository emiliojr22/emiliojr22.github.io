/* Minitools GIS · relieve decorativo con curvas de nivel y cuadrícula UTM */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var M_PX = 12.5;            // metros por píxel
  var X0 = 418000, Y0 = 4516500; // esquina superior izquierda (UTM 30N)

  function semilla(n) { return function () { n = (n * 16807) % 2147483647; return (n - 1) / 2147483646; }; }

  function campo(w, h) {
    var r = semilla(20261124), cerros = [];
    for (var i = 0; i < 9; i++) cerros.push({ x: r() * w, y: r() * h, a: 40 + r() * 70, s: 90 + r() * 230 });
    return function (x, y) {
      var v = 12 * Math.sin(x / 170) * Math.cos(y / 130);
      for (var i = 0; i < cerros.length; i++) {
        var c = cerros[i], dx = x - c.x, dy = y - c.y;
        v += c.a * Math.exp(-(dx * dx + dy * dy) / (2 * c.s * c.s));
      }
      return v;
    };
  }

  function curvas(f, w, h, paso, equi) {
    var cols = Math.ceil(w / paso) + 1, filas = Math.ceil(h / paso) + 1, z = [], min = 1e9, max = -1e9;
    for (var j = 0; j < filas; j++) for (var i = 0; i < cols; i++) {
      var v = f(i * paso, j * paso); z.push(v); if (v < min) min = v; if (v > max) max = v;
    }
    var finas = '', maestras = '';
    for (var k = Math.ceil(min / equi), n = 0; k * equi < max; k++, n++) {
      var L = k * equi, d = '';
      for (j = 0; j < filas - 1; j++) for (i = 0; i < cols - 1; i++) {
        var a = z[j * cols + i], b = z[j * cols + i + 1], c = z[(j + 1) * cols + i + 1], e = z[(j + 1) * cols + i];
        var caso = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (e > L ? 1 : 0);
        if (caso === 0 || caso === 15) continue;
        var x = i * paso, y = j * paso;
        var arr = [x + paso * (L - a) / (b - a), y], der = [x + paso, y + paso * (L - b) / (c - b)],
            aba = [x + paso * (L - e) / (c - e), y + paso], izq = [x, y + paso * (L - a) / (e - a)];
        var seg = ({1: [izq, aba], 2: [aba, der], 3: [izq, der], 4: [arr, der], 5: [izq, arr, aba, der], 6: [arr, aba],
                    7: [izq, arr], 8: [izq, arr], 9: [arr, aba], 10: [izq, aba, arr, der], 11: [arr, der], 12: [izq, der],
                    13: [aba, der], 14: [izq, aba]})[caso];
        for (var s = 0; s < seg.length; s += 2)
          d += 'M' + seg[s][0].toFixed(1) + ' ' + seg[s][1].toFixed(1) + 'L' + seg[s + 1][0].toFixed(1) + ' ' + seg[s + 1][1].toFixed(1);
      }
      if (k % 5 === 0) maestras += d; else finas += d;
    }
    return { finas: finas, maestras: maestras };
  }

  function el(tag, attrs, padre) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(e);
    return e;
  }

  function dibujar(caja) {
    var w = caja.clientWidth, h = caja.clientHeight, viejo = caja.querySelector('svg.curvas');
    if (viejo) viejo.remove();
    var svg = el('svg', { 'class': 'curvas', viewBox: '0 0 ' + w + ' ' + h, 'aria-hidden': 'true', preserveAspectRatio: 'none' });
    var c = curvas(campo(w, h), w, h, 8, 6);
    el('path', { d: c.finas, 'class': 'c' }, svg);
    el('path', { d: c.maestras, 'class': 'm' }, svg);
    var km = 1000 / M_PX, g = '';
    var x1 = Math.ceil(X0 / 1000) * 1000, y1 = Math.floor(Y0 / 1000) * 1000;
    for (var X = x1; (X - X0) / M_PX < w; X += 1000) {
      var px = (X - X0) / M_PX; g += 'M' + px.toFixed(1) + ' 0V' + h;
      if (px > 30) el('text', { x: px + 3, y: 13 }, svg).textContent = (X / 1000).toFixed(0);
    }
    for (var Y = y1; (Y0 - Y) / M_PX < h; Y -= 1000) {
      var py = (Y0 - Y) / M_PX; g += 'M0 ' + py.toFixed(1) + 'H' + w;
      if (py > 24) el('text', { x: 4, y: py - 3 }, svg).textContent = (Y / 1000).toFixed(0);
    }
    el('path', { d: g, 'class': 'g' }, svg);
    caja.insertBefore(svg, caja.firstChild);
  }

  // UTM 30N → geográficas (WGS84 / GRS80)
  function utm2geo(x, y, huso) {
    var A = 6378137, F = 1 / 298.257223563, K0 = 0.9996, E2 = F * (2 - F), EP2 = E2 / (1 - E2), R = Math.PI / 180;
    x -= 500000;
    var lon0 = ((huso - 1) * 6 - 177) * R, mu = (y / K0) / (A * (1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * E2 * E2 * E2 / 256));
    var e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));
    var p = mu + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu) + (151 * Math.pow(e1, 3) / 96) * Math.sin(6 * mu);
    var N = A / Math.sqrt(1 - E2 * Math.pow(Math.sin(p), 2)), T = Math.pow(Math.tan(p), 2), C = EP2 * Math.pow(Math.cos(p), 2);
    var Rr = A * (1 - E2) / Math.pow(1 - E2 * Math.pow(Math.sin(p), 2), 1.5), D = x / (N * K0);
    var lat = p - (N * Math.tan(p) / Rr) * (D * D / 2 - (5 + 3 * T + 10 * C - 4 * C * C - 9 * EP2) * Math.pow(D, 4) / 24);
    var lon = lon0 + (D - (1 + 2 * T + C) * Math.pow(D, 3) / 6) / Math.cos(p);
    return [lat / R, lon / R];
  }
  function miles(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function grados(v, pos, neg) { return Math.abs(v).toFixed(4).replace('.', ',') + 'º ' + (v >= 0 ? pos : neg); }

  function lectura(caja, salida) {
    caja.addEventListener('pointermove', function (ev) {
      var r = caja.getBoundingClientRect(), X = X0 + (ev.clientX - r.left) * M_PX, Y = Y0 - (ev.clientY - r.top) * M_PX;
      var g = utm2geo(X, Y, 30);
      salida.innerHTML = 'Huso 30N &nbsp; X <b>' + miles(X) + '</b> m &nbsp; Y <b>' + miles(Y) + '</b> m<br>' +
        'Lat <b>' + grados(g[0], 'N', 'S') + '</b> &nbsp; Lon <b>' + grados(g[1], 'E', 'O') + '</b>';
    });
  }

  function iniciar() {
    var cajas = document.querySelectorAll('[data-relieve]');
    for (var i = 0; i < cajas.length; i++) {
      dibujar(cajas[i]);
      var salida = cajas[i].querySelector('[data-lectura]');
      if (salida) lectura(cajas[i], salida);
    }
    var t, ancho = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === ancho) return;
      ancho = window.innerWidth; clearTimeout(t);
      t = setTimeout(function () { for (var i = 0; i < cajas.length; i++) dibujar(cajas[i]); }, 200);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
