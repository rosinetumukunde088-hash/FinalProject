// Single-hue sequential blue is the default for these charts: every chart in
// this app plots one metric across categories or time, never distinct named
// series, so a categorical multi-hue palette (and its CVD-pairing rules)
// doesn't apply here — see the dataviz skill's "choosing a form" guidance.
export const CHART_BLUE = '#2a78d6';
export const CHART_SURFACE = '#fcfcfb';
export const GRIDLINE = '#e1e0d9';
export const AXIS_LINE = '#c3c2b7';
export const MUTED_INK = '#898781';
export const PRIMARY_INK = '#0b0b0b';

// Rounds a max value up to a "clean" tick (1/2/5/10 x 10^n) so gridlines and
// the axis ceiling read as round numbers instead of an arbitrary data max.
export function niceCeiling(value) {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  let niceNormalized;
  if (normalized <= 1) niceNormalized = 1;
  else if (normalized <= 2) niceNormalized = 2;
  else if (normalized <= 5) niceNormalized = 5;
  else niceNormalized = 10;
  return niceNormalized * magnitude;
}
