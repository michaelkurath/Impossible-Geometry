const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Liquid}=require('liquidjs');
const fs=require('node:fs');
const {run}=require('../src/transform');
const {build}=require('../scripts/build-art.cjs');
const shared=fs.readFileSync('src/shared.liquid','utf8');
for(const input of [undefined,null,{}, {trmnl:{plugin_settings:{custom_fields_values:{language:' DE ',show_explanation:'YES'}}}}]) {
 test(`safe rendering ${JSON.stringify(input)}`,async()=>{
  assert.equal(run(input).selected_entry.id,'penrose-triangle');
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
