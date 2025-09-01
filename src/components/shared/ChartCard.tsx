
import type { FC, ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export const ChartCard: FC<ChartCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-md font-semibold text-brand-gray mb-4">{title}</h3>
      {children}
    </div>
  );
};
