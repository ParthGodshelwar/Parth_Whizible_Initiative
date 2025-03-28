import React, { useState } from "react";
import {
  Drawer,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@fluentui/react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import axios from "axios";

const ResubmitDrawer = ({ title, initiativeId, isOpen, onClose, setRefresh12 }) => {
  const initialState = {
    Comment: ""
  };
  const [formValues, setFormValues] = useState(initialState);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [comments, setComments] = useState(""); 

  const handleInputChange = (e, option = {}) => {
    const fieldId = e.target.id || e.target.name; // Use name if id is not available
    const value = option.key ? option.key : e.target.value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  const handleDialogOpen = () => {
    if (!comments) {
      toast.error("Comment should not be left blank.");
      return; 
    }

    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleResubmit = async () => {
    
    try {
      const token = sessionStorage.getItem("access_token");
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;

      if (!token) {
        toast.error("Authentication token is missing.");
        return;
      }

      // Prepare the request payload for both PUT
      const putUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ResubmitInitiative?IdeaID=${initiativeId}&UserID=${employeeId}&Comments=${comments}`;
      const putResponse = await axios.put(putUrl, null, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });

      if (putResponse.data) {
        toast.success("Initiative Resubmitted successfully.");
        console.log("resubmit putResponse", putResponse?.data?.data[0]);
        const emailData = putResponse?.data?.data[0]; 
        if (emailData?.result === "Success") {
          await sendResubmitEmail(emailData); 
        }
        
        setRefresh12((prev) => !prev);
        onClose();
      } else {
        toast.error("Failed to Resubmit Initiative.");
      }
    } catch (error) {
      console.error("Error saving Resubmit Initiative:", error);
      toast.error("An error occurred while saving.");
    }
  };  

  const sendResubmitEmail = async (emailData) => {
    try {
      const emailUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`;
      const params = {
        fromAddress: emailData.fromEmailID,
        toAddress: emailData.toEmailID,
        ccAddress: emailData.ccEmailID,
        subject: emailData.subject,
        body: emailData.body,
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
  

  return (
    <>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box
          sx={{
            width: { xs: "100%", sm: 600 }, // Set width to 100% for extra-small screens, 600px for small screens and above
            padding: 2
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              backgroundColor: "#e7edf0",
              padding: "0 10px"
            }}
          >
            <h6 className="mb-0">Resubmit Details</h6>
            <IconButton onClick={onClose}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          {/* Save Button */}
          <Box sx={{ display: "flex", justifyContent: "end", marginBottom: 2 }}>
            <PrimaryButton onClick={handleDialogOpen}>Save</PrimaryButton>
          </Box>

          {/* Resubmit and Maha Metro Pune */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f5f5f5",
              padding: 1,
              borderRadius: 1,
              marginBottom: 2
            }}
          >
            <span style={{ fontWeight: "bold" }}>Resubmit</span>
            <span style={{ fontWeight: "bold", color: "#0078d4" }}>{title}</span>
          </Box>

          {/* Comment Field */}
          <Box>
            <Label htmlFor="Comment" className="required">
              Comment
            </Label>
            <TextField
              id="Comment"
              multiline
              rows={2}
              style={{ minWidth: "400px" }}
              // value={formValues.Comment}
              value={comments}
              // onChange={handleInputChange}
              onChange={(e) => setComments(e.target.value)}
            />
          </Box>
        </Box>
      </Drawer>

      {/* Confirmation Dialog */}
      {/* DialogContentText Changed By Madhuri.K On 13-Dec-2024 */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>This action will resubmit an Initiative. <br></br>
          Press OK to Resubmit an Initiative</DialogContentText>
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={handleResubmit}>OK</PrimaryButton>
          <PrimaryButton onClick={handleDialogClose}>Cancel</PrimaryButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResubmitDrawer;
