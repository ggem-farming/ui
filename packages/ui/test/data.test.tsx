import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  ColumnsMenu,
  createDataTableColumnHelper,
  DataTable,
  EmptyState,
  FilterBar,
  FilterChip,
  SearchInput,
  Select,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

interface Farmer {
  id: string;
  name: string;
  hub: string;
  balance: number;
}

const NAMES = ['Chikondi', 'Mphatso', 'Kondwani', 'Tiyamike', 'Limbani', 'Chisomo'];
const FARMERS: Farmer[] = Array.from({ length: 30 }, (_, i) => ({
  id: `f-${String(i + 1)}`,
  name: `${NAMES[i % NAMES.length] ?? ''} ${String(i + 1).padStart(2, '0')}`,
  hub: ['Chikwawa', 'Nsanje', 'Balaka'][i % 3] ?? '',
  balance: (i * 7919) % 50_000,
}));

const col = createDataTableColumnHelper<Farmer>();
const COLUMNS = col.columns([
  col.accessor('name', {
    header: 'Farmer',
    cell: (info) => <a href={`/farmers/${info.row.original.id}`}>{info.getValue()}</a>,
    meta: { card: 'title' },
  }),
  col.accessor('hub', { header: 'Hub', meta: { card: 'subtitle' } }),
  col.accessor('balance', {
    header: 'Balance',
    cell: (info) => `MWK ${info.getValue().toLocaleString('en-GB')}`,
    meta: { align: 'right', card: 'trailing' },
  }),
]);

const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);
const firstCellText = () =>
  within(bodyRows()[0] as HTMLElement).getAllByRole('cell')[0]?.textContent;

describe('DataTable (client mode)', () => {
  it('pages, sorts with aria-sort, and is accessible', async () => {
    const { container } = render(
      <DataTable aria-label="Farmers" columns={COLUMNS} data={FARMERS} getRowId={(f) => f.id} />
    );
    expect(screen.getByRole('table', { name: 'Farmers' })).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(25);
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1–25 of 30');
    expect(await axeViolations(container)).toEqual([]);

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByRole('status')).toHaveTextContent('Showing 26–30 of 30');

    const header = screen.getByRole('columnheader', { name: /Balance/ });
    expect(header).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(header).getByRole('button'));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1–25 of 30');
    expect(within(bodyRows()[0] as HTMLElement).getAllByRole('cell')[2]).toHaveTextContent('MWK 0');
    expect(within(bodyRows()[0] as HTMLElement).getAllByRole('cell')[2]).toHaveClass('text-right');
  });

  it('renders cards with title, subtitle and trailing cells', () => {
    render(
      <DataTable
        aria-label="Farmers"
        columns={COLUMNS}
        data={FARMERS.slice(0, 2)}
        getRowId={(f) => f.id}
      />
    );
    const cards = screen.getByRole('list', { name: 'Farmers' });
    const first = within(cards).getAllByRole('listitem')[0] as HTMLElement;
    expect(within(first).getByRole('link')).toHaveTextContent('Chikondi 01');
    expect(first).toHaveTextContent('Chikwawa');
    expect(first).toHaveTextContent('MWK 0');
  });
});

describe('DataTable (server mode)', () => {
  it('reports paging and sorting without reordering the given page', async () => {
    const onPagination = vi.fn();
    const onSorting = vi.fn();
    function Server() {
      const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
      const [sorting, setSorting] = useState<SortingState>([]);
      return (
        <DataTable
          aria-label="Farmers"
          columns={COLUMNS}
          data={FARMERS.slice(0, 25)}
          getRowId={(f) => f.id}
          rowCount={3527}
          pagination={pagination}
          onPaginationChange={(u) => {
            setPagination(u);
            onPagination(typeof u === 'function' ? u(pagination) : u);
          }}
          sorting={sorting}
          onSortingChange={(u) => {
            setSorting(u);
            onSorting(typeof u === 'function' ? u(sorting) : u);
          }}
        />
      );
    }
    render(<Server />);
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1–25 of 3,527');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPagination).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 25 });
    expect(screen.getByRole('status')).toHaveTextContent('Showing 26–50 of 3,527');

    await userEvent.click(
      within(screen.getByRole('columnheader', { name: /Balance/ })).getByRole('button')
    );
    expect(onSorting).toHaveBeenLastCalledWith([{ id: 'balance', desc: false }]);
    expect(firstCellText()).toBe('Chikondi 01');
  });
});

describe('DataTable selection and row click', () => {
  it('selects by row ID and ignores clicks on interactive cells', async () => {
    const onSelection = vi.fn();
    const onRowClick = vi.fn();
    function Selectable() {
      const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
      return (
        <DataTable
          aria-label="Farmers"
          columns={COLUMNS}
          data={FARMERS.slice(0, 3)}
          getRowId={(f) => f.id}
          getRowLabel={(f) => f.name}
          enableRowSelection
          rowSelection={rowSelection}
          onRowSelectionChange={(u) => {
            const next = typeof u === 'function' ? u(rowSelection) : u;
            setRowSelection(next);
            onSelection(next);
          }}
          onRowClick={onRowClick}
        />
      );
    }
    const { container } = render(<Selectable />);
    const table = screen.getByRole('table');
    await userEvent.click(within(table).getByRole('checkbox', { name: 'Select Mphatso 02' }));
    expect(onSelection).toHaveBeenLastCalledWith({ 'f-2': true });
    expect(onRowClick).not.toHaveBeenCalled();
    const all = within(table).getByRole('checkbox', { name: 'Select all rows on this page' });
    expect(all).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(all);
    expect(onSelection).toHaveBeenLastCalledWith({ 'f-1': true, 'f-2': true, 'f-3': true });

    await userEvent.click(within(table).getAllByRole('cell', { name: 'Nsanje' })[0] as HTMLElement);
    expect(onRowClick).toHaveBeenCalledWith(FARMERS[1]);
    const link = within(table).getByRole('link', { name: 'Kondwani 03' });
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
    await userEvent.click(link);
    expect(onRowClick).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('DataTable states', () => {
  const base = { 'aria-label': 'Farmers', columns: COLUMNS, getRowId: (f: Farmer) => f.id };

  it('shows loading, blocking error, banner error, empty and refetch states', async () => {
    const onRetry = vi.fn();
    const { rerender } = render(<DataTable {...base} data={undefined} loading />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading farmers…');
    expect(screen.queryByRole('table')).toBeNull();

    rerender(
      <DataTable
        {...base}
        data={undefined}
        error="Check your connection and try again."
        onRetry={onRetry}
      />
    );
    const blocking = screen.getByRole('alert');
    expect(blocking).toHaveTextContent("Couldn't load farmers");
    // The reason appears once (no default description repeating it).
    expect(blocking.textContent.match(/Check your connection/g)).toHaveLength(1);
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();

    rerender(
      <DataTable
        {...base}
        data={FARMERS.slice(0, 3)}
        error="Showing saved results"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't refresh farmers");
    expect(screen.getByRole('alert')).toHaveTextContent('Showing saved results');
    expect(bodyRows()).toHaveLength(3);

    rerender(
      <DataTable
        {...base}
        data={[]}
        empty={<EmptyState title="No farmers in Balaka" description="Try another hub." />}
      />
    );
    expect(screen.getByText('No farmers in Balaka')).toBeVisible();

    rerender(<DataTable {...base} data={FARMERS.slice(0, 3)} fetching />);
    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  });
});

describe('Columns, search and filters', () => {
  it('hides a column through ColumnsMenu state', async () => {
    function WithColumns() {
      const [visibility, setVisibility] = useState<VisibilityState>({});
      return (
        <>
          <ColumnsMenu
            columns={[
              { id: 'hub', label: 'Hub' },
              { id: 'balance', label: 'Balance' },
            ]}
            visibility={visibility}
            onVisibilityChange={setVisibility}
          />
          <DataTable
            aria-label="Farmers"
            columns={COLUMNS}
            data={FARMERS.slice(0, 2)}
            getRowId={(f) => f.id}
            columnVisibility={visibility}
            onColumnVisibilityChange={setVisibility}
          />
        </>
      );
    }
    render(<WithColumns />);
    expect(screen.getByRole('columnheader', { name: /Hub/ })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Columns' }));
    await userEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'Hub' }));
    await waitFor(() => {
      expect(screen.queryByRole('columnheader', { name: /Hub/ })).toBeNull();
    });
  });

  it('debounces search and clears at once', async () => {
    const onValue = vi.fn();
    function Search() {
      const [q, setQ] = useState('');
      return (
        <SearchInput
          aria-label="Search farmers"
          value={q}
          debounceMs={40}
          onValueChange={(v) => {
            setQ(v);
            onValue(v);
          }}
        />
      );
    }
    render(<Search />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search farmers' }), 'ban');
    expect(onValue).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(onValue).toHaveBeenCalledWith('ban');
    });
    expect(onValue).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onValue).toHaveBeenLastCalledWith('');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });

  it('shows chips, clears all, and opens filters in a panel', async () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    const { container } = render(
      <FilterBar
        filters={<Select aria-label="Hub" options={[{ value: 'h1', label: 'Chikwawa' }]} />}
        activeCount={1}
        chips={<FilterChip label="Hub" value="Chikwawa" onRemove={onRemove} />}
        onClearAll={onClearAll}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove filter: Hub' }));
    expect(onRemove).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);

    await userEvent.click(screen.getByRole('button', { name: /Filters/ }));
    const panel = await screen.findByRole('dialog', { name: 'Filters' });
    expect(within(panel).getByRole('combobox', { name: 'Hub' })).toBeInTheDocument();
    await userEvent.click(within(panel).getByRole('button', { name: 'Show results' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
