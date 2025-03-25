import React, { useState } from "react";
import { Card, Col, Row, Accordion, ProgressBar } from "react-bootstrap";
import { Bar, Doughnut, Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import initiatives from "./dummyData"; // Import the dummy data

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  ArcElement,
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

const topNaturesData = [
  { nature: "Budget", count: 60, progressColor: "#28a745" }, // Green
  { nature: "Implementation", count: 37, progressColor: "#17a2b8" }, // Blue
  { nature: "Initiative Report", count: 67, progressColor: "#ffc107" }, // Yellow
  { nature: "Category", count: 24, progressColor: "#dc3545" }, // Red
  { nature: "Build Sea link", count: 75, progressColor: "#6f42c1" } // Purple
];

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

const InitiativeProgress = ({ nature, count, progressColor }) => (
  <div className="row mb-2">
    <div className="col-sm-6">
      <span className="skyTxt iniTxt">{nature} : </span>
    </div>
    <div className="col-sm-6">
      <ProgressBar
        now={count}
        label={`${count}`}
        style={{ backgroundColor: progressColor, height: "20px" }}
      />
    </div>
  </div>
);

const barOptions = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true, // Display the legend
      position: "top" // Position the legend
    },
    title: {
      display: true
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        // Text Changed By Madhuri.K On 16-Dec-2024
        text: "Initiatives" // Label for X-axis
      },
      ticks: {
        // Ensure ticks are whole numbers
        callback: function (value) {
          return Number.isInteger(value) ? value : Math.round(value); // Round to the nearest whole number
        },
        stepSize: 1, // Set step size to 1 for whole numbers
        beginAtZero: true, // Ensure the axis starts from 0
        min: 0 // Set the minimum value for the x-axis to be 0
      }
    },
    y: {
      title: {
        display: true,
        // Text Changed By Madhuri.K On 16-Dec-2024
        text: "Organization Unit" // Label for Y-axis
      }
    }
  }
};

const scatterOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true, // Display the legend
      position: "top" // Position the legend
    },
    title: {
      display: true
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Months" // Label for X-axis
      }
    },
    y: {
      title: {
        display: true,
        text: "No. of Initiatives" // Label for Y-axis
      }
    }
  }
};

const InitiativeCharts = ({ Graph, NOIData, ByOUData }) => {
  console.log("InitiativeChartsWWW", Graph, NOIData, ByOUData);

  const scatterData = {
    // labels: ["December", "November", "October", "September", "August"],
    labels: Graph?.listWithdrawnIniByMonthEntity?.map((item) => item.months),
    datasets: [
      {
        label: "Monthly Data",
        // data: [
        //   { x: "December", y: 50 },
        //   { x: "November", y: 45 },
        //   { x: "October", y: 10 },
        //   { x: "September", y: 68 },
        //   { x: "August", y: 75 }
        // ],
        data: Graph?.listWithdrawnIniByMonthEntity?.map((item) => item.countOfInitiative),
        borderWidth: 2,
        pointBackgroundColor: ["#16872d", "#F5C330", "#F08000", "#239b9b", "#16872d"],
        pointRadius: 5,
        pointHoverRadius: 15
      }
    ]
  };

  const orgUnitBarData = {
    // labels: ["Org Unit 1", "Org Unit 2", "Org Unit 3", "Org Unit 4"],
    labels: ByOUData?.listWithdrawnIniByOUEntity?.map((item) => item.organizationUnit),
    datasets: [
      {
        label: "Withdrawn Initiatives",
        // data: [12, 19, 3, 8],
        data: ByOUData?.listWithdrawnIniByOUEntity?.map((item) => item.countOfInitiative),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  const pieData = {
    // labels: ["Project", "Milestone", "Deliverable", "Module"],
    labels: NOIData?.listWithdrawnIniByStagesVM?.map((item) => item.stage),
    datasets: [
      {
        // data: [10, 20, 30, 40],
        data: NOIData?.listWithdrawnIniByStagesVM?.map((item) => item.countOfInitiative),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
      }
    ]
  };

  return (
    <Accordion className="chartAccordion mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>View Charts</Accordion.Header>
        <Accordion.Body>
          <Row className="gx-3 gy-3">
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Recently Withdrawn Initiatives By Month</Card.Header>
                <Card.Body
                  className="graphSection"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Line data={scatterData} options={scatterOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>By Organization Unit</Card.Header>
                <Card.Body className="graphSection">
                  <Bar data={orgUnitBarData} options={barOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Initiatives withdrawn at stages</Card.Header>
                <Card.Body
                  className="graphSection"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Doughnut data={pieData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default InitiativeCharts;
