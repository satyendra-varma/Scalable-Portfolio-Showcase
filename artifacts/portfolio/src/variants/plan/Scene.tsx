import { VariantStage, type HotspotPositions, type SceneProps } from '../Stage';
import { Radar } from './Art';
import { DesktopPlan, MobilePlan } from './Plan';
import './plan.css';

// Desktop: viewBox 800x600 (x/8, y/6). Phone: viewBox 400x560 (x/4, y/5.6).
const positions: HotspotPositions = {
  explorer: { x: 81.25, y: 68.3, mobile: { x: 50, y: 45.5 } },
  skills: { x: 18.75, y: 36.7, mobile: { x: 23.75, y: 76.8 } },
  projects: { x: 23.1, y: 16.7, mobile: { x: 26.25, y: 60.7 } },
  experience: { x: 48.1, y: 26.7, mobile: { x: 80, y: 67.5 } },
  contact: { x: 37.5, y: 89.2, mobile: { x: 53.75, y: 92.9 } },
};

export default function PlanScene({ onOpen }: SceneProps) {
  return (
    <VariantStage onOpen={onOpen} positions={positions}>
      <svg viewBox="0 0 800 600" className="plan-svg plan-svg-d" aria-hidden="true" focusable="false">
        <DesktopPlan />
        <Radar cx={650} cy={270} r={140} />
      </svg>
      <svg viewBox="0 0 400 560" className="plan-svg plan-svg-m" aria-hidden="true" focusable="false">
        <MobilePlan />
        <Radar cx={200} cy={135} r={118} />
      </svg>
    </VariantStage>
  );
}
