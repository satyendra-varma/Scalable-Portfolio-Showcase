import type { ComponentType } from 'react';
import type { VariantId } from './registry';
import type { SceneProps } from './Stage';
import IsometricScene from './isometric/Scene';
import ElevationScene from './elevation/Scene';
import PlanScene from './plan/Scene';
import ExplodedScene from './exploded/Scene';

export const scenes: Record<VariantId, ComponentType<SceneProps>> = {
  isometric: IsometricScene,
  elevation: ElevationScene,
  plan: PlanScene,
  exploded: ExplodedScene,
};
