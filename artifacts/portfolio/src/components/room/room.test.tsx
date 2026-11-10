import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { ContactContent, ProjectList, SkillsContent } from './RoomContent';
import { SystemExplorer } from './SystemExplorer';
import { crmFlow, projectEvidence } from '@/content/room';
import Room from '@/pages/room';
import NotFound from '@/pages/not-found';

describe('engineer room', () => {
  it('is the homepage, with a single direction and no switcher', () => {
    render(<Room />);
    expect(screen.getByTestId('page-room')).toBeInTheDocument();
    expect(screen.getByText('Engineer’s Room')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Direction switcher' })).toBeNull();
    expect(screen.queryByText(/Warm workshop|Night blueprint|Not the live site/)).toBeNull();
    expect(document.title).toBe('Satyendra Varma Nadimpalli | Full Stack .NET Software Engineer');
    expect(screen.getByTestId('hotspot-explorer')).toBeInTheDocument();
    expect(screen.getByTestId('link-header-email')).toHaveAttribute('href', 'mailto:satyendrasatya447@gmail.com');
  });

  it('renders exactly two projects, no outcome placeholder, and noninteractive missing links', () => {
    render(<ProjectList activeSkill={null} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.queryByText('Outcome')).toBeNull();
    expect(screen.queryByText(/not yet documented/i)).toBeNull();
    screen.getAllByText('Live link coming soon').forEach(el => {
      expect(el.tagName).toBe('SPAN');
      expect(el.closest('a,button')).toBeNull();
    });
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
    await user.click(screen.getByTestId('button-explorer-list'));
    expect(screen.getByTestId('list-flow-nodes').children).toHaveLength(10);
    expect(crmFlow[8].source).toBe('Representative design (to confirm)');
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
    render(<Room />);
    const monitor = screen.getByTestId('hotspot-explorer');
    fireEvent.click(monitor);
    expect(screen.getByTestId('panel-explorer')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('panel-explorer')).toBeNull();
    expect(monitor).toHaveFocus();
  });
  it('gives unknown routes a 404 page with a single way home', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('This page isn’t on the record.');
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveTextContent('Back to the room');
  });
});
