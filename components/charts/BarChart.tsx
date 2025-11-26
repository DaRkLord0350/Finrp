import React from 'react';
import useTheme from '../../hooks/useTheme';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  unit?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, color = '#10b981', unit = '' }) => {
  const [theme] = useTheme();

  const width = 500;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const xScale = (width - padding.left - padding.right) / data.length;
  const yScale = (height - padding.top - padding.bottom) / maxValue;

  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  const formatYLabel = (val: number) => {
    if (val >= 1000) return `${unit}${(val / 1000).toFixed(0)}k`;
    return `${unit}${val}`;
  };

  return (
    <div className="w-full h-auto overflow-visible">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Y-axis grid lines and labels */}
        {Array.from({ length: 5 }, (_, i) => {
          const yValue = (maxValue / 4) * i;
          const y = padding.top + (maxValue - yValue) * yScale;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={gridColor} strokeDasharray="2,2" />
              <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill={labelColor}>
                {formatYLabel(yValue)}
              </text>
            </g>
          );
        })}

        {/* Bars and X-axis labels */}
        {data.map((d, i) => {
          const barHeight = d.value * yScale;
          const x = padding.left + i * xScale;
          const y = height - padding.bottom - barHeight;
          return (
            <g key={d.name}>
              <rect
                x={x + xScale * 0.1}
                y={y}
                width={xScale * 0.8}
                height={barHeight}
                fill={color}
                rx="2"
              />
              <text
                x={x + xScale / 2}
                y={height - padding.bottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill={labelColor}
              >
                {d.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
