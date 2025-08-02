// @ts-ignore-next-line
import { Bar, Pie } from 'react-chartjs-2';
// @ts-ignore-next-line
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Tooltip, Legend);

type Transaction = {
  date: string; // YYYY-MM-DD
  amount: number;
  category: string;
};

type Props = {
  transactions: Transaction[];
};

export default function TransactionAnalysisCharts({ transactions }: Props) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-600">No transaction data available.</p>;
  }

  // Aggregate by date (last 7 days)
  const byDateMap: Record<string, number> = {};
  const byCategoryMap: Record<string, number> = {};

  transactions.forEach(tx => {
    byDateMap[tx.date] = (byDateMap[tx.date] || 0) + tx.amount;
    byCategoryMap[tx.category] = (byCategoryMap[tx.category] || 0) + tx.amount;
  });

  const dates = Object.keys(byDateMap).sort();
  const dateVals = dates.map(d => byDateMap[d]);

  const categories = Object.keys(byCategoryMap);
  const catVals = categories.map(c => byCategoryMap[c]);

  const barData = {
    labels: dates,
    datasets: [
      {
        label: 'Sales (RM)',
        data: dateVals,
        backgroundColor: '#ff0080',
      },
    ],
  };

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: catVals,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Last Period</h3>
        <Bar data={barData} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
} 