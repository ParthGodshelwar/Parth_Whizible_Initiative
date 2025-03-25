
import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Table } from "react-bootstrap";
import { Dropdown } from "@fluentui/react/lib/Dropdown";

const HistorySectionR = ({ id }) => {
  const [historyData, setHistoryData] = useState([]); // Stores the complete API response
  const [filteredData, setFilteredData] = useState([]); // Stores table data based on filters
  const [selectedField, setSelectedField] = useState(""); // Modified Field
  const [selectedBy, setSelectedBy] = useState(""); // Modified By
  const [localDropdownOptions, setLocalDropdownOptions] = useState({
    modifiedfield_riskhistory: [],
    modifiedby_riskhistory: [],
  });

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!id) return;
      const token = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditShowHistory?UniqueID=${id}`;

      try {
        console.log("🚀 Fetching API Data...");
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        // ✅ Extract complete history data
        const history = data?.data?.externalAuditHistory || [];
        setHistoryData(history); // Store full history data

        // ✅ Extract unique Modified Field values
        const uniqueFields = [...new Set(history.map((item) => item.fieldName))];

        const modifiedFieldOptions = [
          { key: "", text: "Select Modified Field", disabled: false },
          ...uniqueFields.map((field) => ({ key: field, text: field })),
        ];

        // ✅ Extract unique Modified By values
        const uniqueModifiedBy = [...new Set(history.map((item) => item.modifiedBy))];

        const modifiedByOptions = [
          { key: "", text: "Select Modified By", disabled: false },
          ...uniqueModifiedBy.map((by) => ({ key: by, text: by })),
        ];

        setLocalDropdownOptions({
          modifiedfield_riskhistory: modifiedFieldOptions,
          modifiedby_riskhistory: modifiedByOptions,
        });

        setFilteredData(history); // Initialize table with all data
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setHistoryData([]); // Clear state on error
        setFilteredData([]);
      }
    };

    fetchHistoryData();
  }, [id]); // ✅ Fetches API only once when `id` changes

  // ✅ Filter table data based on dropdown selections
  useEffect(() => {
    if (!historyData.length) return;

    const filtered = historyData.filter((item) => 
      (selectedField ? item.fieldName === selectedField : true) &&
      (selectedBy ? item.modifiedBy === selectedBy : true)
    );

    console.log("🔍 Filtered Data:", filtered);
    setFilteredData(filtered);
  }, [selectedField, selectedBy, historyData]);

  const handleFieldChange = (_, option) => {
    setSelectedField(option?.key || "");
  };

  const handleByChange = (_, option) => {
    setSelectedBy(option?.key || "");
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontSize: "0.775rem" }}>
            Modified Field
          </Typography>
          <Dropdown
            placeholder="Select Modified Field"
            options={localDropdownOptions.modifiedfield_riskhistory}
            selectedKey={selectedField || ""}
            onChange={handleFieldChange}
            styles={{ dropdown: { width: 200 } }}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontSize: "0.775rem" }}>
            Modified By
          </Typography>
          <Dropdown
            key={selectedField} // Ensures reset when Field changes
            placeholder="Select Modified By"
            options={localDropdownOptions.modifiedby_riskhistory}
            selectedKey={selectedBy || ""}
            onChange={handleByChange}
            styles={{ dropdown: { width: 200 } }}
          />
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
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.fieldName}</td>
                <td>{new Date(row.modifiedDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
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

export default HistorySectionR;


