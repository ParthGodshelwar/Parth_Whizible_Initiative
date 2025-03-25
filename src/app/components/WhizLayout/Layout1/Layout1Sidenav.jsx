import { memo, useState } from "react";
import { Hidden, Switch, Box, styled, useTheme } from "@mui/material";

import useSettings from "app/hooks/useSettings";

import Brand from "app/components/Brand";
import Sidenav from "app/components/Sidenav";
import { themeShadows } from "app/components/WhizTheme/themeColors";

import { sidenavCompactWidth, sideNavWidth } from "app/utils/constant";

// STYLED COMPONENTS
const SidebarNavRoot = styled(Box)(({ theme, width }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: width,
  boxShadow: themeShadows[8],
  backgroundRepeat: "no-repeat",
  backgroundPosition: "top",
  backgroundSize: "cover",
  zIndex: 111,
  overflow: "hidden",
  color: theme.palette.text.primary,
  transition: "all 250ms ease-in-out",
  backgroundColor: `rgba(241, 241, 241, 255);`,
  "&:hover": {
    width: sideNavWidth,
    "& .sidenavHoverShow": { display: "block" },
    "& .compactNavItem": {
      width: "100%",
      maxWidth: "100%",
      "& .nav-bullet": { display: "block" },
      "& .nav-bullet-text": { display: "none" }
    }
  }
}));

const NavListBox = styled(Box)({
  height: "100%",
  display: "flex",
  flexDirection: "column"
});

const Layout1Sidenav = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;
  const [isHovered, setIsHovered] = useState(false);

  const getSidenavWidth = () => {
    console.log("mode", mode);
    switch (mode) {
      case "compact":
        return sidenavCompactWidth;
      default:
        return sideNavWidth;
    }
  };

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } }
    });
  };

  const handleSidenavToggle = () => {
    updateSidebarMode({ mode: mode === "compact" ? "full" : "compact" });
  };

  const handleMouseEnter = () => {
    console.log("Hovered!");
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <SidebarNavRoot
      width={getSidenavWidth()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavListBox>
        <Brand>
          <Hidden smDown>
            <Switch
              onChange={handleSidenavToggle}
              checked={leftSidebar.mode !== "full"}
              color="secondary"
              size="small"
            />
          </Hidden>
        </Brand>
        <Sidenav isHovered={isHovered} />
      </NavListBox>
    </SidebarNavRoot>
  );
};

export default memo(Layout1Sidenav);
