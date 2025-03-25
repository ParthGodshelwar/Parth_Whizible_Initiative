import React, { useEffect, useState } from "react";
import { Drawer, Table, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon from Material-UI
import PropTypes from "prop-types";
import GetInitiativeWorkFlow from "../../../hooks/Editpage/GetInitiativeWorkFlow";
import Tooltip from "@mui/material/Tooltip";

const WorkflowInfo = ({ open, onClose, initiativesID }) => {
  const [initiativeWorkFlow, setInitiativeWorkFlow] = useState();

  // Fetch workflow data when the component mounts or when initiativesID changes
  useEffect(() => {
    const fetchWorkFlow = async () => {
      const workFlow = await GetInitiativeWorkFlow(initiativesID);
      setInitiativeWorkFlow(workFlow);
    };

    if (initiativesID) {
      fetchWorkFlow();
    }
  }, [initiativesID]);

  // Destructure data from initiativeWorkFlow
  const workflowData = initiativeWorkFlow?.data?.listInitiativeWorkflowEntity || [];
  const startStage = workflowData[0] || {};
  const endStage = workflowData[workflowData.length - 1] || {};

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: "60vw", padding: "20px" }}>
        <div style={{ backgroundColor: "#f0f0f0", padding: "10px", position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            style={{ position: "absolute", top: 10, right: 10 }} // Position the button in the top right corner
          >
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>

          <Typography variant="h6">Workflow Information</Typography>
        </div>

        <div className="details-div py-3">
          <div className="row">
            <div className="details-main-sec">
              <div className="d-sec1 px-4">
                <Table striped className="details-table1 mb-0 w-100">
                  <tbody>
                    <tr>
                      <td>Started :</td>
                      <td className="tital22">{startStage?.eventTime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Originator :</td>
                      <td className="tital22">{startStage?.employeeName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Current Stage:</td>
                      <td className="tital22">{endStage?.toStageName || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="vertical-line"></div>
              <div className="d-sec2 px-4">
                <Table striped className="details-table2 mb-0 w-100">
                  <tbody>
                    <tr>
                      <td>Last :</td>
                      <td className="tital22">{endStage?.eventTime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Last Actor :</td>
                      <td className="tital22">{endStage?.employeeName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Approvers :</td>
                      <td className="tital22">{endStage?.comments || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <hr className="horizontal-line" />
          <div className="col-sm-4 pt-3">
            <span>Workflow Summary</span>
          </div>
          <div className="details-div py-3">
            <div className="row">
              {workflowData.length > 0 ? (
                workflowData.map((stage, index) => (
                  <div className="row mb-4">
                    {/* Left Side: Stage Names and Arrows */}
                    <div className="col-md-6 text-center">
                      {" "}
                      {/* Added text-center to the column div */}
                      <div
                        className="border rounded-3 p-3 mx-auto" // Use mx-auto to center the div
                        style={{
                          backgroundColor: "#2B55CE",
                          color: "white",
                          marginBottom: "20px",
                          width: "100px", // Reduced width
                          maxWidth: "100%", // Ensure it doesn't exceed the parent width
                          borderRadius: "50px"
                        }}
                      >
                        <span>{stage.fromStageName}</span>
                      </div>
                      <div
                        className="text-center workflow-stage-arrow"
                        style={{ fontSize: "40px", color: "#2B55CE" }}
                      >
                        ↓
                      </div>
                      <div
                        className="border rounded-3 p-3 mx-auto" // Use mx-auto to center the div
                        style={{
                          backgroundColor: "#2B55CE",
                          color: "white",
                          width: "150px", // Reduced width
                          maxWidth: "100%" // Ensure it doesn't exceed the parent width
                        }}
                      >
                        <span>{stage.toStageName}</span>
                      </div>
                    </div>

                    {/* Right Side: Details Table */}
                    <div className="col-md-6">
                      <div
                        className="mt-3 p-2"
                        style={{
                          border: "2px solid green",
                          backgroundColor: "#d4edda",
                          borderRadius: "5px",
                          wordWrap: "break-word"
                        }}
                      >
                        <Table striped className="details-table mb-0 w-100">
                          <tbody>
                            <tr>
                              <td>Time :</td>
                              <td className="tital22">{stage.eventTime || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>Actor :</td>
                              <td className="tital22">{stage.employeeName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>Action :</td>
                              <td className="tital22">{stage.userActionName || "N/A"}</td>
                            </tr>
                            <tr>
                              <td>Comments :</td>
                              <td className="tital22">{stage.comments || "N/A"}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Typography>No workflow stages available.</Typography>
              )}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

WorkflowInfo.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initiativesID: PropTypes.number.isRequired // Change to number if initiativesID is a number
};

export default WorkflowInfo;
