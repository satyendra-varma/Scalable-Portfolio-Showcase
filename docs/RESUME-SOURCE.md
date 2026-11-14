# Resume source (public-safe)

Use only this file for site content. Do not add facts that are not listed here.

## Contact
- Name: Satyendra Varma Nadimpalli
- Email: satyendrasatya447@gmail.com
- LinkedIn: https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247
- Location: Vancouver, BC, Canada

## Target role
Full Stack .NET Software Engineer

## Positioning
Owner-approved positioning line (based on resume).
Backend-led full-stack engineer building scalable .NET systems and shipping them end to end.

## Professional summary
Full Stack .NET Software Engineer with 4+ years of software engineering experience designing distributed architectures, cloud services, and high-performance backend systems. Specialized in C#, .NET 8, ASP.NET Core, Redis distributed caching, SQL Server, Docker, and AWS. Experienced in Domain-Driven Design, CI/CD pipelines. [TO CONFIRM: "4+ years" and "microservices orchestration"]

## Skills
- Backend: C#, .NET 8, ASP.NET Core, Web API, MVC, Entity Framework Core, LINQ, REST APIs
- Frontend: React, TypeScript, JavaScript, HTML5/CSS3, Bootstrap
- Databases: SQL Server (MSSQL), PostgreSQL, SQLite, Oracle DB
- Security: JWT auth, RBAC
- Cloud and DevOps: AWS (EC2, S3), Docker, Kubernetes (familiarity), GitHub Actions, Jenkins, NGINX, Certbot, Git, CI/CD
- Architecture and testing: Domain-Driven Design (DDD), MediatR, MassTransit, Redis, xUnit, Serilog, EF Core Global Query Filters
- Development practices: Agile/Scrum, SDLC, Code Review, Debugging, Production Support

## Projects
### Enterprise CRM Platform (Crescenza Consulting Group, Apr 2023 to present)
- Multi-tenant enterprise CRM built with .NET 8 and Domain-Driven Design
- Secure JWT and RBAC authorization
- EF Core Global Query Filters for automated soft deletes
- Redis distributed caching with MediatR CQRS handlers
- Link: CRM_LINK (placeholder)

### Cloud E-Commerce Platform (Crescenza Consulting Group)
- Containerized full-stack e-commerce platform: C# .NET Core, MSSQL, Docker
- Deployed on AWS EC2, with NGINX reverse proxy and Certbot SSL
- Backed by xUnit unit tests
- Link: ECOMMERCE_LINK (placeholder)

## Experience
### Software Engineer (Contract), Crescenza Consulting Group, Apr 2023 to present
See the CRM and E-Commerce projects above.

### .NET Developer, Nanomindz Technologies, India, Jul 2020 to Jun 2021
- Developed backend RESTful Web APIs and WCF services in C# for internal enterprise subsystems and web clients
- Optimized SQL Server and Oracle stored procedures, indexes, and queries, reducing complex query execution times by 35%
- Containerized legacy components with Docker and integrated them into Jenkins CI/CD pipelines in an Agile/Scrum environment

## Education
Master's in Applied Computer Science, Fairleigh Dickinson University, Vancouver, BC, Canada, Sep 2021 to Apr 2023
Focus: Advanced Application Development, Web Architecture, Component Security & Secure Cryptographic Hashing.

## Confirmed by the owner, 13 November 2026
The owner went through the open questions about the Enterprise CRM Platform with their lead. These facts replace the earlier [TO CONFIRM] notes on the CRM's database and on soft-delete query filters.

### Facts
- A React front end calls the API.
- It is deployed and served over HTTPS.
- Endpoints are controllers.
- JWT validation and role checks run before the controller, through ASP.NET Core authentication and authorization.
- Every request goes through MediatR.
- The database is PostgreSQL.
- Soft-delete query filters apply only to entities that can be soft-deleted.
- The API returns DTOs with HTTP status codes.
- Not confirmed: the error format, and where the Redis check sits.

### Project links
- Both projects were contract work at Crescenza, so there are no repo or live links. The link line is hidden on both project cards. CRM_LINK and ECOMMERCE_LINK stay in the site config so a link can be added later.

### System Explorer wording, flow 01 (CRM request lifecycle)
Stage titles, source labels and notes exactly as the site shows them.
1. Client request (Confirmed): A React front end calls the CRM API.
2. HTTPS (Confirmed): The CRM is deployed and served over HTTPS.
3. JWT validation (Confirmed): Runs in the ASP.NET Core authentication pipeline, before the request reaches the controller.
4. RBAC authorization (Confirmed): Role checks run through ASP.NET Core authorization, before the controller code.
5. API endpoint (Confirmed): A .NET 8 controller receives the request.
6. MediatR dispatch (Confirmed): The controller sends a command or query through MediatR. Every request goes this way.
7. Handler (Confirmed): A command or query handler runs the domain logic.
8. Redis check (From resume): Component from resume: Redis distributed caching. The cache-check step and its order are representative.
9. EF Core query on PostgreSQL (Confirmed): The CRM database is PostgreSQL. Soft-delete query filters apply to the entities that can be soft-deleted.
10. Response (Confirmed): Returns DTOs with HTTP status codes. Error response format is not documented.
Flow note: The sequence is confirmed except the position of the Redis check.

## Excluded (do not use anywhere on the site)
- Phone number
- Street address
- Any internal project not listed above, including its name and metrics
- Any unrelated business or personal ventures
