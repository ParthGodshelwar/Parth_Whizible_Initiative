import React from "react";
import { Row, Col } from "react-bootstrap";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import SquareIcon from '@mui/icons-material/Square';

// Reusable Legends component
export const Legends1 = ({ legends }) => {
  return (
    <Row className="justify-content-center">
      {legends.map((legend, index) => (
        <Col key={index} xs={4}>
          <Box className={`legends d-flex align-items-center`}>
            {/* <Box className="legend-box" style={{ backgroundColor: legend.color }}></Box> */}
            <SquareIcon style={{ color: legend.color }} />
            <Typography variant="small" className="l-name ps-1">{legend.label}</Typography>
          </Box>
        </Col>
      ))}
    </Row>
  );
};

export const Legends2 = ({ legends }) => {
  return (
    <Row className="justify-content-center">
      {legends.map((legend, index) => (
        <Col key={index} xs={4}>
          <Box className={`legends d-flex align-items-center`}>
            {/* <Box className="legend-box" style={{ backgroundColor: legend.color }}></Box> */}
            <SquareIcon style={{ color: legend.color }} />
            <Typography variant="small" className="l-name ps-1">{legend.label}</Typography>
          </Box>
        </Col>
      ))}
    </Row>
  );
};

export default Legends1;
