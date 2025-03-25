import React, { useState } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFileLines,
  faLayerGroup,
  faNetworkWired
} from "@fortawesome/free-solid-svg-icons"; // Import icons
import EditPage from "../../views/InitiativeManagement/Edit/EditPage"; // Adjust the path as necessary
import CommentsSection from "../../views/InitiativeManagement/CommentsSection"; // Adjust the path as necessary
import FlagDrawer from "../../views/InitiativeManagement/FlagDrawer"; // Adjust the path as necessary
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InitiativeHistoryDrawer from "../InitiativeManagement/InitiativeHistoryDrawer";
import AutorenewIcon from "@mui/icons-material/Autorenew";
// Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment start here
import ResubmitDrawer from "./ResubmitDrawer";
// Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment end here
// Added By Madhuri.K On 23-Dec-2024 for IM Image
import IM_Img from "../../../assets/img/initiative-management-icn.svg";

const CardView = ({ data, currentPage, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [editingID, setEditingID] = useState(null); // State to track which item is being edited
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false); // State for Comments section
  const [flagDrawerOpen, setFlagDrawerOpen] = useState(false); // State for Flag drawer
  const [ideaIdPk, setIdeaIdPk] = useState(null); // State to track selected idea ID
  // State for current page
  const itemsPerPage = 6; // Set items per page (adjust as needed)
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  // Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment start here
  const [resubmitDrawerOpen, setResubmitDrawerOpen] = useState(false);
  const [initiativeTitle, setInitiativeTitle] = useState("");
  // Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment end here
  const [name, setName] = useState(null);
  console.log("item", data);
  const totalItems = data?.data?.listConvertedIni?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [initiativeId, setInitiativeId] = useState("");
  const handleEditClick = (id) => {
    setEditingID(id); // Set the ID of the item to be edited
    setIsEditing(true); // Set editing mode to true
  };

  const handleCommentClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for comments
    setCommentDrawerOpen(true); // Open the comments section
    console.log("handleCommentClick");
  };

  const handleFlagClick = (id) => {
    setIdeaIdPk(id); // Set the ID of the item for flagging
    setFlagDrawerOpen(true); // Open the flag drawer
    console.log("FlagDrawer");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage); // Change to the new page
  };

  return (
    <div className="row">
      {isEditing ? (
        <EditPage initiativesID={editingID} setIsEditing={setIsEditing} show={0} />
      ) : (
        <>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              // Classes Added By Madhuri.K On 13-Dec-2024 Comment start here
              <div className="col-md-4 d-flex justify-content-center mb-3" key={item.ideaID}>
                <div className="wCard d-flex">
                  <div className="card card2 yelllowBrdr flex-1">
                    <div className="card-body pt-2">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={item.initiativeImage} // Updated image source
                          className="CardViewIniImg pendingStage"
                          style={{
                            width: "30px",
                            height: "30px",
                            marginRight: "10px",
                            borderRadius: "50%"
                          }}
                        />
                        <h6 className="card-title mb-0">{item.title}</h6>
                      </div>
                      <div className="card-header d-flex justify-content-between mb-2">
                        <p className="cardIniCode flex-1 mb-0">
                          {/* {item.demandCode} &nbsp; | &nbsp; {item.deliveryTeam} */}
                          {item.demandCode} &nbsp; | &nbsp; {item.requestStage}
                        </p>
                        <div className="Action_col position-relative text-end">
                          <Tooltip title="Edit" arrow>
                            <EditIcon
                              className="me-1"
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => handleEditClick(item.ideaID)} // Handle edit click
                            />
                          </Tooltip>
                          <Tooltip title="History" arrow>
                            <AccessTimeIcon
                              className="me-1"
                              sx={{ fontSize: 15, cursor: "pointer" }}
                              onClick={() => {
                                setInitiativeId(item.ideaID);
                                console.log("initiativeId", item);
                                setHistoryDrawerOpen(true);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Comment" arrow>
                            <CommentIcon
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => {
                                handleCommentClick(item.ideaID);
                                setName(item.demandCode);
                              }} // Handle comment click
                            />
                          </Tooltip>
                          {/* Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment start here */}
                          <Tooltip title="Resubmit" arrow>
                            <AutorenewIcon
                              fontSize="small"
                              sx={{ fontSize: 15, cursor: "pointer" }} // Add cursor styling
                              onClick={() => {
                                setInitiativeId(item.id);
                                setResubmitDrawerOpen(true);
                                setInitiativeTitle(item.title);
                              }}
                            />
                          </Tooltip>
                          {/* Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment end here */}
                        </div>
                      </div>

                      <div className="mb-1 d-flex">
                        <div className="cardLeftImg me-2">
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
                          {item.nameOfFirm || "N/A"}
                        </div>
                      </div>

                      {/* <div className="mb-1 d-flex">
                      <div className="cardLeftImg fontIcnSize me-2">
                        <FontAwesomeIcon icon={faFileLines} className="fontIcnSize" />
                      </div>
                      <div className="cardContent">
                        <span className="CardViewTitle">Converted To: </span>
                        {item.convertedTo || "N/A"}{" "}
                      
                      </div>
                    </div> */}

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
                      <hr />
                      <div className="CardViewProfile d-flex align-items-center">
                        <div className="">
                          <div className="">
                            <img
                              src={item.employeeImage} // Updated employee image source
                              alt=""
                              className="CardViewIconImg ms-1"
                              style={{ width: "30px", height: "30px", marginRight: "10px" }}
                            />
                            <span className="CardViewTitle">Created By: </span>
                            {item.employeeName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-3">
              <p>There are no items to show in this view.</p>
            </div>
          )}
        </>
      )}

      {!isEditing && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
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

      {/* Render Flag Drawer */}
      {flagDrawerOpen && (
        <FlagDrawer
          isOpen={flagDrawerOpen}
          onClose={() => setFlagDrawerOpen(false)}
          id1={ideaIdPk}
        />
      )}
      {historyDrawerOpen && (
        <InitiativeHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          id1={initiativeId}
        />
      )}
      {/* Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment start here */}
      {resubmitDrawerOpen && (
        <ResubmitDrawer
          title={initiativeTitle}
          initiativeId={initiativeId}
          isOpen={resubmitDrawerOpen}
          onClose={() => setResubmitDrawerOpen(false)}
        />
      )}
      {/* Added By Madhuri.K For Re-Submit Section On 13-Dec-2024 Comment end here */}
    </div>
  );
};

export default CardView;
