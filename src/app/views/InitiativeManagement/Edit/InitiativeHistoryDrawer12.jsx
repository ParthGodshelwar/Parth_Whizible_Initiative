import React, { useState, useEffect } from "react";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { Table } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import GetInitiativeHistory12 from "../../../hooks/Editpage/GetInitiativeHistory12";

const InitiativeHistoryDrawer12 = ({ initiativeId, open, onClose }) => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedAction, setSelectedAction] = useState("SYS_REJECT");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch initiative history data
  useEffect(() => {
    if (initiativeId) {
      GetInitiativeHistory12(initiativeId, currentPage, selectedAction)
        .then((response) => {
          const data = response?.data?.initiativeShowHistory || [];
          console.log("Fetched history data:", data);
          setHistoryData(data);
          setFilteredHistory(data); // Set initial data
        })
        .catch((error) => console.error("Error fetching history data:", error));
    }
  }, [initiativeId, currentPage, selectedAction]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: "60vw" } }}>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{
            backgroundColor: "#f5f5f5", // Light grey background
            padding: 1, // Optional: Add padding for spacing
            borderRadius: 1 // Optional: Add rounded corners
          }}
        >
          <Typography variant="h6">Initiative History</Typography>
          <IconButton onClick={onClose}>
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>
        </Box>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Modified Field</th>
              <th>Modified Date</th>
              <th>Value</th>
              <th>Modified By</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#666" }}>
                  There are no items to show in this view.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.fieldName}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.value}</td>
                  <td>{item.modifiedBy}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center align-items-center mt-3">
          <IconButton
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <ArrowBackIcon />
          </IconButton>
          <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
          <IconButton
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={
              !filteredHistory || filteredHistory.length === 0 || filteredHistory.length < 5
            }
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
      </Box>
    </Drawer>
  );
};

export default InitiativeHistoryDrawer12;
