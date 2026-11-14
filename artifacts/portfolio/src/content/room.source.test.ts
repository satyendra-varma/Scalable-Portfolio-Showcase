import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contact, crmFlow, education, experience, flowSequenceNote, hero, projectEvidence, projects, skillGroups } from './room';

// The room may only show what docs/RESUME-SOURCE.md lists, in the same words.
// (__dirname, not import.meta.url: under jsdom the latter isn't a file: URL.)
const source = readFileSync(resolve(__dirname, '../../../../docs/RESUME-SOURCE.md'), 'utf8');
const lines = source.split(/\r?\n/).map((l) => l.trim());
// "[TO CONFIRM: ...]" notes qualify a line; they are not part of the wording shown.
const bare = lines.map((l) => l.replace(/\s*\[TO CONFIRM:[^\]]*\]/g, ''));

describe('room content matches RESUME-SOURCE.md', () => {
  it('hero', () => {
    expect(bare).toContain(`- Name: ${hero.name}`);
    expect(bare).toContain(hero.role);
    expect(bare).toContain(hero.positioning);
  });

  it('skill groups are the source skill lines, in order and wording', () => {
    for (const g of skillGroups) {
      expect(bare).toContain(`- ${g.label}: ${g.skills.join(', ')}`);
    }
  });

  it('EF Core Global Query Filters is an Architecture and testing chip and stays on the CRM card', () => {
    const arch = skillGroups.find((g) => g.label === 'Architecture and testing')!;
    expect(arch.skills).toContain('EF Core Global Query Filters');
    expect(projects.find((p) => p.id === 'crm')!.points).toContain('EF Core Global Query Filters for automated soft deletes');
    const chips = skillGroups.flatMap((g) => g.skills);
    expect(chips.filter((s) => s === 'Entity Framework Core')).toHaveLength(1);
    expect(new Set(chips).size).toBe(chips.length);
  });

  it('project evidence only maps skills the room shows', () => {
    const shown = new Set(skillGroups.flatMap((g) => g.skills));
    for (const skill of Object.keys(projectEvidence)) expect(shown).toContain(skill);
  });

  it('project cards are the source project bullets', () => {
    for (const p of projects) {
      expect(bare.some((l) => l.startsWith(`### ${p.name} (`))).toBe(true);
      for (const pt of p.points) expect(bare).toContain(`- ${pt}`);
    }
  });

  it('experience entries come from the source headings and bullets', () => {
    for (const e of experience) {
      // Project headings also name the employer, so match the role too.
      const role = e.title.split(', ')[0];
      const heading = bare.find((l) => l.startsWith(`### ${role}`) && l.includes(e.org));
      expect(heading).toBeDefined();
      for (const part of [...e.title.split(', '), e.dates]) expect(heading).toContain(part);
      for (const pt of e.points) {
        expect(bare.includes(`- ${pt}`) || bare.some((l) => l.startsWith(`### ${pt} (`))).toBe(true);
      }
    }
  });

  it('education and contact', () => {
    expect(bare).toContain(`${education.degree}, ${education.school}, ${education.dates}`);
    expect(bare).toContain(education.focus);
    expect(bare).toContain(`- Email: ${contact.email}`);
    expect(bare).toContain(`- LinkedIn: ${contact.linkedin}`);
    expect(bare).toContain(`- Location: ${contact.location}`);
  });
});

describe('the confirmed CRM facts', () => {
  const start = lines.indexOf('## Confirmed by the owner, 13 November 2026');
  const next = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  const section = lines.slice(start, next === -1 ? undefined : next);

  it('has the section, and every crmFlow stage and the flow note appear in it exactly', () => {
    expect(start).toBeGreaterThanOrEqual(0);
    crmFlow.forEach(({ title, source, note }, i) => {
      expect(section).toContain(`${i + 1}. ${title} (${source}): ${note}`);
    });
    expect(section).toContain(`Flow note: ${flowSequenceNote}`);
  });

  it('has nine Confirmed stages, Redis still from the resume, and PostgreSQL at stage 9', () => {
    expect(crmFlow.filter((s) => s.source === 'Confirmed')).toHaveLength(9);
    expect(crmFlow[7]).toEqual({
      title: 'Redis check',
      source: 'From resume',
      note: 'Component from resume: Redis distributed caching. The cache-check step and its order are representative.',
    });
    expect(crmFlow[8].title).toBe('EF Core query on PostgreSQL');
  });

  it('never names SQL Server or MSSQL for the CRM flow, and has no to-confirm wording', () => {
    for (const text of [...crmFlow.flatMap((s) => [s.title, s.note]), flowSequenceNote]) {
      expect(text).not.toMatch(/SQL Server|MSSQL|to confirm/i);
    }
  });

  it('records the skill evidence: PostgreSQL is CRM evidence, React stays general', () => {
    expect(section).toContain('- PostgreSQL is project evidence for the Enterprise CRM Platform: the CRM database is PostgreSQL.');
    expect(section).toContain('- React stays a general skill, not project evidence.');
    expect(projectEvidence.PostgreSQL).toEqual(['crm']);
    expect(projectEvidence.React).toBeUndefined();
    const databases = skillGroups.find((g) => g.label === 'Databases')!.skills;
    expect(databases.filter((s) => projectEvidence[s])).toEqual(['SQL Server (MSSQL)', 'PostgreSQL']);
  });

  it('lists the nine confirmed facts', () => {
    const facts = [
      '- A React front end calls the API.',
      '- It is deployed and served over HTTPS.',
      '- Endpoints are controllers.',
      '- JWT validation and role checks run before the controller, through ASP.NET Core authentication and authorization.',
      '- Every request goes through MediatR.',
      '- The database is PostgreSQL.',
      '- Soft-delete query filters apply only to entities that can be soft-deleted.',
      '- The API returns DTOs with HTTP status codes.',
      '- Not confirmed: the error format, and where the Redis check sits.',
    ];
    expect(facts).toHaveLength(9);
    for (const f of facts) expect(section).toContain(f);
  });
});
