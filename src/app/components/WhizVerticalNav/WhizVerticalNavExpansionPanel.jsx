import React, { useCallback, useEffect, useRef, useState } from "react";
import { ButtonBase, Box, styled } from "@mui/material";
import { ChevronRight, PanoramaFishEye } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import EDashboardIcon from "../../../assets/img/e-dashboard.svg";
import InitiativeDashboardIcon from "../../../assets/img/initiative-management-icn.svg";
import Security from "../../../assets/img/reports.svg";
import BusinessUserTrackingIcon from "../../../assets/img/program.svg";
import Configuration from "../../../assets/img/configuration.svg";
import Project from "../../../assets/img/project.svg";
import InitiativeTracking from "../../../assets/img/initiative-tracking.svg";
import Reports from "../../../assets/img/reports.svg";
import Favorite from "../../../assets/img/favorite.svg";

// STYLED COMPONENTS
const NavExpandRoot = styled("div")(({ theme }) => ({
  "& .expandIcon": {
    transition: "transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(90deg)"
  },
  "& .collapseIcon": {
    transition: "transform 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms",
    transform: "rotate(0deg)"
  },
  "& .expansion-panel": {
    overflow: "hidden",
    transition: "max-height 0.3s cubic-bezier(0, 0, 0.2, 1)",
    marginLeft: "20px", // Adjust margin as needed
    padding: "0 8px" // Adjust padding as needed
    // Add other styles as needed
  },
  "& .highlight": {
    background: theme.palette.primary.main
  },
  "&.compactNavItem": {
    width: 44,
    overflow: "hidden",
    justifyContent: "center !important",
    "& .itemText": { display: "none" },
    "& .itemIcon": { display: "none" }
  }
}));

const BaseButton = styled(ButtonBase)(({ theme }) => ({
  height: 44,
  width: "100%",
  whiteSpace: "pre",
  overflow: "hidden",
  paddingRight: "16px",
  borderRadius: "4px",
  marginBottom: "8px",
  display: "flex",
  justifyContent: "space-between !important",
  color: theme.palette.text.primary,
  "&:hover": { background: "rgba(255, 255, 255, 0.08)" },
  "& .icon": {
    width: 36,
    fontSize: "18px",
    paddingLeft: "16px",
    paddingRight: "16px",
    verticalAlign: "middle"
  }
}));

const BulletIcon = styled("div")(({ theme }) => ({
  width: 4,
  height: 4,
  color: "inherit",
  overflow: "hidden",
  marginLeft: "20px",
  marginRight: "8px",
  borderRadius: "300px !important",
  background: theme.palette.text.primary
}));

const ItemText = styled("span")(() => ({
  fontSize: "12px", // Font size set to 12px
  paddingLeft: "0.8rem",
  verticalAlign: "middle",
  color: "#e7e7e7"
}));

const BadgeValue = styled("div")(() => ({
  padding: "1px 4px",
  overflow: "hidden",
  borderRadius: "300px"
}));

const IconImage = styled("img")({
  width: 40,
  height: 40,
  filter: "brightness(0) invert(1)"
});

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

const WhizVerticalNavExpansionPanel = ({ item, mode, isHovered }) => {
  const [collapsed, setCollapsed] = useState(true);
  const elementRef = useRef(null);
  const { tagName, iconText, badge, isExpanded, children } = item;
  const location = useLocation();

  const handleClick = () => {
    setCollapsed((prev) => !prev);
  };

  const getIconPath = (name) => {
    return iconMappings[name] || null;
  };

  const isSelected = (path) => {
    return location.pathname.includes(path);
  };

  useEffect(() => {
    if (mode !== "full") setCollapsed(true);
  }, [isHovered, mode]);

  const renderChildren = (children) => {
    if (Array.isArray(children) && children.length > 0) {
      return children?.map((child) => (
        <WhizVerticalNavExpansionPanel
          key={child.tagId}
          item={child}
          mode={mode}
          isHovered={isHovered}
        >
          {renderChildren(child.children)}
        </WhizVerticalNavExpansionPanel>
      ));
    }
    return null;
  };

  return (
    <NavExpandRoot>
      <BaseButton
        className={clsx({
          "has-submenu compactNavItem": true,
          compactNavItem: mode === "compact",
          open: !collapsed
        })}
        onClick={handleClick}
      >
        <Box display="flex" alignItems="center">
          {children.length > 0 ? (
            <IconImage src={getIconPath(tagName)} />
          ) : isSelected(item.path) ? (
            <ChevronRight fontSize="small" sx={{ verticalAlign: "middle" }} />
          ) : (
            <PanoramaFishEye fontSize="small" sx={{ verticalAlign: "middle" }} />
          )}
          {iconText && <BulletIcon />}
          <ItemText className="sidenavHoverShow">{tagName}</ItemText>
        </Box>

        {badge && <BadgeValue className="sidenavHoverShow itemIcon">{badge.value}</BadgeValue>}

        {isExpanded && (
          <div
            className={clsx({
              sidenavHoverShow: true,
              collapseIcon: collapsed,
              expandIcon: !collapsed
            })}
          >
            <ChevronRight fontSize="small" sx={{ verticalAlign: "middle" }} />
          </div>
        )}
      </BaseButton>

      <div
        ref={elementRef}
        className="expansion-panel"
        style={
          collapsed
            ? {
                maxHeight: "0px",
                opacity: "0",
                transition: "max-height 0.3s ease, opacity 0.3s ease"
              }
            : {
                maxHeight: "1000px",
                opacity: "1",
                transition: "max-height 0.3s ease, opacity 0.3s ease"
              }
        }
      >
        {renderChildren(children)}
      </div>
    </NavExpandRoot>
  );
};

export default WhizVerticalNavExpansionPanel;
