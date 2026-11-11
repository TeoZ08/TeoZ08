import {chromium} from 'playwright-core';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('motion/preview/github-qa');
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--disable-dev-shm-usage']});
for(const [name,width,height,mode] of [
  ['desktop',1440,900,'no-preference'],
  ['mobile',390,844,'no-preference'],
  ['reduced-motion',390,844,'reduce']
]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:mode});
 await page.goto('https://github.com/TeoZ08',{waitUntil:'domcontentloaded',timeout:45000});
 await page.locator('.markdown-body').first().waitFor({timeout:30000});
 const metrics=await page.locator('.markdown-body').first().evaluate(async root=>{
  const images=[...root.querySelectorAll('img')].filter(img=>img.getAttribute('src')?.includes('/assets/'));
  await Promise.all(images.map(img=>img.decode().catch(()=>{})));
  const list=images.slice(0,7).map((img,i)=>{
   const box=img.getBoundingClientRect(), next=images[i+1]?.getBoundingClientRect();
   return {
    file:(img.currentSrc||img.src).split('/').pop()?.slice(0,95),
    naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,
    renderedWidth:Math.round(box.width),renderedHeight:Math.round(box.height),
    gapAfter:next?Math.round(next.top-box.bottom):null
   };
  });
  return {images:list,totalHeight:Math.round(root.getBoundingClientRect().height)};
 });
 await page.screenshot({path:dir+'/'+name+'-review.png',fullPage:true,animations:'disabled'});
 console.log(JSON.stringify({name,mode,metrics},null,2));
 if(metrics.images.length!==7 || metrics.images.some(img=>img.naturalWidth===0)) throw Error(name+': failed to load seven visuals');
 if(metrics.images.slice(0,6).some(img=>img.gapAfter>1)) throw Error(name+': visible gap between cinematic panels');
 await page.close();
}
await browser.close();
