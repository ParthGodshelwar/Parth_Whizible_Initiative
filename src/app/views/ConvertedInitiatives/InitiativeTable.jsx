import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Drawer,
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Avatar
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import FluentTable from "../../components/FluentTable";
import "./InitiativeTable.css"; // Assuming you have custom styles
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import CommentsSectionction from "../InitiativeManagement/CommentsSection";

const InitiativeTable = ({
  convertedIni,
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

  console.log("convertedIni122", convertedIni);
  const [name, setName] = useState("");
  useEffect(() => {
    if (convertedIni) {
      const mappedData = convertedIni?.listConvertedIni?.map((item) => ({
        id: item.ideaID,
        code: item.demandCode,
        title: item.title,
        nature: item.natureofDemand,
        group: item.location || item.location, // Mapping businessGroup or organizationUnit
        convertedTo: item.convertedTo || "N/A", // Handle empty fields
        vendor: item.nameOfFirm || "N/A" // Handle vendor mapping
      }));
      setData(mappedData);
    }
  }, [convertedIni]);
  // Added By Madhuri.K on 10-03-2025
  const columnStyles = {
    root: {
      whiteSpace: "normal",
      wordWrap: "break-word",
      color: "black",
    }
  };
  const columns = [
    {
      key: "code",
      name: "Initiative Code",
      fieldName: "code",
      minWidth: 40,
      isResizable: true,
      styles: columnStyles
    },
    {
      key: "title",
      name: "Initiative Title",
      fieldName: "title",
      minWidth: 180,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "180px" }}>
          {item.title}
        </div>
      ),
      styles: columnStyles
    },
    {
      key: "nature",
      name: "Nature of Initiative",
      fieldName: "nature",
      minWidth: 220,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "220px" }}>
          {item.nature}
        </div>
      ),
      styles: columnStyles
    },
    {
      key: "group",
      name: "Organization Unit",
      fieldName: "group",
      minWidth: 150,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "150px" }}>
          {item.group}
        </div>
      ),
      styles: columnStyles
    },
    {
      key: "convertedTo",
      name: "Converted To",
      fieldName: "convertedTo",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "100px" }}>
          {item.convertedTo}
        </div>
      ),
      styles: columnStyles
    },
    {
      key: "vendor",
      name: "Vendor",
      fieldName: "vendor",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div className="text-wrap" style={{ maxWidth: "100px" }}>
          {item.vendor}
        </div>
      )
    },
    {
      key: "action",
      name: "Action",
      minWidth: 100,
      isResizable: false,
      onRender: (item) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setEditMode(true);
                setInitiativeId(item.id);
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
                setInitiativeId(item.id);
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
                console.log("id1", item);
                setInitiativeId(item.id);
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
