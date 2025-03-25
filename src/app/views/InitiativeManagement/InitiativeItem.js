import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  IconButton,
  Tooltip,
  Box,
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
import "./InitiativeItem.css";
import CommentsSection from "./CommentsSection";
import InitiativeHistoryDrawer from "./InitiativeHistoryDrawer";
import FlagDrawer from "./FlagDrawer";
import CustomProgressBar from "app/utils/CustomProgressBar";

const InitiativeItem = ({
  initiative,
  stagesLegend,
  setIsEditing,
  isEditing,
  SetinitiativesID,
  startEditing,
  stopEditing,
  canEdit,
  setImage,
  image
}) => {
  const {
    title,
    id,
    initiativeImage,
    ideaIdPk,
    userId,
    originator,
    processName,
    stageName,
    createdOn,
    actionType,
    initiativeCode,
    stageOrder,
    maxStage,
    comments,
    completedStage,
    noOfStageRemain,
    employeeName,
    employeeImage,
    isRejected,
    initiativeListStageDetails
  } = initiative;
  console.log("employeeImage", employeeImage);
  // State for managing drawers and editing
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [dewdate, setDewdate] = useState(0);
  const [cstageName, setCStageName] = useState(0);
  const [flagDrawerOpen, setFlagDrawerOpen] = useState(false);
  // New state variable for due in days
  const replyTextareaRef = useRef(null);
  const [dueIn, setDueIn] = useState(0);
  // Function to open comment drawer
  const openCommentDrawer = () => {
    setCommentDrawerOpen(true);
  };

  // Function to handle when user doesn't have edit rights
  const handleDisabledClick = (message) => {
    setModalMessage(message);
    setOpenModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Function to calculate the number of days since a given date
  const calculateDaysSince = (date) => {
    const now = new Date();
    const diff = now - date;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Function to format date as dd/mm/yy
  const formatDate = (date) => {
    const day = date.getDate()?.toString()?.padStart(2, "0");
    const month = (date?.getMonth() + 1)?.toString()?.padStart(2, "0");
    const year = date?.getFullYear()?.toString()?.slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Update dewdate, cstageName, and dueIn whenever initiative changes
  useEffect(() => {
    setDewdate(calculateDaysSince(new Date(initiative.createdOn)));
    setCStageName(initiative.stageName); // Assuming stageName represents current stage

    // Check for the current stage in initiativeListStageDetails
    const currentStage = initiativeListStageDetails.find((stage) => stage.isCurrentStage === 1);
    if (currentStage) {
      setDueIn(currentStage.dueinDays); // Set dueIn to the dueinDays of the current stage
    } else {
      setDueIn(0); // Reset dueIn if no current stage found
    }
  }, [initiative]);
  console.log("isRejected", isRejected);
  return (
    <>
      {commentDrawerOpen && (
        <CommentsSection
          name={initiativeCode}
          initiativeId={ideaIdPk}
          commentDrawerOpen={commentDrawerOpen}
          setCommentDrawerOpen={setCommentDrawerOpen}
        />
      )}
      {historyDrawerOpen && (
        <InitiativeHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )}
      {flagDrawerOpen && (
        <FlagDrawer
          title={title}
          isOpen={flagDrawerOpen}
          onClose={() => setFlagDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )}
      <tr>
        <td>
          <div className="initiative-title">
            <Typography variant="body2" color="textSecondary">
              Initiative Code: {initiativeCode}
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Small Circle Image Before Title */}
              <Avatar
                alt="Initiative Image"
                src={initiativeImage}
                sx={{ width: 18, height: 18, marginRight: "0.5rem" }} // Adjust margin if needed
              />
              {/* Title */}
              <Tooltip title={isRejected === 1 ? `${title} (rejected)` : title} arrow>
                <Typography
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "120px",
                    color: isRejected === 1 ? "lightcoral" : "inherit" // Use light red when rejected
                  }}
                >
                  {isRejected === 1
                    ? `${title?.length > 30 ? `${title.substring(0, 30)}...` : title}`
                    : title?.length > 30
                    ? `${title.substring(0, 30)}...`
                    : title}
                </Typography>
              </Tooltip>
            </div>

            <Box display="flex" alignItems="center">
              <Typography variant="body2" color="textSecondary">
                Created By:
              </Typography>
              <Avatar
                alt="Initiative Image"
                src={employeeImage}
                sx={{ width: 18, height: 18, marginRight: "0.5rem" }} // Adjust margin if needed
              />
              <Typography variant="body2" color="textSecondary">
                {employeeName}
              </Typography>
            </Box>
          </div>
        </td>
        <td style={{ textAlign: "start" }}>
          <Typography variant="body2">{processName}</Typography>
          <Typography variant="body2" color="textSecondary">
            Created Date: {formatDate(new Date(createdOn))}
          </Typography>
        </td>
        <td>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%"
            }}
          >
            <div className="left-side">
              <Typography
                variant="body2"
                className="due-in"
                color="textSecondary"
                style={{ fontSize: "0.6rem" }}
              >
                Current Stage: <strong style={{ color: "grey" }}> {cstageName}</strong>
              </Typography>
            </div>
            <div className="right-side" style={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                className="due-in"
                color="textSecondary"
                style={{ fontSize: "0.6rem" }}
              >
                Due In: <strong style={{ color: "grey" }}>{dueIn} Days</strong>
              </Typography>
            </div>
          </Box>

          <CustomProgressBar
            stages={initiativeListStageDetails}
            setDewdate={setDewdate}
            setCStageName={setCStageName}
            percentageOfComplete={initiative?.percentageOfComplete}
            initiative={initiative}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div className="left-side">
              <Typography
                variant="body2"
                className="due-in"
                color="textSecondary"
                style={{ fontSize: "0.6rem" }}
              >
                <strong style={{ color: "grey" }}> {completedStage} </strong> stages completed
              </Typography>
            </div>
            <div className="right-side" style={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                className="due-in"
                color="textSecondary"
                style={{ fontSize: "0.6rem" }}
              >
                <strong style={{ color: "grey" }}> & {noOfStageRemain} </strong> More stages...
              </Typography>
            </div>
          </Box>
        </td>
        <td>
          <div className="current-stage-container">
            <div className="current-stage">
              <div className="initiative-actions">
                <div style={{ display: "flex", gap: "5px" }}></div>
                <Tooltip title={!canEdit ? "No Rights to edit" : "Edit /View"}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (canEdit) {
                        startEditing();
                        SetinitiativesID(ideaIdPk);
                        setImage(initiativeImage);
                        sessionStorage.setItem("ideaIdPk", ideaIdPk);
                      } else {
                        handleDisabledClick("No rights to edit");
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Comment">
                  <IconButton size="small" onClick={openCommentDrawer}>
                    <CommentIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Initiative History">
                  <IconButton size="small" onClick={() => setHistoryDrawerOpen(true)}>
                    <AccessTimeIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Flag">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setFlagDrawerOpen(true);
                    }}
                  >
                    <FlagIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        </td>
      </tr>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{"Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{modalMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InitiativeItem;
