
import React from 'react';

interface ImpactMetricProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const ImpactMetric = ({ icon, value, label }: ImpactMetricProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="bg-teal-50 text-teal-600 p-3 rounded-full mb-3">
        {icon}
      </div>
      <div className="font-heading font-bold text-2xl">{value}</div>
      <div className="text-gray-500 text-sm mt-1">{label}</div>
    </div>
  );
};

export default ImpactMetric;
