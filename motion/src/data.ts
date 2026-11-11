export type ProjectKey = 'jarvis' | 'aquaia' | 'unapi' | 'portfolio';
export type Project = {
 key: ProjectKey;
 title: string;
 kicker: string;
 description: string;
 tech: string;
 first: string;
 second: string;
 link: string;
};
export const projects: Project[] = [
 {key:'jarvis',title:'JARVIS Acadêmico',kicker:'01 / APPLIED AI',description:'A research companion built around retrieval, evidence, and practical tools.',tech:'RAG · FastAPI · React',first:'jarvis-chat.webp',second:'jarvis-resposta-fontes.webp',link:'https://github.com/TeoZ08/jarvis-academico'},
 {key:'aquaia',title:'AquaIA',kicker:'02 / DATA & IMPACT',description:'Water waste reporting with maps, prioritization and measurable context.',tech:'Flask · Maps · Analytics',first:'aquaia-indicadores-litros-custos.webp',second:'aquaia-mapa.webp',link:'https://github.com/TeoZ08/aquaia-ufms'},
 {key:'unapi',title:'Portal UnAPI',kicker:'03 / DIGITAL INCLUSION',description:'Accessible digital literacy exercises designed for real workshops.',tech:'JavaScript · Accessibility',first:'unapi-inicial.webp',second:'unapi-simulacao-govbr.webp',link:'https://github.com/TeoZ08/homeUnapi'},
 {key:'portfolio',title:'3D Portfolio',kicker:'04 / INTERACTIVE WEB',description:'Exploring software through a navigable real-time 3D world.',tech:'Three.js · WebGL · Interaction',first:'portfolio-real.png',second:'portfolio-real.png',link:'https://github.com/TeoZ08/MeuSitePortfolio'},
];
