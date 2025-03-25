import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { Table } from "react-bootstrap";
import { Dropdown } from "@fluentui/react/lib/Dropdown";

const HistorySectionR = ({ id }) => {
  const [historyData, setHistoryData] = useState([]);
  const [selectedField, setSelectedField] = useState(""); // Modified Field
  const [selectedBy, setSelectedBy] = useState(""); // Modified By
  const [localDropdownOptions, setLocalDropdownOptions] = useState({
    modifiedfield_riskhistory: [],
    modifiedby_riskhistory: [],
  });

  useEffect(() => {
    const fetchDropdownOptions = async () => {
      if (!id) return;
      const token = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksHistory?RiskID=${id}`;

      try {
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

        // Populate Modified Field Dropdown
        // const modifiedFieldOptions = data.data.listModifiedFieldName?.map((item) => ({
        //   key: item.fieldName,
        //   text: item.fieldName,
        // })) || [];

        const modifiedFieldOptions = [
          { key: "", text: "Select Modified Field", disabled: false }, // Always show this first
          ...(
            data.data.listModifiedFieldName?.map((item) => ({
              key: item.fieldName,
              text: item.fieldName,
            })) || []
          ),
        ];
        
        // Populate Modified By Dropdown
        let uniqueModifiedBy = new Set();
        // const modifiedByOptions = data.data.listInitiativeRiskhistory
        //   ?.map((item) => {
        //     if (!uniqueModifiedBy.has(item.modifiedBy)) {
        //       uniqueModifiedBy.add(item.modifiedBy);
        //       return { key: item.modifiedBy, text: item.modifiedBy };
        //     }
        //     return null;
        //   })
        //   .filter(Boolean) || [];
        const modifiedByOptions = [
          { key: "", text: "Select Modified By", disabled: false }, // Always show this first
          ...(
            data.data.listInitiativeRiskhistory
              ?.map((item) => {
                if (!uniqueModifiedBy.has(item.modifiedBy)) {
                  uniqueModifiedBy.add(item.modifiedBy);
                  return { key: item.modifiedBy, text: item.modifiedBy };
                }
                return null;
              })
              .filter(Boolean) || []
          ),
        ];
        

        setLocalDropdownOptions({
          modifiedfield_riskhistory: modifiedFieldOptions,
          modifiedby_riskhistory: modifiedByOptions,
        });
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownOptions();
  }, [id]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!id) return;

      const token = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksHistory?RiskID=${id}&FiledName=${selectedField}&ModifiedBy=${selectedBy}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();
        setHistoryData(data.data.listInitiativeRiskhistory || []);
      } catch (error) {
        console.error("Error fetching table data:", error);
        setHistoryData([]);
      }
    };

    fetchTableData();
  }, [selectedField, selectedBy, id]);

  const handleFieldChange = (_, option) => {
    setSelectedField(option?.key || "");
    setSelectedBy(""); // Reset Modified By when Field changes
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
            selectedKey={selectedField || null}
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
          {historyData.length > 0 ? (
            historyData.map((row, index) => (
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

