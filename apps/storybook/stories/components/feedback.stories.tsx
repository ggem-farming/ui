import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  Alert,
  Badge,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  ProgressBar,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@ggem/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const meta = {
  title: 'Components/Feedback and structure',
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-bg p-6 text-fg">
        <div className="mx-auto max-w-3xl space-y-6">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: function Render() {
    const [shown, setShown] = useState(true);
    return (
      <div className="space-y-3">
        <Alert tone="info" title="Prices update on Monday">
          New season prices apply to deliveries from 3 March.
        </Alert>
        <Alert tone="success" title="Import finished">
          212 deliveries were added.
        </Alert>
        {shown && (
          <Alert
            tone="warning"
            title="14 payouts need review"
            action={
              <Button size="sm" variant="secondary">
                Review
              </Button>
            }
            onDismiss={() => {
              setShown(false);
            }}
          >
            They are held until a manager approves them.
          </Alert>
        )}
        <Alert tone="danger" title="The bank file was rejected">
          Row 18 has an account number with letters in it.
        </Alert>
        <Alert tone="neutral">Read-only: this season is closed.</Alert>
      </div>
    );
  },
};

export const Progress: Story = {
  render: () => (
    <Card>
      <CardContent className="space-y-5 pt-5">
        <ProgressBar label="Import progress" value={40} showValue />
        <ProgressBar label="Contracts signed vs target" value={82} showValue tone="success" />
        <ProgressBar label="Budget used" value={96} showValue tone="danger" />
        <ProgressBar label="Preparing export" value={null} />
        <div className="flex items-center gap-4">
          <Spinner size="sm" label="Saving" />
          <Spinner label="Loading" />
          <Spinner size="lg" label="Loading map" />
        </div>
      </CardContent>
    </Card>
  ),
};

const HUBS = [
  { hub: 'Balaka', farmers: 412, kg: '18,420' },
  { hub: 'Chikwawa', farmers: 388, kg: '15,075' },
  { hub: 'Machinga', farmers: 291, kg: '9,860' },
];

export const StaticTable: Story = {
  render: () => (
    <Card>
      <Table aria-label="Deliveries by hub">
        <TableHeader>
          <TableRow>
            <TableHead>Hub</TableHead>
            <TableHead align="right">Farmers</TableHead>
            <TableHead align="right">Kilograms</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {HUBS.map((row) => (
            <TableRow key={row.hub}>
              <TableHead scope="row" className="font-medium text-fg">
                {row.hub}
              </TableHead>
              <TableCell align="right">{row.farmers}</TableCell>
              <TableCell align="right">{row.kg}</TableCell>
              <TableCell>
                <Badge tone="success">Open</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead scope="row" className="text-fg">
              Total
            </TableHead>
            <TableCell align="right">1,091</TableCell>
            <TableCell align="right">43,355</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  ),
};

export const AccordionAndCollapsible: Story = {
  render: () => (
    <Card>
      <CardContent className="space-y-6 pt-5">
        <Accordion defaultValue={['moisture']}>
          <AccordionItem value="moisture">
            <AccordionTrigger meta="3">Rejected for moisture</AccordionTrigger>
            <AccordionPanel>
              Moisture above 13% at weighing. Farmers were asked to re-dry.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="grade">
            <AccordionTrigger meta="1">Rejected for grade</AccordionTrigger>
            <AccordionPanel>Foreign matter above 2%.</AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Collapsible>
          <CollapsibleTrigger>More filters</CollapsibleTrigger>
          <CollapsiblePanel className="text-sm text-fg-muted">
            Season, hub and field officer.
          </CollapsiblePanel>
        </Collapsible>
      </CardContent>
    </Card>
  ),
};

export const BreadcrumbTrail: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#">Farmers</BreadcrumbItem>
      <BreadcrumbItem href="#">GGEM farmers</BreadcrumbItem>
      <BreadcrumbItem current>Chikondi Phiri</BreadcrumbItem>
    </Breadcrumbs>
  ),
};
