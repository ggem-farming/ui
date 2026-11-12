import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  initials,
  Separator,
  Skeleton,
  Stat,
  StatGroup,
  Tab,
  Tabs,
  TabsList,
  TabsPanel,
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

describe('Badge', () => {
  it('shows text with an optional decorative dot', async () => {
    const { container } = render(
      <>
        <Badge tone="success">Contracted</Badge>
        <Badge variant="outline" tone="warning">
          Pending review
        </Badge>
      </>
    );
    expect(screen.getByText('Contracted').querySelector('[aria-hidden]')).toBeNull();
    expect(screen.getByText('Pending review').querySelector('[aria-hidden]')).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('StatGroup', () => {
  it('pairs each label with its value and delta as a description list', async () => {
    const { container } = render(
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
      </StatGroup>
    );
    const terms = screen.getAllByRole('term').map((t) => t.textContent);
    expect(terms).toEqual(['Farmer profiles', 'Contracted farmers']);
    const definitions = screen.getAllByRole('definition').map((d) => d.textContent);
    expect(definitions).toEqual(['3,527', '+86this month', '2,904', '82%of profiles']);
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Card', () => {
  it('uses the requested heading level', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle as="h3">Registrations</CardTitle>
          <CardAction>
            <a href="/reports/registrations">View report</a>
          </CardAction>
        </CardHeader>
        <CardContent>Chart</CardContent>
      </Card>
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Registrations' })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Tabs', () => {
  it('moves between tabs with the keyboard and reports the value', async () => {
    const onChange = vi.fn();
    function Profile() {
      const [tab, setTab] = useState('overview');
      return (
        <Tabs
          value={tab}
          onValueChange={(value: string) => {
            setTab(value);
            onChange(value);
          }}
        >
          <TabsList aria-label="Farmer profile">
            <Tab value="overview">Overview</Tab>
            <Tab value="contracts">Contracts</Tab>
            <Tab value="finance">Finance</Tab>
          </TabsList>
          <TabsPanel value="overview">Overview panel</TabsPanel>
          <TabsPanel value="contracts">Contracts panel</TabsPanel>
          <TabsPanel value="finance">Finance panel</TabsPanel>
        </Tabs>
      );
    }
    const { container } = render(<Profile />);
    expect(screen.getByRole('tablist', { name: 'Farmer profile' })).toBeInTheDocument();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
    screen.getByRole('tab', { name: 'Overview' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Contracts' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('contracts');
    expect(screen.getByRole('tab', { name: 'Contracts' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Contracts panel');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('supports the segmented style', () => {
    render(
      <Tabs defaultValue="list">
        <TabsList variant="segmented" aria-label="View">
          <Tab value="list">List</Tab>
          <Tab value="insights">Insights</Tab>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'List' })).toHaveClass('rounded-md');
  });
});

describe('Avatar', () => {
  it('derives initials', () => {
    expect(initials('Chikondi Banda')).toBe('CB');
    expect(initials('  grace  ')).toBe('G');
    expect(initials('Ruth M. Kaunda')).toBe('RK');
  });

  it('is decorative by default and named when labelled', async () => {
    const { container } = render(
      <>
        <Avatar name="Chikondi Banda" />
        <Avatar name="Grace Mbewe" labelled />
      </>
    );
    expect(screen.queryByRole('img', { name: 'Chikondi Banda' })).toBeNull();
    expect(screen.getByRole('img', { name: 'Grace Mbewe' })).toHaveTextContent('GM');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Separator, Skeleton and states', () => {
  it('renders a separator', () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('hides skeletons from screen readers', () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveAttribute('aria-hidden');
  });

  it('explains an empty list and offers the next step', async () => {
    const { container } = render(
      <EmptyState
        title="No farmers match these filters"
        description="Try another hub or clear the filters."
        action={<Button variant="secondary">Clear filters</Button>}
      />
    );
    expect(screen.getByText('No farmers match these filters')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('announces a load error and retries', async () => {
    const onRetry = vi.fn();
    const { container, rerender } = render(<ErrorState onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't load this");
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);

    rerender(
      <ErrorState variant="banner" title="Totals are out of date" onRetry={onRetry} retrying />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Totals are out of date');
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
