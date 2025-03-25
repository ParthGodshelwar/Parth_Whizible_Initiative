import React, { useState, useEffect, useRef } from "react";
import { Stack, PrimaryButton, TextField, Dropdown } from "@fluentui/react";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";

const EarlyWarnings = ({ riskID, item, initiativesID, statuses, selectedKey, acc }) => {
  const [showForm, setShowForm] = useState(false); // State to toggle between form and table
  const [refetch, setRefetch] = useState(false);
  const [newWarning, setNewWarning] = useState({
    warningStatus: "",
    warning: "",
    warningID: ""
  });
  const [earlyWarningData, setEarlyWarningData] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // State to track which warning is being edited

  // State for the delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warningToDelete, setWarningToDelete] = useState(null);
  const [id, setId] = useState(null);
  // Refs for mandatory fields
  const warningStatusRef = useRef(null);
  const warningRef = useRef(null);

  useEffect(() => {
    const fetchEarlyWarningData = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskEarlyWarningList?RiskID=${riskID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Early Warning Data:", response.data);
        setEarlyWarningData(response.data.data.listRiskEarlyWarning);
      } catch (error) {
        console.error("Error fetching early warning data:", error);
        toast.error("Failed to fetch early warning data.");
      }
    };

    fetchEarlyWarningData();
  }, [refetch, selectedKey]);

  const saveNewWarning = async () => {
    const { warningStatus, warning, warningID } = newWarning;

    // Check if mandatory fields are filled
    if (!warningStatus) {
      toast.error("Warning Status should not be left blank");
      warningStatusRef.current.focus(); // Focus the Warning Status field
      return;
    }
    if (!warning) {
      toast.error("Warning should not be left blank");
      warningRef.current.focus(); // Focus the Warning field
      return;
    }

    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userID = userdata?.employeeId;

    try {
      const token = sessionStorage.getItem("authToken");

      let url; // Declare the url with 'let' since it will change based on the condition
      let method; // Define the method based on editing or adding
      let params = {
        riskID,
        warningID: id, // Ensure the ID is passed in case of edit
        IdeaID: initiativesID,
        WarningStatus: warningStatus,
        strWarning: warning,
        userID
      };
      console.log("warningStatus", params);
      if (editIndex !== null) {
        // For editing an existing warning (PUT request)
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/UpdateEarlyWarning`;
        method = "put"; // Set method to PUT for editing
      } else {
        // For adding a new warning (POST request)
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/PostEarlyWarning`;
        method = "post"; // Set method to POST for adding new warning
      }

      // Send the appropriate request based on the method
      const response = await axios({
        method,
        url,
        params,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });

      // Handle success response
      if (response.status === 200) {
        if (editIndex !== null) toast.success("Early warning updated successfully!");
        else toast.success("Early warning saved successfully!");
        setRefetch(!refetch);
        // Reset the form and UI state
        setNewWarning({ warningStatus: "", warning: "", warningID: "" });
        setShowForm(false);
        setEditIndex(null); // Reset edit index
      }
    } catch (error) {
      console.error("Error saving warning:", error);
      toast.error("Failed to add or update early warning. Please try again.");
    }
  };

  const deleteWarning = (warning) => {
    console.log("warning", warning);
    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    axios
      .delete(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/DeleteRiskEarlyWarnings?EarlyWarningID=${warning.warningID}&UserID=${employeeId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        // Close the modal and delete the warning
        setShowDeleteModal(false);
        setRefetch(!refetch);
        setEarlyWarningData(
          earlyWarningData.filter((item) => item.warningID !== warning.warningID)
        );
        toast.success("Early Warnings deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting warning:", error);
        toast.error("Failed to delete early warning.");
      });
  };

  const handleEdit = (index) => {
    const warningToEdit = earlyWarningData[index];
    console.log("warningID", warningToEdit);
    setId(warningToEdit.warningID);
    setNewWarning({
      warningStatus: warningToEdit.warningStatus,
      warning: warningToEdit.warning,
      warningID: warningToEdit.warningID
    });
    setEditIndex(index); // Set the index of the warning being edited
    setShowForm(true); // Show the form to edit
  };

  const handleDeleteClick = (warning) => {
    setWarningToDelete(warning); // Set the warning to delete
    setShowDeleteModal(true); // Show the delete modal
  };
  console.log("statuses", statuses);
  return (
    <div>
      <Stack horizontal horizontalAlign="end" className="mt-4">
        {acc[0]?.access !== 0 && (
          <>
            {!showForm && (
              <PrimaryButton
                text="Add"
                onClick={() => {
                  if (showForm) {
                    setShowForm(false);
                    setNewWarning({
                      warningStatus: "",
                      warning: "",
                      warningToEdit: ""
                    });
                    setEditIndex(null); // Reset edit index
                  } else {
                    setNewWarning({
                      warningStatus: "",
                      warning: "",
                      warningToEdit: ""
                    });
                    setShowForm(true);
                  }
                }}
              />
            )}
          </>
        )}
      </Stack>

      {showForm && (
        <div className="mt-4">
          <h3 className="mt-4">{editIndex !== null ? "Early Warning" : "Early Warning"}</h3>
          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} className="mt-2">
            {acc[2]?.access !== 0 && <PrimaryButton onClick={saveNewWarning} text="Save" />}
            <PrimaryButton onClick={() => setShowForm(false)} text="Cancel" className="ms-2" />
          </Stack>
          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>

          <Stack horizontal tokens={{ childrenGap: 16 }} verticalAlign="start">
            <Dropdown
              label={
                <span>
                  Warning Status <span style={{ color: "red" }}>*</span>
                </span>
              }
              placeholder="Select Warning Status"
              defaultSelectedKey={newWarning.warningStatus?.toString()}
              options={statuses?.map((item) => ({
                key: item.id,
                text: item.name
              }))}
              onChange={(e, option) => setNewWarning({ ...newWarning, warningStatus: option?.key })}
              styles={{
                root: { minWidth: 200 },
                label: { fontSize: 14 } // Label style for consistency
              }}
            />
            <TextField
              label={
                <span>
                  Warning <span style={{ color: "red" }}>*</span>
                </span>
              }
              value={newWarning.warning}
              multiline
              onChange={(e, newValue) => setNewWarning({ ...newWarning, warning: newValue })}
              rows={4} // Adjust to control the number of visible lines
            />
          </Stack>
        </div>
      )}
      <div className="mt-2">
        <strong>Total Records: {earlyWarningData.length}</strong>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Warning</th>
            <th>Warning Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {earlyWarningData && earlyWarningData.length > 0 ? (
            earlyWarningData.map((warning, index) => (
              <tr key={index}>
                <td>{warning.warning}</td>
                <td>{warning.warningStatus}</td>
                <td>
                  <IconButton onClick={() => handleEdit(index)}>
                    <Tooltip title="Edit">
                      <EditIcon style={{ fontSize: "1rem" }} />
                    </Tooltip>
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(warning)}>
                    <Tooltip title="Delete">
                      <DeleteIcon style={{ fontSize: "1rem" }} />
                    </Tooltip>
                  </IconButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                There are no items to show in this view
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure, you want to delete this record?"
        }}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => warningToDelete && deleteWarning(warningToDelete)}
            text="Yes"
          />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default EarlyWarnings;
