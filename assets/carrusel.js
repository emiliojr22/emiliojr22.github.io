/* Minitools GIS · carrusel de herramientas y transición horizontal entre páginas.
   Se carga en <head> para registrar 'pagereveal' antes del primer pintado. */
(function () {
  var HERRAMIENTAS = [
    { id: 'coordenadas', ruta: 'conversor-coordenadas/', clave: 'h.coord' },
    { id: 'formatos', ruta: 'conversor-formatos/', clave: 'h.formatos' },
    { id: 'duplicados', ruta: 'buscador-duplicados/', clave: 'h.duplicados' },
    { id: 'medir', ruta: 'medir/', clave: 'h.medir' }
  ];
  window.HERRAMIENTAS = HERRAMIENTAS;
  var raiz = document.documentElement.getAttribute('data-raiz') || './';
  var actual = document.documentElement.getAttribute('data-herramienta') || '';
  var iActual = HERRAMIENTAS.findIndex(function (h) { return h.id === actual; });

  // Dirección de la animación al llegar a esta página
  window.addEventListener('pagereveal', function (e) {
    if (!e.viewTransition) return;
    var dir = sessionStorage.getItem('vt-dir') || 'adelante';
    sessionStorage.removeItem('vt-dir');
    var html = document.documentElement;
    html.classList.add('vt-' + dir, 'sin-revelar');
    e.viewTransition.finished.finally(function () { html.classList.remove('vt-' + dir); });
  });

  function indiceDeRuta(href) {
    for (var i = 0; i < HERRAMIENTAS.length; i++) if (href.indexOf('/' + HERRAMIENTAS[i].ruta) >= 0) return i;
    return -1;
  }
  // Recordar hacia dónde vamos antes de salir
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target || a.origin !== location.origin) return;
    var dir = a.getAttribute('data-dir');
    if (!dir) {
      var destino = indiceDeRuta(a.href);
      dir = destino > iActual ? 'adelante' : 'atras';
    }
    sessionStorage.setItem('vt-dir', dir);
  });

  var t = function (k) { return window.t ? window.t(k) : k; };
  var flechaIzq = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var flechaDer = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

  function pintar(nav) {
    var n = HERRAMIENTAS.length, ant = HERRAMIENTAS[(iActual - 1 + n) % n], sig = HERRAMIENTAS[(iActual + 1) % n];
    var pistas = HERRAMIENTAS.map(function (h, i) {
      return '<li><a href="' + raiz + h.ruta + '"' + (i === iActual ? ' aria-current="page"' : '') + '><span class="num">' + (i + 1) + '</span><span class="nom">' + t(h.clave) + '</span></a></li>';
    }).join('');
    nav.setAttribute('aria-label', t('car.etiqueta'));
    nav.innerHTML =
      '<a class="paso ant" data-dir="atras" href="' + raiz + ant.ruta + '" title="' + t(ant.clave) + '">' + flechaIzq + '<span>' + t('car.anterior') + '</span></a>' +
      '<div class="pistas-caja" style="--i:' + iActual + ';--n:' + n + '"><ol class="pistas">' + pistas + '</ol><span class="indicador" aria-hidden="true"></span></div>' +
      '<a class="paso sig" data-dir="adelante" href="' + raiz + sig.ruta + '" title="' + t(sig.clave) + '"><span>' + t('car.siguiente') + '</span>' + flechaDer + '</a>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('nav.carrusel');
    if (!nav || iActual < 0) return;
    pintar(nav);
    document.addEventListener('idioma', function () { pintar(nav); });
    // Deslizar con el dedo sobre la barra del carrusel
    var x0 = null;
    nav.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    nav.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 60) return;
      var a = nav.querySelector(dx < 0 ? '.paso.sig' : '.paso.ant');
      if (a) { sessionStorage.setItem('vt-dir', a.getAttribute('data-dir')); location.href = a.href; }
    });
  });
})();
