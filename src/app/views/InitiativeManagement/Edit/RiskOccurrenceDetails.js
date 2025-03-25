import React, { useState, useEffect } from "react";
import { Stack, PrimaryButton, TextField } from "@fluentui/react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { DatePicker, DayOfWeek } from "@fluentui/react";

const RiskOccurrenceDetails = ({ riskID, item, initiativesID, selectedKey, acc }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [occurrenceData, setOccurrenceData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [newOccurrence, setNewOccurrence] = useState({
    dateOfOccurrence: "",
    reasonForOccurrence: "",
    actionTaken: "",
    id: ""
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warningToDelete, setWarningToDelete] = useState(null);
  const [editingOccurrence, setEditingOccurrence] = useState(null);

  useEffect(() => {
    const fetchOccurrenceData = async () => {
      try {
        const token = sessionStorage.getItem("authToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskOccurenceList?RiskID=${riskID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        setOccurrenceData(response.data.data.listRiskOccurenceVM);
      } catch (error) {
        console.error("Error fetching risk occurrence data:", error);
        toast.error("Failed to fetch risk occurrence data.");
      }
    };

    fetchOccurrenceData();
  }, [riskID, refetch, selectedKey]);

  const handleEditOccurrence = async (index) => {
    const occurrenceToEdit = occurrenceData[index];
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskOccurenceDetails`,
        {
          params: { OccurenceID: occurrenceToEdit?.riskOccurenceID },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const data = response.data.data.listRiskOccurenceDetails[0];
      console.log("setNewOccurrence", data);
      setNewOccurrence({
        dateOfOccurrence: new Date(data.dateOfOccurence),
        reasonForOccurrence: data.reasonForOccurence,
        actionTaken: data.actionTaken,
        id: data?.riskOccurenceID
      });
      setEditingOccurrence(index);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching occurrence details:", error);
      toast.error("Failed to fetch occurrence details.");
    }
  };

  const saveNewOccurrence = async () => {
    const { dateOfOccurrence, reasonForOccurrence, actionTaken, id } = newOccurrence;

    // Track missing fields
    if (!dateOfOccurrence) {
      toast.error("Date of Occurrence should not be left blank");
      return;
    }

    if (!reasonForOccurrence) {
      toast.error("Reason for Occurrence should not be left blank");
      return;
    }

    if (!actionTaken) {
      toast.error("Action Taken should not be left blank");
      return;
    }

    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userID = userdata?.employeeId;

    try {
      const token = sessionStorage.getItem("authToken");

      if (id) {
        // Update existing occurrence
        await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/UpdateRiskOccurence`,
          null,
          {
            params: {
              RiskOccurenceID: id,
              RiskId: riskID,
              IdeaID: initiativesID,
              ReasonForOccurence: reasonForOccurrence,
              ActionTaken: actionTaken,
              DateOfOccurence: dateOfOccurrence,
              UserID: userID
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        toast.success("Risk occurrence updated successfully!");
      } else {
        // Create a new occurrence
        await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/PostRiskOccurence`,
          null,
          {
            params: {
              riskID,
              IdeaID: initiativesID,
              ReasonForOccurence: reasonForOccurrence,
              ActionTaken: actionTaken,
              DateOfOccurence: dateOfOccurrence,
              userID
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        toast.success("Risk occurrence saved successfully!");
      }

      setRefetch(!refetch);
      setModalVisible(false);
      setNewOccurrence({ dateOfOccurrence: "", reasonForOccurrence: "", actionTaken: "", id: "" });
    } catch (error) {
      console.error("Error saving occurrence:", error);
      toast.error("Failed to save risk occurrence. Please try again.");
    }
  };

  const openDeleteModal = (index) => {
    setWarningToDelete(index);
    setShowDeleteModal(true);
  };

  const deleteOccurrence = async (index) => {
    const occurrenceToDelete = occurrenceData[warningToDelete];
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    try {
      const token = sessionStorage.getItem("authToken");
      await axios.delete(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/DeleteRisksOccurence`,
        {
          params: {
            UserID: userdata?.employeeId,
            OccurenceID: occurrenceToDelete?.riskOccurenceID
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const updatedData = occurrenceData.filter((_, i) => i !== warningToDelete);
      setOccurrenceData(updatedData);
      setRefetch(!refetch);
      toast.success("Risk occurrence deleted successfully!");
    } catch (error) {
      console.error("Error deleting occurrence:", error);
      toast.error("Failed to delete risk occurrence. Please try again.");
    }
    setShowDeleteModal(false);
  };

  return (
    <div>
      {!modalVisible && (
        <Stack horizontal horizontalAlign="end" className="mt-4">
          {acc[2]?.access !== 0 && (
            <>
              <PrimaryButton
                text="Add"
                onClick={() => {
                  setModalVisible(true);
                  setNewOccurrence({
                    dateOfOccurrence: "",
                    reasonForOccurrence: "",
                    actionTaken: "",
                    id: ""
                  });
                }}
              />
            </>
          )}
        </Stack>
      )}
      {modalVisible && (
        <div style={{ marginTop: "20px" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Risk Occurrence</h3>
          </div>
          <form>
            <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} className="mt-2">
              {acc[2]?.access !== 0 && <PrimaryButton onClick={saveNewOccurrence} text="Save" />}
              <PrimaryButton onClick={() => setModalVisible(false)} text="Cancle" />
            </Stack>
            <div className="col-sm-12 text-end form-group">
              <label className="form-label IM_label">
                (<span style={{ color: "red" }}>*</span> Mandatory)
              </label>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
              <div>
                {/* <label style={{ marginBottom: "10px", display: "block" }}>
                  Date of Occurrence <span style={{ color: "red" }}>*</span>
                </label> */}

                <DatePicker
                  label={
                    <span>
                      Date of Occurrence <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={
                    newOccurrence.dateOfOccurrence ? new Date(newOccurrence.dateOfOccurrence) : null
                  } // Ensure it's a Date object
                  onSelectDate={(date) => {
                    if (date) {
                      // Adjust for time zone offset to ensure correct date display
                      const adjustedDate = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                      );
                      setNewOccurrence({
                        ...newOccurrence,
                        dateOfOccurrence: adjustedDate
                      });
                    } else {
                      setNewOccurrence({
                        ...newOccurrence,
                        dateOfOccurrence: null // Handle null case if no date is selected
                      });
                    }
                  }}
                  firstDayOfWeek={DayOfWeek.Sunday} // Set Sunday as the start of the week
                  placeholder="Select a date"
                  styles={{ root: { width: 250 } }} // Ensure the field has appropriate width
                />
              </div>
              <div>
                <TextField
                  label={
                    <span>
                      Reason for Occurrence <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={newOccurrence.reasonForOccurrence}
                  multiline
                  styles={{ root: { width: 250 } }}
                  onChange={(e) =>
                    setNewOccurrence({ ...newOccurrence, reasonForOccurrence: e.target.value })
                  }
                />
              </div>
              <div>
                <TextField
                  label={
                    <span>
                      Action Taken <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  multiline
                  value={newOccurrence.actionTaken}
                  onChange={(e) =>
                    setNewOccurrence({ ...newOccurrence, actionTaken: e.target.value })
                  }
                  styles={{ root: { width: 250 } }}
                />
              </div>
            </div>
          </form>
        </div>
      )}
      <div className="mt-2">
        <strong>Total Records: {occurrenceData?.length}</strong>
      </div>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Date of Occurrence</th>
            <th>Reason for Occurrence</th>
            <th>Action Taken</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {occurrenceData && occurrenceData.length > 0 ? (
            occurrenceData.map((occurrence, index) => (
              <tr key={index}>
                <td>{new Date(occurrence.dateOfOccurence).toLocaleDateString("en-GB")}</td>
                <td>{occurrence.reasonForOccurence}</td>
                <td>{occurrence.actionTaken}</td>
                <td>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => handleEditOccurrence(index)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => openDeleteModal(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
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
          <PrimaryButton onClick={() => deleteOccurrence(warningToDelete)} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RiskOccurrenceDetails;
