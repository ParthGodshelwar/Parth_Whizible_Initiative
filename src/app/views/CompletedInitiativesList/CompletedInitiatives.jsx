import React, { useState, useEffect } from "react";
import InitiativeTable from "./InitiativeTable";
import InitiativeCharts from "./InitiativeCharts";
import CardView from "./CardView";
import GetCompletedIniGraphByNOI from "../../hooks/CompletedInitiative/GetCompletedIniGraphByNOI";
import GetCompletedIniGraphByOU from "../../hooks/CompletedInitiative/GetCompletedIniGraphByOU";
import GetCompletedIniGraphByConvertedTo from "../../hooks/CompletedInitiative/GetCompletedIniGraphByConvertedTo";
import CompletedIni from "../../hooks/CompletedInitiative/CompletedIni";
import { Tooltip, IconButton } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import SearchAdvanceForm from "./SearchAdvanceForm";
// Added by Madhuri.K
// import fetchFilters from "../../hooks/SearchFilters/filters"; // Assume this is the correct import
// import SearchList from "../../utils/SearchList";
import { Box } from "@mui/material";
import "../../style_custom.css";
// End of Added by Madhuri.K
import EditPage from "../InitiativeManagement/Edit/EditPage";

const CompletedInitiatives = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isListView, setIsListView] = useState(true); // Track view state
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [initiativeId, setInitiativeId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [graphDisplay, setGraphDisplay] = useState(true);
  const [image, setImage] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  // End of Added by Madhuri.K
  const [completedIniData, setCompletedIniData] = useState([]);
  const [refresh12, setRefresh12] = useState(false);
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSearch = async (formValues) => {
    const accessToken = sessionStorage.getItem("access_token");
    console.log("formValues", formValues?.natureOfInitiativeId);

    // Constructing the query parameters
    const params = [
      formValues.natureOfInitiativeId && `natureOfInitiativeId=${formValues.natureOfInitiativeId}`,
      formValues.businessGroupId && `businessGroupId=${formValues.businessGroupId}`,
      formValues.organizationUnitId && `organizationUnitId=${formValues.organizationUnitId}`,
      formValues.initiativeCode && `initiativeCode=${formValues.initiativeCode}`,
      formValues.InitiativeTitle && `InitiativeTitle=${formValues.InitiativeTitle}`,
      formValues.ConvertedTo && `ConvertedTo=${formValues.ConvertedTo}`
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;
    if (!isListView) {
      // Construct the full URL
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CompletedIni/GetCompletedINICardView${queryString}`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCompletedIniData(data?.data?.listCompletedIni); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };
  // Fetch completed initiatives data
  const fetchCompletedIniData = async () => {
    console.log("formValues", searchFilters);
    const accessToken = sessionStorage.getItem("access_token");
    const params = [
      searchFilters.natureOfInitiativeId &&
        `natureOfInitiativeId=${searchFilters.natureOfInitiativeId}`.trim(),
      searchFilters.businessGroupId && `businessGroupId=${searchFilters.businessGroupId}`.trim(),
      searchFilters.organizationUnitId &&
        `organizationUnitId=${searchFilters.organizationUnitId}`.trim(),
      searchFilters.initiativeCode && `initiativeCode=${searchFilters.initiativeCode}`.trim(),
      searchFilters.initiativeTitle && `InitiativeTitle=${searchFilters.initiativeTitle}`.trim(),
      searchFilters.ConvertedTo && `ConvertedTo=${searchFilters.ConvertedTo}`.trim()
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;
    console.log("formValues", queryString);
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CompletedIni/GetCompletedINICardView${queryString}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCompletedIniData(data?.data?.listCompletedIni); // Assuming the response is in the required format
    } else {
      console.error("Error fetching completed initiatives data:", response.statusText);
    }
  };

  useEffect(() => {
    if (!isListView) {
      fetchCompletedIniData(); // Fetch data on component mount
    }
  }, [isListView, currentPage, searchFilters]);

  const { completedIni } = CompletedIni(searchFilters, currentPage);
  const { CompletedIni2 } = GetCompletedIniGraphByNOI();
  const { CompletedIni3 } = GetCompletedIniGraphByOU();
  const { CompletedIni1 } = GetCompletedIniGraphByConvertedTo();

  const toggleView = () => {
    setIsListView(!isListView); // Toggle between list and card view
    setCurrentPage(1);
  };
  // Added by Madhuri.K to hide graph cards
  const hideGraphOnClick = () => {
    setGraphDisplay(!graphDisplay);
  };
  console.log("initiativeId6", initiativeId);
  return (
    <div className="container mt-3">
      {editMode ? (
        <>
          <EditPage
            initiativesID={initiativeId}
            setIsEditing={setEditMode}
            image={image}
            setRefresh12={setRefresh12}
            refresh12={refresh12}
            show={0}
          />
        </>
      ) : (
        <>
          <div className="d-flex justify-content-end align-content-center gap-1 mb-2">
            <div className="me-3" onClick={handleShowForm}>
              <Tooltip title="Search">
                <img src={SearchIcon} alt="" />
              </Tooltip>
            </div>
            <Tooltip title={!isListView ? "Switch to List view" : "Switch to Card view"}>
              <IconButton onClick={toggleView}>
                {isListView ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Tooltip>
          </div>
          {showForm && (
            <SearchAdvanceForm
              onClose={handleCloseForm}
              searchFilters={searchFilters}
              onSearch={(searchType, formValues) => {
                console.log("Search triggered", searchType, formValues);
                setCurrentPage(1);
                //handleSearch(searchType);

                setSearchFilters(searchType); // Save the search filters if needed
              }}
            />
          )}
          {/* Commented By Madhuri.K comment start here */}
          {/* {isListView && (
        <InitiativeCharts Graph={CompletedIni3} NOIData={CompletedIni2} ByOUData={CompletedIni1} />
      )} */}
          {/* Commented By Madhuri.K comment end here */}
          <Box className="" style={{ marginTop: "5px" }}>
            {/* Modified by Madhuri.K to hide graph cards */}
            {isListView && (
              <InitiativeCharts
                Graph={CompletedIni3}
                NOIData={CompletedIni2}
                ByOUData={CompletedIni1}
              />
            )}
            {/* {showForm && (
            <SearchList
              onClose={handleCloseForm}
              searchFilters={searchFilters}
              onSearch={onSearch}
            />
          )} */}
          </Box>
          {/* End of Modified by Madhuri.K to hide graph cards */}

          {isListView ? (
            <InitiativeTable
              completedIni={completedIni} // Use the fetched completed initiatives data
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              commentDrawerOpen={commentDrawerOpen}
              setCommentDrawerOpen={setCommentDrawerOpen}
              historyDrawerOpen={historyDrawerOpen}
              setHistoryDrawerOpen={setHistoryDrawerOpen}
              editMode={editMode}
              setEditMode={setEditMode}
              initiativeId={initiativeId}
              setInitiativeId={setInitiativeId}
            />
          ) : (
            // Use the CardView component
            <CardView
              data={completedIniData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CompletedInitiatives;
