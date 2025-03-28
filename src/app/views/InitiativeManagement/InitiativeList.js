import React, { useEffect, useState } from "react";
import InitiativeItem from "./InitiativeItem";
import InitiativeCard from "./InitiativeCard";
import InitiativeCard1 from "./InitiativeCard1";
import InitiativeCard2 from "./InitiativeCard2"; // New component for card view
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  ViewList,
  ViewModule,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material"; // Icons for navigation
import "./InitiativeList.css"; // Import your CSS file for styles
import SearchIcon from "../../../assets/img/search-icn.svg";

const ITEMS_PER_PAGE = 5; // Number of items per page

const InitiativeList = ({
  initiatives,
  dashboardData1,
  dashboardData2,
  dashboardData3,
  currentCardPage1,
  currentCardPage2,
  currentCardPage3,
  setCurrentCardPage1,
  setCurrentCardPage2,
  setCurrentCardPage3,
  setCurrentPage,
  currentPage,
  setIsEditing,
  isEditing,
  startEditing,
  SetinitiativesID,
  stopEditing,
  isListView,
  canEdit,
  handleDisabledClick,
  totalPages,
  setImage,
  image,
  setIdeaID,
}) => {
  const [filteredInitiatives, setFilteredInitiatives] = useState(
    initiatives || []
  );
  const [searchTermOnTime, setSearchTermOnTime] = useState(""); // State for On Time search
  const [searchTermDelayed, setSearchTermDelayed] = useState(""); // State for Delayed search
  const [searchTermDraft, setSearchTermDraft] = useState(""); // State for Draft search
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  console.log(
    "initiatives1888",
    dashboardData1,
    dashboardData2,
    dashboardData3
  );
  console.log("totalPages", totalPages, currentPage);

  // Effect to update filtered initiatives when the initiatives prop changes
  useEffect(() => {
    const updatedFilteredInitiatives = initiatives?.filter((initiative) =>
      initiative?.title?.toLowerCase().includes(searchTermOnTime?.toLowerCase())
    );
    setFilteredInitiatives(updatedFilteredInitiatives);
  }, [initiatives, searchTermOnTime]);

  // Pagination Logic
  const totalItems = filteredInitiatives?.length;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const initiativesToShow = filteredInitiatives?.slice(startIndex, endIndex);

  // Handle page change for list view
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleNextPageWithDelay = () => {
    setIsButtonDisabled(true); // Disable button
    handleNextPage(); // Call existing function

    setTimeout(() => {
      setIsButtonDisabled(false); // Re-enable after 2 seconds
    }, 2000);
  };
  // Handle previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle next page
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Legend for stages with colored boxes
  const stagesLegend = (
    <div className="gridlegends d-flex justify-content-center">
      <div className="legendList">
        <span id="lgdClearStage" className="legendSquare lgdGreen"></span>
        <span className="ms-2">Cleared</span>
      </div>
      <div className="legendList">
        <span id="lgdCurrentStage" className="legendSquare lgdYellow"></span>
        <span className="ms-2">Current</span>
      </div>
      <div className="legendList">
        <span id="lgdDelauCurrentStage" className="legendSquare lgdOrng"></span>
        <span className="ms-2">Delay</span>
      </div>
      <div className="legendList">
        <span
          id="lgdStageNotStartedYet"
          className="legendSquare lgdGray"
        ></span>
        <span className="ms-2">Not started yet</span>
      </div>
    </div>
  );
  console.log(" filteredInitiatives", filteredInitiatives?.length);
  return (
    <Box>
      {/* Render content based on view mode */}
      {isListView ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3"></div>
          <Table className="table table-bordered">
            <TableHead>
              <TableRow>
                <TableCell
                  className="thOuter custom-col-width"
                  style={{ width: "25%" }}
                >
                  <div className="igph_title position-relative">
                    Initiative Title
                  </div>
                </TableCell>
                <TableCell
                  className="thOuter col-sm-2"
                  style={{ width: "20%" }}
                >
                  <div className="igph_title position-relative">
                    Nature of Initiative
                  </div>
                </TableCell>
                <TableCell
                  className="thOuter col-sm-5"
                  style={{ width: "40%" }}
                >
                  <div className="igph_title position-relative text-center pb-1">
                    Stages
                  </div>
                  <div className="stagesLegendContainer">{stagesLegend}</div>
                </TableCell>
                <TableCell
                  className="thOuter col-sm-1"
                  style={{ width: "15%" }}
                >
                  <div className="igph_title text-center position-relative">
                    Action
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {initiatives?.length > 0 ? (
                initiatives.map((initiative) => (
                  <InitiativeItem
                    key={initiative.id}
                    initiative={initiative}
                    stagesLegend={stagesLegend}
                    setIsEditing={setIsEditing}
                    SetinitiativesID={SetinitiativesID}
                    setIdeaID={setIdeaID}
                    isEditing={isEditing}
                    startEditing={startEditing}
                    stopEditing={stopEditing}
                    canEdit={canEdit}
                    handleDisabledClick={handleDisabledClick}
                    setImage={setImage}
                    image={image}
                  />
                ))
              ) : (
                <tr style={{ backgroundColor: "grey" }}>
                  <td colSpan="10" className="text-center">
                    There are no items to show in this view.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination for List View */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <IconButton
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
              Page - {currentPage}
            </Typography>
            <IconButton
              onClick={handleNextPageWithDelay}
              // disabled={
              //   isButtonDisabled ||
              //   currentPage === totalPages ||
              //   filteredInitiatives === null ||
              //   filteredInitiatives.length === 0 ||
              //   filteredInitiatives.length < 4
              // }
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </>
      ) : (
        <Grid container spacing={3}>
          {dashboardData2 && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  backgroundColor: "#e7edf0",
                  borderTop: "5px solid #3f51b5",
                  borderBottom: "none",
                }}
                className="card-list-container"
              >
                <CardContent>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex justify-content-between w-100">
                      <span
                        id="delayed-initiatives-text"
                        className="text-secondary cursor-pointer"
                        style={{ fontWeight: "bold", fontSize: "1.15" }}
                      >
                        On time initiatives
                      </span>
                      {/* <div className="search-box position-relative">
                        <input
                          id="InitMangntSrchInput"
                          className="search-text"
                          type="text"
                          placeholder="Search"
                          value={searchTermOnTime}
                          onChange={(e) => setSearchTermOnTime(e.target.value)} // Update state for On Time initiatives
                        />
                        <a className="search-btn">
                          <img src={SearchIcon} alt="Search" />
                        </a>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-container">
                    {dashboardData2?.filter((initiative) =>
                      initiative?.title
                        ?.toLowerCase()
                        .includes(searchTermOnTime?.toLowerCase())
                    ).length === 0 ? (
                      <p>There are no items to show in this view.</p>
                    ) : (
                      dashboardData2
                        ?.filter((initiative) =>
                          initiative?.title
                            ?.toLowerCase()
                            .includes(searchTermOnTime?.toLowerCase())
                        )
                        .map((initiative) => (
                          <InitiativeCard
                            key={initiative.id}
                            dashboardData2={initiative}
                            setIsEditing={setIsEditing}
                            SetinitiativesID={SetinitiativesID}
                            isEditing={isEditing}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                            canEdit={canEdit}
                            handleDisabledClick={handleDisabledClick}
                          />
                        ))
                    )}
                  </div>

                  {/* Pagination for On Time initiatives */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        setCurrentCardPage2((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentCardPage2 === 1}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
                      Page {currentCardPage2}
                    </Typography>
                    <IconButton
                      onClick={() => setCurrentCardPage2((prev) => prev + 1)}
                      disabled={
                        dashboardData2.length == 0 ||
                        dashboardData2.length % 5 !== 0
                      }
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          {dashboardData3 && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  backgroundColor: "#e7edf0",
                  borderTop: "5px solid #f55d30",
                  borderBottom: "none",
                }}
                className="card-list-container"
              >
                <CardContent>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex justify-content-between w-100">
                      <span
                        id="delayed-initiatives-text"
                        className="text-secondary cursor-pointer"
                        style={{ fontWeight: "bold", fontSize: "1.15" }}
                      >
                        Delayed initiatives
                      </span>
                      {/* <div className="search-box position-relative">
                        <input
                          id="InitMangntSrchInputDelayed"
                          className="search-text"
                          type="text"
                          placeholder="Search"
                          value={searchTermDelayed}
                          onChange={(e) => setSearchTermDelayed(e.target.value)} // Update state for Delayed initiatives
                        />
                        <a className="search-btn">
                          <img src={SearchIcon} alt="Search" />
                        </a>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-container">
                    {dashboardData3?.filter((initiative) =>
                      initiative?.title
                        ?.toLowerCase()
                        .includes(searchTermDelayed?.toLowerCase())
                    ).length === 0 ? (
                      <p>There are no items to show in this view.</p>
                    ) : (
                      dashboardData3
                        ?.filter((initiative) =>
                          initiative?.title
                            ?.toLowerCase()
                            .includes(searchTermDelayed?.toLowerCase())
                        )
                        .map((initiative) => (
                          <InitiativeCard1
                            key={initiative.id}
                            dashboardData3={initiative}
                            setIsEditing={setIsEditing}
                            SetinitiativesID={SetinitiativesID}
                            isEditing={isEditing}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                            canEdit={canEdit}
                            handleDisabledClick={handleDisabledClick}
                          />
                        ))
                    )}
                  </div>

                  {/* Pagination for Delayed initiatives */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        setCurrentCardPage3((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentCardPage3 === 1}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
                      Page {currentCardPage3}
                    </Typography>
                    <IconButton
                      onClick={() => setCurrentCardPage3((prev) => prev + 1)}
                      disabled={
                        dashboardData3.length == 0 ||
                        dashboardData3.length % 5 !== 0
                      }
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          {dashboardData1 && (
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  backgroundColor: "#e7edf0",
                  borderTop: "5px solid #f5c330",
                  borderBottom: "none",
                }}
                className="card-list-container"
              >
                <CardContent>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex justify-content-between w-100">
                      <span
                        id="delayed-initiatives-text"
                        className="text-secondary cursor-pointer"
                        style={{ fontWeight: "bold", fontSize: "1.15" }}
                      >
                        Draft initiatives
                      </span>
                      {/* <div className="search-box position-relative">
                        <input
                          id="InitMangntSrchInputDraft"
                          className="search-text"
                          type="text"
                          placeholder="Search"
                          value={searchTermDraft}
                          onChange={(e) => setSearchTermDraft(e.target.value)} // Update state for Draft initiatives
                        />
                        <a className="search-btn">
                          <img src={SearchIcon} alt="Search" />
                        </a>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-container">
                    {dashboardData1?.filter((initiative) =>
                      initiative?.title
                        ?.toLowerCase()
                        .includes(searchTermDraft?.toLowerCase())
                    ).length === 0 ? (
                      <p>There are no items to show in this view.</p>
                    ) : (
                      dashboardData1
                        ?.filter((initiative) =>
                          initiative?.title
                            ?.toLowerCase()
                            .includes(searchTermDraft?.toLowerCase())
                        )
                        .map((initiative) => (
                          <InitiativeCard2
                            key={initiative.id}
                            dashboardData1={initiative}
                            setIsEditing={setIsEditing}
                            SetinitiativesID={SetinitiativesID}
                            isEditing={isEditing}
                            startEditing={startEditing}
                            stopEditing={stopEditing}
                            canEdit={canEdit}
                            handleDisabledClick={handleDisabledClick}
                          />
                        ))
                    )}
                  </div>

                  {/* Pagination for Draft initiatives */}
                  {/* Pagination for Draft initiatives */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <IconButton
                      onClick={() =>
                        setCurrentCardPage1((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentCardPage1 === 1} // Disable if on the first page
                    >
                      <ArrowBackIcon />
                    </IconButton>
                    <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>
                      Page {currentCardPage1}
                    </Typography>
                    <IconButton
                      onClick={() => setCurrentCardPage1((prev) => prev + 1)}
                      disabled={
                        dashboardData1.length === 0 ||
                        dashboardData1.length % 5 !== 0
                      } // Disable if dashboardData1 is null
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default InitiativeList;
