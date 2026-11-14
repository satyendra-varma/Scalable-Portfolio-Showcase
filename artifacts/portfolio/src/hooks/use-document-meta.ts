import { useEffect } from 'react';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }, [title, description]);
}

let noIndexUsers = 0;
let noIndexRestore: (() => void) | undefined;

/**
 * Marks the page noindex, nofollow while at least one component using it is mounted, then restores what the
 * robots meta said before (index.html ships "index, follow"), or removes the meta if there was none.
 */
export function useNoIndex() {
  useEffect(() => {
    if (noIndexUsers++ === 0) {
      const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
      const previous = existing?.getAttribute('content') ?? null;
      const meta = existing ?? Object.assign(document.createElement('meta'), { name: 'robots' });
      meta.setAttribute('content', 'noindex, nofollow');
      if (!existing) document.head.appendChild(meta);
      noIndexRestore = () => {
        if (existing && previous !== null) existing.setAttribute('content', previous);
        else meta.remove();
      };
    }
    return () => {
      if (--noIndexUsers === 0) {
        noIndexRestore?.();
        noIndexRestore = undefined;
      }
    };
  }, []);
}
