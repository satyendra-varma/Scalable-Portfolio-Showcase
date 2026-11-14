import type { CSSProperties } from 'react';
import { Link, useParams } from 'wouter';
import { useDocumentMeta, useNoIndex } from '@/hooks/use-document-meta';
import NotFound from '@/pages/not-found';
import { findAccent, findVariant, variants } from '@/variants/registry';
import { scenes } from '@/variants/scenes';
import { VariantRoom } from '@/variants/VariantRoom';

const BASE = '/room-concepts';

/** Owner's comparison page: the room concepts and their accent options, one click apart. Not for search engines. */
export default function RoomConcepts() {
  const { id, accent: accentId } = useParams<{ id?: string; accent?: string }>();
  const variant = id === undefined ? variants[0] : findVariant(id);
  const accent = variant && findAccent(variant, accentId);

  useDocumentMeta('Room concepts | Satyendra Varma Nadimpalli', 'Three concepts of the engineer’s room, each in three accent options, side by side for comparison.');
  useNoIndex();

  if (!variant || !accent) return <NotFound />;

  return (
    <div className="rv-page">
      {/* Keyed by concept only: switching accents recolours the room in place. */}
      <VariantRoom key={variant.id} variant={variant} accent={accent} {...scenes[variant.id]} />
      <nav className="rv-dock" aria-label="Room concepts" data-testid="variant-dock">
        <ul className="rv-dock-list rv-dock-variants" aria-label="Concept">
          {variants.map((v) => (
            <li key={v.id}>
              <Link
                href={`${BASE}/${v.id}`}
                className="rv-dock-link"
                aria-current={v.id === variant.id ? 'true' : undefined}
                data-testid={`link-variant-${v.id}`}
              >
                <span className="rv-dock-tri" aria-hidden="true">
                  {v.accents.map((a) => <i key={a.id} style={{ background: a.hex }} />)}
                </span>
                <span className="rv-dock-name">{v.number}. {v.name}</span>
                <span className="rv-dock-meta">{v.drawing} · {v.idleStyle}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="rv-dock-list rv-dock-accents" aria-label={`${variant.name} accent`} data-testid="accent-switcher">
          {variant.accents.map((a) => (
            <li key={a.id}>
              <Link
                href={`${BASE}/${variant.id}/${a.id}`}
                className="rv-dock-link"
                aria-current={a.id === accent.id ? 'page' : undefined}
                style={{ '--sw': a.hex } as CSSProperties}
                data-testid={`link-accent-${a.id}`}
              >
                <span className="rv-dock-swatch" aria-hidden="true" />
                <span className="rv-dock-name">{a.name}</span>
                <span className="rv-dock-meta">{a.hex}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
