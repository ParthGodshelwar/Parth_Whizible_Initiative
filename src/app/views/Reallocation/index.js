import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import GetInitiativesReallocation from '../../hooks/IniReallocation/GetInitiativesReallocation';
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { TableContainer, TableBody, TableRow, TableCell } from "@mui/material";
import { FaAngleRight } from "react-icons/fa";
import SearchAdvanceForm from "./SearchAdvanceForm";
import { Checkbox, Dropdown, PrimaryButton, Stack, Text } from "@fluentui/react";
import "../../style_custom.css";
import axios from "axios";
import { toast } from "react-toastify";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    currentApprover: "",
    natureOfInitiativeId: "",
    businessGroupId: "",
    stageOfApprovalId: "",
    initiativeTitle: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [tcurrentPage, setTCurrentPage] = useState(1);
  const [initiatives, setInitiatives] = useState([]);
  const [selectedApprovers, setSelectedApprovers] = useState({});
  const [showIniDetails, setShowIniDetails] = useState(false);
  const [selectedIniDetails, setSelectedIniDetails] = useState([]);
  // const [selectedInitiativename, setSelectedInitiativename] = useState("");
  const [selectedInitiativeId, setSelectedInitiativeId] = useState("");
  const [selectedInitiativeIndex, setSelectedInitiativeIndex] = useState(null);
  const [selectedInitiativeDetails, setSelectedInitiativeDetails] = useState(null);
  const [checkedInitiativeDetails, setCheckedInitiativeDetails] = useState([]);

  const [checkedStages, setCheckedStages] = useState({}); // Store checked checkboxes
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState(initiatives.map(() => false));
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const IdeaId = userdata?.employeeId;

  const checkboxStyles = {
    root: {
      display: "flex",
      justifyContent: "center", // Horizontally center
      alignItems: "center", // Vertically center
    },
    checkbox: {
      selectors: {
        "::after": {
          content: '"✓"',
          fontSize: "16px",
          color: "white",
          paddingRight: "7px"
        }
      }
    },
    checkmark: {
      visibility: "hidden"
    }
  };

  const fetchInitiatives = async () => {
    console.log("Fetching with filters:", searchFilters);
    setShowIniDetails(true);

    // Clear selection when new data is fetched
    setSelectedIniDetails([]);
    setSelectedInitiativeId(null);
    setSelectedInitiativeIndex(null);

    console.log("GetInitiativesReallocation", searchFilters);
    const InitiativeData = await GetInitiativesReallocation(searchFilters);

    console.log("first reallocation", InitiativeData);
    const initiatives = InitiativeData.data.listInitiativeReallocation;
    setInitiatives(initiatives);

    if (initiatives.length > 0) {
      console.log("Initiatives found:", initiatives);
      setSelectedInitiativeDetails(initiatives[0]);
    } else {
      console.log("No initiatives found");
      setSelectedInitiativeDetails([]);
    }
  };

  const fetchDropdownOptions = async (currentApprover) => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = initiatives?.employeeId;

    // console.log("currentApprover objectobject", {initiatives.data.listInitiativeReallocation})

    try {
      // Fetch Nature of Initiative options
      const approvalResponse = await fetch(
        // `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=statusmgtaction&EmpID=${employeeId}`,
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeReallocation/GetApproverForReallocation?userID=${currentApprover}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!approvalResponse.ok) {
        throw new Error("Failed to fetch Nature of Initiative options");
      }

      const approvalData = await approvalResponse.json();
      setRoleOptions(
        approvalData.data.listApproverForReallocation.map((item) => ({
          key: item.employeeID,
          text: item.employeeName
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  useEffect(() => {
    if (searchFilters.currentApprover) {
      fetchDropdownOptions(searchFilters.currentApprover);
    }
  }, [searchFilters.currentApprover]);

  useEffect(() => {
    console.log("searchFilters", searchFilters);
    const { currentApprover, natureOfInitiativeId, businessGroupId } = searchFilters;

    // Check if all required fields are present
    if (currentApprover && natureOfInitiativeId && businessGroupId) {
      // fetchData(currentPage); // Call the fetchData function if all fields are present
      fetchInitiatives();
    }
  }, [searchFilters, currentPage]);

  const legends = ['Approved', 'Pending', 'Delayed']

  function getLegendsColor(legends) {
    switch (legends) {
      case "Approved":
        return "#81cf09";
      case "Pending":
        return "#F5C330";
      case "Delayed":
        return "#f55c30";
      default:
        return "#FFF";
    }
  }

  const getStatus = (stageStatus) => {
    switch (stageStatus) {
      case "Green":
        return "Approved";
      case "Yellow":
        return "Pending";
      case "Red":
        return "Delayed";
      default:
        return ""
    }
  }

  const handleSelectAllChange = (e, checked) => {
    setSelectAllChecked(checked);
  
    setCheckedStages(() => {
      const updatedChecks = {};
  
      if (checked) {
        // Loop through initiatives and check all rows
        selectedIniDetails.reallocationstagesEntity?.forEach((stage) => {
          updatedChecks[`${stage.initiativeID}-${stage.stageID}`] = stage;
        });
      }
  
      return updatedChecks; // If unchecked, it resets to an empty object
    });
  };
  
  const handleIndividualChange = (initiativeID, stageID, checked, rowDetails) => {
    setCheckedStages((prevChecks) => {
      const updatedChecks = { ...prevChecks };
  
      if (checked) {
        updatedChecks[`${initiativeID}-${stageID}`] = rowDetails; // Add checked row
      } else {
        delete updatedChecks[`${initiativeID}-${stageID}`]; // Remove unchecked row
      }
  
      return updatedChecks;
    });
  };

  // Update "Select All" checkbox state 
  useEffect(() => {
    const totalRows = selectedIniDetails.reallocationstagesEntity?.length || 0;
    const checkedCount = Object.keys(checkedStages).length;

    if (checkedCount === totalRows && totalRows > 0) {
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [checkedStages, selectedIniDetails]);

  useEffect(() => {
    const updatedDetails = Object.values(checkedStages); // Extract checked rows
    setCheckedInitiativeDetails(updatedDetails);
    console.log("Checked Initiative Details Updated:", updatedDetails);
  }, [checkedStages]);

  
  {/* Initiative Details on left card start here */}
  const renderInitiativesTable = () => (
    <Card>
      <Card.Header>Initiative Details</Card.Header>
      <Card.Body>
        <TableContainer>
          <Table striped bordered hover>
            <TableBody>
              {initiatives && initiatives.length > 0 ? (
                initiatives.map((initiative, index) => {
                  const isSelected = selectedInitiativeIndex === index;

                  return (
                    <TableRow
                      key={initiative.id}
                      onClick={() => handleInitiativeClick(index)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span style={{ fontSize: "10px", color: "#ab6d98" }}> Initiative Code: {initiative.demandCode} </span>
                          <span style={{ fontSize: "10px", color: "#ab6d98" }}> Organization Unit: {initiative.location} </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="1" style={{ textAlign: "center", color: "#666", fontSize: "12px" }}>
                    There are no items to show in this view.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card.Body>
    </Card>
  );
  {/* Initiative Details on left card end here */}
  
  {/* Initiative Reallocation list view start here */}
  const renderIniReallocationTable = () => {
    // if (initiatives && initiatives.length > 0) {
    return (
      <Table bordered hover>
        <thead>
          <tr>
            <th className="text-center">Status</th>
            <th>Order No.</th>
            <th>Current Stage</th>
            <th>Stage of Approval</th>
            <th>Approvers</th>
            <th>
              {/* Select */}
              <Checkbox
              styles={{ root: { marginLeft: "10px" } }}
              id="IniReallctnCheckAll"
              className="IniReallctnCheck"
              checked={selectAllChecked}
              onChange={handleSelectAllChange}
            />
              {/* <Checkbox
                styles={checkboxStyles}
                id={"IniReallctnCheckAll"}
                className="IniReallctnCheck"
                // checked={!!checkedStages[`${stage.initiativeID}-${stage.stageID}`]} // Check if row is stored
                onChange={(e, checked) => handleSelectAllChange(e, checked)}
              /> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedIniDetails && selectedIniDetails.reallocationstagesEntity?.length > 0 ? (
            selectedIniDetails.reallocationstagesEntity.map((stage, stageIndex) => (
              <tr key={stageIndex}>
                <td>
                  <Tooltip title={getStatus(stage.stageStatus)}>
                    <div
                      className="square-box mx-auto"
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor:
                          stage.stageStatus === "Green"
                            ? "#81cf09"
                            : stage.stageStatus === "Yellow"
                              ? "#F5C330"
                              : "#f55c30"
                      }}
                    ></div>
                  </Tooltip>
                </td>
                <td>{stage.orderNo}</td>
                <td>{stage.currentStage}</td>
                <td>{stage.requestStage}</td>
                <td>
                  <Dropdown
                    key={`${stage.initiativeID}-${stage.stageID}`} // Unique key per row
                    placeholder="Select Approver"
                    options={roleOptions}
                    selectedKeys={selectedApprovers[`${stage.initiativeID}-${stage.stageID}`] || []}
                    multiSelect={true}
                    onChange={(event, option) =>
                      handleApproverSelection(stage.initiativeID, stage.stageID, option)
                    }
                    style={{ width: "200px" }}
                  />
                </td>
                <td className="text-center">
                  <Checkbox
                    styles={{ root: { marginLeft: "10px" } }}
                    id={`IniReallctnCheck${stageIndex}`}
                    className="IniReallctnCheck"
                    checked={!!checkedStages[`${stage.initiativeID}-${stage.stageID}`]}
                    onChange={(e, checked) =>
                      handleIndividualChange(stage.initiativeID, stage.stageID, checked, stage)
                    }
                  />
                  {/* <Checkbox
                    styles={checkboxStyles}
                    id={`IniReallctnCheck${stageIndex}`}
                    className="IniReallctnCheck"
                    checked={!!checkedStages[`${stage.initiativeID}-${stage.stageID}`]} // Check if row is stored
                    onChange={(e, checked) =>
                      handleIndividualChange(stage.initiativeID, stage.stageID, checked, stage) // Pass full row data
                    }
                  /> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", color: "red" }}>
                Please select an initiative to view details.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    )
    // }
  }
  {/* Initiative Reallocation list view end here */}

  const handleInitiativeClick = async (index) => {
    // Update selected index
    
    // **Reset checkboxes in thead & tbody**
    setSelectAllChecked(false);  // Uncheck "Select All"
    setCheckedStages({});        // Uncheck all initiative stages
    setCheckedInitiativeDetails([]);
    
    // Fetch initiative-specific details (if needed)
    const selectedInitiative = initiatives[index];
    console.log("selectedInitiative", selectedInitiative)
    
    setSelectedInitiativeIndex(index);
    
    setSelectedInitiativeId(selectedInitiative.initiativeID);
    setSelectedIniDetails(selectedInitiative);
  };

  useEffect(() => {
    console.log("Updated selectedInitiativeId:", selectedInitiativeId);
  }, [selectedInitiativeId]);

  const handleApproverSelection = (initiativeID, stageID, option) => {
    const key = `${initiativeID}-${stageID}`;

    setSelectedApprovers((prevSelected) => {
      const updatedSelections = { ...prevSelected };
      const currentSelection = updatedSelections[key] || [];

      updatedSelections[key] = option.selected
        ? [...currentSelection, option.key] // Add selected approver
        : currentSelection.filter((key) => key !== option.key); // Remove unselected approver

      return updatedSelections;
    });
  };

  const handleReallocationSave = async () => {
    const { natureOfInitiativeId } = searchFilters;
    const token = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    if (!token) {
      toast.error("Authentication token is missing.");
      return;
    }

    // if (Object.keys(checkedStages).length === 0) {
    //   toast.error("Please select at least one record.");
    //   return;
    // }

    if (checkedInitiativeDetails.length === 0) {
      toast.error("Please select at least one initiative to reallocate.");
      return;
    }

    try {
      let missingApprover = false;

      // Iterate over selected initiatives
      const requests = checkedInitiativeDetails.map(async (initiative) => {
        const selectedStageIDs = initiative.stageID; // Get stage ID for this initiative
        const selectedApproversForInitiative = selectedApprovers[`${initiative.initiativeID}-${initiative.stageID}`] || [];

        if (selectedApproversForInitiative.length === 0) {
          missingApprover = true;
          return;
        }

        console.log(`Saving Initiative ${initiative.initiativeID} with Approvers:`, selectedApproversForInitiative);

        const postUrl = `https://pms.whizible.com/APIWithJWTToken/api/InitiativeReallocation/PostApproverForReallocation`;

        // Format ApproversList as comma-separated values
        const queryParams = new URLSearchParams({
          IdeaID: initiative.initiativeID,
          NOI: natureOfInitiativeId,
          StageID: selectedStageIDs,
          ApproversList: selectedApproversForInitiative.join(","), // Convert array to string
          UserID: employeeId,
        }).toString();

        // Send API request
        return axios.post(`${postUrl}?${queryParams}`, null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      });

      // If any initiative was missing approvers, show the error and return early
      if (missingApprover) {
        toast.error("Please select at least one approver.");
        return;
      }

      // Wait for all API requests to complete
      const responses = await Promise.all(requests);

      // Check if all requests were successful
      if (responses.every((response) => response?.data)) {
        toast.success("Initiative Reallocated Successfully.");
        
        // **Ensure list refresh happens after state update**
        // setCheckedStages({});
        // setCheckedInitiativeDetails([]);
        // setIndividualChecks(initiatives.map(() => false)); // Reset individual checkbox states
        // setSelectAllChecked(false);
        // setSelectedApprovers({});

        setCheckedStages({});
        setCheckedInitiativeDetails([]);
        setIndividualChecks(initiatives.map(() => false));
        setSelectAllChecked(false);
        setSelectedApprovers({});
        setSelectedIniDetails([]); // Clear initiative selection
        setSelectedInitiativeId(null);
        setSelectedInitiativeIndex(null);

        // **Ensure list refresh happens after state update**
        await fetchInitiatives();

      } else {
        toast.error("Initiatives Failed to Reallocate.");
      }

    } catch (error) {
      console.error("Error Reallocating Initiatives:", error);
      toast.error("Error occurred while saving.");
    }
  };

  return (
    <div className="container mt-3">
      <div className="stage-status d-flex justify-content-between mt-3 mb-2">
        <div className="stage-title">
          <Stack>
            <Stack.Item grow style={{ display: "flex", justifyContent: "end" }}>
              <Text variant="small">Initiative Reallocation helps to manage the approval process such a way
                that an initiative is not 'stranded' at any stage. So the approval process continues smoothly...</Text>
            </Stack.Item>
          </Stack>
        </div>
        <div className="stage-content d-flex align-items-center">
          {/* Legends Section start here */}
          <ul className="list-unstyled main-box mb-0 d-flex gap-3 ml-2">
            {legends.map((legend, index) => (
              <li className="d-flex gap-1" key={index}>
                <div className="StageboxDiv"
                  style={{ backgroundColor: getLegendsColor(legend), width: "15px", height: "15px", borderRadius: "2px" }}
                ></div>
                <div className="span-clrs">{legend}</div>
              </li>
            ))}
          </ul>
          {/* Legends Section end here */}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <SearchAdvanceForm
            onClose={() => setShowForm(false)}
            searchFilters={searchFilters}
            onSearch={(searchType, formValues) => {
              console.log("Search triggered", searchType, formValues);
              setSearchFilters(searchType);
            }}
            setShowIniDetails={setShowIniDetails}
            setInitiatives={setInitiatives}
          />
        </div>
      </div>

      {showIniDetails && (
        <div className="IniReallocationDiv">
          <div className="row">
            <div className="col-md-4">
              {renderInitiativesTable()}
            </div>
            <div className="col-md-8">
              {initiatives && initiatives.length > 0 && (
                <>
                  {/* Save Button */}
                  <Box display="flex" justifyContent="flex-end" mb={3}>
                    <PrimaryButton text="Save" onClick={() => handleReallocationSave(selectedInitiativeId)} />
                  </Box>

                  {/* Initiative Details on top of list view start here */}
                  <Stack horizontal horizontalAlign="space-between" style={{ marginBottom: "10px" }}>
                    <Typography variant="small">
                      <span className="fw-500">Initiative Title: </span>
                      <span>{selectedIniDetails.title}</span>
                    </Typography>
                    <Typography variant="small">
                      <span className="fw-500">Initiative Code: </span>
                      <span>{selectedIniDetails.demandCode}</span>
                    </Typography>
                    <Typography variant="small">
                      <span className="fw-500">Selected Approver: </span>
                      <span>{selectedIniDetails.employeeName}</span>
                    </Typography>
                  </Stack>
                  {/* Initiative Details on top of list view end here */}

                  {/* Initiative Reallocation list view start here */}
                  {renderIniReallocationTable()}
                  {/* Initiative Reallocation list view end here */}
                </>
              )}

              {/* <div>
                </div> */}
              {/* <div className="mt-4 d-flex justify-content-center">
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                  <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                    <ArrowBackIcon />
                  </IconButton>
                  <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage}</Typography>
                  <IconButton
                    onClick={handleNextPage}
                    disabled={tableData.length === 0 || tableData.length < 5}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
