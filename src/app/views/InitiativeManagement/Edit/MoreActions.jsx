import React, { useState } from "react";
import {
  Pivot,
  PivotItem,
  PrimaryButton,
  Dialog,
  Stack,
  Checkbox,
  TooltipHost,
  TextField,
  DatePicker,
  DialogFooter,
  DialogType
} from "@fluentui/react";
import { toast } from "react-toastify";
import { Table, Accordion, Card } from "react-bootstrap";
import Drawer from "@mui/material/Drawer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MoreActions.css";
import RiskDrawer from "./RiskDrawer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ActionDrawer from "./ActionDrawer";
import axios from "axios";

const MoreActions = ({
  initiativesID,
  initiativeActioItems,
  initiativeRisksHeat,
  initiativeRisks,
  prioritizationCheckList,
  setRefetch,
  refetch,
  show,
  acc,
  initiativeDetail      // Passed initiativeDetail to get requestStageId by Gauri on 12 Mar 2025
}) => {
  const [selectedKey, setSelectedKey] = useState("risks");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({});
  const [drawerOpen1, setDrawerOpen1] = useState(false);
  const [drawerData1, setDrawerData1] = useState({});
  const [hoveredComment, setHoveredComment] = useState(null); // State to track hovered cell
  const [tooltip, setTooltip] = React.useState(null);
  const [tooltip1, setTooltip1] = React.useState(null);
  const [tooltip2, setTooltip2] = React.useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteItem1, setDeleteItem1] = useState(null); // State to store item to delete
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen1, setIsDeleteDialogOpen1] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  // Added state for SubmitterId and actionStatus to call alert by Gauri on 12 Mar 2025
  const [SubmitterID, setSubmitterID] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);
  const [requestStageId, setRequestStageId] = useState(null);

  const handlePivotChange = (item) => {
    setSelectedKey(item.props.itemKey);
  };
  const handleDelete = async (item) => {
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;
      // Construct the API URL with riskId and userId
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksDelete?RiskID=${deleteItem.riskID}&UserID=${employeeId}`;

      // Make the DELETE request
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        setRefetch(!refetch);
        console.log("response", response);
        toast.success(`${response.data.data[0].result}`);
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error("Failed to delete risk");
      }
    } catch (error) {
      setRefetch(!refetch);
      console.error("Error deleting risk:", error);
      toast.error("Failed to delete risk");
    }
  };
  const handleDelete1 = async (item) => {
    if (!planToDelete) return;

    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    // Added validation alert by Gauri on 12 Mar 2025
    if (SubmitterID !== employeeId || requestStageId === 10) {
      toast.error("Action Item cannot be deleted");
      handleDeleteCancel1(false);
      return;
    }

    // Added validation alert by Gauri on 12 Mar 2025
    if (actionStatus === 3) {
      toast.error("Action Item can not be deleted, as status is 'closed'");
      handleDeleteCancel1(false);
      return;
    }
    
    // Added validation alert if stage is completed by Gauri on 13 Mar 2025
    if (requestStageId === 10) {
      toast.error("Action Item can not be deleted, as status is 'closed'");
      handleDeleteCancel1(false);
      return;
    }

    try {
      
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteInitiativeActioItemsDeatils?ActionItemID=${planToDelete?.actionID}&UserID=${employeeId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        toast.success(`Action deleted successfully!`);
        setRefetch(!refetch);
        // setRefetch(!refetch);
      } else {
        throw new Error("Failed to delete risk");
      }
    } catch (error) {
      console.error("Error deleting risk:", error);
      toast.error("Failed to delete risk");
    } finally {
      handleDeleteCancel1(false);
      setPlanToDelete(null);
    }
  };
  const renderMatrix = () => {
    const matrixData = initiativeRisksHeat?.data?.listInitiativeRiskMatrixEntity || [];
    const matrixMap = {};

    matrixData.forEach((item) => {
      const key = `${item.probability}-${item.impact}`;
      matrixMap[key] = {
        color: item.color,
        riskCount: item.riskCount,
        probabilityComment: item.probabilityComment
      };
    });

    const probabilities = [1, 2, 3, 4, 5];
    const impacts = [1, 2, 3, 4, 5];

    // Reverse the arrays
    const reversedProbabilities = probabilities.slice().reverse(); // Reverse without mutating original
    const reversedImpacts = impacts.slice(); // Reverse without mutating original

    const getColor = (color) => {
      switch (color) {
        case "red":
          return "#F55D30";
        case "yellow":
          return "#FFFE76";
        case "green":
          return "#03BA28";
        default:
          return "white";
      }
    };

    const handleTooltip = (probability, impact, riskCount) => {
      setTooltip(riskCount);
      setTooltip1(probability);
      setTooltip2(impact);
    };

    const handleMouseLeave = () => {
      setTooltip(null);
    };
    const handleDeleteClick = (item) => {
      setDeleteItem(item); // Store the item to delete
      setIsDeleteDialogOpen(true);
      // Open the delete confirmation dialog
    };
    const handleDeleteClick1 = (item) => {
      setDeleteItem1(item); // Store the item to delete
      setIsDeleteDialogOpen1(true);
      // Open the delete confirmation dialog
    };
    return (
      <div className="matrix-container">
        <div className="matrix-probability-label">
          <span>Probability</span>
        </div>

        <div className="matrix-grid">
          {reversedProbabilities.map((probability) => (
            <div key={`row-${probability}`} className="matrix-row">
              <div className="matrix-cell">
                <span>{probability}</span>
              </div>
              {reversedImpacts.map((impact) => {
                const { color, riskCount, probabilityComment } = matrixMap[
                  `${probability}-${impact}`
                ] || {
                  color: "white",
                  riskCount: "",
                  probabilityComment: ""
                };
                const backgroundColor = getColor(color);

                return (
                  <div
                    key={`${probability}-${impact}`}
                    className="matrix-cell"
                    style={{ backgroundColor, position: "relative" }}
                  >
                    <span
                      className="risk-count"
                      onMouseEnter={() => handleTooltip(probability, impact, riskCount)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {riskCount}
                    </span>

                    {/* Tooltip */}
                    {tooltip1 == probability && tooltip2 == impact && tooltip === riskCount && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "120%",
                          transform: "translateX(-0%)",
                          backgroundColor: "#333",
                          color: "#fff",
                          padding: "5px",
                          borderRadius: "5px",
                          fontSize: "0.9em",
                          whiteSpace: "nowrap",
                          zIndex: 1
                        }}
                      >
                        {probabilityComment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Matrix header for Impact */}
          <div className="matrix-header">
            <div className="matrix-cell" />
            {reversedImpacts.map((impact) => (
              <div key={`header-${impact}`} className="matrix-cell">
                <span>{impact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Move Impact label to the bottom */}
        <div className="matrix-impact-label">
          <span>Impact</span>
        </div>
      </div>
    );
  };

  const renderPercentageBar = (value) => {
    const percentage = Math.max(0, Math.min(100, value));
    return (
      <div className="percentage-bar" style={{ width: `${percentage}%`, backgroundColor: "green" }}>
        {percentage}%
      </div>
    );
  };

  const handleDrawerOpen = (data, index = null) => {
    console.log("drawerData", data);
    setDrawerData(data || {});
    setDrawerOpen(true);
  };
  const handleDrawerOpen1 = (data, index = null) => {
    console.log("first11122", data);
    setDrawerData1(data);
    setDrawerOpen1(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setDrawerData({});
  };
  const handleDrawerClose1 = () => {
    setDrawerOpen1(false);
    setDrawerData1({});
  };
  const handleSave = () => {
    console.log("Saved data:", drawerData);
    handleDrawerClose();
  };
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false); // Close the dialog without deleting
  };
  const handleDeleteCancel1 = () => {
    setIsDeleteDialogOpen1(false); // Close the dialog without deleting
  };
  const handleDeleteClick = (item) => {
    setDeleteItem(item); // Store the item to delete
    setIsDeleteDialogOpen(true);
    // Open the delete confirmation dialog
  };
  const handleDeleteClick1 = (item) => {
    setDeleteItem1(item); // Store the item to delete
    setIsDeleteDialogOpen1(true);
    // Open the delete confirmation dialog
  };
  return (
    <div className="tab-pane py-0" id="Ini_more">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6 text-start">
            <Pivot onLinkClick={handlePivotChange} selectedKey={selectedKey}>
              <PivotItem headerText="Risks" itemKey="risks"></PivotItem>
              {/* <PivotItem headerText="Prioritization checklist" itemKey="prioritization"></PivotItem> */}
              <PivotItem headerText="Action items" itemKey="actionItems"></PivotItem>
            </Pivot>
          </div>
        </div>

        <div className="tab-content">
          {selectedKey === "actionItems" && (
            <div
              id="tbl_moreaction_ActionItems"
              className={`tab-pane py-0 ${selectedKey === "actionItems" ? "active" : ""}`}
            >
              {acc[0]?.access !== 0 && (
                <Stack horizontal horizontalAlign="end" className="pe-2 mb-2">
                  <Tooltip title="Add" placement="top">
                    <span>
                      <PrimaryButton
                        className="me-2"
                        text="Add"
                        onClick={() => handleDrawerOpen1("")}
                      />
                    </span>
                  </Tooltip>
                </Stack>
              )}

              <div className="table-responsive table_wrapper">
                <div className="mt-2 mb-3">
                  <strong>Total Records: </strong>
                  {initiativeActioItems?.data?.listInitiativeActionItemsEntity?.length || 0}
                </div>
                <Table striped bordered hover className="init-stickytable mb-0 table_Documents">
                  <thead>
                    <tr className="sm-wid">
                      <th>Action Item</th>
                      <th>Priority</th>
                      <th>Assigned to</th>
                      <th>Due Date</th>

                      <th>Submitted By </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initiativeActioItems?.data?.listInitiativeActionItemsEntity?.length > 0 ? (
                      initiativeActioItems.data.listInitiativeActionItemsEntity.map(
                        (item, index) => (
                          <tr key={index}>
                            <td>{item.actionItem}</td>
                            <td>{item.priority}</td>
                            <td>{item.responsiblePerson}</td>
                            <td>{new Date(item.expectedEndDate).toLocaleDateString("en-GB")}</td>

                            <td>{item.submittedByName}</td>
                            <td>
                              <div style={{ display: "flex", gap: "5px" }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    onClick={() => {
                                      handleDrawerOpen1(item, index);
                                    }}
                                    size="small"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {acc[1]?.access !== 0 && (
                                  <Tooltip title="Delete">
                                    <IconButton
                                      onClick={() => {
                                        handleDeleteClick1(item);
                                        setPlanToDelete(item);
                                        setSubmitterID(item.submitterID)
                                        setActionStatus(item?.statusID)
                                        setRequestStageId(item?.requestStageID)
                                        console.log("handleDeleteClick1", item);
                                      }}
                                      size="small"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          There are no items to show in this view
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          )}
          {selectedKey === "risks" && (
            <div id="tbl_moreaction_Risks" className="tab-pane active py-0">
              <Stack horizontal horizontalAlign="end" className="pe-2 mb-2">
                <Tooltip title="Add" placement="top">
                  {acc[0]?.access !== 0 && (
                    <span>
                      <PrimaryButton className="me-2" text="Add" onClick={handleDrawerOpen} />
                    </span>
                  )}
                </Tooltip>
                {/* <TooltipHost content="Delete">
        <PrimaryButton className="me-2" text="Delete" />
      </TooltipHost> */}
              </Stack>
              <div className="mt-2 mb-3">
                <strong>Total Records: </strong>
                {initiativeRisks?.data?.listInitiativeRiskEntity?.length || 0}
              </div>
              <div className="table-responsive table_wrapper">
                <Table striped bordered hover className="init-stickytable mb-0 table_Documents">
                  <thead>
                    <tr className="sm-wid">
                      <th style={{ width: "15%" }}>Risks</th> {/* Increased width */}
                      <th>Probability</th>
                      <th>Impact</th>
                      <th style={{ textAlign: "center", width: "20%" }}>Rationale</th>{" "}
                      {/* Reduced width */}
                      <th>Status</th>
                      <th>Identified on</th>
                      <th>Identified by</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {initiativeRisks?.data?.listInitiativeRiskEntity?.length > 0 ? (
                      initiativeRisks.data.listInitiativeRiskEntity.map((item, index) => (
                        <tr key={index}>
                          <td>{item.description}</td>
                          <td>{item.probability}</td>
                          <td>{item.weight}</td>
                          <td>{item.rationale}</td>
                          <td>{item.status}</td>
                          <td>
                            {new Date(item.dateIdentified).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric"
                            })}
                          </td>
                          <td>{item.createdBy}</td>
                          <td>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() => handleDrawerOpen(item, index)}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {acc[1]?.access !== 0 && (
                                <Tooltip title="Delete">
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteClick(item);
                                    }}
                                    size="small"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          {/* Commented and Changed text by Gauri on 17 Feb 2025 */}
                          {/* There are no risks to show */}
                          There are no items to show in this view.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Display total records */}

              <div className="prob-matrix-sec mt-3" id="prob_matrix_sec">
                <div className="risk-heatmap fw-bold mb-3">Risk Heat Map</div>
                {renderMatrix()}
              </div>
            </div>
          )}

          {/* {selectedKey === "prioritization" && (
            <div id="tbl_moreaction_Prioritization" className="tab-pane active py-0">
              <div className="row">
                <div className="col-6">
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Responded By</th>
                          <th>Priority Checklist</th>
                          <th>Priority Rating</th>
                          <th>Stage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prioritizationCheckList?.data?.listInitiativePrioritizationChecklistEntity
                          ?.length > 0 ? (
                          prioritizationCheckList.data.listInitiativePrioritizationChecklistEntity.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.respondedBy}</td>
                                <td>{item.priorityChecklist}</td>
                                <td>{renderPercentageBar(item.priorityRating)}</td>
                                <td>{item.stage}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No Prioritization Checklist Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
                <div className="col-6">
                  <h5>Checklist Categories</h5>
                  <div className="table-responsive table_wrapper">
                    <Table striped bordered hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th>Category Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prioritizationCheckList?.data?.listInitiativeChecklistCategoryEntity
                          ?.length > 0 ? (
                          prioritizationCheckList.data.listInitiativeChecklistCategoryEntity.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>{item.description}</td>
                                <td>{renderPercentageBar(item.weightage)}</td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td colSpan="2" className="text-center">
                              No Checklist Categories Available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>

        <ActionDrawer
          initiativeDetail={initiativeDetail}
          initiativesID={initiativesID}
          open={drawerOpen1}
          onClose={handleDrawerClose1}
          data={drawerData1}
          setDrawerData={setDrawerData1}
          setRefetch={setRefetch}
          refetch={refetch}
          acc={acc}
        />
        <RiskDrawer
          initiativesID={initiativesID}
          open={drawerOpen}
          onClose={handleDrawerClose}
          data={drawerData}
          setDrawerData={setDrawerData}
          setRefetch={setRefetch}
          refetch={refetch}
          acc={acc}
        />
      </div>
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={handleDeleteCancel}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure you want to delete this item?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete} text="Yes" />
          <PrimaryButton onClick={handleDeleteCancel} text="No" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={!isDeleteDialogOpen1}
        onDismiss={handleDeleteCancel1}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure, you want to delete this record?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete1} text="Yes" />
          <PrimaryButton onClick={handleDeleteCancel1} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default MoreActions;
