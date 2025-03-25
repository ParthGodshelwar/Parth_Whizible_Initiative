import React, { useState, useEffect } from "react";
import "./InitiativeCard.css"; // Custom CSS for card styles
import CustomProgressBar from "app/utils/CustomProgressBar";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Chip
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Import icon for the vertical dots
import CommentSection from "./CommentsSection";
import InitiativeHistoryDrawer from "./InitiativeHistoryDrawer";
import FlagDrawer from "./FlagDrawer";
import Tooltip from "@mui/material/Tooltip";

const InitiativeCard = ({ dashboardData2, startEditing, SetinitiativesID }) => {
  const [stagesCompleted, setStagesCompleted] = useState(0);
  const [totalStages, setTotalStages] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [previousFilterCounts, setPreviousFilterCounts] = useState({
    inbox: 0,
    watchlist: 0,
    draft: 0
  });
  const [flagDrawerOpen, setFlagDrawerOpen] = useState(false);
  console.log("Extract", dashboardData2);

  // Extract data from dashboardData2
  const {
    title,
    ideaIdPk,
    createdOn,
    initiativeCode,
    demandCode,
    initiativeImage,
    employeeImage,
    employeeName,
    alertType,
    processName,
    percentageOfComplete,
    completedStage,
    noOfStageRemain,
    totalNoOfStage,
    instanceId,
    originator
  } = dashboardData2 || {};
  console.log("name={initiativeCode}", initiativeCode);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewEdit = () => {
    SetinitiativesID(ideaIdPk);
    startEditing();
  };

  const handleInitiativeHistory = () => {
    setHistoryDrawerOpen(true);
    handleClose();
  };

  const handleFlagInitiative = () => {
    setFlagDrawerOpen(true);
    handleClose();
  };

  const handleDiscussions = () => {
    setCommentDrawerOpen(true);
    handleClose();
  };

  const calculateDaysSince = (dateString) => {
    const currentDate = new Date();
    const givenDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - givenDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  };

  useEffect(() => {
    setTotalStages(totalNoOfStage || 0);
    setStagesCompleted(completedStage || 0);
  }, [totalNoOfStage, completedStage]);

  // Render "No data" if dashboardData2 is empty or null
  if (!dashboardData2) {
    return (
      <Card className="initiative-card">
        <CardContent className="card-content">
          <Typography variant="h6" component="div">
            No data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="initiative-card">
        <CardContent className="card-content">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={initiativeImage} className="CardViewIniImg pendingStage" />
            <Typography variant="h6" sx={{ fontSize: "1rem", flexGrow: 1 }}>
              <Tooltip title={title?.split(" ").length > 30 ? title : ""} arrow>
                <span>{title?.length > 30 ? `${title.slice(0, 30)}...` : title || "No Title"}</span>
              </Tooltip>
            </Typography>

            <Tooltip title="More Details" arrow>
              <IconButton
                aria-label="more"
                aria-controls="menu-card"
                aria-haspopup="true"
                onClick={handleClick}
                size="small" // Smaller icon button
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu id="menu-card" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleViewEdit}>View/Edit</MenuItem>
              <MenuItem onClick={handleInitiativeHistory}>Initiative History</MenuItem>
              <MenuItem onClick={handleFlagInitiative}>Flag Initiative</MenuItem>
              <MenuItem onClick={handleDiscussions}>Discussions</MenuItem>
            </Menu>
          </Box>

          <Typography variant="body2" color="#3f51b5" style={{ fontSize: "0.8rem" }}>
            Initiative Code: {demandCode}
          </Typography>
          <Tooltip title={processName.length > 30 ? processName : ""} arrow>
            <Typography
              variant="body2"
              color="textSecondary"
              style={{
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              Nature of Initiative:{" "}
              {
                <span>
                  {processName?.length > 30
                    ? `${processName.slice(0, 30)}...`
                    : processName || "No Title"}
                </span>
              }
            </Typography>
          </Tooltip>
          {/* Consider removing or condensing the following lines */}
          {/* <Typography variant="body2" color="textSecondary">
            Created On: {new Date(createdOn).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Stages Completed: {stagesCompleted}/{totalStages}
          </Typography> */}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={employeeImage}
              sx={{ cursor: "pointer", width: 24, height: 24 }} /* Smaller avatar */
            />
            <Typography variant="body2" color="textSecondary" style={{ marginLeft: "8px" }}>
              Created By: {employeeName || "Unknown"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {commentDrawerOpen && (
        <CommentSection
          name={demandCode}
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
          // title={title}
          isOpen={flagDrawerOpen}
          onClose={() => setFlagDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )}
    </>
  );
};

export default InitiativeCard;
