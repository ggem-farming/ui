import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonVariants, cn } from '../src/index.ts';
import { axeViolations } from './axe.ts';

describe('Button', () => {
  it('renders an accessible button and handles clicks', async () => {
    const onClick = vi.fn();
    const { container } = render(<Button onClick={onClick}>Register farmer</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Register farmer' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('lets a caller className override variant classes', () => {
    render(<Button className="px-8">Wide</Button>);
    const button = screen.getByRole('button', { name: 'Wide' });
    expect(button).toHaveClass('px-8', 'bg-primary');
    expect(button).not.toHaveClass('px-3');
  });

  it('styles a link with buttonVariants (links keep the link role)', () => {
    render(
      <a href="/farmers" className={buttonVariants({ variant: 'secondary' })}>
        Farmers
      </a>
    );
    expect(screen.getByRole('link', { name: 'Farmers' })).toHaveClass('bg-surface');
  });
});

describe('cn', () => {
  it('keeps text size and text colour together but resolves conflicts', () => {
    expect(cn('text-sm text-fg', 'text-lg')).toBe('text-fg text-lg');
    expect(cn('bg-primary', 'bg-danger')).toBe('bg-danger');
  });
});
