/* Minitools GIS · utilidades geográficas compartidas (sin dependencias salvo XLSX, shp y shpwrite cuando se usan) */
(function (G) {
  'use strict';
  var t = function (k, v) { return G.t ? G.t(k, v) : k; };

  // ---------- Elipsoide WGS84 / UTM ----------
  var A = 6378137, F = 1 / 298.257223563, K0 = 0.9996, E2 = F * (2 - F), EP2 = E2 / (1 - E2), R = Math.PI / 180;

  function aUtm(lat, lon, husoForzado) {
    var huso = husoForzado || Math.floor((lon + 180) / 6) + 1;
    var lon0 = ((huso - 1) * 6 - 177) * R, phi = lat * R, lam = lon * R;
    var N = A / Math.sqrt(1 - E2 * Math.pow(Math.sin(phi), 2));
    var T = Math.pow(Math.tan(phi), 2), C = EP2 * Math.pow(Math.cos(phi), 2), Aa = Math.cos(phi) * (lam - lon0);
    var M = A * ((1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * Math.pow(E2, 3) / 256) * phi
      - (3 * E2 / 8 + 3 * E2 * E2 / 32 + 45 * Math.pow(E2, 3) / 1024) * Math.sin(2 * phi)
      + (15 * E2 * E2 / 256 + 45 * Math.pow(E2, 3) / 1024) * Math.sin(4 * phi)
      - (35 * Math.pow(E2, 3) / 3072) * Math.sin(6 * phi));
    var x = K0 * N * (Aa + (1 - T + C) * Math.pow(Aa, 3) / 6 + (5 - 18 * T + T * T + 72 * C - 58 * EP2) * Math.pow(Aa, 5) / 120) + 500000;
    var y = K0 * (M + N * Math.tan(phi) * (Aa * Aa / 2 + (5 - T + 9 * C + 4 * C * C) * Math.pow(Aa, 4) / 24 + (61 - 58 * T + T * T + 600 * C - 330 * EP2) * Math.pow(Aa, 6) / 720));
    if (lat < 0) y += 10000000;
    return { x: x, y: y, huso: huso, hem: lat >= 0 ? 'N' : 'S' };
  }

  function aGeo(x, y, huso, hem) {
    x -= 500000; if (hem === 'S') y -= 10000000;
    var lon0 = ((huso - 1) * 6 - 177) * R, mu = (y / K0) / (A * (1 - E2 / 4 - 3 * E2 * E2 / 64 - 5 * Math.pow(E2, 3) / 256));
    var e1 = (1 - Math.sqrt(1 - E2)) / (1 + Math.sqrt(1 - E2));
    var p = mu + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu)
      + (151 * Math.pow(e1, 3) / 96) * Math.sin(6 * mu) + (1097 * Math.pow(e1, 4) / 512) * Math.sin(8 * mu);
    var N = A / Math.sqrt(1 - E2 * Math.pow(Math.sin(p), 2)), T = Math.pow(Math.tan(p), 2), C = EP2 * Math.pow(Math.cos(p), 2);
    var Rr = A * (1 - E2) / Math.pow(1 - E2 * Math.pow(Math.sin(p), 2), 1.5), D = x / (N * K0);
    var lat = p - (N * Math.tan(p) / Rr) * (D * D / 2 - (5 + 3 * T + 10 * C - 4 * C * C - 9 * EP2) * Math.pow(D, 4) / 24
      + (61 + 90 * T + 298 * C + 45 * T * T - 252 * EP2 - 3 * C * C) * Math.pow(D, 6) / 720);
    var lon = lon0 + (D - (1 + 2 * T + C) * Math.pow(D, 3) / 6 + (5 - 2 * C + 28 * T - 3 * C * C + 8 * EP2 + 24 * T * T) * Math.pow(D, 5) / 120) / Math.cos(p);
    return { lat: lat / R, lon: lon / R };
  }

  // ---------- Medidas geodésicas (esfera de radio medio; error < 0,5 %) ----------
  var RT = 6371008.8;
  function distancia(a, b) { // [lon, lat]
    var dLat = (b[1] - a[1]) * R, dLon = (b[0] - a[0]) * R;
    var h = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(a[1] * R) * Math.cos(b[1] * R) * Math.pow(Math.sin(dLon / 2), 2);
    return 2 * RT * Math.asin(Math.min(1, Math.sqrt(h)));
  }
  function longitud(coords) { var s = 0; for (var i = 1; i < coords.length; i++) s += distancia(coords[i - 1], coords[i]); return s; }
  function areaAnillo(c) { // fórmula de área esférica (Chamberlain y Duquette)
    var s = 0, n = c.length; if (n < 3) return 0;
    for (var i = 0; i < n; i++) {
      var p1 = c[i], p2 = c[(i + 1) % n];
      s += (p2[0] - p1[0]) * R * (2 + Math.sin(p1[1] * R) + Math.sin(p2[1] * R));
    }
    return Math.abs(s * RT * RT / 2);
  }

  // ---------- Utilidades ----------
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]; }); }
  function descargar(data, nombre, tipo) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: tipo });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }
  function aFC(gj) {
    if (Array.isArray(gj)) return { type: 'FeatureCollection', features: gj.reduce(function (r, g) { return r.concat(aFC(g).features); }, []) };
    if (gj.type === 'FeatureCollection') return gj;
    if (gj.type === 'Feature') return { type: 'FeatureCollection', features: [gj] };
    return { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: gj }] };
  }
  function mapaCoords(g, fn) {
    var m = function (c) { return typeof c[0] === 'number' ? fn(c) : c.map(m); };
    return g && g.coordinates ? { type: g.type, coordinates: m(g.coordinates) } : g;
  }
  var NOMBRES = { Point: 'punto', MultiPoint: 'multipunto', LineString: 'linea', MultiLineString: 'multilinea', Polygon: 'poligono', MultiPolygon: 'multipoligono', GeometryCollection: 'mixta', '': 'singeom' };
  function resumen(fc) {
    var tipos = {}, campos = {};
    fc.features.forEach(function (f) {
      var k = f.geometry ? f.geometry.type : ''; tipos[k] = (tipos[k] || 0) + 1;
      Object.keys(f.properties || {}).forEach(function (c) { campos[c] = 1; });
    });
    var partes = Object.keys(tipos).map(function (k) { var n = tipos[k]; return n + ' ' + t('geom.' + (NOMBRES[k] || 'mixta') + (n === 1 ? '' : '.pl')); });
    var lista = Object.keys(campos);
    return t('res.elementos', { n: fc.features.length }) + ': ' + partes.join(', ') + '.\n' + t('res.campos') + ': ' + (lista.length ? lista.join(', ') : t('res.ninguno'));
  }

  // ---------- WKT ----------
  function leerWKT(s) {
    s = String(s).trim().replace(/^SRID=\d+;/i, '');
    var m = s.match(/^(MULTI)?(POINT|LINESTRING|POLYGON)\s*(Z|M|ZM)?\s*(\(.*\))$/i);
    if (!m) return null;
    var tipo = (m[1] ? 'Multi' : '') + ({ POINT: 'Point', LINESTRING: 'LineString', POLYGON: 'Polygon' })[m[2].toUpperCase()];
    var json = m[4].replace(/(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)(\s+-?[\d.eE+-]+)*/g, '[$1,$2]').replace(/\(/g, '[').replace(/\)/g, ']');
    var c = JSON.parse(json);
    if (tipo === 'Point') c = c[0];
    if (tipo === 'MultiPoint') c = c.map(function (p) { return typeof p[0] === 'number' ? p : p[0]; });
    return { type: tipo, coordinates: c };
  }
  function aWKT(g) {
    if (!g) return '';
    var pt = function (c) { return c[0] + ' ' + c[1]; }, ani = function (r) { return '(' + r.map(pt).join(', ') + ')'; }, pol = function (p) { return '(' + p.map(ani).join(', ') + ')'; };
    switch (g.type) {
      case 'Point': return 'POINT (' + pt(g.coordinates) + ')';
      case 'LineString': return 'LINESTRING ' + ani(g.coordinates);
      case 'Polygon': return 'POLYGON ' + pol(g.coordinates);
      case 'MultiPoint': return 'MULTIPOINT (' + g.coordinates.map(function (c) { return '(' + pt(c) + ')'; }).join(', ') + ')';
      case 'MultiLineString': return 'MULTILINESTRING (' + g.coordinates.map(ani).join(', ') + ')';
      case 'MultiPolygon': return 'MULTIPOLYGON (' + g.coordinates.map(pol).join(', ') + ')';
      case 'GeometryCollection': return 'GEOMETRYCOLLECTION (' + g.geometries.map(aWKT).join(', ') + ')';
    }
    return '';
  }

  // ---------- KML / GPX ----------
  function hijos(el, n) { return Array.prototype.slice.call(el.getElementsByTagName(n)); }
  function directo(el, n) { return Array.prototype.slice.call(el.children).filter(function (c) { return c.localName === n; })[0]; }
  function coordsKML(el) { return el.textContent.trim().split(/\s+/).map(function (s) { return s.split(',').slice(0, 2).map(Number); }); }
  function geomKML(el) {
    var n = el.localName;
    if (n === 'Point') return { type: 'Point', coordinates: coordsKML(hijos(el, 'coordinates')[0])[0] };
    if (n === 'LineString') return { type: 'LineString', coordinates: coordsKML(hijos(el, 'coordinates')[0]) };
    if (n === 'Polygon') {
      var ext = hijos(el, 'outerBoundaryIs').map(function (b) { return coordsKML(hijos(b, 'coordinates')[0]); });
      var int = hijos(el, 'innerBoundaryIs').map(function (b) { return coordsKML(hijos(b, 'coordinates')[0]); });
      return { type: 'Polygon', coordinates: ext.concat(int) };
    }
    if (n === 'MultiGeometry') {
      var partes = Array.prototype.slice.call(el.children).map(geomKML).filter(Boolean);
      var tipos = {}; partes.forEach(function (p) { tipos[p.type] = 1; });
      if (Object.keys(tipos).length === 1 && partes[0].type.indexOf('Multi') < 0) return { type: 'Multi' + partes[0].type, coordinates: partes.map(function (p) { return p.coordinates; }) };
      return { type: 'GeometryCollection', geometries: partes };
    }
    return null;
  }
  function leerKML(txt) {
    var doc = new DOMParser().parseFromString(txt, 'text/xml');
    return { type: 'FeatureCollection', features: hijos(doc, 'Placemark').map(function (pm) {
      var p = {};
      if (directo(pm, 'name')) p.name = directo(pm, 'name').textContent.trim();
      if (directo(pm, 'description')) p.description = directo(pm, 'description').textContent.trim();
      hijos(pm, 'Data').forEach(function (d) { p[d.getAttribute('name')] = (hijos(d, 'value')[0] || {}).textContent; });
      hijos(pm, 'SimpleData').forEach(function (d) { p[d.getAttribute('name')] = d.textContent; });
      var g = Array.prototype.slice.call(pm.children).map(geomKML).filter(Boolean)[0];
      return { type: 'Feature', properties: p, geometry: g || null };
    }) };
  }
  function leerGPX(txt) {
    var doc = new DOMParser().parseFromString(txt, 'text/xml'), fs = [];
    var ll = function (p) { return [parseFloat(p.getAttribute('lon')), parseFloat(p.getAttribute('lat'))]; };
    var nm = function (el) { var n = directo(el, 'name'); return n ? { name: n.textContent } : {}; };
    hijos(doc, 'wpt').forEach(function (w) { fs.push({ type: 'Feature', properties: nm(w), geometry: { type: 'Point', coordinates: ll(w) } }); });
    hijos(doc, 'rte').forEach(function (r) { fs.push({ type: 'Feature', properties: nm(r), geometry: { type: 'LineString', coordinates: hijos(r, 'rtept').map(ll) } }); });
    hijos(doc, 'trk').forEach(function (tr) {
      var seg = hijos(tr, 'trkseg').map(function (s) { return hijos(s, 'trkpt').map(ll); });
      fs.push({ type: 'Feature', properties: nm(tr), geometry: seg.length === 1 ? { type: 'LineString', coordinates: seg[0] } : { type: 'MultiLineString', coordinates: seg } });
    });
    return { type: 'FeatureCollection', features: fs };
  }
  function aKML(fc, titulo) {
    var c = function (p) { return p[0] + ',' + p[1]; }, cs = function (a) { return '<coordinates>' + a.map(c).join(' ') + '</coordinates>'; };
    var pol = function (p) { return '<Polygon><outerBoundaryIs><LinearRing>' + cs(p[0]) + '</LinearRing></outerBoundaryIs>' +
      p.slice(1).map(function (r) { return '<innerBoundaryIs><LinearRing>' + cs(r) + '</LinearRing></innerBoundaryIs>'; }).join('') + '</Polygon>'; };
    var geom = function (g) {
      if (!g) return '';
      switch (g.type) {
        case 'Point': return '<Point>' + cs([g.coordinates]) + '</Point>';
        case 'LineString': return '<LineString>' + cs(g.coordinates) + '</LineString>';
        case 'Polygon': return pol(g.coordinates);
        case 'MultiPoint': return '<MultiGeometry>' + g.coordinates.map(function (p) { return '<Point>' + cs([p]) + '</Point>'; }).join('') + '</MultiGeometry>';
        case 'MultiLineString': return '<MultiGeometry>' + g.coordinates.map(function (l) { return '<LineString>' + cs(l) + '</LineString>'; }).join('') + '</MultiGeometry>';
        case 'MultiPolygon': return '<MultiGeometry>' + g.coordinates.map(pol).join('') + '</MultiGeometry>';
        case 'GeometryCollection': return '<MultiGeometry>' + g.geometries.map(geom).join('') + '</MultiGeometry>';
      }
      return '';
    };
    var pms = fc.features.map(function (f, i) {
      var p = f.properties || {}, nombre = p.name || p.Name || p.nombre || p.NOMBRE || (t('kml.elemento') + ' ' + (i + 1));
      var ext = Object.keys(p).map(function (k) { return '<Data name="' + esc(k) + '"><value>' + esc(p[k]) + '</value></Data>'; }).join('');
      return '<Placemark><name>' + esc(nombre) + '</name>' + (ext ? '<ExtendedData>' + ext + '</ExtendedData>' : '') + geom(f.geometry) + '</Placemark>';
    });
    return '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>' + esc(titulo || 'datos') + '</name>\n' + pms.join('\n') + '\n</Document></kml>';
  }

  // ---------- Tablas ----------
  function adivinar(columnas, nombres) { return columnas.filter(function (c) { return nombres.indexOf(String(c).toLowerCase().trim()) >= 0; })[0] || ''; }
  function num(v) { return typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.')); }
  function columnasProbables(filas) {
    var cols = Object.keys(filas[0] || {});
    var r = {
      columnas: cols,
      wkt: adivinar(cols, ['wkt', 'geom', 'geometry', 'geometria', 'geometría', 'the_geom', 'shape']),
      x: adivinar(cols, ['lon', 'lng', 'long', 'longitud', 'longitude', 'x', 'coord_x', 'utm_x', 'este', 'easting']),
      y: adivinar(cols, ['lat', 'latitud', 'latitude', 'y', 'coord_y', 'utm_y', 'norte', 'northing'])
    };
    var f0 = filas[0] || {};
    var muestra = r.wkt ? parseFloat((String(f0[r.wkt]).replace(/^SRID=\d+;/i, '').match(/-?\d+(\.\d+)?/) || [])[0]) : num(f0[r.x]);
    r.utm = Math.abs(muestra) > 180;
    return r;
  }
  function filasAFC(filas, o) { // o: {modo:'xy'|'wkt', x, y, wkt, utm, huso}
    var malas = 0;
    var fs = filas.map(function (f) {
      var g = null;
      if (o.modo === 'xy') { var x = num(f[o.x]), y = num(f[o.y]); if (!isNaN(x) && !isNaN(y)) g = { type: 'Point', coordinates: [x, y] }; }
      else { try { g = leerWKT(f[o.wkt]); } catch (e) { g = null; } }
      if (g && o.utm) g = mapaCoords(g, function (c) { var r = aGeo(c[0], c[1], o.huso, 'N'); return [r.lon, r.lat]; });
      if (!g) malas++;
      var p = {}; for (var k in f) if (!(o.modo === 'wkt' && k === o.wkt)) p[k] = f[k];
      return { type: 'Feature', properties: p, geometry: g };
    });
    return { fc: { type: 'FeatureCollection', features: fs }, malas: malas };
  }
  function filasPlanas(fc) {
    return fc.features.map(function (f) {
      var r = {}; for (var k in (f.properties || {})) r[k] = f.properties[k];
      if (f.geometry && f.geometry.type === 'Point') { r.lon = f.geometry.coordinates[0]; r.lat = f.geometry.coordinates[1]; }
      r.wkt = aWKT(f.geometry); return r;
    });
  }

  // ---------- Lectura y escritura de archivos ----------
  function leerArchivo(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    var base = file.name.replace(/\.[^.]+$/, '');
    if (ext === 'geojson' || ext === 'json') return file.text().then(function (s) { return { base: base, fc: aFC(JSON.parse(s)) }; });
    if (ext === 'kml') return file.text().then(function (s) { return { base: base, fc: leerKML(s) }; });
    if (ext === 'gpx') return file.text().then(function (s) { return { base: base, fc: leerGPX(s) }; });
    if (ext === 'zip') return file.arrayBuffer().then(function (b) { return G.shp(b); }).then(function (g) { return { base: base, fc: aFC(g) }; });
    if (['csv', 'txt', 'xlsx', 'xls'].indexOf(ext) >= 0) {
      var p = (ext === 'xlsx' || ext === 'xls') ? file.arrayBuffer().then(function (b) { return G.XLSX.read(b); })
        : file.text().then(function (s) { return G.XLSX.read(s, { type: 'string', raw: true }); });
      return p.then(function (wb) {
        var filas = G.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
        if (!filas.length) throw new Error(t('err.tablavacia'));
        return { base: base, filas: filas };
      });
    }
    return Promise.reject(new Error(t('err.formato', { ext: ext })));
  }
  function exportar(fc, formato, base) {
    if (formato === 'geojson') return descargar(JSON.stringify(fc), base + '.geojson', 'application/geo+json');
    if (formato === 'kml') return descargar(aKML(fc, base), base + '.kml', 'application/vnd.google-earth.kml+xml');
    if (formato === 'csv') return descargar('﻿' + G.XLSX.utils.sheet_to_csv(G.XLSX.utils.json_to_sheet(filasPlanas(fc)), { FS: ';' }), base + '.csv', 'text/csv');
    if (formato === 'xlsx') { var wb = G.XLSX.utils.book_new(); G.XLSX.utils.book_append_sheet(wb, G.XLSX.utils.json_to_sheet(filasPlanas(fc)), 'datos'); return G.XLSX.writeFile(wb, base + '.xlsx'); }
    if (formato === 'shp') {
      var mixtas = 0;
      var fs = [];
      fc.features.forEach(function (x) {
        if (!x.geometry) return;
        if (x.geometry.type === 'GeometryCollection') { mixtas++; return; }
        if (x.geometry.type === 'MultiPoint') x.geometry.coordinates.forEach(function (c) { fs.push({ type: 'Feature', properties: x.properties, geometry: { type: 'Point', coordinates: c } }); });
        else fs.push(x);
      });
      return G.shpwrite.zip({ type: 'FeatureCollection', features: fs }, { outputType: 'blob', folder: base }).then(function (b) {
        descargar(b, base + '_shp.zip', 'application/zip'); return mixtas;
      });
    }
  }

  // ---------- Vista previa en Leaflet ----------
  function pintar(L, mapa, fc, estilo) {
    estilo = estilo || {};
    var color = estilo.color || function () { return '#C4372C'; };
    var capa = L.geoJSON(fc, {
      style: function (f) { return { color: color(f), weight: 3, fillOpacity: .15 }; },
      pointToLayer: function (f, ll) { return L.circleMarker(ll, { radius: estilo.radio ? estilo.radio(f) : 6, color: color(f), weight: 2, fillOpacity: .7 }); },
      onEachFeature: function (f, l) {
        var p = f.properties || {}, ks = Object.keys(p).slice(0, 12);
        if (ks.length) l.bindPopup(ks.map(function (k) { return '<b>' + esc(k) + '</b>: ' + esc(p[k]); }).join('<br>'));
      }
    }).addTo(mapa);
    try { mapa.fitBounds(capa.getBounds(), { maxZoom: 16, padding: [20, 20] }); } catch (e) {}
    return capa;
  }

  G.Geo = {
    aUtm: aUtm, aGeo: aGeo, distancia: distancia, longitud: longitud, areaAnillo: areaAnillo,
    esc: esc, descargar: descargar, aFC: aFC, mapaCoords: mapaCoords, resumen: resumen,
    leerWKT: leerWKT, aWKT: aWKT, leerKML: leerKML, leerGPX: leerGPX, aKML: aKML,
    columnasProbables: columnasProbables, filasAFC: filasAFC, filasPlanas: filasPlanas, num: num,
    leerArchivo: leerArchivo, exportar: exportar, pintar: pintar
  };
})(window);
