import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useNoIndex } from './use-document-meta';

function User() {
  useNoIndex();
  return null;
}

const robots = () => document.head.querySelectorAll('meta[name="robots"]');
const content = () => robots()[0]?.getAttribute('content');

afterEach(() => { document.head.innerHTML = ''; });

describe('useNoIndex', () => {
  it('sets noindex, nofollow while mounted', () => {
    document.head.innerHTML = '<meta name="robots" content="index, follow">';
    const view = render(<User />);
    expect(content()).toBe('noindex, nofollow');
    view.unmount();
  });

  it('restores a pre-existing index, follow on unmount', () => {
    document.head.innerHTML = '<meta name="robots" content="index, follow">';
    render(<User />).unmount();
    expect(robots()).toHaveLength(1);
    expect(content()).toBe('index, follow');
  });

  it('with two users, keeps noindex until both are unmounted', () => {
    document.head.innerHTML = '<meta name="robots" content="index, follow">';
    const first = render(<User />);
    const second = render(<User />);
    expect(content()).toBe('noindex, nofollow');
    first.unmount();
    expect(content()).toBe('noindex, nofollow');
    second.unmount();
    expect(robots()).toHaveLength(1);
    expect(content()).toBe('index, follow');
  });

  it('creates the meta when there is none, and removes it afterwards', () => {
    const view = render(<User />);
    expect(robots()).toHaveLength(1);
    expect(content()).toBe('noindex, nofollow');
    view.unmount();
    expect(robots()).toHaveLength(0);
  });
});
