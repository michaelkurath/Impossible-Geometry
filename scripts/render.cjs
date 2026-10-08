// Framework-backed Liquid/Chromium QA, usable when Ruby/trmnlp is unavailable.
const fs=require('node:fs');
const path=require('node:path');
const {Liquid}=require('liquidjs');
const {chromium}=require('playwright');
const {run,CATALOGUE}=require('../src/transform');
const root=path.resolve(__dirname,'..');
const cache=path.join(root,'.cache');
const output=path.join(root,'previews');
const engine=new Liquid();
const read=name=>fs.readFileSync(path.join(root,'src',name),'utf8');
const layouts=['full','half_horizontal','half_vertical','quadrant'];
const profiles=[{name:'og',device:'og'},{name:'x',device:'v2'},{name:'x-portrait',device:'v2',portrait:true}];

async function asset(url,file){
  if(fs.existsSync(file))return;
  fs.mkdirSync(path.dirname(file),{recursive:true});
  const result=await fetch(url);
  if(!result.ok)throw new Error(`${url}: ${result.status}`);
  fs.writeFileSync(file,Buffer.from(await result.arrayBuffer()));
}
async function main(){
  fs.mkdirSync(output,{recursive:true});
  await asset('https://trmnl.com/css/3.3.1/plugins.css',path.join(cache,'plugins.css'));
  await asset('https://trmnl.com/js/3.3.1/plugins.js',path.join(cache,'plugins.js'));
  for(const size of [12,16,21])for(const weight of ['Regular','Bold'])
    await asset(`https://trmnl.com/fonts/TRMNL${size}-${weight}.woff2`,path.join(cache,'fonts',`TRMNL${size}-${weight}.woff2`));
  // Relative font URLs become local paths in the QA copy, never plugin source.
  let css=fs.readFileSync(path.join(cache,'plugins.css'),'utf8');
  css=css.replaceAll('url("/fonts/','url("fonts/');
  fs.writeFileSync(path.join(cache,'qa.css'),css);
  const browser=await chromium.launch({headless:true,args:['--no-sandbox','--single-process','--no-zygote']});
  const page=await browser.newPage({viewport:{width:2000,height:1600}});
  const report=[];
  for(const profile of profiles)for(const layout of layouts)for(const entry of CATALOGUE)for(const language of ['en','de'])for(const note of ['yes','no']){
    const trmnl={plugin_settings:{custom_fields_values:{rotation:'fixed',artwork:entry.id,language,show_explanation:note}}};
    const vars={...run({trmnl}),trmnl};
    const markup=await engine.parseAndRender(read('shared.liquid')+read(layout+'.liquid'),vars);
    const view=`<div class="view view--${layout}" id="subject">${markup}</div>`;
    const modifiers={half_vertical:'1Lx1R',half_horizontal:'1Tx1B',quadrant:'2x2'};
    const count=layout==='quadrant'?3:1;
    const blank=`<div class="view view--${layout}"><div class="layout"></div></div>`;
    const content=layout==='full'?view:`<div class="mashup mashup--${modifiers[layout]}">${view}${blank.repeat(count)}</div>`;
    const html=`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="qa.css"><script src="plugins.js"></script></head><body class="trmnl" style="margin:0"><div class="screen screen--${profile.device} ${profile.portrait?'screen--portrait':''}">${content}</div></body></html>`;
    const filename=path.join(cache,'render.html');fs.writeFileSync(filename,html);
    await page.goto('file://'+filename,{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    const bounds=await page.evaluate(()=>{
      const root=document.querySelector('#subject');
      const r=root.getBoundingClientRect();
      const art=root.querySelector('.ig-art').getBoundingClientRect();
      const failures=[];
      for(const el of root.querySelectorAll('.layout,.title_bar,.ig-art,.ig-art > svg,.title,.instance,.description,.label')){
        const b=el.getBoundingClientRect();
        if(b.width&&b.height&&(b.top<r.top-1||b.left<r.left-1||b.bottom>r.bottom+1||b.right>r.right+1))failures.push(el.className);
      }
      if(art.height<60||art.width<100)failures.push('art too small');
      const svg=root.querySelector('.ig-art svg');
      if(!svg || !svg.querySelector('polygon,path'))failures.push('SVG missing');
      if(root.querySelector('img'))failures.push('external image dependency');
      for(const el of root.querySelectorAll('.title_bar .title,.title_bar .instance')) {
        if(el.scrollWidth>el.clientWidth+1)failures.push('footer text clipped');
      }
      return {width:r.width,height:r.height,artHeight:art.height,failures};
    });
    const name=`${profile.name}-${layout}-${entry.id}-${language}-${note}`;
    report.push({name,...bounds});
    if(language==='en'&&note==='no')await page.locator('#subject').screenshot({path:path.join(output,name+'.png')});
  }
  await browser.close();
  fs.writeFileSync(path.join(output,'render-report.json'),JSON.stringify(report,null,2));
  const failures=report.filter(x=>x.failures.length);
  console.log(`Rendered ${report.length} combinations; ${failures.length} bounds failures.`);
  if(failures.length){console.log(JSON.stringify(failures,null,2));process.exitCode=1;}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
