import { Layers3, Server, type LucideIcon } from 'lucide-react';

export const CONTACT = {
  name: 'Satyendra Varma Nadimpalli',
  role: 'Full Stack .NET Software Engineer',
  email: 'satyendrasatya447@gmail.com',
  linkedin: 'https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247',
  location: 'Vancouver, BC, Canada',
} as const;

export type ProjectId = 'crm' | 'ecommerce';

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  type: string;
  summary: string;
  outcome: string;
  outcomeLabel: string;
  stack: string[];
  details: string[];
  icon: LucideIcon;
  context: string;
  boundary: string;
};

export const projects: Project[] = [
  {
    id: 'crm',
    index: '01',
    title: 'Enterprise CRM Platform',
    type: 'MULTI-TENANT CRM · .NET 8',
    summary: 'A domain-driven CRM with authorization, soft deletes, distributed caching, and CQRS handlers.',
    outcome: 'Scalable multi-tenant CRM delivered',
    outcomeLabel: 'Resume-reported contribution',
    stack: ['.NET 8', 'DDD', 'JWT / RBAC', 'EF Core', 'Redis', 'MediatR'],
    details: [
      'Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design.',
      'Incorporated secure JWT/RBAC authorization and EF Core Global Query Filters for automated soft deletes.',
      'Paired Redis distributed caching with MediatR CQRS handlers.',
    ],
    icon: Layers3,
    context: 'Software Engineer (Contract), Crescenza Consulting Group, Apr 2023 – Present.',
    boundary:
      'The resume does not specify tenant counts, traffic, exact tenant-isolation mechanisms, or deployment topology, so none are claimed here.',
  },
  {
    id: 'ecommerce',
    index: '02',
    title: 'Cloud E-Commerce Platform',
    type: 'CLOUD DELIVERY · AWS EC2',
    summary: 'A containerized full-stack platform with tested .NET services and a configured web edge.',
    outcome: 'Containerized',
    outcomeLabel: 'full-stack infrastructure on AWS EC2',
    stack: ['C# .NET Core', 'MSSQL', 'Docker', 'AWS EC2', 'xUnit', 'NGINX', 'Certbot'],
    details: [
      'Developed and deployed a containerized full-stack e-commerce infrastructure using C# .NET Core, MSSQL, and Docker on AWS EC2.',
      'Backed the application with comprehensive xUnit unit testing.',
      'Configured NGINX reverse proxying and automated Certbot SSL encryption.',
    ],
    icon: Server,
    context: 'Software Engineer (Contract), Crescenza Consulting Group, Apr 2023 – Present.',
    boundary: 'No sales, payment-provider, traffic, or uptime figures are provided by the resume, so none are shown.',
  },
];

export const getProject = (id: string | undefined) => projects.find((p) => p.id === id);
