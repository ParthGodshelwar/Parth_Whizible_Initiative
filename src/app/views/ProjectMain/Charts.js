// components/Charts.js
import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Register the necessary components with ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const barData = {
    labels: [
      "Budget",
      "Re-Implementation of Whiz",
      "Initiative Report",
      "Category",
      "Build Sea link"
    ],
    datasets: [
      {
        label: "Top 5 Nature of Initiative",
        data: [10, 7, 7, 4, 5],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(153, 102, 255, 0.6)" // Purple
        ]
      }
    ]
  };

  const lineData = {
    labels: ["Project", "Milestone", "Deliverable", "Module"],
    datasets: [
      {
        label: "Dataset 1",
        data: [25, 20, 15, 10],
        fill: false,
        borderColor: "#4caf50",
        tension: 0.1,
        pointBackgroundColor: "#4caf50",
        pointBorderColor: "#4caf50",
        pointHoverBackgroundColor: "#4caf50",
        pointHoverBorderColor: "#4caf50"
      },
      {
        label: "Dataset 2",
        data: [15, 10, 5, 25],
        fill: false,
        borderColor: "#ffeb3b",
        tension: 0.1,
        pointBackgroundColor: "#ffeb3b",
        pointBorderColor: "#ffeb3b",
        pointHoverBackgroundColor: "#ffeb3b",
        pointHoverBorderColor: "#ffeb3b"
      },
      {
        label: "Dataset 3",
        data: [10, 25, 20, 15],
        fill: false,
        borderColor: "#f44336",
        tension: 0.1,
        pointBackgroundColor: "#f44336",
        pointBorderColor: "#f44336",
        pointHoverBackgroundColor: "#f44336",
        pointHoverBorderColor: "#f44336"
      },
      {
        label: "Dataset 4",
        data: [20, 15, 10, 5],
        fill: false,
        borderColor: "#00bcd4",
        tension: 0.1,
        pointBackgroundColor: "#00bcd4",
        pointBorderColor: "#00bcd4",
        pointHoverBackgroundColor: "#00bcd4",
        pointHoverBorderColor: "#00bcd4"
      },
      {
        label: "Dataset 5",
        data: [5, 10, 15, 20],
        fill: false,
        borderColor: "#9c27b0",
        tension: 0.1,
        pointBackgroundColor: "#9c27b0",
        pointBorderColor: "#9c27b0",
        pointHoverBackgroundColor: "#9c27b0",
        pointHoverBorderColor: "#9c27b0"
      }
    ]
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
      <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: "300px" }}>
        <Card>
          <CardHeader title="By Organization Unit" />
          <CardContent>
            <div style={{ height: "300px" }}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div style={{ flex: "1 1 calc(50% - 16px)", minWidth: "300px" }}>
        <Card>
          <CardHeader title="Converted to Project / Milestone / Deliverable / Module" />
          <CardContent>
            <div style={{ height: "300px" }}>
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Charts;
