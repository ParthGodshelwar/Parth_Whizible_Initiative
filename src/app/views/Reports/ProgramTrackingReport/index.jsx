import React, { useEffect, useState } from "react";
import { Pivot, PivotItem, Stack, Text } from "@fluentui/react";
import fetchFilters from "../../../hooks/InitiativeReports/GetProgramTrackingDetails";
// Added By Madhuri.K On 18-Nov-2024
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast
import pdf from "../../../../assets/img/pdf.svg";
import xls from "../../../../assets/img/xls.svg";
import "../../../style_custom.css";

const ProgramTrackingReport = () => {
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

  // Get the access token and employeeId from session storage Added By Madhuri.K On 18-Nov-2024
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  // Function to handle PDF download Added By Madhuri.K On 18-Nov-2024
  const handleDownloadPDF = async () => {
    if (!accessToken || !employeeId) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportProgramTracking/GetRptProgramTrackingPdf?empId=${employeeId}`;
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
      link.download = "ProgramTracking_Report.pdf";
      link.click();

      // Show success toast
      toast.success("PDF report downloaded successfully.");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      // Show error toast
      toast.error("Failed to download PDF.");
    }
  };

  // Function to handle Excel download Added By Madhuri.K On 18-Nov-2024
  const handleDownloadExcel = async () => {
    if (!accessToken || !employeeId) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportProgramTracking/GetRptProgramTrackingExcel?empId=${employeeId}`;
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
      link.download = "ProgramTracking_Report.xlsx";
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
      <div id="initiative-management" className="container">
        <div className="d-flex justify-content-between">
          <Pivot>
            <PivotItem headerText="Program Tracking"></PivotItem>
          </Pivot>
          {/* <PrimaryButton className="btn nostylebtn closelink mt-2">
            <PictureAsPdfIcon style={{ marginRight: "8px", color: "#ff6262" }} />
            PDF
          </PrimaryButton> */}

          <div
            id="topActions"
            className="toprightactionsCol d-flex gap-2 py-1 pe-1 justify-content-end"
            style={{ marginTop: "20px" }}
          >
            <a
              className="tital1"
              href="javascript:;"
              onClick={handleDownloadPDF}
              data-bs-toggle="tooltip"
              data-bs-original-title="PDF"
            >
              <img src={pdf} className="me-2" style={{ width: "18px" }} />
              PDF
            </a>
            <a
              className="tital1"
              href="javascript:;"
              onClick={handleDownloadExcel}
              data-bs-toggle="tooltip"
              data-bs-original-title="EXCEL"
            >
              <img src={xls} className="me-2" style={{ width: "18px" }} />
              EXCEL
            </a>
          </div>
        </div>
      </div>

      <Stack className="bottom-position graybg">
        <Text variant="small">
          <span style={{ fontWeight: "bold" }}>Note: </span>
          In some cases output format may not be as good. This is due to inherent reporting engine
          problems, which are beyond our control.
        </Text>
      </Stack>
    </>
  );
};

export default ProgramTrackingReport;
