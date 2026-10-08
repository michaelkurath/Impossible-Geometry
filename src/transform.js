// Self-contained catalogue; SVG artwork lives in shared.liquid.
const CATALOGUE = [
  { id: 'tribar', title: 'Closed Circuit', title_de: 'Geschlossener Kreis', kind: 'IMPOSSIBLE OBJECT', kind_de: 'UNMÖGLICHES OBJEKT', note: 'Each corner makes sense. Following all three makes the depth contradict itself.', note_de: 'Jede Ecke wirkt plausibel. Zusammen widersprechen sich die räumlichen Beziehungen.' },
  { id: 'square', title: 'Four Corners', title_de: 'Vier Ecken', kind: 'CYCLIC OVERLAP', kind_de: 'ZYKLISCHE ÜBERLAGERUNG', note: 'Trace the four beams: each one appears to pass above the next.', note_de: 'Folge den vier Balken: Jeder scheint über dem nächsten zu liegen.' },
  { id: 'cubes', title: 'Which Way Up?', title_de: 'Welche Seite ist oben?', kind: 'DEPTH REVERSAL', kind_de: 'UMKEHR DER TIEFE', note: 'Are these raised cubes or sunken corners? Let the depth switch.', note_de: 'Erhabene Würfel oder vertiefte Ecken? Lass die räumliche Wahrnehmung kippen.' },
  { id: 'weave', title: 'Over Under Over', title_de: 'Darüber, darunter', kind: 'CYCLIC OVERLAP', kind_de: 'ZYKLISCHE ÜBERLAGERUNG', note: 'Follow the crossings. The apparent front-to-back order runs in a loop.', note_de: 'Folge den Kreuzungen. Die scheinbare Reihenfolge von vorne nach hinten bildet einen Kreis.' },
  { id: 'tessellation', title: 'Positive / Negative', title_de: 'Positiv / Negativ', kind: 'FIGURE AND GROUND', kind_de: 'FIGUR UND HINTERGRUND', note: 'Choose the black shapes as figures, then choose the white ones.', note_de: 'Sieh zuerst die schwarzen Formen als Figuren, dann die weissen.' },
  { id: 'stairs', title: 'Double Ascent', title_de: 'Doppelter Aufstieg', kind: 'DEPTH REVERSAL', kind_de: 'UMKEHR DER TIEFE', note: 'The same edges can read as steps rising away or descending towards you.', note_de: 'Dieselben Kanten wirken wie Stufen, die nach hinten steigen oder nach vorne fallen.' }
];

function localDay(now, zone) {
  let date;
  try { date = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now); }
  catch { date = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now); }
  const parts = Object.fromEntries(date.map(p => [p.type, p.value]));
  return Math.floor(Date.UTC(Number(parts.year), Number(parts.month)-1, Number(parts.day)) / 86400000);
}

function select(input = {}, now = new Date(), random = Math.random) {
  const fields = input?.trmnl?.plugin_settings?.custom_fields_values || {};
  const mode = ['daily','random','fixed'].includes(fields.rotation) ? fields.rotation : 'daily';
  const language = fields.language === 'de' ? 'de' : 'en';
  let chosen, state = {};
  if (mode === 'random') {
    const ids = CATALOGUE.map(x => x.id);
    const previous = input?.trmnl?.state || {};
    let remaining = Array.isArray(previous.remaining) ? [...new Set(previous.remaining)].filter(id => ids.includes(id)) : [];
    if (!remaining.length) remaining = [...ids];
    // Avoid repeating the last artwork even across the boundary between cycles.
    const choices = remaining.length > 1 ? remaining.filter(id => id !== previous.last) : remaining;
    const value = Number(random());
    const bounded = Number.isFinite(value) ? Math.min(Math.max(value,0),0.999999999) : 0;
    const id = choices[Math.floor(bounded * choices.length)];
    chosen = CATALOGUE.find(x => x.id === id);
    state = { remaining: remaining.filter(x => x !== id), last: id };
  } else if (mode === 'fixed') {
    chosen = CATALOGUE.find(x => x.id === fields.artwork) || CATALOGUE[0];
  } else {
    const day = localDay(now, fields.time_zone || input?.trmnl?.user?.time_zone || 'UTC');
    const epoch = Math.floor(Date.UTC(2026,9,8)/86400000);
    const index = ((day - epoch) % CATALOGUE.length + CATALOGUE.length) % CATALOGUE.length;
    chosen = CATALOGUE[index];
  }
  const entry = { id: chosen.id, title: language === 'de' ? chosen.title_de : chosen.title,
    kind: language === 'de' ? chosen.kind_de : chosen.kind, note: language === 'de' ? chosen.note_de : chosen.note,
    number: String(CATALOGUE.indexOf(chosen)+1).padStart(2,'0'), total: CATALOGUE.length };
  return { selected_entry: entry, trmnl_state: state };
}

function run(input) { return select(input && typeof input === 'object' ? input : {}); }
if (typeof module !== 'undefined') module.exports = { CATALOGUE, localDay, select, run };
