/* Minitools GIS · idiomas (español / inglés)
   - Textos fijos: atributo data-i18n (texto), data-i18n-html (con etiquetas) o data-i18n-attr="atributo:clave".
     El español se toma del propio HTML; aquí solo hace falta la traducción.
   - Textos generados por los scripts: t('clave', {variables}). */
(function (G) {
  'use strict';
  var ES = {
    'h.coord': 'Conversor de coordenadas', 'h.formatos': 'Conversor de formatos',
    'h.duplicados': 'Buscador de duplicados', 'h.medir': 'Medir distancias y superficies',
    'car.etiqueta': 'Herramientas', 'car.anterior': 'Anterior', 'car.siguiente': 'Siguiente',
    'geom.punto': 'punto', 'geom.punto.pl': 'puntos', 'geom.multipunto': 'multipunto', 'geom.multipunto.pl': 'multipuntos',
    'geom.linea': 'línea', 'geom.linea.pl': 'líneas', 'geom.multilinea': 'multilínea', 'geom.multilinea.pl': 'multilíneas',
    'geom.poligono': 'polígono', 'geom.poligono.pl': 'polígonos', 'geom.multipoligono': 'multipolígono', 'geom.multipoligono.pl': 'multipolígonos',
    'geom.mixta': 'geometría mixta', 'geom.mixta.pl': 'geometrías mixtas', 'geom.singeom': 'sin geometría', 'geom.singeom.pl': 'sin geometría',
    'res.elementos': '{n} elementos', 'res.campos': 'Campos', 'res.ninguno': 'ninguno',
    'err.tablavacia': 'la tabla está vacía', 'err.formato': 'el formato .{ext} no está admitido',
    'err.leer': 'No se ha podido leer el archivo: {msg}. Comprueba que el formato es uno de los admitidos.',
    'kml.elemento': 'Elemento',
    'lec.huso': 'Huso', 'lec.lat': 'Lat', 'lec.lon': 'Lon', 'lec.e': 'E', 'lec.o': 'O',
    'co.huso': 'Huso', 'co.lat': 'Latitud', 'co.lon': 'Longitud',
    'co.err.geo': 'Revisa los valores: la latitud debe estar entre -80 y 84 y la longitud entre -180 y 180.',
    'co.err.utm': 'Revisa los valores: X e Y deben ser números y el huso, un número del 1 al 60.',
    'fo.leyendo': 'Leyendo {nombre}…', 'fo.malas': '{n} filas no tienen coordenadas válidas y se han dejado sin geometría.',
    'fo.mixtas': 'Aviso: {n} geometrías mixtas no caben en un Shapefile y no se han incluido.',
    'fo.elige.xy': 'Elige las columnas X e Y y pulsa Aplicar columnas.', 'fo.elige.wkt': 'Elige la columna WKT y pulsa Aplicar columnas.',
    'fo.err.export': 'No se ha podido generar el archivo: {msg}',
    'du.falta.campo': 'Elige el campo que quieres comparar.',
    'du.res': 'Hay {rep} {erep} en {g} {grp}. Sin ellos quedan {k} de {n} elementos.',
    'du.erep': 'elementos repetidos', 'du.erep1': 'elemento repetido', 'du.grp': 'grupos', 'du.grp1': 'grupo',
    'du.sin': 'No hay duplicados con este criterio entre los {n} elementos.',
    'du.singeom': '{n} elementos no tienen geometría y no se han comparado.',
    'du.grupo': 'Grupo', 'du.elementos': 'Elementos', 'du.ref': 'Referencia',
    'du.mas': 'Hay {n} grupos más. Descarga el informe para verlos todos.',
    'du.col.grupo': 'grupo_duplicado', 'du.col.n': 'n_en_grupo', 'du.col.estado': 'estado',
    'du.est.unico': 'único', 'du.est.original': 'original', 'du.est.repetido': 'repetido', 'du.hoja': 'duplicados',
    'me.instr.dist': 'Haz clic en el mapa para marcar cada punto del recorrido.',
    'me.instr.sup': 'Haz clic en el mapa para marcar los vértices de la zona. El polígono se cierra solo.',
    'me.vacio': 'Marca al menos dos puntos para medir una distancia.', 'me.vacio.sup': 'Marca al menos tres puntos para medir una superficie.',
    'me.total': 'Distancia total', 'me.tramo': 'Tramo {i}', 'me.sup': 'Superficie', 'me.perim': 'Perímetro'
  };
  var EN = {
    // dinámicos
    'h.coord': 'Coordinate converter', 'h.formatos': 'Format converter',
    'h.duplicados': 'Duplicate finder', 'h.medir': 'Measure distances and areas',
    'car.etiqueta': 'Tools', 'car.anterior': 'Previous', 'car.siguiente': 'Next',
    'geom.punto': 'point', 'geom.punto.pl': 'points', 'geom.multipunto': 'multipoint', 'geom.multipunto.pl': 'multipoints',
    'geom.linea': 'line', 'geom.linea.pl': 'lines', 'geom.multilinea': 'multiline', 'geom.multilinea.pl': 'multilines',
    'geom.poligono': 'polygon', 'geom.poligono.pl': 'polygons', 'geom.multipoligono': 'multipolygon', 'geom.multipoligono.pl': 'multipolygons',
    'geom.mixta': 'mixed geometry', 'geom.mixta.pl': 'mixed geometries', 'geom.singeom': 'without geometry', 'geom.singeom.pl': 'without geometry',
    'res.elementos': '{n} features', 'res.campos': 'Fields', 'res.ninguno': 'none',
    'err.tablavacia': 'the table is empty', 'err.formato': 'the .{ext} format is not supported',
    'err.leer': 'The file could not be read: {msg}. Check that it is one of the supported formats.',
    'kml.elemento': 'Feature',
    'lec.huso': 'Zone', 'lec.lat': 'Lat', 'lec.lon': 'Lon', 'lec.e': 'E', 'lec.o': 'W',
    'co.huso': 'Zone', 'co.lat': 'Latitude', 'co.lon': 'Longitude',
    'co.err.geo': 'Check the values: latitude must be between -80 and 84 and longitude between -180 and 180.',
    'co.err.utm': 'Check the values: X and Y must be numbers and the zone a number from 1 to 60.',
    'fo.leyendo': 'Reading {nombre}…', 'fo.malas': '{n} rows have no valid coordinates and were left without geometry.',
    'fo.mixtas': 'Note: {n} mixed geometries do not fit in a Shapefile and were left out.',
    'fo.elige.xy': 'Choose the X and Y columns and press Apply columns.', 'fo.elige.wkt': 'Choose the WKT column and press Apply columns.',
    'fo.err.export': 'The file could not be created: {msg}',
    'du.falta.campo': 'Choose the field you want to compare.',
    'du.res': '{rep} {erep} in {g} {grp}. Without them, {k} of {n} features remain.',
    'du.erep': 'features are repeated', 'du.erep1': 'feature is repeated', 'du.grp': 'groups', 'du.grp1': 'group',
    'du.sin': 'No duplicates with this criterion among the {n} features.',
    'du.singeom': '{n} features have no geometry and were not compared.',
    'du.grupo': 'Group', 'du.elementos': 'Features', 'du.ref': 'Reference',
    'du.mas': 'There are {n} more groups. Download the report to see them all.',
    'du.col.grupo': 'duplicate_group', 'du.col.n': 'n_in_group', 'du.col.estado': 'status',
    'du.est.unico': 'unique', 'du.est.original': 'original', 'du.est.repetido': 'repeated', 'du.hoja': 'duplicates',
    'me.instr.dist': 'Click on the map to mark each point of the route.',
    'me.instr.sup': 'Click on the map to mark the corners of the area. The polygon closes by itself.',
    'me.vacio': 'Mark at least two points to measure a distance.', 'me.vacio.sup': 'Mark at least three points to measure an area.',
    'me.total': 'Total distance', 'me.tramo': 'Segment {i}', 'me.sup': 'Area', 'me.perim': 'Perimeter',
    // comunes
    'pie.local': 'Files are processed in your browser and never uploaded to a server.',
    'pie.osm': 'Base maps: © OpenStreetMap contributors', 'mapa': 'Map',
    // portada
    'po.titulo': 'Minitools GIS · Free GIS tools in your browser',
    'po.desc': 'Free GIS tools that run in your browser: UTM coordinate converter, format converter, duplicate finder and distance and area measurement. Nothing to install and your data stays with you.',
    'po.lema': 'Mapping tools for everyday work. They run in your browser: nothing to install, and your files never leave your computer.',
    'po.lectura': 'Move the cursor over the relief to see its coordinates.',
    'po.herr': 'Tools', 'po.herr.intro': 'Pick the one you need. They are all free and need no sign-up.', 'po.abrir': 'Open',
    'po.coord': 'Convert WGS84 or ETRS89 geographic coordinates to UTM and back. Click the map to get the coordinates of any point.',
    'po.formatos': 'Convert between KML, GeoJSON, GPX, Shapefile, CSV and Excel. Reads WKT columns and UTM coordinates, and shows the result on the map.',
    'po.duplicados': 'Find points closer than a given distance, identical geometries or repeated values in a field, and download the data without them.',
    'po.medir': 'Click on the map to measure routes, perimeters and areas in metres, kilometres or hectares.',
    'po.catastro': 'Bulk cadastre lookup', 'po.catastro.p': 'Spanish Cadastre data from a list of cadastral references or coordinates.',
    'po.preparacion': 'Coming soon',
    'po.n1': 'Your data stays with you', 'po.n1.p': 'Files are processed in your browser. Nothing is uploaded to a server, so you can work with client or project data safely.',
    'po.n2': 'Built for Spain', 'po.n2.p': 'ETRS89, UTM zones 28 to 31 and the formats used every day in surveying, engineering and networks.',
    'po.n3': 'Free, no sign-up', 'po.n3.p': 'Open the tool and use it, without creating an account or leaving your email.',
    // carga de archivos
    'ca.tit': '1. Load your file', 'ca.ayuda': 'The file is read in your browser and is not uploaded anywhere.',
    'ca.soltar': '<strong>Drop your file here</strong> or click to choose it',
    'ca.tipos': 'GeoJSON, KML, GPX, CSV, Excel or a zipped Shapefile', 'ca.vacio': 'You have not loaded a file yet.',
    'ca.col.tit': 'Tell us where the coordinates are', 'ca.col.ayuda': 'We suggested the columns that look like coordinates. Change them if they are wrong.',
    'ca.modo': 'The coordinates are in', 'ca.modo.xy': 'Two columns, X and Y', 'ca.modo.wkt': 'One WKT column',
    'ca.colx': 'X or longitude column', 'ca.coly': 'Y or latitude column', 'ca.colwkt': 'WKT column',
    'ca.crs': 'Coordinate system', 'ca.crs.geo': 'Geographic WGS84 or ETRS89', 'ca.crs.utm': 'UTM ETRS89 or WGS84',
    'ca.huso': 'UTM zone (north)', 'ca.aplicar': 'Apply columns',
    // coordenadas
    'co.titulo': 'WGS84 and ETRS89 to UTM coordinate converter online | Minitools GIS',
    'co.desc': 'Convert WGS84 or ETRS89 geographic coordinates to UTM and back, free and in your browser. Click the map to get the coordinates of any point.',
    'co.sub': 'Geographic WGS84 or ETRS89 to UTM, and UTM back to geographic.',
    'co.a.tit': 'Geographic to UTM', 'co.a.ayuda': 'In decimal degrees. West of Greenwich, longitude is negative.', 'co.a.boton': 'Convert to UTM',
    'co.b.tit': 'UTM to geographic', 'co.b.ayuda': 'In mainland Spain the zone is 29, 30 or 31; in the Canary Islands, 28.',
    'co.x': 'X (easting), in metres', 'co.y': 'Y (northing), in metres', 'co.hem': 'Hemisphere', 'co.norte': 'North', 'co.sur': 'South',
    'co.b.boton': 'Convert to geographic', 'co.nota': 'Click the map to fill both forms with the coordinates of that point.',
    'co.pie': 'Computed on the WGS84 ellipsoid. The difference from ETRS89 (GRS80) is under a millimetre.',
    // formatos
    'fo.titulo': 'Online GIS format converter: KML, GeoJSON, Shapefile, CSV and Excel | Minitools GIS',
    'fo.desc': 'Convert between KML, GeoJSON, GPX, Shapefile, CSV and Excel for free in your browser. Supports WKT columns and UTM coordinates. Your files never leave your computer.',
    'fo.sub': 'KML, GeoJSON, GPX, Shapefile, CSV and Excel, in any direction.',
    'fo.desc.tit': '2. Download it in another format', 'fo.desc.ayuda': 'Output is always in WGS84 (EPSG:4326).',
    'fo.csv': 'CSV with WKT', 'fo.mapa': 'File preview', 'fo.nota': 'Click a feature on the map to see its attributes.',
    // duplicados
    'du.titulo': 'Online GIS duplicate finder: repeated points and geometries | Minitools GIS',
    'du.desc': 'Find repeated features in your GIS layers: points closer than a distance, identical geometries or repeated values in a field. Download the clean data.',
    'du.sub': 'Find repeated points, geometries or values and download the clean data.',
    'du.crit.tit': '2. Choose what counts as a duplicate', 'du.crit.ayuda': 'A feature is repeated when it matches an earlier one by this criterion.',
    'du.criterio': 'Criterion', 'du.c.pos': 'Same location', 'du.c.attr': 'Same value in a field', 'du.c.ambos': 'Same location and same value',
    'du.tol': 'Tolerance, in metres', 'du.campo': 'Field', 'du.norm': 'Ignore case, accents and spaces when comparing text',
    'du.buscar': 'Find duplicates', 'du.espera': 'Load a file to start.',
    'du.desc.tit': '3. Download the result', 'du.desc.ayuda': 'The clean data keeps the first feature of each group. The report lists every feature with its group.',
    'du.formato': 'Format', 'du.bajar.limpio': 'Download without duplicates', 'du.bajar.informe': 'Download report (Excel)',
    'du.mapa': 'Duplicates map', 'du.ley.rep': 'Repeated', 'du.ley.uni': 'Unique',
    // medir
    'me.titulo': 'Measure distances and areas on the map online | Minitools GIS',
    'me.desc': 'Measure distances and areas by clicking on the map. Results in metres, kilometres, hectares and square kilometres, with GeoJSON or KML download.',
    'me.sub': 'Click on the map to measure lengths, perimeters and areas.',
    'me.que': 'What do you want to measure?', 'me.tipo': 'Measurement type', 'me.dist': 'Distance', 'me.sup.b': 'Area',
    'me.deshacer': 'Undo last point', 'me.borrar': 'Start again',
    'me.bajar.tit': 'Download the measurement', 'me.bajar.ayuda': 'The geometry is saved with its length or area as an attribute.',
    'me.mapa': 'Measurement map', 'me.nota': 'Zoom to the area and click on each corner. The measurement updates as you move the mouse.',
    'me.pie': 'Geodesic measurements on the Earth sphere. The error is below 0.5%.'
  };
  var DIC = { es: ES, en: EN };
  var lang = 'es';
  try { lang = localStorage.getItem('idioma') || ''; } catch (e) { lang = ''; }
  if (lang !== 'es' && lang !== 'en') lang = /^es\b/i.test(navigator.language || 'es') ? 'es' : 'en';

  function t(k, v) {
    var s = (DIC[lang] && DIC[lang][k]) || ES[k] || k;
    if (v) for (var n in v) s = s.split('{' + n + '}').join(v[n]);
    return s;
  }
  function aplicar() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.es == null) el.dataset.es = el.textContent;
      el.textContent = lang === 'es' ? el.dataset.es : (EN[el.dataset.i18n] || el.dataset.es);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      if (el.dataset.es == null) el.dataset.es = el.innerHTML;
      el.innerHTML = lang === 'es' ? el.dataset.es : (EN[el.dataset.i18nHtml] || el.dataset.es);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (par) {
        var p = par.split(':'), at = p[0], k = p[1], guard = 'es' + at.replace(/[^a-z]/gi, '');
        if (el.dataset[guard] == null) el.dataset[guard] = el.getAttribute(at) || '';
        el.setAttribute(at, lang === 'es' ? el.dataset[guard] : (EN[k] || el.dataset[guard]));
      });
    });
    document.querySelectorAll('.idioma button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }
  function cambiar(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem('idioma', l); } catch (e) {}
    aplicar();
    document.dispatchEvent(new CustomEvent('idioma', { detail: l }));
  }
  G.t = t;
  G.idioma = function () { return lang; };
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.idioma button[data-lang]');
    if (b) cambiar(b.dataset.lang);
  });
  aplicar();
})(window);
