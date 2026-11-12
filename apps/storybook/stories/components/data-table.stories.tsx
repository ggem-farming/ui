import {
  Avatar,
  Badge,
  Button,
  ColumnsMenu,
  createDataTableColumnHelper,
  DataTable,
  DetailList,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  EmptyState,
  FilterBar,
  FilterChip,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  SearchInput,
  Select,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal, Pencil, Phone, Trash2, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  hub: string;
  officer: string;
  status: 'Contracted' | 'Pending review' | 'Registered' | 'Inactive';
  acres: number;
  balance: number;
}

const FIRST = [
  'Chikondi',
  'Mphatso',
  'Kondwani',
  'Tiyamike',
  'Limbani',
  'Chisomo',
  'Madalitso',
  'Thandiwe',
];
const LAST = ['Banda', 'Phiri', 'Mwale', 'Tembo', 'Chirwa', 'Kumwenda', 'Nkhoma', 'Gondwe'];
const HUBS = ['Chikwawa', 'Nsanje', 'Balaka', 'Machinga'];
const OFFICERS = ['Grace Mbewe', 'Peter Zulu', 'Ruth Kaunda'];
const STATUSES = ['Contracted', 'Contracted', 'Pending review', 'Registered', 'Inactive'] as const;
const TONE = {
  Contracted: 'success',
  'Pending review': 'warning',
  Registered: 'info',
  Inactive: 'neutral',
} as const;

const FARMERS: Farmer[] = Array.from({ length: 137 }, (_, i) => ({
  id: `farmer-${String(1001 + i)}`,
  name: `${FIRST[i % FIRST.length] ?? ''} ${LAST[(i * 3 + Math.floor(i / 8)) % LAST.length] ?? ''}`,
  phone: `+265 991 ${String(100 + Math.floor(i / 10)).padStart(3, '0')} ${String(100 + i).slice(-3)}`,
  hub: HUBS[(i * 7) % HUBS.length] ?? '',
  officer: OFFICERS[i % OFFICERS.length] ?? '',
  status: STATUSES[(i * 3) % STATUSES.length] ?? 'Registered',
  acres: ((i * 37) % 9) + 0.5,
  balance: ((i * 7919) % 90) * 1500 - 30000,
}));

const mwk = (n: number) =>
  `${n < 0 ? 'Owes ' : ''}MWK ${Math.abs(n).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

function useColumns(onOpen: (f: Farmer) => void) {
  return useMemo(() => {
    const col = createDataTableColumnHelper<Farmer>();
    return col.columns([
      col.accessor('name', {
        header: 'Farmer',
        meta: { card: 'title' },
        cell: (info) => (
          <a
            href={`/farmers/${info.row.original.id}`}
            onClick={(e) => {
              e.preventDefault();
              onOpen(info.row.original);
            }}
            className="inline-flex items-center gap-2.5 font-medium hover:underline"
          >
            <Avatar name={info.getValue()} size="sm" />
            {info.getValue()}
          </a>
        ),
      }),
      col.accessor('phone', { header: 'Phone', enableSorting: false, meta: { priority: 'low' } }),
      col.accessor('hub', { header: 'Hub', meta: { card: 'subtitle' } }),
      col.accessor('officer', { header: 'Field officer', meta: { priority: 'low' } }),
      col.accessor('status', {
        header: 'Status',
        meta: { card: 'trailing' },
        cell: (info) => (
          <Badge variant="outline" tone={TONE[info.getValue()]}>
            {info.getValue()}
          </Badge>
        ),
      }),
      col.accessor('acres', {
        header: 'Acres',
        meta: { align: 'right' },
        cell: (info) => info.getValue().toFixed(1),
      }),
      col.accessor('balance', {
        header: 'Balance',
        meta: { align: 'right', card: 'subtitle' },
        cell: (info) => (
          <span className={info.getValue() < 0 ? 'font-medium text-on-danger-soft' : undefined}>
            {mwk(info.getValue())}
          </span>
        ),
      }),
      col.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        meta: { card: false },
        cell: (info) => (
          <Menu>
            <MenuTrigger
              render={
                <IconButton label={`Actions for ${info.row.original.name}`} size="sm">
                  <MoreHorizontal />
                </IconButton>
              }
            />
            <MenuContent align="end">
              <MenuItem>
                <Pencil /> Edit
              </MenuItem>
              <MenuItem>
                <Phone /> Call
              </MenuItem>
              <MenuSeparator />
              <MenuItem tone="danger">
                <Trash2 /> Delete farmer
              </MenuItem>
            </MenuContent>
          </Menu>
        ),
      }),
    ]);
  }, [onOpen]);
}

function FarmerPanel({ farmer, onClose }: { farmer: Farmer | null; onClose: () => void }) {
  return (
    <Dialog
      open={farmer !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent placement="right">
        {farmer && (
          <>
            <DialogHeader>
              <DialogTitle>{farmer.name}</DialogTitle>
              <DialogDescription>
                {farmer.status} · {farmer.hub} hub
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <DetailList
                items={[
                  { label: 'Phone', value: farmer.phone },
                  { label: 'Field officer', value: farmer.officer },
                  { label: 'Acres', value: farmer.acres.toFixed(1) },
                  { label: 'Balance', value: mwk(farmer.balance) },
                ]}
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary">
                <Phone /> Call
              </Button>
              <Button>Open profile</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ClientTable() {
  const [query, setQuery] = useState('');
  const [hub, setHub] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<VisibilityState>({});
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [open, setOpen] = useState<Farmer | null>(null);
  const columns = useColumns(setOpen);
  const rows = useMemo(
    () =>
      FARMERS.filter(
        (f) =>
          (!query || `${f.name} ${f.phone}`.toLowerCase().includes(query.toLowerCase())) &&
          (!hub || f.hub === hub) &&
          (!status || f.status === status)
      ),
    [query, hub, status]
  );
  const selected = Object.keys(selection).length;
  const clear = () => {
    setQuery('');
    setHub(null);
    setStatus(null);
  };
  const filters = (
    <>
      <Select
        aria-label="Hub"
        placeholder="All hubs"
        value={hub}
        onValueChange={setHub}
        options={HUBS.map((h) => ({ value: h, label: h }))}
        className="h-8 w-40"
      />
      <Select
        aria-label="Status"
        placeholder="All statuses"
        value={status}
        onValueChange={setStatus}
        options={['Contracted', 'Pending review', 'Registered', 'Inactive'].map((s) => ({
          value: s,
          label: s,
        }))}
        className="h-8 w-44"
      />
    </>
  );
  return (
    <div className="flex h-screen flex-col bg-surface text-fg">
      <FilterBar
        search={
          <SearchInput
            aria-label="Search farmers"
            placeholder="Search name or phone"
            value={query}
            onValueChange={setQuery}
          />
        }
        filters={filters}
        activeCount={(hub ? 1 : 0) + (status ? 1 : 0)}
        chips={
          hub || status || query ? (
            <>
              {query && (
                <FilterChip
                  label="Search"
                  value={`“${query}”`}
                  onRemove={() => {
                    setQuery('');
                  }}
                />
              )}
              {hub && (
                <FilterChip
                  label="Hub"
                  value={hub}
                  onRemove={() => {
                    setHub(null);
                  }}
                />
              )}
              {status && (
                <FilterChip
                  label="Status"
                  value={status}
                  onRemove={() => {
                    setStatus(null);
                  }}
                />
              )}
            </>
          ) : undefined
        }
        onClearAll={clear}
        actions={
          <ColumnsMenu
            columns={[
              { id: 'phone', label: 'Phone' },
              { id: 'officer', label: 'Field officer' },
              { id: 'acres', label: 'Acres' },
              { id: 'balance', label: 'Balance' },
            ]}
            visibility={visibility}
            onVisibilityChange={setVisibility}
          />
        }
      />
      {selected > 0 && (
        <div
          className="flex items-center gap-3 border-t border-border bg-brand-soft px-5 py-2 text-sm text-on-brand-soft"
          role="status"
        >
          <span className="font-medium">{selected} selected</span>
          <Button size="sm" variant="secondary">
            Send SMS
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelection({});
            }}
          >
            Clear selection
          </Button>
        </div>
      )}
      <DataTable
        aria-label="Farmers"
        columns={columns}
        data={rows}
        getRowId={(f) => f.id}
        getRowLabel={(f) => f.name}
        enableRowSelection
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        columnVisibility={visibility}
        onColumnVisibilityChange={setVisibility}
        onRowClick={setOpen}
        empty={
          <EmptyState
            icon={<Users />}
            title="No farmers match these filters"
            description="Try another hub or status, or clear the filters."
            action={
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear filters
              </Button>
            }
          />
        }
      />
      <FarmerPanel
        farmer={open}
        onClose={() => {
          setOpen(null);
        }}
      />
    </div>
  );
}

/** Simulates a paged, sorted API with latency and an optional failure. */
function useFakeServer(pagination: PaginationState, sorting: SortingState, fail: boolean) {
  const [result, setResult] = useState<{ rows: Farmer[]; total: number } | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [attempt, setAttempt] = useState(0);
  const request = JSON.stringify([pagination, sorting, fail, attempt]);
  const [finished, setFinished] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fail) {
        setError('The server did not respond. Try again in a moment.');
      } else {
        const sort = sorting[0];
        const sorted = sort
          ? [...FARMERS].sort((a, b) => {
              const av = a[sort.id as keyof Farmer];
              const bv = b[sort.id as keyof Farmer];
              const cmp =
                typeof av === 'number' && typeof bv === 'number'
                  ? av - bv
                  : String(av).localeCompare(String(bv));
              return sort.desc ? -cmp : cmp;
            })
          : FARMERS;
        const start = pagination.pageIndex * pagination.pageSize;
        setResult({
          rows: sorted.slice(start, start + pagination.pageSize),
          total: FARMERS.length,
        });
        setError(undefined);
      }
      setFinished(request);
    }, 700);
    return () => {
      clearTimeout(timer);
    };
  }, [pagination, sorting, fail, request]);
  return {
    result,
    fetching: finished !== request,
    error,
    retry: () => {
      setAttempt((n) => n + 1);
    },
  };
}

function ServerTable({ fail }: { fail: boolean }) {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { result, fetching, error, retry } = useFakeServer(pagination, sorting, fail);
  const columns = useColumns(() => {});
  return (
    <div className="flex h-screen flex-col bg-surface text-fg">
      <p className="px-5 py-3 text-sm text-fg-muted">
        Server mode: each page and sort waits 700 ms. Old rows stay visible while the next page
        loads.
      </p>
      <DataTable
        aria-label="Farmers"
        columns={columns}
        data={result?.rows}
        rowCount={result?.total ?? 0}
        getRowId={(f) => f.id}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        loading={fetching && !result}
        fetching={fetching && result !== undefined}
        error={error}
        onRetry={retry}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Data table',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const FarmersList: StoryObj = {
  name: 'Filters, selection and side panel',
  render: () => <ClientTable />,
};

export const ServerMode: StoryObj<{ fail: boolean }> = {
  name: 'Server mode',
  args: { fail: false },
  render: ({ fail }) => <ServerTable fail={fail} />,
};
