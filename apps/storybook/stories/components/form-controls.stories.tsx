import {
  Button,
  Checkbox,
  CheckboxGroup,
  Combobox,
  DateInput,
  DateRangeInput,
  FileInput,
  MultiCombobox,
  type DateRange,
  Field,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
  Form,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Textarea,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, X } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Form controls',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-bg p-6 text-fg">
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-6">
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
  { value: 'hub-4', label: 'Machinga' },
];

const VILLAGES = [
  'Bangula',
  'Chapananga',
  'Chikwawa Boma',
  'Dolo',
  'Kalambo',
  'Makhanga',
  'Masenjere',
  'Mbenje',
  'Ngabu',
  'Nyachilenda',
  'Phokera',
  'Tengani',
].map((name, i) => ({ value: `village-${String(i + 1)}`, label: name }));

export const TextInputs: Story = {
  render: () => (
    <div className="space-y-5">
      <Field>
        <FieldLabel>Full name</FieldLabel>
        <Input placeholder="e.g. Chikondi Banda" />
      </Field>
      <Field>
        <FieldLabel>Phone</FieldLabel>
        <Input type="tel" defaultValue="+265 991 000 101" />
        <FieldDescription>Used for SMS updates and payouts.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>National ID</FieldLabel>
        <Input defaultValue="MW-12" />
        <FieldError match>Enter the 8-character ID from the farmer's card.</FieldError>
      </Field>
      <Field disabled>
        <FieldLabel>Farmer code</FieldLabel>
        <Input defaultValue="GG-2026-0101" />
        <FieldDescription>Assigned automatically.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea placeholder="Anything the field officer should know" />
      </Field>
    </div>
  ),
};

export const Selection: Story = {
  render: () => (
    <div className="space-y-5">
      <Field>
        <Select label="Hub" options={HUBS} placeholder="Choose a hub" />
        <FieldDescription>A short fixed list: Select.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Village</FieldLabel>
        <Combobox options={VILLAGES} placeholder="Search villages" />
        <FieldDescription>A long list: Combobox, filtered as you type.</FieldDescription>
      </Field>
      <Select
        aria-label="Rows per page"
        className="w-24"
        options={[25, 50, 100].map((n) => ({ value: n, label: String(n) }))}
        defaultValue={25}
      />
    </div>
  ),
};

export const Toggles: Story = {
  render: () => (
    <div className="space-y-6">
      <Field name="consents">
        <Fieldset render={<CheckboxGroup defaultValue={['sms']} />}>
          <FieldsetLegend>Consent</FieldsetLegend>
          <FieldItem>
            <Checkbox value="sms" />
            <div>
              <FieldLabel>SMS updates</FieldLabel>
              <FieldDescription>Prices, market days and payouts.</FieldDescription>
            </div>
          </FieldItem>
          <FieldItem>
            <Checkbox value="calls" />
            <div>
              <FieldLabel>Call-centre follow-up</FieldLabel>
              <FieldDescription>Agents may call about surveys.</FieldDescription>
            </div>
          </FieldItem>
          <FieldItem>
            <Checkbox value="photo" disabled />
            <FieldLabel>Photo on profile (needs signed form)</FieldLabel>
          </FieldItem>
        </Fieldset>
      </Field>

      <Field name="tenure">
        <Fieldset render={<RadioGroup defaultValue="owned" />}>
          <FieldsetLegend>Land tenure</FieldsetLegend>
          {['Owned', 'Rented', 'Family land'].map((label) => (
            <FieldItem key={label}>
              <Radio value={label.toLowerCase()} />
              <FieldLabel>{label}</FieldLabel>
            </FieldItem>
          ))}
        </Fieldset>
      </Field>

      <div className="flex items-center gap-2">
        <Checkbox aria-label="Select all farmers" indeterminate />
        <span className="text-sm text-fg-muted">Indeterminate (some rows selected)</span>
      </div>

      <Field>
        <FieldLabel className="flex items-center justify-between gap-4">
          <span>
            <span className="block">Weekly digest email</span>
            <span className="block font-normal text-fg-muted">Applies immediately.</span>
          </span>
          <Switch defaultChecked />
        </FieldLabel>
      </Field>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton label="Previous page" variant="secondary">
        <ChevronLeft />
      </IconButton>
      <IconButton label="Next page" variant="secondary">
        <ChevronRight />
      </IconButton>
      <IconButton label="Search">
        <Search />
      </IconButton>
      <IconButton label="More actions">
        <MoreHorizontal />
      </IconButton>
      <IconButton label="Close" size="sm">
        <X />
      </IconButton>
    </div>
  ),
};

function RegisterFarmerForm() {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  return (
    <Form
      onFormSubmit={(values) => {
        setSaved(false);
        // Simulates a server-side check, e.g. a duplicate phone number.
        if (values.phone === '+265 991 000 101') {
          setPhoneError('This number is already registered to Chikondi Banda.');
          return;
        }
        setSaved(true);
      }}
    >
      <div>
        <h2 className="text-lg font-semibold">Register farmer</h2>
        <p className="text-sm text-fg-muted">
          Required fields are checked on save. Try phone +265 991 000 101 for a server error.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="firstName">
          <FieldLabel>First name</FieldLabel>
          <Input required />
          <FieldError match="valueMissing">Enter a first name.</FieldError>
        </Field>
        <Field name="lastName">
          <FieldLabel>Last name</FieldLabel>
          <Input required />
          <FieldError match="valueMissing">Enter a last name.</FieldError>
        </Field>
      </div>
      <Field name="phone" invalid={phoneError !== null}>
        <FieldLabel>Phone</FieldLabel>
        <Input
          type="tel"
          required
          placeholder="+265"
          onChange={() => {
            setPhoneError(null);
          }}
        />
        <FieldError match="valueMissing">Enter a phone number.</FieldError>
        <FieldError match={phoneError !== null}>{phoneError}</FieldError>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="hub">
          <Select label="Hub" options={HUBS} placeholder="Choose a hub" required />
          <FieldError match="valueMissing">Choose a hub.</FieldError>
        </Field>
        <Field name="village">
          <FieldLabel>Village</FieldLabel>
          <Combobox options={VILLAGES} placeholder="Search villages" />
        </Field>
      </div>
      <Field name="consent">
        <FieldItem>
          <Checkbox required />
          <div>
            <FieldLabel>The farmer agreed to the data notice</FieldLabel>
            <FieldError match="valueMissing">Consent is required to register.</FieldError>
          </div>
        </FieldItem>
      </Field>
      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        {saved && (
          <p role="status" className="mr-auto text-sm font-medium text-on-success-soft">
            Saved (demo only)
          </p>
        )}
        <Button variant="secondary" type="reset">
          Cancel
        </Button>
        <Button type="submit">Register farmer</Button>
      </div>
    </Form>
  );
}

export const RegisterFarmer: Story = {
  name: 'Example: register farmer',
  render: () => <RegisterFarmerForm />,
};

const CROPS = [
  { value: 'maize', label: 'Maize' },
  { value: 'soy', label: 'Soya beans' },
  { value: 'gnut', label: 'Groundnuts' },
  { value: 'chilli', label: 'Chillies' },
  { value: 'sunflower', label: 'Sunflower' },
];

export const DatesFilesAndMultiSelect: Story = {
  render: function Render() {
    const [range, setRange] = useState<DateRange>({ from: '2026-03-01', to: null });
    return (
      <Form className="space-y-5">
        <Field>
          <FieldLabel>Delivery date</FieldLabel>
          <DateInput defaultValue="2026-03-14" />
        </Field>
        <Field>
          <FieldLabel>Booking dates</FieldLabel>
          <DateRangeInput aria-label="Booking dates" value={range} onValueChange={setRange} />
        </Field>
        <Field>
          <FieldLabel>Crops grown</FieldLabel>
          <MultiCombobox
            options={CROPS}
            defaultValue={['maize', 'soy']}
            placeholder="Search crops"
          />
        </Field>
        <FileInput
          label="Payout file"
          accept=".csv,.xlsx"
          maxSize={5 * 1024 * 1024}
          hint="CSV or Excel, up to 5 MB"
        />
      </Form>
    );
  },
};
