import React, { useState, useEffect } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import {
  Box,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { Close as CloseIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Dropdown, Label, Text } from "@fluentui/react";

const WorkflowConfiguration = ({ data1, data2, initiativesID }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentStageData, setCurrentStageData] = useState(null);
  const [selectedNOI, setSelectedNOI] = useState(""); // Store selected NOI
  const [selectedNOIName, setSelectedNOIName] = useState("");
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [workflowData, setWorkflowData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNOI1, setSelectedNOI1] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const getSemiCircleStyle = (isFirst, isLast) => {
    return {
      content: '""',
      position: "absolute",
      top: 0,
      bottom: 0,
      left: isFirst ? "-10px" : undefined,
      right: isLast ? "-10px" : undefined,
      width: "15px",
      backgroundColor: "inherit",
      borderLeft: !isLast ? "1px solid #e0e0e0" : undefined,
      borderRight: isLast ? "1px solid #e0e0e0" : undefined,
      borderRadius: "50%",
      zIndex: 0
    };
  };
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetManageWorkFlowStageConfiguration?IdeaID=${initiativesID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => setData(data.data.listStageConfiguration))
      .catch((error) => console.error("Error fetching data:", error));
  }, [accessToken]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(data?.map((item) => item.initiativeStageID));
    } else {
      setSelectedItems([]);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        // Commented and modified NOI parameter value to show details as per selected value from the dropdown stages on 24 Mar 2025
        // `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetManageWorkFlowChangeNOI?IdeaID=${initiativesID}&NOI=${selectedNOI}`,
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetManageWorkFlowChangeNOI?IdeaID=${initiativesID}&NOI=${selectedNOI1}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const result = await response.json();
      setWorkflowData(result);
    } catch (error) {
      console.error("Error fetching workflow data:", error);
    } finally {
      setLoading(false);
    }
  };
  const renderTable = (data) => (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Order</th>
            <th>Stage</th>
            <th>Approvers</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <tr key={index}>
              <td>{item.orderNo}</td>
              <td>{item.requestStage}</td>
              <td>{item.stakeHolderNames}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  useEffect(() => {
    handleClick();
    // Open the drawer
  }, [selectedNOI1]);
  // const getStageStyle = (stage) => {
  //   if (stage.isCurrentStage === 1) return { backgroundColor: "#f5c330", height: "17px" }; // Orange for current stage
  //   if (stage.isStageApplicable) return { backgroundColor: "#03bb29", height: "17px" }; // Green for applicable stages
  //   return { backgroundColor: "#b5b4b4", height: "17px" }; // Gray for non-applicable stages
  // };
  const getStageStyle = (stage) => {
    // if (stage.isCurrentStage === 1) return { backgroundColor: "#f5c330", height: "17px" }; // Orange for current stage
    // if (stage.isStageApplicable) return { backgroundColor: "#03bb29", height: "17px" }; // Green for applicable stages
    // return { backgroundColor: "#b5b4b4", height: "17px" }; // Gray for non-applicable stages

    {/* Commented and Added by Gauri for manage workflow stages on 24 Mar 2025 */}
    if (stage.approved === 1) {
      return { backgroundColor: "#03bb29", height: "17px" }; // Green for "Start" stage
    }
    return { backgroundColor: "#f5c330", height: "17px" }; // Orange for all other stages
  };
  const handleSelectItem = (event, id) => {
    if (event.target.checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSave = () => {
    const selectedStageIDs = selectedItems.join(",");
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/PostStageConfiguration?IdeaID=${initiativesID}&UserID=${employeeId}&SelectedStageIDs=${selectedStageIDs}`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        setOpen(false); // Close the drawer after saving
      })
      .catch((error) => console.error("Error saving data:", error));
  };

  const handleVisibilityClick = () => {
    // Make API call when the visibility icon is clicked
    if(selectedNOI===""){
      console.log("Please select Nature of Initiative");
      setShowPreview(false);
    }
    else{
      setShowPreview(true);
    }
    fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ManageWorkFlow/GetManageWorkFlowPreview?IdeaID=${initiativesID}&NOI=${selectedNOI}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setCurrentStageData(data.data.listManageWorkflowPreview); // Set the current stage data
      })
      .catch((error) => console.error("Error fetching current stage:", error));
  };
  
  console.log("setSelectedNOIName1", data1);

  {/* Commented and Added by Gauri to update NOI dropdown value on 24 Mar 2025 */}
  // useEffect(() => {
  //   setSelectedNOI1(selectedNOI); // Sync drawer dropdown with main dropdown
  // }, [selectedNOI]); // Runs whenever `selectedNOI` changes

  useEffect(() => {
    if (drawerOpen) {
      setSelectedNOI1(selectedNOI); // Bind main dropdown value when opening drawer
    }
  }, [drawerOpen, selectedNOI]); // Runs when `drawerOpen` or `selectedNOI` changes
  
  
  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <Typography
        variant="subtitle1"
        style={{ marginBottom: "20px", fontWeight: "bold" }}
      >
        1. Stage Configuration
      </Typography>
      <div>
        <Typography variant="body1" style={{ marginBottom: "20px" }}>
          {/* Commented and passed data2 values to this component by Gauri on 05 Feb 2025 */}
          {/* You are using 'Budget' Nature Of initiative for '{initiativesID}' Initiative for approval. */}
          You are using <strong>'{data2?.natureofDemand}'</strong> Nature Of
          initiative for <strong>'{data2?.title}'</strong> Initiative for
          approval. Click on&nbsp;
          <a
            href="javascript:;"
            onClick={() => setOpen(true)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Stage Configuration
          </a>
          &nbsp;to skip a few stages from the approval cycle.
        </Typography>
      </div>
      {/* Drawer for Stage Configuration */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: "60vw" },
        }}
      >
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              backgroundColor: "#f0f0f0", // Light grey background color
              padding: "10px", // Optional: add padding to ensure content doesn't touch the edges
              borderRadius: "4px", // Optional: add rounded corners for a smoother look
            }}
          >
            <Typography variant="h6">Nature of Initiative</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </div>

          <TableContainer>
            <Table striped bordered hover>
              <TableHead>
                <TableRow>
                  <TableCell>Nature of Initiative</TableCell>
                  <TableCell align="center">Stage</TableCell>

                  <TableCell align="center">Applicable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((item) => (
                  <TableRow key={item.initiativeStageID}>
                    <TableCell>{item.noi}</TableCell>
                    <TableCell align="center">{item.requestStage}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={selectedItems.includes(item.initiativeStageID)}
                        onChange={(event) =>
                          handleSelectItem(event, item.initiativeStageID)
                        }
                        disabled={item.isDisabled} // Disable checkbox if item.isDisabled is true
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Drawer>
      <Typography
        variant="subtitle1"
        style={{ marginBottom: "20px", fontWeight: "bold" }}
      >
        2. Change Nature of Initiative
      </Typography>
      <div style={{ marginTop: "30px", display: "flex", alignItems: "end" }}>
        {/* <FormControl style={{ width: "200px" }}>
          <InputLabel>Change Nature of Initiative</InputLabel>
          <Select
            label="Change Nature of Initiative"
            value={selectedNOI}
            onChange={(e) => {
              const selectedItem = data1.find((item) => item.natureOfDemandID === e.target.value);
              setSelectedNOI(e.target.value);
              setSelectedNOIName(selectedItem?.natureOfDemand || "");
              console.log("setSelectedNOIName", e.target, data1);
            }}
            fullWidth
          >
            {data1 && data1.length > 0 ? (
              data1.map((item) => (
                <MenuItem key={item.natureOfDemandID} value={item.natureOfDemandID}>
                  {item.natureOfDemand}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No options available</MenuItem>
            )}
          </Select>
        </FormControl> */}

        {/* Dropdown field changed to FluentUI by Gauri start here on 04 Feb 2025 */}
        <div>
          <Label htmlFor="changeNatureOfInitiative">
            Change Nature of Initiative
          </Label>
          {/* Modified NOI dropdown field by Gauri on 24 Mar 2025 */}
          <Dropdown
            id="changeNatureOfInitiative"
            placeholder="Select Nature of Initiative"
            options={[
              { key: "", text: "Select Nature of Initiative" },
              ...(data1 && data1.length > 0
                ? data1.map((item) => ({
                    key: item.natureOfDemandID,
                    text: item.natureOfDemand,
                  }))
                : []),
            ]}
            selectedKey={selectedNOI} // Equivalent to value in MUI
            // onChange={(e, option) => {
            //   const selectedItem = data1.find((item) => item.natureOfDemandID === option?.key);
            //   setSelectedNOI(option?.key);
            //   setSelectedNOIName(selectedItem?.natureOfDemand || "");
            //   console.log("setSelectedNOIName", option?.key, data1);
            // }}
            onChange={(e, option) => {
              setSelectedNOI(option?.key); // Update main dropdown
            }}
            styles={{ dropdown: { width: 200 } }} // Inline width style
          />
        </div>
        {/* Dropdown field changed to FluentUI by Gauri end here on 04 Feb 2025 */}

        <IconButton
          style={{ marginLeft: "16px" }}
          onClick={handleVisibilityClick}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </div>
      <div className="mt-3">
        {/* Modified section UI by Gauri start here on 04 Feb 2025 */}
        <Typography variant="body1">
          Preview for New Initiative Stages : {selectedNOIName}
        </Typography>
        {/* Modified section UI by Gauri end here on 04 Feb 2025 */}

        {showPreview && (
          <div className="my-2" style={{ display: "flex", alignItems: "center", width: "90%" }}>
            {currentStageData?.map((stage, index) => (
              <Tooltip
                key={index}
                title={`Stage ${index + 1}: ${stage.requestStage}`}
                aria-label={`Stage ${index + 1}: ${stage.requestStage}`}
              >
                
                <div
                  id={`stg-bar-${index + 1}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "12px",
                    cursor: "pointer",
                    margin: "0",
                    padding: "5px 10px",
                    lineHeight: "1",
                    flex: index === 0 ? "3" : "1", // Larger flex for the first segment
                    ...getStageStyle(stage),
                  }}
                  data-bs-toggle="tooltip"
                >
                  {/* Add semi-circle before and after for each stage */}
                  {index === 0 && (
                    <div style={getSemiCircleStyle(true, false)} />
                  )}
                  {index === currentStageData.length - 1 && (
                    <div style={getSemiCircleStyle(false, true)} />
                  )}
                  {stage.isCurrentStage === 1 && (
                    <a
                      href="javascript:;"
                      style={{
                        zIndex: 2,
                        position: "relative",
                        fontSize: "8px",
                      }} // Font size set here
                      className="progress-text"
                    >
                      {/* Display with one decimal */}
                    </a>
                  )}
                  {/* Optionally add other content inside the stage */}
                  {/* <span style={{ zIndex: 1 }}> Stage {index + 1}</span> Display stage number */}
                  {/* <span style={{ zIndex: 1 }}>{stage.requestStage}</span>  */}
                  <span
                    style={{
                      zIndex: 1,
                      display: "inline-block",
                      width: "max-content",
                    }}
                  >
                    {stage.requestStage.length > 6
                      ? `${stage.requestStage.slice(0, 6)}...`
                      : stage.requestStage}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
      {/* Modified section UI by Gauri start here on 04 Feb 2025 */}
      <Typography variant="body1" sx={{ marginBottom: "20px" }}>
        If you need new approval cycle,&nbsp;
        <a
          href="#"
          onClick={() => {
            handleClick();
            setDrawerOpen(true);
          }}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Click here
        </a>{" "}
      </Typography>
      {/* Modified section UI by Gauri end here on 04 Feb 2025 */}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 800, padding: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : workflowData ? (
            <>
              {/* Modified by Gauri to fix Offcanvas header UI on 07 Mar 2025 */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 2,
                  backgroundColor: "#f5f5f5",
                  padding: 1,
                  borderRadius: 1,
                }}
              >
                <h5 className="mb-0">Change Nature of Initiative</h5>
                <Tooltip title="Close" arrow>
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* End of Modified by Gauri to fix Offcanvas header UI on 07 Mar 2025 */}

              <div className="details-div">
                <Typography variant="body2">
                  {/* <strong>Initiative:</strong> Workflow Configure Initiative */}
                  <strong>Initiative:</strong> {data2?.title}
                </Typography>
                <Typography variant="body2">
                  {/* <strong>Current Nature of Initiative:</strong> Tool Implementation */}
                  <strong>Current Nature of Initiative:</strong>{" "}
                  {data2?.natureofDemand}
                </Typography>
              </div>

              {/* Dropdown field changed to FluentUI by Gauri start here on 04 Feb 2025 */}
              <div style={{ marginTop: "30px" }}>
                {/* <FormControl style={{ width: "200px" }}>
                  <InputLabel>Change Nature of Initiative</InputLabel>
                  <Select
                    label="Change Nature of Initiative"
                    value={selectedNOI1}
                    onChange={(e) => setSelectedNOI1(e.target.value)}
                    fullWidth
                  >
                    {data1 && data1.length > 0 ? (
                      data1.map((item) => (
                        <MenuItem key={item.natureOfDemandID} value={item.natureOfDemandID}>
                          {item.natureOfDemand}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">No options available</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                <Label htmlFor="changeNatureOfInitiative">
                  Change Nature of Initiative
                </Label>
                <Dropdown
                  id="changeNatureOfInitiative"
                  placeholder="Select Nature of Initiative"
                  options={[
                    { key: "", text: "Select Nature of Initiative" },
                    ...(data1 && data1.length > 0
                      ? data1.map((item) => ({
                          key: item.natureOfDemandID,
                          text: item.natureOfDemand,
                        }))
                      : []),
                  ]}
                  // Commented and Added by Gauri to by default select NOI value on 10 Mar 2025
                  // selectedKey={selectedNOI1} // Equivalent to value in MUI
                  // selectedKey={selectedNOI} // Equivalent to value in MUI
                  // onChange={(e, option) => setSelectedNOI1(option?.key)} // Update selected value
                  // onChange={(e, option) => setSelectedNOI(option?.key)}
                  selectedKey={selectedNOI1} // Drawer dropdown controls selectedNOI1
                  onChange={(e, option) => {
                    setSelectedNOI1(option?.key); // Only update drawer dropdown
                  }}
                  styles={{ dropdown: { width: 200 } }} // Set width
                />
              </div>
              {/* Dropdown field changed to FluentUI by Gauri end here on 04 Feb 2025 */}

              {/* Corrected Changed NOI details by Gauri for manage workflow issue on 24 Mar 2025 */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Changed Nature of Initiative Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTable(workflowData?.data?.listManageWorkChangeNOINOI)}
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Current Nature of Initiative Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {renderTable(workflowData?.data?.listManageWorkCurrentNOI)}
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default WorkflowConfiguration;
