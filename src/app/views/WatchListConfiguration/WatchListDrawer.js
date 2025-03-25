

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
// import { Table } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
// import { Dropdown } from "@fluentui/react";
import { DefaultButton, Stack } from "@fluentui/react";

// import Tooltip from "@mui/material/Tooltip";
import { Dropdown, PrimaryButton } from "@fluentui/react";
import { Col, Form, Row, Table } from "react-bootstrap";
import fetchFilters from "../../hooks/SearchFilters/filters";
const WatchListDrawer = ({
  isDrawerOpen,
  handleCloseDrawer,
  activeTab,
  setActiveTab,
  dropdownData = {},
  selectAll,
  handleSelectAll,
  selectedEmployees = {},
  handleEmployeeCheckboxChange,
  initiativeTitle,
  selectedInitiativeId,
  employeeWatchList, auditor, vendors, onClose, onSelectAuditors, initiativesID, employeeId }) => {
  const initialState = {
    businessGroupId: "",
    organizationUnitId: "",
    stageOfApprovalId: "",
  };
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [formValues, setFormValues] = useState(initialState);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
  const [roleOptions, setRoleOptions] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [selectedAuditors, setSelectedAuditors] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [organizationUnitOptions, setOrganizationUnitOptions] = useState([]);
  const [selectedBusinessGroup, setSelectedBusinessGroup] = useState(
    formValues.businessGroupId || null // Load saved selection
  );

  // const itemsPerPage = 5;
  const [searchFilters, setSearchFilters] = useState({
    businessGroupId: "",
    organizationUnitId: "",
    roleId: "",
  });
  useEffect(() => {
    const storedAuditors = sessionStorage.getItem("selectedAuditors");
    if (storedAuditors) {
      setSelectedAuditors(JSON.parse(storedAuditors));
    } else {
      setSelectedAuditors([]); // 🔹 Reset if no stored auditors
    }
  }, []);

  // const handleInputChange = (e, option) => {
  //   const fieldId = e.target.id || e.target.name;
  //   const value = option?.key || e.target.value;

  //   const updatedFormValues = {
  //     ...formValues,
  //     [fieldId]: value
  //   };
  //   if (fieldId == "businessGroupId") updatedFormValues.organizationUnitId = "";
  //   setFormValues(updatedFormValues);

  //   // Save updated form values to sessionStorage
  //   sessionStorage.setItem("formValues", JSON.stringify(updatedFormValues));

  //   if (fieldId === "businessGroupId") {
  //     setSelectedBusinessGroup(value);
  //   }
  // };
  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;
  
    const updatedFormValues = {
      ...formValues,
      [fieldId]: value,
    };
  
    setFormValues(updatedFormValues);
  
    sessionStorage.setItem("formValues", JSON.stringify(updatedFormValues));
  
    if (fieldId === "businessGroupId") setSelectedBusinessGroup(value);
  
    // Ensure fetch uses latest formValues after state update
    setTimeout(() => fetchAuditors(), 0);
  };

  useEffect(() => {
    // Update organization unit options based on the selected business group
    if (selectedBusinessGroup) {
      const businessGroup = businessGroupOptions.find((bg) => bg.key === selectedBusinessGroup);
      if (businessGroup) {
        setOrganizationUnitOptions(
          businessGroup.initiativeLocationFilter.map((location) => ({
            key: location.locationID,
            text: location.location
          }))
        );
      } else {
        setOrganizationUnitOptions([]);
      }
    } else {
      setOrganizationUnitOptions([]); // Clear options if no business group is selected
    }
  }, [selectedBusinessGroup, businessGroupOptions]);
  useEffect(() => {
    fetchDropdownOptions();
    fetchAuditors(); // Ensure initial load of data
  }, []);
  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // replace with your actual initiativesID
      // Fetch Role options
      const natureResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=roleid`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!natureResponse.ok) {
        throw new Error("Failed to fetch Nature of Initiative options");
      }

      const natureData = await natureResponse.json();
      setRoleOptions(
        natureData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );


      // Fetch Business Group options
      const data = await fetchFilters(); // Call the imported filters function
      console.log("Filters", data);
      setBusinessGroupOptions(
        data?.initiativeBusinessGroupFilter?.map((group) => ({
          key: group.businessGroupID,
          text: group.businessGroup,
          initiativeLocationFilter: group.initiativeLocationFilter // Add locations to the group
        }))
      );

    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }

  };

const fetchAuditors = async () => {
    const initiativeId = selectedInitiativeId || 1;
    const { businessGroupId, organizationUnitId, roleId } = formValues;
  
    console.log("API Params:", { businessGroupId, organizationUnitId, roleId });
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetEmployeeWatchList?Flag=1&IdeaID=${initiativeId}&BG=${businessGroupId || ''}&OU=${organizationUnitId || ''}&Role=${roleId || ''}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch auditors");
      const result = await response.json();
      console.log("Fetched Data:", result.data);
  
      setAuditors(result.data?.listOfEmployeeWatchListConfigurationEntity || []);
    } catch (error) {
      console.error("Error fetching auditors:", error);
    }
  };
  
  
  console.log("Auditors State:", auditors);
  useEffect(() => {
    console.log("Selected Initiative ID:", selectedInitiativeId);
    if (selectedInitiativeId) {
      fetchAuditors();
    }
  }, [selectedInitiativeId, searchFilters]);
  useEffect(() => {
    fetchAuditors();
  }, [selectedRole, selectedOrgUnit, selectedDepartment]); // Include currentPage

  const handleCheckboxChange = (auditor) => {
    setSelectedAuditors((prevSelected) => {
      const isSelected = prevSelected.some((a) => a.employeeID === auditor.employeeID);
      const updatedSelection = isSelected
        ? prevSelected.filter((a) => a.employeeID !== auditor.employeeID)
        : [...prevSelected, { employeeID: auditor.employeeID, userName: auditor.employeeName }];

      // Store selected auditors in sessionStorage
      sessionStorage.setItem("selectedAuditors", JSON.stringify(updatedSelection));

      return updatedSelection;
    });
  };


  useEffect(() => {
    console.log("Employee Watch List:", employeeWatchList);
  }, [employeeWatchList]);


  const fetchVendor = async () => {
    const initiativeId = selectedInitiativeId || 1; // Use default value if not set
    console.log("Using Initiative ID:", initiativeId); // Debugging line

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetVendorWatchListConfiguration?Flag=0&IdeaID=${initiativeId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch vendor");
      const result = await response.json();
      // setVendor(result.data?.listExternalAuditAuditorEntity || []);
      setVendor(result.data?.listOfVendorWatchListConfigurationEntity || []);

    } catch (error) {
      console.error("Error fetching vendor:", error);

    }
  };
  console.log("Auditors State:", vendor);
  useEffect(() => {
    console.log("Selected Initiative ID:", selectedInitiativeId);
    if (selectedInitiativeId) {
      fetchVendor();
    }
  }, [selectedInitiativeId, searchFilters]);
  
  const fieldStyle = { width: "100%" };
  const dropdownStyles = { dropdown: { width: "100%" } };


  return (
    <Drawer anchor="right" open={isDrawerOpen} onClose={handleCloseDrawer} PaperProps={{ sx: { width: "70vw", padding: 2 } }}>
      <div className="mb-1" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f5f5f5", padding: "10px" }}>
        <Typography variant="h6"> Watch List Configuration Details</Typography>
        <IconButton onClick={handleCloseDrawer}>
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>
      </div>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ marginBottom: 2 }}>
        <Tab label="Employee" sx={{ textTransform: "none" }} />
        <Tab label="Vendor" sx={{ textTransform: "none" }} />
      </Tabs>

      {/* Employee Tab */}
      {activeTab === 0 && (
        <Box>
          <Box display="flex" gap={2} my={2}>
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group controlId="">
                    <Form.Label className="">Business Group</Form.Label>

                    <Dropdown
                      id="businessGroupId"
                      placeholder="Select Business Group"
                      options={[{ key: "", text: "Select Business Group" }, ...businessGroupOptions]}
                      selectedKey={formValues.businessGroupId} // Set value to the form value
                      onChange={handleInputChange}
                      styles={{ dropdown: { width: "250px" } }}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="">
                    <Form.Label className="">Organization Unit</Form.Label>
                    <Dropdown
                      id="organizationUnitId"
                      placeholder="Select Organization Unit"
                      options={[{ key: "", text: "Select Organization Unit" }, ...organizationUnitOptions]}
                      selectedKey={formValues.organizationUnitId}
                      onChange={handleInputChange}
                      styles={{ dropdown: { width: "250px" } }}
                      disabled={!selectedBusinessGroup}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="">
                    <Form.Label className="">Role</Form.Label>
                    <Dropdown
                      id="role"
                      placeholder="Select Role"
                      options={[{ key: "", text: "Select Role" }, ...roleOptions]}
                      selectedKey={formValues.role}
                      onChange={handleInputChange}
                      styles={{ dropdown: { width: "250px" } }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              padding: 2,
              marginBottom: 2
            }}
          >
            <Typography>Watch List Configuration</Typography>
            <Typography>
              Initiative Title:<b>{initiativeTitle || "N/A"}</b>
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", marginTop: 2, maginBottom: 2 }}>
            {/* <Button variant="contained" color="primary">
              Save
            </Button> */}
            <DefaultButton text="Save" primary class="mb-3">Save</DefaultButton>
          </Box>

          <Table striped bordered hover sx={{ marginTop: 2 }}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {auditors?.length > 0 ? (
                auditors.map((auditor, index) => (
                  <tr key={auditor.employeeID}>
                    <td>{auditor.employeeName || "N/A"}</td>
                    <td>
                      <Checkbox
                        className=""
                        checked={selectedAuditors.some((a) => a.employeeID === auditor.employeeID)}
                        onChange={() => handleCheckboxChange(auditor)}
                      />
                    </td>
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
        </Box>
      )}
      {/* Vendor Tab */}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              padding: 2,
              marginBottom: 2
            }}
          >
            <Typography>Watch List Configuration</Typography>
            <Typography>
              Initiative Title:<b>{initiativeTitle || "N/A"}</b>
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", marginTop: 2, maginBottom: 2 }}>
            {/* <Button variant="contained" color="primary">
                  Save
                </Button> */}
            <DefaultButton text="Save" sx={{ marginTop: 2 }} primary>Save</DefaultButton>
          </Box>

          <Table striped bordered hover >
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vendor?.length > 0 ? (
                vendor.map((vendors, index) => (
                  <tr key={vendors.employeeID}>
                    <td>{vendors.vendor || "N/A"}</td>
                    <td>
                      <Checkbox
                        className=""
                        checked={selectedAuditors.some((a) => a.employeeID === vendors.employeeID)}
                        onChange={() => handleCheckboxChange(vendors)}
                      />
                    </td>
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
        </Box>
      )}
    </Drawer>
  );
};

export default WatchListDrawer;

