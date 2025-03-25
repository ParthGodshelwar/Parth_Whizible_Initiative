import React from "react";
import { Tooltip } from "@mui/material";
import "./tableProgressBar.css";

const TableProgressBar = ({ stageIndex, currentStage }) => {
  console.log("stageIndex", stageIndex, currentStage);
  const getStageClass = () => {
    if (stageIndex < currentStage) return " sbar-green1 sbar1";
    if (stageIndex === currentStage) return " sbar-orange1 sbar1";
    if (stageIndex === currentStage + 1) return " sbar-red1 sbar1";
    return "sbar-gray sbar1";
  };

  return (
    <Tooltip title={`Stage ${stageIndex + 1}`}>
      <div
        className={getStageClass()}
        data-bs-toggle="tooltip"
        aria-label={`Stage ${stageIndex + 1}`}
      />
    </Tooltip>
  );
};

export default TableProgressBar;
