import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowUpRight, Download, ExternalLink, Mail, Menu, X } from 'lucide-react';
import { CONTACT } from '@/content/portfolio';
import { RESUME_URL, sectionHref } from '@/lib/paths';

function TopBar({ onHome }: { onHome: boolean }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sx-topbar">
      <Link className="sx-brand" href="/" aria-label={`${CONTACT.name} — home`} data-testid="link-home">
        <span className="sx-brand-mark" aria-hidden="true">SVN<span>.</span></span>
        <span className="sx-brand-caption" aria-hidden="true">SYSTEMS / ENGINEERING</span>
      </Link>
      <button
        ref={toggleRef}
        className="sx-menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="site-nav"
        data-testid="button-menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav id="site-nav" className={`sx-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <a href={sectionHref('#explorer', onHome)} onClick={close} data-testid="link-nav-explorer">System explorer</a>
        <a href={sectionHref('#experience', onHome)} onClick={close} data-testid="link-nav-experience">Experience</a>
        <a href={sectionHref('#about', onHome)} onClick={close} data-testid="link-nav-about">Background</a>
        <a className="sx-nav-contact" href={`mailto:${CONTACT.email}`} onClick={close} data-testid="link-nav-contact">
          Contact <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}

function SiteFooter({ onHome }: { onHome: boolean }) {
  return (
    <footer className="sx-footer" id="contact">
      <div className="sx-footer-top">
        <p className="sx-kicker">LET’S TALK SYSTEMS</p>
        <h2>Good engineering<br />starts with <em>the right problem.</em></h2>
        <div className="sx-footer-actions">
          <a className="sx-button sx-button-light" href={`mailto:${CONTACT.email}`} data-testid="link-footer-email">
            <Mail size={16} aria-hidden="true" /> Email Satyendra <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="sx-button sx-button-ghost" href={RESUME_URL} download data-testid="link-resume">
            <Download size={15} aria-hidden="true" /> Download resume (PDF)
          </a>
        </div>
      </div>
      <div className="sx-footer-bottom">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" data-testid="link-linkedin">
          LinkedIn <ExternalLink size={13} aria-hidden="true" /><span className="sx-visually-hidden"> (opens in a new tab)</span>
        </a>
        <span>{CONTACT.location}</span>
        <span className="sx-footer-note">PUBLIC-SAFE PROFILE · RESUME-BACKED FACTS ONLY</span>
        <a className="sx-back-top" href={sectionHref('#top', onHome)} data-testid="link-back-top">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const onHome = location === '/' || location === '';
  return (
    <div className="sx">
      <a className="sx-skip" href="#main">Skip to main content</a>
      <TopBar onHome={onHome} />
      <main id="main" tabIndex={-1}>{children}</main>
      <SiteFooter onHome={onHome} />
    </div>
  );
}
