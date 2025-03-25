import React, { useState, useEffect } from "react";
import InitiativeTable from "./InitiativeTable";
import InitiativeCharts from "./InitiativeCharts";
import WithdrawnIni from "../../hooks/Withdrawn/WithdrawnIni";
import GetWithdrawInitiativeGraphByOU from "../../hooks/Withdrawn/GetWithdrawInitiativeGraphByOU";
import GetWithdrawInitiativeGraphByStage from "../../hooks/Withdrawn/GetWithdrawInitiativeGraphByStage";
import GetWithdrawInitiativeGraphByMonth from "../../hooks/Withdrawn/GetWithdrawInitiativeGraphByMonth";
import { Tooltip, IconButton } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import CardView from "./CardView";
import SearchAdvanceForm from "./SearchAdvanceForm";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import EditPage from "../InitiativeManagement/Edit/EditPage";
import "../../style_custom.css";

const WithdrawnInitiatives = () => {
  const [isListView, setIsListView] = useState(true); // Track view state

  const { WithdrawInitiative2 } = GetWithdrawInitiativeGraphByOU();
  const { WithdrawInitiative3 } = GetWithdrawInitiativeGraphByStage();
  const { WithdrawInitiative1 } = GetWithdrawInitiativeGraphByMonth();
  const [completedIniData, setCompletedIniData] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [refresh12, setRefresh12] = useState(false);
  const { withdrawnIni } = WithdrawnIni(searchFilters, currentPage, refresh12);
  const [initiativeId, setInitiativeId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  // Fetch completed initiatives data
  const fetchCompletedIniData = async () => {
    const accessToken = sessionStorage.getItem("access_token");
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WithdrawnIni/WithDrawINICardView?PageNo=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      setCompletedIniData(data?.data?.listwithdrawnIni); // Assuming the response is in the required format
    } else {
      console.error("Error fetching completed initiatives data:", response.statusText);
    }
  };
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  useEffect(() => {
    if (!isListView) {
      handleSearch(); // Fetch data on component mount
    }
  }, [isListView, currentPage, searchFilters]);

  const toggleView = () => {
    setIsListView(!isListView); // Toggle between list and card view
    setCurrentPage(1);
  };
  const handleSearch = async (formValues) => {
    const accessToken = sessionStorage.getItem("access_token");
    console.log("formValues", searchFilters);

    const params = [
      searchFilters?.natureOfInitiativeId &&
        `natureOfInitiativeId=${searchFilters?.natureOfInitiativeId}`.trim(),
      searchFilters?.businessGroupId && `businessGroupId=${searchFilters?.businessGroupId}`.trim(),
      searchFilters?.organizationUnitId &&
        `organizationUnitId=${searchFilters?.organizationUnitId}`.trim(),
      searchFilters?.DemandCode && `initiativeCode=${searchFilters?.DemandCode}`.trim(),
      searchFilters?.initiativeTitle && `InitiativeTitle=${searchFilters?.initiativeTitle}`.trim(),
      searchFilters?.ConvertedTo && `ConvertedTo=${searchFilters?.ConvertedTo}`.trim()
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;
    console.log("queryString", formValues);
    if (!isListView) {
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WithdrawnIni/WithDrawINICardView${queryString}`;

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
        setCompletedIniData(data?.data?.listwithdrawnIni); // Update state with fetched data
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
            setRefresh12={setRefresh12}
            refresh12={refresh12}
            show={0}
          />
        </>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2></h2>
            <div className="d-flex align-items-center gap-2">
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
          </div>
          {showForm && (
            <SearchAdvanceForm
              onClose={handleCloseForm}
              searchFilters={searchFilters}
              onSearch={(searchType, formValues) => {
                setCurrentPage(1);
                console.log("Search triggered", searchType, formValues);

                setSearchFilters(searchType); // Save the search filters if needed
              }}
            />
          )}
          {/* Render charts only in list view */}
          {isListView ? (
            <>
              <InitiativeCharts
                ByOUData={WithdrawInitiative2}
                NOIData={WithdrawInitiative3}
                Graph={WithdrawInitiative1}
              />
              <div className="mb-2"></div>
              <InitiativeTable
                withdrawnIni={withdrawnIni}
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
                setRefresh12={setRefresh12}
              />
            </>
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

export default WithdrawnInitiatives;
