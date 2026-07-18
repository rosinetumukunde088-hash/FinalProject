import { CHART_BLUE, CHART_SURFACE, GRIDLINE, AXIS_LINE, MUTED_INK, PRIMARY_INK, niceCeiling } from './chartTheme';

export default function LineChart({ data, height = 240, color = CHART_BLUE, valueFormatter, labelFormatter }) {
  const width = 600;
  const paddingLeft = 12;
  const paddingRight = 12;
  const paddingTop = 24;
  const paddingBottom = 32;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const formatValue = valueFormatter || ((v) => v.toLocaleString());
  const formatLabel = labelFormatter || ((v) => v);

  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-12">No data available</p>;
  }

  const maxValue = niceCeiling(Math.max(...data.map((d) => d.value), 1));
  const baseline = paddingTop + plotHeight;

  const points = data.map((d, i) => ({
    ...d,
    x: paddingLeft + (data.length === 1 ? plotWidth / 2 : (plotWidth * i) / (data.length - 1)),
    y: baseline - (d.value / maxValue) * plotHeight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => paddingTop + plotHeight * (1 - t));
  const labelStep = Math.max(1, Math.ceil(points.length / 6));
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Line chart">
      {gridLines.map((y, i) => (
        <line key={i} x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={GRIDLINE} strokeWidth="1" />
      ))}
      <path d={areaPath} fill={color} opacity="0.1" stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          {i % labelStep === 0 && (
            <text x={p.x} y={height - 12} textAnchor="middle" fontSize="10" fill={MUTED_INK}>
              {formatLabel(p.label)}
            </text>
          )}
          <circle cx={p.x} cy={p.y} r="10" fill="transparent">
            <title>{formatLabel(p.label)}: {formatValue(p.value)}</title>
          </circle>
          <circle cx={p.x} cy={p.y} r="4" fill={color} stroke={CHART_SURFACE} strokeWidth="2" pointerEvents="none" />
        </g>
      ))}
      <text x={last.x} y={last.y - 10} textAnchor="end" fontSize="11" fontWeight="600" fill={PRIMARY_INK}>
        {formatValue(last.value)}
      </text>
      <line x1={paddingLeft} y1={baseline} x2={width - paddingRight} y2={baseline} stroke={AXIS_LINE} strokeWidth="1" />
    </svg>
  );
}
