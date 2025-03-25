import { Box, styled } from "@mui/material";

import { Span } from "./Typography";
import { WhizLogo } from "app/components";
import useSettings from "app/hooks/useSettings";

// STYLED COMPONENTS
const BrandRoot = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 18px 20px 10px"
}));

const StyledSpan = styled(Span)(({ mode }) => ({
  fontSize: 18,
  marginLeft: ".5rem"
}));

export default function Brand({ children }) {
  const { settings } = useSettings();
  const leftSidebar = settings.layout1Settings.leftSidebar;
  const { mode } = leftSidebar;

  return (
    <BrandRoot>
      <Box display="flex" alignItems="center">
        <StyledSpan mode={mode} className="sidenavHoverShow">
          <WhizLogo mode={mode} />
        </StyledSpan>
      </Box>

      <Box
        className="sidenavHoverShow"
        mode={mode}
        sx={{ display: mode === "compact" ? "none" : "block" }}
      >
        {children || null}
      </Box>
    </BrandRoot>
  );
}
