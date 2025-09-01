
import type { FC } from 'react';

interface DonutChartProps {
  percentage: number;
  label: string;
}

const DonutChart: FC<DonutChartProps> = ({ percentage, label }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-gray-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="text-brand-blue"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-brand-dark">{`${Math.round(percentage)}%`}</span>
        <p className="text-xs text-brand-gray">{label}</p>
      </div>
    </div>
  );
};

export default DonutChart;