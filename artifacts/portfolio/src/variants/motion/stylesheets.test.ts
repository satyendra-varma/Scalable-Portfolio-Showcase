import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Contracts of the room-motion stylesheets, read from the files as text.
const dir = __dirname;
const read = (name: string) => readFileSync(resolve(dir, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

type Rule = { selectors: string[]; media: string | null; body: string };

/** Splits on commas that are not inside brackets or parentheses. */
const splitSelectors = (list: string) => {
  const parts: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < list.length; i++) {
    if ('([' .includes(list[i])) depth++;
    else if (')]'.includes(list[i])) depth--;
    else if (list[i] === ',' && depth === 0) { parts.push(list.slice(start, i)); start = i + 1; }
  }
  parts.push(list.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
};

/** Every style rule with the @media prelude it sits in (keyframes are skipped). */
function rules(css: string, media: string | null = null): Rule[] {
  const out: Rule[] = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    let depth = 1, j = open + 1;
    for (; j < css.length && depth > 0; j++) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; }
    const prelude = css.slice(i, open).trim();
    const body = css.slice(open + 1, j - 1);
    if (prelude.startsWith('@media')) out.push(...rules(body, prelude));
    else if (!prelude.startsWith('@')) out.push({ selectors: splitSelectors(prelude), media, body });
    i = j;
  }
  return out;
}

describe('lite.css, the short openings', () => {
  const lite = rules(read('lite.css'));

  it('has rules, and every selector is scoped by data-lite or data-opening, so it can never touch the full opening or the room at rest', () => {
    expect(lite.length).toBeGreaterThan(10);
    for (const rule of lite) for (const selector of rule.selectors) expect(selector, selector).toMatch(/\[data-lite|\[data-opening=/);
  });

  it('starts every selector with .rm or .rv.rm', () => {
    for (const rule of lite) for (const selector of rule.selectors) expect(selector, selector).toMatch(/^(\.rv\.rm|\.rm)\b/);
  });

  it('draws no line', () => {
    expect(read('lite.css')).not.toMatch(/stroke-dash/);
  });
});

describe('touch.css, tap in place of hover', () => {
  const touch = rules(read('touch.css'));

  it('has rules, starting every selector with .rm, and draws no line', () => {
    expect(touch.length).toBeGreaterThan(10);
    for (const rule of touch) for (const selector of rule.selectors) expect(selector, selector).toMatch(/^(\.rv\.rm|\.rm)\b/);
    expect(read('touch.css')).not.toMatch(/stroke-dash/);
  });

  it('keeps every rule inside a (hover: none) block, except the tap targets, which are for phones and touch screens', () => {
    for (const rule of touch) {
      expect(rule.media, rule.selectors.join(', ')).not.toBeNull();
      if (!rule.media!.includes('(hover: none)') || rule.media!.includes('max-width')) {
        expect(rule.media).toBe('@media (max-width: 600px), (hover: none)');
        expect(rule.selectors.join(' ')).toMatch(/\.rv-hotspot(::before)?$/);
      }
    }
  });

  it('gives every label a hit area at least 44px by 44px', () => {
    const hit = touch.find((r) => r.selectors.includes('.rm .rv-hotspot::before'))!;
    expect(hit.body).toMatch(/min-width:\s*44px/);
    expect(hit.body).toMatch(/min-height:\s*44px/);
  });

  it('lets only Power-on lift an object whose panel is open', () => {
    const open = touch.filter((r) => r.selectors.some((s) => s.includes('[data-open=')));
    expect(open.length).toBe(10);
    for (const rule of open) expect(rule.selectors.join(' ')).toContain("[data-motion='b']");
    // the neutralising rules (five objects, a layer and a glow each) cover Off as well
    const neutral = touch.filter((r) => r.selectors.some((s) => s.includes(':hover:not(:focus-visible)')));
    expect(neutral.flatMap((r) => r.selectors)).toHaveLength(10);
    for (const rule of neutral) expect(rule.selectors.join(' ')).not.toContain("[data-motion='b']");
  });
});

describe('the other room-motion stylesheets', () => {
  it('power.css holds the 4-second values in its base rule', () => {
    const base = rules(read('power.css')).find((r) => r.selectors.includes(".rv.rm[data-motion='b']"))!;
    expect(base.body).toMatch(/--rm-travel:\s*2\.3;/);
    expect(base.body).toMatch(/--rm-k:\s*\.8;/);
  });

  it('no file in the motion folder mentions data-speed any more', () => {
    const files = readdirSync(dir).filter((f) => /\.(css|tsx?)$/.test(f) && !/\.test\./.test(f));
    expect(files.length).toBeGreaterThan(10);
    for (const f of files) expect(readFileSync(resolve(dir, f), 'utf8'), f).not.toContain('data-speed');
  });

  it('fit.css fits both Power-on and Off, so it names no single motion', () => {
    expect(read('fit.css')).not.toContain("[data-motion='b']");
    expect(read('fit.css')).toContain('[data-motion]');
  });

  it("header.css's 36px top padding is inside the max-width: 600px block only", () => {
    const withPadding = rules(read('header.css')).filter((r) => /padding-top:\s*36px/.test(r.body));
    expect(withPadding.length).toBeGreaterThan(0);
    for (const rule of withPadding) expect(rule.media).toBe('@media (max-width: 600px)');
  });

  it('room.css has the reduced-motion safety net', () => {
    const net = rules(read('room.css')).find((r) => r.media?.includes('prefers-reduced-motion: reduce'))!;
    expect(net.selectors).toEqual(['.rv.rm *', '.rv.rm *::before', '.rv.rm *::after']);
    expect(net.body).toMatch(/animation:\s*none !important/);
    expect(net.body).toMatch(/transition:\s*none !important/);
  });
});
