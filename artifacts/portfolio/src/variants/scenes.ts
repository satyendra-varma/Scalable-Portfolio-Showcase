import type { ComponentType } from 'react';
import type { VariantId } from './registry';
import type { SceneProps } from './Stage';
import IsometricScene, { HeroDecor as IsometricHeroDecor } from './isometric/Scene';
import ElevationScene, { HeroDecor as ElevationHeroDecor } from './elevation/Scene';
import ExplodedScene, { HeroDecor as ExplodedHeroDecor } from './exploded/Scene';

/**
 * Each concept's drawing, plus optional hero decoration: aria-hidden visuals rendered inside the hero,
 * behind the shared heading text (null when a concept has none).
 */
export type SceneModule = { Scene: ComponentType<SceneProps>; HeroDecor: ComponentType | null };

export const scenes: Record<VariantId, SceneModule> = {
  isometric: { Scene: IsometricScene, HeroDecor: IsometricHeroDecor },
  elevation: { Scene: ElevationScene, HeroDecor: ElevationHeroDecor },
  exploded: { Scene: ExplodedScene, HeroDecor: ExplodedHeroDecor },
};
