/**
 * CropVibe native theme — charcoal + gold, aligned with the web app.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C1F1C',
    background: '#F4F6F3',
    backgroundElement: '#E6EBE4',
    backgroundSelected: '#D6DDD2',
    textSecondary: '#5C635C',
    accent: '#B8860B',
  },
  dark: {
    text: '#F4F6F3',
    background: '#1C1F1C',
    backgroundElement: '#2A2F2A',
    backgroundSelected: '#353B35',
    textSecondary: '#A8B0A8',
    accent: '#E5B84A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
