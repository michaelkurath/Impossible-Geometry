// Penrose tribar on an exact 60-degree lattice. See docs/artwork.md.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const h = Math.sqrt(3);
const point = (x, level) => [x, 40 + level * h];
const faces = [
  {fill: '#fff', points: [point(260,0), point(460,200), point(220,200), point(180,240), point(580,240), point(340,0)]},
  {fill: '#fff', points: [point(260,0), point(20,240), point(60,280), point(260,80), point(380,200), point(460,200)]},
  {fill: '#000', points: [point(260,80), point(300,120), point(180,240), point(580,240), point(540,280), point(60,280)]}
];
const n = value => Number(value.toFixed(3));
const points = polygon => polygon.map(p=>p.map(n).join(',')).join(' ');
// Intersect parallel hatch lines with the concave face. Explicit segments avoid
// global SVG pattern/clip IDs when the plugin occurs several times in a mashup.
function hatch(polygon, pitch=16) {
  const segments=[];
  const offsets=polygon.map(([x,y])=>x+y);
  for(let c=Math.ceil(Math.min(...offsets)/pitch)*pitch; c<Math.max(...offsets); c+=pitch){
    const intersections=[];
    for(let i=0;i<polygon.length;i++){
      const a=polygon[i],b=polygon[(i+1)%polygon.length];
      const av=a[0]+a[1],bv=b[0]+b[1];
      if((av<=c&&bv>c)||(bv<=c&&av>c)){
        const t=(c-av)/(bv-av);
        intersections.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);
      }
    }
    intersections.sort((a,b)=>a[0]-b[0]);
    for(let i=0;i+1<intersections.length;i+=2)segments.push(`M${intersections[i].map(n).join(' ')}L${intersections[i+1].map(n).join(' ')}`);
  }
  return segments.join(' ');
}
function triangle(label='Penrose triangle') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 18 600 530" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}">\n`
    +faces.map(f=>`<polygon points="${points(f.points)}" fill="${f.fill}"/>`).join('\n')
    +`\n<path d="${hatch(faces[1].points)}" fill="none" stroke="#000" stroke-width="2.5"/>\n`
    +faces.map(f=>`<polygon points="${points(f.points)}" fill="none" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`).join('\n')+'\n</svg>\n';
}
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'data/artworks.json'),'utf8'));
function wrap(body,label,viewBox='0 0 600 540') {return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}">${body}</svg>\n`;}
function polygon(p,fill) {return `<polygon points="${points(p)}" fill="${fill}" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;}
function impossibleCube(label) {
  // Front and rear square frames share four exact diagonal depth rails. The
  // rear-left upright crosses over the near top edge, while the near-right
  // upright hides the rear bottom edge: an impossible ordering of depth.
  const surface=(coords,hatched=false)=>polygon(coords,'#fff')+(hatched?`<path d="${hatch(coords,13)}" fill="none" stroke="#000" stroke-width="2"/>`:'');
  let body='<path d="M240 65H500V325H240Z M270 95V295H470V95Z" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="3"/>';
  const rearRight=[[470,65],[500,65],[500,325],[470,325]];
  body+=surface(rearRight,true);
  for(const [index,coords] of [
    [[103,176],[240,65],[270,65],[133,176]],
    [[327,176],[470,65],[500,65],[357,176]],
    [[103,424],[240,325],[270,325],[133,424]],
    [[327,424],[470,325],[500,325],[357,424]]
  ].entries())body+=surface(coords,index===1||index===3);
  body+='<path d="M100 170H360V430H100Z M130 200V400H330V200Z" fill="#000" fill-rule="evenodd"/>';
  body+='<rect x="240" y="65" width="30" height="260" fill="#000"/>';
  const leftFacet=[[270,65],[288,65],[288,325],[270,325]];
  body+=surface(leftFacet,true);
  return wrap(body,label,'55 20 490 450');
}

function trident(label) {
  // Public-domain Poiuyt construction by AnonMoos, simplified and reoriented.
  const ends=[60,140,220].map(y=>`<ellipse transform="translate(34 ${y}) rotate(66.219865)" rx="21.28008" ry="11.3" fill="#000"/>`).join('');
  const body=`<g transform="translate(45 95) rotate(-12 260 140)" stroke="#000" stroke-width="4" stroke-linejoin="round">${ends}<path d="M440 200V120H420V160Z" fill="#000"/><path fill="none" d="M40 240H500V80L480 40H28 M28 200H440V120H28 M440 200L420 160V120 M500 80H40 M420 160H40"/></g>`;
  return wrap(body,label,'20 35 565 360');
}
function cubes(label) {
  const r=76,a=r*Math.sqrt(3)/2;
  const centres=[[300,270],[300+2*a,270],[300-2*a,270],[300+a,270+1.5*r],[300-a,270+1.5*r],[300+a,270-1.5*r],[300-a,270-1.5*r]];
  let body='';
  for(const [x,y] of centres){
    const c=[x,y],top=[x,y-r],ne=[x+a,y-r/2],se=[x+a,y+r/2],bottom=[x,y+r],sw=[x-a,y+r/2],nw=[x-a,y-r/2];
    body+=polygon([c,nw,top,ne],'#fff');
    const shaded=[c,nw,sw,bottom];
    body+=polygon(shaded,'#fff')+`<path d="${hatch(shaded,14)}" stroke="#000" stroke-width="2.3" fill="none"/>`;
    body+=polygon([c,ne,se,bottom],'#000');
  }
  return wrap(body,label,'75 50 450 440');
}
const renderers={'penrose-triangle':triangle,'impossible-cube':impossibleCube,'impossible-trident':trident,'reversible-cubes':cubes};
function svg(id,label) {return renderers[id](label);}
function build(check=false){
  if(!catalogue.length||new Set(catalogue.map(x=>x.id)).size!==catalogue.length)throw Error('Empty or duplicate catalogue');
  for(const entry of catalogue)if(!renderers[entry.id])throw Error('Missing artwork '+entry.id);
  const write=(file,contents)=>{if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==contents)throw Error('Generated file out of date: '+file);}else fs.writeFileSync(file,contents);};
  const metadata=["{% assign artwork_id = selected_entry.id | default: 'penrose-triangle' %}","{% case artwork_id %}"];
  const art=['{% case artwork_id %}'];
  for(const [index,entry] of catalogue.entries()){
    const condition=index===0?'{% else %}':`{% when '${entry.id}' %}`;
    const block=[condition,`{% assign artwork_id = '${entry.id}' %}`,`{% assign artwork_number = '${String(index+1).padStart(2,'0')}' %}`,`{% assign artwork_title = '${entry.title}' %}`,`{% assign artwork_note = '${entry.note}' %}`,"{% if language == 'de' %}",`{% assign artwork_title = '${entry.title_de}' %}`,`{% assign artwork_note = '${entry.note_de}' %}`,'{% endif %}'].join('\n');
    if(index===0){metadata.fallback=block;art.fallback=condition+'\n'+svg(entry.id,'{{ artwork_title | escape }}');}
    else {metadata.push(block);art.push(condition+'\n'+svg(entry.id,'{{ artwork_title | escape }}'));}
    write(path.join(root,`assets/artwork/${entry.id}.svg`),svg(entry.id,entry.title));
  }
  metadata.push(metadata.fallback,'{% endcase %}');art.push(art.fallback,'{% endcase %}');
  const sharedPath=path.join(root,'src/shared.liquid');
  let shared=fs.readFileSync(sharedPath,'utf8');
  shared=shared.replace(/<!-- BEGIN GENERATED METADATA -->[\s\S]*?<!-- END GENERATED METADATA -->/,'<!-- BEGIN GENERATED METADATA -->\n'+metadata.join('\n')+'\n<!-- END GENERATED METADATA -->');
  shared=shared.replace(/<!-- BEGIN GENERATED ART -->[\s\S]*?<!-- END GENERATED ART -->/,'<!-- BEGIN GENERATED ART -->\n'+art.join('\n')+'<!-- END GENERATED ART -->');
  write(sharedPath,shared);
  const transformPath=path.join(root,'src/transform.js');
  const transform=fs.readFileSync(transformPath,'utf8').replace(/\/\/ BEGIN GENERATED CATALOGUE[\s\S]*?\/\/ END GENERATED CATALOGUE/,'// BEGIN GENERATED CATALOGUE\nconst CATALOGUE = '+JSON.stringify(catalogue,null,2)+';\n// END GENERATED CATALOGUE');
  write(transformPath,transform);
}
if(require.main===module)build(process.argv.includes('--check'));
module.exports={faces,hatch,svg,build,catalogue};
