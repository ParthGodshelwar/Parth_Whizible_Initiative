import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper
} from "@mui/material";
import { Table } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Dropdown, Label, Stack } from "@fluentui/react";

const InitiativeSelection = ({ onClose, onSelectInitiative }) => {
  const initialState = {
    natureOfInitiativeId: "",
  };
  const [formValues, setFormValues] = useState(initialState);
  const [initiatives, setInitiatives] = useState([]);
  const [natureOfInitiative, setNatureOfInitiative] = useState(""); // Default to empty to fetch all data
  const [currentPage, setCurrentPage] = useState(1);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchDropdownOptions();
    fetchData(""); // Fetch all initiatives by default
  }, []);

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
  
    try {
      const natureResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=newnatureofinitiative&EmpID=${employeeId}`,
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
  
      // Add default "Select Nature of Initiative" option
      const initiativeOptions = [
        { key: "", text: "Select Nature of Initiative" }, // Default option
        ...(natureData?.data?.listInitiativeDetailDropDownEntity?.map((item) => ({
          key: item.id,
          text: item.name
        })) || [])
      ];
  
      setNatureOfInitiativeOptions(initiativeOptions);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
      setNatureOfInitiativeOptions([{ key: "", text: "Select Nature of Initiative" }]); // Fallback option
    }
  };
  
  // const fetchData = async (natureId) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditInitiativeList?NatureofDemandID=${natureId}&PageNo=${currentPage}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
  //         }
  //       }
  //     );
  //     const result = await response.json();
  //     setInitiatives(result?.data?.listExternalAuditInitiative);
  //   } catch (error) {
  //     console.error("Error fetching initiatives:", error);
  //   }
  // };

  // Fetch data whenever natureOfInitiative or currentPage changes
  
  const fetchData = async (natureId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditInitiativeList?NatureofDemandID=${natureId || ""}&PageNo=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const result = await response.json();
      setInitiatives(result?.data?.listExternalAuditInitiative || []);
    } catch (error) {
      console.error("Error fetching initiatives:", error);
    }
  };

  
  useEffect(() => {
    fetchData(natureOfInitiative);
  }, [currentPage, natureOfInitiative]); // Triggers whenever selection changes

  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || "";
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  
    if (fieldId === "natureOfInitiativeId") {
      setNatureOfInitiative(value);
      setCurrentPage(1); // Reset to first page
  
      if (value === "") {
        fetchData(""); // Fetch all records when "Select Nature of Initiative" is chosen
      } else {
        fetchData(value); // Fetch specific records
      }
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSelectInitiative = (initiative) => {
    onSelectInitiative(initiative);
    onClose();
  };

  const fieldWidth = "320px";
  return (
    <Paper style={{ padding: 20 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#f5f5f5", padding: "8px" }}
      >
        <Typography variant="h6">Initiative Selection</Typography>
        <IconButton onClick={onClose}>
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>
      </Box>
      <Box my={2}>
        <Stack tokens={{ childrenGap: 15 }}>
          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="natureOfInitiativeId">Nature of Initiative</Label>
            <Dropdown
                  id="natureOfInitiativeId"
                  placeholder="Select Nature of Initiative"
                  options={natureOfInitiativeOptions}
                  selectedKey={formValues.natureOfInitiativeId || ""}
                  onChange={handleInputChange}
                />
          </Stack.Item>

          </Stack>
        </Stack>
      </Box>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Initiative Title</th>
            <th>Nature of Initiative</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
  {initiatives.length === 0 ? (
    <tr>
      <td colSpan={5} style={{ textAlign: "center", color: "#666" }}>
        There are no items to show in this view.
      </td>
    </tr>
  ) : (
    initiatives.map((initiative) => (
      <tr key={initiative.initiativeID}>
        <td>{initiative.initiativeTitle}</td>
        <td>{initiative.natureofDemand}</td>
        <td>{initiative.expectedStartDate}</td>
        <td>{initiative.expectedEndDate}</td>
        <td className="text-center">
          <Tooltip title="Select" sx={{ cursor: "pointer" }}>
            <CheckCircleOutlineIcon
              className="text-center"
              style={{ fontSize: "19px", color: "#2f46e9" }}
              onClick={() => handleSelectInitiative(initiative)}
            />
          </Tooltip>
        </td>
      </tr>
    ))
  )}
</tbody>

      </Table>

      <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1">Page {currentPage}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={!initiatives || initiatives.length === 0 || initiatives.length < 5}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default InitiativeSelection;
