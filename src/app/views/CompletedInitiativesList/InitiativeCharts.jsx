import React from "react";
import { Card, Col, Row, ProgressBar, Accordion } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const InitiativeProgress = ({ nature, count, progressColor }) => {
  const maxCount = 10;
  const progressValue = (count / maxCount) * 100; // Calculate the percentage

  return (
    <div className="row mb-2">
      <div className="col-sm-6">
        <span className="skyTxt iniTxt">{nature} </span>
      </div>
      <div className="col-sm-6">
        <ProgressBar now={progressValue} label={`${count}`} style={{ height: "20px" }} />
      </div>
    </div>
  );
};

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
      // text: "By Organization Unit"
    }
  },
  scales: {
    x: {
      title: {
        display: true,
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
        text: "Organization Unit" // Label for Y-axis
      }
    }
  }
};

const InitiativeCharts = ({ Graph, NOIData, ByOUData }) => {
  console.log("Graph-cc4", Graph, NOIData, ByOUData);
  // Replacing dummy data with actual data
  const topNaturesData = NOIData?.listCompletedIniByNOIEntity?.map((item) => ({
    nature: item?.natureofDemand,
    count: item?.countOfInitiative,
    progressColor: "#28a745" // Customize colors as needed
  }));
  console.log("Graph-cc12", topNaturesData);

  const orgUnitBarData = {
    labels: Graph?.listCompletedIniByOUEntity?.map((item) => item.location),
    datasets: [
      {
        label: "Completed Initiatives",
        data: Graph?.listCompletedIniByOUEntity?.map((item) => item.countOfInitiative),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  const pieData = {
    labels: ByOUData?.listCompletedIniByConvertedToEntity?.map((item) => item.natureofDemand),
    datasets: [
      {
        data: ByOUData?.listCompletedIniByConvertedToEntity?.map((item) => item.countOfInitiative),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  };
  console.log("Graph-cc12555", ByOUData);
  return (
    <Accordion className="chartAccordion mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>View Charts</Accordion.Header>
        <Accordion.Body>
          <Row className="gx-3 gy-3 mt-3">
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>By Organization Unit</Card.Header>
                {/* Style added By Madhuri.K */}
                <Card.Body
                  className="graphSection"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Bar data={orgUnitBarData} options={barOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Top 5 Nature of Initiative</Card.Header>
                {/* Style added By Madhuri.K */}
                <Card.Body className="graphSection">
                  <div className="topIniDiv">
                    {topNaturesData?.map((item, index) => (
                      <InitiativeProgress
                        key={index}
                        nature={item.nature}
                        count={item.count}
                        progressColor={item?.progressColor}
                      />
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Converted to Project / Milestone / Deliverable / Module</Card.Header>
                {/* Style added By Madhuri.K */}
                <Card.Body
                  className="graphSection"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {/* Style added By Madhuri.K */}
                  <Pie data={pieData} />
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
