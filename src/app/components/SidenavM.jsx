import { Fragment, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Scrollbar from "react-perfect-scrollbar";
import WhizVerticalNavM from "app/components/WhizVerticalNav/WhizVerticalNavM";
import useSettings from "app/hooks/useSettings";
import useSidebar from "../hooks/useSidebar"; // Import the custom hook
import { Span } from "app/components/Typography";
import eDashboardIcon from "../../assets/img/e-dashboard.svg"; // Import the SVG icon
import { Search20Regular as SearchIcon } from "@fluentui/react-icons";
import Search from "../../assets/img/search-icn.svg";
// STYLED COMPONENTS
const StyledScrollBar = styled(Scrollbar)(() => ({
  paddingRight: "1rem",
  position: "relative"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem",
  display: mode === "compact" ? "none" : "block"
}));

const SideNavMobile = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  width: "100vw",
  background: "rgba(0, 0, 0, 0.54)",
  [theme.breakpoints.up("lg")]: { display: "none" }
}));

export default function SidenavM({ children, isHovered }) {
  const { settings, updateSettings } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  const { SidebarData: navigations, loading, error } = useSidebar();
  const [filteredNavigations, setFilteredNavigations] = useState([]);

  useEffect(() => {
    if (navigations) {
      setFilteredNavigations(navigations);
    }
  }, [navigations]);

  const updateSidebarMode = (sidebarSettings) => {
    let activeLayoutSettingsName = settings.activeLayout + "Settings";
    let activeLayoutSettings = settings[activeLayoutSettingsName];

    updateSettings({
      ...settings,
      [activeLayoutSettingsName]: {
        ...activeLayoutSettings,
        leftSidebar: {
          ...activeLayoutSettings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };

  const handleSearch = (event) => {
    const term = event?.target?.value?.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredNavigations(navigations);
    } else {
      const filterItems = (items) => {
        return items
          .map((item) => {
            if (item.tagName.toLowerCase().includes(term)) {
              // If the parent matches, return it with all its children
              return item;
            }

            if (item.children && item.children.length > 0) {
              const filteredChildren = filterItems(item.children);

              if (filteredChildren.length > 0) {
                // If any children match, return the parent with the filtered children
                return { ...item, children: filteredChildren };
              }
            }

            // If no match, return null
            return null;
          })
          .filter((item) => item !== null);
      };

      const filtered = filterItems(navigations);
      setFilteredNavigations(filtered);
    }
  };

  <div
    style={{
      // color: theme.palette.mode === "dark" ? "white" : "black",
      // backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fdd",
      padding: "10px",
      borderRadius: "4px"
    }}
  >
    Error: {error}
  </div>;
  console.log("mode", mode);

  return (
    <Fragment>
      <StyledSpan mode={mode} className="sidenavHoverShow">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ margin: "1rem", padding: "0.005rem", width: "calc(100% - 2rem)" }}
        />
      </StyledSpan>
      <StyledScrollBar options={{ suppressScrollX: true }}>
        <WhizVerticalNavM items={filteredNavigations} isHovered={isHovered} mode={mode} />
        {children}
      </StyledScrollBar>
      <SideNavMobile onClick={() => updateSidebarMode({ mode: "close" })} />
    </Fragment>
  );
}
