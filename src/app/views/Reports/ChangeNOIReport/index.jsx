import React, { useEffect, useState } from "react";
import { Pivot, PivotItem, Stack, Text} from "@fluentui/react";
import NatureOfInitiativeReport from "./NatureOfInitiativeReport";
import fetchFilters from "../../../hooks/InitiativeReports/GetDelayedInitiativeDetails";
import RefreshIcon from '@mui/icons-material/Refresh';
import { toast } from "react-toastify";
import pdf from "../../../../assets/img/pdf.svg";
import xls from "../../../../assets/img/xls.svg";
import "../../../style_custom.css";
import { Tooltip } from "@mui/material";


const NatureOfInitiativeList = () => {
  const [searchFilters, setSearchFilters] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const initialState = {
    // IPeriod: "",
    intOldNOI: "",
    // intNewNOI: employeeId,
    intNewNOI: "",
    IPeriod: "",
    intEmployeeID: employeeId,
    // empId: "",
  };

  const [formValues, setFormValues] = useState(initialState);
  const accessToken = sessionStorage.getItem("access_token");

  // const loggedInUserName = userdata?.name;
  const employeeID = userdata?.employeeId;

  const loadFilters = async () => {
    try {
      const data = await fetchFilters();
      setSearchFilters(data);
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  const handleDownloadPDF = async () => {
    const { intOldNOI, intNewNOI, IPeriod, intEmployeeID } = formValues;
    console.log("formValues3333", formValues); // Debugging log
    if (!accessToken || !employeeID) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    // Validate Period
    if (!IPeriod) {
      toast.error("Period should not be left blank.");
      return;
    }
    
    // Validate Old or New Nature Of Initiative
    if (!intOldNOI && !intNewNOI) {
      toast.error("Please select either Old Nature of Initiative or New Nature of Initiative.");
      return;
    }
  
    // Construct the API URL with the selected IPeriod
    const url = `https://pms.whizible.com/APIWithJWTToken/api/ReportChangeNaOfIni/GetRptChangeNaOfIniPdf?intOldNOI=${intOldNOI}&intNewNOI=${intNewNOI}&intPeriod=${IPeriod}&intEmployeeID=${intEmployeeID}`;
    
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
  
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Change_NOI_Report.pdf";
      link.click();
      toast.success("PDF report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF.");
    }
  };
  
  const handleDownloadExcel = async () => {
    const { IPeriod, intOldNOI, intNewNOI, intEmployeeID} = formValues;
    console.log("formValues333", formValues);
    if (!accessToken || !employeeID) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    // Validate Period
    if (!IPeriod) {
      toast.error("Period should not be left blank.");
      return;
    }

    // Validate Old or New Nature Of Initiative
    if (!intOldNOI && !intNewNOI) {
      toast.error("Please select either Old Nature of Initiative or New Nature of Initiative.");
      return;
    }

    const url = `https://pms.whizible.com/APIWithJWTToken/api/ReportChangeNaOfIni/GetRptChangeNaOfIniExcel?intPeriod=${IPeriod}&intOldNOI=${intOldNOI}&intNewNOI=${intNewNOI}&intEmployeeID=${intEmployeeID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Excel");
      }

      // Handle response (e.g., download the file)
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Change_NOI_Report.xlsx";
      link.click();

      // Show success toast
      toast.success("Excel report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      // Show error toast
      toast.error("Failed to download Excel.");
    }
  };

  const handleClearSearch = () => {
    setFormValues({
      ...initialState,
      intEmployeeID: "", 
    });
    // Clear saved form values from sessionStorage
    sessionStorage.removeItem("formValues");
  };
  
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-between">
          <Pivot>
            <PivotItem headerText="Change Nature Of Initiative">
              <NatureOfInitiativeReport
                searchFilters={searchFilters}
                formValues={formValues}
                setFormValues={setFormValues}
                employeeID={employeeID}
              />
            </PivotItem>
          </Pivot>

          <div id="topActions" style={{ marginTop: "20px" }}
            className="d-flex gap-2 justify-content-end align-items-start"
          >
            <Tooltip title="Clear Fields">
              <RefreshIcon onClick={handleClearSearch} style={{ color: "#f37f07", fontSize: 20 }} />
            </Tooltip>
            <Tooltip title="PDF">
              <span className="cursorLink" onClick={handleDownloadPDF}>
                <img src={pdf} className="me-2" style={{ width: "18px" }} />
                PDF
              </span>
            </Tooltip>
            <Tooltip title="EXCEL">
              <span className="cursorLink" onClick={handleDownloadExcel}>
                <img src={xls} className="me-2" style={{ width: "18px" }} />
                EXCEL
              </span>
            </Tooltip>
          </div>
        </div>
      </div>

      <Stack className="graybg bottom-position">
        <Text variant="small">
          <span style={{ fontWeight: "bold" }}>Note: </span> 
          In some cases output format may not be as good. This is due to inherent reporting engine problems, which are beyond our control.
        </Text>
      </Stack>
    </>
  );
};

export default NatureOfInitiativeList;


