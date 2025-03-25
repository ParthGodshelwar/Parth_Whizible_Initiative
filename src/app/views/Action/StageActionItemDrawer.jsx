import React, { useState, useEffect } from "react";
import {
  Drawer,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Stack, TextField, Dropdown, DatePicker } from "@fluentui/react";
import GetInitiativeDocumentList from "app/hooks/Action/GetInitiativeDocumentList";
import "../../style_custom.css";
import DocumentsComponent from "./DocumentsComponent";
import StageActionHistoryDrawer from "./StageActionHistoryDrawer";

// const ActionItemDetailsDrawer = ({ open, onClose, itemDetails, stageActionDetails, activeTab }) => {
const StageActionItemDrawer = ({ open, onClose, itemDetails, activeTab, setRefresh }) => {
  const [dropdownOptions, setDropdownOptions] = useState({
    priorityOptions: [],
    statusOptions: [],
    employeeOptions: []
  });
  const [documentList, setDocumentList] = useState([]); // state for documents
  console.log("itemDetails", itemDetails);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [formValues, setFormValues] = useState({});
  // const parseDate = (dateString) => (dateString ? new Date(dateString) : null);
  // const formatDate = (date) => (date ? date.toISOString().split("T")[0] : "");
  const [refreshDoc, setRefreshDoc] = useState({});
  
  // Date format changed by Gauri on 27 Feb 2025
  const parseDate = (dateString) => {
    if (!dateString) return null; // Handle null or undefined

    if (dateString instanceof Date) {
        return dateString; // If already a Date object, return it as is
    }

    // Added by Gauri to remove spaces from date formats getting from API on 03 Mar 2025
    const normalizedDateString = dateString.replace(/\s+/g, ' ').trim();

    // Updated Regex: "Feb 1 2025 12:00AM"
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
  
  useEffect(() => {
    setFormValues({
      initiativeTitle: itemDetails?.initiativeTitle || "",
      stage: itemDetails?.requestStage || "",
      actionItem: itemDetails?.actionItem || "",
      submittedOn: parseDate(itemDetails?.submittedOn),  
      assignedToID: itemDetails?.assignedToID || "",  // Ensure it's storing the ID
      assignedTo: itemDetails?.assignedTo || "",  // Ensure it's storing the name
      dueDate: parseDate(itemDetails?.dueDate),
      priorityID: itemDetails?.priorityID || "",
      statusID: itemDetails?.statusID || "",
      actualEndDate: parseDate(itemDetails?.actualEndDate),
      description: itemDetails?.description || ""
    });
  }, [itemDetails]);

  console.log("itemDetails11", formValues);

  useEffect(() => {
    const fetchDocumentList = async () => {
      if (itemDetails?.initiativeID) {
        const document = await GetInitiativeDocumentList(itemDetails?.actionID, employeeId);
        setDocumentList(document?.data?.listActionItemDocumentListEntity || []);
      }
    };

    fetchDocumentList();
  }, [refreshDoc, itemDetails?.initiativeID]);

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

  const handleInputChange = (field, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: newValue // Update the specific field in formValues
    }));
  };

  // const handleDateChange = (field, date) => {
  //   if (!date) return; // Avoid setting undefined values
  
  //   setFormValues((prev) => ({
  //     ...prev,
  //     [field]: date.toISOString(), // Convert Date object to ISO format
  //   }));
  // };

  const handleDateChange = (date, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: date || null 
    }));
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleDrawerClose = () => {
    setSelectedTab(0); // Reset selectedTab to 0 when drawer is closed
    onClose();
  };

  const handleStageActionSave = async () => {
    console.log("Edit Save details", itemDetails);
    
    const accessToken = sessionStorage.getItem("access_token");

    // Validate each mandatory field individually
    if (!formValues.actionItem) {
      toast.error("Action Item should not be blank");
      return; // Stop execution if Action Item is missing
    }
    if (!formValues.submittedOn) {
      toast.error("Submitted On should not be blank");
      return; // Stop execution if Submitted On is missing
    }

    console.log("formValues.assignedTo", formValues.assignedTo);
    
    if (!formValues.assignedToID) {
      toast.error("Assigned To should not be blank");
      return; // Stop execution if Assigned To is missing
    }
    if (!formValues.dueDate) {
      toast.error("Due Date should not be blank");
      return; // Stop execution if Due Date is missing
    }
    if (!formValues.statusID) {
      toast.error("Status should not be blank");
      return; // Stop execution if Status is missing
    }
    if (new Date(formValues.submittedOn) >= new Date(formValues.dueDate)) {
      toast.error("The 'Due Date' should not be less than 'Submitted On'");
      return; // Stop execution if Status is missing
    }

    const updatedDetails = {
      ...itemDetails, 
      ...formValues,  
      employeeId: formValues.assignedToID
    };

    // Proceed with the API call if all mandatory fields are filled
    try {
      const payload = {
        ...updatedDetails, 
        expectedEndDate: formValues.dueDate ? formatDate(formValues.dueDate) : null, 
        submittedOn: formValues.submittedOn, 
        dueDate: formValues.dueDate ? formatDate(formValues.dueDate) : null,
        actualDueDate: formValues.actualEndDate ? formatDate(formValues.actualEndDate) : null,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/UpdateActionItemDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Action Item Updated Successfully!"); // Show success toast
        console.log("resubmit putResponse", response?.data?.data?.listEmailActionResponseEntity[0]);
        const emailData = response?.data?.data?.listEmailActionResponseEntity[0]; 
        if (emailData?.result === "Success") {
          await sendUpdateActionItemEmail(emailData); 
        }
        
        setRefresh((prev) => !prev);
        onClose();
      } else {
        toast.error("Failed to save stage action item"); // Show error toast
      }
    } catch (error) {
      toast.error("Error saving stage action item"); // Show error toast
    }
  };
  
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

  return (
    <>
      <Drawer anchor="right" open={open} onClose={handleDrawerClose} sx={{ width: "60vw" }}>
        <div style={{ width: "80vw", padding: 20 }}>
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
            <Typography variant="h6">Stage Action Items Details</Typography>
            <Tooltip title="Close">
              <CloseIcon className="IcnStyle" onClick={handleDrawerClose} />
            </Tooltip>
          </div>

          <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary">
            <Tab label="Details" sx={{ textTransform: "none" }} />
            {activeTab === "stage-action-items" && (
              <Tab label="History" sx={{ textTransform: "none" }} />
            )}
            {activeTab === "stage-action-items" && (
              <Tab label="Upload Document" sx={{ textTransform: "none" }} />
            )}
          </Tabs>

          <Box p={2}>
            {selectedTab === 0 && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStageActionSave}
                  style={{ marginLeft: "auto", display: "block" }}
                >
                  Save
                </Button>

                <Stack tokens={{ childrenGap: 16 }}>
                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    {/* Initiative Title */}
                    <TextField
                      label="Initiative Title"
                      value={formValues.initiativeTitle} // Populate with data
                      onChange={(e) => handleInputChange("initiativeTitle", e.target.value)} // Update value on change
                      styles={{ root: { width: "30%" } }}
                      disabled={true}
                    />

                    {/* Stage */}
                    <TextField
                      label="Stage"
                      value={formValues.stage} // Populate with data
                      onChange={(e) => handleInputChange("stage", e.target.value)} // Update value on change
                      styles={{ root: { width: "30%" } }}
                      disabled={true}
                    />

                    {/* Action Item - Mandatory */}
                    <TextField
                      label={
                        <>
                          Action Item <span style={{ color: "red" }}>*</span>
                        </>
                      } // Display red * for mandatory fields
                      value={formValues.actionItem} // Populate with data
                      onChange={(e) => handleInputChange("actionItem", e.target.value)} // Update value on change
                      styles={{ root: { width: "30%" } }}
                    />
                  </Stack>

                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    <DatePicker
                      label={
                        <>
                          Submitted On<span style={{ color: "red" }}>*</span>
                        </>
                      } // Display red * for mandatory fields
                      // value={parseDate(formValues.submittedOn)} // Populate with data
                      value={formValues.submittedOn} // Populate with data
                      // onSelectDate={(date) => handleDateChange("submittedOn", date)} // Update value on change
                      onSelectDate={(date) => handleDateChange(date, "submittedOn")}
                      styles={{ root: { width: "30%" } }}
                      disabled={true}
                    />

                    {/* Assigned To - Mandatory */}
                    <Dropdown
                      label={
                        <>
                          Assigned To<span style={{ color: "red" }}>*</span>
                        </>
                      }
                      selectedKey={String(formValues.assignedToID)} // Bind to ID
                      onChange={(e, option) => handleInputChange("assignedToID", option.key)} // Store only the ID
                      options={dropdownOptions.employeeOptions}
                      styles={{ root: { width: "30%" } }}
                    />


                    {/* Due Date - Mandatory */}
                    <DatePicker
                      label={
                        <>
                          Due Date <span style={{ color: "red" }}>*</span>
                        </>
                      } // Display red * for mandatory fields
                      value={formValues.dueDate} // Populate with data
                      // onSelectDate={(date) => handleInputChange("dueDate", formatDate(date))} // Update value on change
                      // onSelectDate={(date) => handleDateChange("dueDate", date)} // Update value on change
                      onSelectDate={(date) => handleDateChange(date, "dueDate")}
                      styles={{ root: { width: "30%" } }}
                    />
                  </Stack>

                  <Stack horizontal tokens={{ childrenGap: 16 }}>
                    {/* Priority */}
                    <Dropdown
                      label="Priority"
                      selectedKey={String(formValues.priorityID)} // Populate with data
                      onChange={(e, option) => handleInputChange("priorityID", option.key)} // Update value on change
                      options={dropdownOptions.priorityOptions}
                      styles={{ root: { width: "30%" } }}
                    />

                    {/* Status - Mandatory */}
                    <Dropdown
                      label={
                        <>
                          Status<span style={{ color: "red" }}>*</span>
                        </>
                      } // Display red * for mandatory fields
                      selectedKey={String(formValues.statusID)} // Populate with data
                      onChange={(e, option) => handleInputChange("statusID", option.key)} // Update value on change
                      options={dropdownOptions.statusOptions}
                      styles={{ root: { width: "30%" } }}
                    />

                    {/* Actual Due Date */}
                    {/*Modified By Durgesh: changed actual due date to actual end date & disabled it */}
                    <DatePicker
                      label="Actual End Date"
                      value={parseDate(formValues.actualEndDate)} // Populate with data
                      // onSelectDate={(date) => handleInputChange("actualEndDate", formatDate(date))} // Update value on change
                      onSelectDate={(date) => handleDateChange("actualEndDate", date)} // Update value on change
                      styles={{ root: { width: "30%" } }}
                      disabled={true}
                    />
                  </Stack>

                  {/* Description - Non-mandatory */}
                  <TextField
                    label="Description" // No asterisk for non-mandatory field
                    value={formValues.description} // Populate with data
                    onChange={(e) => handleInputChange("description", e.target.value)} // Update value on change
                    multiline
                    rows={3}
                    styles={{ root: { width: "100%" } }}
                  />
                </Stack>
              </>
            )}
            {selectedTab === 1 && activeTab === "stage-action-items" && (
              <StageActionHistoryDrawer
                actionItemID={itemDetails?.actionID}
              />
            )}
            {selectedTab === 2 && activeTab === "stage-action-items" && (
              <DocumentsComponent
                initiativeDocument={documentList}
                actionItemID={itemDetails?.actionID}
                setRefreshDoc={setRefreshDoc}
                refreshDoc={refreshDoc}
              />
            )}
          </Box>
        </div>
      </Drawer>
    </>
  );
};

export default StageActionItemDrawer;
