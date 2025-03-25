import React, { useState } from "react";
import { Box, Typography } from "@mui/material"; // Use Typography from MUI
import CustomProgressBar from "app/utils/CustomProgressBar";

  // const [initiatives, setInitiatives] = useState([]);

  // Changed legends names by Gauri on 05 Feb 2025 
  const legends = [
    { color: "#81cf09", label: "Cleared" }, // Green
    { color: "#F5C330", label: "Current" }, // Yellow
    { color: "#f55c30", label: "Delayed current" }, // Orange
    { color: "#B3B3B3", label: "Not started yet" } // Grey
  ];

{/* Passed initiativesData and initiativesID by Gauri for manage workflow stages on 24 Mar 2025 */}
const WorkflowStages = ({ data, data1, initiativesData, initiativesID }) => {
  // const selectedInitiative = initiativesData?.[initiativesID] || {}; // Select first object
  
  {/* Added selectedInitiative by Gauri for manage workflow stages on 24 Mar 2025 */}
  const selectedInitiative = initiativesData?.find(ini => ini.ideaIdPk === initiativesID) || {};
  console.log("WorkflowStages - Selected Initiative:", selectedInitiative);
  console.log("WorkflowStages - initiativesData received:", initiativesData);
  // const [initiatives, setInitiatives] = useState(null)

  console.log("data1", data);
  const [cstageName, setCStageName] = useState(0);
  const [dewdate, setDewdate] = useState(0);

  return (
    <div className="container-fluid" style={{ padding: "20px" }}>
      {/* Material-UI Box Wrapper */}
      <Box
        sx={{
          border: "1px solid #ddd", // Light grey border
          borderRadius: "8px", // Rounded corners
          padding: "20px", // Padding inside the box
          backgroundColor: "#f9f9f9", // Light background color
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" // Subtle shadow
        }}
      >
        <div className="stages-div px-2 pt-2 mb-1" id="stages-div">
          <div className="stage-status d-flex justify-content-end">
            <div className="stage-title">
              {/* Commented and Added section UI by Gauri start here on 04 Feb 2025 */}
              {/* <Typography variant="h6" style={{ fontSize: "16px" }}>
                Legends
              </Typography>{" "} */}
              <Box sx={{ fontWeight: "bold", marginRight: "15px" }}>Legends:</Box>
              {/* Commented and Added section UI by Gauri end here on 04 Feb 2025 */}
              {/* Reduced font size */}
            </div>
            <div className="stage-content d-flex">
              {legends.map((legend, index) => (
                <div key={index} className="d-flex gap-1 ms-2">
                  {/* Color Box */}
                  <div
                    style={{
                      width: "15px", // Reduced width
                      height: "15px", // Reduced height
                      backgroundColor: legend.color,
                      borderRadius: "2px" // Smaller border radius
                    }}
                  ></div>
                  <Typography variant="body2" style={{ fontSize: "12px" }}>
                    {legend.label}
                  </Typography>{" "}
                  {/* Smaller font size */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Passed selectedInitiative by Gauri for manage workflow stages on 24 Mar 2025 */}
        <CustomProgressBar
          stages={data}
          setDewdate={setDewdate}
          setCStageName={setCStageName}
          percentageOfComplete={data1?.percentageOfComplete}
          initiative={selectedInitiative}
        />
      </Box>
    </div>
  );
};

export default WorkflowStages;
