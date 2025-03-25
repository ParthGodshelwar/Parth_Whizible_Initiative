import React, { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import {
  faUser,
  faFileLines,
  faLayerGroup,
  faNetworkWired
} from "@fortawesome/free-solid-svg-icons"; // Import icons
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import EditPage from "../../views/InitiativeManagement/Edit/EditPage"; // Adjust the path as necessary
import CommentsSection from "../../views/InitiativeManagement/CommentsSection"; // Adjust the path as necessary
// Commented By Madhuri.K and Added History Drawer section
// import FlagDrawer from "../../views/InitiativeManagement/FlagDrawer"; // Adjust the path as necessary
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import { IconButton, Typography, Box, MenuItem } from "@mui/material"; // Import MUI components
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
// Added By Madhuri.K On 23-Dec-2024 for IM Image
import IM_Img from "../../../assets/img/initiative-management-icn.svg";
// import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
const CardView = ({ data, currentPage, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [editingID, setEditingID] = useState(null); // State to track which item is being edited
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false); // State for Comments section
  // Commented By Madhuri.K On 13-Dec-2024
  // const [flagDrawerOpen, setFlagDrawerOpen] = useState(false); // State for Flag drawer

  // History Section added By Madhuri.K On 13-Dec-2024
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false); // State for History drawer
  const [ideaIdPk, setIdeaIdPk] = useState(null); // State to track selected idea ID
  // State for current page
  const itemsPerPage = 6; // Set items per page (adjust as needed)
  const [name, setName] = useState(null);
  const [title, setTitle] = useState(null);
  const totalItems = data?.data?.listConvertedIni?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [refresh12, setRefresh12] = useState(false);
  console.log("item", data);

  const handleEditClick = (id) => {
    setEditingID(id); // Set the ID of the item to be edited
    setIsEditing(true); // Set editing mode to true
  };

  const handleCommentClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for comments
    setCommentDrawerOpen(true); // Open the comments section
  };

  // const handleFlagClick = (id) => {
  //   setIdeaIdPk(id); // Set the ID of the item for flagging
  //   setFlagDrawerOpen(true); // Open the flag drawer
  // };

  const handleHistoryClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for flagging
    setHistoryDrawerOpen(true); // Open the flag drawer
    console.log("InitiativeHistoryDrawer");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Change to the new page
  };

  // Get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.data?.listConvertedIni?.slice(indexOfFirstItem, indexOfLastItem);

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
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div className="col-md-4 d-flex justify-content-center mb-3" key={index}>
                <div className="wCard d-flex">
                  <div
                    className="card card2 yellowBrdr flex-1"
                    style={{ border: "1px solid #03BA28" }}
                  >
                    <div className="card-body pt-2">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={item.initiativeImage}
                          className="CardViewIniImg pendingStage"
                          style={{ width: "30px", height: "30px", marginRight: "10px" }}
                        />
                        <h6 className="card-title mb-0">{item.title}</h6>
                      </div>

                      <div className="card-header d-flex justify-content-between align-items-center mb-2">
                        <p className="cardIniCode mb-0">
                          {item.demandCode} &nbsp; | &nbsp; {item.requestStage}
                        </p>
                        <div className="Action_col position-relative text-end d-flex  justify-content-end">
                          <div className="d-flex ">
                            <Tooltip title="Edit" arrow>
                              <EditIcon
                                className="me-1"
                                sx={{ fontSize: 15, cursor: "pointer" }}
                                onClick={() => handleEditClick(item.ideaID)}
                              />
                            </Tooltip>
                            {/* <Tooltip title="Flag" arrow>
                            <FlagIcon
                              className="me-1"
                              sx={{ fontSize: 15, cursor: "pointer" }}
                              onClick={() => {
                                handleFlagClick(item.ideaID);
                                setTitle(item.title);
                              }}
                            />
                          </Tooltip> */}
                          </div>
                          <div className="d-flex">
                            <Tooltip title="History" arrow>
                              <AccessTimeIcon
                                className="me-1"
                                sx={{ fontSize: 15, cursor: "pointer" }}
                                onClick={() => handleHistoryClick(item.ideaID)}
                              />
                            </Tooltip>
                            <Tooltip title="Comment" arrow>
                              <CommentIcon
                                sx={{ fontSize: 15, cursor: "pointer" }}
                                onClick={() => {
                                  handleCommentClick(item.ideaID);
                                  setName(item.demandCode);
                                }}
                              />
                            </Tooltip>
                          </div>
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
                        <div className="cardLeftImg fontIcnSize me-2">
                          <FontAwesomeIcon icon={faUser} className="fontIcnSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Vendor: </span>
                          {item.vendor || "N/A"}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnSize me-2">
                          <FontAwesomeIcon icon={faFileLines} className="fontIcnSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Converted To: </span>
                          {item.convertedTo || "N/A"}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnsSize me-2">
                          <FontAwesomeIcon icon={faLayerGroup} className="fontIcnsSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Business Group: </span>
                          {item.businessGroup}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg fontIcnsSize me-2">
                          <FontAwesomeIcon icon={faNetworkWired} className="fontIcnsSize" />
                        </div>
                        <div className="cardContent">
                          <span className="CardViewTitle">Organization Unit: </span>
                          {item.location || "N/A"}
                        </div>
                      </div>

                      <div className="bottomSection">
                        <hr />

                        {/* Image and Created By in the same line */}
                        <div className="d-flex align-items-center">
                          <span className="CardViewTitle">Created By: </span>
                          <img
                            src={item.employeeImage} // Updated employee image source
                            alt=""
                            className="CardViewIconImg ms-1"
                            style={{ width: "30px", height: "30px", marginRight: "10px" }}
                          />
                          <div>{item.createdBy}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <p>There are no items to show in this view.</p>
            </div>
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
            disabled={!currentItems || currentItems.length === 0 || currentItems.length <= 5}
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

      {/* Render Flag Drawer */}
      {/* {flagDrawerOpen && (
        <FlagDrawer
          title={title}
          isOpen={flagDrawerOpen}
          onClose={() => setFlagDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )} */}
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
