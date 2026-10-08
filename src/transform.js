// BEGIN GENERATED CATALOGUE
const CATALOGUE = [
  {
    "id": "penrose-triangle",
    "title": "Penrose Triangle",
    "title_de": "Penrose-Dreieck",
    "note": "Three plausible corners. One impossible loop.",
    "note_de": "Drei plausible Ecken. Eine unmögliche Schleife.",
    "kind": "impossible object"
  },
  {
    "id": "impossible-cube",
    "title": "Impossible Cube",
    "title_de": "Unmöglicher Würfel",
    "note": "Follow the upright: a rear edge passes in front of the front face.",
    "note_de": "Folge der senkrechten Kante: Hinten wird plötzlich vorne.",
    "kind": "impossible object"
  },
  {
    "id": "impossible-trident",
    "title": "Impossible Trident",
    "title_de": "Unmöglicher Dreizack",
    "note": "Three round prongs become two square arms.",
    "note_de": "Drei runde Zinken werden zu zwei eckigen Armen.",
    "kind": "impossible object"
  },
  {
    "id": "reversible-cubes",
    "title": "Reversible Cubes",
    "title_de": "Kippende Würfel",
    "note": "Raised blocks or recessed corners? Let the depth reverse.",
    "note_de": "Würfel oder Vertiefungen? Lass die räumliche Wahrnehmung kippen.",
    "kind": "depth reversal"
  },
  {
    "id": "kanizsa-triangle",
    "title": "Kanizsa Triangle",
    "title_de": "Kanizsa-Dreieck",
    "note": "The bright triangle has no drawn edges. Your eye supplies them.",
    "note_de": "Die helle Dreiecksfläche hat keine gezeichneten Kanten. Das Auge ergänzt sie.",
    "kind": "illusory contour"
  },
  {
    "id": "necker-cube",
    "title": "Necker Cube",
    "title_de": "Necker-Würfel",
    "note": "Which square is in front? The wireframe flips as you look.",
    "note_de": "Welches Quadrat liegt vorne? Das Drahtbild kippt beim Betrachten.",
    "kind": "depth reversal"
  },
  {
    "id": "reversible-steps",
    "title": "Reversible Steps",
    "title_de": "Kippende Stufen",
    "note": "The same edges can rise toward you or recede into the page.",
    "note_de": "Dieselben Kanten können auf dich zu steigen oder in die Fläche zurückfallen.",
    "kind": "depth reversal"
  }
];
// END GENERATED CATALOGUE
const normalize = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
function localDay(now, zone) {
  let parts;
  try { parts = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year:'numeric',month:'2-digit',day:'2-digit' }).formatToParts(now); }
  catch { parts = new Intl.DateTimeFormat('en-CA', { timeZone:'UTC',year:'numeric',month:'2-digit',day:'2-digit' }).formatToParts(now); }
  const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
  return Math.floor(Date.UTC(+p.year,+p.month-1,+p.day)/86400000);
}
function select(input={}, now=new Date()) {
  const fields=input?.trmnl?.plugin_settings?.custom_fields_values || {};
  let mode=normalize(fields.rotation);
  if(mode==='random')mode='hourly'; // Migrate the old refresh-random setting.
  if(!['fixed','hourly','daily'].includes(mode))mode='daily';
  const validDate=now instanceof Date && Number.isFinite(now.getTime()) ? now : new Date('2026-10-08T12:00:00Z');
  const dayEpoch=Date.UTC(2026,9,8)/86400000;
  const bucket=mode==='hourly' ? Math.floor(validDate.getTime()/3600000)-dayEpoch*24 : localDay(validDate,fields.time_zone||input?.trmnl?.user?.time_zone||'Europe/Zurich')-dayEpoch;
  const index=((bucket%CATALOGUE.length)+CATALOGUE.length)%CATALOGUE.length;
  const chosen=mode==='fixed' ? CATALOGUE.find(x=>x.id===normalize(fields.artwork))||CATALOGUE[0] : CATALOGUE[index];
  const de=normalize(fields.language)==='de';
  return {selected_entry:{id:chosen.id,title:de?chosen.title_de:chosen.title,note:de?chosen.note_de:chosen.note,number:String(CATALOGUE.indexOf(chosen)+1).padStart(2,'0'),total:CATALOGUE.length}};
}
function run(input) {return select(input);}
if(typeof module!=='undefined')module.exports={run,select,localDay,CATALOGUE};
