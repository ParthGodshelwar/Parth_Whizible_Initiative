import React, { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import "./customProgressBar.css";

import InitiativeDetailsModal from "app/views/InitiativeManagement/InitiativeDetailsModal";

const CustomProgressBar = ({
  stages,
  setDewdate,
  setCStageName,
  percentageOfComplete,
  initiative
}) => {
  console.log(
    "CustomProgressBar",
    stages,
    setDewdate,
    setCStageName,
    percentageOfComplete,
    initiative
  );
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const getStageClass = (stage) => {
    if (stage.isCurrentStage === 1) {
      if (stage.isDelayed === 1) {
        return "sbar sbar-orange1 sbar-large sbar-current";
      }
      return "sbar sbar-orange sbar-large sbar-current";
    }
    if (stage.isStageApproved === 1) {
      return "sbar sbar-green sbar-small";
    }
    if (stage.isDelayed === 1) {
      return "sbar sbar-red sbar-small";
    }
    return "sbar sbar-gray sbar-small";
  };

  useEffect(() => {
    const currentStage = stages?.find((stage) => stage.isCurrentStage === 1);
    if (currentStage) {
      setCStageName(currentStage.requestStage);
      setDewdate(currentStage.dueinDays);
    }
  }, [stages, setCStageName, setDewdate]);

  return (
    <>
      <Box className="progress-container">
        <Box className="progress-bar-wrapper" onClick={handleClick}>
          {stages?.map((stage, index) => (
            <Tooltip key={index} title={`Stage ${index + 1}: ${stage.requestStage}`}>
              <div
                id={`stg-bar-${index + 1}`}
                className={getStageClass(stage)}
                data-bs-toggle="tooltip"
                aria-label={`Stage ${index + 1}: ${stage.requestStage}`}
              >
                {stage.isCurrentStage === 1 && (
                  <a
                    href="javascript:;"
                    style={{ zIndex: 2, position: "relative", fontSize: "8px" }} // Font size set here
                    className="progress-text"
                  >
                    {`${(Number(percentageOfComplete) || 0).toFixed(1)}% Completed`}
                    {/* Display with one decimal */}
                  </a>
                )}
              </div>
            </Tooltip>
          ))}
        </Box>
      </Box>
      {openModal && (
        <InitiativeDetailsModal
          open={openModal}
          handleClose={handleClose}
          initiative={initiative}
          initiativesID={initiative?.ideaID}
        />
      )}
    </>
  );
};

export default CustomProgressBar;
