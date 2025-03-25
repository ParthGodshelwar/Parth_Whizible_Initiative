import React, { useState, useEffect } from "react";
import { Drawer, Box, IconButton, Typography, Tooltip } from "@mui/material";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react";
import { Close } from "@mui/icons-material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";

const SnoozeDetailsDrawer = ({ open, onClose, initialData, actionType, data, actionID, onSuccess }) => {
  const { natureOfDemand, initiativeCode, initiativeTitle } = data || {};

  const [formData, setFormData] = useState({
    Comments: "",
    NoOfDays: 0 // Initialize NoOfDays to 0
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({}); // Track validation errors

  useEffect(() => {
    if (initialData) {
      setFormData({
        Comments: initialData.Comments || "",
        NoOfDays: initialData.NoOfDays || 0 // Default to 0 if no initial data
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    // Validate input when it's changed
    let validationError = "";

    if (field === "NoOfDays") {
      if (value.trim() === "" || isNaN(Number(value))) {
        validationError = "Number of Days must be a valid number.";
      } else if (Number(value) <= 0) {
        validationError = "Number of Days must be greater than 0.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: validationError
    }));
    setFormData((prevData) => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleSaveClick = async () => {
    if (!formData.Comments) {
      toast.error("Comments should not be left blank.");
      return;
    }
    if (actionID === "1" || actionType === "Snooze") {
      if (!formData.NoOfDays || isNaN(formData.NoOfDays) || formData.NoOfDays <= 0) {
        toast.error("No of Days should be greater than zero.");
        return;
      }
      if (!formData.NoOfDays) {
        toast.error("Number of days should not be left blank.");
        return;
      }
    }

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const userData = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userData?.employeeId;
      const initiativeId = initialData?.initiativeID || initialData?.ideaID || 1;
      const postUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/UpdateInitiativeActiveSnooz`;

      const queryParams = new URLSearchParams({
        InitiativeID: initiativeId,  // Corrected mapping
        UserID: employeeId,
        Comments: formData.Comments,
        NoOfDays: actionType === "Snooze" ? formData.NoOfDays : ""
      }).toString();

      const apiUrl = `${postUrl}?${queryParams}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.put(apiUrl, {}, config);

      if (response.data) {
        setShowDeleteModal(true); // Show confirmation dialog after successful save
        if (onSuccess) {
          onSuccess(); // Trigger refresh
        }
        // Added by Gauri to get response to send mail when save on 10 Mar 2025
        console.log("Send Mail Put Response", response?.data?.data?.listWorkflowActionResponseEntity[0]);
        const emailData = response?.data?.data?.listWorkflowActionResponseEntity[0];
        if (emailData?.message === "Success") {
          await sendActivateSnoozeEmail(emailData);
        }
      } else {
        toast.error("Failed to save Comment.");
      }
    } catch (error) {
      console.error("Error saving Comment:", error);
      toast.error("An error occurred while saving.");
    }
  };

  // Added by Gauri to send mail after save on 10 Mar 2025
  const sendActivateSnoozeEmail = async (emailData) => {
    try {
      const emailUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`;
      const params = {
        fromAddress: emailData.fromAddress,
        toAddress: emailData.toAddress,
        ccAddress: emailData.ccEmailAddress,
        // Changed email formatting by Gauri on 19 Mar 2025
        subject: emailData.subject.replace(/\r\n/g, " "),
        body: emailData.body.replace(/\r\n/g, "<br>"),
        isHtml: 1
      };
      console.log("Sending Email with params:", params);

      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(emailUrl, params, {
        headers: {
          // Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status >= 200 && response.status < 300) {
        if (!response.data || response.data?.message === "Success") {
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

  const fieldWidth = { width: "280px" };
  return (
    <>

      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: "70vw", padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              backgroundColor: "#f5f5f5",
              padding: 1,
              borderRadius: 1
            }}
          >
            <h5>{actionType === "Snooze" ? "Snooze Details" : "Activate Details"}</h5>
            <Tooltip title="Close" arrow>
              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>

          <Box className="py-0">
            <div className="text-end mb-1">
              <PrimaryButton text="Save" onClick={handleSaveClick} />
            </div>

            <div className="col-sm-12 text-end form-group">
              <label className="form-label IM_label">
                (<span style={{ color: "red" }}>*</span> Mandatory)
              </label>
            </div>
            <div className="mb-3">
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4 text-end">
                      <strong>Nature of Initiative:</strong>
                    </div>

                    <div className="col-md-8 text-start">{natureOfDemand || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-4 text-end">
                      <strong>Initiative Code:</strong>
                    </div>

                    <div className="col-md-8 text-start">{initiativeCode || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div className="row">
                    <div className="col-md-4 text-end">
                      <strong>Initiative Title:</strong>
                    </div>

                    <div className="col-md-8 text-start">{initiativeTitle || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <Box
              sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start", gap: 2, marginBottom: "10px" }}
            >
              <Box sx={{ width: "50%" }}>
                <TextField
                  type="text"
                  label={
                    <>
                      Comments <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  multiline
                  rows={2}
                  value={formData.Comments}
                  onChange={(e) => handleInputChange("Comments", e.target.value)}
                  styles={{ dropdown: fieldWidth }}
                />
              </Box>

              {actionType === "Snooze" && (
                <Box sx={{ width: "30%" }}>
                  <TextField
                    label={
                      <>
                        Number of Days <span style={{ color: "red" }}>*</span>
                      </>
                    }
                    type="number"
                    value={formData.NoOfDays}
                    onChange={(e) => handleInputChange("NoOfDays", e.target.value)}
                    error={!!errors.NoOfDays}
                    helperText={errors.NoOfDays}
                    styles={{ dropdown: fieldWidth }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Drawer>

      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirmation",
          subText: `It will '${actionType}' selected initiative(s). Do you want to continue?`
        }}
      >
        <DialogFooter>
          <PrimaryButton
            text="Yes"
            onClick={() => {
              setShowDeleteModal(false);
              onClose();
              toast.success("Saved successfully!"); // Show success message only after confirmation
            }}
          />
          <PrimaryButton
            text="No"
            onClick={() => setShowDeleteModal(false)}
          />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SnoozeDetailsDrawer;


