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
 cmd('ffmpeg',['-loglevel','error','-y','-i',source,'-frames:v','1','-c:v','libwebp','-q:v','78',dest]);
}
function webpAnim(source,dest,scale,fps,quality){
 cmd('ffmpeg',['-loglevel','error','-y','-i',source,'-vf','fps='+fps+',scale='+scale+':flags=lanczos',
   '-c:v','libwebp_anim','-loop','0','-q:v',String(quality),'-compression_level','5','-an',dest]);
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
console.log('[3/5] Water continuation');
remotion('render','Depth',join(out,'depth.mp4'),['--codec=h264','--crf=29','--concurrency=3']);
webpAnim(join(out,'depth.mp4'),join(assets,'profile-depth.webp'),'1200:248',10,65);
remotion('render','DepthMobile',join(out,'depth-mobile.mp4'),['--codec=h264','--crf=29','--concurrency=2']);
webpAnim(join(out,'depth-mobile.mp4'),join(assets,'profile-depth-mobile.webp'),'480:480',10,65);
console.log('[4/5] Animated real project cards');
for(const key of ['jarvis','aquaia']){
 const video=join(out,'card-'+key+'.mp4');
 remotion('render','Card-'+key,video,['--codec=h264','--crf=28','--concurrency=3']);
 webpAnim(video,join(assets,'project-'+key+'-animated.webp'),'640:374',8,58);
}
if(!quick){
 console.log('[5/5] Remotion cinematic project film');
 const master=join(out,'film-master.mp4');
 remotion('render','Journey',master,['--codec=h264','--crf=24','--concurrency=3']);
 cmd('ffmpeg',['-loglevel','error','-y','-i',master,'-c:v','libx264','-crf','25','-preset','medium',
  '-pix_fmt','yuv420p','-movflags','+faststart','-c:a','aac','-b:a','96k',join(assets,'profile-film.mp4')]);
}
console.log('Render complete');
for(const filename of ['profile-depth.webp','project-jarvis-animated.webp','project-aquaia-animated.webp','project-unapi.webp','project-portfolio.webp','profile-film-cover.webp','profile-film.mp4']){
 const p=join(assets,filename);if(existsSync(p))console.log(filename,(statSync(p).size/1024/1024).toFixed(2)+' MB');
}
