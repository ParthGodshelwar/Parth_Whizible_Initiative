import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  DetailsListColumns,
  DetailsListRowFields
} from "@fluentui/react/lib/DetailsList";
import {
  Button,
  IconButton,
  IIconProps,
  TooltipHost,
  ITooltipHostProps,
  Text
} from "@fluentui/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const data = {
  labels: [
    "Q2-2023 (Jan-Feb-Mar)",
    "Q2-2023 (Apr-May-Jun)",
    "Q4-2023 (Jul-Aug-Sep)",
    "Q1-2024 (Aug-Nov-Dec)",
    "Q2-2024 (Jan-Feb-Mar)",
    "Q3-2024 (Apr-May-Jun)",
    "Q4-2024 (Jul-Aug-Sep)",
    "Q1-2025 (Aug-Nov-Dec)"
  ],
  datasets: [
    {
      label: "Cost",
      data: [1000, 1500, 2000, 1200, 1800, 1600, 1700, 1400], // Dummy data for Cost
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    },
    {
      label: "ROI",
      data: [500, 600, 700, 650, 800, 750, 700, 650], // Dummy data for ROI
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    },
    {
      label: "Value",
      data: [1500, 1800, 2200, 1700, 2100, 2000, 2200, 1900], // Dummy data for Value
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top"
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(2); // Format as needed
          }
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      stacked: true,
      title: {
        display: true,
        text: "Quarter"
      }
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: "Amount"
      }
    }
  }
};
const columns = [
  { key: "title", name: "Title", fieldName: "title", minWidth: 100, maxWidth: 200 },
  { key: "type", name: "Type", fieldName: "type", minWidth: 100, maxWidth: 200 },
  { key: "q2_2023", name: "Q2-2023", fieldName: "q2_2023", minWidth: 100, maxWidth: 200 },
  { key: "q2_2023_2", name: "Q2-2023", fieldName: "q2_2023_2", minWidth: 100, maxWidth: 200 },
  { key: "q3_2023", name: "Q3-2023", fieldName: "q3_2023", minWidth: 100, maxWidth: 200 },
  { key: "q4_2023", name: "Q4-2023", fieldName: "q4_2023", minWidth: 100, maxWidth: 200 },
  { key: "q1_2024", name: "Q1-2024", fieldName: "q1_2024", minWidth: 100, maxWidth: 200 },
  { key: "q2_2024", name: "Q2-2024", fieldName: "q2_2024", minWidth: 100, maxWidth: 200 },
  { key: "q3_2024", name: "Q3-2024", fieldName: "q3_2024", minWidth: 100, maxWidth: 200 },
  { key: "q4_2024", name: "Q4-2024", fieldName: "q4_2024", minWidth: 100, maxWidth: 200 },
  { key: "q1_2025", name: "Q1-2025", fieldName: "q1_2025", minWidth: 100, maxWidth: 200 }
];

const items = [
  // Example data
  {
    title: "Metro",
    type: "Cost",
    q2_2023: "0.00",
    q2_2023_2: "0.00",
    q3_2023: "0.00",
    q4_2023: "0.00",
    q1_2024: "0.00",
    q2_2024: "0.00",
    q3_2024: "0.00",
    q4_2024: "0.00",
    q1_2025: "0.00"
  },
  {
    title: "R",
    type: "Cost",
    q2_2023: "0.00",
    q2_2023_2: "0.00",
    q3_2023: "0.00",
    q4_2023: "0.00",
    q1_2024: "0.00",
    q2_2024: "0.00",
    q3_2024: "0.00",
    q4_2024: "0.00",
    q1_2025: "0.00"
  },
  {
    title: "Annual Budget Projection",
    type: "Cost",
    q2_2023: "0.00",
    q2_2023_2: "0.00",
    q3_2023: "0.00",
    q4_2023: "0.00",
    q1_2024: "0.00",
    q2_2024: "0.00",
    q3_2024: "0.00",
    q4_2024: "0.00",
    q1_2025: "0.00"
  }
];

const CostTable = () => {
  return (
    <div className="tab-pane active" id="iniCostParameterTab">
      <div className="costDetailsPV_sec mb-4">
        <div className="row">
          <div className="col-sm-12">
            <div className="offTable_wrapper table-responsive mb-3">
              <DetailsList
                items={items}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                isMultiline={true}
                onRenderItemColumn={(item, index, column) => {
                  if (column.key === "title" || column.key === "type") {
                    return <Text>{item[column.fieldName]}</Text>;
                  }
                  return <Text>{item[column.fieldName]}</Text>;
                }}
              />
            </div>
            <div id="IntCostPVPagination" className="text-center Init_pagination position-relative">
              {/* Pagination Component */}
              <Button text="Previous" onClick={() => console.log("Previous Page")} />
              <Button text="Next" onClick={() => console.log("Next Page")} />
            </div>
          </div>
        </div>
        <div className="row align-items-center mx-0 mt-2 mb-3 bglightblue">
          <div className="col-sm-12 text-start pt-2 pb-2">
            <label className="IM_label">Details</label>
          </div>
        </div>
        <div className="barGraph-cost" id="cost_barGraph">
          <div className="barGraphCost">
            <canvas id="costChart"></canvas>
          </div>
        </div>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default CostTable;
