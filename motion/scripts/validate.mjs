import {readFileSync,existsSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const repo=resolve(fileURLToPath(new URL('../..',import.meta.url)));
const readme=readFileSync(join(repo,'README.md'),'utf-8');
const dir=join(repo,'assets');
const expected=['hero-perfil-animado.webp','profile-depth.webp','profile-depth-mobile.webp','project-jarvis-animated.webp','project-aquaia-animated.webp','project-unapi.webp','project-portfolio.webp','profile-film-cover.webp','profile-film.mp4'];
const warnings=[];
for(const file of expected){
 const path=join(dir,file);
 if(!existsSync(path))throw Error('Missing output: '+file);
 if(!readme.includes('assets/'+file))throw Error('README does not link to '+file);
 if(statSync(path).size<512)throw Error('Suspiciously small file: '+file);
}
for(const name of ['jarvis-academico','aquaia-ufms','homeUnapi','MeuSitePortfolio']){
 if(!readme.includes('github.com/TeoZ08/'+name))throw Error('Missing project link '+name);
}
const mediaSize=expected.filter(x=>x!=='profile-film.mp4').reduce((n,x)=>n+statSync(join(dir,x)).size,0);
if(mediaSize>9*1024*1024)warnings.push('README visual media exceeds 9MB: '+(mediaSize/1048576).toFixed(2)+'MB');
const probe=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',join(dir,'profile-film.mp4')],{encoding:'utf-8'});
if(probe.status!==0)throw Error('Video could not be decoded');
const duration=Number(probe.stdout.trim());
if(duration<29 || duration>33)throw Error('Unexpected film duration: '+duration);
if(!existsSync(join(repo,'docs/index.html')))throw Error('Missing showcase player page');
const player=readFileSync(join(repo,'docs/index.html'),'utf-8');
if(!player.includes('<video controls') || !player.includes('media/profile-film.mp4'))throw Error('Showcase video player invalid');
for(const media of ['profile-film.mp4','profile-film-cover.webp','project-jarvis.webp','project-aquaia.webp','project-unapi.webp','project-portfolio.webp','scene.webp']){
 const p=join(repo,'docs/media',media);
 if(!existsSync(p))throw Error('Showcase media missing: '+media);
}
console.log('PASS: assets, README references, project links, playable video ('+duration.toFixed(2)+'s), integrity');
console.log('README media '+(mediaSize/1048576).toFixed(2)+' MB; film '+(statSync(join(dir,'profile-film.mp4')).size/1048576).toFixed(2)+' MB');
for(const x of warnings)console.log('WARN:',x);
