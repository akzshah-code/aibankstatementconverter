
import type { FC } from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChart: FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const chartHeight = 200;
  const barWidth = 40;
  const barMargin = 20;
  const totalWidth = data.length * (barWidth + barMargin);

  return (
    <div className="w-full overflow-x-auto p-4">
      <svg width={totalWidth} height={chartHeight + 40} className="font-sans">
        <g>
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * chartHeight;
            const x = i * (barWidth + barMargin);
            const y = chartHeight - barHeight;
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  className="fill-current text-brand-blue"
                  rx="4"
                  ry="4"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-sm font-semibold fill-current text-brand-dark"
                >
                  {d.value}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-current text-brand-gray"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default BarChart;