import React, { useEffect, useState } from "react";
import { Box, Typography, Drawer, IconButton, Divider, Tooltip, Pagination } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Table from "react-bootstrap/Table";
import { Dropdown, IDropdownOption, Label } from "@fluentui/react";
import GetInitiativeHistory from "app/hooks/Editpage/GetInitiativeHistory";
import { MenuItem, Grid, Paper, Select } from "@mui/material";
const InitiativeHistoryDrawer = ({ isOpen, onClose, id1 }) => {
  const [initiativeHistory, setInitiativeHistory] = useState(null);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedAction, setSelectedAction] = useState("SYS_REJECT");
  const [displayedHistory, setDisplayedHistory] = useState([]);
  const [selectedField, setSelectedField] = useState(""); // State for Modified Field
  const [selectedBy, setSelectedBy] = useState("");
  const [itemsPerPage] = useState(10); // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOptions, setDropdownOptions] = useState({
    priorityOptions: [],
    statusOptions: [],
    employeeOptions: []
  });
  const actionOptions = [
    { key: "SYS_APPROVE", text: "Approved" },
    { key: "SYS_REJECT", text: "Rejected" },
    { key: "SYS_SUBMIT", text: "Submitted" }
  ];
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await GetInitiativeHistory(id1, currentPage, selectedAction);
        setInitiativeHistory(history);
        setFilteredHistory(history.data.listInitiativeHistoryListEntity); // Set initial filtered history
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id1, currentPage, selectedAction]);
  const onActionChange = (event, option) => {
    setSelectedAction(option.key);
    setCurrentPage(1);
  };
  const fetchDropdownData = async (fieldName, setOptionsCallback) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=${fieldName}`,
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
  useEffect(() => {
    fetchDropdownData("priorityid", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        priorityOptions: options
      }))
    );
    fetchDropdownData("actionstatus", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        statusOptions: options
      }))
    );
    fetchDropdownData("customfieldnumeric1", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        employeeOptions: options
      }))
    );
  }, []);
  useEffect(() => {
    if (initiativeHistory) {
      setFilteredHistory(initiativeHistory.data.listInitiativeHistoryListEntity);
      setDisplayedHistory(initiativeHistory.data.listInitiativeHistoryListEntity); // Load initial page data
    }
  }, [initiativeHistory]);
// Pagination section 
  {/* Changed By Madhuri.K On 14-Feb-20025 comment start here*/}
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
    {/* Changed By Madhuri.K On 14-Feb-20025 comment end here*/}

  const handleFieldChange = (event) => {
    setSelectedField(event.target.value);
  };

  const handleByChange = (event) => {
    setSelectedBy(event.target.value);
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: "65vw", padding: 2, position: "relative" }}>
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 17, right: 12 }}>
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>
        <Typography variant="h6" gutterBottom style={{ background: "#E7EDF0", width: "100%" }}>
          Initiative History
        </Typography>
        <Divider />
        {/* Changed By Madhuri.K On 14-Feb-20025 comment start here*/}
           <div className="row mb-3 mt-3">
                  <div className="col-sm-4">
                    <Label className="form-label IM_label">Action Taken</Label>
                    <Dropdown
                      selectedKey={selectedAction}
                      placeholder="Select Action Taken"
                      options={actionOptions}
                      onChange={onActionChange}
                      styles={{ dropdown: { width: "100%" } }}
                    />
                  </div>
                  <div className="col-sm-3"></div>
                </div>
        {/* Changed By Madhuri.K On 14-Feb-20025 comment end here*/}

        {/* Table to display initiative history */}
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Event Time</th>
              <th>From Stage</th>
              <th>To Stage</th>
              <th>Action Taken</th>
              <th>Approver</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {displayedHistory?.length > 0 ? (
              displayedHistory.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.eventTime).toLocaleDateString("en-GB")}</td>
                  <td>{item.fromStage}</td>
                  <td>{item.toStage}</td>
                  <td>{item.actionType}</td>
                  <td>{item.userName}</td>
                  <td>{item.comments}</td>
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

        {/* Pagination arrows */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={displayedHistory.length < 5} // Disable if less than 5 entries
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
      </Box>
    </Drawer>
  );
};

export default InitiativeHistoryDrawer;
