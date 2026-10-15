// Verify that a render run covered every device, layout and catalogue entry.
// This catches a partial screenshot run that might otherwise look successful.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {CATALOGUE}=require('../src/transform');
const root=path.resolve(__dirname,'..');
const report=JSON.parse(fs.readFileSync(path.join(root,'previews/render-report.json'),'utf8'));
const profiles=['og','x','x-portrait'];
const layouts=['full','half_horizontal','half_vertical','quadrant'];
const languages=['en','de'];
const notes=['yes','no'];
const expected=CATALOGUE.length*profiles.length*layouts.length*languages.length*notes.length;
const seen=new Set();
assert.equal(report.length,expected,`Expected ${expected} render checks, got ${report.length}`);
for(const item of report){
  assert.ok(!seen.has(item.name),`Duplicate render ${item.name}`);
  seen.add(item.name);
  assert.deepEqual(item.failures,[],`Layout failure in ${item.name}`);
  assert.ok(item.width>0&&item.height>0&&item.artHeight>=60,`Artwork too small in ${item.name}`);
}
let screenshots=0;
for(const profile of profiles)for(const layout of layouts)for(const artwork of CATALOGUE)
  for(const language of languages)for(const note of notes){
    const name=`${profile}-${layout}-${artwork.id}-${language}-${note}`;
    assert.ok(seen.has(name),`Missing render check: ${name}`);
    if(language==='en'&&note==='no'){
      const filename=path.join(root,'previews',name+'.png');
      const bytes=fs.readFileSync(filename);
      assert.ok(bytes.length>500,`Screenshot too small: ${filename}`);
      assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`Invalid PNG: ${filename}`);
      screenshots++;
    }
  }
console.log(`Verified ${expected} render checks and ${screenshots} PNG screenshots across ${CATALOGUE.length} artworks.`);
