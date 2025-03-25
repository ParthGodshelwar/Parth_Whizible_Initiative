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
        <span className="skyTxt iniTxt">{nature} : </span>
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
        callback: function (value) {
          return Math.round(value); // Round to the nearest whole number
        },
        stepSize: 1, // Force step size of 1 for whole numbers
        beginAtZero: true, // Ensure the axis starts from 0
        min: 0 // Ensure minimum value is 0
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
  // Replacing dummy data with actual data
  const topNaturesData = NOIData?.listConvertedIniByNOIVM?.map((item) => ({
    nature: item?.natureofDemand,
    count: item?.countOfInitiative,
    progressColor: "#28a745" // Customize colors as needed
  }));

  const orgUnitBarData = {
    labels: Graph?.listConvertedIniByOU?.map((item) => item.organizationUnit),
    datasets: [
      {
        // Changed label by Gauri to Converted Initiatives
        label: "Converted Initiatives",
        data: Graph?.listConvertedIniByOU?.map((item) => item.countOfInitiative),
        backgroundColor: "rgba(75,192,192,0.6)"
      }
    ]
  };

  const pieData = {
    labels: ByOUData?.listConvertedIniByConvertedToVM?.map((item) => item.convertedTo),
    datasets: [
      {
        data: ByOUData?.listConvertedIniByConvertedToVM?.map((item) => item.countOfInitiative),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
      }
    ]
  };
  console.log("Graph-cc12555", ByOUData?.listConvertedIniByConvertedToVM);
  return (
    <Accordion className="chartAccordion mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>View Charts</Accordion.Header>
        <Accordion.Body>
          <Row className="gx-3 gy-3">
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>By Organization Unit</Card.Header>
                {/* Added width and height by Gauri */}
                <Card.Body className="graphSection">
                  <Bar data={orgUnitBarData} options={barOptions} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100">
                <Card.Header>Top 5 Nature of Initiative</Card.Header>
                {/* Added width and height by Gauri */}
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
                {/* Added width and height by Gauri */}
                <Card.Body
                  className="graphSection"
                  style={{ display: "flex", justifyContent: "center" }}
                >
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
