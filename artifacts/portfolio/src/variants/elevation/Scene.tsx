import { BlueprintRoom, hotspots } from '@/components/room/RoomScene';
import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import './elevation.css';

// Placeholder: the current blueprint drawing, until this variation's own drawing replaces it.
const positions = Object.fromEntries(hotspots.map((h) => [h.id, { x: h.x, y: h.y }])) as HotspotPositions;

export default function ElevationScene({ onOpen }: SceneProps) {
  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <BlueprintRoom />
    </VariantStage>
  );
}
