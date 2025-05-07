import React from 'react';

type ImpactMetricProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

const ImpactMetric = ({ icon, value, label }: ImpactMetricProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-500 mb-4">
        {icon}
      </div>
      <div className="font-heading font-bold text-2xl mb-1">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
};

export default ImpactMetric;
