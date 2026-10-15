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
function hatch(polygon, pitch=16, direction=1) {
  const segments=[];
  const offsets=polygon.map(([x,y])=>x+direction*y);
  for(let c=Math.ceil(Math.min(...offsets)/pitch)*pitch; c<Math.max(...offsets); c+=pitch){
    const intersections=[];
    for(let i=0;i<polygon.length;i++){
      const a=polygon[i],b=polygon[(i+1)%polygon.length];
      const av=a[0]+direction*a[1],bv=b[0]+direction*b[1];
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
// Artwork coordinates are kept in a small, display-independent plane.
const cubeRegions={
  front:[
    [[3,43],[74,60],[74,33],[87,27],[87,12],[174,32],[154,43],[151,43],[87,27],[87,129],[172,149],[174,151],[155,160],[149,160],[117,152],[117,204],[4,177]],
    [[17,62],[17,164],[104,185],[104,148],[87,145],[87,129],[74,126],[74,76]],
    [[175,58],[188,52],[188,153],[175,150]],
    [[97,65],[117,70],[117,129],[104,126],[104,83],[97,81]],
  ],
  side:[
    [[118,70],[197,32],[197,164],[120,203],[118,203],[118,152],[127,154],[127,184],[189,153],[189,94],[188,52],[185,52],[127,81],[127,131],[119,130]],
    [[87,28],[96,30],[96,124],[89,128],[87,119]],
    [[17,63],[25,64],[25,160],[19,163],[17,163]],
    [[28,159],[87,130],[87,145],[49,164]],
    [[27,41],[86,12],[87,27],[49,46]],
  ],
  top:[
    [[4,42],[82,3],[197,30],[118,70],[97,65],[97,58],[115,62],[160,39],[174,32],[159,28],[86,11],[26,41],[73,52],[74,59],[18,47]],
    [[88,128],[98,124],[125,132],[174,142],[175,150],[188,154],[130,183],[127,183],[127,173],[174,150],[89,130]],
    [[18,163],[24,160],[30,160],[103,177],[104,185],[19,165]],
    [[26,149],[72,126],[86,129],[28,159],[26,159]],
  ],
};
// Shared junctions use one coordinate, avoiding tiny gaps and dark slivers.
const cubeJunctions=[
  [[4,42],[[3,43]]],[[74,59],[[74,60]]],[[86,11],[[86,12],[87,12]]],
  [[87,27],[[87,28]]],[[197,30],[[197,32]]],[[118,70],[[117,70]]],
  [[118,203],[[117,204],[120,203]]],[[17,163],[[17,164],[18,163],[19,163]]],
  [[104,185],[[103,185]]],[[175,150],[[174,151],[175,150],[174,150]]],
];
for(const regions of Object.values(cubeRegions))for(const face of regions)for(let i=0;i<face.length;i++){
  const match=cubeJunctions.find(([,aliases])=>aliases.some(p=>p[0]===face[i][0]&&p[1]===face[i][1]));
  if(match)face[i]=match[0];
}
function impossibleCube(label) {
  // Face boundaries follow one consistent three-beam junction. The diagonal
  // rail terminates at the left side of the recessed rear upright.
  const fill=(p,color)=>`<polygon points="${points(p)}" fill="${color}" stroke="#000" stroke-width="1.1" stroke-linejoin="round"/>`;
  const shaded=p=>fill(p,'#fff')+`<path d="${hatch(p,5)}" fill="none" stroke="#000" stroke-width="0.7"/>`;
  const [front,hole,...islands]=cubeRegions.front;
  let body=shaded(front)+fill(hole,'#fff');
  body+=islands.map(shaded).join('');
  body+=cubeRegions.side.map(p=>fill(p,'#000')).join('');
  body+=cubeRegions.top.map(p=>fill(p,'#fff')).join('');
  return wrap(body,label,'-13 -10 226 230');
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
function kanizsaTriangle(label) {
  const pacman=(cx,cy,direction,r=90)=>{
    const start=(direction+30)*Math.PI/180,end=(direction-30)*Math.PI/180;
    const at=a=>[n(cx+r*Math.cos(a)),n(cy+r*Math.sin(a))];
    return `<path d="M${cx} ${cy}L${at(start).join(' ')}A${r} ${r} 0 1 1 ${at(end).join(' ')}Z" fill="#000"/>`;
  };
  const body=pacman(300,90,90)+pacman(100,90+200*Math.sqrt(3),-30)+pacman(500,90+200*Math.sqrt(3),210);
  return wrap(body,label,'0 -10 600 550');
}
function neckerCube(label) {
  const f=[[90,155],[350,155],[350,415],[90,415]],rear=f.map(([x,y])=>[x+150,y-105]);
  const line=(a,b)=>`<path d="M${a.join(' ')}L${b.join(' ')}"/>`;
  let body='<g fill="none" stroke="#000" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">';
  body+=`<polygon points="${points(f)}"/><polygon points="${points(rear)}"/>`;
  for(let i=0;i<4;i++)body+=line(f[i],rear[i]);
  body+='</g>';
  return wrap(body,label,'50 20 510 445');
}
function reversibleSteps(label) {
  // Schroeder staircase: two equal zigzags joined by parallel depth edges.
  // Equal shading of the flanking walls allows either depth interpretation.
  const edge=[[80,80]];
  for(let i=0;i<5;i++){edge.push([80+60*(i+1),80+60*i]);edge.push([80+60*(i+1),80+60*(i+1)]);}
  const back=edge.map(([x,y])=>[x+100,y-55]);
  let body=shadedPolygon([...edge,[380,445],[80,445]],18,1.5);
  body+=shadedPolygon([...back,[480,25]],18,1.5);
  for(let i=0;i<edge.length-1;i++)body+=polygon([edge[i],edge[i+1],back[i+1],back[i]],'#fff');
  return wrap(body,label,'45 0 470 475');
}
function shadedPolygon(p, pitch=14, width=2, direction=1) {
  return polygon(p,'#fff')+`<path d="${hatch(p,pitch,direction)}" fill="none" stroke="#000" stroke-width="${width}"/>`;
}
function impossibleSquare(label) {
  // Sharp four-bar: the continuous front band changes depth at the inner
  // corners. All corner coordinates share three nested square boundaries.
  const front=[[60,100],[100,60],[100,400],[360,400],[360,160],[420,100],[420,460],[60,460]];
  const light=[[100,60],[460,60],[460,420],[420,460],[420,100],[160,100],[160,340],[100,400]];
  const upper=[[160,100],[420,100],[360,160],[160,160]];
  const lower=[[100,400],[160,340],[360,340],[360,400]];
  return wrap(shadedPolygon(front)+polygon(light,'#fff')+polygon(upper,'#000')+polygon(lower,'#fff'),label,'25 25 470 470');
}

// Conventional Penrose staircase topology, adapted from Philip Ronan /
// Sakurambo's public-domain Impossible staircase.svg. Coordinates use exact
// shared endpoints; the slight differences in the reference are regularized.
function penroseStaircase(label) {
  const a=37,b=18;
  const diamond=(x,y)=>[[x,y],[x+a,y-b],[x+2*a,y],[x+a,y+b]];
  const leftWall=[[20,159],[20,86],[57,104],[57,96],[94,114],[94,106],[131,124],[131,116],[168,134],[168,126],[205,144],[205,136],[242,154],[242,266]];
  const rightWall=[[353,86],[316,104],[316,111],[279,129],[279,136],[242,154],[242,266],[353,212]];
  const innerLeft=[[279,36],[242,54],[242,46],[205,64],[205,56],[168,74],[168,66],[131,84],[131,76],[94,94],[94,171],[242,171],[242,66],[279,48]];
  const innerRight=[[316,104],[279,86],[279,79],[242,61],[242,171],[279,171],[279,96],[316,114]];
  let body='';
  body+=polygon(diamond(205,36),'#fff');
  for(let i=0;i<5;i++)body+=polygon(diamond(20+i*a,86-i*10),'#fff');
  body+=polygon(innerLeft,'#000');
  body+=polygon(diamond(242,61),'#fff');
  body+=polygon([[279,79],[316,61],[316,68],[279,86]],'#000');
  body+=shadedPolygon(innerRight,10,1.5);
  for(let i=0;i<5;i++)body+=polygon(diamond(57+i*a,96+i*10),'#fff');
  body+=polygon(diamond(242,111),'#fff');
  body+=polygon(diamond(279,86),'#fff');
  body+=polygon(rightWall,'#000');
  body+=shadedPolygon(leftWall,12,1.6);
  body+=shadedPolygon([[242,111],[279,129],[279,136],[242,118]],10,1.5);
  return wrap(body,label,'0 0 375 285');
}

function impossibleColonnade(label) {
  // A regular six-pillar frame with one contradictory crossing. The middle
  // rear pillar passes in front of the upper near rail, but terminates on
  // the rear lower rail. Each joint is drawn as an ordinary square beam.
  const project=([x,y,z])=>[160+47.5*x-50*y,430-12.5*x-12.5*y-50*z];
  const box=([x,y,z],[dx,dy,dz])=>{
    const p=(a,b,c)=>project([a,b,c]);
    const top=[p(x,y,z+dz),p(x+dx,y,z+dz),p(x+dx,y+dy,z+dz),p(x,y+dy,z+dz)];
    const front=[p(x,y,z),p(x+dx,y,z),p(x+dx,y,z+dz),p(x,y,z+dz)];
    const side=[p(x,y,z),p(x,y+dy,z),p(x,y+dy,z+dz),p(x,y,z+dz)];
    return shadedPolygon(front,12,1.6)+polygon(side,'#000')+polygon(top,'#fff');
  };
  const w=.4;
  const long=(y,z)=>box([0,y,z],[8+w,w,.32]);
  const short=(x,z)=>box([x,0,z],[w,2+w,.32]);
  const post=(x,y)=>box([x,y,0],[w,w,5]);
  let body=long(2,-.32)+short(8,-.32)+short(0,-.32);
  body+=post(8,2)+post(0,2);
  body+=long(2,5)+short(8,5)+short(0,5);
  body+=long(0,-.32)+post(8,0)+post(4,0)+post(0,0);
  body+=long(0,5);
  // Deliberate depth reversal, not a disconnected or floating beam.
  body+=post(4,2);
  body+=long(2,5);
  return wrap(body,label,'15 15 560 455');
}
// Four beams with reversed attachment order at the two uprights. Shared
// endpoints preserve ordinary joints; the rail ends exchange front/rear depth.
function impossibleJoinery(label) {
  const leftFront=[[80,130],[112,148],[112,438],[80,420]];
  const leftSide=[[112,148],[146,128],[146,418],[112,438]];
  const leftTop=[[80,130],[114,110],[146,128],[112,148]];
  const rightFront=[[446,116],[478,134],[478,424],[446,406]];
  const rightSide=[[478,134],[512,114],[512,404],[478,424]];
  const rightTop=[[446,116],[480,96],[512,114],[478,134]];
  // One rail slopes up, the other down. Their depth attachments reverse at
  // the far upright, rather than forming an ordinary crossed-brace frame.
  const risingFront=[[80,392],[80,368],[478,138],[478,162]];
  const risingTop=[[80,368],[114,348],[512,118],[478,138]];
  const fallingFront=[[112,172],[112,196],[478,408],[478,384]];
  const fallingTop=[[112,172],[146,152],[512,364],[478,384]];
  let body=shadedPolygon(rightFront)+polygon(rightSide,'#000')+polygon(rightTop,'#fff');
  body+=shadedPolygon(risingFront,14,2,-1)+polygon(risingTop,'#fff')+polygon([[478,138],[512,118],[512,142],[478,162]],'#000');
  body+=shadedPolygon(leftFront)+polygon(leftSide,'#000')+polygon(leftTop,'#fff');
  body+=shadedPolygon(fallingFront)+polygon(fallingTop,'#fff');
  body+=polygon([[478,384],[512,364],[512,388],[478,408]],'#000');
  return wrap(body,label,'45 60 535 415');
}

function blockTriangle(label) {
  // Nine separate cubes: four vertices along each side, with corners shared.
  // A 60-degree lattice keeps every cube and every intervening gap regular.
  const step=100,dy=step/Math.sqrt(3),r=48,q=r/Math.sqrt(3),height=2*q;
  const apex=[390,80],left=[90,80+3*dy],bottom=[390,80+6*dy];
  const centres=[];
  for(const [a,b] of [[apex,left],[left,bottom],[bottom,apex]])
    for(let i=0;i<3;i++)centres.push([a[0]+(b[0]-a[0])*i/3,a[1]+(b[1]-a[1])*i/3]);
  let body='';
  for(const [x,y] of centres){
    const top=[x,y-q],l=[x-r,y],f=[x,y+q],right=[x+r,y];
    body+=polygon([top,right,f,l],'#fff');
    body+=shadedPolygon([l,f,[x,y+q+height],[x-r,y+height]],12,1.8);
    body+=polygon([f,right,[x+r,y+height],[x,y+q+height]],'#000');
  }
  return wrap(body,label,'25 30 450 505');
}

function impossibleHexnut(label) {
  // New hexagon proportions and four bore curves on the conventional
  // ambihelical graph. The bore returns to a different outer face at each end.
  const a=[135,65],b=[200,30],c=[465,200],e=[440,665],f=[375,700],g=[110,525];
  const j=[405,235],k=[165,495];
  const path=(d,fill)=>`<path d="${d}" fill="${fill}" stroke="#000" stroke-width="3" stroke-linejoin="round"/>`;
  const insideLeft='C135 215 170 465 350 525';
  const insideRightReverse='C460 440 360 185 210 190';
  const outsideRightReverse='C490 575 475 435 450 365 C430 310 420 275 405 235';
  // The black return is a single face that continues from the outside right
  // edge to the inside left edge. It must not be split into a normal nut wall.
  let body=path('M465 200 L555 485 L440 665 L165 495 C150 440 120 365 115 300 C110 225 130 165 210 190 '+insideLeft+' '+outsideRightReverse+' Z','#000');
  body+=path('M135 65 L20 245 L110 525 L165 495 C150 440 120 365 115 300 C110 225 130 165 210 190 C360 185 460 440 350 525 '+outsideRightReverse+' Z','#fff');
  // Open bore: the two arcs share exact endpoints, with no extra loop or seam.
  body+=path('M210 190 '+insideLeft+' '+insideRightReverse+' Z','#fff');
  body+=polygon([a,b,c,j],'#fff');
  body+=shadedPolygon([g,k,e,f],14,2);
  return wrap(body,label,'-15 -5 605 740');
}

const renderers={'penrose-triangle':triangle,'impossible-cube':impossibleCube,'impossible-trident':trident,'reversible-cubes':cubes,'kanizsa-triangle':kanizsaTriangle,'necker-cube':neckerCube,'reversible-steps':reversibleSteps,'impossible-square':impossibleSquare,'impossible-colonnade':impossibleColonnade,'penrose-staircase':penroseStaircase,'impossible-joinery':impossibleJoinery,'block-triangle':blockTriangle,'impossible-hexnut':impossibleHexnut};
function svg(id,label) {return renderers[id](label);}
function build(check=false){
  if(!catalogue.length||new Set(catalogue.map(x=>x.id)).size!==catalogue.length)throw Error('Empty or duplicate catalogue');
  for(const entry of catalogue)if(!renderers[entry.id])throw Error('Missing artwork '+entry.id);
  const write=(file,contents)=>{if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==contents)throw Error('Generated file out of date: '+file);}else fs.writeFileSync(file,contents);};
  const metadata=[`{% assign artwork_total = '${String(catalogue.length).padStart(2,'0')}' %}`,"{% assign artwork_id = selected_entry.id | default: 'penrose-triangle' %}","{% case artwork_id %}"];
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
