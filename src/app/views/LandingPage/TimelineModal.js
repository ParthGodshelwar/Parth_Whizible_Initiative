import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

const TimelineModal = ({ open, onClose, selectedEntry }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <Tooltip title="Close">
            <CloseIcon />
          </Tooltip>
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom>
          My Timeline
        </Typography>
        {selectedEntry && (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Title:</strong> {selectedEntry.initiativeTitle}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {selectedEntry.date.toDateString()}
            </Typography>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default TimelineModal;
