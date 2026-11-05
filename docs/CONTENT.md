# Approved content plan

Status: **planning only; not yet applied to the running site.**

## Source authority

- Resume: `attached_assets/Satyendra_Varma_Resume_1793845881888.pdf`.
- Latest scope brief: `attached_assets/Pasted-I-m-building-a-personal-portfolio-website-for-Satyendra_1793847251845.txt`.
- The resume supplies facts; the latest brief determines which facts are permitted for publication.
- The supplied LinkedIn URL is an approved destination, not permission to import additional claims.
- Do not publish source material outside this allowlist or hint at omitted material.

## Hero

Name: **Satyendra Varma Nadimpalli**

Role: **Full Stack .NET Software Engineer**

Exact positioning:

> Backend-led full-stack engineer building scalable .NET systems and shipping them end to end.

### Three recruiter takeaways

1. Designs scalable multi-tenant backends with .NET 8 and Domain-Driven Design.
2. Ships and runs systems end to end: Docker, AWS EC2, NGINX reverse proxy, Certbot SSL, CI/CD.
3. Improves performance: reduced complex database query times by **35% at Nanomindz Technologies**.

Do not generalize this metric to other work or infer scale, revenue, user counts or reliability guarantees.

## Work — exact order

### 1. Enterprise CRM Platform

- **Problem/context:** Enterprise multi-tenant CRM. The resume does not provide a more specific customer pain point; do not invent one.
- **Contribution:** Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design.
- **Tools/mechanisms:** MediatR CQRS, JWT/RBAC authorization, EF Core global query filters for soft deletes, Redis distributed caching.
- **Verified delivery:** The platform and mechanisms above are resume-backed. Exact deployment topology, tenant counts and quantified business impact are not provided.
- **Outcome: to be added**
- **Link config:** CRM_LINK.

### 2. Cloud E-Commerce Platform

- **Problem/context:** Full-stack e-commerce infrastructure. The resume does not establish a more detailed commercial problem.
- **Contribution:** Developed and deployed containerized infrastructure using C# .NET Core and MSSQL on AWS EC2 with Docker.
- **Tools/mechanisms:** NGINX reverse proxy, Certbot SSL, xUnit tests.
- **Verified delivery:** Development, deployment and the listed technologies are source-backed. Do not infer payment providers, sales figures, traffic or uptime.
- **Outcome: to be added**
- **Link config:** ECOMMERCE_LINK.

Outcome placeholders above are editorial reminders in this document. Until the owner supplies verified outcomes, public copy should describe supported delivery without presenting an invented result.

## Experience

### Crescenza Consulting Group

Software Engineer (Contract), Apr 2023 – Present, as stated in the supplied resume. Discuss only the two approved projects above. Do not recalculate tenure or assert independently verified current employment.

### Nanomindz Technologies

.NET Developer, India, Jul 2020 – Jun 2021.

- Developed RESTful Web APIs and WCF services in C#.
- Optimized SQL Server and Oracle stored procedures, indexes and complex queries, reducing complex query execution time by **35%**.
- Containerized legacy application components using Docker and integrated them into Jenkins CI/CD pipelines.

Do not substitute GitHub Actions for the source's Jenkins project attribution.

## Skills

Use resume wording and qualifications:

- Backend: C#, .NET 8, ASP.NET Core, Web API, MVC, Entity Framework Core, LINQ, REST APIs.
- Frontend: React, TypeScript, JavaScript, HTML5/CSS3, Bootstrap.
- Data/security: SQL Server/MSSQL, PostgreSQL, SQLite, Oracle DB, JWT Auth, RBAC.
- Cloud/delivery: AWS EC2/S3, Docker, GitHub Actions, Jenkins, NGINX, Certbot, Git, CI/CD; Kubernetes **familiarity**, not expertise.
- Architecture/testing: DDD, MediatR, MassTransit, Redis, xUnit, Serilog, EF Core global query filters.
- Practices: Agile/Scrum, SDLC, code review, debugging, production support.

A globally listed skill is not evidence that it was used in a particular project.

## Education

Master’s in Applied Computer Science, Fairleigh Dickinson University, Vancouver, BC, Canada. Sep 2021 – Apr 2023.

Listed focus: Advanced Application Development, Web Architecture, Component Security, Secure Cryptographic Hashing.

## Contact

- Email: satyendrasatya447@gmail.com
- LinkedIn: https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247
- Location: Vancouver, BC, Canada

No additional personal contact fields or address detail.

## Link presentation and editing

Plan one config file at `artifacts/portfolio/src/content/site.ts` (the portfolio's `src/content/site.ts`). It will contain CRM_LINK and ECOMMERCE_LINK.

Until supplied, each project card displays **Live link coming soon** as plain, non-clickable text. A real approved HTTPS URL replaces the corresponding value with a one-line edit and becomes a link after build/publication. Do not create competing configuration files or fake destinations.

## Open questions

1. What verified business outcomes, if any, may be added for either project? Until answered, keep the editorial outcome placeholders above.
2. What are the two approved live URLs? Their absence does not block a release with the required labels.
3. Should a newly reviewed resume download be included at all?
