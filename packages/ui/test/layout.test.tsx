import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  AppShell,
  Badge,
  Button,
  DetailList,
  Page,
  PageBar,
  PageHeader,
  RecordHeader,
  RecordLayout,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarLink,
  SidebarNav,
  SidebarSection,
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

function Nav({ active = 'Farmers' }: { active?: string }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <span>GGEM Farming</span>
      </SidebarHeader>
      <SidebarNav>
        <SidebarSection>
          <SidebarLink href="/" active={active === 'Home'}>
            Home
          </SidebarLink>
        </SidebarSection>
        <SidebarSection label="Farmers">
          <SidebarLink href="/farmers" active={active === 'Farmers'} count={14}>
            Farmers
          </SidebarLink>
          <SidebarLink href="/contracts">Contracts</SidebarLink>
        </SidebarSection>
      </SidebarNav>
      <SidebarFooter>
        <SidebarLink href="/settings">Settings</SidebarLink>
      </SidebarFooter>
    </Sidebar>
  );
}

describe('AppShell and PageBar', () => {
  it('puts the page title and actions in the top bar with proper landmarks', async () => {
    const { container } = render(
      <AppShell sidebar={<Nav />}>
        <PageBar title="Farmers" actions={<Button size="sm">Register farmer</Button>} />
        <Page width="full">Table</Page>
      </AppShell>
    );
    const banner = screen.getByRole('banner');
    expect(within(banner).getByRole('heading', { level: 1, name: 'Farmers' })).toBeInTheDocument();
    expect(within(banner).getByRole('button', { name: 'Register farmer' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('Table');
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('link', { name: /Farmers/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Contracts' })).not.toHaveAttribute('aria-current');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('renders a PageBar in place outside an AppShell', () => {
    render(<PageBar title="Settings" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Settings' })).toBeInTheDocument();
  });

  it('opens the navigation drawer and closes it when a link is followed', async () => {
    render(
      <AppShell sidebar={<Nav />}>
        <PageBar title="Farmers" />
      </AppShell>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const drawer = await screen.findByRole('dialog', { name: 'Navigation' });
    expect(await axeViolations(document.body)).toEqual([]);
    const link = within(drawer).getByRole('link', { name: 'Contracts' });
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
    await userEvent.click(link);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });

  it('renders sidebar links through a router link component', async () => {
    const navigate = vi.fn();
    const RouterLink = forwardRef<
      HTMLAnchorElement,
      AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
    >(function RouterLink({ to, onClick, children, ...props }, ref) {
      return (
        <a
          ref={ref}
          href={to}
          onClick={(e) => {
            e.preventDefault();
            onClick?.(e);
            navigate(to);
          }}
          {...props}
        >
          {children}
        </a>
      );
    });
    render(<SidebarLink render={<RouterLink to="/surveys" />}>Surveys</SidebarLink>);
    const link = screen.getByRole('link', { name: 'Surveys' });
    expect(link).toHaveAttribute('href', '/surveys');
    expect(link.className).toContain('rounded-md');
    await userEvent.click(link);
    expect(navigate).toHaveBeenCalledWith('/surveys');
  });
});

describe('Page and RecordLayout', () => {
  it('uses h2 headings under the bar title', () => {
    render(<PageHeader eyebrow="Thursday, 12 November" title="Good morning, Thoko" />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Good morning, Thoko' })
    ).toBeInTheDocument();
  });

  it('lays out a record with a labelled summary rail and readable empty values', async () => {
    const { container } = render(
      <RecordLayout
        header={
          <RecordHeader
            title="Chikondi Banda"
            status={<Badge tone="success">Contracted</Badge>}
            meta="GGEM farmer · Chikwawa hub"
            actions={<Button variant="secondary">Edit</Button>}
          />
        }
        aside={
          <DetailList
            items={[
              { label: 'Phone', value: '+265 991 000 101' },
              { label: 'National ID', value: null },
            ]}
          />
        }
      >
        <p>Tabs</p>
      </RecordLayout>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Chikondi Banda' })).toBeInTheDocument();
    const aside = screen.getByRole('complementary', { name: 'Summary' });
    expect(
      within(aside)
        .getAllByRole('definition')
        .map((d) => d.textContent)
    ).toEqual(['+265 991 000 101', '—Not recorded']);
    expect(await axeViolations(container)).toEqual([]);
  });
});
