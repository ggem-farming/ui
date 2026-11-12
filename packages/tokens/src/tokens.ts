/**
 * GGEM design tokens: the single source for the web kit (Tailwind theme CSS) and native apps.
 * Pixel values are plain numbers so React Native can use them directly; the CSS build converts
 * sizes to rem. Colour names are semantic; use the scales only when no semantic token fits.
 *
 * Direction: neutral, ink-on-white UI where colour carries meaning (brand, status, data).
 */

export const palette = {
  neutral: {
    0: '#ffffff',
    25: '#fafafa',
    50: '#f4f4f5',
    100: '#e9e9ec',
    200: '#dcdce0',
    300: '#c4c4ca',
    400: '#8b8b94',
    500: '#6b6b74',
    600: '#52525a',
    700: '#3f3f46',
    800: '#27272a',
    850: '#1f1f22',
    900: '#18181b',
    950: '#0f0f11',
  },
  green: {
    50: '#ecfdf3',
    100: '#d1fadf',
    200: '#a6f0c4',
    300: '#6ee0a0',
    400: '#34c77b',
    500: '#16a35f',
    600: '#0f8a4f',
    700: '#0d6e41',
    800: '#0f5736',
    900: '#0e2a1c',
    950: '#052817',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    300: '#fcd34d',
    400: '#f5b83d',
    500: '#c27d0e',
    700: '#9a5b06',
    800: '#7a4508',
    900: '#2e2208',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    300: '#fca5a5',
    600: '#c8241c',
    700: '#a51d17',
    900: '#2f1413',
    950: '#2a0a07',
  },
  blue: {
    50: '#eff5ff',
    100: '#dbe8fe',
    300: '#93b8fb',
    500: '#3b7cf0',
    600: '#2563d8',
    700: '#1e4fae',
    900: '#141f36',
  },
  violet: {
    300: '#c4b5fd',
    500: '#8b6cf0',
  },
} as const;

const p = palette;

/** A semantic intent: a solid fill with its text colour, and a soft tint with its text colour. */
export interface Intent {
  solid: string;
  solidHover: string;
  onSolid: string;
  soft: string;
  onSoft: string;
}

export interface ColorScheme {
  /** App canvas behind the sidebar and the content panel. */
  bg: string;
  /** Content panel, cards, tables. */
  surface: string;
  /** Subtle fills: table headers, hovered rows, segmented controls. */
  surfaceMuted: string;
  /** Raised overlays: menus, popovers, dialogs. */
  surfaceRaised: string;
  fg: string;
  fgMuted: string;
  /** Decorative dividers and card outlines. */
  border: string;
  /** Form control outlines: at least 3:1 against surface. */
  borderInput: string;
  focus: string;
  overlay: string;
  /** Default actions: ink buttons. */
  primary: Intent;
  /** GGEM green: brand marks, selection, highlights. */
  brand: Intent;
  success: Intent;
  warning: Intent;
  danger: Intent;
  info: Intent;
  neutral: Intent;
  /** Categorical data series, in order of use. */
  chart: readonly [string, string, string, string, string];
}

export const colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    bg: p.neutral[50],
    surface: p.neutral[0],
    surfaceMuted: p.neutral[25],
    surfaceRaised: p.neutral[0],
    fg: p.neutral[900],
    fgMuted: p.neutral[500],
    border: p.neutral[100],
    borderInput: p.neutral[400],
    focus: p.green[600],
    overlay: 'rgb(15 15 17 / 0.4)',
    primary: {
      solid: p.neutral[900],
      solidHover: p.neutral[700],
      onSolid: p.neutral[0],
      soft: p.neutral[50],
      onSoft: p.neutral[800],
    },
    brand: {
      solid: p.green[700],
      solidHover: p.green[800],
      onSolid: p.neutral[0],
      soft: p.green[50],
      onSoft: p.green[700],
    },
    success: {
      solid: p.green[700],
      solidHover: p.green[800],
      onSolid: p.neutral[0],
      soft: p.green[50],
      onSoft: p.green[700],
    },
    warning: {
      solid: p.amber[700],
      solidHover: p.amber[800],
      onSolid: p.neutral[0],
      soft: p.amber[50],
      onSoft: p.amber[700],
    },
    danger: {
      solid: p.red[600],
      solidHover: p.red[700],
      onSolid: p.neutral[0],
      soft: p.red[50],
      onSoft: p.red[700],
    },
    info: {
      solid: p.blue[600],
      solidHover: p.blue[700],
      onSolid: p.neutral[0],
      soft: p.blue[50],
      onSoft: p.blue[700],
    },
    neutral: {
      solid: p.neutral[600],
      solidHover: p.neutral[700],
      onSolid: p.neutral[0],
      soft: p.neutral[50],
      onSoft: p.neutral[600],
    },
    chart: [p.green[500], p.blue[500], p.amber[500], p.violet[500], p.neutral[300]],
  },
  dark: {
    bg: p.neutral[950],
    surface: p.neutral[900],
    surfaceMuted: p.neutral[850],
    surfaceRaised: '#232327',
    fg: p.neutral[25],
    fgMuted: '#a1a1aa',
    border: '#2a2a2e',
    borderInput: '#6b6b74',
    focus: p.green[400],
    overlay: 'rgb(0 0 0 / 0.6)',
    primary: {
      solid: p.neutral[25],
      solidHover: p.neutral[200],
      onSolid: p.neutral[900],
      soft: p.neutral[800],
      onSoft: p.neutral[100],
    },
    brand: {
      solid: p.green[400],
      solidHover: p.green[300],
      onSolid: p.green[950],
      soft: p.green[900],
      onSoft: p.green[300],
    },
    success: {
      solid: p.green[400],
      solidHover: p.green[300],
      onSolid: p.green[950],
      soft: p.green[900],
      onSoft: p.green[300],
    },
    warning: {
      solid: p.amber[300],
      solidHover: p.amber[100],
      onSolid: '#241a06',
      soft: p.amber[900],
      onSoft: p.amber[300],
    },
    danger: {
      solid: p.red[300],
      solidHover: p.red[100],
      onSolid: p.red[950],
      soft: p.red[900],
      onSoft: p.red[300],
    },
    info: {
      solid: p.blue[300],
      solidHover: p.blue[100],
      onSolid: '#0e1726',
      soft: p.blue[900],
      onSoft: p.blue[300],
    },
    neutral: {
      solid: p.neutral[300],
      solidHover: p.neutral[200],
      onSolid: p.neutral[900],
      soft: p.neutral[800],
      onSoft: p.neutral[200],
    },
    chart: [p.green[400], p.blue[300], p.amber[300], p.violet[300], p.neutral[600]],
  },
};

export const fontFamily = {
  sans: ['Inter Variable', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
  mono: ['JetBrains Mono Variable', 'JetBrains Mono', 'ui-monospace', 'Menlo', 'monospace'],
} as const;

/** Native font family names (one family per platform font file; no fallbacks in React Native). */
export const nativeFontFamily = {
  sans: 'Inter',
  mono: 'JetBrainsMono',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Type scale in px: [fontSize, lineHeight]. Dense by default for data-heavy screens. */
export const fontSize = {
  xs: [12, 16],
  sm: [13, 20],
  base: [14, 20],
  lg: [16, 24],
  xl: [18, 26],
  '2xl': [20, 28],
  '3xl': [24, 32],
  '4xl': [30, 36],
} as const satisfies Record<string, readonly [number, number]>;

/** Spacing unit in px. Tailwind spacing utilities are multiples of this (p-4 = 16px). */
export const spacingUnit = 4;

export const space = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  full: 9999,
} as const;

/** Control heights in px. `touch` is the minimum target on coarse pointers. */
export const size = {
  controlSm: 28,
  controlMd: 32,
  controlLg: 40,
  touch: 44,
} as const;

export const shadow = {
  xs: '0 1px 2px 0 rgb(15 15 17 / 0.04)',
  sm: '0 1px 3px 0 rgb(15 15 17 / 0.06), 0 1px 2px -1px rgb(15 15 17 / 0.04)',
  md: '0 4px 12px -2px rgb(15 15 17 / 0.08), 0 2px 4px -2px rgb(15 15 17 / 0.04)',
  lg: '0 16px 40px -8px rgb(15 15 17 / 0.16), 0 4px 8px -4px rgb(15 15 17 / 0.06)',
} as const;

export const zIndex = {
  base: 0,
  sticky: 10,
  header: 20,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export const duration = {
  fast: 120,
  normal: 200,
  slow: 320,
} as const;

export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  exit: 'cubic-bezier(0.3, 0, 1, 1)',
} as const;

export const tokens = {
  palette,
  colors,
  fontFamily,
  nativeFontFamily,
  fontWeight,
  fontSize,
  spacingUnit,
  space,
  radius,
  size,
  shadow,
  zIndex,
  duration,
  easing,
} as const;

export type Tokens = typeof tokens;
export type ColorSchemeName = keyof typeof colors;
