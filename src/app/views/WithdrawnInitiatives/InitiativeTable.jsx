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
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FluentTable from "../../components/FluentTable";
import "./InitiativeTable.css"; // Assuming you have custom styles
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import CommentsSectionction from "../InitiativeManagement/CommentsSection";
import ResubmitDrawer from "./ResubmitDrawer";

const InitiativeTable = ({
  withdrawnIni,
  currentPage,
  setCurrentPage,
  commentDrawerOpen,
  setCommentDrawerOpen,
  historyDrawerOpen,
  setHistoryDrawerOpen,
  // resubmitDrawerOpen,
  // setResubmitDrawerOpen,
  editMode,
  setEditMode,
  initiativeId,
  setInitiativeId,
  setRefresh12,
}) => {
  const [data, setData] = useState([]);

  const [resubmitDrawerOpen, setResubmitDrawerOpen] = useState(false);
  const [initiativeTitle, setInitiativeTitle] = useState("");

  const [name, setName] = useState("");
  useEffect(() => {
    if (withdrawnIni?.listwithdrawnIni) {
      const mappedData = withdrawnIni.listwithdrawnIni.map((item) => ({
        id: item.ideaID,
        code: item.demandCode,
        title: item.title,
        nature: item.natureofDemand,
        group: item.location || "N/A", // Mapping businessGroup or organizationUnit
        convertedTo: item.convertedTo || "N/A", // Handle empty fields
        vendor: item.nameOfFirm || "N/A" // Handle vendor mapping
      }));
      setData(mappedData);
    }
  }, [withdrawnIni]);

  const columns = [
    {
      key: "code",
      name: "Initiative Code",
      fieldName: "code",
      minWidth: 40,
      isResizable: true
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
      )
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
      )
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
      )
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
                console.log("setInitiativeId", item);
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
                setInitiativeId(item.id);
                setHistoryDrawerOpen(true);
              }}
            >
              <AccessTimeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Resubmit">
            <IconButton
              size="small"
              onClick={() => {
                setInitiativeId(item.id);
                setResubmitDrawerOpen(true);
                setInitiativeTitle(item.title);
              }}
            >
              <AutorenewIcon fontSize="small" style={{ color: "#2b66d3" }} />
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

      {resubmitDrawerOpen && (
        <ResubmitDrawer
          title={initiativeTitle}
          initiativeId={initiativeId}
          isOpen={resubmitDrawerOpen}
          onClose={() => setResubmitDrawerOpen(false)}
          setRefresh12={setRefresh12}
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
