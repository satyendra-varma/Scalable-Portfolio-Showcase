import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Circle, Code2, Layers3, Network } from 'lucide-react';
import { CONTACT } from '@/content/portfolio';

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (y: number) => (reduce ? { opacity: 1, y: 0 } : { opacity: 0, y });
  return (
    <section className="sx-hero" id="top" aria-labelledby="hero-title">
      <div className="sx-hero-grid">
        <motion.div className="sx-hero-copy" initial={enter(16)} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.65 }}>
          <p className="sx-kicker"><span className="sx-live-dot" aria-hidden="true" /> FULL STACK ENGINEERING <span className="sx-kicker-sep" aria-hidden="true">/</span> VANCOUVER, BC</p>
          <h1 id="hero-title">Satyendra Varma<br /><em>Nadimpalli</em></h1>
          <p className="sx-role">{CONTACT.role}</p>
          <p className="sx-intro">I connect dependable .NET backend systems to practical business outcomes—with React and cloud delivery as part of the build.</p>
          <div className="sx-hero-actions">
            <a className="sx-button sx-button-accent" href="#explorer" data-testid="link-explore">Explore the work <ArrowDownRight size={16} aria-hidden="true" /></a>
            <a className="sx-text-link" href={`mailto:${CONTACT.email}`} data-testid="link-hero-contact">Get in touch <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </motion.div>

        <motion.aside className="sx-instrument" aria-label="Capability map, illustrative" initial={enter(22)} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.15 }}>
          <div className="sx-instrument-head"><span>CAPABILITY MAP</span><span className="sx-instrument-status"><Circle size={7} fill="currentColor" aria-hidden="true" /> ILLUSTRATIVE</span></div>
          <div className="sx-map" aria-hidden="true">
            <div className="sx-map-node sx-map-core"><Code2 size={18} /><b>.NET</b><small>BACKEND CORE</small></div>
            <div className="sx-map-link sx-link-a" />
            <div className="sx-map-node sx-map-react"><Layers3 size={16} /><b>React</b><small>INTERFACE</small></div>
            <div className="sx-map-link sx-link-b" />
            <div className="sx-map-node sx-map-cloud"><Network size={16} /><b>Cloud</b><small>DELIVERY</small></div>
            <span className="sx-map-orbit sx-orbit-one" /><span className="sx-map-orbit sx-orbit-two" />
            <span className="sx-map-label">SYSTEMS THINKING · BUSINESS CONTEXT</span>
          </div>
          <p className="sx-illustrative-note">Conceptual capability view — not a production architecture diagram.</p>
        </motion.aside>
      </div>
      <div className="sx-hero-foot">
        <span>4+ YEARS OF SOFTWARE ENGINEERING EXPERIENCE</span>
        <span className="sx-scroll-hint" aria-hidden="true">SCROLL TO EXPLORE <ArrowDownRight size={13} /></span>
      </div>
    </section>
  );
}
