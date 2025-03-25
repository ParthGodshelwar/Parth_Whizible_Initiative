import React, { useEffect, useState } from "react";
import { Box, Typography, Drawer, IconButton, Divider, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Table from "react-bootstrap/Table";
import { MenuItem, Grid, Select } from "@mui/material";
import GetInitiativeHistory from "app/hooks/Editpage/GetPrioritizationCheckListHistory";
import { Dropdown } from "@fluentui/react";
//        Modified By Durgesh Dalvi: changed the implementation of this component to ensure the data first get
//        fetched and then the appendentation of table begins
const InitiativeHistoryDrawer = ({ isOpen, onClose, id1, UniqueID }) => {
  const [initiativeHistory, setInitiativeHistory] = useState({
    data: { listPrioritizationChecklist: [] }
  });
  const [dropdownOptions, setDropdownOptions] = useState({
    modifiedFieldOptions: [],
    modifiedByOptions: []
  });

  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [selectedBy, setSelectedBy] = useState("");
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  // Added function by Gauri to Bind History data on 20 Mar 2025
  const fetchHistoryData = async () => {
    const modifiedField = selectedField || ""; // Use selectedField or default
    const modifiedBy = selectedBy || ""; // Use selectedBy or default

    try {
      const history = await GetInitiativeHistory(
        id1,
        currentPage,
        UniqueID,
        // selectedBy,
        // selectedField
        modifiedBy,
        modifiedField
      );
      console.log("API Response:", history);

      if (history?.data?.listPrioritizationChecklist) {
        setInitiativeHistory(history);
        setFilteredHistory(history.data.listPrioritizationChecklist);
      } else {
        setInitiativeHistory({ data: { listPrioritizationChecklist: [] } }); // Prevent errors
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Added function by Gauri to Filter History data on 21 Mar 2025
  useEffect(() => {
    fetchHistoryData();
  }, [id1, currentPage, UniqueID]); // Optimized dependencies

  useEffect(() => {
    if (initiativeHistory?.data?.listPrioritizationChecklist) {
      let filteredData = initiativeHistory.data.listPrioritizationChecklist;
  
      if (selectedField) {
        filteredData = filteredData.filter((item) => item.fieldName === selectedField);
      }
  
      if (selectedBy) {
        filteredData = filteredData.filter((item) => item.modifiedBy === selectedBy);
      }
  
      setFilteredHistory(filteredData);
    }
  }, [selectedField, selectedBy, initiativeHistory]); // Runs only when filters or data change  

  const fetchDropdownData = async (fieldName, setOptionsCallback) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=${fieldName}&IdeaId=${id1}&UniqueID=${UniqueID}`,
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
    fetchDropdownData("modifiedField_prioritizationhistory", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        modifiedFieldOptions: options
      }))
    );
    fetchDropdownData("modifiedby_prioritizationhistory", (options) =>
      setDropdownOptions((prev) => ({
        ...prev,
        modifiedByOptions: options
      }))
    );
  }, []);

  // Modified function by Gauri to Bind Dropdowns on 20 Mar 2025
  const handleFieldChange = (event, option) => {
    setSelectedField(option?.key || "");
    setCurrentPage(1); // Reset pagination but do NOT trigger API fetch
  };
  
  const handleByChange = (event, option) => {
    setSelectedBy(option?.key || "");
    setCurrentPage(1); // Reset pagination but do NOT trigger API fetch
  };  
  // End of Modified function by Gauri to Bind Dropdowns on 20 Mar 2025
  
  // const handleActionTypeChange = (event, option) => {
  //   setSelectedActionType(option.key);
  //   setCurrentPage(1); // Reset pagination on filter change
  // };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
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
          Prioritization CheckList History
        </Typography>
        <Divider />
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Modified Field</Typography>
            {/* Added by Gauri to change dropdown in FluentUI on 21 Mar 2025 */}
            <Dropdown
              placeholder="Select Modified Field"
              options={[
                { key: "", text: "Select Modified Field" },
                ...dropdownOptions.modifiedFieldOptions
              ]}
              selectedKey={selectedField || null}
              // onChange={(event, option) => {
              //     handleInputChange("modifiedField")(option.key)
              // }}
              onChange={handleFieldChange}
              styles={{ dropdown: { width: 200 } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Modified By</Typography>
            {/* Commented and Added by Gauri to change dropdown in FluentUI on 21 Mar 2025 */}
            {/* <Select fullWidth value={selectedBy} onChange={handleByChange}
              size="small" sx={{ maxWidth: 200 }} displayEmpty >
              <MenuItem value="">Select Modified By</MenuItem>
              {dropdownOptions.modifiedByOptions.map((option) => (
                <MenuItem key={option.key} value={option.key}> {option.text} </MenuItem>
              ))}
            </Select> */}
            <Dropdown
              placeholder="Select Modified By"
              options={[
                { key: "", text: "Select Modified By" },
                ...dropdownOptions.modifiedByOptions
              ]}
              selectedKey={selectedBy || null}
              onChange={handleByChange}
              styles={{ dropdown: { width: 200 } }}
            />
          </Grid>
        </Grid>

        {/* Table to display initiative history */}
        <Table striped bordered responsive>
          <thead>
            <tr>
              <th>Modified Field</th>
              <th>Modified Date</th>
              <th>Value</th>
              <th>Modified By</th>
            </tr>
          </thead>
          <tbody>
            
            {/* Commented and Modified by Gauri to filter history data on 21 Mar 2025 */}
            {/* {initiativeHistory?.data?.listPrioritizationChecklist?.length > 0 ? (
              initiativeHistory.data.listPrioritizationChecklist.map((item, index) => ( */}
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.fieldName}</td>
                  <td>{new Date(item.modifiedDate).toLocaleDateString("en-GB")}</td>
                  <td>{item.value}</td>
                  <td>{item.modifiedBy}</td>
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

        {/* Pagination controls */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage}</Typography>
          <IconButton
            onClick={handleNextPage}
            disabled={initiativeHistory.data.listPrioritizationChecklist.length === 0}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default InitiativeHistoryDrawer;
