import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { app } from "@microsoft/teams-js";
import EDashboardIcon from "../../../assets/img/e-dashboard.svg";
import InitiativeDashboardIcon from "../../../assets/img/initiative-management-icn.svg";
import BusinessUserTrackingIcon from "../../../assets/img/program.svg";
import Project from "../../../assets/img/project.svg";
import InitiativeTracking from "../../../assets/img/initiative-tracking.svg";
import Reports from "../../../assets/img/reports.svg";
import Favorite from "../../../assets/img/favorite.svg";
import Configuration from "../../../assets/img/configuration.svg";
import Security from "../../../assets/img/reports.svg";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import "./SidebarComponent.css";

const iconMappings = {
  Dashboard: EDashboardIcon,
  "Initiative Management": InitiativeDashboardIcon,
  Program: BusinessUserTrackingIcon,
  Projects: Project,
  "Initiative Tracking": InitiativeTracking,
  Reports: Reports,
  Favorite: Favorite,
  Configuration: Configuration,
  Security: Security
};

// Function to build the full path correctly
const buildFullPath = (parentPath, tagDescription) => {
  // If parentPath exists, trim any extra spaces and append tagDescription
  if (parentPath) {
    // Clean up the parentPath and tagDescription, removing any leading or trailing ">"
    let cleanParentPath = parentPath
      ?.trim()
      ?.replace(/^\s*>\s*/, "")
      ?.replace(/\s*>\s*$/, "");
    let cleanTagDescription = tagDescription
      .trim()
      ?.replace(/^\s*>\s*/, "")
      ?.replace(/\s*>\s*$/, "");

    // Concatenate and ensure no double ">"
    return `${cleanParentPath} > ${cleanTagDescription}`?.replace(/\s*>\s*>+\s*/g, " > ");
  }
  // If no parentPath, return tagDescription directly
  return tagDescription.trim();
};

const WhizVerticalNav = ({ items, isHovered, mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [isCollapsed, setIsCollapsed] = useState(isHovered !== "full");
  const [theme, setTheme] = useState({
    background: "rgba(241, 241, 241, 255)",
    color: "black" // Default text color for light mode
  });

  // useEffect(() => {
  //   const initializeTeams = async () => {
  //     if (window.microsoftTeams) {
  //       try {
  //         await new Promise((resolve) => {
  //           window?.microsoftTeams?.app?.initialize(() => {
  //             resolve();
  //           });
  //         });
  //         window.microsoftTeams.app.getContext((context) => {
  //           if (context.theme === "dark") {
  //             setTheme({
  //               background: "black",
  //               color: "white" // Text color for dark mode
  //             });
  //           } else {
  //             setTheme({
  //               background: "rgba(241, 241, 241, 255)",
  //               color: "black" // Text color for light mode
  //             });
  //           }
  //         });
  //       } catch (error) {
  //         console.error("Teams SDK initialization failed:", error);
  //       }
  //     } else {
  //       console.error("Teams SDK is not available.");
  //     }
  //   };

  //   initializeTeams();
  // }, []);

  useEffect(() => {
    setSelectedItem(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (isHovered || mode === "full") setIsCollapsed(false);
    else setIsCollapsed(true);
  }, [isHovered]);

  const handleClick = (path, tagDescription, parentPath) => {
    const formattedPath = `/${path?.replace(".aspx", "")}`;

    // Check if the current path is the same as the new path
    if (selectedItem === formattedPath) {
      // If the same link is clicked, refresh the page
      window.location.reload();
      return;
    }

    setSelectedItem(formattedPath);
    console.log(`Navigating to: ${formattedPath}`); // Logging for debugging

    // Build the full path and store it in sessionStorage
    const fullPath = buildFullPath(parentPath, tagDescription);
    sessionStorage.setItem("selectedPath", fullPath);
    console.log("tagDescription", tagDescription);
    // Navigate based on the tagDescription
    switch (tagDescription) {
      case "Initiative":
        navigate("/InitiativeManagement");
        break;
      case "Warehouse":
        navigate("/Warehouse");
        break;
      case "Completed Initiatives":
        navigate("/CompletedInitiativesList");
        break;
      case "Withdrawn Initiatives":
        navigate("/WithdrawnInitiatives");
        break;
      case "Action Items":
        navigate("/ActionItems");
        break;
      case "Converted Initiatives":
        navigate("/ConvertedInitiatives");
        break;
      case "Initiative Management":
        navigate("/Reallocation");
        break;
      case "External Audit":
        navigate("/ExternalAudit");
        break;
      case "Initiative Status Management":
        navigate("/InitiativeStatusManagement");
        break;
      case "Watch List Configuration":
        navigate("/WatchListConfiguration");
        break;
      case "Initiative Prioritization":
        navigate("/InitiativePrioritization");
        break;
      case "Initiative Progress":
        navigate("/InitiativeProgress");
        break;
      case "Initiative Linking":
        navigate("/InitiativeLinking");
        break;
      case "Man-Com Prioritization":
        navigate("/ManComPrioritization");
        break;
      case "Currency":
        navigate("/currency");
        break;
      case "Projects":
        navigate("/projectlist");
        break;
      case "Program":
        navigate("/programlist");
        break;
      case "Project Health Sheet Approval":
        navigate("/milestoneprogress");
        break;
      case "Initiative Report":
        navigate("/InitiativeReport");
        break;
      case "Action Items Report":
        navigate("/ActionItemsReport");
        break;
      case "Change Nature Of Initiative Report":
        navigate("/ChangeNOIReport");
        break;
      case "Delayed Initiatives":
        navigate("/DelayedInitiativeReport");
        break;
      case "Delivery Calendar":
        navigate("/DeliveryCalendarReport");
        break;
      case "Ageing Report":
        navigate("/AgeingReport");
        break;
      case "Program Tracking Report":
        navigate("/ProgramTrackingReport");
        break;
      case "Initiative Activate - Snooze":
        navigate("/Snooze");
        break;
      case "Initiative Dashboard":
        navigate("/InitiativeDashboard");
        break;
      default:
        navigate("/under-construction");
        break;
    }
  };

  const isSelected = (item) => {
    // Ensure path format is consistent
    const formattedPath = `/${item?.pageName?.replace(".aspx", "")}`;
    return selectedItem === formattedPath;
  };

  const renderMenuItems = (data, parentPath = "") => {
    return data.map((item, index) => {
      const isActive = isSelected(item);
      const childIcon = <PanoramaFishEyeIcon style={{ fontSize: 10 }} />;

      if (item.isParent) {
        return (
          <SubMenu
            key={index}
            title={item.tagName}
            icon={
              iconMappings[item.tagName] ? (
                <img src={iconMappings[item.tagName]} alt={item.tagName} className="sidebar-icon" />
              ) : (
                <PanoramaFishEyeIcon style={{ fontSize: 16 }} />
              )
            }
            style={{ color: theme.color }}
          >
            {item.children &&
              renderMenuItems(item.children, buildFullPath(parentPath, item.tagName))}
          </SubMenu>
        );
      }

      return (
        <MenuItem
          key={index}
          icon={
            iconMappings[item.tagName] ? (
              <img src={iconMappings[item.tagName]} alt={item.tagName} className="sidebar-icon" />
            ) : (
              childIcon
            )
          }
          style={{ color: isActive ? "blue" : theme.color }} // Apply blue color to selected item
          onClick={() => handleClick(item.pageName, item.tagDescription, parentPath)}
        >
          {item.tagName}
          {item.badge && <span className="badge">{item.badge.value}</span>}
        </MenuItem>
      );
    });
  };

  return (
    <ProSidebar
      collapsed={isCollapsed}
      style={{ backgroundColor: theme.background, color: theme.color }}
    >
      <Menu>{renderMenuItems(items)}</Menu>
    </ProSidebar>
  );
};

export default WhizVerticalNav;
