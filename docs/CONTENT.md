# Content, sources, and publication rules

## Authority

The owner said: “resume is a single source of truth, dont assume anything. Just ask me for anything you want.”

Resume source: attached_assets/Satyendra_Varma_Resume_1793845881888.pdf.
Initial design/context brief: attached_assets/Pasted--You-ll-turn-your-background-into-a-visual-resume-built_1793845630976.txt.

The contextual brief defines desired behavior; it is not biographical evidence. The supplied LinkedIn URL is an approved contact destination, not permission to replace resume facts with unreviewed profile claims.

## Approved public contact

- Email: satyendrasatya447@gmail.com
- LinkedIn: https://www.linkedin.com/in/satyendra-varma-nadimpalli-56a199247
- Location exactly as provided in the resume: Vancouver, BC, Canada.
- Phone: do not publish, embed in page data, include in public AI context, or leave in downloadable files.
- No street address was provided.

Do not duplicate private source content into these public-content documents.

## Evidence register

| Source ID | Topic | Exact resume evidence | Allowed interpretation |
| --- | --- | --- | --- |
| positioning | Role | “Full Stack .NET Software Engineer with 4+ years of software engineering experience” | Use this wording; do not recalculate or inflate tenure from calendar dates. |
| crm | Enterprise CRM | “Delivered a scalable multi-tenant enterprise CRM using .NET 8 and Domain-Driven Design” | Discuss multitenancy and DDD as resume-reported contributions, without invented scale numbers. |
| crm-security | CRM mechanisms | “secure JWT/RBAC authorization, EF Core Global Query Filters for automated soft deletes, and Redis distributed caching paired with MediatR CQRS handlers” | These mechanisms are verified; exact tenant isolation, cache invalidation, queues, and deployment topology are not. |
| operations | Auditing engine | “automating complex balance calculations, shift scheduling, role-restricted record management, and reducing weekly reconciliation time by 15+ hours” | Report the 15+ hours outcome without inventing customers, revenue, team size, or screenshots. |
| ecommerce | Cloud e-commerce | “C# .NET Core, MSSQL, Docker” and “AWS EC2”, “xUnit”, “NGINX”, “Certbot SSL encryption” | Describe these technologies; do not invent checkout providers, sales figures, or uptime guarantees. |
| databases | Database impact | “reducing complex database query execution times by 35%” | Attribute this outcome to the Nanomindz experience, not CRM or e-commerce. |
| delivery | Earlier delivery work | “Containerized legacy application components using Docker and integrated them into Jenkins CI/CD build pipelines” | Attribute Jenkins work correctly; do not silently substitute GitHub Actions on that project. |
| education | Education | “Master’s in Applied Computer Science” and “Sep 2021 – Apr 2023” | Preserve institution and degree as written in the resume. |

Use the original resume for the full skills list, dates, and employer wording. Familiarity must remain familiarity, particularly Kubernetes. Skills listed globally are not proof that every project used them.

## Project publication

Requested highlights: CRM, Business Operations system, and custom e-commerce work. Initial ordering recommendation: CRM, Business Operations, e-commerce; owner can change it.

- CRM: public URL pending.
- E-commerce: public URL pending; the resume establishes one Cloud E-Commerce Platform. Do not invent multiple distinct project histories from the owner's broader wording.
- Business Operations: internal tool, no public URL, no disclosure beyond resume facts.
- Future screenshots, code excerpts, or employer branding require permission and source review.

## Optional links

Edit docs/project-links.json. Use null until a real approved HTTPS URL exists. Never substitute example.com, #, fabricated repositories, or invented demos.

The implementation must consume this file through a validated content step. Filling it is not automatic publication; build/release changes are still required.

## Ambassador content

Generate a separate public-safe knowledge object from the approved facts. Never pass the raw PDF, uploads directory, private phone, or unreviewed documents to the model. Every answer must be traceable to approved facts. Unsupported salary, relocation, availability, management history, or unlisted technologies must not be inferred.

## Resume download

Produce and inspect a public-safe PDF before enabling the download. Preserve accurate content while removing phone data and checking the text layer and metadata. The original upload stays outside static public assets.
