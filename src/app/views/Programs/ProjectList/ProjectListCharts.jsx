import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import initiatives from "./dummyData"; // Import the dummy data

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// Calculate top 5 natures of initiatives
const natureCount = initiatives.reduce((acc, initiative) => {
  acc[initiative.nature] = (acc[initiative.nature] || 0) + 1;
  return acc;
}, {});

const topNatures = Object.entries(natureCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .reduce(
    (acc, [nature, count]) => {
      acc.labels.push(nature);
      acc.data.push(count);
      return acc;
    },
    { labels: [], data: [] }
  );

const barData = {
  labels: topNatures.labels,
  datasets: [
    {
      label: "Top 5 Nature of Initiatives",
      data: topNatures.data,
      backgroundColor: "rgba(75,192,192,0.6)"
    }
  ]
};

const barOptions = {
  indexAxis: "y", // This makes the bar chart horizontal
  responsive: true,
  maintainAspectRatio: false // Disable aspect ratio to allow custom height
};

const InitiativeCharts = () => {
  const orgUnitBarData = {
    labels: ["Org Unit 1", "Org Unit 2", "Org Unit 3", "Org Unit 4"],
    datasets: [
      {
        label: "Completed Initiatives",
        data: [12, 19, 3, 8],
        backgroundColor: "rgba(54,162,235,0.6)"
      }
    ]
  };

  const lineData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Budget Initiatives",
        data: [5, 10, 15, 20],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderDash: [5, 5],
        pointRadius: 5,
        pointBackgroundColor: "#FF6384"
      },
      {
        label: "Implementation Initiatives",
        data: [10, 14, 25, 30],
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54,162,235,0.2)",
        borderDash: [5, 5],
        pointRadius: 5,
        pointBackgroundColor: "#36A2EB"
      },
      {
        label: "Completed Initiatives",
        data: [8, 12, 20, 25],
        borderColor: "#4BC0C0",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderDash: [5, 5],
        pointRadius: 5,
        pointBackgroundColor: "#4BC0C0"
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Row className="gx-3 gy-3">
      <Col md={6}>
        <Card className="h-100">
          <Card.Header>By Organization Unit</Card.Header>
          <Card.Body>
            <Bar data={orgUnitBarData} options={barOptions} />
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="h-100">
          <Card.Header>Initiatives Over Time</Card.Header>
          <Card.Body>
            <Line data={lineData} options={lineOptions} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default InitiativeCharts;
