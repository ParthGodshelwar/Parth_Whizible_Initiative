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
const columnStyles = {
  root: {
    whiteSpace: "normal",
    wordWrap: "break-word",
    color: "black",
  }
};
const InitiativeTable = ({
  completedIni,
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
  console.log("completedIni1", completedIni);

  useEffect(() => {
    console.log("location", completedIni?.listCompletedIni);
    if (completedIni?.listCompletedIni) {
      const mappedData = completedIni.listCompletedIni.map((item) => ({
        Id: item.ideaID,
        Code: item.demandCode,
        title: item.title,
        nature: item.natureofDemand,
        group: item.location || item.location, // Mapping businessGroup or organizationUnit
        convertedTo: item.convertedTo || "N/A", // Handle empty fields
        vendor: item.nameOfFirm || "N/A" // Handle vendor mapping
      }));
      setData(mappedData);
    }
  }, [completedIni]);

  // Added By Madhuri.K On 15-Nov-2024
  const columns = [
    {
      key: "Code",
      name: "Initiative Code",
      fieldName: "demandCode",
      minWidth: 100,
      isResizable: false,
      styles: columnStyles
    },
    {
      key: "title",
      name: "Initiative Title",
      fieldName: "title",
      minWidth: 240,
      isResizable: false,
      styles: columnStyles
    },
    {
      key: "nature",
      name: "Nature of Initiative",
      fieldName: "nature",
      minWidth: 200,
      styles: columnStyles,
      isResizable: false,
      onRender: (item) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{item.nature}</div>
      )
    },
    {
      key: "group",
      name: "Organization Unit",
      fieldName: "group",
      minWidth: 120,
      isResizable: false,
      styles: columnStyles
    },
    {
      key: "convertedTo",
      name: "Converted To",
      fieldName: "convertedTo",
      minWidth: 120,
      isResizable: false,
      styles: columnStyles
    },
    {
      key: "vendor",
      name: "Vendor",
      fieldName: "vendor",
      minWidth: 80,
      styles: columnStyles,
      isResizable: false,
      onRender: (item) => (
        <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>{item.vendor}</div>
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
                setInitiativeId(item.Id);
                console.log("initiativeId687", item);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Comment">
            <IconButton
              size="small"
              onClick={() => {
                setName(item.Code);
                console.log("History", item.Code);
                setInitiativeId(item.Id);
                setCommentDrawerOpen(true);
              }}
            >
              <CommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="History ">
            <IconButton
              size="small"
              onClick={() => {
                console.log("initiativeId687", item);
                setInitiativeId(item.Id);
                setHistoryDrawerOpen(true);
              }}
            >
              <AccessTimeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {/* Commented by Madhuri.K */}

          {/* <Tooltip title="Flag">
            <IconButton size="small">
              <FlagIcon fontSize="small" />
            </IconButton>
          </Tooltip> */}
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
