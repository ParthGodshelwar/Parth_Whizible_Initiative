import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { Box, IconButton, Typography, Drawer, Tabs, Tab, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import SearchAdvanceForm from "./SearchAdvanceForm";
import { PrimaryButton } from "@fluentui/react";
import AuditForm from "./AuditForm";
import Observation from "./Observation";
import DocumentUpload from "./DocumentUpload";
import HistorySection from "./HistorySection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ActionItems from "./ActionItems";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
// CSS Added by Madhuri.K Comment Start here
import "../../style_custom.css";
// CSS Added by Madhuri.K End here
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";
const MyComponent = () => {
  const [searchFilters, setSearchFilters] = useState({
    auditTypeID: "",
    title: "",
    plannedStartDate: "",
    plannedEndDate: "",
    actualFromDate: "",
    actualToDate: "",
    duration: "",
    checklistId: "",
    status: ""
  });

    const classNames = mergeStyleSets({
      tableContainer: {
        width: "100%",
        overflowX: "hidden"
      },
      table: {
        minWidth: 650,
        width: "100%"
      },
      drawerHeader: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        borderBottom: "1px solid grey"
      },
      drawerContent: {
        padding: "20px"
      },
      inputRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
        marginTop: "20px"
      },
      saveButtonRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px"
      },
      stripedRow: {
        backgroundColor: "#f9f9f9"
      }
    });
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [externalAuditList, setExternalAuditList] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [id, setId] = useState(0);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const accessToken = sessionStorage.getItem("access_token");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuditID, setSelectedAuditID] = useState(null);
    const [auditor, setAuditor] = useState("");
    const [auditorN, setAuditorN] = useState("");
  const handleDeleteClick = (auditID) => {
    setSelectedAuditID(auditID);  // Store audit ID
    setShowDeleteModal(true);  // Show confirmation dialog
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
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00`;
};
  const fetchExternalAuditList = async (pageNumber, filters) => {
    try {
      console.log("Fetching External Audit List...");
  
      const queryParams = new URLSearchParams({
        PageNo: pageNumber,
        AuditType: filters?.auditTypeID || "",
        title: filters?.title || "",
        PlanStartDate: filters?.plannedStartDate || "",
        PlanEndDate: filters?.plannedEndDate || "",
        ActStartDate: filters?.actualFromDate || "",
        ActEndDate: filters?.actualToDate || "",
        duration: filters?.duration || "",
        ChecklistID: filters?.checklistId || "",
        StatusID: filters?.status || ""
      }).toString();
  
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditList?${queryParams}`,
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
      console.log("External Audit List Response:", data);
  
      if (data.data && data.data.listExternalAudit) {
        setExternalAuditList(data.data.listExternalAudit);  // Update list
      } else {
        console.warn("No audits found in response.");
        setExternalAuditList([]);  // Ensure table clears properly
      }
    } catch (error) {
      console.error(" Failed to fetch external audit list:", error);
    }
  };
  
  // Effect to fetch data on page change or search filter change
  useEffect(() => {
    console.log("fetchExternalAuditList", searchFilters);
    fetchExternalAuditList(page, searchFilters); // Fetch the data
  }, [page, searchFilters, refresh]); // Trigger when page or search filters change

//   const handleOpenDrawer = () => {
// // for Clear stored auditors Added By Madhuri.K On 11-03-2025
//     sessionStorage.removeItem("selectedAuditors"); // Clear stored auditors
//     setShowDrawer(true);
//     setId(0);
//   };

const handleOpenDrawer = (audit) => {
  sessionStorage.removeItem("selectedAuditors"); 
  setShowDrawer(true);
  setId(audit?.auditID || 0);

  // Extract the auditors and auditorslist
  setAuditor(audit?.auditors || "");    
  setAuditorN(audit?.auditorslist || ""); 
};

// const handleOpenDrawer = (audit) => {
//     sessionStorage.removeItem("selectedAuditors"); 
//     setShowDrawer(true);
//     setId(audit?.auditID || 0);

//     // Pass the entire audit data to the AuditForm
//     setAuditor(audit?.auditors || "");    // ID list
//     setAuditorN(audit?.auditorslist || ""); // Name list
// };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
    setSelectedTab(0);
    setAuditor("");
    setAuditorN("");
  // Clear selected auditors when closing main drawer
  sessionStorage.removeItem("selectedAuditors");
  setId(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  // Clear selected auditors when closing main drawer
  sessionStorage.removeItem("selectedAuditors");
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

const confirmDelete = async () => {
  if (!selectedAuditID) return;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/DeleteExternalAudit?AuditID=${selectedAuditID}&UserID=${employeeId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const result = await response.json();
    console.log("Delete API Response:", result);

    const auditToDelete = externalAuditList.find((audit) => audit.auditID === selectedAuditID);
    const title = result?.data?.[0]?.title ?? auditToDelete?.title ?? "Unknown Title";
    const resultMessage = result?.data?.[0]?.result?.toLowerCase()?.trim() || "";

    console.log("Delete API Result Message:", resultMessage); // Debugging

    // Check for both ActionItem and Observation Mapping
    const isActionItemMapped = resultMessage.includes("action items");
    const isObservationMapped = resultMessage.includes("observation");

    if (isActionItemMapped && isObservationMapped) {
      toast.error(`External Audit '${title}' cannot be deleted as it is mapped to action items and observations.`);
      return; // Stop execution here
    } 
    if (isActionItemMapped) {
      toast.error(`External Audit '${title}' has related action items, cannot be deleted.`);
      return;
    } 
    if (isObservationMapped) {
      toast.error(`External Audit '${title}' has related observations, cannot be deleted.`);
      return;
    } 

    // If response is OK, proceed with successful delete
    if (response.ok) {
      toast.success(`External Audit '${title}' deleted successfully!`);
      fetchExternalAuditList(page, searchFilters);
      return;
    }

    //  Handle unexpected errors
    throw new Error(result.message || "Failed to delete audit record.");

  } catch (error) {
    console.error("Error deleting audit:", error);
    toast.error("Error deleting record.");
  } finally {
    setShowDeleteModal(false);
    setSelectedAuditID(null);
  }
};

  const handleRefreshList = async () => {
    console.log("Refreshing audit list...");
    // await fetchExternalAuditList(page, searchFilters);  
    await fetchExternalAuditList(1, searchFilters);

    //  Force a state update to trigger re-render
    setExternalAuditList([...externalAuditList]); 
    setRefresh((prev) => !prev);
    setShowDrawer(false); // Close drawer after saving
  };
   
  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-end align-content-center mb-2 gap-1">
        <Tooltip title="Search">
          <img
            src={SearchIcon}
            alt="Search Icon"
            className="me-2"
            onClick={() => setShowForm(!showForm)}
          />
        </Tooltip>
        <PrimaryButton
          text={"Add"}
          onClick={() => {
            handleOpenDrawer();
            setId(0);
          }}
          styles={{ root: { backgroundColor: "#1976d2" } }}
        />
      </div>

      {showForm && (
        <SearchAdvanceForm
          onClose={() => setShowForm(false)}
          searchFilters={searchFilters}
          onSearch={(searchType, formValues) => {
            setRefresh(!refresh);
            console.log("fetchExternalAuditList11", searchType, formValues);
            setSearchFilters(searchType); // Update searchFilters on form submission
          }}
        />
      )}
<Table  className={classNames.table} aria-label="simple table">
  <thead>
    <tr>
      <th>Initiative</th>
      <th>Audit Type</th>
      <th>Title</th>
      <th>Actual From Date</th>
      <th>Actual To Date</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {externalAuditList && externalAuditList.length > 0 ? (
      externalAuditList.map((audit, index) => (
        <tr key={audit.auditID || index}>
          <td>{audit.initiativeTitle}</td>
          <td>{audit.auditType}</td>
          <td>{audit.title}</td>
          <td>
            {audit.actualStartDate
              ? new Date(audit.actualStartDate).toLocaleDateString("en-GB")
              : ""}
          </td>
          <td>
            {audit.actualEndDate
              ? new Date(audit.actualEndDate).toLocaleDateString("en-GB")
              : ""}
          </td>
          <td>{audit.status}</td>
          <td>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => {
                  handleOpenDrawer(audit);   // Pass the full audit object
                  setId(audit.auditID);
                }}
                sx={{ width: 20, height: 20 }}
              >
                <EditIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteClick(audit.auditID)}
                sx={{ width: 20, height: 20 }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="7" style={{ textAlign: "center" }}>
        There are no items to show in this view.
        </td>
      </tr>
    )}
  </tbody>
</Table>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={page === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={externalAuditList.length < 5} // Disable if less than 5 entries
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* Drawer for Audit Details */}
      <Drawer
    anchor="right"
    open={showDrawer}
    onClose={handleCloseDrawer}
    sx={{
      "& .MuiDrawer-paper": {
        width: "70vw",
        boxSizing: "border-box"
      }
    }}
  >
    
    <div style={{ width: "100%", padding: 20 }}>
    <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f5f5f5", // Light grey background
              padding: "5px" // Optional: Adds padding to make it look more balanced
            }}
          >
            <Typography variant="h6">External Audit Details</Typography>
            <IconButton onClick={handleCloseDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </div>
      {/* Tabs */}
      <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Audit details tabs">
        <Tab label="Detail" sx={{ textTransform: "none" }} />
        {id && <Tab label="Action Items" sx={{ textTransform: "none" }} />}
        {id && <Tab label="Observations" sx={{ textTransform: "none" }} />}
        {id && <Tab label="Document Upload" sx={{ textTransform: "none" }} />}
        {id && <Tab label="Checklist" sx={{ textTransform: "none" }} />}
        {id && <Tab label="History" sx={{ textTransform: "none" }} />}
      </Tabs>

      {/* Pass refresh function to AuditForm */}
      {/* {selectedTab === 0 && <AuditForm id={id} onRefresh={handleRefreshList} />} */}
       {/* Pass refresh function to AuditForm */}
      {selectedTab === 0 && <AuditForm id={id} 
       auditor={auditor}            // Pass the auditor ID list
       auditorN={auditorN}          // Pass the auditor name list
       onRefresh={handleRefreshList} />}
      {selectedTab === 1 && <ActionItems id={id} />}
      {selectedTab === 2 && <Observation id={id} />}
      {selectedTab === 3 && <DocumentUpload id={id} />}
      {/* {selectedTab === 4 && <Checklist  id={id} />} */}
      {selectedTab === 5 && <HistorySection  id={id} />}
    </div>
  </Drawer>
         {/* Confirmation Dialog */}
      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure you want to delete this record?",
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmDelete} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>

    </div>
  );
};

export default MyComponent;
