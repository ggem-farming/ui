import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Checkbox,
  Combobox,
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
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

const HUBS = [
  { value: 'hub-1', label: 'Chikwawa' },
  { value: 'hub-2', label: 'Nsanje' },
  { value: 'hub-3', label: 'Balaka' },
];

describe('Field and Input', () => {
  it('labels and describes the input', async () => {
    const { container } = render(
      <Field>
        <FieldLabel>Phone</FieldLabel>
        <Input placeholder="+265" />
        <FieldDescription>Used for SMS updates</FieldDescription>
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Phone' });
    expect(input).toHaveAccessibleDescription('Used for SMS updates');
    await userEvent.type(input, '0991');
    expect(input).toHaveValue('0991');
    expect(await axeViolations(container)).toEqual([]);
  });

  it('shows a required error on submit and blocks submission', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => {
      e.preventDefault();
    });
    render(
      <Form onSubmit={onSubmit}>
        <Field name="name">
          <FieldLabel>Name</FieldLabel>
          <Input required />
          <FieldError match="valueMissing">Enter the farmer's name</FieldError>
        </Field>
        <Button type="submit">Save</Button>
      </Form>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(await screen.findByText("Enter the farmer's name")).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows server errors passed to Form by field name', () => {
    render(
      <Form errors={{ phone: 'This number is already registered' }}>
        <Field name="phone">
          <FieldLabel>Phone</FieldLabel>
          <Input defaultValue="+265 991 000 101" />
          <FieldError />
        </Field>
      </Form>
    );
    expect(screen.getByText('This number is already registered')).toBeVisible();
  });

  it('shows a specific message and a managed server error without repeating', async () => {
    const phoneField = (serverError: string | null) => (
      <Form>
        <Field name="phone" invalid={serverError !== null}>
          <FieldLabel>Phone</FieldLabel>
          <Input required defaultValue={serverError ? '+265 991 000 101' : ''} />
          <FieldError className="error" match="valueMissing">
            Enter a phone number
          </FieldError>
          <FieldError className="error" match={serverError !== null}>
            {serverError}
          </FieldError>
        </Field>
        <Button type="submit">Save</Button>
      </Form>
    );
    const { container, unmount } = render(phoneField(null));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await screen.findByText('Enter a phone number');
    expect(container.querySelectorAll('.error')).toHaveLength(1);
    unmount();

    const server = render(phoneField('Already registered'));
    expect(screen.getByText('Already registered')).toBeVisible();
    expect(server.container.querySelectorAll('.error')).toHaveLength(1);
    expect(screen.getByRole('textbox', { name: 'Phone' })).toHaveAccessibleDescription(
      'Already registered'
    );
  });

  it('hides an error whose match is false', () => {
    render(
      <Field invalid>
        <FieldLabel>Phone</FieldLabel>
        <Input />
        <FieldError match={false}>Hidden</FieldError>
      </Field>
    );
    expect(screen.queryByText('Hidden')).toBeNull();
  });

  it('renders a labelled textarea', async () => {
    const { container } = render(
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea />
      </Field>
    );
    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('IconButton', () => {
  it('uses the label as its accessible name', async () => {
    const { container } = render(
      <IconButton label="Close">
        <svg aria-hidden />
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Checkbox, Radio and Switch', () => {
  it('toggles a labelled checkbox and supports indeterminate', async () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Field>
        <FieldLabel className="flex gap-2">
          <Checkbox onCheckedChange={onChange} />
          Consent to SMS
        </FieldLabel>
      </Field>
    );
    const box = screen.getByRole('checkbox', { name: 'Consent to SMS' });
    await userEvent.click(box);
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    expect(box).toBeChecked();
    expect(await axeViolations(container)).toEqual([]);

    rerender(<Checkbox aria-label="Select all" indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'Select all' })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });

  it('selects radios with the keyboard inside a labelled group', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Field name="tenure">
        <Fieldset render={<RadioGroup defaultValue="owned" onValueChange={onChange} />}>
          <FieldsetLegend>Land tenure</FieldsetLegend>
          <FieldItem>
            <FieldLabel className="flex gap-2">
              <Radio value="owned" /> Owned
            </FieldLabel>
          </FieldItem>
          <FieldItem>
            <FieldLabel className="flex gap-2">
              <Radio value="rented" /> Rented
            </FieldLabel>
          </FieldItem>
        </Fieldset>
      </Field>
    );
    expect(screen.getByRole('radiogroup', { name: 'Land tenure' })).toBeInTheDocument();
    const owned = screen.getByRole('radio', { name: 'Owned' });
    owned.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Rented' })).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('rented', expect.anything());
    expect(await axeViolations(container)).toEqual([]);
  });

  it('switches on and off', async () => {
    const { container } = render(<Switch aria-label="Email digests" />);
    const toggle = screen.getByRole('switch', { name: 'Email digests' });
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Select', () => {
  it('shows the label of the selected ID and reports the ID on change', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select label="Hub" options={HUBS} defaultValue="hub-2" onValueChange={onChange} />
    );
    const trigger = screen.getByRole('combobox', { name: /Hub/ });
    expect(trigger).toHaveTextContent('Nsanje');
    expect(await axeViolations(container)).toEqual([]);

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole('option', { name: 'Balaka' }));
    expect(onChange).toHaveBeenCalledWith('hub-3', expect.anything());
    await waitFor(() => {
      expect(trigger).toHaveTextContent('Balaka');
    });
  });

  it('shows the placeholder when empty', () => {
    render(<Select aria-label="Hub" options={HUBS} placeholder="All hubs" />);
    expect(screen.getByRole('combobox', { name: 'Hub' })).toHaveTextContent('All hubs');
  });
});

describe('Combobox', () => {
  it('filters by typed text and reports the selected ID', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Field>
        <FieldLabel>Hub</FieldLabel>
        <Combobox options={HUBS} placeholder="Search hubs" onValueChange={onChange} />
      </Field>
    );
    const input = screen.getByRole('combobox', { name: 'Hub' });
    expect(await axeViolations(container)).toEqual([]);

    await userEvent.type(input, 'bal');
    const options = await screen.findAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['Balaka']);
    await userEvent.click(options[0] as HTMLElement);
    expect(onChange).toHaveBeenCalledWith('hub-3', expect.anything());
    expect(input).toHaveValue('Balaka');
  });

  it('says when nothing matches', async () => {
    render(<Combobox aria-label="Hub" options={HUBS} emptyText="No hub found" />);
    await userEvent.type(screen.getByRole('combobox', { name: 'Hub' }), 'zzz');
    expect(await screen.findByText('No hub found')).toBeVisible();
  });
});
