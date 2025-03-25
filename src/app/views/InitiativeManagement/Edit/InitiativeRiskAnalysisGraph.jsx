import React from "react";
import { Accordion, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { parse, addDays, subDays } from "date-fns";

// Register Chart.js components
ChartJS.register(...registerables);

const InitiativeRiskAnalysisGraph = ({ listRiskRiskAnalysisGraph }) => {
  const lastSevenData = listRiskRiskAnalysisGraph?.listRiskRiskAnalysisGraph;

  if (!lastSevenData || !Array.isArray(lastSevenData) || lastSevenData.length === 0) {
    return <p>No data available to display the graph.</p>;
  }

  const validData = lastSevenData
    .map((item) => {
      const cleanedDate = item.asOnDate.replace(/\s+/g, " ");
      const parsedDate = parse(cleanedDate, "MMM dd yyyy hh:mma", new Date());
      if (!isNaN(parsedDate) && item.value != null) {
        return { date: parsedDate, value: item.value };
      }
      return null;
    })
    .filter((item) => item !== null);

  if (validData.length === 0) {
    return <p>No valid data available to display the graph.</p>;
  }

  // Add initial and end dates for spacing
  const initialDate = subDays(validData[0].date, 1);
  const endDate = addDays(validData[validData.length - 1].date, 1);
  const extendedData = [
    { date: initialDate, value: null },
    ...validData,
    { date: endDate, value: null }
  ];
  console.log("initialDate", initialDate, endDate);
  console.log("initialDate222", validData[0].date, validData[validData.length - 1].date);
  const labels = extendedData.map((item) => item.date);
  const values = extendedData.map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Risk Value",
        data: values,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const date = new Date(context.label).toLocaleString(); // Display full date and time
            const value = context.raw;
            return `Date: ${date} - Risk Value: ${value || "N/A"}`;
          }
        }
      },
      legend: {
        display: true,
        position: "top"
      }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour", // Show ticks by hour
          tooltipFormat: "MMM dd yyyy, hh:mm a", // Tooltip includes date and time
          displayFormats: {
            hour: "MMM dd, hh:mm a" // Label format on the x-axis
          }
        },
        title: {
          display: true,
          text: "Date & Time"
        },
        ticks: {
          source: "labels",
          autoSkip: true, // Automatically skip overlapping labels
          maxRotation: 45, // Rotate labels at a 45-degree angle
          minRotation: 0, // Minimum rotation for labels
          callback: (value) => {
            // Format tick labels to include only necessary details
            return new Date(value).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            });
          }
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Risk Value"
        }
      }
    }
  };

  return (
    <div className="mt-3">
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Header eventKey="0">View Risk Analysis Chart</Accordion.Header>
          <Accordion.Body eventKey="0">
            <Line
              data={chartData}
              options={options}
              className="charthistory"
              style={{
                display: "block",
                boxSizing: "border-box",
                height: "494px",
                width: "988px"
              }}
            />
          </Accordion.Body>
        </Card>
      </Accordion>
    </div>
  );
};

export default InitiativeRiskAnalysisGraph;
