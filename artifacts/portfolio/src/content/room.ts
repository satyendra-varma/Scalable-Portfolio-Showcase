/**
 * Allowlisted content for the Engineer's Room.
 * Sourced only from docs/CONTENT.md (checked against the resume).
 */
import { validateUrl } from '@/lib/project-links';
import { CRM_LINK, ECOMMERCE_LINK } from './site';

export const hero = {
  name: 'Satyendra Varma Nadimpalli',
  role: 'Full Stack .NET Software Engineer',
  positioning:
    'Backend-led full-stack engineer building scalable .NET systems and shipping them end to end.',
};

export type ProjectId = 'crm' | 'ecommerce';

// Every string below is copied verbatim from docs/RESUME-SOURCE.md (room.test.tsx checks this).
export const projects: {
  id: ProjectId;
  name: string;
  points: string[];
  link: string | null;
}[] = [
  {
    id: 'crm',
    name: 'Enterprise CRM Platform',
    points: [
      'Multi-tenant enterprise CRM built with .NET 8 and Domain-Driven Design',
      'Secure JWT and RBAC authorization',
      'EF Core Global Query Filters for automated soft deletes',
      'Redis distributed caching with MediatR CQRS handlers',
    ],
    link: validateUrl(CRM_LINK, 'CRM_LINK'),
  },
  {
    id: 'ecommerce',
    name: 'Cloud E-Commerce Platform',
    points: [
      'Containerized full-stack e-commerce platform: C# .NET Core, MSSQL, Docker',
      'Deployed on AWS EC2, with NGINX reverse proxy and Certbot SSL',
      'Backed by xUnit unit tests',
    ],
    link: validateUrl(ECOMMERCE_LINK, 'ECOMMERCE_LINK'),
  },
];

/** Skill -> projects whose source entry names it. Absent = general skill only. */
export const projectEvidence: Record<string, ProjectId[]> = {
  'C#': ['ecommerce'],
  '.NET 8': ['crm'],
  'Entity Framework Core': ['crm'],
  'SQL Server (MSSQL)': ['ecommerce'],
  'JWT auth': ['crm'],
  RBAC: ['crm'],
  'AWS (EC2, S3)': ['ecommerce'],
  Docker: ['ecommerce'],
  NGINX: ['ecommerce'],
  Certbot: ['ecommerce'],
  'Domain-Driven Design (DDD)': ['crm'],
  MediatR: ['crm'],
  Redis: ['crm'],
  xUnit: ['ecommerce'],
};

export const skillGroups: { label: string; skills: string[] }[] = [
  {
    label: 'Backend',
    skills: ['C#', '.NET 8', 'ASP.NET Core', 'Web API', 'MVC', 'Entity Framework Core', 'LINQ', 'REST APIs'],
  },
  { label: 'Frontend', skills: ['React', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'Bootstrap'] },
  { label: 'Databases', skills: ['SQL Server (MSSQL)', 'PostgreSQL', 'SQLite', 'Oracle DB'] },
  { label: 'Security', skills: ['JWT auth', 'RBAC'] },
  {
    label: 'Cloud and DevOps',
    skills: ['AWS (EC2, S3)', 'Docker', 'Kubernetes (familiarity)', 'GitHub Actions', 'Jenkins', 'NGINX', 'Certbot', 'Git', 'CI/CD'],
  },
  {
    label: 'Architecture and testing',
    skills: ['Domain-Driven Design (DDD)', 'MediatR', 'MassTransit', 'Redis', 'xUnit', 'Serilog'],
  },
  {
    label: 'Development practices',
    skills: ['Agile/Scrum', 'SDLC', 'Code Review', 'Debugging', 'Production Support'],
  },
];

export const experience = [
  {
    org: 'Crescenza Consulting Group',
    title: 'Software Engineer (Contract)',
    dates: 'Apr 2023 to present',
    points: ['Enterprise CRM Platform', 'Cloud E-Commerce Platform'],
  },
  {
    org: 'Nanomindz Technologies',
    title: '.NET Developer, India',
    dates: 'Jul 2020 to Jun 2021',
    points: [
      'Developed backend RESTful Web APIs and WCF services in C# for internal enterprise subsystems and web clients',
      'Optimized SQL Server and Oracle stored procedures, indexes, and queries, reducing complex query execution times by 35%',
      'Containerized legacy components with Docker and integrated them into Jenkins CI/CD pipelines in an Agile/Scrum environment',
    ],
  },
];

export const education = {
  degree: "Master's in Applied Computer Science",
  school: 'Fairleigh Dickinson University, Vancouver, BC, Canada',
  dates: 'Sep 2021 to Apr 2023',
  focus: 'Focus: Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing.',
};

export const contact = {
  email: 'satyendrasatya447@gmail.com',
  linkedin: 'https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247',
  location: 'Vancouver, BC, Canada',
};

export type SourceLabel = 'From resume' | 'Representative design (to confirm)';

export const crmFlow: { title: string; source: SourceLabel; note: string }[] = [
  { title: 'Client request', source: 'Representative design (to confirm)', note: 'A client calls the CRM API. Client type and entry point are not stated in the resume.' },
  { title: 'HTTPS', source: 'Representative design (to confirm)', note: 'Transport security for the CRM is assumed here; the CRM deployment topology is not documented.' },
  { title: 'JWT validation', source: 'From resume', note: 'Component from resume: the CRM uses JWT authorization. Its position in this sequence is representative.' },
  { title: 'RBAC authorization', source: 'From resume', note: 'Component from resume: RBAC authorization in the CRM. Where and when checks run is representative.' },
  { title: 'API endpoint', source: 'Representative design (to confirm)', note: 'A .NET 8 endpoint receives the request. Endpoint style and routing are not specified.' },
  { title: 'MediatR dispatch', source: 'From resume', note: 'Component from resume: MediatR CQRS. Its position in this sequence is representative.' },
  { title: 'Handler', source: 'Representative design (to confirm)', note: 'A query or command handler runs domain logic shaped by Domain-Driven Design. Handler structure is representative.' },
  { title: 'Redis check', source: 'From resume', note: 'Component from resume: Redis distributed caching. The cache-check step and its order are representative.' },
  { title: 'EF Core query on SQL Server', source: 'Representative design (to confirm)', note: 'EF Core global query filters for soft deletes are from the resume. The CRM database engine (SQL Server) and whether filters apply to every read are unconfirmed.' },
  { title: 'Response', source: 'Representative design (to confirm)', note: 'The result returns to the client. Response shape and status handling are not documented.' },
];

export const deferredFlows: { project: string; flows: string[] }[] = [
  { project: 'Enterprise CRM Platform', flows: ['CRM auth and RBAC', 'CRM read path with Redis', 'CRM write path', 'CRM soft delete'] },
  { project: 'Cloud E-Commerce Platform', flows: ['E-commerce request path', 'E-commerce build and deploy'] },
  { project: 'Nanomindz Technologies', flows: ['Legacy integration', 'Query tuning', 'Container CI/CD'] },
];

export const flowSequenceNote =
  'Sequence, ordering and topology are representative design (to confirm). "From resume" means only that the component is used in the project; it does not confirm its position in this flow.';
