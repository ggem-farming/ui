import {
  Button,
  CommandPalette,
  Kbd,
  useCommandShortcut,
  type CommandGroup,
  type CommandItem,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banknote, House, Search, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

const meta = {
  title: 'Components/Command palette',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-bg p-6 text-fg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PAGES: CommandItem[] = [
  { value: '/', label: 'Home', icon: <House />, shortcut: 'G H' },
  { value: '/farmers', label: 'GGEM farmers', icon: <Users />, shortcut: 'G F' },
  { value: '/operations/finance', label: 'Finance', icon: <Banknote /> },
];
const FARMERS: CommandItem[] = [
  { value: 'f1', label: 'Chikondi Phiri', description: '+265 991 000 001 · Balaka' },
  { value: 'f2', label: 'Tamanda Banda', description: '+265 991 000 002 · Chikwawa' },
  { value: 'f3', label: 'Mphatso Mwale', description: '+265 991 000 003 · Machinga' },
];

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    const [query, setQuery] = useState('');
    const [last, setLast] = useState<string>();
    const toggle = useCallback(() => {
      setOpen((value) => !value);
    }, []);
    useCommandShortcut(toggle);
    // Simulates a server search: farmer results depend on the query.
    const groups = useMemo<CommandGroup[]>(() => {
      const q = query.trim().toLowerCase();
      return [
        { label: 'Pages', items: PAGES.filter((p) => p.label.toLowerCase().includes(q)) },
        {
          label: 'Farmers',
          items: q ? FARMERS.filter((f) => f.label.toLowerCase().includes(q)) : [],
        },
      ];
    }, [query]);
    return (
      <div className="space-y-3">
        <Button
          variant="secondary"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Search aria-hidden /> Search
          <span className="ml-2 flex gap-0.5" aria-hidden>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </Button>
        {last && <p className="text-sm text-fg-muted">Chose: {last}</p>}
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          groups={groups}
          query={query}
          onQueryChange={setQuery}
          serverFiltered
          placeholder="Search pages and farmers…"
          emptyText="No pages or farmers match."
          onSelect={(item) => {
            setLast(item.label);
          }}
        />
      </div>
    );
  },
};
