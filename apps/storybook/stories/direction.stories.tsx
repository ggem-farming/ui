/**
 * Visual direction for approval: the CRM shell, the Impact Dashboard home and a list screen,
 * composed from tokens and Tailwind utilities. Data is synthetic. These are mockups, not kit
 * components; the real AppShell, DataTable and FilterBar come in later batches.
 *
 * References (Mobbin): Attio and Calendly (inset panel shell, compact tables, view tabs),
 * Apollo and HoneyBook (KPI strip with deltas), Fresha (chart with breakdown), Steep and
 * Mintlify (neutral analytics with light numerals).
 */
import { Button, cn } from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowUpRight,
  ArrowUpDown,
  Banknote,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ClipboardList,
  Columns3,
  Download,
  FileSignature,
  FileText,
  Headset,
  House,
  ListFilter,
  Menu,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Sprout,
  Store,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------------------------------ */
/* Shell                                                                                       */
/* ------------------------------------------------------------------------------------------ */

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

const NAV: { section?: string; items: NavItem[] }[] = [
  { items: [{ label: 'Home', icon: House, href: '/' }] },
  {
    section: 'Farmers',
    items: [
      { label: 'Farmers', icon: Users, href: '/farmers' },
      { label: 'Contracts', icon: FileText, href: '/contracts' },
      { label: 'Surveys', icon: ClipboardList, href: '/surveys' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'Markets', icon: Store, href: '/operations/markets' },
      { label: 'Inputs', icon: Package, href: '/operations/inputs' },
      { label: 'Payouts', icon: Banknote, href: '/operations/payouts' },
    ],
  },
  {
    section: 'Engagement',
    items: [
      { label: 'SMS', icon: MessageSquare, href: '/engagement/sms' },
      { label: 'Call centre', icon: Headset, href: '/engagement/call-centre' },
    ],
  },
  { section: 'Insights', items: [{ label: 'Reports', icon: ChartColumn, href: '/reports' }] },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <a
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-8 items-center gap-2.5 rounded-md border border-transparent px-2 text-sm font-medium text-fg-muted',
        'hover:bg-surface-muted hover:text-fg pointer-coarse:h-11',
        'aria-[current=page]:border-border aria-[current=page]:bg-surface aria-[current=page]:text-fg aria-[current=page]:shadow-xs'
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {item.label}
    </a>
  );
}

function Shell({
  active,
  header,
  children,
}: {
  active: string;
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bg text-fg">
      <aside className="hidden w-60 shrink-0 flex-col px-3 pt-3 pb-2 lg:flex">
        <button
          type="button"
          className="flex h-10 items-center gap-2.5 rounded-md px-2 text-left hover:bg-surface-muted"
        >
          <span className="grid size-7 place-items-center rounded-md bg-brand text-on-brand">
            <Sprout className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">GGEM Farming</span>
            <span className="block truncate text-xs text-fg-muted">CRM</span>
          </span>
          <ChevronsUpDown className="size-4 text-fg-muted" aria-hidden />
        </button>

        <button
          type="button"
          className="mt-3 flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2 text-sm text-fg-muted shadow-xs hover:text-fg"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded border border-border px-1 font-sans text-xs">⌘K</kbd>
        </button>

        <nav aria-label="Main" className="mt-3 flex-1 overflow-y-auto">
          {NAV.map((group, i) => (
            <div key={group.section ?? i} className={cn(group.section && 'mt-5')}>
              {group.section && (
                <p className="mb-1 px-2 text-xs font-medium text-fg-muted">{group.section}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink key={item.label} item={item} active={item.label === active} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-0.5 border-t border-border pt-2">
          <NavLink item={{ label: 'Settings', icon: Settings, href: '/settings' }} active={false} />
          <button
            type="button"
            className="flex h-10 w-full items-center gap-2.5 rounded-md px-2 text-left hover:bg-surface-muted"
          >
            <span className="grid size-6 place-items-center rounded-full bg-neutral-soft text-xs font-semibold text-on-neutral-soft">
              TP
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">Thoko Phiri</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:py-2 lg:pr-2">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface lg:rounded-xl lg:border lg:border-border lg:shadow-xs">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3 lg:px-5">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-1 px-1.5 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu />
            </Button>
            {header}
          </header>
          <main className="flex min-h-0 flex-1 flex-col overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Dashboard home                                                                              */
/* ------------------------------------------------------------------------------------------ */

function Delta({ children, tone = 'up' }: { children: ReactNode; tone?: 'up' | 'flat' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
        tone === 'up'
          ? 'bg-success-soft text-on-success-soft'
          : 'bg-neutral-soft text-on-neutral-soft'
      )}
    >
      {tone === 'up' && <ArrowUpRight className="size-3" aria-hidden />}
      {children}
    </span>
  );
}

const KPIS = [
  { label: 'Farmer profiles', value: '3,527', delta: '+86', note: 'this month' },
  { label: 'Contracted farmers', value: '2,904', delta: '82%', note: 'of profiles', flat: true },
  { label: 'Total acreage', value: '8,941.5', delta: '+212.0', note: 'this month' },
  { label: 'Farmer dependents', value: '14,302', delta: '4.1', note: 'per farmer', flat: true },
];

function Panel({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn('rounded-xl border border-border bg-surface', className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className="px-5 pt-3 pb-5">{children}</div>
    </section>
  );
}

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const THIS_SEASON = [120, 184, 236, 310, 86, null, null, null, null, null, null, null];
const LAST_SEASON = [96, 150, 201, 254, 198, 140, 88, 61, 52, 47, 40, 35];

function RegistrationsChart() {
  const max = 320;
  const h = 180;
  return (
    <figure>
      <div className="mb-3 flex gap-4 text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-chart-1" /> 2026/27
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-chart-5" /> 2025/26
        </span>
      </div>
      <div className="relative" style={{ height: h }}>
        {[0, 100, 200, 300].map((tick) => (
          <div
            key={tick}
            className="absolute inset-x-0 flex items-center gap-2"
            style={{ bottom: (tick / max) * h }}
          >
            <span className="w-7 text-right text-xs text-fg-muted tabular-nums">{tick}</span>
            <span className="h-px flex-1 border-t border-dashed border-border" />
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 left-9 flex items-end gap-1 sm:gap-2">
          {MONTHS.map((m, i) => (
            <div key={m} className="flex h-full flex-1 items-end justify-center gap-0.5">
              <div
                className="w-full max-w-3 rounded-t-sm bg-chart-5"
                style={{ height: `${((LAST_SEASON[i] ?? 0) / max) * 100}%` }}
              />
              <div
                className="w-full max-w-3 rounded-t-sm bg-chart-1"
                style={{ height: `${((THIS_SEASON[i] ?? 0) / max) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 ml-9 flex gap-1 sm:gap-2">
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center text-xs text-fg-muted">
            {m}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        Farmer registrations by month: 2026/27 so far 936, against 949 by November last season.
      </figcaption>
    </figure>
  );
}

const HUBS = [
  { name: 'Chikwawa', count: 1204 },
  { name: 'Nsanje', count: 892 },
  { name: 'Balaka', count: 761 },
  { name: 'Machinga', count: 670 },
];

const SPLITS = [
  { label: 'Gender', a: ['Female', 1894], b: ['Male', 1633] },
  { label: 'Age', a: ['Under 35', 1288], b: ['35 and over', 2239] },
  { label: 'Land', a: ['Owned', 2410], b: ['Rented', 1117] },
] as const;

const ATTENTION = [
  { icon: UserCheck, label: 'Registrations pending review', count: 14 },
  { icon: FileSignature, label: 'Contracts awaiting signature', count: 9 },
  { icon: ClipboardList, label: 'Survey responses to check', count: 23 },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-muted', className)} />;
}

type HomeState = 'data' | 'loading' | 'error';

function DashboardHome({ state }: { state: HomeState }) {
  return (
    <Shell
      active="Home"
      header={
        <>
          <h1 className="text-sm font-medium">Home</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={state === 'loading'}>
              <RefreshCw className={cn(state === 'loading' && 'animate-spin')} />
              <span className="sr-only sm:not-sr-only">Refresh</span>
            </Button>
            <Button size="sm">
              <Plus /> Register farmer
            </Button>
          </div>
        </>
      }
    >
      <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6 lg:px-8 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-fg-muted">Thursday, 12 November</p>
            <p className="mt-0.5 text-3xl font-semibold tracking-tight">Good morning, Thoko</p>
          </div>
          <Button variant="secondary" size="sm">
            Season 2026/27 <ChevronDown />
          </Button>
        </div>

        {state === 'error' && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-danger-soft px-4 py-3 text-on-danger-soft"
          >
            <p className="flex-1 text-sm font-medium">
              Could not load dashboard totals. Check your connection and try again.
            </p>
            <Button variant="secondary" size="sm">
              Retry
            </Button>
          </div>
        )}

        {state === 'loading' && (
          <div role="status" aria-busy="true" className="space-y-5">
            <span className="sr-only">Loading dashboard…</span>
            <Skeleton className="h-28" />
            <div className="grid gap-5 lg:grid-cols-3">
              <Skeleton className="h-72 lg:col-span-2" />
              <Skeleton className="h-72" />
            </div>
          </div>
        )}

        {state === 'data' && (
          <>
            <section
              aria-label="Key figures"
              className="grid grid-cols-2 overflow-hidden rounded-xl border border-border lg:grid-cols-4"
            >
              {KPIS.map((k, i) => (
                <div
                  key={k.label}
                  className={cn(
                    'border-border px-5 py-4',
                    i % 2 === 1 && 'border-l',
                    i >= 2 && 'border-t lg:border-t-0',
                    i === 2 && 'lg:border-l'
                  )}
                >
                  <p className="text-sm text-fg-muted">{k.label}</p>
                  <p className="mt-1 text-3xl font-medium tracking-tight tabular-nums">{k.value}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-fg-muted">
                    <Delta tone={k.flat ? 'flat' : 'up'}>{k.delta}</Delta>
                    {k.note}
                  </p>
                </div>
              ))}
            </section>

            <div className="grid gap-5 lg:grid-cols-3">
              <Panel
                title="Registrations"
                description="New farmer profiles by month"
                className="lg:col-span-2"
                action={
                  <a
                    href="/reports/registrations"
                    className="text-sm font-medium text-fg-muted hover:text-fg"
                  >
                    View report
                  </a>
                }
              >
                <RegistrationsChart />
              </Panel>
              <Panel title="By hub" description="Farmer profiles">
                <ul className="space-y-4">
                  {HUBS.map((hub) => (
                    <li key={hub.name}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{hub.name}</span>
                        <span className="text-fg-muted tabular-nums">
                          {hub.count.toLocaleString('en-GB')}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-chart-1"
                          style={{ width: `${(hub.count / 1204) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <Panel title="Farmer profile" className="lg:col-span-2">
                <dl className="space-y-4">
                  {SPLITS.map(({ label, a, b }) => {
                    const pa = Math.round((a[1] / (a[1] + b[1])) * 100);
                    return (
                      <div key={label} className="grid items-center gap-2 sm:grid-cols-[6rem_1fr]">
                        <dt className="text-sm font-medium">{label}</dt>
                        <dd>
                          <div className="flex h-2 overflow-hidden rounded-full" aria-hidden>
                            <div className="bg-chart-1" style={{ width: `${pa}%` }} />
                            <div className="bg-chart-2" style={{ width: `${100 - pa}%` }} />
                          </div>
                          <div className="mt-1.5 flex justify-between text-xs text-fg-muted">
                            <span>
                              <span className="mr-1 inline-block size-2 rounded-sm bg-chart-1" />
                              {a[0]} · {a[1].toLocaleString('en-GB')} ({pa}%)
                            </span>
                            <span>
                              <span className="mr-1 inline-block size-2 rounded-sm bg-chart-2" />
                              {b[0]} · {b[1].toLocaleString('en-GB')} ({100 - pa}%)
                            </span>
                          </div>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </Panel>
              <Panel title="Needs attention">
                <ul className="-mx-2">
                  {ATTENTION.map(({ icon: Icon, label, count }) => (
                    <li key={label}>
                      <a
                        href="/farmers?view=pending-review"
                        className="flex h-10 items-center gap-3 rounded-md px-2 text-sm hover:bg-surface-muted pointer-coarse:h-11"
                      >
                        <Icon className="size-4 text-fg-muted" aria-hidden />
                        <span className="flex-1">{label}</span>
                        <span className="rounded-md bg-warning-soft px-1.5 text-xs font-semibold text-on-warning-soft tabular-nums">
                          {count}
                        </span>
                        <ChevronRight className="size-4 text-fg-muted" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------------------------------ */
/* Farmers list                                                                                */
/* ------------------------------------------------------------------------------------------ */

const FIRST = ['Chikondi', 'Mphatso', 'Kondwani', 'Tiyamike', 'Limbani', 'Chisomo', 'Madalitso'];
const LAST = ['Banda', 'Phiri', 'Mwale', 'Tembo', 'Chirwa', 'Kumwenda', 'Nkhoma', 'Gondwe'];
const OFFICERS = ['Grace Mbewe', 'Peter Zulu', 'Ruth Kaunda'];
const STATUSES = {
  contracted: { label: 'Contracted', dot: 'bg-success', tone: 'text-on-success-soft' },
  registered: { label: 'Registered', dot: 'bg-info', tone: 'text-on-info-soft' },
  pending: { label: 'Pending review', dot: 'bg-warning', tone: 'text-on-warning-soft' },
  inactive: { label: 'Inactive', dot: 'bg-neutral', tone: 'text-on-neutral-soft' },
} as const;
const STATUS_ORDER = [
  'contracted',
  'contracted',
  'pending',
  'contracted',
  'registered',
  'inactive',
] as const;

const ROWS = Array.from({ length: 16 }, (_, i) => {
  const first = FIRST[i % FIRST.length] ?? '';
  const last = LAST[(i * 3) % LAST.length] ?? '';
  return {
    id: 101 + i,
    name: `${first} ${last}`,
    initials: `${first[0] ?? ''}${last[0] ?? ''}`,
    phone: `+265 991 000 ${String(101 + i)}`,
    hub: HUBS[i % HUBS.length]?.name ?? '',
    officer: OFFICERS[i % OFFICERS.length] ?? '',
    status: STATUSES[STATUS_ORDER[i % STATUS_ORDER.length] ?? 'contracted'],
    acres: ((i * 37) % 9) + 0.5,
    balance: ((i * 7919) % 90) * 1500 - 30000,
  };
});

const mwk = (n: number) =>
  `${n < 0 ? 'Owes ' : ''}MWK ${Math.abs(n).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

const VIEWS = [
  ['All farmers', '3,527'],
  ['Contracted', '2,904'],
  ['Pending review', '14'],
  ['Open market', '623'],
] as const;

const COLUMNS = [
  { label: 'Farmer' },
  { label: 'Phone', className: 'hidden lg:table-cell' },
  { label: 'Hub' },
  { label: 'Field officer', className: 'hidden lg:table-cell' },
  { label: 'Status' },
  { label: 'Acres', className: 'text-right' },
  { label: 'Balance', className: 'pr-5 text-right' },
];

function StatusPill({ status }: { status: (typeof STATUSES)[keyof typeof STATUSES] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs font-medium">
      <span className={cn('size-1.5 rounded-full', status.dot)} aria-hidden />
      {status.label}
    </span>
  );
}

function FilterChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-surface-muted pr-0.5 pl-2 text-sm pointer-coarse:h-11">
      {children}
      <button
        type="button"
        aria-label="Remove filter"
        className="grid size-6 place-items-center rounded text-fg-muted hover:bg-surface hover:text-fg"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </span>
  );
}

function FarmersList() {
  return (
    <Shell
      active="Farmers"
      header={
        <>
          <h1 className="text-sm font-medium">Farmers</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Download /> <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            <Button size="sm">
              <Plus /> Register farmer
            </Button>
          </div>
        </>
      }
    >
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border px-3 py-2 lg:px-5">
        {VIEWS.map(([label, count], i) => (
          <a
            key={label}
            href={`/farmers?view=${label.toLowerCase().replace(/ /g, '-')}`}
            aria-current={i === 0 ? 'page' : undefined}
            className={cn(
              'flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-fg-muted hover:text-fg pointer-coarse:h-11',
              'aria-[current=page]:bg-surface-muted aria-[current=page]:text-fg aria-[current=page]:ring-1 aria-[current=page]:ring-border'
            )}
          >
            {label}
            <span className="text-xs text-fg-muted tabular-nums">{count}</span>
          </a>
        ))}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2.5 lg:px-5">
        <label className="flex h-7 w-full items-center gap-2 rounded-md border border-input px-2 sm:w-60 pointer-coarse:h-11">
          <Search className="size-4 text-fg-muted" aria-hidden />
          <span className="sr-only">Search farmers</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-fg-muted"
            placeholder="Search name, phone or ID"
          />
        </label>
        <Button variant="secondary" size="sm">
          <ListFilter /> Filter
        </Button>
        <FilterChip>
          <span className="text-fg-muted">Season</span> 2026/27
        </FilterChip>
        <FilterChip>
          <span className="text-fg-muted">Hub</span> Chikwawa, Nsanje
        </FilterChip>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="sm">
            <ArrowUpDown /> Sort
          </Button>
          <Button variant="ghost" size="sm">
            <Columns3 /> Columns
          </Button>
        </div>
      </div>

      <div className="hidden min-h-0 flex-1 overflow-auto border-t border-border md:block">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-surface-muted text-xs text-fg-muted">
            <tr className="border-b border-border">
              <th className="w-10 py-2 pl-5">
                <input type="checkbox" aria-label="Select all farmers" className="accent-brand" />
              </th>
              {COLUMNS.map((c) => (
                <th key={c.label} className={cn('px-3 py-2 font-medium', c.className)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-surface-muted">
                <td className="py-2 pl-5">
                  <input type="checkbox" aria-label={`Select ${r.name}`} className="accent-brand" />
                </td>
                <td className="px-3 py-2">
                  <a href={`/farmers/${r.id}`} className="flex items-center gap-2.5 font-medium">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-[0.6875rem] font-semibold text-on-brand-soft">
                      {r.initials}
                    </span>
                    <span className="hover:underline">{r.name}</span>
                  </a>
                </td>
                <td className="hidden px-3 py-2 text-fg-muted tabular-nums lg:table-cell">
                  {r.phone}
                </td>
                <td className="px-3 py-2">{r.hub}</td>
                <td className="hidden px-3 py-2 lg:table-cell">{r.officer}</td>
                <td className="px-3 py-2">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-2 text-right tabular-nums">{r.acres.toFixed(1)}</td>
                <td
                  className={cn(
                    'py-2 pr-5 pl-3 text-right tabular-nums',
                    r.balance < 0 && 'font-medium text-on-danger-soft'
                  )}
                >
                  {mwk(r.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border border-t border-border md:hidden">
        {ROWS.slice(0, 8).map((r) => (
          <li key={r.id}>
            <a href={`/farmers/${r.id}`} className="flex items-center gap-3 px-3 py-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-on-brand-soft">
                {r.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{r.name}</span>
                <span className="block truncate text-sm text-fg-muted">
                  {r.hub} · {mwk(r.balance)}
                </span>
              </span>
              <StatusPill status={r.status} />
            </a>
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-sm text-fg-muted lg:px-5">
        <span>
          Showing <span className="text-fg tabular-nums">1–25</span> of{' '}
          <span className="text-fg tabular-nums">3,527</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Rows per page</span>
          <Button variant="secondary" size="sm">
            25 <ChevronDown />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="px-1.5"
            aria-label="Previous page"
            disabled
          >
            <ChevronLeft />
          </Button>
          <Button variant="secondary" size="sm" className="px-1.5" aria-label="Next page">
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Shell>
  );
}

const meta = {
  title: 'Direction/CRM',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const DashboardHomeStory: StoryObj<{ state: HomeState }> = {
  name: 'Dashboard home',
  args: { state: 'data' },
  argTypes: { state: { control: 'inline-radio', options: ['data', 'loading', 'error'] } },
  render: ({ state }) => <DashboardHome state={state} />,
};

export const FarmersListStory: StoryObj = {
  name: 'Farmers list',
  render: () => <FarmersList />,
};
