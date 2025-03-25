import React, { useState, useEffect } from "react";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Label } from "@fluentui/react";
import { Box } from "@mui/material";
import { Table } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "bootstrap/dist/css/bootstrap.min.css";
import GetInitiativeHistory from "../../../hooks/Editpage/GetInitiativeHistory";

const InitiativeHistoryTab = ({ initiativeId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedAction, setSelectedAction] = useState("SYS_REJECT");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      const initiativeHistory = await GetInitiativeHistory(
        initiativeId,
        currentPage,
        selectedAction
      );
      const data = initiativeHistory?.data?.listInitiativeHistoryListEntity || [];
      setHistoryData(data);
      setFilteredHistory(data); // Set initial data
    };
    fetchHistory();
  }, [initiativeId, selectedAction, currentPage]);

  const actionOptions = [
    { key: "SYS_APPROVE", text: "Approved" },
    { key: "SYS_REJECT", text: "Rejected" },
    { key: "SYS_SUBMIT", text: "Submitted" }
  ];

  const onActionChange = (event, option) => {
    setSelectedAction(option.key);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const paginatedData = filteredHistory;

  return (
    <div className="tab-pane py-0" id="Initiative_HistoryTab">
      <div className="container-fluid mt-2">
        <div className="row align-items-center">
          {/* <div className="col-12 col-sm-6 text-start">
            <Label className="textstrong">Initiative History</Label>
          </div> */}
        </div>
      </div>
      <div className="init_grid_panel">
        <div className="row mb-3 mt-3 mx-2">
          <div className="col-sm-3">
            <Label className="form-label IM_label">Action Taken</Label>
            <Dropdown
              selectedKey={selectedAction}
              placeholder="Select Action Taken"
              options={actionOptions}
              onChange={onActionChange}
              styles={{ dropdown: { width: "100%" } }}
            />
          </div>
          {/* <div className="col-sm-6 text-start">
            <Label className="form-label IM_label col-sm-12">&nbsp;</Label>
            <PrimaryButton id="filtershowbtn" text="Show" onClick={onShowClick} />
          </div> */}
          <div className="col-sm-3"></div>
        </div>
        <div id="Project_History_Grid_panel_2" className="m-3">
          <div className="table_wrapper stageGridPanel">
            <Table
              striped
              bordered
              hover
              className="init_borderedTbl_History table-hover table-striped init-stickytable mb-0"
            >
              <thead>
                <tr>
                  <th>Event Time</th>
                  <th>Action Taken</th>
                  <th>From Stage</th>
                  <th>To Stage</th>
                  <th>Approver</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody className="tbodyHistory">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#666" }}>
                      There are no items to show in this view.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => (
                    <tr className="TR_history" key={index}>
                      <td>{new Date(row.eventTime).toLocaleDateString("en-GB")}</td>
                      <td>{row.actionType}</td>
                      <td>{row.fromStage}</td>
                      <td>{row.toStage}</td>
                      <td>{row.userName}</td>
                      <td>{row.comments}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 2
        }}
      >
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <div>Page {currentPage}</div>
        <IconButton
          onClick={handleNextPage}
          disabled={
            paginatedData === null || paginatedData?.length === 0 || paginatedData?.length % 5 !== 0
          }
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default InitiativeHistoryTab;
