import React, { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col, Pagination, Tooltip } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import { DatePicker, Dropdown, Label, PrimaryButton, Stack, TextField,  } from "@fluentui/react";
const ActionItems = ({ id }) => {
  const initialState = {
    submittedBy: "",
    status: "",
  };
  const [showForm, setShowForm] = useState(false);
  const [actionItem, setActionItem] = useState("");
  const [submittedOn, setSubmittedOn] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [responsiblePersonOptions, setResponsiblePersonOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [submit, setSubmit] = useState(false);
  const initiativesID = 1;
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const accessToken = sessionStorage.getItem("access_token");
  const [formValues, setFormValues] = useState(initialState);
  const [Created, setCreated] = useState([]);

  const [editMode, setEditMode] = useState(false); 
  const [selectedItemId, setSelectedItemId] = useState(null); // Stores item ID when editing
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [selectedItemID, setSelectedItemID] = useState(null);
  const [auditStatus, setAuditStatus] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [actualEndDate, setActualEndDate] = useState(null);

  useEffect(() => {
    console.log("State updated:", {
      actionItem,
      responsiblePerson,
      priority,
      dueDate,
      status,
      description,
    });
  }, [actionItem, responsiblePerson, priority, dueDate, status, description]);

  useEffect(() => {
    console.log("Checking selectedItemId:", selectedItemId, "Edit Mode:", editMode);
    if (editMode && selectedItemId) {
      console.log("Fetching Action Item Details for ID:", selectedItemId);
      fetchActionItemDetails(); // Make sure this function correctly updates state
    }
  }, [selectedItemId, editMode]);

  const parseAPIDate = (dateStr) => {
    if (!dateStr) return null; // Handle empty values
  
    const [day, month, year] = dateStr.split(" ");
    return new Date(`${month} ${day}, ${year}`); // Convert to "MMM DD, YYYY" format
  };  

  const formatDateTime = (date) => {
    if (!date) return null;
    return date.toISOString().replace("T", " ").split(".")[0]; // Converts to "YYYY-MM-DD HH:MM:SS"
  };

  // Function to parse date from string format
  const parseDate = (dateString) => {
    if (!dateString) return null; // Handle null or undefined
    if (dateString instanceof Date) return dateString; // If already a Date object
  
    const normalizedDateString = dateString.replace(/\s+/g, " ").trim();
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
  
  // Function to format date before saving
  const formatDate = (date) => {
    if (!date) return null; // Ensure null is sent when date is empty
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");   
    // return `${year}-${month}-${day}T00:00:00`; // Preserve local date without time shift
    return `${year}-${month}-${day}`;
};
  
  const payload = {
    submittedOn: formatDateTime(submittedOn),
  };  

  const handleEdit = (item) => {
    console.log("Editing Item Clicked:", item);

    // Commented and Added by Gauri to set the selectedItemId after setting the state on 17 Mar 2025
    // setSelectedItemId(item.actionID || item.ActionItemID || item.id);
    setSelectedItemId(null);        // Reset selectedItemId before setting a new one

    setTimeout(() => {
      setSelectedItemId(item.actionID || item.ActionItemID || item.id);
    }, 0); 
    
    setActionItem(item.actionItem ?? "");
    setResponsiblePerson(item.responsibleEmployeeId ? String(item.responsibleEmployeeId) : "");
    setPriority(item.priorityID ? String(item.priorityID) : "");
    // setSubmittedOn(item.submittedOn ? new Date(item.submittedOn) : null);
    setSubmittedOn(item.submittedOn ? parseAPIDate(item.submittedOn) : null);
    setDueDate(item.dueDate ? new Date(item.dueDate) : "");
    setStatus(item.statusID ? String(item.statusID) : "");
    setActualEndDate(item.actualEndDate ? new Date(item.actualEndDate) : null);

    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteClick = (item) => {
    if (!item || (!item.ActionItemID && !item.id)) {
      toast.error("Error: No valid item found for deletion.");
      return;
    }
  
    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      toast.error("You don't have access.");
      return;
    }
  
    console.log("Deleting Item:", item);
    // setSelectedItemID(item.ActionItemID || item.id);
    // setSelectedItemID(item.ActionItemID || item.actionID || item.id);
    // setSelectedItemID(item.ActionItemID || item.actionID || item.id || null);
    setSelectedItemId(item.ActionItemID || item.actionID || item.id || null);
    console.log("Selected ActionID for Delete:", item.ActionItemID || item.actionID || item.id);
    setAuditStatus(item?.status); // Set the current item's status
    setShowDeleteModal(true); // Open delete confirmation modal
  };

  const handleDateChange = (date, id) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: date
    }));
  };
  
  useEffect(() => {
    fetchDropdownOptions();
  }, []);


  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const initiativesID = 1; // Replace with actual initiativesID
  
    try {
      // Define dropdown field names
      const fieldNames = ["ExternalAction", "actionstatus", "actionpriority"];
      
      // Create API URLs for all dropdowns
      const urls = fieldNames.map(
        (fieldName) =>
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}`
      );
  
      // Fetch all data concurrently using Promise.all
      const responses = await Promise.all(urls.map((url) => fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      })));
  
      // Convert responses to JSON
      const data = await Promise.all(responses.map((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${response.url}`);
        }
        return response.json();
      }));
  
      // Set dropdown options
      // setResponsiblePersonOptions(
      //   data[0]?.data?.listInitiativeDetailDropDownEntity?.map((item) => ({
      //     key: item.id,
      //     text: item.name
      //   })) || []
      // );
      setResponsiblePersonOptions(
        data[0]?.data?.listInitiativeDetailDropDownEntity?.map((item) => ({
          key: String(item.id), // Convert key to String
          text: item.name,
        })) || []
      );
  
      setStatusOptions(
        data[1]?.data?.listInitiativeDetailDropDownEntity?.map((item) => ({
          key: item.id,
          text: item.name
        })) || []
      );
  
      setPriorityOptions(
        data[2]?.data?.listInitiativeDetailDropDownEntity?.map((item) => ({
          key: item.id,
          text: item.name
        })) || []
      );
  
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };
  

  const confirmDelete = async () => {
    // Get the access token from sessionStorage
    const accessToken = sessionStorage.getItem("access_token");
    const userId = userdata?.employeeId;
    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }
    if (!accessToken) {
      toast.error("You don't have access.");
      setShowDeleteModal(false);
      return;
    }
    // console.log("Confirm Delete Clicked - SelectedItemID:", selectedItemID);
    console.log("Confirm Delete Clicked - SelectedItemID:", selectedItemId);

    // if (!selectedItemID) {
    if (!selectedItemId) {
      toast.error("No item selected for deletion.");
      return;
    }
    // const selectedItem = tableData.find((item) => item.ActionItemID === selectedItemID || item.actionID === selectedItemID);
    const selectedItem = tableData.find((item) => item.ActionItemID === selectedItemId || item.actionID === selectedItemId);
    if (auditStatus === "Closed") {
      toast.error(`Action Item '${selectedItem?.actionItem}' cannot be deleted, as status is 'Closed'.`);
      setShowDeleteModal(false);
      return;
    }

    // const accessToken = sessionStorage.getItem("access_token");
    try {
      const response = await fetch(
        // `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/DeleteExternalAuditActionitem?ActionItemID=${selectedItemID}&UserID=${userId}`,
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/DeleteExternalAuditActionitem?ActionItemID=${selectedItemId}&UserID=${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseData = await response.json();
      console.log("Delete API Response:", responseData);

      if (response.ok) {
        toast.success("Action Item Deleted successfully!");
        fetchTableData(); // Refresh the table data
      } else {
        if (responseData.result === "You don't have access") {
          toast.error(responseData.result); // Show the "You don't have access" toast
        } else {
          toast.error(responseData.result || "Failed to delete item.");
        }
      }
    } catch (error) {
      console.error("Error deleting action item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const fetchOptions = async (fieldName, setState) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/getDropdownOptions?IdeaId=${initiativesID}&userID=${employeeId}&fieldName=${fieldName}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      setState(data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditActionitemsList?AuditID=${id}&PageNo=${page}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      const data = await response.json();
      console.log("Updated Table Data:", data); // Log fetched data
      // setTableData(data.data.listAuditActionItemsEntity || []);
      setTableData(
        data.data.listAuditActionItemsEntity.map((item) => ({
          ...item,
          ActionID: item.ActionItemID || item.actionID || item.id || null, // Ensure at least one valid ID
        }))
      );

      setPageCount(data.pageCount || 1);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const fetchActionItemDetails = async () => {
    if (!id || !selectedItemId) {
      console.error("Missing ID:", { id, selectedItemId });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditActionitemsDetail?AuditID=${id}&ActionID=${selectedItemId}`,
        {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
        }
      );

      if (!response.ok) {
        console.error("API request failed:", response.status);
        toast.error("Failed to fetch action item details.");
        return;
      }

      const responseData = await response.json();
      if (!responseData?.data) {
        console.error("No valid data returned.");
        toast.error("No data found.");
        return;
      }

      console.log("Data received:", responseData.data.listExtAuditActionItemDetailsEntity[0]);

      const actionItemDetails = responseData.data.listExtAuditActionItemDetailsEntity[0];
      setActionItem(actionItemDetails.actionItem ?? "");
      setResponsiblePerson(actionItemDetails.responsibleEmployeeId ?? "");
      setPriority(actionItemDetails.priorityID ?? "");
      setDueDate(actionItemDetails.dueDate ? new Date(actionItemDetails.dueDate) : null);
      setStatus(actionItemDetails.statusID ?? "");
      setDescription(actionItemDetails.description ?? "");
      const FormatActualEndDate = actionItemDetails.actualEndDate
        ? new Date(actionItemDetails.actualEndDate.replace(/\.\d+$/, "")) // Remove milliseconds
        : null;
      
      const FormatSubmittedOn = actionItemDetails.submittedOn
        ? new Date(actionItemDetails.submittedOn.replace(/\.\d+$/, "")) // Removes any milliseconds if present
        : null;

      setSubmittedOn(FormatSubmittedOn);
      setActualEndDate(FormatActualEndDate);
      // actualEndDate: parseDate(itemDetails?.actualEndDate),
    } catch (error) {
      console.error("Error fetching action item details:", error);
      toast.error("Failed to fetch action item details.");
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [page]);


  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  // Pagination Handlers
  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Use setPage instead of page()
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Use setPage instead of page()
  };

  const handleAdd = () => {
    setEditMode(false); // Ensure add mode
    setShowForm(true);
    // Clear form fields for a new entry
    setActionItem("");
    setResponsiblePerson("");
    setPriority("");
    setDueDate("");
    setStatus("");
    setDescription("");
    // setSubmittedOn(new Date().toISOString()); // Default current date
    setSubmittedOn(new Date()); // Default current date
  };

  const handleCancel = () => {
    setShowForm(false); // Hide the form when cancel is clicked
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    console.log("Submitting Form:", { actionItem, responsiblePerson, priority, dueDate, status, description });

    if (!actionItem) {
      toast.error("Action Item should not be left blank");
      return;
    }
    if (!responsiblePerson) {
      toast.error("Responsible Person should not be left blank");
      return;
    }
    // Check if Due Date is before Submitted On date
    if (dueDate && submittedOn && new Date(dueDate) < new Date(submittedOn)) {
      toast.error("The 'Due Date' should not be less than 'Submitted On'.");
      return;
    }

    const apiEndpoint = editMode
      ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/UpdExternalAuditActionitemsDetails` // PUT for update
      : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/PostExternalAuditActionitemsDetails`; // POST for new item

    // const payload = {
    //   actionID: editMode ? selectedItemId : 0,  // Ensure actionID is sent when editing
    //   auditID: id,
    //   actionItem,
    //   responsibleEmployeeId: responsiblePerson,
    //   priorityID: priority || null,
    //   dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null, 
    //   statusID: status || null,
    //   description: description || "",
    //   userID: employeeId,
    // };
    const payload = {
      actionID: editMode ? selectedItemId : 0,
      auditID: id,
      actionItem,
      responsibleEmployeeId: responsiblePerson,
      priorityID: priority || null,
      submittedOn: formatDateTime(submittedOn),
      // dueDate: dueDate ? dueDate.toISOString().split("T")[0] : null,
      dueDate: formatDate(dueDate),
      statusID: status || null,
      description: description || "",
      actualEndDate: actualEndDate ? actualEndDate.toISOString().split("T")[0] : null, // Send only if captured
      userID: employeeId,
    };

    console.log("Formatted submittedOn before API:", submittedOn);
    console.log("Formatted API Payload:", payload);

    try {
      const response = await fetch(apiEndpoint, {
        method: editMode ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (response.ok) {
        toast.success(editMode ? "Action Item updated successfully!" : "Action Item saved successfully!");
        setShowForm(false);
        setEditMode(false);
        setSelectedItemId(null);
        fetchTableData(); // Refresh table data
      } else {
        toast.error(responseData.message || "Failed to save Action Item");
      }
    } catch (error) {
      console.error("Error saving Action Item:", error);
      toast.error("An error occurred while saving.");
    }
  };

  useEffect(() => {
    console.log("showForm:", showForm);
  }, [showForm]);

  const inputStyle = {
    width: "100%",
    border: "1px solid #ced4da",

    color: "#495057"
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "250px",
      maxWidth: "350px"
    }
  };

  const fieldStyle = { width: "100%" };
  return (
    <div className="action-items">
      <Row className="mb-3">
        <Col className="text-end">
          {!showForm && (
            <PrimaryButton variant="primary" onClick={handleAdd}>
              Add
            </PrimaryButton>
          )}
        </Col>
      </Row>

      {showForm && (
        <Form key={formKey} onSubmit={handleSubmit} className="mb-4">
          <Row className="mb-3">
            <Col className="text-end">
              <PrimaryButton variant="primary" className="me-2" type="submit">
                Save
              </PrimaryButton>
              <PrimaryButton variant="primary" onClick={handleCancel}>
                Cancel
              </PrimaryButton>
            </Col>
          </Row>
          <div className="col-sm-12 text-end required">
            <label className="IM_label ">
              (<font color="red">*</font> Mandatory)
            </label>
          </div>
          <Row>

            <Col md={4}>
              <Form.Group controlId="actionItem">
                <Form.Label className="required">Action Item</Form.Label>

                <TextField
                  value={actionItem ?? ""}
                  onChange={(e, newValue) => {
                    console.log("Action Item Value:", newValue);
                    setActionItem(newValue);
                  }}
                  placeholder="Enter Action Item"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="submittedOn">
                <Form.Label>Submitted On</Form.Label>
                <DatePicker
                  placeholder="Select Submitted On"
                  value={submittedOn ?? undefined} // Ensure it's a Date object
                  disabled={true} // Disable input for submitted date
                  styles={fieldStyle}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="responsiblePerson">
                <Form.Label>
                  Responsible Person <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Dropdown
                  placeholder="Select Responsible Person"
                  options={responsiblePersonOptions}
                  // selectedKey={responsiblePerson ? responsiblePerson : undefined}
                  selectedKey={responsiblePerson ? String(responsiblePerson) : ""}
                  onChange={(e, option) => {
                    console.log("Responsible Person Selected:", option?.key);
                    setResponsiblePerson(option?.key ?? "");
                  }}
                />

              </Form.Group>

            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Dropdown
                  placeholder="Select Priority"
                  options={priorityOptions}
                  // selectedKey={priority ? String(priority) : undefined}
                  selectedKey={priority ? String(priority) : ""}
                  onChange={(e, option) => {
                    console.log("Priority Selected:", option?.key);
                    setPriority(option?.key || "");
                  }}
                />
              </Form.Group>
            </Col>
      
            <Col md={4}>
              <Form.Group controlId="dueDate">
                <Form.Label>Due Date</Form.Label>
                <DatePicker
                  placeholder="Select Due Date"
                  value={dueDate ?? undefined}
                  onSelectDate={(date) => {
                    setDueDate(date ?? null);
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                {/* <Dropdown
                  placeholder="Select Status"
                  options={statusOptions}
                  // selectedKey={status ?? null}
                  selectedKey={status ? String(status) : ""}
                  onChange={(e, option) => setStatus(option?.key || "")}
                /> */}
                <Dropdown
                  placeholder="Select Status"
                  options={statusOptions}
                  selectedKey={status ? String(status) : ""}
                  onChange={(e, option) => {
                    setStatus(option?.key || "");
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group controlId="actualEndDate">
                <Form.Label>Actual End Date</Form.Label>
                <DatePicker
                  placeholder="Select Actual End Date"
                  // value={actualEndDate ? new Date(actualEndDate) : null}
                  value={actualEndDate ?? undefined}
                  // value={actualEndDate instanceof Date && !isNaN(actualEndDate) ? actualEndDate : null}
                  // onSelectDate={(date) => {
                  //   setActualEndDate(date ?? null);
                  // }}
                  onSelectDate={(date) => handleDateChange("actualEndDate", date)}
                  disabled={true} // Non-editable
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <TextField
                  value={description || ""}
                  multiline
                  rows={3}
                  onChange={(e, newValue) => {
                    console.log("Description:", newValue);
                    setDescription(newValue);
                  }}
                  placeholder="Enter Description"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}

      {!showForm && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Action Item</th>
                <th>Priority</th>
                <th>Responsible Person</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.length > 0 ? (
                tableData.map((item) => (
                  <tr key={item.ActionItemID || item.actionID || item.id}>
                    <td>{item.actionItem}</td>
                    <td>{item.priority}</td>
                    <td>{item.responsiblePerson}</td>
                    <td>{item.status}</td>
                    <td>
                      <IconButton size="small" onClick={() => handleEdit(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton size="small"
                        onClick={() => {
                          handleDeleteClick({ ActionItemID: item.ActionItemID || item.actionID });
                          setAuditStatus(item?.status);
                          setShowDeleteModal(true);
                        }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    There are no items to show in this view.
                  </td>
                </tr>
              )}
            </tbody>

          </Table>


          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <IconButton onClick={handlePreviousPage} disabled={page === 1}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
            <IconButton onClick={handleNextPage}
              disabled={tableData.length < 5} // Disable if less than 5 entries
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          {/* Confirmation Dialog */}
          <Dialog
            hidden={!showDeleteModal}
            onDismiss={() => setShowDeleteModal(false)}
            dialogContentProps={{
              type: "normal",
              title: "Confirm Delete",
              subText: "Are you sure you want to delete this record?",
            }}
          >
            <DialogFooter>
              <PrimaryButton onClick={confirmDelete} text="Yes" />
              <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
            </DialogFooter>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ActionItems;
