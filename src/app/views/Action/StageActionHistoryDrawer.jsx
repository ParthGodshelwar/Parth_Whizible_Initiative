import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Dropdown } from "@fluentui/react";
// Added by Gauri
import Table from "react-bootstrap/Table";
// End of Added by Gauri

const StageActionHistoryDrawer = ({ actionItemID }) => {
    const [historyData, setHistoryData] = useState([]);
    const [HisCurrentPage, setHisCurrentPage] = useState(1);
    const [selectedField, setSelectedField] = useState(""); // State for Modified Field
    const [selectedBy, setSelectedBy] = useState("");
    const [modifiedFieldOptions, setModifiedFieldOptions] = useState([]);
    const [modifiedByOptions, setModifiedByOptions] = useState([]);

    const fetchDropdownOptions = async () => {
        const userdata = JSON.parse(sessionStorage.getItem("user"));
        const employeeId = userdata?.employeeId;

        try {
            // Fetch Modified Field options
            const modifiedFieldResponse = await fetch(
                `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=modifiedfield_actionitem&UniqueID=${actionItemID}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
                    }
                }
            );

            if (!modifiedFieldResponse.ok) {
                throw new Error("Failed to fetch Nature of Initiative options");
            }

            const modifiedFieldData = await modifiedFieldResponse.json();
            const modFieldOption = modifiedFieldData.data.listInitiativeDetailDropDownEntity.map((item) => ({
                key: item.id,
                text: item.name
            }));

            // Added Text by Gauri on 27 Feb 2025
            setModifiedFieldOptions([
                { key: "", text: "Select Modified Field" },
                ...modFieldOption
            ]);

            // Fetch Modified By options
            const modifiedByResponse = await fetch(
                `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=modifiedby_actionitem&UniqueID=${actionItemID}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
                    }
                }
            );

            if (!modifiedByResponse.ok) {
                throw new Error("Failed to fetch Nature of Initiative options");
            }

            const modifiedByData = await modifiedByResponse.json();
            const modByOption = modifiedByData.data.listInitiativeDetailDropDownEntity.map((item) => ({
                key: item.id,
                text: item.name
            }))

            // Added Text by Gauri on 27 Feb 2025
            setModifiedByOptions([
                { key: "", text: "Select Modified By" },
                ...modByOption
            ]);
        } catch (error) {
            console.error("Error fetching dropdown options:", error);
        }
    };

    useEffect(() => {
        fetchDropdownOptions();
    }, []);

    // Added by Gauri to bind History data on 19 Feb 2025 
    const fetchHistoryData = async () => {
        const token = sessionStorage.getItem("access_token");
        const modifiedField = selectedField || ""; // Use selectedField or default
        const modifiedBy = selectedBy || ""; // Use selectedBy or default

        // const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksHistory?RiskID=${riskID}&FiledName=${fieldName}&ModifiedBy=${modifiedBy}`;
        const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/InitiativeActionItemShowHistory?ActionItemID=${actionItemID}&ModifiedField=${modifiedField}&ModifiedBy=${modifiedBy}&PageNo=${HisCurrentPage}`;

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
            setHistoryData(data.data.actionItemHistory || []); // Use listInitiativeRiskhistory here
        } catch (error) {
            console.error("Error fetching history data:", error);
        }
    };

    useEffect(() => {
        fetchHistoryData();
    }, [selectedField, selectedBy, HisCurrentPage]); // Re-fetch data when dropdown values change
    // End of Added by Gauri to bind History data on 19 Feb 2025

    // Handlers for dropdown changes
    const handleFieldChange = (event, option) => {
        setSelectedField(option?.key || "");
    };

    const handleByChange = (event, option) => {
        setSelectedBy(option?.key || "");
    };

    const handlePreviousPage = () => {
        setHisCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setHisCurrentPage((prevPage) => prevPage + 1);
    };

    return (
        <div>
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: 10 }}>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontSize: "0.775rem" }}>Modified Field</Typography>
                    <Dropdown
                        placeholder="Select Modified Field"
                        options={modifiedFieldOptions}
                        selectedKey={selectedField || null}
                        // onChange={(event, option) => {
                        //     handleInputChange("modifiedField")(option.key)
                        // }}
                        onChange={handleFieldChange}
                        styles={{ dropdown: { width: 200 } }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ fontSize: "0.775rem" }}>Modified By</Typography>
                    <Dropdown
                        placeholder="Select Modified By"
                        options={modifiedByOptions}
                        selectedKey={selectedBy || null}
                        // onChange={(event, option) => {
                        //     handleInputChange("modifiedBy")(option.key)
                        // }}
                        onChange={handleByChange}
                        styles={{ dropdown: { width: 200 } }}
                    />
                </Grid>
            </Grid>

            {/* <Grid container spacing={2} my={2} sx={{ backgroundColor: "#f0f0f0" }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1">Audit Trail</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="subtitle1">Action Items</Typography>
                  </Grid>
                </Grid> */}

            {/* Table format changed by Gauri Start Here */}
            <Table size="small" striped bordered responsive>
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
                                    {new Date(row.date)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")}
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

            {/* Pagination controls */}
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <IconButton onClick={handlePreviousPage} disabled={HisCurrentPage === 1}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {HisCurrentPage}</Typography>
                <IconButton
                    onClick={handleNextPage}
                    disabled={historyData.length === 0}
                >
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
            {/* Table format changed by Gauri End Here */}
        </div>
    )
}

export default StageActionHistoryDrawer