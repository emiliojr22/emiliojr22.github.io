/* Minitools GIS · carga de archivos compartida (arrastrar, elegir, columnas de tablas) */
(function (G) {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var estado = { filas: null, base: 'datos', infoFn: null, err: false, op: {} };

  function info(fn, err) { estado.infoFn = fn; estado.err = !!err; pintarInfo(); }
  function pintarInfo() {
    if (!estado.infoFn) return;
    var m = estado.infoFn(), el = $('info');
    if (estado.err) el.innerHTML = '<span class="err">⚠ ' + G.Geo.esc(m) + '</span>'; else el.textContent = m;
  }
  function opciones(sel, cols, val) {
    sel.innerHTML = '<option value="">—</option>' + cols.map(function (c) {
      return '<option' + (c === val ? ' selected' : '') + '>' + G.Geo.esc(c) + '</option>';
    }).join('');
  }
  function sincronizar() {
    var wkt = $('mode').value === 'wkt';
    $('xyBox').classList.toggle('oculto', wkt); $('wktBox').classList.toggle('oculto', !wkt);
    $('zoneBox').classList.toggle('oculto', $('crs').value !== 'utm');
  }
  function entregar(fc, malas) {
    estado.op.alCargar(fc, estado.base);
    info(function () { return G.Geo.resumen(fc) + (malas ? '\n' + t('fo.malas', { n: malas }) : ''); });
  }
  function construir() {
    var o = { modo: $('mode').value, x: $('colX').value, y: $('colY').value, wkt: $('colWkt').value,
              utm: $('crs').value === 'utm', huso: parseInt($('zone').value, 10) || 30 };
    if (o.modo === 'xy' && (!o.x || !o.y)) return info(function () { return t('fo.elige.xy'); }, true);
    if (o.modo === 'wkt' && !o.wkt) return info(function () { return t('fo.elige.wkt'); }, true);
    var r = G.Geo.filasAFC(estado.filas, o);
    entregar(r.fc, r.malas);
  }
  function tabla(filas) {
    estado.filas = filas;
    var cp = G.Geo.columnasProbables(filas);
    opciones($('colX'), cp.columnas, cp.x); opciones($('colY'), cp.columnas, cp.y); opciones($('colWkt'), cp.columnas, cp.wkt);
    $('mode').value = cp.wkt ? 'wkt' : 'xy';
    $('crs').value = cp.utm ? 'utm' : 'geo';
    sincronizar();
    $('tabular').classList.remove('oculto');
    construir();
  }
  function manejar(file) {
    if (!file) return;
    estado.filas = null; $('tabular').classList.add('oculto');
    info(function () { return t('fo.leyendo', { nombre: file.name }); });
    G.Geo.leerArchivo(file).then(function (r) {
      estado.base = r.base;
      if (r.fc) entregar(r.fc, 0); else tabla(r.filas);
    }).catch(function (e) {
      if (estado.op.alError) estado.op.alError();
      info(function () { return t('err.leer', { msg: e.message }); }, true);
    });
  }
  function iniciar(op) {
    estado.op = op;
    var drop = $('drop'), entrada = $('file');
    drop.addEventListener('click', function () { entrada.click(); });
    drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); entrada.click(); } });
    entrada.addEventListener('change', function () { manejar(entrada.files[0]); entrada.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) { manejar(e.dataTransfer.files[0]); });
    $('mode').addEventListener('change', sincronizar); $('crs').addEventListener('change', sincronizar);
    $('apply').addEventListener('click', construir);
    document.addEventListener('idioma', pintarInfo);
  }
  G.Carga = { iniciar: iniciar, info: info, manejar: manejar };
})(window);
