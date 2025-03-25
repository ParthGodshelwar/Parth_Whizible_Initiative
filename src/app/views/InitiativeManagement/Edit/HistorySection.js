import React, { useEffect, useState } from "react";
import { Grid, Typography, Select, MenuItem, Paper } from "@mui/material";
import { Table } from "react-bootstrap";
import { Dropdown } from "@fluentui/react/lib/Dropdown";

const HistorySection = ({ dropdownOptions }) => {
  const [historyData, setHistoryData] = useState([]);
  const [selectedField, setSelectedField] = useState(""); // State for Modified Field
  const [selectedBy, setSelectedBy] = useState(""); // State for Modified By

  console.log("dropdownOptions99999999999", dropdownOptions);
  useEffect(() => {
    const fetchHistoryData = async () => {
      const token = sessionStorage.getItem("access_token");
      const riskID = 1; // Replace with dynamic value if needed
      const fieldName = selectedField || ""; // Use selectedField or default
      const modifiedBy = selectedBy || ""; // Use selectedBy or default

      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksHistory?RiskID=${riskID}&FiledName=${fieldName}&ModifiedBy=${modifiedBy}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.error("Error fetching history data:", data);
        setHistoryData(data.data.listInitiativeRiskhistory || []); // Use listInitiativeRiskhistory here
      } catch (error) {
        console.error("Error fetching history data:", error);
      }
    };

    fetchHistoryData();
  }, [selectedField, selectedBy]); // Re-fetch data when dropdown values change

  // Handlers for dropdown changes
  const handleFieldChange = (event, option) => {
    setSelectedField(option?.key || "");
  };

  const handleByChange = (event, option) => {
    setSelectedBy(option?.key || "");
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
            Modified Field
          </Typography>
          <Dropdown
            placeholder="Select Modified Field"
            options={dropdownOptions.modifiedfield_riskhistory}
            selectedKey={selectedField || null}
            onChange={handleFieldChange}
            styles={{ dropdown: { width: 200 } }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
            Modified By
          </Typography>

          <Dropdown
            placeholder="Select Modified By"
            options={dropdownOptions.responsibility}
            selectedKey={selectedBy || null}
            onChange={handleByChange}
            styles={{ dropdown: { width: 200 } }}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        mt={2}
        mb={2}
        sx={{
          backgroundColor: "#f0f0f0",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* <Grid item xs={6}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#333"
            }}
          >
            Audit Trail
          </Typography>
        </Grid> */}
        <Grid item xs={6} textAlign="right">
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              color: "#333",
              mr: 2
            }}
          >
            Risk
          </Typography>
        </Grid>
      </Grid>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Modified Field</th>
            <th>Modified Date</th>
            <th>Value</th>
            <th>Modified By</th>
          </tr>
        </thead>
        <tbody>
          {historyData.length > 0 ? (
            historyData.map((row, index) => (
              <tr key={index}>
                <td>{row.fieldName}</td>
                <td>
                  {new Date(row.modifiedDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                </td>
                <td>{row.value || "N/A"}</td>
                <td>{row.modifiedBy}</td>
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
    </div>
  );
};

export default HistorySection;
