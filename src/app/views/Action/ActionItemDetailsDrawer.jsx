import React from "react";
import { Drawer, Tabs, Tab } from "@mui/material";
import "../../style_custom.css";

const ActionItemDetailsDrawer = ({ open, onClose, title }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ width: "60vw" }}>
      <div style={{ width: 800, padding: "20px" }}>
        <h2>{title}</h2>
        <Tabs>
          <Tab label="Details" />
          <Tab label="History" />
          <Tab label="Upload Document" />
        </Tabs>
        {/* Content for the selected tab will go here */}
      </div>
    </Drawer>
  );
};

export default ActionItemDetailsDrawer;
