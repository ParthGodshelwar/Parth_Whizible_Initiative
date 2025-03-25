import React from "react";
import { Drawer, Typography, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast
import pdf from "../../../assets/img/pdf.svg";
import Tooltip from "@mui/material/Tooltip";
import xls from "../../../assets/img/xls.svg";

{/* Added InitiativeID by Gauri on 03 Mar 2025 */}
const ExportDrawer = ({ exportDrawerOpen, handleCloseExportDrawer, InititiativeID }) => {
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

    {/* Passed InitiativeID to Export PDF API by Gauri on 03 Mar 2025 */}
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportActionItems/GetRepActionItemsPdf?empId=${employeeId}&IdeaID=${InititiativeID}`;
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
      link.download = "Action_Items_Report.pdf";
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

    {/* Passed InitiativeID to Export Excel API by Gauri on 03 Mar 2025 */}
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ReportActionItems/GetRepActionItemsExcel?empId=${employeeId}&IdeaID=${InititiativeID}`;
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
      link.download = "Action_Items_Report.xlsx";
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
      {/* Toast Container */}
      <ToastContainer />

      <Drawer
        anchor="right"
        open={exportDrawerOpen}
        onClose={handleCloseExportDrawer}
        sx={{ width: "60vw" }}
      >
        <div style={{ width: "60vw", padding: 20 }}>
          {/* Header with Title and Close Icon */}
          <div
            className="d-flex justify-content-between"
            style={{ background: "#E7EDF0", width: "100%", padding: 5 }}
          >
            <Typography variant="h6" gutterBottom style={{ background: "#E7EDF0", width: "100%" }}>
              Export Data
            </Typography>
            <Tooltip title="Close">
              <CloseIcon className="IcnStyle" onClick={handleCloseExportDrawer} style={{ marginTop: "5px" }} />
            </Tooltip>
          </div>

          {/* Action Links for PDF and Excel */}
          <div
            id="topActions"
            className="toprightactionsCol d-flex align-items-center gap-2 py-1 pe-1 justify-content-end"
            style={{ marginTop: "20px" }}
          >
            <Button
              variant="text"
              className="tital1"
              onClick={handleDownloadPDF}
              data-bs-toggle="tooltip"
              data-bs-original-title="PDF"
            >
              <img src={pdf} className="me-2" style={{ width: "18px" }} />
              PDF
            </Button>
            &nbsp;
            <Button
              variant="text"
              className="tital1"
              onClick={handleDownloadExcel}
              data-bs-toggle="tooltip"
              data-bs-original-title="EXCEL"
            >
              <img src={xls} className="me-2" style={{ width: "18px" }} />
              EXCEL
            </Button>
            &nbsp;
          </div>

          {/* Footer with Note */}
          <div className="form-group row mb-3 offcanvas_footer" style={{ marginTop: "40px" }}>
            <div className="col-sm-12 form-group bglightblue">
              <span className="textstrong">Note:</span> Our recommended report format is PDF. Other
              formats do work in most of the reports, but in some cases, the output format may not
              be as good as PDF. This is due to inherent reporting engine problems, which are beyond
              our control. If you desire, we can disable other output formats in your configuration.
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ExportDrawer;
