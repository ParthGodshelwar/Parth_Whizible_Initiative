import React, { useEffect, useState } from "react";
import { Box, Drawer, Grid, Tooltip, Typography } from "@mui/material";
import { IconButton, PrimaryButton, Stack, TextField } from "@fluentui/react";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import axios from "axios";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import PropTypes from "prop-types";

const CommentDrawer = ({ open, onClose, initiativesID, actionID, fetchIniStatusList, page }) => {
  const [comments, setComments] = useState("");
  const [numDays, setNumDays] = useState("0");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleModalOpen = () => {
    if (actionID === "1") {
      // For Action ID 1, validate comments and numDays
      if (!numDays) {
        toast.error("Number of days should not be left blank.");
        return;
      }
      if (numDays <= 0) {
        toast.error("No of Days should be greater than zero.");
        return;
      }
      if (!comments) {
        toast.error("Comment should not be left blank.");
        return;
      }
    } else {
      // For other Action IDs, only validate comments
      if (!comments) {
        toast.error("Comment should not be left blank.");
        return;
      }
    }

    // If all validations pass, show confirmation modal
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    console.log("Initiatives ID:", initiativesID);

    try {
      // Prepare the request payload or query parameters
      const token = sessionStorage.getItem("access_token");
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;

      if (!token) {
        toast.error("Authentication token is missing.");
        return;
      }

      const postUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeStatusManagement/PostInitiativesStatusManagement`;
      const queryParams = new URLSearchParams({
        IdeaID: initiativesID, // Replace with actual ID if available
        Comment: comments,
        UserId: employeeId, // Replace with the actual user ID if dynamic
        Flag: actionID,
        // NoOfDays: actionID === "1" ? numDays : 1,
        ...(actionID === "1" && { NoOfDays: numDays }) // Add numDays only if actionID is 1
      }).toString();

      const response = await axios.post(`${postUrl}?${queryParams}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data) {
        toast.success("Comment saved successfully.");

        // Added by Gauri to send mail after save on 05 Mar 2025
        console.log("resubmit putResponse", response?.data?.data[0]);
        const emailData = response?.data?.data[0]; 
        if (emailData?.result === "Success") {
          await sendUpdateActionItemEmail(emailData); 
        }
        onClose();

        // Fetch the updated list data
        fetchIniStatusList(page, { ActionID: actionID });
      } else {
        toast.error("Failed to save Comment.");
      }
    } catch (error) {
      console.error("Error saving Comment:", error);
      toast.error("Error occurred while saving.");
    }
  };

  // Added by Gauri to send mail after save on 05 Mar 2025
  const sendUpdateActionItemEmail = async (emailData) => {
    try {
      const emailUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`;
      const params = {
        fromAddress: emailData.fromEmailID,
        toAddress: emailData.toEmailID,
        ccAddress: emailData.ccEmailID,
        subject: emailData.subject.replace(/\r\n/g, " "),
        body: emailData.body.replace(/\r\n/g, "<br>"),
        isHtml: 1
      };
      console.log("Sending Email with params:", params);

      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(emailUrl, params, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });

      console.log("Email response", response);
  
      if (response.status >= 200 && response.status < 300) {
        if (!response.data || response.data?.result === "Success") {
          toast.success("Email sent successfully!!");
        } else {
          toast.error("Failed to send Email.");
        }
      } else {
        toast.error(`Email failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email.");
    }
  };

  // Returns dynamic offcanvas header as per ActionID
  const getDrawerHeader = (actionID) => {
    switch (actionID) {
      case "1":
        return "Snooze Initiative";
      case "2":
        return "Mark Initiative as Complete";
      case "3":
        return "Withdraw Initiative";
      case "4":
        return "Resubmit Initiative";
      default:
        return "Action";
    }
  };

  // Returns dynamic title for dialogbox as per ActionID
  const getDialogSubText = (actionID) => {
    switch (actionID) {
      case "1":
        return "This action will snooze selected initiative(s) and its linking with other entities will not be available. Press OK to continue.";
      case "2":
        return "This action will mark selected initiative(s) as complete. Press OK to continue.";
      case "3":
        return "This action will withdraw selected initiative(s) and its linking with other entities will not be available. Press OK to continue.";
      case "4":
        return "This action will resubmit selected initiative(s). Press OK to continue.";
      default:
        return "Press OK to continue.";
    }
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px"
    }
  };

  return (
    <div>
      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: "60vw", // Set the width of the drawer paper
            boxSizing: "border-box" // Ensure padding is included in width calculation
          }
        }}
      >
        <Box p={3} width="100%">
          {/* Header Section */}
          <Box sx={{ backgroundColor: "#f5f5f5", padding: "10px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <Typography variant="h6">{getDrawerHeader(actionID)}</Typography>
              <IconButton onClick={onClose}>
                <Tooltip title="Close">
                  <CloseIcon />
                </Tooltip>
              </IconButton>
            </div>
          </Box>

          {/* Divider */}
          {/* <Divider sx={{ margin: "16px 0" }} /> */}

          {/* Save Button */}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <PrimaryButton
              text="Save"
              // className="borderbtnbgblue mb-2"
              onClick={handleModalOpen}
            />
          </Box>
          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>

          {/* Input Fields - Comments and Number of Days */}
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack wrap>
              {actionID == 1 && (
                <Stack.Item grow styles={stackItemStyle}>
                  <TextField
                    // label="Number of Days"
                    label={
                      <>
                        Number of Days <span style={{ color: "red" }}>*</span>
                      </>
                    }
                    type="number"
                    fullWidth
                    value={numDays}
                    onChange={(e) => setNumDays(e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#fff"
                      }
                    }}
                  />
                </Stack.Item>
              )}
            </Stack>

            <Stack>
              <Stack.Item grow styles={stackItemStyle}>
                <TextField
                  label={
                    <>
                      Comment <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  multiline
                  iniStatusData={1}
                  fullWidth
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#fff"
                    }
                  }}
                />
              </Stack.Item>
            </Stack>
          </Stack>
        </Box>

        <Dialog
          hidden={!showConfirmModal}
          onDismiss={() => setShowConfirmModal(false)}
          dialogContentProps={{
            type: DialogType.normal,
            title: "Confirm Save",
            subText: getDialogSubText(actionID)
          }}
        >
          <DialogFooter>
            <PrimaryButton
              text="Ok"
              onClick={() => {
                setShowConfirmModal(false); // Close the dialog
                handleSave(); // Call the save function
              }}
            />
            <PrimaryButton onClick={() => setShowConfirmModal(false)} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </Drawer>
    </div>
  );
};

export default CommentDrawer;
