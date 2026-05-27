'use client';

import * as React from 'react';

export interface Palette {
  id: string;
  name: string;
  // Page background
  bg: string;
  // Primary gradient (buttons, active tabs, ticker bar, accents)
  gradFrom: string;
  gradTo: string;
  gradFromHover: string;
  gradToHover: string;
  // Soft tint surface (cards, panels)
  surface: string;
  surfaceBorder: string;
  // Text colours
  textPrimary: string;    // headings
  textSecondary: string;  // labels, captions
  textMuted: string;      // faint helper text
  // Badge / pill
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  // Accent highlights (dividers, rings, focus)
  accentLight: string;
  accentMid: string;
  accentStrong: string;
}

export const PALETTES: Palette[] = [
  // ── Blushing Rosé ──────────────────────────────────────────────────────────
  {
    id: 'blushing',
    name: 'Blushing Rosé',
    bg: '#fffbfb',
    gradFrom: '#fb7185',   // rose-400
    gradTo: '#ec4899',     // pink-500
    gradFromHover: '#f43f5e',
    gradToHover: '#db2777',
    surface: '#fff5f7',
    surfaceBorder: '#fce7f3',
    textPrimary: '#4c0519',   // rose-950
    textSecondary: '#9f1239', // rose-800
    textMuted: '#fda4af',     // rose-300
    badgeBg: '#fff1f2',
    badgeBorder: '#fecdd3',
    badgeText: '#e11d48',
    accentLight: '#fce7f3',
    accentMid: '#fbcfe8',
    accentStrong: '#f472b6',
  },
  // ── Apricot Honey ──────────────────────────────────────────────────────────
  {
    id: 'honey',
    name: 'Apricot Honey',
    bg: '#fffdf8',
    gradFrom: '#fbbf24',   // amber-400
    gradTo: '#f97316',     // orange-500
    gradFromHover: '#f59e0b',
    gradToHover: '#ea580c',
    surface: '#fffbeb',
    surfaceBorder: '#fde68a',
    textPrimary: '#451a03',   // amber-950
    textSecondary: '#92400e', // amber-800
    textMuted: '#fcd34d',     // amber-300
    badgeBg: '#fffbeb',
    badgeBorder: '#fde68a',
    badgeText: '#b45309',
    accentLight: '#fef3c7',
    accentMid: '#fde68a',
    accentStrong: '#f59e0b',
  },
  // ── Wisteria Dusk ──────────────────────────────────────────────────────────
  {
    id: 'lavender',
    name: 'Wisteria Dusk',
    bg: '#faf8ff',
    gradFrom: '#a78bfa',   // purple-400
    gradTo: '#6366f1',     // indigo-500
    gradFromHover: '#8b5cf6',
    gradToHover: '#4f46e5',
    surface: '#f5f3ff',
    surfaceBorder: '#ddd6fe',
    textPrimary: '#2e1065',   // purple-950
    textSecondary: '#5b21b6', // purple-800
    textMuted: '#c4b5fd',     // purple-300
    badgeBg: '#f5f3ff',
    badgeBorder: '#ddd6fe',
    badgeText: '#7c3aed',
    accentLight: '#ede9fe',
    accentMid: '#ddd6fe',
    accentStrong: '#a78bfa',
  },
];

interface ThemeCtx {
  palette: Palette;
  paletteIndex: number;
  setPaletteIndex: (i: number) => void;
}

export const ThemeContext = React.createContext<ThemeCtx>({
  palette: PALETTES[0],
  paletteIndex: 0,
  setPaletteIndex: () => {},
});

export function useTheme() {
  return React.useContext(ThemeContext);
}
