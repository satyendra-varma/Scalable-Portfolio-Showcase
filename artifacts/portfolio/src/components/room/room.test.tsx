import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { ContactContent, ProjectList, SkillsContent } from './RoomContent';
import { SystemExplorer } from './SystemExplorer';
import { crmFlow, flowSequenceNote, projectEvidence, projects } from '@/content/room';
import { CRM_LINK, ECOMMERCE_LINK } from '@/content/site';
import RoomOriginal from '@/pages/room-original';
import NotFound from '@/pages/not-found';

describe('engineer room', () => {
  it('the earlier room, kept at a hidden route', () => {
    render(<RoomOriginal />);
    expect(screen.getByTestId('page-room')).toBeInTheDocument();
    expect(screen.getByText('Engineer’s Room')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Direction switcher' })).toBeNull();
    expect(screen.queryByText(/Warm workshop|Night blueprint|Not the live site/)).toBeNull();
    expect(document.title).toBe('Earlier room | Satyendra Varma Nadimpalli');
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    expect(screen.getByTestId('hotspot-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('link-header-email')).toHaveAttribute('href', 'mailto:satyendrasatya447@gmail.com');
  });

  it('renders exactly two projects, no outcome placeholder, and hides the link line', () => {
    const { container } = render(<ProjectList activeSkill={null} />);
    const articles = screen.getAllByRole('article');
    expect(articles).toHaveLength(2);
    expect(screen.queryByText('Outcome')).toBeNull();
    expect(screen.queryByText(/not yet documented/i)).toBeNull();
    expect(screen.queryByText('Live link coming soon')).toBeNull();
    expect(container.querySelector('[data-testid^="text-link-placeholder-"], [data-testid^="link-project-"]')).toBeNull();
    for (const a of articles) {
      expect(a.querySelector('a, button')).toBeNull();
      expect(Array.from(a.children).map((c) => c.tagName)).toEqual([expect.stringMatching(/^H[1-6]$/), 'UL']);
    }
  });
  it('keeps the project link config exported, with both links empty today', () => {
    expect(typeof CRM_LINK).toBe('string');
    expect(typeof ECOMMERCE_LINK).toBe('string');
    expect(projects.map((p) => p.link)).toEqual([null, null]);
  });
  it('keeps the resume unavailable', () => {
    render(<ContactContent />);
    expect(screen.getByTestId('text-resume-placeholder').closest('a,button')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
  it('filters only project-backed skills, including empty and reset states', async () => {
    function Harness() {
      const [skill, setSkill] = useState<string | null>(null);
      return <SkillsContent activeSkill={skill} setActiveSkill={setSkill} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Redis' }));
    expect(screen.getByTestId('card-project-crm')).toBeInTheDocument();
    expect(screen.queryByTestId('card-project-ecommerce')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Clear filter' }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(projectEvidence['Kubernetes (familiarity)']).toBeUndefined();
  });
  it('offers ten evidence-labeled stages and an equivalent numbered list', async () => {
    const user = userEvent.setup();
    render(<SystemExplorer />);
    expect(crmFlow).toHaveLength(10);
    const first = screen.getByTestId('button-node-1');
    first.focus();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByTestId('button-node-2')).toHaveFocus();
    expect(screen.getByTestId('button-node-2')).toHaveAttribute('aria-pressed', 'true');
    expect(crmFlow[8].source).toBe('Confirmed');
    expect(crmFlow[8].title).toBe('EF Core query on PostgreSQL');
    expect(screen.getByTestId('button-node-9')).toHaveClass('is-confirmed');
    expect(screen.getByTestId('button-node-8')).toHaveClass('is-resume');
    expect(screen.getByTestId('button-node-8')).not.toHaveClass('is-confirmed');
    expect(screen.getByText('The sequence is confirmed except the position of the Redis check.')).toBeInTheDocument();
    expect(flowSequenceNote).toBe('The sequence is confirmed except the position of the Redis check.');
    await user.click(screen.getByTestId('button-explorer-list'));
    expect(screen.getByTestId('list-flow-nodes').children).toHaveLength(10);
  });
  it('lists ten numbered flows: only flow 01 opens, flows 02-10 are Planned and not interactive', () => {
    const { container } = render(<SystemExplorer />);
    const rows = Array.from(container.querySelectorAll('[data-flow-status]'));
    expect(rows).toHaveLength(10);
    expect(rows.map((r) => r.querySelector('.ex-flow-num')?.textContent)).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']);
    expect(rows[0]).toHaveAttribute('data-flow-status', 'working');
    expect(rows[0].querySelector('button')).toBe(screen.getByTestId('button-flow-crm-request'));
    const planned = rows.slice(1);
    for (const row of planned) {
      expect(row).toHaveAttribute('data-flow-status', 'planned');
      expect(row).toHaveTextContent('Planned');
      expect(row.querySelector('a, button, [tabindex]')).toBeNull();
    }
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      expect.arrayContaining(['Enterprise CRM Platform', 'Cloud E-Commerce Platform', 'Nanomindz Technologies']),
    );
  });
  it('returns focus to the object that opened a panel as soon as the panel closes', () => {
    render(<RoomOriginal />);
    const monitor = screen.getByTestId('hotspot-explorer');
    fireEvent.click(monitor);
    expect(screen.getByTestId('panel-explorer')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('panel-explorer')).toBeNull();
    expect(monitor).toHaveFocus();
  });
  it('gives unknown routes a 404 page with a single way home', () => {
    render(<NotFound />);
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This page isn’t on the record.');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent('Back to the room');
    expect(links[0]).toHaveAttribute('href', '/');
  });
});
