import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Stack, PrimaryButton, Dropdown, Pivot, PivotItem, TextField } from "@fluentui/react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { DatePicker } from "@fluentui/react";
import RiskOccurrenceDetails from "./RiskOccurrenceDetails";
import {
  Drawer,
  Tabs,
  Tab,
  MenuItem,
  Grid,
  Box,
  Typography,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  Button,
  IconButton
} from "@mui/material";
import { Table } from "react-bootstrap";
import RiskMitigation from "./RiskMitigation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";
import EarlyWarnings from "./EarlyWarnings";
import ContingencyPlanModal from "./ContingencyPlanModal";
import { toast } from "react-toastify";
import ContingencyPlanForm from "./ContingencyPlanModal";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { Close } from "@mui/icons-material";
import { dataGridCellClassNames } from "@fluentui/react-components";
import InitiativeRiskAnalysisGraph from "./InitiativeRiskAnalysisGraph";
import HistorySectionR from "./HistorySectionR";
const RiskDrawer = ({ initiativesID, data, open, onClose, setRefetch, refetch, acc }) => {
  const [selectedKey, setSelectedKey] = useState("details");
  const [dropdownOptions, setDropdownOptions] = useState({
    priorityOptions: [],
    statusOptions: [],
    employeeOptions: [],
    modifiedfield_riskhistory: []
  });
  const [riskCategories, setRiskCategories] = useState([]);
  const [originalPriorities, setOriginalPriorities] = useState([]);
  const [changePriorities, setChangePriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [warningstatus, setWarningstatus] = useState([]);
  const [personResponsibleOptions, setPersonResponsibleOptions] = useState([]);
  const [modifiedfield, setModifiedfield] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [access, setAccess] = useState([]);
  const [contingencyPlanData, setContingencyPlanData] = useState([]);
  const [contingencyPlanData1, setContingencyPlanData1] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const [listRiskRiskAnalysisGraph, setListRiskRiskAnalysisGraph] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warningToDelete, setWarningToDelete] = useState(null);
  const [errors, setErrors] = useState({});

  console.log("setDrawerData", data);
  useEffect(() => {
    fetchDropdownData();
    if (open) {
      fetchGraph();
      fetchRiskDetails();
      fetchContingencyPlans();
    }
  }, [data.riskID, refetch, selectedKey]);
  useEffect(() => {}, [contingencyPlanData, personResponsibleOptions]);

  console.log("data.riskID", data.riskID);
  const fetchDropdownData1 = async (fieldName, setOptionsCallback) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${userID}&FieldName=${fieldName}`,
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
  const fetchDropdownData = async () => {
    const fields = [
      "riskcategory",
      "riskpriority",
      "riskpriority",
      "riskstatus",
      "warningstatus",
      "responsibility",
      "modifiedfield_riskhistory"
    ];
    const ideaID = drawerData?.ideaID || initiativesID;
    try {
      const fetchData = async (field) => {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${ideaID}&userID=${userID}&FieldName=${field}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        return response.data.data.listInitiativeDetailDropDownEntity;
      };
      const results = await Promise.all(fields.map((field) => fetchData(field)));
      setRiskCategories(results[0] || []);
      setOriginalPriorities(results[1] || []);
      setChangePriorities(results[2] || []);
      setStatuses(results[3] || []);
      setWarningstatus(results[4] || []);
      setPersonResponsibleOptions(results[5] || []);
      setModifiedfield(results[6] || []);
      console.log("personResponsibleOptions12", results[3]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };
  useEffect(() => {
    // Fetch data for priorityOptions, statusOptions, and employeeOptions
    fetchDropdownData1("priorityid", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        priorityOptions: [{ key: "", text: "Select" }, ...options] // Adding default "Select" option
      }))
    );

    fetchDropdownData1("actionstatus", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        statusOptions: [{ key: "", text: "Select Modified Field" }, ...options] // Adding default "Select" option
      }))
    );
    fetchDropdownData1("modifiedfield_riskhistory", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        modifiedfield_riskhistory: [{ key: "", text: "Select Modified Field" }, ...options] // Adding default "Select" option
      }))
    );

    fetchDropdownData1("responsibility", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        responsibility: [{ key: "", text: "Select Modified By" }, ...options] // Adding default "Select" option
      }))
    );
  }, []);
  console.log("drawerData11", drawerData);
  console.log("employeeOptions", dropdownOptions);
  const fetchRiskDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksDetails?RiskID=${data.riskID}&UserID=${userID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      setAccess(response.data.data.listRiskSubtabAccessEntity);
      if (response.data.data && response.data.data.listInitiativeRiskDetail.length > 0) {
        console.log("drawerData1111", response.data.data.listInitiativeRiskDetail.length);
        setDrawerData(response.data.data.listInitiativeRiskDetail[0]);
      }
    } catch (error) {
      console.error("Error fetching risk details:", error);
    }
  };
  const fetchContingencyPlans = async () => {
    console.log("fetchContingencyPlans1111");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRisksContingencyPlans?RiskID=${data.riskID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (response.data.data) {
        console.log("listContingencyPlans", response.data.data.listContingencyPlans);
        setContingencyPlanData(response.data.data.listContingencyPlans);
      }
    } catch (error) {
      console.error("Error fetching contingency plans:", error);
    }
  };
  const fetchGraph = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskAnalysisGraph?RiskID=${data.riskID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      setListRiskRiskAnalysisGraph(response.data.data);
      console.log("graph", response.data.data.data);
    } catch (error) {
      console.error("Error fetching risk details:", error);
    }
  };

  const handlePivotChange = (item) => {
    console.log("handlePivotChange", item.props.itemKey);
    setSelectedKey(item.props.itemKey);

    setModalVisible(false);
  };

  const close = () => {
    setDrawerData({});
    onClose();
    setSelectedKey("details");
  };

  const handleDeleteClick = (warning) => {
    setWarningToDelete(warning); // Set the warning to delete
    setShowDeleteModal(true); // Show the delete modal
  };
  const mandatoryFields = [
    "Description",
    "Impact Description",
    "Risk Category",
    "Date Identified",
    "Probability",
    "Impact",
    "Status"
  ];

  const handleSave = async () => {
    console.log("Impact Description", drawerData);

    if (!drawerData?.description) {
      toast.error("Description should not be left blank");
      return;
    }

    if (!drawerData?.notes) {
      toast.error("Impact Description should not be left blank");
      return;
    }

    if (!drawerData?.riskCategoryID) {
      toast.error("Risk Category should not be left blank");
      return;
    }

    if (!drawerData?.status) {
      toast.error("Status should not be left blank");
      return;
    }

    if (!drawerData?.dateIdentified) {
      toast.error("Date Identified should not be left blank");
      return;
    }

    if (!drawerData?.probability) {
      toast.error("Probability should not be left blank");
      return;
    }

    if (!drawerData?.impact) {
      toast.error("Impact should not be left blank");
      return;
    }

    // Validate range for Probability and Impact
    if (drawerData?.probability < 1 || drawerData?.probability > 5) {
      toast.error("Probability should have values in the range of (1-5).");
      return;
    }

    if (drawerData?.impact < 1 || drawerData?.impact > 5) {
      toast.error("Impact should have values in the range of (1-5).");
      return;
    }

    // Validate range for Probability and Impact
    const invalidFields = [];
    if (drawerData?.probability < 1 || drawerData?.probability > 5) {
      invalidFields.push("Probability");
    }
    if (drawerData?.impact < 1 || drawerData?.impact > 5) {
      invalidFields.push("Impact");
    }

    if (invalidFields.length > 0) {
      toast.error(`${invalidFields.join(", ")} should have values in the range of (1-5).`);
      return;
    }

    console.log("drawerData00000", drawerData);
    const dataToSave = {
      riskId: drawerData?.riskID || 0,
      ideaID: drawerData?.ideaID || initiativesID,
      dateIdentified: new Date(drawerData?.dateIdentified).toISOString(),
      userID: userID,
      requestStage: parseInt(sessionStorage.getItem("RequestStageID"), 10),
      riskCategory: parseInt(drawerData?.riskCategoryID, 10),
      severity: drawerData?.magnitude?.toString(),
      probability: drawerData?.probability,
      weight: drawerData?.impact,
      originalPriority: drawerData?.originalPriority,
      changePriority: drawerData?.changePriority,
      status: drawerData?.status,
      personResponsible: drawerData?.personResponsible,
      description: drawerData?.description,
      notes: drawerData?.notes,
      requestStage: drawerData?.requestStageID
    };

    // Determine the endpoint and method
    const endpoint = drawerData?.riskID
      ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/UpdateInitiativeRisk`
      : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/PostInitiativeRisk`;

    try {
      const response = await axios.post(endpoint, dataToSave, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });

      // Handle response
      const result = response?.data?.data?.[0]?.result;
      if (result === null || result.toLowerCase() === "success") {
        // Success case
        toast.success(
          drawerData?.riskID ? "Risk updated successfully!" : "Risk saved successfully!"
        );
        setRefetch(!refetch);
        setAccess([]);
        onClose();
        setDrawerData(null);
      } else {
        // Error case, show result from API
        toast.error(result || "An error occurred while saving the risk occurrence.");
      }
    } catch (error) {
      console.error("Error saving risk occurrence:", error);
      toast.error("An error occurred while saving the risk occurrence.");
    }
  };

  const deleteWarning = (warning) => {
    console.log("warning", warning);
    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    axios
      .delete(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/DeleteRisksContingencyPlan?ContingencyPlanID=${warning.contingencyPlanID}&UserID=${employeeId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        // Close the modal and delete the warning
        setShowDeleteModal(false);
        setRefetch(!refetch);
        toast.success("Contingency Plan deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting warning:", error);
        toast.error("Failed to delete early warning.");
      });
  };
  const getLabel = (label) => {
    const isMandatory = mandatoryFields.includes(label);
    return (
      <span>
        {label}
        {isMandatory && <span style={{ color: "red" }}> *</span>}
      </span>
    );
  };
  console.log("drawerData00000", drawerData);
  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <div className="drawer-content p-4" style={{ width: "70vw", padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            padding: 2,
            backgroundColor: "#f5f5f5",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2
          }}
        >
          <h5 className="drawer-title">Risk Details</h5>
          <IconButton onClick={() => close()}>
            <Close />
          </IconButton>
        </Box>
        <Pivot onLinkClick={handlePivotChange} selectedKey={selectedKey}>
          <PivotItem headerText="Details" itemKey="details">
            <div>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                {acc[0]?.access !== 0 && <PrimaryButton onClick={handleSave}>Save</PrimaryButton>}
                <div className="col-sm-12 text-end form-group">
                  <label className="form-label IM_label">
                    (<span style={{ color: "red" }}>*</span> Mandatory)
                  </label>
                </div>
              </Box>

              <form>
                <Stack tokens={{ childrenGap: 16 }} className="mt-4">
                  {/* Group 1: Descriptions */}
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <TextField
                        label={getLabel("Description")}
                        value={drawerData?.description || ""}
                        onChange={(e, newValue) =>
                          setDrawerData({ ...drawerData, description: newValue })
                        }
                        multiline
                        rows={2}
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <TextField
                        label={getLabel("Impact Description")}
                        value={drawerData?.notes || ""}
                        onChange={(e, newValue) => {
                          setDrawerData({ ...drawerData, notes: newValue });
                          // Commented by Gauri to remove error message below field on 07 Feb 2025
                          // setErrors({ ...errors, notes: !newValue }); // Set error if empty
                        }}
                        multiline
                        rows={2}
                        maxRows={2}
                        styles={{ root: { minWidth: 200 } }}
                        errorMessage={errors.notes ? "Impact Description is required." : ""}
                      />
                    </Stack.Item>
                  </Stack>

                  {/* Group 2: Dropdowns and Date */}
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <Dropdown
                        label={getLabel("Risk Category")}
                        placeholder="Select Risk Category"
                        selectedKey={drawerData?.riskCategoryID?.toString()}
                        options={riskCategories.map((item) => ({
                          key: item.id.toString(),
                          text: item.name
                        }))}
                        onChange={(e, option) => {
                          setDrawerData({ ...drawerData, riskCategoryID: option?.key });
                        }}
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        label={getLabel("Status")}
                        placeholder="Select Status"
                        defaultSelectedKey={drawerData?.status?.toString()}
                        options={statuses.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) => {
                          setDrawerData({ ...drawerData, status: option?.key });
                        }}
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <DatePicker
                        label={getLabel("Date Identified")}
                        value={
                          drawerData?.dateIdentified ? new Date(drawerData.dateIdentified) : null
                        }
                        onSelectDate={(newDate) => {
                          if (newDate) {
                            const adjustedDate = new Date(
                              newDate.getTime() - newDate.getTimezoneOffset() * 60000
                            );
                            setDrawerData({
                              ...drawerData,
                              dateIdentified: adjustedDate.toISOString()
                            });
                          } else {
                            setDrawerData({ ...drawerData, dateIdentified: null });
                          }
                        }}
                        placeholder="Select a date"
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                  </Stack>

                  {/* Group 3: Priority and Responsible Person */}
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <Dropdown
                        label={getLabel("Original Priority")}
                        placeholder="Select Original Priority"
                        defaultSelectedKey={drawerData?.originalPriority?.toString()}
                        options={originalPriorities.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setDrawerData({ ...drawerData, originalPriority: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        label={getLabel("Change Priority")}
                        placeholder="Select Change Priority"
                        defaultSelectedKey={drawerData?.changePriority?.toString()}
                        options={changePriorities.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setDrawerData({ ...drawerData, changePriority: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        label={getLabel("Person Responsible")}
                        placeholder="Select Person Responsible"
                        defaultSelectedKey={drawerData?.personResponsible?.toString()}
                        options={personResponsibleOptions.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setDrawerData({ ...drawerData, personResponsible: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                  </Stack>

                  {/* Group 4: Probability, Impact, and Magnitude */}
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <TextField
                        label={getLabel("Probability")}
                        value={drawerData?.probability || ""}
                        onChange={(e, newValue) => {
                          const probability = newValue;
                          const impact = drawerData?.impact || 0;
                          const magnitude = probability * impact; // Calculate magnitude as Probability * Impact
                          setDrawerData({
                            ...drawerData,
                            probability: newValue,
                            magnitude: magnitude // Update magnitude
                          });
                        }}
                        styles={{ root: { minWidth: 200 } }}
                        type="number"
                      />
                    </Stack.Item>

                    <Stack.Item grow>
                      <TextField
                        label={getLabel("Impact")}
                        value={drawerData?.impact || ""}
                        onChange={(e, newValue) => {
                          const impact = newValue;
                          const probability = drawerData?.probability || 0;
                          const magnitude = probability * impact; // Calculate magnitude as Probability * Impact
                          setDrawerData({
                            ...drawerData,
                            impact: newValue,
                            magnitude: magnitude // Update magnitude
                          });
                        }}
                        styles={{ root: { minWidth: 200 } }}
                        type="number"
                      />
                    </Stack.Item>

                    <Stack.Item grow>
                      <TextField
                        label={getLabel("Magnitude")}
                        value={drawerData?.magnitude || ""}
                        disabled
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                  </Stack>
                </Stack>
              </form>

              {data.riskID && (
                <InitiativeRiskAnalysisGraph
                  listRiskRiskAnalysisGraph={listRiskRiskAnalysisGraph}
                />
              )}
            </div>
          </PivotItem>
          {data.riskID && (
            <PivotItem headerText="History" itemKey="history">
              <HistorySectionR dropdownOptions={dropdownOptions} id={data.riskID} />
            </PivotItem>
          )}
          {/* {data.riskID == null && (
            <PivotItem headerText="Contingency Plan" itemKey="contingencyPlan">
              <div>
                <Stack horizontal horizontalAlign="end" className="mt-4">
                  <PrimaryButton text="Add" onClick={() => setModalVisible(true)} />
                </Stack>

                {modalVisible && (
                  <ContingencyPlanForm
                    onClose={() => setModalVisible(false)}
                    riskID={drawerData?.riskID}
                    contingencyPlanData={contingencyPlanData}
                    personResponsibleOptions={personResponsibleOptions}
                  />
                )}
                <div className="mt-2">
                  <strong>Total Records: {contingencyPlanData.length}</strong>
                </div>
                <Table striped bordered hover className="mt-4">
                  <thead>
                    <tr>
                      <th>Contingency Plan</th>
                      <th>Responsibility</th>
                      <th>Date of Plan</th>
                      <th>Duration</th>
                      <th>Work Hours</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contingencyPlanData.map((plan, index) => (
                      <tr key={index}>
                        <td>{plan.contingencyPlan}</td>
                        <td>{plan.responsibility}</td>
                        <td>{plan.dateOfPlan}</td>
                        <td>{plan.expectedDuration}</td>
                        <td>{plan.expectedWork}</td>
                        <td>
                          <IconButton size="small" onClick={() => setModalVisible(true)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(plan)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </PivotItem>
          )} */}
          {/* {data.riskID == null && (
            <PivotItem headerText="Risk Occurrence  Details" itemKey="Risk Occurrence  Details">
              <RiskOccurrenceDetails riskID={drawerData?.riskID} initiativesID={initiativesID} />
            </PivotItem>
          )}
          {data.riskID == null && (
            <PivotItem headerText="Mitigation" itemKey="mitigation">
              <RiskMitigation data={drawerData} />
            </PivotItem>
          )}
          {data.riskID == null && (
            <PivotItem headerText="Early Warnings" itemKey="earlyWarnings">
              <EarlyWarnings data={drawerData} />
            </PivotItem>
          )} */}
          {access.map((item) => {
            const hasViewAccess = access.some(
              (subtab) => subtab.subtagID === item.subtagID && subtab.viewAccess
            );
            return hasViewAccess && data.riskID ? (
              <PivotItem
                headerText={item.subTagName}
                itemKey={item.subtagID.toString()}
                key={item.subtagID}
              >
                {item.subTagName === "Contingency Plans" && (
                  <div>
                    <Stack horizontal horizontalAlign="end" className="mt-4">
                      {acc[0]?.access !== 0 && (
                        <>
                          {!modalVisible && (
                            <PrimaryButton
                              text="Add"
                              onClick={() => {
                                setModalVisible(true);
                                setContingencyPlanData1([]);
                              }}
                            />
                          )}
                        </>
                      )}
                    </Stack>
                    {modalVisible && (
                      <ContingencyPlanForm
                        onClose={() => setModalVisible(false)}
                        riskID={drawerData?.riskID}
                        initiativesID={initiativesID}
                        contingencyPlanData={contingencyPlanData}
                        setContingencyPlanData={setContingencyPlanData}
                        contingencyPlanData1={contingencyPlanData1}
                        personResponsibleOptions={personResponsibleOptions}
                        setRefetch={setRefetch}
                        refetch={refetch}
                      />
                    )}
                    <div className="mt-2">
                      <strong>Total Records: {contingencyPlanData.length}</strong>
                    </div>
                    <Table striped bordered hover className="mt-4">
                      <thead>
                        <tr>
                          <th>Contingency Plan</th>
                          <th>Responsibility</th>
                          <th>Date of Plan</th>
                          <th>Duration</th>
                          <th>Work Hours</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contingencyPlanData && contingencyPlanData.length > 0 ? (
                          contingencyPlanData.map((plan, index) => (
                            <tr key={index}>
                              <td>{plan.contingencyPlan}</td>
                              <td>{plan.responsibility}</td>
                              <td>
                                {plan?.dateOfPlan
                                  ? new Date(plan?.dateOfPlan).toLocaleDateString("en-GB")
                                  : ""}
                              </td>

                              {/* <td>{plan?.dateOfPlan}</td> */}
                              <td>{plan.expectedDuration}</td>
                              <td>{plan.expectedWork}</td>
                              <td>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setModalVisible(true);
                                    setContingencyPlanData1(plan);
                                  }}
                                >
                                  <Tooltip title="Edit">
                                    <EditIcon fontSize="small" />
                                  </Tooltip>
                                </IconButton>
                                {acc[1]?.access !== 0 && (
                                  <IconButton size="small" onClick={() => handleDeleteClick(plan)}>
                                    <Tooltip title="Delete">
                                      <DeleteIcon fontSize="small" />
                                    </Tooltip>
                                  </IconButton>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center">
                              There are no items to show in this view
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                )}
                {item.subTagName === "Risk Occurrence  Details" && (
                  <RiskOccurrenceDetails
                    riskID={drawerData?.riskID}
                    item={item}
                    initiativesID={initiativesID}
                    selectedKey={selectedKey}
                    setRefetch={setRefetch}
                    refetch={refetch}
                    acc={acc}
                  />
                )}
                {item.subTagName === "Mitigation Plans" && (
                  <RiskMitigation
                    riskID={drawerData?.riskID}
                    item={item}
                    initiativesID={initiativesID}
                    personResponsibleOptions={personResponsibleOptions}
                    selectedKey={selectedKey}
                    setRefetch={setRefetch}
                    refetch={refetch}
                    acc={acc}
                  />
                )}
                {item.subTagName === "Early Warnings" && (
                  <EarlyWarnings
                    statuses={warningstatus}
                    riskID={drawerData?.riskID}
                    item={item}
                    initiativesID={initiativesID}
                    selectedKey={selectedKey}
                    setRefetch={setRefetch}
                    refetch={refetch}
                    acc={acc}
                  />
                )}
              </PivotItem>
            ) : null; // Do not render if no view access
          })}
        </Pivot>
      </div>
      {/* <ContingencyPlanModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        riskID={drawerData?.riskID}
        contingencyPlanData={contingencyPlanData}
      /> */}

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
    </Drawer>
  );
};

export default RiskDrawer;
