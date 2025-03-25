import React, { useState, useEffect } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { Stack } from "@fluentui/react/lib/Stack";
import Drawer from "@mui/material/Drawer";
import { Table } from "react-bootstrap";
import "@fluentui/react/dist/css/fabric.css";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { TextField } from "@fluentui/react/lib/TextField";
import axios from "axios";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import DrawerContent from "./DrawerContent";
import Tooltip from "@mui/material/Tooltip";

const WorkOrder = ({ initiativeWorkOrder, initiativesID, setRefresh1, refresh, show, acc }) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState(
    initiativeWorkOrder?.data?.listInitiativeWorOrderListEntity
      ? initiativeWorkOrder.data.listInitiativeWorOrderListEntity.map(() => false)
      : []
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag to determine if editing an existing work order
  const [formState, setFormState] = useState({
    sowDetailID: "",
    initiativeCode: "", // not editable
    initiativeTitle: "",
    workOrderNo: "", // not editable
    dateOfIssue: null,
    subject: "",
    relationshipManager: "",
    vendor: "", // changed from object to string for select
    seniorManagementInstructions: "",
    background: "",
    approachOverview: "",
    description: ""
  });

  const [vendors, setVendors] = useState([]); // State for vendor options
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [workOrderToDelete, setWorkOrderToDelete] = useState(null);
  // Added by Gauri for handling the isWorkOrderIssued state on 12 Mar 2025
  const [workOrderIssued, setWorkOrderIssued] = useState(null);
  const [isWorkOrderIssued, setIsWorkOrderIssued] = useState(false);
  const cancelDelete = () => {
    setDeleteModalOpen(false); // Close the modal without deleting
  };
  const handleDelete = (workOrder) => {
    setWorkOrderToDelete(workOrder); // Store the work order to delete
    setDeleteModalOpen(true); // Show the delete confirmation modal
  };
  useEffect(() => {
    // Fetch vendors for dropdown
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=vendorid`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        console.log(
          "listInitiativeDetailDropDownEntity",
          response?.data?.data?.listInitiativeDetailDropDownEntity
        );

        // Directly accessing the response data, no need to call response.json()
        const categoryOptions = response.data.data.listInitiativeDetailDropDownEntity.map(
          (vendor) => ({
            key: vendor.id,
            text: vendor.name
          })
        );

        // Set the vendors state with the formatted options
        setVendors(categoryOptions);
      } catch (error) {
        console.error("Failed to fetch vendor options:", error);
      }
    };

    fetchVendors();
  }, []);

  const openDrawer = async (workOrderID) => {
    setIsEditMode(!!workOrderID); // Set edit mode if workOrderID exists

    if (workOrderID) {
      await fetchWorkOrderDetails(workOrderID); // Fetch details before opening
    }

    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setIsEditMode(false); // Reset edit mode
    setIsWorkOrderIssued(false);      // Added by Gauri for handling the isWorkOrderIssued state on 12 Mar 2025
    setFormState({
      sowDetailID: "",
      initiativeCode: "",
      initiativeTitle: "",
      workOrderNo: "",
      dateOfIssue: null,
      subject: "",
      relationshipManager: "",
      vendor: "", // Reset vendor on close
      seniorManagementInstructions: "",
      background: "",
      approachOverview: "",
      description: ""
    });
  };

  const handleFormChange = (field, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: value
    }));
  };

  // Handle change for individual checkboxes
  const handleIndividualChange = (index, checked) => {
    setIndividualChecks((prevChecks) => {
      const updatedChecks = [...prevChecks];
      updatedChecks[index] = checked;
      return updatedChecks;
    });
  };
  const fetchWorkOrderDetails = async (workOrderID) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetWorkOrderDetails?WorkOrderID=${workOrderID}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      const data = response.data.data.listWorkOrderDetails[0];
      console.log("listWorkOrderDetails", response);

      // Added by Gauri for handling the isWorkOrderIssued state on 12 Mar 2025
      const workOrderValue = String(data.isWorkOrderIssued);
      setWorkOrderIssued(workOrderValue);

      // Map API response to formState
      setFormState({
        id: data.sowDetailID || "",
        ideaID: data.ideaID || "",
        sowDetailID: data.sowDetailID || "",
        initiativeCode: data.demandCode || "", // Not editable
        initiativeTitle: data.title || "",
        workOrderNo: data.workOrderNo || "", // Not editable
        dateOfIssue: data.signingDate ? new Date(data.signingDate) : null, // Convert to Date object
        subject: data.location || "",
        relationshipManager: data.detailsModifiedBy || "",
        vendor: data.vendorID?.toString() || "", // Ensure correct format
        seniorManagementInstructions: data.paymentTerms || "",
        background: data.scope || "",
        approachOverview: data.requirements || "",
        description: data.penalty || ""
      });
    } catch (error) {
      console.error("Failed to fetch work order details:", error);
      toast.error("Error fetching work order details.");
    }
  };

  // Added by Gauri for handling the isWorkOrderIssued state on 12 Mar 2025
  useEffect(() => {
    if (isEditMode) {
      setIsWorkOrderIssued(workOrderIssued === "1");
    }
  }, [workOrderIssued, isEditMode]);   

  // API call to save work order details
  const saveWorkOrderDetails = async () => {
    // Function to format the date as dd/MM/yyyy
    const formatDate = (date) => {
      if (!date) return null; // Return null if the date is not valid

      const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad with 0 if needed
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed) and pad with 0
      const year = date.getFullYear(); // Get the full year

      return `${year}-${month}-${day}`;
    };

    console.log("Senior Management Instructions", formState);

    // Check if any required fields are missing
    if (!formState.dateOfIssue) {
      toast.error("Date of Issue should not be left blank.");
      return; // Exit function early
    }

    if (!formState.subject) {
      toast.error("Subject should not be left blank.");
      return; // Exit function early
    }

    if (!formState.vendor) {
      toast.error("Vendor should not be left blank.");
      return; // Exit function early
    }

    const payload = {
      sowDetailID: formState?.sowDetailID || 0, // If sowDetailID exists, use it; otherwise, set it to 0 for new work orders
      initiativeID: initiativesID, // Assuming this is passed as a prop
      dateofIssue: formatDate(formState.dateOfIssue), // Convert to dd/MM/yyyy format
      subject: formState.subject,
      relationManager: formState.relationshipManager,
      vender: Number(formState.vendor), // Use string value directly
      seniorManagementInstructions: formState.seniorManagementInstructions,
      background: formState.background,
      approachOverview: formState.approachOverview,
      instructions: formState.description,
      loggedID: employeeId
    };

    try {
      // Determine whether to use PUT or POST based on whether sowDetailID is available
      const url = formState?.sowDetailID
        ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateWorkOrderList`
        : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostWorkOrderList`;

      const method = formState?.sowDetailID ? "PUT" : "POST"; // Use PUT if sowDetailID is available, otherwise POST

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          "Content-Type": "application/json"
        }
      });

      // Check for success in the response
      const result = response?.data?.data?.[0]?.result;

      if (response.status === 200 && result?.toLowerCase() === "success") {
        if (formState?.sowDetailID) toast.success("Work order updated successfully!");
        else toast.success("Work order saved successfully!"); // Show success toast
        setRefresh1(!refresh);
        closeDrawer(); // Close the drawer after saving
      } else {
        // Handle API error messages
        toast.error(result || "Failed to save the work order. Please try again.");
      }
    } catch (error) {
      console.error("Error saving work order:", error);
      toast.error("Failed to save work order.");
    }
  };

  console.log("listInitiativeDetailDropDownEntity", vendors);
  // const DrawerContent = () => (
  //   <div style={{ width: "70vw", padding: 20 }}>
  //     {/* Close Button */}
  //     <div className="graybg container-fluid py-2 mb-2">
  //       <div className="row">
  //         <div className="col-sm-10">
  //           <h5 className="offcanvasTitle">Work Order</h5>
  //         </div>
  //         <div className="col-sm-2 text-end">
  //           <IconButton onClick={closeDrawer}>
  //         <Tooltip title="Close">

  //           </IconButton>
  //         </div>
  //       </div>
  //     </div>
  //     <div className="col-sm-12 text-end form-group">
  //       <label className="form-label IM_label">( * Mandatory)</label>
  //     </div>
  //     <div className="text-end">
  //       <PrimaryButton text="Save" onClick={saveWorkOrderDetails} />
  //       <PrimaryButton text="Cancel" onClick={closeDrawer} style={{ marginLeft: 8 }} />
  //     </div>
  //     {/* Work Order Detail Fields */}
  //     <div className="form-group row pt-1 mb-3">
  //       {/* Keeping the three-column layout */}
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Initiative Code</label>
  //         <TextField value={formState.initiativeCode} readOnly />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Initiative Title</label>
  //         <TextField
  //           value={formState.initiativeTitle}
  //           onChange={(e) => handleFormChange("initiativeTitle", e.target.value)}
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Work Order No.</label>
  //         <TextField value={formState.workOrderNo} readOnly />
  //       </div>
  //       <div className="col-sm-4 form-group required">
  //         <label className="form-label IM_label text-end">Date of Issue</label>
  //         <DatePicker
  //           onSelectDate={(date) => handleFormChange("dateOfIssue", date)}
  //           value={formState.dateOfIssue}
  //           required
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group required">
  //         <label className="form-label IM_label text-end">Subject</label>
  //         <TextField
  //           value={formState.subject}
  //           onChange={(e) => handleFormChange("subject", e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Relationship Manager</label>
  //         <TextField
  //           value={formState.relationshipManager}
  //           onChange={(e) => handleFormChange("relationshipManager", e.target.value)}
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Vendor</label>
  //         <select
  //           value={formState.vendor}
  //           onChange={(e) => handleFormChange("vendor", e.target.value)}
  //           className="form-select"
  //         >
  //           <option value="">Select Vendor</option>
  //           {vendors.map((vendor) => (
  //             <option key={vendor.id} value={vendor.id}>
  //               {vendor.text}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       {/* Move Senior Management Instructions to new line */}
  //       <div className="col-sm-12 form-group required">
  //         <label className="form-label IM_label text-end">Senior Management Instructions</label>
  //         <TextField
  //           value={formState.seniorManagementInstructions}
  //           onChange={(e) => handleFormChange("seniorManagementInstructions", e.target.value)}
  //         />
  //       </div>

  //       {/* Continue with three-column layout for the remaining fields */}
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Background</label>
  //         <TextField
  //           value={formState.background}
  //           onChange={(e) => handleFormChange("background", e.target.value)}
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Approach Overview</label>
  //         <TextField
  //           value={formState.approachOverview}
  //           onChange={(e) => handleFormChange("approachOverview", e.target.value)}
  //         />
  //       </div>
  //       <div className="col-sm-4 form-group">
  //         <label className="form-label IM_label text-end">Description</label>
  //         <TextField
  //           value={formState.description}
  //           onChange={(e) => handleFormChange("description", e.target.value)}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
  const confirmDelete = async () => {
    if (!workOrderToDelete) return;

    const accessToken = sessionStorage.getItem("access_token");
    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteWorkOrderDetails?WorkOrderID=${workOrderToDelete}&userID=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Check for success in the response
      const result = response?.data?.data?.[0]?.result;

      if (response.status === 200 && result?.toLowerCase() === "success") {
        toast.success("Work order deleted successfully!"); // Success message
        setRefresh1(!refresh); // Trigger refresh for the parent component
        cancelDelete();
      } else {
        setDeleteModalOpen(false);
        toast.error(result || "Failed to delete the work order. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting work order:", error);
      toast.error("Failed to delete work order. Please try again.");
      setDeleteModalOpen(false);
    }
  };
  return (
    <div>
      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-between">
        <div></div>
        {acc[0]?.access !== 0 && (
          <div>
            <PrimaryButton text="Add" onClick={() => openDrawer(null)} style={{ marginLeft: 8 }} />
          </div>
        )}
      </Stack>
      <Table striped bordered hover className="mt-2">
        <thead>
          <tr>
            <th>Work Order No</th>
            <th>Subject</th>
            {/* <th>Location</th> */}
            <th>Date of Issue</th>
            {/* <th>From Date</th>
            <th>To Date</th> */}
            <th>Vendor</th>
            <th align="center">Action</th>
          </tr>
        </thead>
        <tbody>
          {initiativeWorkOrder?.data?.listInitiativeWorOrderListEntity?.length > 0 ? (
            initiativeWorkOrder.data.listInitiativeWorOrderListEntity.map((item, index) => (
              <tr key={index}>
                <td>{item.workOrderNo}</td>
                <td>{item.location}</td>
                <td>
                  {new Date(item.signingDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td>{item.vendorName}</td>
                <td>
                  <IconButton onClick={() => openDrawer(item.sowDetailID)}>
                    <EditIcon />
                  </IconButton>
                  {acc[1]?.access !== 0 && (
                    <IconButton onClick={() => handleDelete(item?.sowDetailID)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                There are no items to show in this view.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Drawer
        anchor="right" // Open the drawer from the right
        open={showDrawer}
        onClose={closeDrawer}
      >
        <DrawerContent
          closeDrawer={closeDrawer}
          saveWorkOrderDetails={saveWorkOrderDetails}
          formState={formState}
          handleFormChange={handleFormChange}
          vendors={vendors}
          acc={acc}
          isWorkOrderIssued={isWorkOrderIssued}
          setIsWorkOrderIssued={setIsWorkOrderIssued}
        />
      </Drawer>
      <Dialog
        open={deleteModalOpen}
        onClose={cancelDelete}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure, you want to delete this record?</DialogContent>
        <DialogActions>
          <PrimaryButton text="Yes" onClick={confirmDelete} />
          <PrimaryButton text="No" onClick={cancelDelete} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkOrder;
