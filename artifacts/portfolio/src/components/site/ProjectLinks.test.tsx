import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectLinks } from './ProjectLinks';
import { projects } from '@/content/portfolio';

describe('project link presentation', () => {
  it('renders no placeholder link when CRM URLs are missing', () => {
    const { container } = render(<ProjectLinks project={projects[0]!} />);
    expect(container.querySelector('a')).toBeNull();
    expect(screen.queryByText(/no public project URL supplied/i)).not.toBeInTheDocument();
  });

  it('explains the internal tool boundary without exposing a link', () => {
    const { container } = render(<ProjectLinks project={projects[1]!} />);
    expect(screen.getByText(/internal tool/i)).toBeInTheDocument();
    expect(container.querySelector('a')).toBeNull();
  });
});
