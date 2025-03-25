import { Pivot, PivotItem, PrimaryButton, Stack, Text } from "@fluentui/react";
import React, { useEffect, useState } from "react";
import AgeingReport from "./AgeingReport";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast
import pdf from "../../../../assets/img/pdf.svg";
import xls from "../../../../assets/img/xls.svg";
// import ActionGetReport from "../../hooks/AReports/ActionGetReport";
import fetchFilters from "../../../hooks/InitiativeReports/GetAgeingReport"; // Assume this is the correct import
import "../../../style_custom.css";
import { Tooltip } from "@mui/material";

const AgeingReportList = () => {
  const [searchFilters, setSearchFilters] = useState(null);
  const loadFilters = async () => {
    try {
      const data = await fetchFilters(); // Call the imported filters function
      console.log("Filters", data);
      setSearchFilters(data); // Store the data in state
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };
  useEffect(() => {
    loadFilters(); // Correctly call the function
  }, []);

  // Get the access token and employeeId from session storage
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  // Function to handle PDF download
  const handleDownloadPDF = async () => {
    if (!accessToken || !employeeId) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportAgeing/GetRepAgeingPdf?empId=${employeeId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      // Handle response (e.g., download the file)
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Ageing_Report.pdf";
      link.click();

      // Show success toast
      toast.success("PDF report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Show error toast
      toast.error("Failed to download PDF.");
    }
  };

  // Function to handle Excel download
  const handleDownloadExcel = async () => {
    if (!accessToken || !employeeId) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportAgeing/GetRepAgeingExcel?empId=${employeeId}`;
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
      link.download = "Ageing_Report.xlsx";
      link.click();

      // Show success toast
      toast.success("Excel report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading Excel:", error);
      // Show error toast
      toast.error("Failed to download Excel.");
    }
  };

  return (
    <>
      <div id="ActionItems-Report" className="container">
        <div className="d-flex justify-content-between">
          <Pivot>
            <PivotItem headerText="Ageing Report">
              <AgeingReport searchFilters={searchFilters} />
            </PivotItem>
          </Pivot>

          <div
            id="topActions"
            style={{ marginTop: "20px" }}
            className="d-flex gap-2 justify-content-end align-items-start"
          >
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
          In some cases output format may not be as good. This is due to inherent reporting engine
          problems, which are beyond our control.
        </Text>
      </Stack>
    </>
  );
};
export default AgeingReportList;
