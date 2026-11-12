/**
 * The approved CRM direction rebuilt from kit components (synthetic data). Click the sidebar,
 * a farmer row, or the breadcrumb to move between pages.
 */
import {
  AppShell,
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  createDataTableColumnHelper,
  DataTable,
  FilterBar,
  FilterChip,
  SearchInput,
  DetailList,
  EmptyState,
  IconButton,
  Page,
  PageBar,
  PageHeader,
  RecordHeader,
  RecordLayout,
  Select,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarLink,
  SidebarNav,
  SidebarSection,
  SidebarSubmenu,
  Stat,
  StatGroup,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Banknote,
  ChartColumn,
  ChevronsUpDown,
  ClipboardList,
  Download,
  FileText,
  Headset,
  House,
  MessageSquare,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  Settings,
  Sprout,
  Store,
  Users,
} from 'lucide-react';
import { useMemo, useState, type MouseEvent, type ReactNode } from 'react';

type Route = { page: 'home' } | { page: 'farmers' } | { page: 'farmer'; id: number };

const FIRST = ['Chikondi', 'Mphatso', 'Kondwani', 'Tiyamike', 'Limbani', 'Chisomo', 'Madalitso'];
const LAST = ['Banda', 'Phiri', 'Mwale', 'Tembo', 'Chirwa', 'Kumwenda', 'Nkhoma', 'Gondwe'];
const HUBS = ['Chikwawa', 'Nsanje', 'Balaka', 'Machinga'];
const OFFICERS = ['Grace Mbewe', 'Peter Zulu', 'Ruth Kaunda'];
const STATUS = [
  { label: 'Contracted', tone: 'success' },
  { label: 'Contracted', tone: 'success' },
  { label: 'Pending review', tone: 'warning' },
  { label: 'Registered', tone: 'info' },
  { label: 'Inactive', tone: 'neutral' },
] as const;

const FARMERS = Array.from({ length: 14 }, (_, i) => ({
  id: 101 + i,
  name: `${FIRST[i % FIRST.length] ?? ''} ${LAST[(i * 3) % LAST.length] ?? ''}`,
  phone: `+265 991 000 ${String(101 + i)}`,
  hub: HUBS[i % HUBS.length] ?? '',
  officer: OFFICERS[i % OFFICERS.length] ?? '',
  status: STATUS[i % STATUS.length] ?? STATUS[0],
  acres: ((i * 37) % 9) + 0.5,
  balance: ((i * 7919) % 90) * 1500 - 30000,
}));

const mwk = (n: number) =>
  `${n < 0 ? 'Owes ' : ''}MWK ${Math.abs(n).toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;

function go(navigate: (r: Route) => void, route: Route) {
  return (e: MouseEvent) => {
    e.preventDefault();
    navigate(route);
  };
}

function Nav({ route, navigate }: { route: Route; navigate: (r: Route) => void }) {
  const isFarmers = route.page !== 'home';
  return (
    <Sidebar>
      <SidebarHeader>
        <button
          type="button"
          className="flex h-10 items-center gap-2.5 rounded-md px-2 text-left hover:bg-surface-hover"
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
          className="flex h-8 items-center gap-2 rounded-md border border-border bg-surface px-2 text-sm text-fg-muted shadow-xs hover:text-fg pointer-coarse:h-11"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded border border-border px-1 font-sans text-xs">⌘K</kbd>
        </button>
      </SidebarHeader>
      <SidebarNav>
        <SidebarSection>
          <SidebarLink
            href="/"
            icon={<House />}
            active={route.page === 'home'}
            onClick={go(navigate, { page: 'home' })}
          >
            Home
          </SidebarLink>
        </SidebarSection>
        <SidebarSection label="Farmers">
          <SidebarSubmenu label="Farmers" icon={<Users />} active={isFarmers}>
            <SidebarLink
              href="/farmers"
              active={isFarmers}
              onClick={go(navigate, { page: 'farmers' })}
            >
              Smallholders
            </SidebarLink>
            <SidebarLink href="/farmers/open-market">Open market</SidebarLink>
            <SidebarLink href="/farmers/partners">Partners</SidebarLink>
          </SidebarSubmenu>
          <SidebarLink href="/contracts" icon={<FileText />}>
            Contracts
          </SidebarLink>
          <SidebarLink href="/surveys" icon={<ClipboardList />} count={23}>
            Surveys
          </SidebarLink>
        </SidebarSection>
        <SidebarSection label="Operations">
          <SidebarLink href="/operations/markets" icon={<Store />}>
            Markets
          </SidebarLink>
          <SidebarLink href="/operations/inputs" icon={<Package />}>
            Inputs
          </SidebarLink>
          <SidebarLink href="/operations/payouts" icon={<Banknote />}>
            Payouts
          </SidebarLink>
        </SidebarSection>
        <SidebarSection label="Engagement">
          <SidebarLink href="/engagement/sms" icon={<MessageSquare />}>
            SMS
          </SidebarLink>
          <SidebarLink href="/engagement/call-centre" icon={<Headset />}>
            Call centre
          </SidebarLink>
        </SidebarSection>
        <SidebarSection label="Insights">
          <SidebarLink href="/reports" icon={<ChartColumn />}>
            Reports
          </SidebarLink>
        </SidebarSection>
      </SidebarNav>
      <SidebarFooter>
        <SidebarLink href="/settings" icon={<Settings />}>
          Settings
        </SidebarLink>
        <div className="flex h-10 items-center gap-2.5 px-2">
          <Avatar name="Thoko Phiri" size="sm" />
          <span className="truncate text-sm font-medium">Thoko Phiri</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const THIS = [120, 184, 236, 310, 86];
const LAST_SEASON = [96, 150, 201, 254, 198, 140, 88, 61, 52, 47, 40, 35];

function Bars() {
  return (
    <figure>
      <div className="flex h-44 items-end gap-1 sm:gap-2" aria-hidden>
        {MONTHS.map((m, i) => (
          <div key={m} className="flex h-full flex-1 items-end justify-center gap-0.5">
            <div
              className="w-full max-w-3 rounded-t-sm bg-chart-5"
              style={{ height: `${((LAST_SEASON[i] ?? 0) / 320) * 100}%` }}
            />
            <div
              className="w-full max-w-3 rounded-t-sm bg-chart-1"
              style={{ height: `${((THIS[i] ?? 0) / 320) * 100}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 sm:gap-2" aria-hidden>
        {MONTHS.map((m) => (
          <span key={m} className="flex-1 text-center text-xs text-fg-muted">
            {m}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">
        Registrations by month: 936 so far this season, 949 by November last season.
      </figcaption>
    </figure>
  );
}

function HomePage() {
  return (
    <>
      <PageBar
        title="Home"
        actions={
          <Button size="sm">
            <Plus /> Register farmer
          </Button>
        }
      />
      <Page>
        <PageHeader
          eyebrow="Thursday, 12 November"
          title="Good morning, Thoko"
          actions={
            <Select
              aria-label="Season"
              options={[
                { value: '2026', label: 'Season 2026/27' },
                { value: '2025', label: 'Season 2025/26' },
              ]}
              defaultValue="2026"
              className="w-44"
            />
          }
        />
        <StatGroup>
          <Stat
            label="Farmer profiles"
            value="3,527"
            delta="+86"
            trend="up"
            deltaTone="positive"
            note="this month"
          />
          <Stat label="Contracted farmers" value="2,904" delta="82%" note="of profiles" />
          <Stat
            label="Total acreage"
            value="8,941.5"
            delta="+212.0"
            trend="up"
            deltaTone="positive"
            note="this month"
          />
          <Stat label="Farmer dependents" value="14,302" delta="4.1" note="per farmer" />
        </StatGroup>
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Registrations</CardTitle>
                <CardDescription>New farmer profiles by month</CardDescription>
              </div>
              <CardAction>
                <a
                  href="/reports/registrations"
                  className="text-sm font-medium text-fg-muted hover:text-fg"
                >
                  View report
                </a>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Bars />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>By hub</CardTitle>
                <CardDescription>Farmer profiles</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  ['Chikwawa', 1204],
                  ['Nsanje', 892],
                  ['Balaka', 761],
                  ['Machinga', 670],
                ].map(([hub, n]) => (
                  <li key={hub}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{hub}</span>
                      <span className="text-fg-muted tabular-nums">
                        {Number(n).toLocaleString('en-GB')}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-surface-hover">
                      <div
                        className="h-full rounded-full bg-chart-1"
                        style={{ width: `${(Number(n) / 1204) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </Page>
    </>
  );
}

const farmerColumns = (navigate: (r: Route) => void) => {
  const col = createDataTableColumnHelper<(typeof FARMERS)[number]>();
  return col.columns([
    col.accessor('name', {
      header: 'Farmer',
      meta: { card: 'title' },
      cell: (info) => (
        <a
          href={`/farmers/${String(info.row.original.id)}`}
          onClick={go(navigate, { page: 'farmer', id: info.row.original.id })}
          className="inline-flex items-center gap-2.5 font-medium hover:underline"
        >
          <Avatar name={info.getValue()} size="sm" />
          {info.getValue()}
        </a>
      ),
    }),
    col.accessor('phone', { header: 'Phone', enableSorting: false, meta: { priority: 'low' } }),
    col.accessor('hub', { header: 'Hub', meta: { card: 'subtitle' } }),
    col.accessor((f) => f.status.label, {
      id: 'status',
      header: 'Status',
      meta: { card: 'trailing' },
      cell: (info) => (
        <Badge variant="outline" tone={info.row.original.status.tone}>
          {info.getValue()}
        </Badge>
      ),
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
  ]);
};

function FarmersPage({ navigate }: { navigate: (r: Route) => void }) {
  const [query, setQuery] = useState('');
  const [hub, setHub] = useState<string | null>(null);
  const columns = useMemo(() => farmerColumns(navigate), [navigate]);
  const rows = useMemo(
    () =>
      FARMERS.filter(
        (f) =>
          (!query || f.name.toLowerCase().includes(query.toLowerCase())) && (!hub || f.hub === hub)
      ),
    [query, hub]
  );
  return (
    <>
      <PageBar
        title="Farmers"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download /> <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            <Button size="sm">
              <Plus /> Register farmer
            </Button>
          </>
        }
      />
      <Page width="full">
        <Tabs defaultValue="all" className="gap-0">
          <div className="border-b border-border px-3 py-2 lg:px-5">
            <TabsList variant="segmented" aria-label="Saved views">
              <Tab value="all">
                All farmers <span className="text-xs text-fg-muted">3,527</span>
              </Tab>
              <Tab value="contracted">
                Contracted <span className="text-xs text-fg-muted">2,904</span>
              </Tab>
              <Tab value="pending">
                Pending review <span className="text-xs text-fg-muted">14</span>
              </Tab>
            </TabsList>
          </div>
        </Tabs>
        <FilterBar
          search={
            <SearchInput
              aria-label="Search farmers"
              placeholder="Search name, phone or ID"
              value={query}
              onValueChange={setQuery}
            />
          }
          filters={
            <Select
              aria-label="Hub"
              placeholder="All hubs"
              value={hub}
              onValueChange={setHub}
              options={HUBS.map((h) => ({ value: h, label: h }))}
              className="h-8 w-40"
            />
          }
          activeCount={hub ? 1 : 0}
          chips={
            hub ? (
              <FilterChip
                label="Hub"
                value={hub}
                onRemove={() => {
                  setHub(null);
                }}
              />
            ) : undefined
          }
          onClearAll={() => {
            setHub(null);
            setQuery('');
          }}
        />
        <DataTable
          aria-label="Farmers"
          columns={columns}
          data={rows}
          getRowId={(f) => String(f.id)}
          getRowLabel={(f) => f.name}
          enableRowSelection
          onRowClick={(f) => {
            navigate({ page: 'farmer', id: f.id });
          }}
        />
      </Page>
    </>
  );
}

function FarmerPage({ id, navigate }: { id: number; navigate: (r: Route) => void }) {
  const f = FARMERS.find((x) => x.id === id) ?? FARMERS[0];
  if (!f) return null;
  return (
    <>
      <PageBar
        breadcrumb={
          <a href="/farmers" onClick={go(navigate, { page: 'farmers' })} className="hover:text-fg">
            Farmers
          </a>
        }
        title={f.name}
      />
      <RecordLayout
        header={
          <RecordHeader
            media={<Avatar name={f.name} size="lg" />}
            title={f.name}
            status={
              <Badge variant="outline" tone={f.status.tone}>
                {f.status.label}
              </Badge>
            }
            meta={`GGEM farmer · ${f.hub} hub · Field officer ${f.officer}`}
            actions={
              <>
                <Button variant="secondary">
                  <Pencil /> Edit
                </Button>
                <IconButton label={`More actions for ${f.name}`} variant="secondary">
                  <MoreHorizontal />
                </IconButton>
              </>
            }
          />
        }
        aside={
          <Card>
            <CardHeader>
              <CardTitle as="h3">Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <DetailList
                items={[
                  { label: 'Phone', value: f.phone },
                  { label: 'Hub', value: f.hub },
                  { label: 'Field officer', value: f.officer },
                  { label: 'Acres', value: f.acres.toFixed(1) },
                  { label: 'National ID', value: null },
                ]}
              />
            </CardContent>
          </Card>
        }
      >
        <Tabs defaultValue="overview">
          <TabsList aria-label="Farmer profile">
            <Tab value="overview">Overview</Tab>
            <Tab value="contracts">Contracts</Tab>
            <Tab value="finance">Finance</Tab>
          </TabsList>
          <TabsPanel value="overview">
            <StatGroup>
              <Stat
                label="Balance"
                value={`MWK ${Math.abs(f.balance).toLocaleString('en-GB')}`}
                note={f.balance < 0 ? 'owed' : 'in credit'}
              />
              <Stat label="Contracts" value="3" note="1 active" />
              <Stat label="Surveys" value="5" note="last 12 Oct" />
            </StatGroup>
          </TabsPanel>
          <TabsPanel value="contracts">
            <Card>
              <EmptyState
                icon={<FileText />}
                title="No contracts this season"
                description="Contracts appear here once the farmer signs for 2026/27."
                action={
                  <Button size="sm">
                    <Plus /> New contract
                  </Button>
                }
              />
            </Card>
          </TabsPanel>
          <TabsPanel value="finance">
            <Card>
              <EmptyState title="No transactions yet" />
            </Card>
          </TabsPanel>
        </Tabs>
      </RecordLayout>
    </>
  );
}

function CrmApp({ initial }: { initial: Route }) {
  const [route, navigate] = useState<Route>(initial);
  let page: ReactNode;
  if (route.page === 'home') page = <HomePage />;
  else if (route.page === 'farmers') page = <FarmersPage navigate={navigate} />;
  else page = <FarmerPage id={route.id} navigate={navigate} />;
  return <AppShell sidebar={<Nav route={route} navigate={navigate} />}>{page}</AppShell>;
}

const meta = {
  title: 'Examples/CRM app',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = { render: () => <CrmApp initial={{ page: 'home' }} /> };
export const Farmers: Story = { render: () => <CrmApp initial={{ page: 'farmers' }} /> };
export const FarmerRecord: Story = {
  name: 'Farmer record',
  render: () => <CrmApp initial={{ page: 'farmer', id: 101 }} />,
};
