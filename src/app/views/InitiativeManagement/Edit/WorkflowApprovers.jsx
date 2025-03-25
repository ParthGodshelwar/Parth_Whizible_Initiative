import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Drawer,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Icon for Accordion
import CustomProgressBar from "app/utils/CustomProgressBar";

// Changed legends names by Gauri on 05 Feb 2025 
const legends = [
  { color: "#81cf09", label: "Cleared" }, // Green
  { color: "#F5C330", label: "Current" }, // Yellow
  { color: "#f55c30", label: "Delayed current" }, // Orange
  { color: "#B3B3B3", label: "Not started yet" } // Grey
];

const WorkflowApprovers = ({ data, data1, data2, initiativesID }) => {
  const [cstageName, setCStageName] = useState("");
  const [dewdate, setDewdate] = useState("");
  const [drawerOpen1, setDrawerOpen1] = useState(false); // Drawer state
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [workflowData, setWorkflowData] = useState(null); // Data for the drawer content
  const [selectedNOI, setSelectedNOI] = useState("");
  const accessToken = sessionStorage.getItem("access_token");
  const [selectedNOI1, setSelectedNOI1] = useState("");
  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetManageWorkFlowChangeNOI?IdeaID=${initiativesID}&NOI=${selectedNOI}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const result = await response.json();
      setWorkflowData(result);
    } catch (error) {
      console.error("Error fetching workflow data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleClick();
  }, [selectedNOI1]);

  const renderTable = (data) => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Order</th>
            <th>Stage</th>
            <th>Approvers</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.orderNo}</td>
              <td>{item.requestStage}</td>
              <td>{item.stakeHolderNames}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container-fluid" style={{ padding: "20px" }}>
      <Typography variant="subtitle1" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
        3. Additional Approvers
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
        If you need additional approvers,{" "}
        {/* Commented and added code by Gauri start here */}
        {/* <a
          href="#"
          onClick={handleClick}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Click
        </a>{" "} */}
        {/* Commented and added code by Gauri start here */}
        Click on the Stage.
      </Typography>
      <div className="stages-div px-4 pt-3 mb-2" id="stages-div">
        <div className="stage-status d-flex justify-content-end align-items-center">
          <div className="stage-title">
            {/* Commented and Added section UI by Gauri start here on 04 Feb 2025 */}
            {/* <Typography variant="h6" style={{ fontSize: "11px" }}>
              Legends
            </Typography> */}
            <Box sx={{ fontWeight: "bold", marginRight: "15px" }}>Legends:</Box>
            {/* Commented and Added section UI by Gauri end here on 04 Feb 2025 */}
          </div>

          <div className="stage-content d-flex align-items-center ms-3">
            {legends.map((legend, index) => (
              <div key={index} className="d-flex gap-1 ms-3">
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: legend.color,
                    borderRadius: "4px"
                  }}
                ></div>
                <Typography variant="body1" style={{ fontSize: "12px" }}>{legend.label}</Typography>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CustomProgressBar
      // passsed data2 for stages by Gauri on 05 Feb 2025 
        stages={data2}
        setDewdate={setDewdate}
        setCStageName={setCStageName}
        percentageOfComplete={data1?.percentageOfComplete}
        initiative={data1}
      />

      {/* Drawer for displaying workflow details */}
      <Drawer anchor="right" open={drawerOpen1} onClose={() => setDrawerOpen1(false)}>
        <Box sx={{ width: 800, padding: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : workflowData ? (
            <>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                Nature of Initiative
              </Typography>
              <div className="details-div">
                <Typography variant="body2">
                  <strong>Initiative:</strong> Workflow Configure Initiative
                </Typography>
                <Typography variant="body2">
                  <strong>Nature of Initiative:</strong> Tool Implementation
                </Typography>
              </div>
              <div style={{ marginTop: "30px", display: "flex", alignItems: "center" }}>
                <FormControl style={{ width: "200px" }}>
                  <InputLabel>Change Nature of Initiative</InputLabel>
                  <Select
                    label="Change Nature of Initiative"
                    value={selectedNOI1}
                    onChange={(e) => setSelectedNOI1(e.target.value)}
                    fullWidth
                  >
                    {data && data.length > 0 ? (
                      data.map((item) => (
                        <MenuItem key={item.natureOfDemandID} value={item.natureOfDemandID}>
                          {item.natureOfDemand}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Changed Nature of Initiative Details1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTable(workflowData?.data?.listManageWorkCurrentNOI)}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Changed Nature of Initiative Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTable(workflowData?.data?.listManageWorkChangeNOINOI)}
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default WorkflowApprovers;
