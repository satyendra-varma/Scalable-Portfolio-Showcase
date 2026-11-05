import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useState } from 'react';
import { ContactContent, ProjectList, SkillsContent } from './RoomContent';
import { RoomExplorer } from './RoomExplorer';
import { crmFlow, projectEvidence } from '@/content/room-preview';

describe('isolated room preview', () => {
  it('renders exactly two projects and noninteractive missing links', () => {
    render(<ProjectList activeSkill={null} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
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
    expect(projectEvidence['AWS S3']).toBeUndefined();
  });
  it('offers ten evidence-labeled stages and an equivalent numbered list', async () => {
    const user = userEvent.setup();
    render(<RoomExplorer />);
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
});
