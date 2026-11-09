import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contact, education, experience, hero, projectEvidence, projects, skillGroups } from './room';

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
