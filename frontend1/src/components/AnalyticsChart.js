import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Maintenance Cost",
        data: [300, 500, 250, 700, 450],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: "Maintenance Cost Analysis" },
    },
    scales: {
      x: { type: "category" }, // Ensure category scale is properly registered
      y: { beginAtZero: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AnalyticsChart;
