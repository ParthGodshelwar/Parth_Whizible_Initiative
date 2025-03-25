import React, { useState, useEffect } from "react";
import { Stack, PrimaryButton, TextField, Dropdown } from "@fluentui/react";
import { Table, Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { DatePicker, DayOfWeek } from "@fluentui/react";

// Helper function to format date as YYYY-MM-DD
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const RiskMitigation = ({
  riskID,
  item,
  initiativesID,
  personResponsibleOptions,
  selectedKey,
  acc
}) => {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [riskMitigationData, setRiskMitigationData] = useState([]);
  const [newPlan, setNewPlan] = useState({
    dateOfPlan: "",
    responsibility: "",
    action: "",
    responsibilityID: "",
    mitigationPlanID: ""
  });
  const [editingIndex, setEditingIndex] = useState(null); // To track which plan is being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null); // Track which plan to delete
  const [refetch, setRefetch] = useState(false);

  const fetchRiskMitigationData = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskMitigationPlanList?RiskID=${riskID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Risk Mitigation Data:", response.data);
      setRiskMitigationData(response.data.data.listRiskMitigationPlan);
    } catch (error) {
      console.error("Error fetching risk mitigation data:", error);
      toast.error("Failed to fetch risk mitigation data.");
    }
  };

  useEffect(() => {
    fetchRiskMitigationData();
  }, [riskID, refetch, selectedKey]);

  const saveNewPlan = async () => {
    console.log("sessionStorage11", newPlan);
    const { dateOfPlan, responsibilityID, action, mitigationPlanID } = newPlan;

    // Validate required fields
    if (!dateOfPlan) {
      toast.error("Date of Plan should not be left blank");
      return;
    }
    if (!responsibilityID) {
      toast.error("Responsibility should not be left blank");
      return;
    }
    if (!action) {
      toast.error("Action should not be left blank");
      return;
    }

    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userID = userdata?.employeeId;
    const token = sessionStorage.getItem("authToken");
    const IdeaID = initiativesID;

    try {
      const params = {};

      // Add fields to params only if they are not null, undefined, or empty
      if (mitigationPlanID) params.MitigationPlanID = mitigationPlanID;
      if (riskID) params.RiskId = riskID;
      if (IdeaID) params.IdeaID = IdeaID;
      if (responsibilityID) params.Responsibility = responsibilityID;
      if (action) params.Action = action;
      if (dateOfPlan) params.DateOfPlan = dateOfPlan;
      if (userID) params.UserID = userID;

      console.log("mitigationPlanID", newPlan);

      // API Call
      let response;
      if (mitigationPlanID) {
        // Use PUT for updating an existing plan
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/UpdateMitigationPlans`,
          null,
          {
            params,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
      } else {
        // Use POST for creating a new plan
        response = await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/PostMitigationPlans`,
          null,
          {
            params,
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
      }

      // Handle response
      const result = response?.data?.data?.[0]?.result;
      if (result && result.toLowerCase() === "success") {
        // Success case
        setNewPlan({
          dateOfPlan: "",
          responsibility: "",
          action: "",
          mitigationPlanID: ""
        });
        if (mitigationPlanID) toast.success("Mitigation plan updated successfully!");
        else toast.success("Mitigation plan saved successfully!");
        await fetchRiskMitigationData();
        setRefetch(!refetch);
        setIsAddingPlan(false);
      } else {
        // Error case, show result from API
        toast.error(result || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save mitigation plan. Please try again.");
    }
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    console.log("planToDelete", planToDelete);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/DeleteRisksMitigationPlan?ActionID=${planToDelete?.mitigationPlanID}&UserID=${employeeId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        toast.success(`Mitigation Plan deleted successfully!`);
        setRiskMitigationData(
          riskMitigationData.filter((plan) => plan.taskID !== planToDelete.taskID)
        );
        setRefetch(!refetch);
      } else {
        throw new Error("Failed to delete risk");
      }
    } catch (error) {
      console.error("Error deleting risk:", error);
      toast.error("Failed to delete risk");
    } finally {
      setShowDeleteModal(false);
      setPlanToDelete(null);
    }
  };

  const editPlan = async (index) => {
    console.log("newPlan", riskMitigationData[index]);

    const planToEdit = riskMitigationData[index];

    setEditingIndex(index);
    setIsAddingPlan(true);

    try {
      // API call to fetch risk mitigation plan details
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskMitigationPlanDetails?MitigationID=${planToEdit.mitigationPlanID}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const data = response.data.data.listRiskMitigationDetails[0];
      console.log("Fetched Risk Mitigation Plan Details:", response.data);
      setNewPlan({
        responsibility: data.reasonForOccurence,
        action: data.action,
        responsibilityID: data.responsibility,
        mitigationPlanID: data.mitigationPlanID,
        dateOfPlan: data.dateOfPlan // Format date for date input
      });
    } catch (error) {
      console.error("Error fetching risk mitigation plan details:", error);
    }
  };
  console.log("sessionStorage", newPlan, personResponsibleOptions);
  return (
    <div>
      <Stack horizontal horizontalAlign="end" className="mt-4">
        {acc[0]?.access !== 0 && (
          <>
            {!isAddingPlan && (
              <PrimaryButton
                text="Add"
                onClick={() => {
                  setIsAddingPlan(true);
                  setNewPlan({
                    dateOfPlan: "",
                    responsibility: "",
                    action: "",
                    mitigationPlanID: ""
                  });
                }}
              />
            )}
          </>
        )}
      </Stack>
      {isAddingPlan && (
        <div>
          {/* <Stack horizontal horizontalAlign="end" className="mt-4">
            <PrimaryButton text="Back" onClick={() => setIsAddingPlan(false)} />
          </Stack> */}

          <h3 className="mt-4">{editingIndex !== null ? "Mitigation Plan" : "Mitigation Plan"}</h3>
          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} className="mt-2">
            {acc[2]?.access !== 0 && <PrimaryButton onClick={saveNewPlan} text="Save" />}
            <PrimaryButton onClick={() => setIsAddingPlan(false)} text="Cancel" />
          </Stack>
          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>
          <form>
            <Stack horizontal tokens={{ childrenGap: 16 }} className="mt-4">
              <DatePicker
                label={
                  <span>
                    Date Of Plan <span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={newPlan.dateOfPlan ? new Date(newPlan.dateOfPlan) : null} // Ensure it's a Date object
                onSelectDate={(date) => {
                  if (date) {
                    // Adjust for time zone offset
                    const adjustedDate = new Date(
                      date.getTime() - date.getTimezoneOffset() * 60000
                    );
                    setNewPlan({
                      ...newPlan,
                      dateOfPlan: adjustedDate
                    });
                  } else {
                    setNewPlan({
                      ...newPlan,
                      dateOfPlan: null // Handle null case if no date is selected
                    });
                  }
                }}
                firstDayOfWeek={DayOfWeek.Sunday} // Starting the week on Sunday
                placeholder="Select a date"
                styles={{ root: { width: 250 } }} // Adjust width as needed
              />

              <Dropdown
                label={
                  <span>
                    Responsibility <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Select Responsibility"
                defaultSelectedKey={newPlan?.responsibilityID?.toString()}
                options={personResponsibleOptions.map((item) => ({
                  key: item.id,
                  text: item.name
                }))}
                onChange={(e, option) => setNewPlan({ ...newPlan, responsibilityID: option?.key })}
                styles={{ root: { minWidth: 200 } }}
              />
              <TextField
                label={
                  <span>
                    Action <span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={newPlan.action}
                onChange={(e, newValue) => setNewPlan({ ...newPlan, action: newValue })}
                multiline
                rows={4} // You can adjust this value to control the number of visible lines
                styles={{ root: { width: 250 } }}
              />
            </Stack>
          </form>
        </div>
      )}

      <div>
        <div className="mt-2">
          <strong>Total Records: {riskMitigationData.length}</strong>
        </div>
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Action</th>
              <th>Responsibility</th>
              <th>Date of Plan</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riskMitigationData && riskMitigationData.length > 0 ? (
              riskMitigationData.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.action}</td>
                  <td>{plan.responsibility}</td>
                  <td>{new Date(plan.dateOfPlan).toLocaleDateString("en-GB")}</td>
                  <td>
                    <IconButton size="small" onClick={() => editPlan(index)}>
                      <Tooltip title="Edit">
                        <EditIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setPlanToDelete(plan);
                        setShowDeleteModal(true);
                      }}
                    >
                      <Tooltip title="Delete">
                        <DeleteIcon fontSize="small" />
                      </Tooltip>
                    </IconButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  There are no items to show in this view.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}

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
          <PrimaryButton onClick={confirmDeletePlan} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default RiskMitigation;
