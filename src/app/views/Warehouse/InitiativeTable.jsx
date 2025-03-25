import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// commented by Madhuri.K on 14-Nov-2024 start here

// import FlagIcon from "@mui/icons-material/Flag";

// commented by Madhuri.K on 14-Nov-2024 end here
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import FluentTable from "../../components/FluentTable";
import "./InitiativeTable.css"; // Assuming you have custom styles
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import CommentsSectionction from "../InitiativeManagement/CommentsSection";

const InitiativeTable = ({
  wareHouseIni,
  currentPage,
  setCurrentPage,
  commentDrawerOpen,
  setCommentDrawerOpen,
  historyDrawerOpen,
  setHistoryDrawerOpen,
  editMode,
  setEditMode,
  initiativeId,
  setInitiativeId
}) => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  useEffect(() => {
    if (wareHouseIni?.listWareHouseIni) {
      const mappedData = wareHouseIni.listWareHouseIni.map((item) => ({
        code: item.demandCode || "N/A", // Set default "N/A" if no code
        title: item.title || "N/A", // Set default "N/A" if no title
        status: item.status || "N/A", // Set default "N/A" if no status
        nature: item.natureofDemand || "N/A", // Set default "N/A" if no nature
        stage: item.requestStage || "N/A", // Set default "N/A" if no stage
        vendor: item.vendor || "N/A", // Set default "N/A" if no vendor
        initiatiedOn: item.initiatiedOn
          ? new Date(item.initiatiedOn).toLocaleDateString("en-GB")
          : "N/A", // Format date or "N/A"
        Id: item.ideaID // Ensure you have a unique identifier for actions
      }));
      setData(mappedData);
    }
  }, [wareHouseIni]);

  const columns = [
    {
      key: "code",
      name: "Initiative Code",
      fieldName: "code",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "80px" }}>
          {item.code}
        </div>
      )
    },
    {
      key: "title",
      name: "Initiative Title",
      fieldName: "title",
      minWidth: 150,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "180px" }}>
          {item.title}
        </div>
      )
    },
    {
      key: "status",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "60px" }}>
          {item.status}
        </div>
      )
    },
    {
      key: "nature",
      name: "Nature of Initiative",
      fieldName: "nature",
      minWidth: 250,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "220px" }}>
          {item.nature}
        </div>
      )
    },
    {
      key: "stage",
      name: "Stage Name",
      fieldName: "stage",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "100px" }}>
          {item.stage}
        </div>
      )
    },
    // Commented By Madhuri.K on 10-03-2025 start here
    
    // {
    //   key: "vendor",
    //   name: "Vendor",
    //   fieldName: "vendor",
    //   minWidth: 70,
    //   isResizable: false,
    //   onRender: (item) => (
    //     <div className="text-wrap" style={{ maxWidth: "70px" }}>
    //       {item.vendor}
    //     </div>
    //   )
    // },
    {
      key: "initiatiedOn",
      name: "Initiated On",
      fieldName: "initiatiedOn",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => {
        const date = new Date(item.initiatiedOn);
        return (
          <div className="text-wrap" style={{ maxWidth: "100px" }}>
            {date.toLocaleDateString("en-GB")} {/* Format as dd/mm/yyyy */}
          </div>
        );
      }
    },
    {
      key: "action",
      name: "Action",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div style={{ display: "flex", gap: "2px" }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setEditMode(true);
                setInitiativeId(item.Id);
                console.log("setInitiativeId", item);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Comment">
            <IconButton
              size="small"
              onClick={() => {
                setInitiativeId(item.Id);
                setCommentDrawerOpen(true);
                setName(item.code);
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="History">
            <IconButton
              size="small"
              onClick={() => {
                setInitiativeId(item.Id);
                setHistoryDrawerOpen(true);
              }}
            >
              <AccessTimeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <>
      {commentDrawerOpen && (
        <CommentsSectionction
          name={name}
          initiativeId={initiativeId}
          commentDrawerOpen={commentDrawerOpen}
          setCommentDrawerOpen={setCommentDrawerOpen}
        />
      )}
      {historyDrawerOpen && (
        <InitiativeHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          id1={initiativeId}
        />
      )}
      <FluentTable
        columns={columns}
        items={data}
        itemsPerPage={5}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default InitiativeTable;
