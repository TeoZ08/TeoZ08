import {chromium} from 'playwright-core';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const folder=resolve('motion/preview/github-qa');
mkdirSync(folder,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [label,w,h] of [['desktop',1440,900],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width:w,height:h}, deviceScaleFactor:1, reducedMotion:'reduce'});
 const errors=[];
 page.on('console',msg=>{if(msg.type()==='error' && errors.length<8)errors.push(msg.text())});
 await page.goto('https://github.com/TeoZ08',{waitUntil:'domcontentloaded',timeout:45000});
 await page.locator('.markdown-body').first().waitFor({timeout:30000});
 await page.screenshot({path:folder+'/'+label+'-full.png',fullPage:true,animations:'disabled'});
 const layout=await page.locator('.markdown-body').first().evaluate(root=>{
  const rootR=root.getBoundingClientRect();
  const map=el=>{
   const r=el.getBoundingClientRect();
   const cs=getComputedStyle(el);
   return {tag:el.tagName,src:(el.getAttribute('src')||'').slice(-75),text:(el.textContent||'').trim().slice(0,60),top:Math.round(r.top+scrollY),height:Math.round(r.height),width:Math.round(r.width),marginTop:cs.marginTop,marginBottom:cs.marginBottom,display:cs.display};
  };
  return {bodyHeight:Math.round(rootR.height),elements:Array.from(root.querySelectorAll('h1,h2,h3,p,div,details,img,picture,a')).slice(0,62).map(map)};
 });
 console.log(JSON.stringify({device:label,width:w,height:h,url:page.url(),layout,errors},null,2));
 await page.close();
}
await browser.close();
