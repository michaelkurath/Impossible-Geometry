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
function svg(label='Penrose triangle') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 18 600 530" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${label}">\n`
    +faces.map(f=>`<polygon points="${points(f.points)}" fill="${f.fill}"/>`).join('\n')
    +`\n<path d="${hatch(faces[1].points)}" fill="none" stroke="#000" stroke-width="2.5"/>\n`
    +faces.map(f=>`<polygon points="${points(f.points)}" fill="none" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`).join('\n')+'\n</svg>\n';
}
function build(check=false){
  const asset=svg();
  const sharedPath=path.join(root,'src/shared.liquid');
  const before=fs.readFileSync(sharedPath,'utf8');
  const after=before.replace(/<!-- BEGIN GENERATED ART -->[\s\S]*?<!-- END GENERATED ART -->/,`<!-- BEGIN GENERATED ART -->\n${svg('{{ artwork_title | escape }}')}<!-- END GENERATED ART -->`);
  if(before===after && !before.includes('BEGIN GENERATED ART'))throw Error('Missing SVG markers');
  const target=path.join(root,'assets/artwork/penrose-triangle.svg');
  if(check){
    if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==asset||before!==after)throw Error('Generated artwork is out of date. Run npm run build:art');
  } else { fs.writeFileSync(target,asset);fs.writeFileSync(sharedPath,after); }
}
if(require.main===module)build(process.argv.includes('--check'));
module.exports={faces,hatch,svg,build};
