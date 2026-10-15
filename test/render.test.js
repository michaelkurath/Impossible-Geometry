const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Liquid}=require('liquidjs');
const fs=require('node:fs');
const {select,CATALOGUE,localDay}=require('../src/transform');
const epoch=new Date('2026-10-08T12:00:00Z');
const inputFor=fields=>({trmnl:{plugin_settings:{custom_fields_values:fields}}});
const {build,cubeContours,cubeRegions}=require('../scripts/build-art.cjs');
const shared=fs.readFileSync('src/shared.liquid','utf8');
for(const input of [undefined,null,{}, {trmnl:{plugin_settings:{custom_fields_values:{language:' DE ',show_explanation:'YES'}}}}]) {
 test(`safe rendering ${JSON.stringify(input)}`,async()=>{
  assert.equal(select(input,epoch).selected_entry.id,'penrose-triangle');
  const html=await new Liquid().parseAndRender(shared+fs.readFileSync('src/full.liquid','utf8'),input||{});
  assert.match(html, /<svg /);
  assert.doesNotMatch(html, /<img\b|<image\b|<script\b|\shref=|url\(/);
  if(input?.trmnl) { assert.match(html,/Penrose-Dreieck/); assert.match(html,/unmögliche Schleife/); }
  else assert.doesNotMatch(html,/<span class="description/);
 });
}
test('standalone and embedded vectors agree with source',()=>build(true));
test('two plugin instances have no shared SVG IDs',async()=>{
 const markup=shared+fs.readFileSync('src/quadrant.liquid','utf8');
 const html=await new Liquid().parseAndRender(markup+markup,{});
 assert.equal((html.match(/<svg /g)||[]).length,2);
 assert.doesNotMatch(html,/\bid=|url\(#/);
});

test('fixed selection renders every catalogue entry in both languages',async()=>{
 for(const artwork of CATALOGUE) for(const language of ['en','de']) {
  const input=inputFor({rotation:' FIXED ',artwork:' '+artwork.id.toUpperCase()+' ',language,show_explanation:'yes'});
  const result=select(input,epoch);
  assert.equal(result.selected_entry.id,artwork.id);
  const html=await new Liquid().parseAndRender(shared+fs.readFileSync('src/full.liquid','utf8'),{...input,...result});
  assert.ok(html.includes(language==='de'?artwork.title_de:artwork.title));
  assert.ok(html.includes(language==='de'?artwork.note_de:artwork.note));
  assert.equal((html.match(/<svg /g)||[]).length,1);
 }
});
test('daily cycle respects local midnight and wraps',()=>{
 const pick=(date,fields={})=>select(inputFor({rotation:'daily',time_zone:'Europe/Zurich',...fields}),new Date(date)).selected_entry.id;
 assert.equal(pick('2026-10-08T21:59:59Z'),'penrose-triangle');
 assert.equal(pick('2026-10-08T22:00:00Z'),'impossible-cube');
 assert.equal(pick('2026-10-21T12:00:00Z'),'penrose-triangle');
 assert.equal(pick('2026-10-07T12:00:00Z'),'impossible-hexnut');
 assert.equal(pick('2026-10-08T22:00:00Z',{time_zone:'invalid'}),'penrose-triangle');
 assert.equal(localDay(new Date('2026-10-25T00:30:00Z'),'Europe/Zurich'),localDay(new Date('2026-10-25T01:30:00Z'),'Europe/Zurich'));
});
test('hourly slots are stable within an hour and migrate random mode',()=>{
 for(const rotation of ['hourly','random']) {
  assert.equal(select(inputFor({rotation}),new Date('2026-10-08T01:00:00Z')).selected_entry.id,'impossible-cube');
  assert.equal(select(inputFor({rotation}),new Date('2026-10-08T01:59:59Z')).selected_entry.id,'impossible-cube');
  assert.equal(select(inputFor({rotation}),new Date('2026-10-08T02:00:00Z')).selected_entry.id,'impossible-trident');
 }
});
test('invalid artwork and missing transform output retain visible fallback',async()=>{
 assert.equal(select(inputFor({rotation:'fixed',artwork:'missing'}),epoch).selected_entry.id,'penrose-triangle');
 const html=await new Liquid().parseAndRender(shared+fs.readFileSync('src/full.liquid','utf8'),{selected_entry:{id:'missing'}});
 assert.match(html,/Penrose Triangle/); assert.match(html,/<svg /);
});

test('block triangle is not misrepresented as an impossible solid',()=>{
 const blocks=CATALOGUE.find(x=>x.id==='block-triangle');
 assert.ok(blocks);
 assert.equal(blocks.kind,'geometric pattern');
 assert.match(blocks.note,/possible in space/);
 assert.match(blocks.note_de,/räumlich möglich/);
});

test('cube contours are simple closed faces with no zero-length edges',()=>{
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
  const segmentsIntersect=(a,b,c,d)=>{
    const v=[cross(a,b,c),cross(a,b,d),cross(c,d,a),cross(c,d,b)];
    // Reject non-adjacent proper crossings. Collinear overlaps are rejected
    // separately by uniqueness of vertices and non-zero edge lengths.
    return v[0]*v[1]<0 && v[2]*v[3]<0;
  };
  assert.equal(cubeContours(cubeRegions.front[0]).length,2);
  assert.equal(cubeContours(cubeRegions.top[1]).length,2);
  let count=0;
  for(const kind of ['front','side','top'])for(const raw of cubeRegions[kind]){
    for(const polygon of cubeContours(raw)){
      count++;
      assert.ok(polygon.length>=3);
      const uniq=new Set(polygon.map(p=>p.join(',')));
      assert.equal(uniq.size,polygon.length,'repeated vertex after normalization');
      for(let i=0;i<polygon.length;i++){
        const a=polygon[i],b=polygon[(i+1)%polygon.length];
        assert.ok(!same(a,b),'zero-length segment');
        for(let j=i+1;j<polygon.length;j++){
          if(j===i+1||(i===0&&j===polygon.length-1))continue;
          assert.ok(!segmentsIntersect(a,b,polygon[j],polygon[(j+1)%polygon.length]),'self-crossing face');
        }
      }
    }
  }
  assert.equal(count,16,'unexpected number of split cube surfaces');
});
