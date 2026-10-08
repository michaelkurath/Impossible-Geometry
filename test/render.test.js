const {test}=require('node:test');
const assert=require('node:assert/strict');
const {Liquid}=require('liquidjs');
const fs=require('node:fs');
const {run}=require('../src/transform');
const shared=fs.readFileSync('src/shared.liquid','utf8');
for(const input of [undefined,null,{}, {trmnl:{plugin_settings:{custom_fields_values:{language:' DE ',show_explanation:'YES'}}}}]) {
 test(`safe rendering ${JSON.stringify(input)}`,async()=>{
  assert.equal(run(input).selected_entry.id,'returning-arcade');
  const html=await new Liquid().parseAndRender(shared+fs.readFileSync('src/full.liquid','utf8'),input||{});
  assert.match(html, /<img /); assert.match(html,/returning-arcade.png/);
  if(input?.trmnl) { assert.match(html,/wiederkehrende/); assert.match(html,/architektonische Studie/); }
  else assert.doesNotMatch(html,/<span class="description/);
 });
}
