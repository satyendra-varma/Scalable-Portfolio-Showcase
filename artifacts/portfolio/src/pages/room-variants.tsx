import { useEffect, type CSSProperties } from 'react';
import { Link, useParams } from 'wouter';
import { useDocumentMeta } from '@/hooks/use-document-meta';
import NotFound from '@/pages/not-found';
import { findVariant, variants } from '@/variants/registry';
import { scenes } from '@/variants/scenes';
import { VariantRoom } from '@/variants/VariantRoom';

/** Owner's comparison page: the room variants, one click apart. Not for search engines. */
export default function RoomVariants() {
  const { id } = useParams<{ id?: string }>();
  const variant = id === undefined ? variants[0] : findVariant(id);

  useDocumentMeta('Room variants | Satyendra Varma Nadimpalli', 'Three night-room versions of the engineer’s room, side by side for comparison.');
  useEffect(() => {
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.content;
    const meta = robots ?? Object.assign(document.createElement('meta'), { name: 'robots' });
    meta.content = 'noindex, nofollow';
    if (!robots) document.head.appendChild(meta);
    return () => { if (robots && previous !== undefined) robots.content = previous; else meta.remove(); };
  }, []);

  if (!variant) return <NotFound />;

  return (
    <div className="rv-page">
      <VariantRoom key={variant.id} variant={variant} Scene={scenes[variant.id]} />
      <nav className="rv-dock" aria-label="Room variants" data-testid="variant-dock">
        <ul className="rv-dock-list">
          {variants.map((v) => (
            <li key={v.id}>
              <Link
                href={`/room-variants/${v.id}`}
                className="rv-dock-link"
                aria-current={v.id === variant.id ? 'page' : undefined}
                style={{ '--sw': v.accentHex } as CSSProperties}
                data-testid={`link-variant-${v.id}`}
              >
                <span className="rv-dock-swatch" aria-hidden="true" />
                <span className="rv-dock-name">{v.number}. {v.name}</span>
                <span className="rv-dock-meta">{v.accentHex} · {v.idleStyle}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
