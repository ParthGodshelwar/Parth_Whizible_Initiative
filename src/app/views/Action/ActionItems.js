import React, { useState, useEffect } from "react";
import { Card, Button, Nav, Table } from "react-bootstrap";
import { TextField, Checkbox } from "@fluentui/react";
// import { TableContainer, TableBody, TableRow, TableCell, TableHead } from "@mui/material";
import GetInitiativeListStageActionItems from "app/hooks/Action/GetInitiativeStageActionItems"; // Update with actual import
import GetInitiativeAuditActionItems from "app/hooks/Action/GetInitiativeAuditActionItems";
import { FaAngleRight } from "react-icons/fa";
import { Drawer, Tabs, Tab } from "@mui/material"; // Importing necessary components for the drawer and tabs
import Typography from "@mui/material/Typography";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
import { Tooltip } from "@mui/material";
import { Box, IconButton } from "@mui/material";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchAdvanceForm from "./SearchAdvanceForm";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import StageActionItemDrawer from "./StageActionItemDrawer";
import AuditActionItemDrawer from "./AuditActionItemDrawer";
import ExportDrawer from "./ExportDrawer"; // Adjust the import path if needed
import { PrimaryButton } from "@fluentui/react";
// Added by Gauri to show note icon on 13 Mar 2025
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "../../style_custom.css";
export default function ActionItems() {
  const initialState = {
    initiativeTitle: "",
    stage: "",
    status: "",
    assignedTo: "",
    submittedBy: "",
    actionItem: "",
    submittedOn: "",
    dueDate: "",
    priority: "",
    description: ""
  };
  const [activeTab, setActiveTab] = useState("stage-action-items");
  const [currentPage, setCurrentPage] = useState(1);
  const [tcurrentPage, setTCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState(initialState);
  const [searchQuery, setSearchQuery] = useState("");
  const [initiatives, setInitiatives] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedInitiativename, setSelectedInitiativename] = useState("");
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(0);
  const [selectedInitiativeDetails, setSelectedInitiativeDetails] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [auditStatus, setAuditStatus] = useState(null);
  const [submitterId, setSubmitterId] = useState(null);
  // Added by Gauri to update stage for delete alert on 05 Mar 2025
  const [actionStageName, setActionStageName] = useState(null);
  const [totalInitiativesPages, setTotalInitiativesPages] = useState(1); // For initiatives pagination
  const [initiativesPerPage] = useState(5); // Items per page
  const [drawerOpen, setDrawerOpen] = useState(false); // State for the drawer
  const [itemDetails, setItemDetails] = useState(null); // State to store details of the clicked action item
  const [drawerOpen1, setDrawerOpen1] = useState(false);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const IdeaId = userdata?.employeeId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedActionID, setselectedActionID] = useState("");
  // const [selectedAuditID, setselectedAuditID] = useState("");
  const [selectedIniID, setselectedIniID] = useState("");
  const [showNote, setShowNote] = useState(true);
            

  // Fetch initiatives with pagination
  const fetchInitiatives = async () => {
    let data;
    setSelectedInitiativeIndex(null);
    setSelectedInitiativeDetails(null);
    setSelectedInitiativename("");
    setselectedIniID("");
  
    console.log("Fetching initiatives for page:", tcurrentPage);
  
    if (activeTab === "stage-action-items") {
      data = await GetInitiativeListStageActionItems(IdeaId, tcurrentPage, formValues);
    } else if (activeTab === "audit-action-items") {
      data = await GetInitiativeAuditActionItems(IdeaId, tcurrentPage, formValues);
    }
  
    const fetchedInitiatives = data?.data?.listInitiativeListStageActioItemsVM || [];
    console.log("Fetched initiatives:", fetchedInitiatives);
  
    // Correct total pages calculation
    const newTotalPages = Math.max(1, Math.ceil(data?.data?.totalRecords / initiativesPerPage));
    setTotalInitiativesPages(newTotalPages);
  
    // If no data exists on the current page, move back to the last valid page
    if (fetchedInitiatives.length === 0 && tcurrentPage > 1) {
      console.log("No data on this page, moving back to previous page");
      setTCurrentPage(tcurrentPage - 1); // Go back to the last page with records
    }
  
    setInitiatives(fetchedInitiatives);
  };

  useEffect(() => {
    fetchInitiatives(); // Fetch initiatives on mount
  }, [activeTab, tcurrentPage, refresh]);

  // Delete Functionality Done by Gauri on 13 Feb 2025 start here
  const confirmDeletePlan = async (item) => {
    // Get the access token from sessionStorage
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }
    // Alert added by Gauri to fix Delete alert missing issue on 26 Feb 2025
    if (auditStatus === "Closed") {
      toast.error(`Action Item cannot be deleted, as status is 'closed'.`);
      setShowDeleteModal(false)
      return;
    }

    // Alert added by Gauri to add alert on delete, submitted by is not current loggen in user or if stage is completed 04 Mar 2025
    // if (activeTab === "stage-action-items" && submitterId !== IdeaId) {
    if (
      activeTab === "stage-action-items" &&
      (submitterId !== IdeaId || actionStageName === "Completed")
    ) {
      toast.error(`Action Item cannot be deleted`);
      setShowDeleteModal(false);
      return;
    }

    // Get the user ID from sessionStorage
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userId = userdata?.employeeId;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    let apiUrl = "";

    // Construct the API URL with the provided docId
    if (activeTab === "stage-action-items") {
      apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteInitiativeActioItemsDeatils?ActionItemID=${planToDelete}&UserID=${userId}`;
    }
    else {
      apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/DeleteAuditActioItemsDeatils?ActionItemID=${planToDelete}&UserID=${userId}`;
    }

    // Set up the request headers, including the authorization token
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    // Make the API call to delete the document
    fetch(apiUrl, {
      method: "DELETE", // Using DELETE method as it's for deletion
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the document");
        }
        return response.json();
      })
      // Modified by Gauri to fix after delete, page refreshement issue on 12 Mar 2025
      .then(async (data) => {
        toast.success(`Action Item Deleted Successfully!`);
        setShowDeleteModal(false);

        let initiativeIndex = -1;
        let updatedInitiatives = [];

        if (activeTab === "stage-action-items") {
          // Find Initiative for Stage Action Items
          initiativeIndex = initiatives.findIndex(initiative =>
            initiative.initiativeStageActionItemListEntity.some(actionItem => actionItem.actionID === planToDelete)
          );

          if (initiativeIndex !== -1) {
            // Remove Only the Deleted Stage Action Item
            updatedInitiatives = initiatives.map((initiative, index) => {
              if (index === initiativeIndex) {
                return {
                  ...initiative,
                  initiativeStageActionItemListEntity: initiative.initiativeStageActionItemListEntity.filter(
                    actionItem => actionItem.actionID !== planToDelete
                  )
                };
              }
              return initiative;
            });

            // Update the Action Item List for Selected Initiative
            setSelectedInitiativeDetails(updatedInitiatives[initiativeIndex]?.initiativeStageActionItemListEntity || []);
          }

        } else {
          // Find Initiative for Audit Action Items
          initiativeIndex = initiatives.findIndex(initiative =>
            initiative.listAuditActionItemListEntity.some(actionItem => actionItem.actionID === planToDelete)
          );

          if (initiativeIndex !== -1) {
            // Remove Only the Deleted Audit Action Item
            updatedInitiatives = initiatives.map((initiative, index) => {
              if (index === initiativeIndex) {
                return {
                  ...initiative,
                  listAuditActionItemListEntity: initiative.listAuditActionItemListEntity.filter(
                    actionItem => actionItem.actionID !== planToDelete
                  )
                };
              }
              return initiative;
            });

            // Update the Action Item List for Selected Initiative
            setSelectedInitiativeDetails(updatedInitiatives[initiativeIndex]?.listAuditActionItemListEntity || []);
          }
        }

        // Ensure the Initiative List Updates Properly
        if (initiativeIndex !== -1) {
          setInitiatives([...updatedInitiatives]);
          setSelectedInitiativeIndex(initiativeIndex + 1);
          setRefresh(prev => !prev);

          // Ensure UI Updates by Triggering `handleInitiativeClick`
          setTimeout(() => {
            handleInitiativeClick(initiativeIndex + 1);
          }, 100);
        }

      })       
      .catch((error) => {
        console.error("Error Deleting Action Item:", error);
      });

  };
  // Delete Functionality Done by Gauri on 13 Feb 2025 end here

  // Added by Gauri to fix delete refreshment issue on 12 Mar 2025
  useEffect(() => {
    if (selectedInitiativeIndex !== null && initiatives.length > 0) {
        const newIndex = initiatives.findIndex(item => item.id === selectedInitiativeIndex);
        
        if (newIndex !== -1) {
            setSelectedInitiativeIndex(newIndex);
            handleInitiativeClick(newIndex);
        }
    }
  }, [initiatives]); // Runs **only when state updates**


  /*Modified By Durgesh Dalvi: when tab change the Initiative table pagination should be set to 1 */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to the first page when changing tabs
    setTCurrentPage(1);

    setSelectedInitiativeIndex(0); // Reset selected initiative index
    setSelectedInitiativeDetails([]); // Reset selected initiative details
    setSelectedInitiativename(""); // Reset selected initiative name
    setselectedIniID(""); // Reset selected initiative ID
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleTPageChange = (event, value) => {
    console.log("GetInitiativeListStageActionItems11", value);
    setTCurrentPage(value);

    // Added by Gauri to fix wrong records showing in list view issue on 05 Mar 2025
    setSelectedInitiativeIndex(0);
    handleInitiativeClick(0);
  };  
  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    if (itemDetails) {
      console.log("Updated StageActionItems Edit Details:", itemDetails);
    }
  }, [itemDetails]); // Logs whenever itemDetails is updated

  const handleInitiativeClick = (index) => {
    setSelectedInitiativeIndex(index);
    if (activeTab === "stage-action-items") {
      setSelectedInitiativeDetails(initiatives[index].initiativeStageActionItemListEntity);
      setSelectedInitiativename(initiatives[index].title);
      setselectedIniID(initiatives[index].ideaId);
    } else {
      setSelectedInitiativeDetails(initiatives[index].listAuditActionItemListEntity);
      setSelectedInitiativename(initiatives[index].title);
    }
    
    /*Modified By Durgesh Dalvi: Added setCurrentPage(1);
    to reset the page to 1 for Action Item table when a new initiative is selected*/
    setCurrentPage(1);
  };

  const handleActionItemClick = async (item) => {  
    // EmpID added by Gauri to pass EmployeeID as a submitterId on 26 Feb 2025
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeID = userdata?.employeeId;

    if (activeTab === "stage-action-items"){  
      try {
        const queryParams = new URLSearchParams({
          ActionID: item.actionID || "", 
        }).toString();

        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetStageActionItemDetailsEdit?${queryParams}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // setIniStatusData(data.data.listInitiativeStatusManagement);
        // setItemDetails(data.data[0]);
        // Store fetched data + required values
        setItemDetails({
          ...data.data[0], // API response
          employeeId: item.employeeId,  
          initiativeID: item.initiativeID,
          // submitterID: item.submitterID
          submitterID: employeeID
        });

        setselectedActionID(item.actionID)
        console.log("API Response Data:", data);
        // console.log("StageActionItems Edit Details:", itemDetails);
        console.log("StageActionItems Edit Details:", data.data[0]);
      } catch (error) {
        console.error("Failed to fetch Stage Action Items:", error);
      } 
    } 
    else{
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeID = userdata?.employeeId;

      try {
        const queryParams = new URLSearchParams({
          ActionID: item.actionID || "", 
        }).toString();

        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetAuditActionItemDetailsEdit?${queryParams}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Added fields by Gauri for Audit Action Item Update on 27 Feb 2025
        setItemDetails({
          ...data.data[0], // API response
          auditID: item.auditID,
          actionDate: item.actionDate,
          userID: employeeID,
        });

        // setselectedAuditID(item.auditID);
        console.log("API Response Data:", data);
        console.log("AuditActionItems Edit Details:", data.data[0]);
      } catch (error) {
        console.error("Failed to fetch Audit Action Items:", error);
      } 
    }

    
    if (activeTab === "stage-action-items")
      setDrawerOpen(true); // Open the drawer when action item is clicked
    else setDrawerOpen1(true);
  };

  // Commented by Gauri to fix Remove search box issue on 26 Feb 2025
  // const handleSearchInputChange = (event) => {
  //   setSearchQuery(event.target.value);
  //   setCurrentPage(1); // Reset to the first page when searching
  // };

  const filteredActionItems =
    selectedInitiativeDetails?.filter((item) =>
      item.actionItem.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const itemsPerPage = 5; // Change as per your requirement
  {
    /*Modified By Durgesh Dalvi: To Facilitate No Extra Pagination In Case Where Data row is in multiple of 5*/
  }
  const totalPages = Math.ceil(filteredActionItems.length / itemsPerPage); // Total pages
  const startIndex = (currentPage - 1) * itemsPerPage;
  const slicedActionItems = filteredActionItems.slice(startIndex, startIndex + itemsPerPage);
  console.log("slicedActionItems", slicedActionItems);
  const handleOpenExportDrawer = () => {
    setExportDrawerOpen(true); // Open the export drawer
  };

  const handleCloseExportDrawer = () => {
    setExportDrawerOpen(false); // Close the export drawer
  };
  {/* Passed InitiativeID to Export PDF Component by Gauri on 03 Mar 2025 */}
  const renderExportDrawer = () => ( 
    <ExportDrawer
      exportDrawerOpen={exportDrawerOpen}
      handleCloseExportDrawer={handleCloseExportDrawer}
      InititiativeID={selectedIniID || "0"}
    />
  );

  const renderInitiativesTable = () => (
    <Card>
      <Card.Header>Initiatives</Card.Header>
      <Card.Body>
        {/* <TableContainer> */}
        {/* Added by Gauri to show alert if there are no initiative in list view on 27 Feb 2025 */}
          {initiatives.length === 0 ? (
            <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
              There are no items to show in this view.
            </div>
            ) : (
            <Table striped bordered hover>
              <tbody>
                {initiatives.map((initiative, index) => {
                  const isSelected = selectedInitiativeIndex === index;

                  return (
                    <tr
                      key={initiative.id}
                      onClick={() => handleInitiativeClick(index)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#e3f2fd" : "white"
                      }}
                    >
                      <td>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // padding: "10px"
                          }}
                        >
                          <span
                            className={`initiative-link ${isSelected ? "selected" : ""}`}
                            style={{
                              color: isSelected ? "#0d6efd" : "inherit",
                              fontWeight: isSelected ? "bold" : "normal"
                            }}
                          >
                            {initiative.title}
                          </span>
                          {isSelected && (
                            <FaAngleRight style={{ color: "#0d6efd", marginLeft: "10px" }} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        {/* </TableContainer> */}
        {/*Modified By Durgesh: Added  setCurrentPage(1); within both the OnClick */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <IconButton
            onClick={(event) => handleTPageChange(event, tcurrentPage - 1)}
            disabled={tcurrentPage === 1}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
            Page {tcurrentPage}
          </Typography>
          {/* Commented and Modified pagination logic by Gauri on 04 Mar 2025 */}
          {/* <IconButton
            // onClick={() => {
            //   if (tcurrentPage < totalInitiativesPages) {
            //     setTCurrentPage(tcurrentPage + 1);
            //     setCurrentPage(1);
            //   }
            // }}
            onClick={(event) => handleTPageChange(event, tcurrentPage + 1)}
            disabled={tcurrentPage >= totalInitiativesPages}
          > */}
          <IconButton
            onClick={(event) => handleTPageChange(event, tcurrentPage + 1)}
            // disabled={tcurrentPage >= totalInitiativesPages || initiatives.length === 0}
            disabled={tcurrentPage >= totalInitiativesPages || initiatives.length < initiativesPerPage}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Card.Body>
    </Card>
  );

  const renderActionItemsTable = () => {
    if (selectedInitiativeIndex === null || selectedInitiativename === "") {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Action Item</th>
              <th>Due Date</th>
              <th>{activeTab === "stage-action-items" ? "Stage" : "Audit"}</th>
              <th>Assigned To</th>
              {activeTab === "stage-action-items" && <td>Submitted By</td>}
              <th>Status</th>
              <th>Priority</th>
              {activeTab !== "stage-action-items" && <td>Actual End Date</td>}
              <th align="center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
              Please select an initiative to view details.
              </td>
            </tr>
          </tbody>
        </Table>
      );
    }
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Action Item</th>
            <th>Due Date</th>
            <th>{activeTab === "stage-action-items" ? "Stage" : "Audit"}</th>
            <th>Assigned To</th>
            {activeTab === "stage-action-items" && <td>Submitted By</td>}
            <th>Status</th>
            <th>Priority</th>
            {activeTab !== "stage-action-items" && <td>Actual End Date</td>}
            <th align="center">Action</th>
          </tr>
        </thead>
        <tbody>
          {slicedActionItems.length > 0 ? (
            slicedActionItems.map((item) => (
              <tr key={item.actionID}>
                <td>
                  {item.actionItem.length > 10 ? (
                    <Tooltip title={item.actionItem}>
                      <span>{item.actionItem.slice(0, 10)}...</span>
                    </Tooltip>
                  ) : (
                    item.actionItem
                  )}
                </td>
                <td>
                  {item.dueDate ? new Date(item.dueDate).toLocaleDateString("en-GB") : "NA"}
                </td>
                <td>
                  {activeTab === "stage-action-items" ? (
                    item?.requestStage?.length > 10 ? (
                      <Tooltip title={item.requestStage}>
                        <span>{item.requestStage.slice(0, 10)}...</span>
                      </Tooltip>
                    ) : (
                      item.requestStage || "N/A"
                    )
                  ) : item?.auditTitle?.length > 10 ? (
                    <Tooltip title={item.auditTitle}>
                      <span>{item.auditTitle.slice(0, 10)}...</span>
                    </Tooltip>
                  ) : (
                    item.auditTitle || "N/A"
                  )}
                </td>
                {/* <td>{item.assignTOEmployeeName || "N/A"}</td> */}
                <td>
                  {activeTab === "stage-action-items" ? 
                    item.assignTOEmployeeName || "N/A" : item.responsiblePerson || "N/A"
                  }
                </td>
                
                {activeTab === "stage-action-items" && (
                  <td>{item.submittedBy || "N/A"}</td>
                )}
                <td>{item.status || "N/A"}</td>
                <td>{item.priority || "N/A"}</td>
                {activeTab !== "stage-action-items" && (
                  <td>
                    {/* {new Date(item.actionDate).toLocaleDateString("en-GB") || "N/A"} */}
                    {/* Updated Actual End Date by Gauri on 03 Mar 2025 */}
                    {item.actualEndDate ? new Date(item.actualEndDate).toLocaleDateString("en-GB") : "N/A"}
                  </td>
                )}
                <td align="center">
                  <div style={{ display: "flex", justifyContent: "center"}}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleActionItemClick(item)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setPlanToDelete(item?.actionID);
                          setAuditStatus(item?.status);
                          setSubmitterId(item?.submitterID);
                          setActionStageName(item?.requestStage);
                          setShowDeleteModal(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                There are no items to show in this view.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    )
  };

  // Function to close the drawer
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setItemDetails(null); // Clear item details on close
  };
  const handleCloseDrawer1 = () => {
    setDrawerOpen1(false);
    setItemDetails(null); // Clear item details on close
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  {
    /*Modified By Durgesh: Added to prevent further pagination when there are no more 
    items when the data available is in the multiple of 5 */
  }
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleDisplayNote = () => {
    setShowNote(!showNote);
  };

  return (
    <div className="p-3">
      <Nav variant="tabs" activeKey={activeTab}>
        <Nav.Item>
          <Nav.Link
            eventKey="stage-action-items"
            onClick={() => handleTabChange("stage-action-items")}
          >
            Stage Action Items
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="audit-action-items"
            onClick={() => handleTabChange("audit-action-items")}
          >
            Audit Action Items
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div className="row mt-2">
        {/* Added by Gauri to show note on top of page on 13 Mar 2025 */}
        <div className="note-txt ps-3 d-flex ">
          <span className="note-title me-1">
            <Tooltip title="Note">
              <FontAwesomeIcon
                icon={faLightbulb}
                data-bs-toggle="tooltip"
                data-bs-original-title="Note"
                style={{
                  color: "#ffd024",
                  borderRadius: "50%",
                  padding: "5px",
                  fontSize: "20px"
                }}
                onClick={handleDisplayNote}
              />
            </Tooltip>
          </span>
          {showNote && (
            <div className="note-content">
              <div>
                The approvers of initiative stages or the external auditors of initiatives can raise certain action items for various reasons, such as enhancements, improvements, corrections, remedial actions, or supplementary activities for the initiatives.
                It is essential to track these action items until they are executed and the targeted results are obtained.
              </div>
              <div>You should use the <strong>Action Items</strong> feature to: </div>
              <div>
                <div><CheckBoxIcon className="note-Icn" /> Track the action items created by you.</div>
                <div><CheckBoxIcon className="note-Icn" /> Execute the action items assigned to you.</div>
              </div>
              <div> This ensures proper follow-up and accountability in the initiative process. </div>
            </div>
          )}
        </div>

        <div className=" text-center">
          <strong>Initiative Title: </strong>
          <span>{selectedInitiativename}</span>
        </div>

        <div className="d-flex justify-content-end align-items-center mb-2 pe-3">
          <div className="" onClick={handleShowForm}>
            <Tooltip title="Search">
              <img src={SearchIcon} alt="" />
            </Tooltip>
          </div>

          {/* Added condition by Gauri to show Export Data button only on 1st tab on 25 Feb 2025 */}
          {(activeTab === "stage-action-items") && (
            <div className="ml-auto">
              <Button
                variant="secondary"
                className="ms-3"
                size="sm"
                onClick={handleOpenExportDrawer}
              >
                Export Data
              </Button>
            </div>
          )}

          <div className="d-flex align-items-center gap-2">
            {/* <TextField
              placeholder="Search"
              className="w-64"
              value={searchQuery}
              onChange={handleSearchInputChange}
            /> */}
            {/* {(activeTab === "stage-action-items") && (
            <div className="ml-auto">
              <Button
                variant="secondary"
                className="mr-1"
                size="sm"
                onClick={handleOpenExportDrawer}
              >
                Export Data
              </Button>
            </div>
            )} */}
          </div>
        </div>
        {showForm && (
          <div style={{ marginLeft: "20px", marginRight: "40px" }}>
            <SearchAdvanceForm
              activeTab={activeTab}
              onSearch={() => {
                setRefresh(!refresh);
              }}
              onClose={handleShowForm}
              setFormValues={setFormValues}
              formValues={formValues}
              initialState={initialState}
            />
          </div>
        )}
        {/* <div className="col-md-4 mt-lg-4">{renderInitiativesTable()}</div> */}
        <div className="col-md-4">{renderInitiativesTable()}</div>
        <div className="col-md-8">
          <div>{renderActionItemsTable()}</div>
          <div className="mt-4 d-flex justify-content-center">
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
                Page {currentPage}
              </Typography>
              {/*Modified By Durgesh Dalvi: changed the disable logic*/}
              <IconButton onClick={handleNextPage} disabled={currentPage >= totalPages}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </div>
        </div>
      </div>

      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure you want to delete this item?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmDeletePlan} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>

      {/* Drawer to display action item details */}
      <StageActionItemDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        itemDetails={itemDetails}
        activeTab={activeTab}
        setRefresh={setRefresh} // Pass setRefresh to the drawer
      />
      <AuditActionItemDrawer
        open={drawerOpen1}
        onClose={handleCloseDrawer1}
        itemDetails={itemDetails}
        activeTab={activeTab}
        setRefresh={setRefresh}
      />
      {renderExportDrawer()}
    </div>
  );
}
