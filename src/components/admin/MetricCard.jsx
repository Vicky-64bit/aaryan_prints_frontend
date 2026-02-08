import React from 'react';
import Card from './Card';

const MetricCard = ({ title, value, change, className = "" }) => (
  <Card className={`p-6 ${className}`}>
    <div className="flex justify-between items-start">
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      {change !== undefined && (
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            change > 0
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
        </div>
      )}
    </div>
  </Card>
);

export default MetricCard;