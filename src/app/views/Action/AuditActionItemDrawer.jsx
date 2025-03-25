import React, { useState, useEffect } from "react";
import {
  Drawer,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import { Stack, TextField, Dropdown, DatePicker } from "@fluentui/react";
import { toast } from "react-toastify";
import axios from "axios";

const AuditActionItemDrawer = ({ open, onClose, itemDetails, activeTab, setRefresh }) => {
  const [dropdownOptions, setDropdownOptions] = useState({
    priorityOptions: [],
    statusOptions: [],
    employeeOptions: []
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [attach, setAttach] = useState(false); // state for upload drawer

  console.log("itemDetails", itemDetails);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [formValues, setFormValues] = useState({});
  // const [refresh, setRefresh] = useState({});
  
  // Date format changed by Gauri on 27 Feb 2025
  const parseDate = (dateString) => {
    if (!dateString) return null; // Handle null or undefined

    if (dateString instanceof Date) {
        return dateString; // If already a Date object, return it as is
    }

    // Added by Gauri to remove spaces from date formats getting from API on 03 Mar 2025
    const normalizedDateString = dateString.replace(/\s+/g, ' ').trim();

    // Regex to match the format: "Oct 17 2024 1:09PM"
    const match = normalizedDateString.match(/([A-Za-z]{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2})(AM|PM)/);

    if (match) {
        const [_, month, day, year, hours, minutes, period] = match;

        const months = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };

        let hour = parseInt(hours, 10);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        return new Date(year, months[month], parseInt(day, 10), hour, parseInt(minutes, 10));
    }

    console.warn("Date parsing failed:", dateString);
    return null; // Return null if parsing fails
};
  // Date format changed by Gauri on 27 Feb 2025
  const formatDate = (date) => {
    if (!date) return null; // Ensure null is sent when date is empty
  
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}T00:00:00`; // Preserve local date without time shift
  };

  console.log("itemDetails", itemDetails);
  useEffect(() => {
    if (itemDetails) {
      setFormValues({
        initiativeTitle: itemDetails?.title,
        stage: itemDetails?.requestStage || "",
        actionItem: itemDetails?.actionItem || "",
        submittedOn: parseDate(itemDetails?.submittedOn),
        assignedTo: String(itemDetails?.assignedToID || ""),
        dueDate: parseDate(itemDetails?.dueDate), 
        priorityID: itemDetails?.priorityID || "",
        statusID: itemDetails?.statusID || "",
        // actualEndDate: itemDetails?.actualEndDate || "",
        actualEndDate: parseDate(itemDetails?.actualEndDate),
        description: itemDetails?.description || ""
      });
    }
  }, [itemDetails]);

  console.log("itemDetails11", formValues);

  const [selectedTab, setSelectedTab] = useState(0);

  const fetchDropdownData = async (fieldName, setOptionsCallback) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=${fieldName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch options for ${fieldName}`);
      }

      const data = await response.json();
      const options = data.data.listInitiativeDetailDropDownEntity.map((item) => ({
        key: item.id,
        text: item.name
      }));
      setOptionsCallback(options);
    } catch (error) {
      console.error(`Error fetching options for ${fieldName}:`, error);
    }
  };

  useEffect(() => {
    /*Modified By Durgesh Dalvi: replace priorityid with actionpriority*/
    fetchDropdownData("actionpriority", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        priorityOptions: options
      }))
    );
    fetchDropdownData("actionstatus", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        statusOptions: options
      }))
    );
    fetchDropdownData("customfieldnumeric1", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        employeeOptions: options
      }))
    );
  }, []);

  const handleInputChange = (field) => (value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value?.target ? value.target.value : value
    }));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDateChange = (date, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: date || null 
    }));
  };
  
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setAttach(false);
  };

  const handleAuditActionSave = async () => {    
    const accessToken = sessionStorage.getItem("access_token");

    // Validate each mandatory field individually
    if (!formValues.actionItem) {
      toast.error("Action Item should not be blank");
      return; // Stop execution if Action Item is missing
    }

    console.log("formValues.assignedTo", formValues.assignedTo);
    if (!formValues.assignedTo) {
      toast.error("Assigned To should not be blank");
      return; // Stop execution if Assigned To is missing
    }

    // Added fields by Gauri for Audit Action Item Update on 27 Feb 2025
    try {
      const payload = {
        ...itemDetails,
        ...formValues,
        employeeId: formValues.assignedToID || formValues.assignedTo,
        priorityID: (formValues.priorityID) ? formValues.priorityID : null,
        statusID: (formValues.statusID) ? formValues.statusID : null,
        responsibleEmployeeId: formValues.assignedToID || formValues.assignedTo,
        submittedOn: formatDate(formValues.submittedOn),
        dueDate: formValues.dueDate ? formatDate(formValues.dueDate) : null,
        actualEndDate: formatDate(formValues.actualEndDate),
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/UpdateAuditActionitemsDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Action Item Updated Successfully!"); // Show success toast        
        setRefresh((prev) => !prev);
        onClose();
      } else {
        toast.error("Failed to save audit action item"); // Show error toast
      }
    } catch (error) {
      toast.error("Error saving audit action item"); // Show error toast
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: "60vw" }}>
      <div style={{ width: 940, padding: 20 }}>
        <div
          className="mb-1"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f5f5f5", // Light grey background
            padding: "10px" // Optional: Adds padding to make it look more balanced
          }}
        >
          <Typography variant="h6">Audit Action Items Details</Typography>
          <Tooltip title="Close">
            <CloseIcon className="IcnStyle" onClick={onClose} />
          </Tooltip>
        </div>
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary">
          <Tab label="Details" sx={{ textTransform: "none" }} />
        </Tabs>

        <Box p={2}>
          {selectedTab === 0 && (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "auto", display: "block" }}
                onClick={handleAuditActionSave}
              >
                Save
              </Button>
              {/*Modified By Durgesh dalvi: To prevent crash after value change in form*/}
              <Stack tokens={{ childrenGap: 16 }}>
                <Stack horizontal tokens={{ childrenGap: 16 }}>
                  <TextField
                    label="Action Item"
                    required
                    value={formValues.actionItem}
                    onChange={handleInputChange("actionItem")}
                    styles={{ root: { width: "30%" } }}
                  />
                  <DatePicker
                    label="Submitted On"
                    value={formValues.submittedOn}
                    // onSelectDate={(date) =>
                    //   setFormValues((prev) => ({ ...prev, dueDate: date })) // ✅ Store as Date object
                    // }
                    onSelectDate={(date) => handleDateChange(date, "submittedOn")}
                    styles={{ root: { width: "30%" } }}
                    disabled={true}
                  />
                  <Dropdown
                    label="Assigned To"
                    required
                    selectedKey={formValues.assignedTo}
                    onChange={(e, option) => handleInputChange("assignedTo")(option.key)}
                    placeholder="Select Assigned To"
                    options={dropdownOptions.employeeOptions}
                    styles={{ root: { width: "30%" } }}
                  />
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 16 }}>
                  <DatePicker
                    label="Due Date"
                    value={formValues.dueDate}
                    // onSelectDate={(date) => handleInputChange("dueDate")(formatDate(date))}
                    onSelectDate={(date) => handleDateChange(date, "dueDate")}
                    styles={{ root: { width: "30%" } }}
                  />
                  <Dropdown
                    label="Priority"
                    selectedKey={String(formValues.priorityID)}
                    onChange={(e, option) => handleInputChange("priorityID")(option.key)}
                    placeholder="Select Priority"
                    options={dropdownOptions.priorityOptions}
                    styles={{ root: { width: "30%" } }}
                  />
                  <Dropdown
                    label="Status"
                    selectedKey={String(formValues.statusID)}
                    onChange={(e, option) => handleInputChange("statusID")(option.key)}
                    placeholder="Select Status"
                    options={dropdownOptions.statusOptions}
                    styles={{ root: { width: "30%" } }}
                  />
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 16 }}>
                  <DatePicker
                    label="Actual End Date"
                    value={parseDate(formValues.actualEndDate)}
                    // onSelectDate={(date) => handleInputChange("actualEndDate")(formatDate(date))}
                    onSelectDate={(date) => handleDateChange(date, "actualEndDate")}
                    styles={{ root: { width: "30%" } }}
                    disabled={true}
                  />
                  <TextField
                    label="Description"
                    value={formValues.description}
                    onChange={handleInputChange("description")}
                    multiline
                    rows={3}
                    styles={{ root: { width: "50%" } }}
                  />
                </Stack>
              </Stack>
            </>
          )}
        </Box>
      </div>
    </Drawer>
  );
};

export default AuditActionItemDrawer;
