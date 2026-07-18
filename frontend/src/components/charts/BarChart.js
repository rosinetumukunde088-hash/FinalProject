import { CHART_BLUE, GRIDLINE, AXIS_LINE, MUTED_INK, PRIMARY_INK, niceCeiling } from './chartTheme';

export default function BarChart({ data, height = 240, color = CHART_BLUE, valueFormatter }) {
  const width = 600;
  const paddingLeft = 12;
  const paddingRight = 12;
  const paddingTop = 24;
  const paddingBottom = 32;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const formatValue = valueFormatter || ((v) => v.toLocaleString());

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-12">No data available</p>;
  }

  const maxValue = niceCeiling(Math.max(...data.map((d) => d.value), 1));
  const barSlot = plotWidth / data.length;
  const barWidth = Math.min(24, barSlot * 0.55);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => paddingTop + plotHeight * (1 - t));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Bar chart">
      {gridLines.map((y, i) => (
        <line key={i} x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={GRIDLINE} strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const barHeight = Math.max((d.value / maxValue) * plotHeight, d.value > 0 ? 1 : 0);
        const x = paddingLeft + barSlot * i + (barSlot - barWidth) / 2;
        const y = paddingTop + plotHeight - barHeight;
        const label = String(d.label).length > 12 ? `${String(d.label).slice(0, 11)}…` : d.label;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" ry="4" fill={color}>
              <title>{d.label}: {formatValue(d.value)}</title>
            </rect>
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill={PRIMARY_INK}>
              {formatValue(d.value)}
            </text>
            <text x={x + barWidth / 2} y={height - 12} textAnchor="middle" fontSize="11" fill={MUTED_INK}>
              {label}
            </text>
          </g>
        );
      })}
      <line
        x1={paddingLeft}
        y1={paddingTop + plotHeight}
        x2={width - paddingRight}
        y2={paddingTop + plotHeight}
        stroke={AXIS_LINE}
        strokeWidth="1"
      />
    </svg>
  );
}
