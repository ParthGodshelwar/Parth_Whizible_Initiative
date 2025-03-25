
import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Checkbox,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown, PrimaryButton } from "@fluentui/react";
import { Col, Form, Row, Table } from "react-bootstrap";

const AuditorSelection = ({ auditor, onClose, onSelectAuditors, initiativesID, employeeId }) => {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [orgUnitOptions, setOrgUnitOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedOrgUnit, setSelectedOrgUnit] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [auditors, setAuditors] = useState([]);
  const [selectedAuditors, setSelectedAuditors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useEffect(() => {
  //   const storedAuditors = sessionStorage.getItem("selectedAuditors");
  //   if (storedAuditors) {
  //     setSelectedAuditors(JSON.parse(storedAuditors));
  //   }
  // }, []);
  // useEffect(() => {
  //   const storedAuditors = sessionStorage.getItem("selectedAuditors");
  //   if (storedAuditors) {
  //     setSelectedAuditors(JSON.parse(storedAuditors));
  //   } else {
  //     setSelectedAuditors([]); // 🔹 Reset if no stored auditors
  //   }
  // }, []);
  // useEffect(() => {
  //   const storedAuditors = sessionStorage.getItem("selectedAuditors");
  //   if (storedAuditors) {
  //     setSelectedAuditors(JSON.parse(storedAuditors));
  //   } else {
  //     setSelectedAuditors([]); // Reset if no stored auditors
  //   }
  // }, [auditor]); // ✅ Depend on `auditor` to update when selecting a new record
  
  // useEffect(() => {
  //   const storedAuditors = sessionStorage.getItem("selectedAuditors");
  //   setSelectedAuditors(storedAuditors ? JSON.parse(storedAuditors) : []);
  // }, [auditor]); // ✅ Depend on `auditor` to reset when needed
  // useEffect(() => {
  //   const storedAuditors = sessionStorage.getItem("selectedAuditors");
  //   if (storedAuditors) {
  //     setSelectedAuditors(JSON.parse(storedAuditors));
  //   }
  // }, [auditor]); // ✅ Depend on `auditor` to update when selecting a new record
  

  useEffect(() => {
    const storedAuditors = sessionStorage.getItem("selectedAuditors");
    if (storedAuditors) {
      const parsedAuditors = JSON.parse(storedAuditors);
      setSelectedAuditors(parsedAuditors);
    }
  }, [auditor]);

  
  const fetchDropdownOptions = async (fieldName, setOptions) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        }
      );
  
      if (!response.ok) throw new Error(`Failed to fetch ${fieldName} options`);
      const result = await response.json();
  
      let defaultOption = { key: "", text: "" };
  
      // Assign different default options based on the field
      if (fieldName === "departmentid") {
        defaultOption = { key: "", text: "Select Department" };
      } else if (fieldName === "organizationunitid") {
        defaultOption = { key: "", text: "Select Organization Unit" };
      } else if (fieldName === "roleid") {
        defaultOption = { key: "", text: "Select Role" };
      }
  
      // Set the options including the default one
      setOptions([
        defaultOption,
        ...result.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      ]);
    } catch (error) {
      console.error(`Error fetching ${fieldName} options:`, error);
    }
  };
  
  // Fetch Dropdowns on Component Mount
  useEffect(() => {
    fetchDropdownOptions("departmentid", setDepartmentOptions);
    fetchDropdownOptions("organizationunitid", setOrgUnitOptions);
    fetchDropdownOptions("roleid", setRoleOptions);
  }, [initiativesID, employeeId]);

  
  const fetchAuditors = async () => {
    try {
      let departmentFilter = selectedDepartment ? `&DepartmentID=${selectedDepartment}` : "";
      let orgUnitFilter = selectedOrgUnit ? `&locationID=${selectedOrgUnit}` : "";
      let roleFilter = selectedRole ? `&RoleID=${selectedRole}` : "";
  
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditAuditorList?PageNo=${currentPage}${roleFilter}${orgUnitFilter}${departmentFilter}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch auditors");
      const result = await response.json();
      setAuditors(result.data?.listExternalAuditAuditorEntity || []);
    } catch (error) {
      console.error("Error fetching auditors:", error);
    }
  };
  

  useEffect(() => {
    fetchAuditors();
  }, [selectedRole, selectedOrgUnit, selectedDepartment, currentPage]); // Include currentPage

  const handleDropdownChange = (event, option, field) => {
    const value = option?.key || "";
  
    if (field === "department") {
      setSelectedDepartment(value);
    }
    if (field === "organizationUnit") {
      setSelectedOrgUnit(value);
    }
    if (field === "role") {
      setSelectedRole(value);
    }
  
    // Reset pagination and fetch auditors
    setCurrentPage(1); 
  };

  // const handleCheckboxChange = (auditor) => {
  //   setSelectedAuditors((prevSelected) => {
  //     const isSelected = prevSelected.some((a) => a.employeeID === auditor.employeeID);
  //     const updatedSelection = isSelected
  //       ? prevSelected.filter((a) => a.employeeID !== auditor.employeeID)
  //       : [...prevSelected, { employeeID: auditor.employeeID, userName: auditor.userName }];
      
  //     // Store selected auditors in sessionStorage
  //     sessionStorage.setItem("selectedAuditors", JSON.stringify(updatedSelection));
  
  //     return updatedSelection;
  //   });
  // };
  const handleCheckboxChange = (auditor) => {
    setSelectedAuditors((prevSelected) => {
      const isSelected = prevSelected.some((a) => a.employeeID === auditor.employeeID);
      const updatedSelection = isSelected
        ? prevSelected.filter((a) => a.employeeID !== auditor.employeeID)
        : [...prevSelected, { employeeID: auditor.employeeID, userName: auditor.userName }];
  
      sessionStorage.setItem("selectedAuditors", JSON.stringify(updatedSelection));
      return updatedSelection;
    });
  };
  
  
  // Handle Auditor Selection
  const handleSelectAuditors = () => {
    onSelectAuditors(selectedAuditors);
    onClose();
  };

  // Pagination Handlers
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const fieldStyle = { width: "100%" };
  return (
    <Paper style={{ padding: 20 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#f5f5f5", padding: "8px" }}>
        <Typography variant="h6">Auditor Selection</Typography>
        <IconButton onClick={onClose}>
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>
      </Box>

      <Box my={2} display="flex" justifyContent="end">
        <PrimaryButton variant="contained" color="primary" onClick={handleSelectAuditors}>
          Select Auditors
        </PrimaryButton>
      </Box>

      <Box display="flex" gap={2} my={2}>
        <Form>
        <Row>
        <Col md={4}>
              <Form.Group controlId="">
                <Form.Label className="">Department</Form.Label>
                  <Dropdown
                    id="department"
                    placeholder="Select Department"
                    options={departmentOptions}
                    onChange={(e, option) => handleDropdownChange(e, option, "department")}
                    selectedKey={selectedDepartment}
                    styles={{ dropdown: { width: "250px" } }}
                  />
        </Form.Group>
        </Col>
        <Col md={4}>
              <Form.Group controlId="">
                <Form.Label className="">Organization Unit</Form.Label>
                    <Dropdown
                      id="organizationUnit"
                      placeholder="Select Organization Unit"
                      options={orgUnitOptions}
                      onChange={(e, option) => handleDropdownChange(e, option, "organizationUnit")}
                      selectedKey={selectedOrgUnit}
                      styles={{ dropdown: { width: "250px" } }}
                    />
                    </Form.Group>
                    </Col>
                    <Col md={4}>
              <Form.Group controlId="">
                <Form.Label className="">Role</Form.Label>
                    <Dropdown
                      id="role"
                      placeholder="Select Role"
                      options={roleOptions}
                      onChange={(e, option) => handleDropdownChange(e, option, "role")}
                      selectedKey={selectedRole}
                      styles={{ dropdown: { width: "250px" } }}
                    />
          </Form.Group>
          </Col>
        </Row>
        </Form>
      </Box>

      <Table striped bordered hover>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Department</th>
                <th>Organization Unit</th>
                <th>Role</th>
                <th>Action</th>
             </tr>
          </thead>
            <tbody>
            {auditors?.length > 0 ? (
              auditors.map((auditor, index) => (
                <tr key={auditor.employeeID}>
                  <td>{auditor.userName  || "N/A"}</td>
                  <td>{auditor.department || "N/A"}</td>
                  <td>{auditor.location || "N/A"}</td>
                  <td>{auditor.roleDescription  || "N/A"}</td>
                  <td>
                    {/* <Checkbox
                      className=""
                      checked={selectedAuditors.some((a) => a.employeeID === auditor.employeeID)}
                      onChange={() => handleCheckboxChange(auditor)}
                    /> */}
                    <Checkbox
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
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={auditors.length < 5} // Disable if less than 5 entries
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AuditorSelection;

