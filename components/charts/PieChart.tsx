import React, { useState } from 'react';

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) return <div className="text-center text-slate-500 dark:text-slate-400 p-8">No data to display.</div>;

    let startAngle = 0;

    const width = 200;
    const height = 200;
    const radius = 80;
    const innerRadius = 50;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
            <div className="relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-48 h-48 transform -rotate-90">
                    <g transform={`translate(${width / 2}, ${height / 2})`}>
                        {data.map((item, index) => {
                            const angle = (item.value / total) * 360;
                            const endAngle = startAngle + angle;
                            
                            const largeArcFlag = angle > 180 ? 1 : 0;

                            const startX = radius * Math.cos(startAngle * Math.PI / 180);
                            const startY = radius * Math.sin(startAngle * Math.PI / 180);
                            const endX = radius * Math.cos(endAngle * Math.PI / 180);
                            const endY = radius * Math.sin(endAngle * Math.PI / 180);

                            const innerStartX = innerRadius * Math.cos(startAngle * Math.PI / 180);
                            const innerStartY = innerRadius * Math.sin(startAngle * Math.PI / 180);
                            const innerEndX = innerRadius * Math.cos(endAngle * Math.PI / 180);
                            const innerEndY = innerRadius * Math.sin(endAngle * Math.PI / 180);

                            const pathData = [
                                `M ${startX} ${startY}`,
                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                                `L ${innerEndX} ${innerEndY}`,
                                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                                'Z'
                            ].join(' ');

                            startAngle += angle;

                            const isHovered = hoveredSlice === item.name;

                            return (
                                <path
                                    key={index}
                                    d={pathData}
                                    fill={item.color}
                                    className="transition-all duration-200"
                                    transform={isHovered ? 'scale(1.05)' : 'scale(1)'}
                                    style={{ transformOrigin: 'center center' }}
                                    onMouseEnter={() => setHoveredSlice(item.name)}
                                    onMouseLeave={() => setHoveredSlice(null)}
                                />
                            );
                        })}
                    </g>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Total Sales</span>
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">₹{total.toLocaleString()}</span>
                </div>
            </div>
            <div className="flex flex-col space-y-2 text-sm">
                {data.map((item, index) => (
                     <div key={index} className="flex items-center" onMouseEnter={() => setHoveredSlice(item.name)} onMouseLeave={() => setHoveredSlice(null)}>
                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="flex-1 text-slate-600 dark:text-slate-300">{item.name}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{((item.value / total) * 100).toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
