import React, { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faFileLines,
  faLayerGroup,
  faNetworkWired
} from "@fortawesome/free-solid-svg-icons"; // Import icons
import { IconButton, Typography, Box } from "@mui/material"; // Import MUI components
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditPage from "../../views/InitiativeManagement/Edit/EditPage"; // Adjust the path as necessary
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import CommentsSection from "../../views/InitiativeManagement/CommentsSection"; // Adjust the path as necessary
import { Tooltip } from "@mui/material";
import IM_Img from "../../../assets/img/initiative-management-icn.svg";
const CardView = ({ data, currentPage, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [editingID, setEditingID] = useState(null); // State to track which item is being edited
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false); // State for Comments section
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false); // State for Flag drawer
  const [ideaIdPk, setIdeaIdPk] = useState(null); // State to track selected idea ID
  const [name, setName] = useState(null);
  console.log("item", data);
  const [refresh12, setRefresh12] = useState(false);
  const handleEditClick = (id) => {
    setEditingID(id); // Set the ID of the item to be edited
    setIsEditing(true); // Set editing mode to true
  };

  const handleCommentClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for comments
    setCommentDrawerOpen(true); // Open the comments section
    console.log("handleCommentClick", id);
  };

  const handleHistoryClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for flagging
    setHistoryDrawerOpen(true); // Open the flag drawer
    console.log("InitiativeHistoryDrawer");
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Change to the new page
  };
  return (
    <div className="row">
      {isEditing ? (
        <EditPage
          initiativesID={editingID}
          setIsEditing={setIsEditing}
          setRefresh12={setRefresh12}
          refresh12={refresh12}
          show={0}
        />
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <div className="col-md-4 mb-3 d-flex justify-content-center" key={index}>
                <div className="wCard d-flex">
                  <div className="card card2 yelllowBrdr flex-1">
                    <div className="card-body pt-2">
                      {/* Image and Title on the same line */}
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={item.initiativeImage} // Updated image source
                          className=" CardViewIniImg pendingStage"
                          style={{ width: "30px", height: "30px", marginRight: "10px" }}
                        />
                        <h6 className="card-title mb-0">{item.title}</h6>
                      </div>
                      <div className="card-header d-flex justify-content-between mb-0">
                        <p className="cardIniCode mb-0">
                          {item.demandCode} &nbsp; | &nbsp; {item.requestStage}
                        </p>
                        <div className="Action_col position-relative text-end">
                          <Tooltip title="Edit ">
                            <EditIcon
                              className="me-1"
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => handleEditClick(item.ideaID)} // Handle edit click
                            />
                          </Tooltip>
                          <Tooltip title="History">
                            <AccessTimeIcon
                              className="me-1"
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => handleHistoryClick(item.ideaID)} // Handle flag click
                            />
                          </Tooltip>
                          <Tooltip title="Comment ">
                            <CommentIcon
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => {
                                setName(item.demandCode);
                                handleCommentClick(item.ideaID);
                              }} // Handle comment click
                            />
                          </Tooltip>
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnSize me-2">
                          <img
                            src={IM_Img}
                            alt="Initiative Management"
                            className="IM_fontIcnSize"
                          />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Nature of Initiative: </span>
                          {item.natureofDemand}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnSize me-1">
                          <FontAwesomeIcon icon={faUser} className="fontIcnSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Vendor: </span>
                          {item.vendor || "N/A"}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnSize me-1">
                          <FontAwesomeIcon icon={faFileLines} className="fontIcnSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Converted To: </span>
                          {item.convertedTo || "N/A"}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnsSize me-1">
                          <FontAwesomeIcon icon={faLayerGroup} className="fontIcnsSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Business Group: </span>
                          {item.businessGroup}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnsSize me-1">
                          <FontAwesomeIcon icon={faNetworkWired} className="fontIcnsSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Organization Unit: </span>
                          {item.location ? item.location : "N/A"}
                        </div>
                      </div>
                      <hr />
                      <div className="d-flex align-items-center">
                        <span className="CardViewTitle">Created By: </span>
                        <img
                          src={item.employeeImage} // Updated employee image source
                          alt=""
                          className="CardViewIconImg ms-1 ml-1"
                          style={{ width: "30px", height: "30px", marginRight: "10px" }}
                        />
                        <div>{item.employeeName}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-4">There are no items to show in this view.</div>
          )}
        </>
      )}
      {!isEditing && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <IconButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {currentPage}</Typography>
          <IconButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!data || data.length === 0 || data.length <= 5}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      )}
      {/* Render Comments Section */}
      {commentDrawerOpen && (
        <CommentsSection
          name={name}
          initiativeId={ideaIdPk}
          commentDrawerOpen={commentDrawerOpen}
          setCommentDrawerOpen={setCommentDrawerOpen}
        />
      )}
      {historyDrawerOpen && (
        <InitiativeHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )}
    </div>
  );
};

export default CardView;
