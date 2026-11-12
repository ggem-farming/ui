import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, Kbd, useCommandShortcut, type CommandGroup } from '../src/index.ts';
import { axeViolations } from './axe.ts';

const GROUPS: CommandGroup[] = [
  {
    label: 'Pages',
    items: [
      { value: '/farmers', label: 'GGEM farmers', shortcut: 'G F' },
      { value: '/finance', label: 'Finance' },
    ],
  },
  {
    label: 'Farmers',
    items: [{ value: 'farmer-1', label: 'Chikondi Phiri', description: '+265 991 000 001' }],
  },
];

function Harness({
  onSelect,
  serverFiltered = false,
}: {
  onSelect: () => void;
  serverFiltered?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useCommandShortcut(() => {
    setOpen((value) => !value);
  });
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Search <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        groups={GROUPS}
        onSelect={onSelect}
        query={query}
        onQueryChange={setQuery}
        serverFiltered={serverFiltered}
        placeholder="Search pages and farmers…"
      />
    </>
  );
}

describe('CommandPalette', () => {
  it('opens with Ctrl+K, filters by typed text and runs the chosen item with Enter', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} />);
    await userEvent.keyboard('{Control>}k{/Control}');
    const dialog = await screen.findByRole('dialog', { name: 'Command palette' });
    expect(dialog).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);

    await userEvent.type(screen.getByRole('combobox'), 'fin');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Finance']);
    await userEvent.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: '/finance' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves through groups with the arrow keys and keeps server results unfiltered', async () => {
    const onSelect = vi.fn();
    render(<Harness onSelect={onSelect} serverFiltered />);
    await userEvent.click(screen.getByRole('button', { name: /Search/ }));
    await userEvent.type(await screen.findByRole('combobox'), 'zzz');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'farmer-1' }));
  });

  it('has no accessibility violations when open', async () => {
    render(<Harness onSelect={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Search/ }));
    const dialog = await screen.findByRole('dialog');
    expect(screen.getByRole('group', { name: 'Pages' })).toBeInTheDocument();
    expect(await axeViolations(dialog)).toEqual([]);
  });
});
