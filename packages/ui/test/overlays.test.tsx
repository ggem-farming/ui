import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
  TooltipProvider,
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

function EditDialog({ placement }: { placement?: 'center' | 'right' }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Edit farmer</Button>} />
      <DialogContent placement={placement}>
        <DialogHeader>
          <DialogTitle>Edit farmer</DialogTitle>
          <DialogDescription>Changes are saved to the profile.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p>Form goes here</p>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancel</Button>} />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it.each(['center', 'right'] as const)(
    'opens as a named %s dialog, closes on Escape and returns focus',
    async (placement) => {
      render(<EditDialog placement={placement} />);
      const trigger = screen.getByRole('button', { name: 'Edit farmer' });
      await userEvent.click(trigger);
      const dialog = await screen.findByRole('dialog', { name: 'Edit farmer' });
      expect(dialog).toHaveAccessibleDescription('Changes are saved to the profile.');
      expect(await axeViolations(document.body)).toEqual([]);

      await userEvent.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull();
      });
      expect(trigger).toHaveFocus();
    }
  );

  it('closes from the corner close button and from DialogClose', async () => {
    render(<EditDialog />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit farmer' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    await userEvent.click(screen.getByRole('button', { name: 'Edit farmer' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});

describe('ConfirmDialog', () => {
  const setup = (onConfirm: () => unknown) =>
    render(
      <ConfirmDialog
        trigger={<Button variant="danger">Delete</Button>}
        title="Delete contract GG-2026-0101?"
        description="The contract and its signatures are removed. This can't be undone."
        confirmLabel="Delete contract"
        onConfirm={onConfirm}
      />
    );

  it('starts on Cancel and runs the action', async () => {
    const onConfirm = vi.fn();
    setup(onConfirm);
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    const dialog = await screen.findByRole('alertdialog', {
      name: 'Delete contract GG-2026-0101?',
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    });
    expect(await axeViolations(document.body)).toEqual([]);
    await userEvent.click(screen.getByRole('button', { name: 'Delete contract' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('stays open and busy while the action runs, then closes', async () => {
    let finish = () => {};
    setup(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Delete contract' }));
    const busy = await screen.findByRole('button', { name: 'Delete contract…' });
    expect(busy).toHaveAttribute('aria-busy', 'true');
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    finish();
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).toBeNull();
    });
  });

  it('keeps the dialog open and shows the error when the action fails', async () => {
    setup(() => Promise.reject(new Error('This contract has payments and cannot be deleted.')));
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Delete contract' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This contract has payments and cannot be deleted.'
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('can be opened from elsewhere when controlled', async () => {
    function FromMenu() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            Remove
          </Button>
          <ConfirmDialog
            open={open}
            onOpenChange={setOpen}
            title="Remove field officer?"
            confirmLabel="Remove"
            onConfirm={() => {}}
          />
        </>
      );
    }
    render(<FromMenu />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(
      await screen.findByRole('alertdialog', { name: 'Remove field officer?' })
    ).toBeInTheDocument();
  });
});

describe('Menu', () => {
  it('runs an item action from a labelled trigger and closes', async () => {
    const onEdit = vi.fn();
    const onColumn = vi.fn();
    render(
      <Menu>
        <MenuTrigger
          render={
            <IconButton label="Actions for Chikondi Banda" tooltip={false}>
              <svg aria-hidden />
            </IconButton>
          }
        />
        <MenuContent>
          <MenuItem onClick={onEdit}>Edit</MenuItem>
          <MenuCheckboxItem onCheckedChange={onColumn}>Show phone column</MenuCheckboxItem>
          <MenuSeparator />
          <MenuItem tone="danger">Delete</MenuItem>
        </MenuContent>
      </Menu>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions for Chikondi Banda' }));
    const menu = await screen.findByRole('menu');
    expect(screen.getAllByRole('menuitem').map((i) => i.textContent)).toEqual(['Edit', 'Delete']);
    expect(screen.getByRole('menuitemcheckbox', { name: 'Show phone column' })).toBeInTheDocument();
    expect(await axeViolations(document.body)).toEqual([]);

    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(menu).not.toBeInTheDocument();
    });
  });
});

describe('Popover', () => {
  it('opens a named popover', async () => {
    render(
      <Popover>
        <PopoverTrigger render={<Button variant="secondary">Season</Button>} />
        <PopoverContent>
          <PopoverTitle>Season</PopoverTitle>
          <p>Pick a season</p>
        </PopoverContent>
      </Popover>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Season' }));
    expect(await screen.findByRole('dialog', { name: 'Season' })).toBeInTheDocument();
    expect(await axeViolations(document.body)).toEqual([]);
  });
});

describe('Tooltip', () => {
  it('shows an IconButton label on hover', async () => {
    render(
      <TooltipProvider delay={0}>
        <IconButton label="Next page">
          <svg aria-hidden />
        </IconButton>
      </TooltipProvider>
    );
    const button = screen.getByRole('button', { name: 'Next page' });
    await userEvent.hover(button);
    expect(await screen.findByText('Next page', { selector: 'div' })).toBeInTheDocument();
    expect(button).toHaveAccessibleName('Next page');
  });

  it('can be turned off', async () => {
    render(
      <TooltipProvider delay={0}>
        <IconButton label="Close" tooltip={false}>
          <svg aria-hidden />
        </IconButton>
      </TooltipProvider>
    );
    await userEvent.hover(screen.getByRole('button', { name: 'Close' }));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByText('Close', { selector: 'div' })).toBeNull();
  });
});
