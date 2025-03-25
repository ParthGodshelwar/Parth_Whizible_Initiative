import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchAdvanceForm from "./SearchAdvanceForm";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import axios from "axios";
import "../../style_custom.css";
import HistorySection from "./HistorySection";
import SnoozeDetailsDrawer from "./SnoozeDetailsDrawer";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";

const MyComponent = ({ onClose }) => {

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
  const [showSnoozeDrawer, setShowSnoozeDrawer] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [comments, setComments] = useState("");
  const [numDays, setNumDays] = useState("");
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState({
    priorityOptions: [],
    statusOptions: [],
    employeeOptions: []
  });
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;
  const [searchTerm, setSearchTerm] = useState({
    isActive: "",
    natureOfInitiativeId: "",
    initiativeTitle: "",
    demandCode: "",
    initiationDate: "",
    ideaID: "",
    StageID: "",
    user: "",
    createdBy: "",
  });

  const handleDrawerOpen = (data) => {
    setEditData(data);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setEditData(null);
    setDrawerOpen(false);
  };
  const initialState = {
    Comment: "",
    numDays: ""
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

    fetchDropdownData1("responsibility", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        employeeOptions: [{ key: "", text: "Select Modified By" }, ...options] // Adding default "Select" option
      }))
    );
  }, []);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const itemsPerPage = 10;
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

  const fetchData = async (pageNumber) => {
    try {
      const isActiveValue = searchTerm.isActive === "" ? "" : Boolean(searchTerm.isActive);
      const localDate = searchTerm.initiationDate
        ? new Date(searchTerm.initiationDate).toLocaleDateString('en-CA') // Format as YYYY-MM-DD
        : "";

      console.log("Final Date Sent to API:", localDate);

      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetInitiativeActiveSnooz`,
        {
          params: {
            Active: isActiveValue,  // Ensure this is Boolean
            userID: userID, // Ensure the API only returns data for the logged-in user
            NOIID: searchTerm.natureOfInitiativeId,
            Title: searchTerm.initiativeTitle,
            demandCode: searchTerm.demandCode,
            StageID: searchTerm.StageID,
            // InitiativeDate: searchTerm.initiationDate,
            InitiativeDate: localDate,
            IdeaId: searchTerm.ideaID,
            // createdBy: searchTerm.user,
            CreatedBy: searchTerm.createdBy,
            PageNo: pageNumber,
          },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );

      setTableData(response.data.data.initiativeActivateSnooz || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("fetchData", searchTerm);
    fetchData(page, searchTerm); // Fetch the data
  }, [page, searchTerm, refresh]); // Trigger when page or search filters change

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openSnoozeDrawer = (initiative) => {
    console.log("Selected Initiative:", initiative);
    setSelectedInitiative(initiative);
    setShowSnoozeDrawer(true);
  };

  const closeSnoozeDrawer = () => {
    setShowSnoozeDrawer(false);
    setComments("");
    setNumDays("");
  };

  const openHistoryDrawer = (initiative) => {
    setSelectedInitiative(initiative);
    setShowHistoryDrawer(true);
  };

  const closeHistoryDrawer = () => {
    setShowHistoryDrawer(false);
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSearch = (searchType, formValues) => {
    setSearchTerm((prev) => ({ ...prev, ...searchType }));
    setPage(1);
  };

  return (
    <div className="container mt-3" >
      <div
        id="topActions"
        style={{ marginTop: "20px" }}
        className="d-flex gap-2 justify-content-between align-items-start"
      >
        <div className="note-txt ps-3 d-flex ">
          <span className="note-title me-1">
            <Tooltip title="Note">
              <FontAwesomeIcon
                icon={faLightbulb}
                style={{
                  color: "#ffd600",
                  borderRadius: "50%",
                  padding: "3px",
                  fontSize: "19px",
                }}
              />
            </Tooltip>
          </span>
          <div className="mt-1 note_txt">
            This page lists Initiatives submitted by the logged-in user.
          </div>
        </div>
        <div>
          <Tooltip title="Search">
            <img
              src={SearchIcon}
              alt="Search"
              onClick={handleShowForm}
              style={{ cursor: "pointer" }}
            />
          </Tooltip>
        </div>
      </div>
      {showForm && (
        <SearchAdvanceForm
          onClose={handleCloseForm}
          onSearch={(searchType, formValues) => {
            setRefresh(!refresh);
            handleSearch(searchType, formValues); // Update searchFilters on form submission
          }}
        />
      )}
      <div className="mt-4">
        <Table className={classNames.table} aria-label="simple table">
          <thead>
            <tr>
              <th className="text-center">Initiative Code</th>
              <th className="text-center">Initiative Title</th>
              <th className="text-center">Nature Of Initiative </th>
              <th className="text-center">Initiation Date</th>
              <th className="text-center">Stage</th>
              {/* <th>Show History</th> */}
              <th className="text-center">Activate / Snooze</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", color: "#666" }}>
                  There are no items to show in this view.
                </td>
              </tr>
            ) : (
              tableData.map((item, idx) => (
                <tr key={idx}>
                  <td align="center">{item.initiativeCode || "N/A"}</td>
                  <td align="center">{item.initiativeTitle || "N/A"}</td>
                  <td align="center">{item.natureOfDemand || "N/A"}</td>
                  <td align="center">
                    {item.initiationDate ? new Date(item.initiationDate).toLocaleDateString("en-GB") : "N/A"}
                  </td>

                  <td align="center">{item.stageName || "N/A"}</td>
                  <td align="center"
                    onClick={() => {
                      setSelectedInitiative(item);
                      setEditMode(true);
                      handleDrawerOpen({
                        actionType: item.active ? "Snooze" : "Activate",
                        initiativeID: item.initiativeID || item.ideaID, // Ensure correct ID is passed
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <a style={{ textDecoration: "underline", color: item.active ? "inherit" : "red" }}>
                      {item.active ? "Snooze" : "Activate"}
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={page === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={tableData.length < 5} // Disable if less than 5 entries
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
      {/* History Drawer */}
      <Drawer
        anchor="right"
        open={showHistoryDrawer}
        onClose={closeHistoryDrawer}
        variant="temporary"
        sx={{
          "& .MuiDrawer-paper": {
            width: "60vw",
            boxSizing: "border-box",
          },
        }}
      >
        <Box p={3} width="100%">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              backgroundColor: "#e7edf0",
              padding: "0 10px",
            }}
          >
            <h6 className="mb-0">History</h6>
            <IconButton onClick={closeHistoryDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          <HistorySection dropdownOptions={dropdownOptions} />
        </Box>
      </Drawer>
      {drawerOpen && (

        <SnoozeDetailsDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          initialData={selectedInitiative}
          actionType={editData?.actionType}
          data={{
            natureOfDemand: selectedInitiative?.natureOfDemand,
            initiativeCode: selectedInitiative?.initiativeCode,
            initiativeTitle: selectedInitiative?.initiativeTitle,
          }}
          onSuccess={() => setRefresh(!refresh)} // Refresh table after save
        />
      )}
    </div>
  );
};

export default MyComponent;


