import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import EDashboardIcon from "../../../assets/img/e-dashboard.svg";
import InitiativeDashboardIcon from "../../../assets/img/initiative-management-icn.svg";
import ReportsIcon from "../../../assets/img/reports.svg";
import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import "./SidebarComponent.css";

const WhizVerticalNavM = ({ isHovered, mode }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(isHovered !== "full");
  const [theme, setTheme] = useState({
    background: "rgba(241, 241, 241, 255)",
    color: "black" // Default text color
  });

  useEffect(() => {
    if (isHovered || mode === "full") setIsCollapsed(false);
    else setIsCollapsed(true);
  }, [isHovered]);

  // Handles navigation to specified routes
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <ProSidebar
      collapsed={isCollapsed}
      style={{ backgroundColor: theme.background, color: theme.color }}
    >
      <Menu>
        <MenuItem icon={<HomeIcon />} onClick={() => handleNavigation("/")}>
          Home
        </MenuItem>
        <MenuItem
          icon={<img src={EDashboardIcon} alt="E-Dashboard" className="sidebar-icon" />}
          onClick={() => handleNavigation("/e-dashboard")}
        >
          E-Dashboard
        </MenuItem>
        <MenuItem
          icon={
            <img
              src={InitiativeDashboardIcon}
              alt="Initiative Management"
              className="sidebar-icon"
            />
          }
          onClick={() => handleNavigation("/initiative-management")}
        >
          Initiative Management
        </MenuItem>
        <MenuItem
          icon={<img src={ReportsIcon} alt="Reports" className="sidebar-icon" />}
          onClick={() => handleNavigation("/reports")}
        >
          Report
        </MenuItem>
        <MenuItem icon={<HelpIcon />} onClick={() => handleNavigation("/help")}>
          Help
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default WhizVerticalNavM;
