import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Room motion rule: animate transform and opacity only (smooth, and safe to switch off).
const ALLOWED = new Set(['transform', 'opacity']);

/**
 * The one named exception to the rule. The owner allowed /room-motion's opening to draw its lines (docs/BRIEF-room-motion.md,
 * decision 8): in this file only, the keyframes with this name may animate this property. Nothing else is excused:
 * not another file, another keyframe, another property, and never a transition.
 */
const LINE_DRAWING = { file: 'variants/motion/power.css', keyframes: 'rm-b-draw', prop: 'stroke-dashoffset' } as const;
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

/** What a stylesheet (given by its path under src/) animates in keyframes beyond transform and opacity, minus the named exception. */
const keyframeOffences = (file: string, css: string) =>
  keyframeProps(css).filter(
    (k) => !ALLOWED.has(k.prop) && !(file === LINE_DRAWING.file && k.name === LINE_DRAWING.keyframes && k.prop === LINE_DRAWING.prop),
  );

describe('room motion uses transform and opacity only', () => {
  const files = roots.flatMap(cssFiles);

  it('finds the room stylesheets', () => {
    expect(files.map((f) => relative(resolve(__dirname, '..'), f).replace(/\\/g, '/'))).toContain('styles/room.css');
  });

  for (const file of files) {
    const name = relative(resolve(__dirname, '..'), file).replace(/\\/g, '/');
    const css = strip(readFileSync(file, 'utf8'));

    it(`${name}: keyframes animate only transform/opacity`, () => {
      const bad = keyframeOffences(name, css);
      expect(bad).toEqual([]);
    });

    it(`${name}: transitions only transform/opacity (or none)`, () => {
      const bad = transitionProps(css).filter((p) => !ALLOWED.has(p) && p !== 'none');
      expect(bad).toEqual([]);
    });
  }
});

describe('the line-drawing exception', () => {
  const draw = '@keyframes rm-b-draw { from { stroke-dashoffset: var(--len); } to { stroke-dashoffset: 0; } }';

  it('is still in use: power.css really animates stroke-dashoffset in rm-b-draw', () => {
    const css = strip(readFileSync(resolve(__dirname, '..', LINE_DRAWING.file), 'utf8'));
    expect(keyframeProps(css)).toContainEqual({ name: LINE_DRAWING.keyframes, prop: LINE_DRAWING.prop });
    expect(keyframeOffences(LINE_DRAWING.file, css)).toEqual([]);
  });

  it('excuses that keyframe in that file and nothing else', () => {
    expect(keyframeOffences(LINE_DRAWING.file, draw)).toEqual([]);
    // the same keyframe in any other file is rejected
    expect(keyframeOffences('variants/motion/lite.css', draw)).toHaveLength(2);
    expect(keyframeOffences('styles/room.css', draw)).toHaveLength(2);
    // another keyframe name, or another property, in the excused file is rejected
    expect(keyframeOffences(LINE_DRAWING.file, draw.replace('rm-b-draw', 'rm-b-other'))).toHaveLength(2);
    expect(keyframeOffences(LINE_DRAWING.file, '@keyframes rm-b-draw { from { stroke-dasharray: 0; } to { top: 0; } }')).toHaveLength(2);
  });

  it('never excuses a transition', () => {
    expect(transitionProps('.x { transition: stroke-dashoffset .3s; }')).toEqual(['stroke-dashoffset']);
    expect(transitionProps('.x { transition-property: stroke-dashoffset; }')).toEqual(['stroke-dashoffset']);
  });
});
