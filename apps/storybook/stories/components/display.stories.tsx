import {
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  IconButton,
  Separator,
  Skeleton,
  Stat,
  StatGroup,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileText, MoreHorizontal, Pencil, Phone, Plus } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Display',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-bg p-6 text-fg">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const;
const STATUS_LABELS = {
  neutral: 'Inactive',
  brand: 'GGEM farmer',
  success: 'Contracted',
  warning: 'Pending review',
  danger: 'Overdue',
  info: 'Registered',
};

export const Badges: Story = {
  render: () => (
    <Card>
      <CardContent className="space-y-4 pt-5">
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone}>
              {STATUS_LABELS[tone]}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TONES.map((tone) => (
            <Badge key={tone} variant="outline" tone={tone}>
              {STATUS_LABELS[tone]}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

export const Stats: Story = {
  render: () => (
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
        label="Input credit owed"
        value="MWK 41.2M"
        delta="+6%"
        trend="up"
        deltaTone="negative"
        note="vs last month"
      />
      <Stat
        label="Payouts due"
        value="128"
        delta="−14"
        trend="down"
        deltaTone="positive"
        note="since Monday"
      />
    </StatGroup>
  ),
};

export const Cards: Story = {
  render: () => (
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
          <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border text-sm text-fg-muted">
            Chart area
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Field officer</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Avatar name="Grace Mbewe" size="lg" />
          <div className="min-w-0 text-sm">
            <p className="font-medium">Grace Mbewe</p>
            <p className="text-fg-muted">Chikwawa hub · 214 farmers</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm">
            <Phone /> Call
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto">
            View profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const TabStyles: Story = {
  name: 'Tabs',
  render: () => (
    <Card>
      <CardContent className="space-y-8 pt-4">
        <Tabs defaultValue="overview">
          <TabsList aria-label="Farmer profile">
            <Tab value="overview">Overview</Tab>
            <Tab value="contracts">
              Contracts <span className="text-xs text-fg-muted tabular-nums">3</span>
            </Tab>
            <Tab value="finance">Finance</Tab>
            <Tab value="surveys">Surveys</Tab>
            <Tab value="messages" disabled>
              Messages
            </Tab>
          </TabsList>
          <TabsPanel value="overview" className="text-sm text-fg-muted">
            Overview panel
          </TabsPanel>
          <TabsPanel value="contracts" className="text-sm text-fg-muted">
            Contracts panel
          </TabsPanel>
          <TabsPanel value="finance" className="text-sm text-fg-muted">
            Finance panel
          </TabsPanel>
          <TabsPanel value="surveys" className="text-sm text-fg-muted">
            Surveys panel
          </TabsPanel>
        </Tabs>
        <Tabs defaultValue="list">
          <TabsList variant="segmented" aria-label="Farmers view">
            <Tab value="list">List</Tab>
            <Tab value="insights">Insights</Tab>
            <Tab value="map">Map</Tab>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Chikondi Banda" size="sm" />
      <Avatar name="Mphatso Tembo" />
      <Avatar name="Grace Mbewe" size="lg" labelled />
      <Separator orientation="vertical" className="mx-2 h-8" />
      <Avatar name="Broken Image" src="https://invalid.example/photo.jpg" labelled />
    </div>
  ),
};

function LoadingStates() {
  const [retrying, setRetrying] = useState(false);
  return (
    <div className="space-y-5">
      <div
        role="status"
        aria-busy="true"
        className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4"
      >
        <span className="sr-only">Loading key figures…</span>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 bg-surface px-5 py-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
      <ErrorState
        variant="banner"
        title="Totals may be out of date"
        description="The last refresh failed. Showing figures from 09:12."
        retrying={retrying}
        onRetry={() => {
          setRetrying(true);
          setTimeout(() => {
            setRetrying(false);
          }, 1500);
        }}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <ErrorState onRetry={() => {}} />
        </Card>
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
      </div>
    </div>
  );
}

export const States: Story = {
  name: 'Loading, empty and error',
  render: () => <LoadingStates />,
};

function FarmerProfile() {
  const [tab, setTab] = useState('overview');
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar name="Chikondi Banda" size="lg" />
        <div className="min-w-[12rem] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Chikondi Banda</h1>
            <Badge variant="outline" tone="success">
              Contracted
            </Badge>
          </div>
          <p className="text-sm text-fg-muted">
            GGEM farmer · Chikwawa hub · Registered 4 Mar 2025
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Pencil /> Edit
          </Button>
          <IconButton label="More actions for Chikondi Banda" variant="secondary">
            <MoreHorizontal />
          </IconButton>
        </div>
      </div>
      <Tabs
        value={tab}
        onValueChange={(v: string) => {
          setTab(v);
        }}
      >
        <TabsList aria-label="Farmer profile">
          <Tab value="overview">Overview</Tab>
          <Tab value="contracts">Contracts</Tab>
          <Tab value="finance">Finance</Tab>
          <Tab value="surveys">Surveys</Tab>
        </TabsList>
        <TabsPanel value="overview" className="space-y-5">
          <StatGroup>
            <Stat label="Acres" value="2.5" />
            <Stat label="Balance" value="MWK 30,000" note="owed" />
            <Stat label="Contracts" value="3" note="1 active" />
            <Stat label="Surveys" value="5" note="last 12 Oct" />
          </StatGroup>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ['Phone', '+265 991 000 101'],
                  ['Village', 'Ngabu'],
                  ['Field officer', 'Grace Mbewe'],
                  ['Land', 'Owned'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                    <dt className="text-fg-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </TabsPanel>
        <TabsPanel value="contracts">
          <Card>
            <EmptyState
              icon={<FileText />}
              title="No contracts this season"
              description="Contracts appear here once the farmer signs for 2026/27."
              action={<Button size="sm">New contract</Button>}
            />
          </Card>
        </TabsPanel>
        <TabsPanel value="finance">
          <Card>
            <ErrorState onRetry={() => {}} />
          </Card>
        </TabsPanel>
        <TabsPanel value="surveys">
          <Card>
            <CardContent className="space-y-3 pt-5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        </TabsPanel>
      </Tabs>
    </div>
  );
}

export const ExampleProfile: Story = {
  name: 'Example: farmer profile',
  render: () => <FarmerProfile />,
};
