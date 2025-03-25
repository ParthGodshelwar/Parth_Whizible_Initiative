import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import { parse, format } from "date-fns";

ChartJS.register(...registerables);

const InitiativeRiskAnalysisGraph = ({ listRiskRiskAnalysisGraph }) => {
  // Parse and clean the data
  const cleanedData = listRiskRiskAnalysisGraph?.map((item) => {
    const cleanedDate = item.asOnDate.replace(/\s+/g, " ").trim();
    return {
      ...item,
      asOnDate: parse(cleanedDate, "MMM dd yyyy h:mma", new Date()) // Parse into Date object
    };
  });

  // Extract labels and values, ensuring dates are formatted consistently
  const labels = cleanedData?.map((item) => format(item.asOnDate, "MMM dd yyyy"));
  const values = cleanedData?.map((item) => item.value);

  // Remove duplicate dates from the labels
  const uniqueLabels = [];
  const uniqueValues = [];
  labels?.forEach((label, index) => {
    if (!uniqueLabels.includes(label)) {
      uniqueLabels.push(label);
      uniqueValues.push(values[index]);
    }
  });

  const chartData = {
    labels: uniqueLabels, // Use unique dates
    datasets: [
      {
        label: "Risk Value",
        data: uniqueValues, // Corresponding values for unique dates
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "category", // Use category instead of time since labels are now unique
        title: {
          display: true,
          text: "As on Date"
        },
        ticks: {
          autoSkip: false, // Show all unique labels
          maxRotation: 0, // Prevent label rotation
          minRotation: 0,
          maxTicksLimit: 10 // Limit the number of visible labels
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Risk Value"
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Date: ${context.label} - Risk Value: ${context.raw}`;
          }
        }
      }
    }
  };

  return (
    <div className="mt-3">
      <h4 style={{ textAlign: "center" }}>Initiative Risk Analysis Graph</h4>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h5>View Risk Analysis Chart</h5>
        </AccordionSummary>
        <AccordionDetails>
          <Line
            data={chartData}
            options={options}
            style={{
              display: "block",
              height: "400px",
              width: "100%"
            }}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default InitiativeRiskAnalysisGraph;
