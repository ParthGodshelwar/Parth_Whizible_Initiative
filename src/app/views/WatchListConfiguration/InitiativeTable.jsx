import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WatchListDrawer from "./WatchListDrawer"; // Import the extracted drawer component
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
const InitiativeTable = ({ wareHouseIni, currentPage, setCurrentPage , flag, ideaID}) => {
  const [data, setData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [employeeWatchList, setEmployeeWatchList] = useState([]);
  const [initiativesID, setinitiativesID] = useState([]);
  const [employeeId, setemployeeId] = useState([]);
  const selectedIniDetails = { title: "Default Initiative" }; // Replace with actual data
  // const [selectedInitiativeId, setSelectedInitiativeId] = useState(null);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState(1); // Default value
  const itemsPerPage = 5;

  useEffect(() => {
    const mappedData = wareHouseIni.map((item) => ({
      code: item.initiativeCode,
      nature: item.natureofInitiative,
      title: item.initiativeTitle,
      businessGroup: item.businessGroup || "N/A",
      organizationUnit: item.organizationUnit || "N/A",
      stage: item.currentStage,
      approver: item.currentStageApprover || "N/A",
      action: "Action Placeholder",
      id: item.initiativeId // Ensure each item has an id
    }));
    setData(mappedData);
  }, [wareHouseIni, currentPage]);

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    const updatedSelections = {};
    if (event.target.checked) {
      data.forEach((_, index) => (updatedSelections[index] = true));
    }
    setSelectedEmployees(updatedSelections);
  };

  const handleEmployeeCheckboxChange = (id) => {
    setSelectedEmployees((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  const handleEditClick = (initiativeId) => {
    setSelectedInitiativeId(initiativeId);  // Update ID before opening drawer
    setIsDrawerOpen(true);
  };
  
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
  return (
    <div>
      <Table className={classNames.table} aria-label="simple table">
        <thead>
          <tr>
            <th>Initiative Code</th>
            <th>Nature of Initiative</th>
            <th>Initiative Title</th>
            <th>Business Group</th>
            <th>Organization Unit</th>
            <th>Current Stage</th>
            <th>Current Stage Approver</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", color: "#666" }}>
              There are no items to show in this view.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.nature}</td>
                <td>{item.title}</td>
                <td>{item.businessGroup}</td>
                <td>{item.organizationUnit}</td>
                <td>{item.stage}</td>
                <td>{item.approver}</td>
                <td>
                  <Tooltip title="Edit">
                    {/* <IconButton onClick={() => setIsDrawerOpen(item.title)}>
                      <EditIcon />
                    </IconButton> */}
                    <IconButton onClick={() => handleEditClick(item.id)}>
                      <EditIcon />
                    </IconButton>

                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
        <IconButton onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1"> Page {currentPage}</Typography>
        <IconButton onClick={() => setCurrentPage(currentPage + 1)} disabled={data.length < itemsPerPage}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* <WatchListDrawer
        isDrawerOpen={isDrawerOpen}
        handleCloseDrawer={handleCloseDrawer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dropdownData={dropdownData}
        // selectAll={selectAll}
        // handleSelectAll={handleSelectAll}
        // selectedEmployees={selectedEmployees}
        // handleEmployeeCheckboxChange={handleEmployeeCheckboxChange}
        flag={flag}       // Dynamically passed from URL
        ideaID={ideaID}   // Dynamically passed from URL

        initiativeTitle={isDrawerOpen} // Pass Initiative Title
      /> */}
      <WatchListDrawer
        isDrawerOpen={isDrawerOpen}
        handleCloseDrawer={handleCloseDrawer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        dropdownData={dropdownData}
        selectedEmployees={selectedEmployees}
        handleEmployeeCheckboxChange={handleEmployeeCheckboxChange}
        initiativeTitle={selectedIniDetails?.title}
        employeeWatchList={employeeWatchList}
        selectedInitiativeId={selectedInitiativeId} // Pass selectedInitiativeId
        initiativesID={initiativesID} // Ensure this is set
        employeeId={employeeId} // Ensure this is set
        // initiativesID={selectedInitiativeId}  // Ensure this is passed
        
      />


    </div>
  );
};

export default InitiativeTable;

