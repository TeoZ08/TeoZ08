import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, copyFileSync, statSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const dir=resolve(fileURLToPath(new URL('..',import.meta.url)));
const repo=resolve(dir,'..');
const out=join(dir,'preview');
const assets=join(repo,'assets');
const src=join(dir,'src/index.ts');
const bin=join(dir,'node_modules/.bin/remotion');
mkdirSync(out,{recursive:true});mkdirSync(assets,{recursive:true});
const browser='/usr/bin/google-chrome';
const browserArg=existsSync(browser)?['--browser-executable='+browser]:[];
const quick=process.argv.includes('--quick');
function cmd(file,args){
 const p=spawnSync(file,args,{cwd:dir,stdio:'inherit',env:process.env});
 if(p.error)throw p.error;
 if(p.status!==0)throw Error(file+' failed (exit '+p.status+')');
}
function remotion(action,composition,path,options=[]){
 cmd(bin,[action,src,composition,path,...browserArg,'--log=error',...options]);
}
function webpStill(source,dest){
 cmd('ffmpeg',['-loglevel','error','-y','-i',source,'-frames:v','1','-c:v','libwebp','-q:v','92',dest]);
}
function webpAnim(source,dest,scale,fps,quality){
 cmd('ffmpeg',['-loglevel','error','-y','-i',source,'-vf','fps='+fps+',scale='+scale+':flags=lanczos',
   '-c:v','libwebp_anim','-loop','0','-q:v',String(quality),'-compression_level','6','-an',dest]);
}
console.log('[1/5] Film cover');
remotion('still','FilmCover',join(out,'film-cover.png'));
webpStill(join(out,'film-cover.png'),join(assets,'profile-film-cover.webp'));
console.log('[2/5] All real screenshot project cards');
for(const key of ['jarvis','aquaia','unapi','portfolio']){
 const png=join(out,'card-'+key+'.png');
 remotion('still','Card-'+key,png,['--frame=18']);
 webpStill(png,join(assets,'project-'+key+'.webp'));
}
console.log('[3/5] Continuous header and water transition');
remotion('render','HeroMobile',join(out,'hero-mobile.mp4'),['--codec=h264','--crf=13','--concurrency=2']);
webpAnim(join(out,'hero-mobile.mp4'),join(assets,'hero-perfil-mobile.webp'),'480:700',12,88);
remotion('still','HeroMobile',join(out,'hero-mobile-still.png'));
webpStill(join(out,'hero-mobile-still.png'),join(assets,'hero-perfil-mobile-static.webp'));
remotion('render','Depth',join(out,'depth.mp4'),['--codec=h264','--crf=13','--concurrency=3']);
webpAnim(join(out,'depth.mp4'),join(assets,'profile-depth.webp'),'1200:248',12,90);
webpStill(join(out,'depth.mp4'),join(assets,'profile-depth-static.webp'));
remotion('render','DepthMobile',join(out,'depth-mobile.mp4'),['--codec=h264','--crf=13','--concurrency=2']);
webpAnim(join(out,'depth-mobile.mp4'),join(assets,'profile-depth-mobile.webp'),'480:480',12,90);
webpStill(join(out,'depth-mobile.mp4'),join(assets,'profile-depth-mobile-static.webp'));

console.log('[4/5] High-resolution project panoramas and mobile alternatives');
for(const key of ['jarvis','aquaia','unapi','portfolio']){
 remotion('still','Panel-'+key,join(out,'panel-'+key+'.png'),['--frame=18']);
 webpStill(join(out,'panel-'+key+'.png'),join(assets,'project-'+key+'-panel.webp'));
 remotion('still','PanelMobile-'+key,join(out,'panel-mobile-'+key+'.png'),['--frame=18']);
 webpStill(join(out,'panel-mobile-'+key+'.png'),join(assets,'project-'+key+'-mobile.webp'));
}
for(const key of ['jarvis','aquaia']){
 const video=join(out,'panel-'+key+'.mp4');
 remotion('render','Panel-'+key,video,['--codec=h264','--crf=13','--concurrency=3']);
 webpAnim(video,join(assets,'project-'+key+'-animated.webp'),'1200:350',12,87);
}
if(!quick){
 console.log('[5/5] High-fidelity Remotion film (one video encode, no re-encode)');
 const master=join(out,'film-master-hq.mp4');
 remotion('render','Journey',master,['--codec=h264','--crf=13','--concurrency=3']);
 // Faststart remux copies the compressed stream bit-for-bit, avoiding the previous
 // second destructive H.264 encoding pass.
 cmd('ffmpeg',['-loglevel','error','-y','-i',master,'-map','0:v:0','-map','0:a:0?',
   '-c','copy','-movflags','+faststart',join(assets,'profile-film.mp4')]);
}
const pageAssets=join(repo,'docs/media');
mkdirSync(pageAssets,{recursive:true});
for(const name of ['profile-film.mp4','profile-film-cover.webp','project-jarvis.webp','project-aquaia.webp','project-unapi.webp','project-portfolio.webp']){
 const source=join(assets,name);
 if(existsSync(source))copyFileSync(source,join(pageAssets,name));
}
copyFileSync(join(dir,'public/landscape/scene.webp'),join(pageAssets,'scene.webp'));
console.log('Render complete');
for(const filename of ['hero-perfil-mobile.webp','profile-depth.webp','profile-depth-mobile.webp','project-jarvis-animated.webp','project-aquaia-animated.webp','project-unapi-panel.webp','project-portfolio-panel.webp','profile-film-cover.webp','profile-film.mp4']){
 const p=join(assets,filename);if(existsSync(p))console.log(filename,(statSync(p).size/1024/1024).toFixed(2)+' MB');
}
