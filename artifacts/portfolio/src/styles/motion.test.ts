import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Room motion rule: animate transform and opacity only (smooth, and safe to switch off).
const ALLOWED = new Set(['transform', 'opacity']);
const roots = [resolve(__dirname), resolve(__dirname, '../variants')].filter(existsSync);

const cssFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return cssFiles(path);
    return name.endsWith('.css') ? [path] : [];
  });

const strip = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Splits on commas that are not inside parentheses (cubic-bezier(...) has commas). */
const splitTop = (value: string) => {
  const parts: string[] = [];
  let depth = 0, start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    else if (value[i] === ')') depth--;
    else if (value[i] === ',' && depth === 0) { parts.push(value.slice(start, i)); start = i + 1; }
  }
  parts.push(value.slice(start));
  return parts.map((p) => p.replace('!important', '').trim()).filter(Boolean);
};

function keyframeProps(css: string) {
  const found: { name: string; prop: string }[] = [];
  const re = /@keyframes\s+([\w-]+)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css))) {
    let depth = 1, i = re.lastIndex;
    for (; i < css.length && depth > 0; i++) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; }
    const body = css.slice(re.lastIndex, i - 1);
    for (const step of body.matchAll(/\{([^{}]*)\}/g)) {
      for (const decl of step[1].split(';')) {
        const prop = decl.split(':')[0].trim().toLowerCase();
        if (prop) found.push({ name: m[1], prop });
      }
    }
  }
  return found;
}

function transitionProps(css: string) {
  const found: string[] = [];
  for (const m of css.matchAll(/(?:^|[;{\s])transition(-property)?\s*:\s*([^;}]+)/g)) {
    for (const item of splitTop(m[2])) {
      const first = item.split(/\s+/)[0].toLowerCase();
      if (m[1]) item.split(/\s+/).forEach((p) => found.push(p.toLowerCase()));
      else found.push(first);
    }
  }
  return found;
}

describe('room motion uses transform and opacity only', () => {
  const files = roots.flatMap(cssFiles);

  it('finds the room stylesheets', () => {
    expect(files.map((f) => relative(resolve(__dirname, '..'), f).replace(/\\/g, '/'))).toContain('styles/room.css');
  });

  for (const file of files) {
    const name = relative(resolve(__dirname, '..'), file).replace(/\\/g, '/');
    const css = strip(readFileSync(file, 'utf8'));

    it(`${name}: keyframes animate only transform/opacity`, () => {
      const bad = keyframeProps(css).filter((k) => !ALLOWED.has(k.prop));
      expect(bad).toEqual([]);
    });

    it(`${name}: transitions only transform/opacity (or none)`, () => {
      const bad = transitionProps(css).filter((p) => !ALLOWED.has(p) && p !== 'none');
      expect(bad).toEqual([]);
    });
  }
});
