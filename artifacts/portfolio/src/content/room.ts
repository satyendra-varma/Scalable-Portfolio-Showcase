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

export const projects: {
  id: ProjectId;
  name: string;
  context: string;
  contribution: string;
  mechanisms: string;
  link: string | null;
}[] = [
  {
    id: 'crm',
    name: 'Enterprise CRM Platform',
    context: 'Enterprise multi-tenant CRM.',
    contribution:
      'Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design.',
    mechanisms:
      'MediatR CQRS, JWT/RBAC authorization, EF Core global query filters for soft deletes, Redis distributed caching.',
    link: validateUrl(CRM_LINK, 'CRM_LINK'),
  },
  {
    id: 'ecommerce',
    name: 'Cloud E-Commerce Platform',
    context: 'Full-stack e-commerce infrastructure.',
    contribution:
      'Developed and deployed containerized infrastructure using C# .NET Core and MSSQL on AWS EC2 with Docker.',
    mechanisms: 'NGINX reverse proxy, Certbot SSL, xUnit tests.',
    link: validateUrl(ECOMMERCE_LINK, 'ECOMMERCE_LINK'),
  },
];

/** Skill -> projects where the source explicitly attributes it. Absent = general skill only. */
export const projectEvidence: Record<string, ProjectId[]> = {
  'C#': ['ecommerce'],
  '.NET 8': ['crm'],
  'Entity Framework Core': ['crm'],
  'SQL Server/MSSQL': ['ecommerce'],
  'JWT Auth': ['crm'],
  RBAC: ['crm'],
  'AWS EC2': ['ecommerce'],
  Docker: ['ecommerce'],
  NGINX: ['ecommerce'],
  Certbot: ['ecommerce'],
  DDD: ['crm'],
  MediatR: ['crm'],
  Redis: ['crm'],
  xUnit: ['ecommerce'],
  'EF Core global query filters': ['crm'],
};

export const skillGroups: { label: string; skills: string[] }[] = [
  {
    label: 'Backend',
    skills: ['C#', '.NET 8', 'ASP.NET Core', 'Web API', 'MVC', 'Entity Framework Core', 'LINQ', 'REST APIs'],
  },
  { label: 'Frontend', skills: ['React', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'Bootstrap'] },
  {
    label: 'Data & security',
    skills: ['SQL Server/MSSQL', 'PostgreSQL', 'SQLite', 'Oracle DB', 'JWT Auth', 'RBAC'],
  },
  {
    label: 'Cloud & delivery',
    skills: ['AWS EC2', 'AWS S3', 'Docker', 'GitHub Actions', 'Jenkins', 'NGINX', 'Certbot', 'Git', 'CI/CD', 'Kubernetes (familiarity)'],
  },
  {
    label: 'Architecture & testing',
    skills: ['DDD', 'MediatR', 'MassTransit', 'Redis', 'xUnit', 'Serilog', 'EF Core global query filters'],
  },
  {
    label: 'Practices',
    skills: ['Agile/Scrum', 'SDLC', 'Code Review', 'Debugging', 'Production Support'],
  },
];

export const experience = [
  {
    org: 'Crescenza Consulting Group',
    title: 'Software Engineer (Contract)',
    dates: 'Apr 2023 – Present (as stated in resume)',
    points: ['Enterprise CRM Platform', 'Cloud E-Commerce Platform'],
  },
  {
    org: 'Nanomindz Technologies',
    title: '.NET Developer, India',
    dates: 'Jul 2020 – Jun 2021',
    points: [
      'Developed RESTful Web APIs and WCF services in C#.',
      'Optimized SQL Server and Oracle stored procedures, indexes and complex queries, reducing complex query execution time by 35%.',
      'Containerized legacy application components using Docker and integrated them into Jenkins CI/CD pipelines.',
    ],
  },
];

export const education = {
  degree: "Master's in Applied Computer Science",
  school: 'Fairleigh Dickinson University, Vancouver, BC, Canada',
  dates: 'Sep 2021 – Apr 2023',
  focus: 'Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing.',
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
