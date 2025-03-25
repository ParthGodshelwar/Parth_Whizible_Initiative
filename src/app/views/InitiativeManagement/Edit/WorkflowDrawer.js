import React, { useState, useEffect } from "react";
import { Drawer, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowStages from "./WorkflowStages";
import WorkflowConfiguration from "./WorkflowConfiguration";
import WorkflowApprovers from "./WorkflowApprovers";
import WorkflowForcePush from "./WorkflowForcePush";
import Tooltip from "@mui/material/Tooltip";

const WorkflowDrawer = ({ initiativesID, open, setOpen, initiativesData }) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const [data, setData] = useState([]);
  const employeeId = userdata?.employeeId;
  const handleClose = () => {
    setOpen(false);
  };

  // Function to call the API and log the response
  const fetchWorkflowData = async () => {
    const accessToken = sessionStorage.getItem("access_token"); // Get the access token
    const headers = {
      Authorization: `Bearer ${accessToken}` // Set Authorization header
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetInitiativeManageWorkFlow?IdeaID=${initiativesID}&userID=${employeeId}`,
        { headers }
      );
      setData(response.data);
      console.log("API Response:", response.data); // Log the API response
    } catch (error) {
      console.error("Error fetching workflow data:", error);
    }
  };

  // Use effect to fetch data when the drawer is open
  useEffect(() => {
    if (open) {
      fetchWorkflowData(); // Call the API when the drawer opens
    }
  }, [open]);

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} sx={{ width: "90vw" }}>
      <div style={{ width: "90vw", padding: 20 }}>
        <IconButton
          onClick={handleClose}
          style={{
            position: "absolute",
            top: 30,
            right: 30
          }}
        >
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>

        <div
          style={{
            marginBottom: "16px",
            padding: "8px",
            backgroundColor: "#f5f5f5", // Light grey background
            borderRadius: "8px" // Optional: Add rounded corners for better aesthetics
          }}
        >
          <Typography variant="h6">Manage WorkFlow</Typography>
        </div>

        {/* Content inside the drawer */}
        <div className="tab-pane Initcustmodal page-content bgwhite p-4">
          <WorkflowDetails data={data?.data?.listIniDetailsEntity[0]} />
          <WorkflowStages
            data={data?.data?.listStageDetailsEntity}
            data1={data?.data?.listIniDetailsEntity[0]}
            initiativesData={initiativesData}
            initiativesID={initiativesID}
          />
          <WorkflowConfiguration
            data1={data?.data?.listIniNOIEntity}
            // data2 values passed to this component by Gauri on 05 Feb 2025 
            data2={data?.data?.listIniDetailsEntity[0]}
            initiativesID={initiativesID}
          />
          <WorkflowApprovers
            data={data?.data?.listIniNOIEntity}
            data1={data?.data?.listIniDetailsEntity[0]}
            // data2 values passed to this component by Gauri on 05 Feb 2025 
            data2={data?.data?.listStageDetailsEntity}
            initiativesID={initiativesID}
          />
          {/* Passed data by Gauri for Force push workflow on 20 Mar 2025 */}
          <WorkflowForcePush 
            data={data?.data?.listIniDetailsEntity[0]}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default WorkflowDrawer;
