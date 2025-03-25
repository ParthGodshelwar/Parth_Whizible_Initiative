import { memo, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  styled,
  Avatar,
  Hidden,
  useTheme,
  MenuItem,
  IconButton,
  useMediaQuery,
  Typography,
  Menu,
  ListItemIcon
} from "@mui/material";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";

import { useNavigate } from "react-router-dom";
import { NotificationProvider } from "app/contexts/NotificationContext";
import useAuth from "app/hooks/useAuth";
import useSettings from "app/hooks/useSettings";
import { Span } from "app/components/Typography";
import { WhizMenu, WhizSearchBox } from "app/components";
import { NotificationBar } from "app/components/NotificationBar";
import { themeShadows } from "app/components/WhizTheme/themeColors";
import { topBarHeight } from "app/utils/constant";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import MailOutline from "@mui/icons-material/MailOutline";
import StarOutline from "@mui/icons-material/StarOutline";
import PowerSettingsNew from "@mui/icons-material/PowerSettingsNew";
import Globe from "@mui/icons-material/Language"; // Import the globe icon
import { useTranslation } from "react-i18next";

// STYLED COMPONENTS
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

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" }
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none"
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary }
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" }
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { i18n } = useTranslation(); // Initialize i18n for translation
  const storedImage = sessionStorage.getItem("UserProfilePic");
  useEffect(() => {
    // Retrieve the selected path from sessionStorage
    const storedPath = sessionStorage.getItem("selectedPath");

    console.log("storedPath", location.pathname);
    if (location.pathname === "/" || location.pathname === "/landingPage") {
      setSelectedPath("My Dashboard");
    } else {
      setSelectedPath(storedPath || "");
    }
  }, [location.pathname]);

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({ layout1Settings: { leftSidebar: { ...sidebarSettings } } });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  // Function to handle mailto
  const handleMailClick = () => {
    if (userdata?.emailId) {
      const mailtoLink = `mailto:${userdata.emailId}?subject=Subject%20Here&body=Body%20Content%20Here`;
      window.location.href = mailtoLink;
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  // Handle language menu open
  const handleLanguageMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle language change
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setAnchorEl(null);
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        {/* Center URL display */}
        <Box width="100%" sx={{ paddingLeft: 2 }}>
          <Typography
            variant="body1"
            color="inherit"
            sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
          >
            {selectedPath && (
              <Typography variant="body2" color="inherit" sx={{ marginLeft: 1, fontSize: "1rem" }}>
                {selectedPath}
              </Typography>
            )}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center">
          <NotificationProvider>
            <HomeOutlined onClick={handleHome} sx={{ mr: 2 }} />
          </NotificationProvider>
          {/* <NotificationProvider>
            <MailOutline onClick={handleMailClick} sx={{ mr: 2 }} />
          </NotificationProvider> */}
          {/* <NotificationProvider>
            <StarOutline sx={{ mr: 2 }} />
          </NotificationProvider> */}
          <NotificationProvider>
            <NotificationBar sx={{ mr: 2 }} />
          </NotificationProvider>

          {/* <StyledIconButton onClick={handleLanguageMenuClick} sx={{ mr: 2 }}>
            <Globe />
          </StyledIconButton> */}

          <WhizMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  <Span sx={{ whiteSpace: "nowrap" }}>
                    Hi <strong>{userdata?.employeeName}</strong>
                  </Span>
                </Hidden>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar src={storedImage} sx={{ cursor: "pointer", width: 30, height: 30 }} />
                  <Span sx={{ fontSize: 12, color: "grey" }}>{userdata?.roleName}</Span>
                </Box>
              </UserMenu>
            }
          >
            <StyledItem>
              <Link to="/landingPage">
                <HomeOutlined />
                <Span>Home</Span>
              </Link>
            </StyledItem>

            <StyledItem>
              <Link to="/page-layouts/user-profile">
                <Person />
                <Span>Profile</Span>
              </Link>
            </StyledItem>

            <StyledItem onClick={logout}>
              <PowerSettingsNew />
              <Span>Logout</Span>
            </StyledItem>
          </WhizMenu>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { maxHeight: 200, width: 150 } }}
          >
            <MenuItem onClick={() => handleLanguageChange("en")}>
              <ListItemIcon>
                <span role="img" aria-label="English">
                  🇬🇧
                </span>
              </ListItemIcon>
              <Typography variant="body2">English</Typography>
            </MenuItem>
            {/* <MenuItem onClick={() => handleLanguageChange("es")}>
              <ListItemIcon>
                <span role="img" aria-label="Spanish">
                  🇪🇸
                </span>
              </ListItemIcon>
              <Typography variant="body2">Español</Typography>
            </MenuItem> */}
            <MenuItem onClick={() => handleLanguageChange("mr")}>
              <ListItemIcon>
                <span role="img" aria-label="Marathi">
                  🇲🇹
                </span>
              </ListItemIcon>
              <Typography variant="body2">Marathi</Typography>
            </MenuItem>

            {/* Add more languages as needed */}
          </Menu>
        </Box>
      </TopbarContainer>
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
