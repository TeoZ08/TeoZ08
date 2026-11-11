import React from 'react';
import {Composition, Still} from 'remotion';
import {Journey, Depth, DepthMobile, ProjectCard, ProjectPanel, ProjectPanelMobile, HeroMobile, FilmCover} from './Scenes';
import {projects} from './data';

export const Root: React.FC = () => (
 <>
  <Composition id="Journey" component={Journey} width={1280} height={720} fps={24} durationInFrames={744}/>
  <Composition id="Depth" component={Depth} width={1200} height={248} fps={16} durationInFrames={80}/>
  <Composition id="HeroMobile" component={HeroMobile} width={480} height={700} fps={12} durationInFrames={48}/>
  <Composition id="DepthMobile" component={DepthMobile} width={480} height={480} fps={12} durationInFrames={72}/>
  {projects.map((project)=>(
   <React.Fragment key={project.key}>
    <Composition id={'Panel-'+project.key} component={ProjectPanel}
     defaultProps={{projectKey:project.key}} width={1200} height={350} fps={12} durationInFrames={48}/>
    <Composition id={'PanelMobile-'+project.key} component={ProjectPanelMobile}
     defaultProps={{projectKey:project.key}} width={480} height={520} fps={12} durationInFrames={48}/>
   </React.Fragment>
  ))}
  {projects.map((project)=>(
   <Composition key={project.key} id={'Card-'+project.key} component={ProjectCard}
     defaultProps={{projectKey:project.key}} width={720} height={420} fps={12} durationInFrames={48}/>
  ))}
  <Still id="FilmCover" component={FilmCover} width={1280} height={400}/>
 </>
);
