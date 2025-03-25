import React, { useState, useEffect } from "react";
import InitiativeTable from "./InitiativeTable";
import InitiativeCharts from "./InitiativeCharts";
import CardView from "./CardView";
import ConvertedIni from "../../hooks/ConvertedInitiative/ConvertedIni";
import GetConvertedIniGraphByNOI from "../../hooks/ConvertedInitiative/GetConvertedIniGraphByNOI";
import GetConvertedIniGraphByOU from "../../hooks/ConvertedInitiative/GetConvertedIniGraphByOU";
import GetConvertedIniGraphByConvertedTo from "../../hooks/ConvertedInitiative/GetConvertedIniGraphByConvertedTo";
import { Tooltip, IconButton, Box } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import SearchAdvanceForm from "./SearchAdvanceForm"; // Make sure to import your SearchAdvanceForm component
import EditPage from "../InitiativeManagement/Edit/EditPage";
// Added references by Madhuri.K
import "../../style_custom.css";
// End of Added references by Madhuri.K

const ConvertedInitiatives = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isListView, setIsListView] = useState(true);
  const pageNo = 1;
  const [showForm, setShowForm] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const { convertedIni } = ConvertedIni(searchFilters, pageNo);
  const { ConvertedIni2 } = GetConvertedIniGraphByNOI();
  const { ConvertedIni3 } = GetConvertedIniGraphByOU();
  const { ConvertedIni1 } = GetConvertedIniGraphByConvertedTo();
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [initiativeId, setInitiativeId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // State for search filters
  const [refresh12, setRefresh12] = useState(false);
  const toggleView = () => {
    setIsListView(!isListView);
    setCurrentPage(1);
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Fetch data from API
  useEffect(() => {
    if (!isListView) {
      const fetchData = async () => {
        const accessToken = sessionStorage.getItem("access_token");
        console.log("searchFilters", searchFilters);
        // Constructing the query parameters from searchFilters
        const params = [
          searchFilters.natureOfInitiativeId &&
            `natureOfInitiativeId=${searchFilters.natureOfInitiativeId}`,
          searchFilters.businessGroupId && `businessGroupId=${searchFilters.businessGroupId}`,
          searchFilters.organizationUnitId &&
            `organizationUnitId=${searchFilters.organizationUnitId}`,
          searchFilters.initiativeCode && `initiativeCode=${searchFilters.initiativeCode}`,
          searchFilters.initiativeTitle && `InitiativeTitle=${searchFilters.initiativeTitle}`,
          searchFilters.convertedTo && `ConvertedTo=${searchFilters.convertedTo}`
        ].filter(Boolean); // Filter out any undefined values

        // Join parameters to create the query string
        const queryString =
          params.length > 0 ? `?${params.join("&")}&PageNo=${pageNo}` : `?PageNo=${pageNo}`;
        console.log("searchFiltersqueryString", queryString);
        const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ConvertedIni/GetConvertedINICardView${queryString}`;

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
          setApiData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [isListView, searchFilters, currentPage]); // Depend on isListView and searchFilters

  // Function to handle search
  const handleSearch = async (formValues) => {
    const accessToken = sessionStorage.getItem("access_token");
    console.log("formValues", formValues?.natureOfInitiativeId);

    // Constructing the query parameters
    const params = [
      formValues.natureOfInitiativeId &&
        `natureOfInitiativeId=${formValues.natureOfInitiativeId}`.trim(),
      formValues.businessGroupId && `businessGroupId=${formValues.businessGroupId}`.trim(),
      formValues.organizationUnitId && `organizationUnitId=${formValues.organizationUnitId}`.trim(),
      formValues.initiativeCode && `initiativeCode=${formValues.initiativeCode}`.trim(),
      formValues.InitiativeTitle && `InitiativeTitle=${formValues.InitiativeTitle}`.trim(),
      formValues.ConvertedTo && `ConvertedTo=${formValues.ConvertedTo}`.trim()
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${pageNo}` : `?PageNo=${pageNo}`;
    if (!isListView) {
      // Construct the full URL
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ConvertedIni/GetConvertedINICardView${queryString}`;

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
        setApiData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className="container mt-2">
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
          <div className="d-flex justify-content-end align-items-center gap-2">
            <div className="" onClick={handleShowForm}>
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

                setSearchFilters(searchType); // Save the search filters if needed
              }}
            />
          )}
          {isListView && (
            <InitiativeCharts
              Graph={ConvertedIni3}
              NOIData={ConvertedIni2}
              ByOUData={ConvertedIni1}
            />
          )}
          <div className="mb-2"></div>
          {isListView ? (
            <InitiativeTable
              convertedIni={convertedIni}
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
            <CardView data={apiData} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          )}
        </>
      )}
    </div>
  );
};

export default ConvertedInitiatives;
