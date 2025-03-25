import React from "react";
import { Stack, Text } from "@fluentui/react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const QuickInbox = ({ qinbox }) => {
  console.log("qinbox", qinbox);

  // Extracting labels and data from qinbox.listLandingDBQinbox
  const labels = qinbox?.listLandingDBQinbox?.map((item) => item.natureofDemand) || [];
  const data = qinbox?.listLandingDBQinbox?.map((item) => item.countOfInitiative) || [];

  const polarAreaChartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(248, 215, 218, 0.6)", // Light red with transparency
          "rgba(54, 162, 235, 0.6)", // Blue with transparency
          "rgba(255, 206, 86, 0.6)", // Yellow with transparency
          "rgba(75, 192, 192, 0.6)" // Teal with transparency
        ],
        borderWidth: 1,
        borderColor: [
          "rgba(248, 215, 218, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)"
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      r: {
        ticks: {
          display: true,
          backdropColor: "transparent",
          color: "#000", // Makes the ticks stand out
          z: 1,
          font: {
            size: 14
          },
          padding: 10
        },
        grid: {
          circular: true, // Keeps grid circular
          color: "#ccc" // Light grey for better visibility
        },
        angleLines: {
          color: "#999" // Slightly darker for better contrast with chart colors
        }
      }
    }
  };

  return (
    <Stack
      styles={{
        root: {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          flex: 1
        }
      }}
    >
      <Text variant="medium" styles={{ root: { fontWeight: "bold", marginBottom: "16px" } }}>
        Quick inbox (Nature of Initiative)
      </Text>
      <div style={{ width: "100%", height: "400px" }}>
        <PolarArea data={polarAreaChartData} options={options} />
      </div>
    </Stack>
  );
};

export default QuickInbox;
