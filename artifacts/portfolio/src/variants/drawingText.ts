import { experience, hero, projects, skillGroups } from '@/content/room';

/** Decorative strings the room drawings used before round 2. */
export const DECORATIVE_TEXT = ['ROOM_01 / 4.20 m', '> dotnet run', '// scale 1:40'] as const;

/**
 * Every word a drawing or hero decoration may show: the decorative strings plus content strings from
 * room.ts, which room.source.test.ts keeps identical to docs/RESUME-SOURCE.md. In a drawing, import the
 * content (skillGroups, projects, experience, hero) and render it; never retype it. CRM flow step names
 * are not included: they are shown only in the System Explorer.
 */
export const DRAWING_TEXT: ReadonlySet<string> = new Set<string>([
  ...DECORATIVE_TEXT,
  ...skillGroups.flatMap((g) => g.skills),
  ...projects.map((p) => p.name),
  ...experience.map((e) => e.org),
  hero.name,
  hero.role,
]);
