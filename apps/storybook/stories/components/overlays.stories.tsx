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
  Field,
  FieldLabel,
  IconButton,
  Input,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
  Select,
  Switch,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Copy,
  MoreHorizontal,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Overlays',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-bg p-6 text-fg">
        <div className="mx-auto flex max-w-xl flex-wrap items-start gap-3 rounded-xl border border-border bg-surface p-6">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const HUBS = [
  { value: 'hub-1', label: 'Chikwawa' },
  { value: 'hub-2', label: 'Nsanje' },
  { value: 'hub-3', label: 'Balaka' },
];

export const EditDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Edit farmer</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Chikondi Banda</DialogTitle>
          <DialogDescription>Changes are saved to the farmer's profile.</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input defaultValue="+265 991 000 101" />
          </Field>
          <Field>
            <Select label="Hub" options={HUBS} defaultValue="hub-1" />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Cancel</Button>} />
          <DialogClose render={<Button>Save changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const SidePanel: Story = {
  name: 'Side panel',
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary">Open farmer</Button>} />
      <DialogContent placement="right">
        <DialogHeader>
          <DialogTitle>Chikondi Banda</DialogTitle>
          <DialogDescription>Contracted · Chikwawa hub</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <dl className="divide-y divide-border text-sm">
            {[
              ['Phone', '+265 991 000 101'],
              ['Field officer', 'Grace Mbewe'],
              ['Village', 'Ngabu'],
              ['Acres', '2.5'],
              ['Balance', 'Owes MWK 30,000'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2.5">
                <dt className="text-fg-muted">{k}</dt>
                <dd className="font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary">
            <Phone /> Call
          </Button>
          <Button>Open profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirm: Story = {
  name: 'Confirm dialog',
  render: () => (
    <>
      <ConfirmDialog
        trigger={<Button variant="danger">Delete contract</Button>}
        title="Delete contract GG-2026-0101?"
        description="The contract and its signatures are removed for Chikondi Banda. This can't be undone."
        confirmLabel="Delete contract"
        onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1200))}
      />
      <ConfirmDialog
        trigger={<Button variant="secondary">Delete (fails)</Button>}
        title="Delete contract GG-2026-0102?"
        description="Shows how a failed action keeps the dialog open with the reason."
        confirmLabel="Delete contract"
        onConfirm={() =>
          new Promise((_, reject) =>
            setTimeout(() => {
              reject(new Error('This contract has payments and cannot be deleted.'));
            }, 800)
          )
        }
      />
      <ConfirmDialog
        trigger={<Button variant="secondary">Mark as paid</Button>}
        tone="primary"
        title="Mark payout as paid?"
        description="MWK 103,500 to Mphatso Tembo by Airtel Money."
        confirmLabel="Mark as paid"
        onConfirm={() => {}}
      />
    </>
  ),
};

function RowActions() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [columns, setColumns] = useState({ phone: true, officer: true });
  const [sort, setSort] = useState('name');
  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <IconButton label="Actions for Chikondi Banda" variant="secondary">
              <MoreHorizontal />
            </IconButton>
          }
        />
        <MenuContent align="end">
          <MenuItem>
            <Pencil /> Edit
          </MenuItem>
          <MenuItem>
            <Copy /> Copy phone number
          </MenuItem>
          <MenuSeparator />
          <MenuItem
            tone="danger"
            onClick={() => {
              setConfirmOpen(true);
            }}
          >
            <Trash2 /> Delete farmer
          </MenuItem>
        </MenuContent>
      </Menu>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Chikondi Banda?"
        description="Their contracts, surveys and payments stay in history."
        confirmLabel="Delete farmer"
        onConfirm={() => {}}
      />

      <Menu>
        <MenuTrigger
          render={
            <Button variant="secondary">
              <Columns3 /> Columns
            </Button>
          }
        />
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Visible columns</MenuGroupLabel>
            <MenuCheckboxItem
              checked={columns.phone}
              onCheckedChange={(phone) => {
                setColumns((c) => ({ ...c, phone }));
              }}
            >
              Phone
            </MenuCheckboxItem>
            <MenuCheckboxItem
              checked={columns.officer}
              onCheckedChange={(officer) => {
                setColumns((c) => ({ ...c, officer }));
              }}
            >
              Field officer
            </MenuCheckboxItem>
          </MenuGroup>
        </MenuContent>
      </Menu>

      <Menu>
        <MenuTrigger
          render={
            <Button variant="secondary">
              <ArrowUpDown /> Sort
            </Button>
          }
        />
        <MenuContent>
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioItem value="name">Name</MenuRadioItem>
            <MenuRadioItem value="registered">Newest registered</MenuRadioItem>
            <MenuRadioItem value="balance">Largest balance owed</MenuRadioItem>
          </MenuRadioGroup>
        </MenuContent>
      </Menu>
    </>
  );
}

export const Menus: Story = {
  render: () => <RowActions />,
};

export const PopoverStory: Story = {
  name: 'Popover',
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="secondary">
            Notifications <ChevronDown />
          </Button>
        }
      />
      <PopoverContent className="space-y-3">
        <div>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>Choose what you hear about.</PopoverDescription>
        </div>
        {['New registrations', 'Failed payouts', 'Survey responses'].map((label, i) => (
          <Field key={label}>
            <FieldLabel className="flex items-center justify-between font-normal">
              {label}
              <Switch defaultChecked={i < 2} />
            </FieldLabel>
          </Field>
        ))}
      </PopoverContent>
    </Popover>
  ),
};
