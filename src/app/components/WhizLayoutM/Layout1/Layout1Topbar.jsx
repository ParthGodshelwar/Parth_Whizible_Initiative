import { memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, styled, IconButton, useMediaQuery, Menu, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useSettings from "app/hooks/useSettings";
import { NotificationProvider } from "app/contexts/NotificationContext";
import { NotificationBar } from "app/components/NotificationBar";
import { themeShadows } from "app/components/WhizTheme/themeColors";
import { topBarHeight } from "app/utils/constant";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease"
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: { paddingLeft: 16, paddingRight: 16 },
  [theme.breakpoints.down("xs")]: { paddingLeft: 14, paddingRight: 16 }
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  useEffect(() => {
    // Set selected path if needed
    sessionStorage.getItem("selectedPath");
  }, [location.pathname]);

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode = isMdScreen
      ? layout1Settings.leftSidebar.mode === "close"
        ? "mobile"
        : "close"
      : layout1Settings.leftSidebar.mode === "full"
      ? "close"
      : "full";
    updateSidebarMode({ mode });
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box width="100%" sx={{ paddingLeft: 2 }}>
          <StyledIconButton onClick={handleSidebarToggle}>
            <MenuIcon /> {/* Menu icon added */}
          </StyledIconButton>
        </Box>

        <Box display="flex" alignItems="center">
          <NotificationProvider>
            <NotificationBar sx={{ mr: 2 }} />
          </NotificationProvider>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
