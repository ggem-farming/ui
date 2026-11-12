import { colors, fontSize, radius, shadow } from '@ggem/tokens';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SURFACES = [
  ['bg', 'Page background'],
  ['surface', 'Cards, tables, panels'],
  ['surface-muted', 'Table headers, hovered rows'],
  ['surface-raised', 'Menus, popovers, dialogs'],
  ['border', 'Dividers and card outlines'],
  ['input', 'Form control outlines (3:1)'],
  ['fg', 'Body text'],
  ['fg-muted', 'Secondary text (4.5:1)'],
] as const;

const INTENTS = ['primary', 'brand', 'success', 'warning', 'danger', 'info', 'neutral'] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export const Tokens: Story = {
  render: () => (
    <div className="min-h-screen space-y-10 bg-bg p-8 text-fg">
      <header className="space-y-1">
        <p className="text-sm font-medium text-on-brand-soft">GGEM UI</p>
        <h1 className="text-4xl font-semibold tracking-tight">Design tokens</h1>
        <p className="max-w-prose text-fg-muted">
          Semantic colours switch with the Theme toolbar. Every text pair here is tested for WCAG AA
          contrast in both schemes.
        </p>
      </header>

      <Section title="Surfaces and text">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {SURFACES.map(([name, use]) => (
            <div key={name} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="h-14" style={{ background: `var(--color-${name})` }} />
              <div className="p-3">
                <code className="font-mono text-sm">{name}</code>
                <p className="text-sm text-fg-muted">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Intents">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {INTENTS.map((name) => (
            <div key={name} className="space-y-2 rounded-lg border border-border bg-surface p-3">
              <code className="font-mono text-sm">{name}</code>
              <div
                className="rounded-md px-3 py-2 font-semibold"
                style={{ background: `var(--color-${name})`, color: `var(--color-on-${name})` }}
              >
                Solid
              </div>
              <div
                className="rounded-md px-3 py-2 font-semibold"
                style={{
                  background: `var(--color-${name}-soft)`,
                  color: `var(--color-on-${name}-soft)`,
                }}
              >
                Soft
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data series">
        <div className="flex flex-wrap gap-3">
          {colors.light.chart.map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface p-2 pr-3"
            >
              <span
                className="size-6 rounded-md"
                style={{ background: `var(--color-chart-${i + 1})` }}
              />
              <code className="font-mono text-sm">chart-{i + 1}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Type">
        <div className="space-y-2 rounded-lg border border-border bg-surface p-4">
          {Object.entries(fontSize)
            .reverse()
            .map(([name, [px, lh]]) => (
              <div key={name} className="flex items-baseline gap-4">
                <code className="w-24 shrink-0 font-mono text-xs text-fg-muted">
                  text-{name} {px}/{lh}
                </code>
                <span
                  className={px >= 20 ? 'font-semibold tracking-tight' : ''}
                  style={{ fontSize: `${px / 16}rem`, lineHeight: `${lh / 16}rem` }}
                >
                  {px >= 20 ? 'Farmers contracted this season' : 'Chikwawa hub · 1,204 farmers'}
                </span>
              </div>
            ))}
          <p className="pt-2 font-mono text-sm text-fg-muted">
            JetBrains Mono · MWK 1,250,000.00 · 2026-11-12
          </p>
        </div>
      </Section>

      <Section title="Radius and elevation">
        <div className="flex flex-wrap gap-4">
          {Object.entries(radius).map(([name, px]) => (
            <div
              key={name}
              className="grid size-20 place-items-center border border-border bg-surface font-mono text-xs"
              style={{ borderRadius: px === 9999 ? '9999px' : `${px}px` }}
            >
              {name}
            </div>
          ))}
          {Object.keys(shadow).map((name) => (
            <div
              key={name}
              className="grid size-20 place-items-center rounded-lg bg-surface font-mono text-xs"
              style={{ boxShadow: `var(--shadow-${name})` }}
            >
              shadow-{name}
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};
