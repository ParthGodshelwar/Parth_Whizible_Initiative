import { Dropdown, IDropdownOption } from "@fluentui/react";
import React, { useState, useEffect } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import "bootstrap/dist/css/bootstrap.min.css";
import GetINIFlagDetails from "../../hooks/Editpage/GetINIFlagDetails";
import axios from "axios";
import {
  Typography,
  IconButton,
  Divider,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { DatePicker, DayOfWeek } from "@fluentui/react";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

const FlagDrawer = ({ title, isOpen, onClose, id1 }) => {
  const [flagDetails, setFlagDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flagTo, setFlagTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  console.log("FlagDrawer", dueDate);
  useEffect(() => {
    const fetchFlagDetails = async () => {
      if (id1) {
        try {
          const response = await GetINIFlagDetails(id1);
          const data = response?.data?.listInitiativeFlagDetails;
          setFlagDetails(data || []);
          setFlagTo(data[0]?.flagTo || "1");

          setDueDate(data[0]?.dueDate);
          setIsComplete(data[0]?.isComplete);
        } catch (error) {
          console.error("Error fetching flag details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchFlagDetails();
    }
  }, [id1, isOpen]);

  const handleSave = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const accessToken = sessionStorage.getItem("access_token");
    if (!dueDate) {
      toast.error("Due by should not be left blank");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAlerts/FlagInitiative`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            UserID: userdata?.employeeId,
            IdeaID: id1,
            FlagTo: flagTo,
            DueDate: dueDate,
            isComplete: isComplete
          }
        }
      );
      console.error("Error333 ", response?.data?.data?.[0]?.result);
      const result = response?.data?.data?.[0]?.result;
      if (result && result.toLowerCase() === "success") {
        toast.success("Flag saved successfully");
      } else {
        // Show the result message returned from the API
        toast.error(response?.data?.data?.[0]?.result);
      }
      console.log("Save response:", response.data);
    } catch (error) {
      toast.error("Error saving flag details");
      console.error("Error saving flag details:", error);
    }
  };

  const flagOptions = [
    { key: "0", text: "Follow Up" },
    { key: "1", text: "Review" }
  ];

  return (
    <Offcanvas show={isOpen} onHide={onClose} placement="end" style={{ width: "60%" }}>
      <Offcanvas.Body>
        <div id="init_flag_Sec" className="inithistDetails">
          <IconButton onClick={onClose} sx={{ position: "absolute", top: 17, right: 12 }}>
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>
          <Typography variant="h6" gutterBottom style={{ background: "#E7EDF0", width: "100%" }}>
            Flag Tracking Details
          </Typography>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Typography variant="body1">
              <strong>Initiative Name:</strong> <span className="text-danger">{title}</span>
            </Typography>
          </Box>

          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="primary"
              onClick={handleSave}
              style={{ width: "auto", marginLeft: "auto" }}
            >
              Save
            </Button>
          </Box>

          <div>
            {/* {flagDetails?.length > 0 && (
              <p>
                <strong>{flagDetails[0]?.title}</strong>
              </p>
            )} */}
            <div className="init_borderedbox p-3 mb-5">
              Flagging marks an item to remind you that it needs to be followed up. After it has
              been followed up, you can mark it complete.
            </div>
            <div className="row mb-3 form-group">
              <div className="col-sm-4">
                <label htmlFor="Selflagto" className="form-label">
                  Flag To
                </label>
                <FormControl fullWidth>
                  {/* <InputLabel>Flag To</InputLabel> */}
                  <Select
                    id="Selflagto"
                    value={flagTo} // Selected key
                    displayEmpty
                    onChange={(e) => setFlagTo(e.target.value)} // Save key only
                    sx={{
                      height: 40, // Adjust height as needed
                      ".MuiSelect-icon": {
                        top: "calc(50% - 12px)" // Adjust icon position
                      }
                    }}
                  >
                    {/* Dynamically render options */}
                    {flagOptions.map((option) => (
                      <MenuItem key={option.key} value={option.key}>
                        {option.text} {/* Display text as label */}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-sm-4 required">
                <label htmlFor="date_IntKBFromDate" className="form-label">
                  Due by <span style={{ color: "red" }}>*</span>
                </label>

                <DatePicker
                  value={dueDate ? new Date(dueDate) : null} // Ensure it's a Date object
                  onSelectDate={(date) => {
                    if (date) {
                      // Create a new Date object to avoid modifying the original date
                      const newDate = new Date(date);
                      newDate.setDate(newDate.getDate() + 1); // Increase the date by 1

                      const dueDate = newDate.toISOString().split("T")[0]; // Format the date
                      setDueDate(dueDate);
                    } else {
                      setDueDate("");
                    }
                  }}
                  firstDayOfWeek={DayOfWeek.Sunday} // Starting the week on Sunday
                  placeholder="Select a date"
                  styles={{ root: { width: 250 } }} // Adjust width as needed
                />
              </div>
              <div className="col-sm-4">
                <label className="form-label">&nbsp;</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flagcheckcomplete"
                    checked={isComplete}
                    onChange={(e) => setIsComplete(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="flagcheckcomplete">
                    Complete
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FlagDrawer;
