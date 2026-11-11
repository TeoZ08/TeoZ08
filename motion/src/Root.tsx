import React from 'react';
import {Composition, Still} from 'remotion';
import {Journey, Depth, DepthMobile, ProjectCard, FilmCover} from './Scenes';
import {projects} from './data';

export const Root: React.FC = () => (
 <>
  <Composition id="Journey" component={Journey} width={1280} height={720} fps={24} durationInFrames={744}/>
  <Composition id="Depth" component={Depth} width={1200} height={248} fps={16} durationInFrames={80}/>
  <Composition id="DepthMobile" component={DepthMobile} width={480} height={480} fps={12} durationInFrames={72}/>
  {projects.map((project)=>(
   <Composition key={project.key} id={'Card-'+project.key} component={ProjectCard}
     defaultProps={{projectKey:project.key}} width={720} height={420} fps={12} durationInFrames={48}/>
  ))}
  <Still id="FilmCover" component={FilmCover} width={1280} height={400}/>
 </>
);
