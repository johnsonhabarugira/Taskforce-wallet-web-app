import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF7F50', '#6495ED'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF4500', '#4169E1'],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div style={{ height: '200px', width: '100%' }}> 
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
