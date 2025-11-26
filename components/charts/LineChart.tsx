import React from 'react';
import useTheme from '../../hooks/useTheme';

interface DataPoint {
  name: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, color = '#10b981' }) => {
  const [theme] = useTheme();

  // Chart dimensions and padding
  const width = 500;
  const height = 200;
  const padding = 30;
  
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(p => p.value));
  const xScale = data.length > 1 ? (width - 2 * padding) / (data.length - 1) : 0;
  const yScale = maxValue > 0 ? (height - 2 * padding) / maxValue : 0;

  // Create the line path
  const linePath = data
    .map((point, i) => {
      const x = padding + i * xScale;
      const y = height - padding - point.value * yScale;
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');
    
  // Create the area path
  const areaPath = `${linePath} V ${height - padding} L ${padding},${height - padding} Z`;

  const labelColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  // Create X-axis labels
  const xLabels = data.map((point, i) => {
    const x = padding + i * xScale;
    return (
      <text key={i} x={x} y={height - padding + 15} textAnchor="middle" fontSize="10" fill={labelColor}>
        {point.name}
      </text>
    );
  });
  
  // Create Y-axis labels and grid lines
  const yLabelsAndGrid = Array.from({ length: 5 }, (_, i) => {
      const yValue = maxValue > 0 ? (maxValue / 4) * i : 0;
      const y = height - padding - yValue * yScale;
      return (
          <g key={i}>
              <text x={padding - 10} y={y + 3} textAnchor="end" fontSize="10" fill={labelColor}>
                {`₹${(yValue / 1000).toFixed(0)}k`}
              </text>
              <line x1={padding} y1={y} x2={width-padding} y2={y} stroke={gridColor} strokeDasharray="2,2" />
          </g>
      )
  }).reverse();

  return (
    <div className="w-full h-auto overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {yLabelsAndGrid}
        {xLabels}
        <path d={areaPath} fill={color} fillOpacity="0.1" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" />
        {data.map((point, i) => {
            const x = padding + i * xScale;
            const y = height - padding - point.value * yScale;
            return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke={theme === 'dark' ? '#1e293b' : 'white'} strokeWidth="1" />
        })}
        </svg>
    </div>
  );
};

export default LineChart;
