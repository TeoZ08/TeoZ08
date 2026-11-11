import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ProjectKey, Project, projects} from './data';

const ink='#080b10', ivory='#eff0eb', muted='#a3adb0', gold='#b59b61';
const serif:React.CSSProperties={fontFamily:'Georgia, "Times New Roman", serif',fontWeight:400};
const sans:React.CSSProperties={fontFamily:'Arial, Helvetica, sans-serif'};
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const ease=(x:number)=>{const v=clamp(x);return v*v*(3-2*v);};
const scene=staticFile('landscape/scene.png');

const SceneBackground:React.FC<{opacity?:number,scale?:number}>=({opacity=1,scale=1})=>
 <AbsoluteFill style={{backgroundColor:ink,overflow:'hidden'}}>
  <Img src={scene} style={{position:'absolute',top:0,width:'100%',height:'100%',objectFit:'cover',opacity,transform:'scale('+scale+')'}}/>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(6,9,12,.82) 0%,rgba(6,9,12,.30) 65%,rgba(6,9,12,.65) 100%)'}}/>
 </AbsoluteFill>;

const Mark:React.FC<{children:React.ReactNode}>=({children})=><div style={{color:gold,fontSize:16,letterSpacing:4,fontWeight:600,...sans}}>{children}</div>;

const Intro:React.FC<{frame:number}>=({frame})=>{
 const k=ease(frame/30), s=1+frame*.0002;
 return <AbsoluteFill>
  <SceneBackground opacity={.95} scale={s}/>
  <div style={{position:'absolute',left:102,top:300,opacity:k,transform:'translateY('+(22*(1-k))+'px)'}}>
   <Mark>COMPUTER SCIENCE · UFMS</Mark>
   <div style={{...serif,color:ivory,fontSize:88,lineHeight:1.04,marginTop:18}}>Matteo<br/>Lima Scotti</div>
   <div style={{color:'#bdc6c7',fontSize:25,marginTop:28,...sans}}>Backend · Integrations · Applied AI</div>
  </div>
  <div style={{position:'absolute',bottom:42,left:100,right:100,height:1,background:'linear-gradient(90deg,'+gold+',transparent)',opacity:.7}}/>
 </AbsoluteFill>
};

const Screenshot:React.FC<{file:string,opacity:number,transform?:string}>=({file,opacity,transform})=>
 <Img src={staticFile('screens/'+file)} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',opacity,transform}}/>;

const ProjectSlide:React.FC<{project:Project,frame:number,index:number}>=({project,frame,index})=>{
 const intro=ease(frame/20);
 const leave=ease((frame-126)/18);
 const p=frame/144;
 const swap=ease((frame-70)/16);
 const move='scale('+(1.03+frame*.00008)+') translateX('+(-2*p)+'px)';
 return <AbsoluteFill style={{background:ink,opacity:1-leave}}>
  <SceneBackground opacity={.16}/>
  <div style={{position:'absolute',left:70,top:76,right:70,height:1,background:'linear-gradient(90deg,'+gold+' 0%,#31383b 100%)'}}/>
  <div style={{position:'absolute',left:74,top:123,width:460,opacity:intro,transform:'translateY('+(12*(1-intro))+'px)'}}>
   <Mark>{project.kicker}</Mark>
   <div style={{...serif,fontSize:66,lineHeight:1.06,color:ivory,marginTop:40}}>{project.title}</div>
   <p style={{...sans,fontSize:22,color:'#bbc2c2',lineHeight:1.42,maxWidth:390,marginTop:30}}>{project.description}</p>
   <div style={{...sans,marginTop:38,fontSize:18,letterSpacing:1,color:gold}}>{project.tech}</div>
  </div>
  <div style={{position:'absolute',left:550,top:137,width:670,height:378,overflow:'hidden',border:'1px solid rgba(229,223,202,.32)',boxShadow:'0 18px 52px rgba(0,0,0,.6)',opacity:intro,transform:'translateX('+(35*(1-intro))+'px)'}}>
   <Screenshot file={project.first} opacity={1-swap} transform={move}/>
   <Screenshot file={project.second} opacity={swap} transform={move}/>
  </div>
  <div style={{position:'absolute',right:72,bottom:72,color:'#8d9698',fontSize:14,letterSpacing:2,...sans}}>TEOZ08  /  {String(index+1).padStart(2,'0')}</div>
  <div style={{position:'absolute',bottom:50,left:74,width:1070,height:2,background:'#30393d'}}>
   <div style={{height:'100%',background:gold,width:(Math.round(100*p))+'%'}}/>
  </div>
 </AbsoluteFill>
};

const Outro:React.FC<{frame:number}>=({frame})=>{
 const k=ease(frame/22);
 return <AbsoluteFill style={{background:ink}}>
  <SceneBackground opacity={.48} scale={1+frame*.0002}/>
  <div style={{position:'absolute',top:250,width:'100%',textAlign:'center',opacity:k}}>
   <Mark>BUILD  ·  TEST  ·  UNDERSTAND  ·  IMPROVE</Mark>
   <div style={{...serif,color:ivory,fontSize:82,marginTop:25}}>The work continues.</div>
   <div style={{...sans,color:'#b3bcbc',marginTop:26,fontSize:21}}>github.com/TeoZ08</div>
  </div>
 </AbsoluteFill>
};

const JourneyVisual:React.FC=()=>{
 const frame=useCurrentFrame();
 if(frame<84)return <Intro frame={frame}/>;
 if(frame<660){
  const offset=frame-84, index=Math.min(3,Math.floor(offset/144)),local=offset%144;
  return <ProjectSlide project={projects[index]} index={index} frame={local}/>;
 }
 return <Outro frame={frame-660}/>;
};

export const Journey:React.FC=()=> <><Audio src={staticFile('audio/ambient.mp3')} volume={0.60}/><JourneyVisual/></>;

export const Depth:React.FC=()=>{
 const frame=useCurrentFrame();
 const {width,height}=useVideoConfig();
 const rows=Array.from({length:11},(_,i)=>i);
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#040609 0%,#0d141a 38%,#111a22 90%,#10161c 100%)',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 5%,rgba(147,163,162,.10),transparent 72%)'}}/>
  {rows.map((i)=>{
   const y=18+i*19, wave=Math.sin(i*.75+frame*.11)*9;
   return <div key={i} style={{position:'absolute',left:'8%',width:'84%',top:y+wave*.2,height:1,
    opacity:.055+(i%4)*.015,background:'linear-gradient(90deg,transparent,#b6c3c7,transparent)',
    transform:'scaleX('+(0.76+Math.sin(i*.5+frame*.06)*.05)+')'}}/>;
  })}
  <div style={{position:'absolute',top:25,width:'100%',textAlign:'center',color:gold,fontSize:15,letterSpacing:4,...sans}}>WHAT DRIVES MY WORK</div>
  <div style={{position:'absolute',top:103,left:40,right:40,display:'grid',gridTemplateColumns:'repeat(3,1fr)',textAlign:'center',gap:28,color:ivory}}>
   {[['Backend','C# / .NET · APIs'],['Integrations','Systems · real workflows'],['Applied AI','RAG · automation']].map(([title,desc])=>
    <div key={title}>
     <div style={{...serif,fontSize:37,color:ivory}}>{title}</div>
     <div style={{...sans,fontSize:16,color:muted,marginTop:14,letterSpacing:.35}}>{desc}</div>
    </div>)}
  </div>
  <div style={{position:'absolute',bottom:0,left:130,right:130,height:1,background:'linear-gradient(90deg,transparent,#6a5a38,transparent)'}}/>
 </AbsoluteFill>;
};

export const ProjectCard:React.FC<{projectKey:ProjectKey}>=({projectKey})=>{
 const frame=useCurrentFrame();
 const proj=projects.find((p)=>p.key===projectKey) ?? projects[0];
 const progress=(1-Math.cos(2*Math.PI*frame/48))/2;
 const swap=progress;
 const opacity=Math.min(1,ease(frame/9),ease((48-frame)/9));
 return <AbsoluteFill style={{background:'#0b1117',overflow:'hidden'}}>
  <div style={{position:'absolute',width:'100%',height:'100%'}}>
   <Screenshot file={proj.first} opacity={1-swap} transform={'scale('+(1.02+progress*.02)+')'}/>
   <Screenshot file={proj.second} opacity={swap} transform={'scale('+(1.02+progress*.02)+')'}/>
  </div>
  <AbsoluteFill style={{background:'linear-gradient(0deg,rgba(3,6,9,.97) 0%,rgba(4,8,11,.73) 28%,rgba(8,11,14,.12) 83%)'}}/>
  <div style={{position:'absolute',left:34,right:28,bottom:33,opacity}}>
   <div style={{...sans,color:gold,letterSpacing:2.7,fontSize:13}}>{proj.kicker}</div>
   <div style={{...serif,color:ivory,fontSize:47,marginTop:7}}>{proj.title}</div>
   <div style={{...sans,color:'#c5cdcd',fontSize:16,marginTop:6}}>{proj.tech}</div>
  </div>
  <div style={{position:'absolute',top:22,left:26,width:38,height:2,background:gold}}/>
  <div style={{position:'absolute',bottom:0,left:0,height:3,width:(progress*100)+'%',background:gold,opacity:.7}}/>
 </AbsoluteFill>;
};

export const FilmCover:React.FC=()=>{
 return <AbsoluteFill style={{background:ink,overflow:'hidden'}}>
  <Img src={scene} style={{width:'100%',height:'100%',objectFit:'cover',opacity:.53}}/>
  <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(5,8,12,.9),rgba(6,9,13,.28) 70%)'}}/>
  <div style={{position:'absolute',top:68,left:82}}>
   <Mark>SELECTED WORK / A SHORT FILM</Mark>
   <div style={{...serif,color:ivory,fontSize:76,marginTop:32}}>Beyond the code.</div>
   <div style={{...sans,color:'#bdc5c4',fontSize:22,marginTop:15}}>Four projects. One journey.</div>
  </div>
  <div style={{position:'absolute',top:172,right:100,width:75,height:75,border:'1px solid rgba(235,235,228,.8)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:ivory,fontSize:27}}>▶</div>
  <div style={{position:'absolute',left:82,bottom:42,height:1,width:1050,background:'linear-gradient(90deg,'+gold+',transparent)'}}/>
 </AbsoluteFill>;
};


export const DepthMobile:React.FC=()=>{
 const frame=useCurrentFrame();
 const items=[['Backend','C# / .NET · REST APIs'],['Integrations','Systems · real workflows'],['Applied AI','RAG · automation']];
 return <AbsoluteFill style={{background:'linear-gradient(180deg,#040609,#111b23)',overflow:'hidden'}}>
  {Array.from({length:11},(_,i)=><div key={i} style={{
   position:'absolute',width:'90%',left:'5%',top:20+i*41,
   height:1,opacity:.04+i*.003,
   background:'linear-gradient(90deg,transparent,#bdc7c5,transparent)',
   transform:'translateY('+(3*Math.sin(frame/72*Math.PI*2+i*.7))+'px)'
  }}/>)}
  <div style={{position:'absolute',top:28,width:'100%',textAlign:'center',color:gold,letterSpacing:3,fontSize:19,...sans}}>WHAT DRIVES MY WORK</div>
  {items.map(([title,desc],i)=><div key={title} style={{position:'absolute',top:104+i*115,width:'100%',textAlign:'center'}}>
   <div style={{...serif,color:ivory,fontSize:44}}>{title}</div>
   <div style={{...sans,color:muted,fontSize:22,marginTop:8}}>{desc}</div>
  </div>)}
 </AbsoluteFill>;
};


/**
 * A continuous panorama panel for the README, all four panels share the
 * same color at their edges, so Markdown's few baseline pixels disappear.
 * Actual application screenshots stay readable: no simulated interfaces.
 */
export const ProjectPanel:React.FC<{projectKey:ProjectKey}>=({projectKey})=>{
 const frame=useCurrentFrame();
 const p=projects.find(item=>item.key===projectKey) ?? projects[0];
 const index=projects.findIndex(item=>item.key===projectKey);
 const fade=(1-Math.cos(2*Math.PI*frame/48))/2;
 const y=1.02+.009*Math.sin(2*Math.PI*frame/48);
 return <AbsoluteFill style={{background:'#080b10',overflow:'hidden'}}>
  <AbsoluteFill style={{background:'radial-gradient(ellipse at 72% 50%,#1b2831 0%,#0d151d 50%,#080b10 94%)'}}/>
  <div style={{position:'absolute',left:0,right:0,top:0,height:1,background:'linear-gradient(90deg,transparent,rgba(184,155,94,.22),transparent)'}}/>
  {Array.from({length:5},(_,i)=><div key={i} style={{
   position:'absolute',top:35+67*i,left:160+(i%2)*30,width:'65%',height:1,
   opacity:.06,background:'linear-gradient(90deg,transparent,#acb6b7,transparent)',
   transform:'translateX('+(4*Math.sin(2*Math.PI*frame/48+i))+'px)'
  }}/>)}
  <div style={{position:'absolute',left:51,top:64,width:480}}>
   <div style={{...sans,color:gold,letterSpacing:3.1,fontSize:16,fontWeight:600}}>{p.kicker}</div>
   <div style={{...serif,color:ivory,fontSize:55,lineHeight:1.02,marginTop:16,letterSpacing:-.8}}>{p.title}</div>
   <div style={{...sans,color:'#bdc6c7',fontSize:20,lineHeight:1.25,marginTop:13,maxWidth:430}}>{p.description}</div>
  </div>
  <div style={{position:'absolute',left:51,bottom:48,fontSize:18,color:gold,letterSpacing:.7,...sans}}>{p.tech}</div>
  <div style={{position:'absolute',right:46,top:22,width:578,height:326,background:'#0c131a',
    overflow:'hidden',border:'1px solid rgba(211,211,202,.20)',boxShadow:'0 11px 31px rgba(0,0,0,.44)'}}>
   <Img src={staticFile('screens/'+p.first)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
      opacity:1-fade,transform:'scale('+y+')'}}/>
   <Img src={staticFile('screens/'+p.second)} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
      opacity:fade,transform:'scale('+y+')'}}/>
  </div>
  <div style={{position:'absolute',bottom:0,left:0,right:0,height:18,background:'linear-gradient(0deg,#080b10,transparent)'}}/>
  <div style={{position:'absolute',left:54,bottom:16,color:'#566169',fontSize:12,letterSpacing:3,...sans}}>
    {String(index+1).padStart(2,'0')} / 04
  </div>
 </AbsoluteFill>;
};


/** Portrait compositions keep all project copy legible on 320px-wide phones. */
export const ProjectPanelMobile:React.FC<{projectKey:ProjectKey}>=({projectKey})=>{
 const frame=useCurrentFrame();
 const p=projects.find(item=>item.key===projectKey) ?? projects[0];
 const index=projects.findIndex(item=>item.key===projectKey);
 const fade=(1-Math.cos(2*Math.PI*frame/48))/2;
 return <AbsoluteFill style={{background:'#080b10'}}>
  <AbsoluteFill style={{background:'linear-gradient(180deg,#101b22,#0a0e13 62%,#080b10)'}}/>
  <div style={{position:'absolute',top:22,left:28,right:28,height:238,border:'1px solid rgba(184,155,94,.26)',overflow:'hidden'}}>
   <Img src={staticFile('screens/'+p.first)} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',opacity:1-fade}}/>
   <Img src={staticFile('screens/'+p.second)} style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover',opacity:fade}}/>
  </div>
  <div style={{position:'absolute',top:293,left:30,right:30}}>
    <div style={{...sans,color:gold,fontSize:18,letterSpacing:2.1,fontWeight:600}}>{p.kicker}</div>
    <div style={{...serif,color:ivory,fontSize:46,lineHeight:1.02,marginTop:17}}>{p.title}</div>
    <div style={{...sans,color:'#bec6c8',fontSize:20,lineHeight:1.29,marginTop:15}}>{p.description}</div>
  </div>
  <div style={{position:'absolute',bottom:17,left:30,right:25,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
   <div style={{...sans,color:gold,fontSize:17}}>{p.tech}</div>
   <div style={{...sans,color:'#738088',fontSize:15}}>{String(index+1).padStart(2,'0')} / 04</div>
  </div>
  <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:'#080b10'}}/>
 </AbsoluteFill>;
};

export const HeroMobile:React.FC=()=>{
 const frame=useCurrentFrame();
 const shift=1.10 + .013*Math.sin(2*Math.PI*frame/48);
 return <AbsoluteFill style={{background:'#080b10',overflow:'hidden'}}>
  <div style={{position:'absolute',top:0,left:0,right:0,height:400,overflow:'hidden'}}>
   <Img src={scene} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale('+shift+')',transformOrigin:'center center'}}/>
   <AbsoluteFill style={{background:'linear-gradient(180deg,transparent 0%,rgba(7,10,13,.06) 60%,#080b10 99%)'}}/>
  </div>
  <div style={{position:'absolute',top:420,left:27,right:27,textAlign:'center'}}>
   <div style={{...serif,fontSize:56,lineHeight:.98,color:ivory}}>Matteo<br/>Lima Scotti</div>
   <div style={{...sans,fontSize:19,color:gold,letterSpacing:2,marginTop:25}}>COMPUTER SCIENCE · UFMS</div>
   <div style={{...sans,fontSize:22,color:'#c4cacc',marginTop:28}}>Backend · C# / .NET · Applied AI</div>
  </div>
 </AbsoluteFill>;
};
