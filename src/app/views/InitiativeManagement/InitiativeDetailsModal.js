import React, { useState, useEffect } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Table } from "react-bootstrap";
import "./InitiativeDetailsModal.css";
import GetInitiativeStageDetails from "../../hooks/GetInitiativeStageDetails/GetInitiativeStageDetails";
import Tooltip from "@mui/material/Tooltip";

const style = {
  // width: "60%", // Set the drawer width to 60%
  padding: "16px", // Add some padding for better spacing
  overflowY: "auto" // Enable vertical scrolling
};

const InitiativeDetailsModal = ({ open, handleClose, initiative, initiativesID }) => {
  const [data, setData] = useState(null);
  console.log("InitiativeDetailsModal", initiative, initiativesID);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetInitiativeStageDetails(
          initiative?.ideaIdPk ? initiative?.ideaIdPk : initiativesID
        );
        console.log("ccccccccccc77", result);
        setData(result?.data?.initiativeStageDetailsEntity[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (initiative?.ideaIdPk || initiativesID) {
      fetchData();
    }
  }, [initiative?.ideaIdPk, initiativesID]);

  const getStatusClass = (stage) => {
    // if (stage.isStageApproved === 1) return "status-approved";
    // if (stage.isCurrentStage === 1) return "status-current";
    // if (stage.isDelayed === 1) return "status-delayed";
    // return "status-default"; // Default if no condition matches

    if (stage.isCurrentStage === 1) {
      if (stage.isDelayed === 1) {
        return "status-delayed";
      }
      return "status-current";
    }
    if (stage.isStageApproved === 1) {
      return "status-approved";
    }
    if (stage.isDelayed === 1) {
      return "status-delayed";
    }
    return "status-default";
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: "70vw", padding: 2, position: "relative" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ backgroundColor: "#f5f5f5" }}
        >
          <Typography variant="h6"> Initiative Details</Typography>
          <IconButton onClick={handleClose}>
            <Tooltip title="Close">
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </Tooltip>
          </IconButton>
        </Box>

        <div className="modal-content">
          <div className="IniDetailsMainContent">
            <div className="IniDetailsDivDesktop py-3 d-lg-block d-none" id="IniDetailsDivDesktop">
              <div className="row">
                <div className="details-main-sec">
                  <div className="d-sec1 px-4">
                    <table className="table details-table1 mb-0">
                      <tbody>
                        <tr>
                          <td>Initiative title&nbsp;:</td>
                          <td className="font-weight-600">{data?.title}</td>
                        </tr>
                        <tr>
                          <td>Initiated on&nbsp;:</td>
                          <td className="font-weight-600">
                            {data?.createdDate
                              ? new Date(data?.createdDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td>Business group&nbsp;:</td>
                          <td className="font-weight-600">{data?.businessGroup || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Organization unit&nbsp;:</td>
                          <td className="font-weight-600">{data?.organizationunit || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="vertical-line"></div>
                  <div className="d-sec2 px-4">
                    <table className="table details-table2 mb-0">
                      <tbody>
                        <tr>
                          <td>Initiative code&nbsp;:</td>
                          <td className="font-weight-600">{data?.initiativeCode || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Nature of Initiative&nbsp;:</td>
                          <td className="font-weight-600">{data?.natureofDemand || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Delivery unit&nbsp;:</td>
                          <td className="font-weight-600">{data?.deliveryUnit || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Delivery team&nbsp;:</td>
                          <td className="font-weight-600">{data?.deliveryTeam || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {/* Legends Title */}
                <Box sx={{ fontWeight: "bold", marginRight: "15px" }}>Legends:</Box>
                <Box
                  className="gridlegends"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end", // Align items to the right
                    alignItems: "center" // Align items vertically in the center
                  }}
                >
                  <Box className="legendList">
                    <span id="lgdClearStage" className="legendSquare lgdGreen"></span>
                    <span className="ms-2">Cleared</span>
                  </Box>
                  <Box className="legendList">
                    <span id="lgdCurrentStage" className="legendSquare lgdYellow"></span>
                    <span className="ms-2">Current</span>
                  </Box>
                  <Box className="legendList">
                    <span id="lgdDelauCurrentStage" className="legendSquare lgdOrng"></span>
                    <span className="ms-2">Delay</span>
                  </Box>
                  <Box className="legendList">
                    <span id="lgdStageNotStartedYet" className="legendSquare lgdGray"></span>
                    <span className="ms-2">Not started yet</span>
                  </Box>
                </Box>
              </Box>
              <div className="d-sec3 px-4 mt-4">
                <Table striped responsive>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>From Stage</th>
                      <th>To Stage</th>
                      <th>Date</th>
                      <th>Approved By</th>
                      <th>Approver List</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.initiativeStageApprovalDetailsEntity?.map((stage, index) => (
                      <tr key={index}>
                        <td>
                          <span className={`status-circle ${getStatusClass(stage)}`}></span>
                        </td>
                        <td>{stage?.fromStage || "N/A"}</td>
                        <td>{stage?.toStage || "N/A"}</td>
                        <td>
                          {stage?.stagePlannedEndDate
                            ? new Date(stage?.stagePlannedEndDate).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                              })
                            : "N/A"}
                        </td>
                        <td>{stage?.approvedBy || "N/A"}</td>
                        <td>{stage?.approverList || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Drawer>
  );
};

export default InitiativeDetailsModal;
