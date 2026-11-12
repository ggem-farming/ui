import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Alert,
  BreadcrumbItem,
  Breadcrumbs,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  DateInput,
  DateRangeInput,
  Field,
  FieldLabel,
  FileInput,
  formatFileSize,
  MultiCombobox,
  ProgressBar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type DateRange,
} from '../src/index.ts';
import { axeViolations } from './axe.ts';

describe('Alert', () => {
  it('shows a static note without announcing it, and a danger alert as an alert', async () => {
    const onDismiss = vi.fn();
    const { container } = render(
      <>
        <Alert tone="warning" title="Season closes Friday" onDismiss={onDismiss}>
          Submit outstanding payouts before then.
        </Alert>
        <Alert tone="danger" title="Payout failed" />
      </>
    );
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent('Payout failed');
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('ProgressBar and Spinner', () => {
  it('exposes the progress value and an accessible name', async () => {
    const { container } = render(
      <>
        <ProgressBar label="Import progress" value={40} showValue />
        <ProgressBar label="Preparing export" value={null} hideLabel />
        <Spinner label="Saving farmer" />
      </>
    );
    const bars = screen.getAllByRole('progressbar');
    expect(bars[0]).toHaveAttribute('aria-valuenow', '40');
    expect(bars[0]).toHaveAccessibleName('Import progress');
    expect(bars[1]).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByRole('status')).toHaveTextContent('Saving farmer');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('DateInput and DateRangeInput', () => {
  it('reports ISO dates and null when cleared', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Field>
        <FieldLabel>Delivery date</FieldLabel>
        <DateInput defaultValue="2026-03-01" onValueChange={onChange} />
      </Field>
    );
    const input = screen.getByLabelText('Delivery date');
    fireEvent.change(input, { target: { value: '2026-03-14' } });
    expect(onChange).toHaveBeenLastCalledWith('2026-03-14');
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('keeps the end on or after the start', async () => {
    function Range() {
      const [range, setRange] = useState<DateRange>({ from: null, to: '2026-03-10' });
      return (
        <>
          <DateRangeInput aria-label="Booking dates" value={range} onValueChange={setRange} />
          <output>{JSON.stringify(range)}</output>
        </>
      );
    }
    const { container } = render(<Range />);
    expect(screen.getByRole('group', { name: 'Booking dates' })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2026-03-20' } });
    expect(screen.getByRole('status')).toHaveTextContent('{"from":"2026-03-20","to":null}');
    expect(screen.getByLabelText('To')).toHaveAttribute('min', '2026-03-20');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('MultiCombobox', () => {
  const crops = [
    { value: 'maize', label: 'Maize' },
    { value: 'soy', label: 'Soya beans' },
    { value: 'gnut', label: 'Groundnuts' },
  ];

  it('adds and removes chips and reports the selected IDs', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <Field>
        <FieldLabel>Crops</FieldLabel>
        <MultiCombobox options={crops} defaultValue={['maize']} onValueChange={onChange} />
      </Field>
    );
    expect(screen.getByRole('button', { name: 'Remove Maize' })).toBeInTheDocument();
    await userEvent.type(screen.getByRole('combobox', { name: 'Crops' }), 'soy');
    await userEvent.click(await screen.findByRole('option', { name: 'Soya beans' }));
    expect(onChange).toHaveBeenLastCalledWith(['maize', 'soy'], expect.anything());
    await userEvent.click(screen.getByRole('button', { name: 'Remove Maize' }));
    expect(onChange).toHaveBeenLastCalledWith(['soy'], expect.anything());
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Table', () => {
  it('renders an accessible static table with right-aligned amounts', async () => {
    const { container } = render(
      <Table aria-label="Deliveries by hub">
        <TableHeader>
          <TableRow>
            <TableHead>Hub</TableHead>
            <TableHead align="right">Kilograms</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row">Balaka</TableHead>
            <TableCell align="right">1,200</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead scope="row">Total</TableHead>
            <TableCell align="right">1,200</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
    expect(screen.getByRole('table', { name: 'Deliveries by hub' })).toBeInTheDocument();
    expect(screen.getAllByRole('rowheader')).toHaveLength(2);
    expect(screen.getAllByRole('cell')[0]).toHaveClass('text-right');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Accordion and Collapsible', () => {
  it('expands sections with their trigger buttons', async () => {
    const { container } = render(
      <>
        <Accordion>
          <AccordionItem value="a">
            <AccordionTrigger meta="3">Rejected deliveries</AccordionTrigger>
            <AccordionPanel>Moisture above 13%.</AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Collapsible>
          <CollapsibleTrigger>More filters</CollapsibleTrigger>
          <CollapsiblePanel>Hub, season</CollapsiblePanel>
        </Collapsible>
      </>
    );
    const trigger = screen.getByRole('button', { name: /Rejected deliveries/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Moisture above 13%.')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'More filters' }));
    expect(screen.getByText('Hub, season')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('Breadcrumbs', () => {
  it('lists links and marks the current page', async () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem href="/farmers">Farmers</BreadcrumbItem>
        <BreadcrumbItem render={<a href="/farmers/list">GGEM farmers</a>}>
          GGEM farmers
        </BreadcrumbItem>
        <BreadcrumbItem current>Jane Banda</BreadcrumbItem>
      </Breadcrumbs>
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav.querySelectorAll('li')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'GGEM farmers' })).toHaveAttribute(
      'href',
      '/farmers/list'
    );
    expect(screen.getByText('Jane Banda')).toHaveAttribute('aria-current', 'page');
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe('FileInput', () => {
  it('accepts matching files, rejects others and removes chosen files', async () => {
    const onFiles = vi.fn();
    const { container } = render(
      <FileInput
        label="Payout file"
        accept=".csv"
        maxSize={1024}
        hint="CSV, up to 1 KB"
        onFilesChange={onFiles}
      />
    );
    const input = screen.getByLabelText('Payout file');
    expect(input).toHaveAccessibleDescription('CSV, up to 1 KB');

    await userEvent.upload(input, new File(['a,b'], 'payouts.csv', { type: 'text/csv' }));
    expect(onFiles).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'payouts.csv' })]);
    expect(screen.getByRole('list', { name: 'Chosen files' })).toHaveTextContent('payouts.csv');

    const big = new File(['x'.repeat(2048)], 'big.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [big] } });
    expect(screen.getByRole('alert')).toHaveTextContent('big.csv is larger than 1 KB.');

    await userEvent.click(screen.getByRole('button', { name: 'Remove payouts.csv' }));
    expect(onFiles).toHaveBeenLastCalledWith([]);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('formats sizes', () => {
    expect([formatFileSize(512), formatFileSize(2048), formatFileSize(5_500_000)]).toEqual([
      '512 B',
      '2 KB',
      '5.2 MB',
    ]);
  });
});
