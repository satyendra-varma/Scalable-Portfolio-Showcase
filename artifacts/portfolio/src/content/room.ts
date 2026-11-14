/**
 * Allowlisted content for the Engineer's Room.
 * Content comes from docs/RESUME-SOURCE.md, including its "Confirmed by the owner, 13 November 2026" section.
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

// Every string below is copied verbatim from docs/RESUME-SOURCE.md (room.source.test.ts checks this).
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
  'EF Core Global Query Filters': ['crm'],
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
    skills: ['Domain-Driven Design (DDD)', 'MediatR', 'MassTransit', 'Redis', 'xUnit', 'Serilog', 'EF Core Global Query Filters'],
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

export type SourceLabel = 'From resume' | 'Representative design (to confirm)' | 'Confirmed';

export const crmFlow: { title: string; source: SourceLabel; note: string }[] = [
  { title: 'Client request', source: 'Confirmed', note: 'A React front end calls the CRM API.' },
  { title: 'HTTPS', source: 'Confirmed', note: 'The CRM is deployed and served over HTTPS.' },
  { title: 'JWT validation', source: 'Confirmed', note: 'Runs in the ASP.NET Core authentication pipeline, before the request reaches the controller.' },
  { title: 'RBAC authorization', source: 'Confirmed', note: 'Role checks run through ASP.NET Core authorization, before the controller code.' },
  { title: 'API endpoint', source: 'Confirmed', note: 'A .NET 8 controller receives the request.' },
  { title: 'MediatR dispatch', source: 'Confirmed', note: 'The controller sends a command or query through MediatR. Every request goes this way.' },
  { title: 'Handler', source: 'Confirmed', note: 'A command or query handler runs the domain logic.' },
  { title: 'Redis check', source: 'From resume', note: 'Component from resume: Redis distributed caching. The cache-check step and its order are representative.' },
  { title: 'EF Core query on PostgreSQL', source: 'Confirmed', note: 'The CRM database is PostgreSQL. Soft-delete query filters apply to the entities that can be soft-deleted.' },
  { title: 'Response', source: 'Confirmed', note: 'Returns DTOs with HTTP status codes. Error response format is not documented.' },
];

export type FlowStatus = 'working' | 'planned';

/** The System Explorer's ten flows, grouped by project and numbered 01-10 in this order. Only flow 01 has a diagram. */
export const explorerFlows: { project: string; flows: { title: string; status: FlowStatus }[] }[] = [
  {
    project: 'Enterprise CRM Platform',
    flows: [
      { title: 'CRM request lifecycle', status: 'working' },
      { title: 'CRM auth and RBAC', status: 'planned' },
      { title: 'CRM read path with Redis', status: 'planned' },
      { title: 'CRM write path', status: 'planned' },
      { title: 'CRM soft delete', status: 'planned' },
    ],
  },
  {
    project: 'Cloud E-Commerce Platform',
    flows: [
      { title: 'E-commerce request path', status: 'planned' },
      { title: 'E-commerce build and deploy', status: 'planned' },
    ],
  },
  {
    project: 'Nanomindz Technologies',
    flows: [
      { title: 'Legacy integration', status: 'planned' },
      { title: 'Query tuning', status: 'planned' },
      { title: 'Container CI/CD', status: 'planned' },
    ],
  },
];

export const flowSequenceNote =
  'The sequence is confirmed except the position of the Redis check.';
