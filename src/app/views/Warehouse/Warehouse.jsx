import React, { useState, useEffect } from "react";
import InitiativeTable from "./InitiativeTable";
import InitiativeCharts from "./InitiativeCharts";
import WareHouseIni from "../../hooks/WareHouse/WareHouseIni"; // Ensure that you use the correct hook name
import GetConvertedIniGraphByNOI from "../../hooks/WareHouse/GetConvertedIniGraphByNOI";
import GetConvertedIniGraphByOU from "../../hooks/WareHouse/GetConvertedIniGraphByOU";
import GetConvertedIniGraphByConvertedTo from "../../hooks/WareHouse/GetConvertedIniGraphByConvertedTo";
import { Tooltip, IconButton } from "@mui/material";
import { ViewList, ViewModule } from "@mui/icons-material";
import CardView from "./CardView";
import SearchAdvanceForm from "./SearchAdvanceForm";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import EditPage from "../InitiativeManagement/Edit/EditPage";
// Added By Madhuri.K On 14-Nov-2024
import "../../style_custom.css";

const Warehouse = () => {
  const [isListView, setIsListView] = useState(true);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const [initiativeId, setInitiativeId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { ConvertedIni2 } = GetConvertedIniGraphByNOI();
  const { ConvertedIni3 } = GetConvertedIniGraphByOU();
  const { ConvertedIni1 } = GetConvertedIniGraphByConvertedTo();
  const [completedIniData, setCompletedIniData] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [refresh12, setRefresh12] = useState(false);
  const { wareHouseIni } = WareHouseIni(searchFilters, currentPage);
  const [showForm, setShowForm] = useState(false);
  // const fetchCompletedIniData = async () => {
  //   const accessToken = sessionStorage.getItem("access_token");
  //   const response = await fetch(
  //     `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WareHouseIni/GetWareHouseCardView?PageNo=${currentPage}`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`
  //       }
  //     }
  //   );

  //   if (response.ok) {
  //     const data = await response.json();
  //     setCompletedIniData(data?.data?.listWareHouseIni); // Assuming the response is in the required format
  //   } else {
  //     console.error("Error fetching completed initiatives data:", response.statusText);
  //   }
  // };
  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleSearch = async () => {
    const accessToken = sessionStorage.getItem("access_token");
    console.log("formValuessearchFilters", searchFilters);

    // Constructing the query parameters
    const params = [
      searchFilters?.natureOfInitiativeID &&
        `natureOfInitiativeId=${searchFilters?.natureOfInitiativeID}`.trim(),
      searchFilters?.businessGroupId && `businessGroupId=${searchFilters?.businessGroupId}`.trim(),
      searchFilters?.StatusID && `Status=${searchFilters?.StatusID}`.trim(),
      searchFilters?.initiativeCode && `initiativeCode=${searchFilters?.initiativeCode}`.trim(),
      searchFilters?.initiativeTitle && `Title=${searchFilters?.initiativeTitle}`.trim(),
      searchFilters?.ConvertedTo && `ConvertedTo=${searchFilters?.ConvertedTo}`.trim()
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;
    console.log("queryString", searchFilters);

    if (!isListView) {
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WareHouseIni/GetWareHouseCardView${queryString}`;

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
        setCompletedIniData(data?.data?.listWareHouseIni); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };
  useEffect(() => {
    if (!isListView) {
      handleSearch(); // Fetch data on component mount
    }
  }, [isListView, currentPage, searchFilters]);
  const toggleView = () => {
    setIsListView(!isListView);
    setCurrentPage(1); // Toggle between list and card view
  };

  console.log("ConvertedIni24", ConvertedIni2);
  console.log("ConvertedIni241", ConvertedIni3);
  console.log("ConvertedIni242", ConvertedIni1);
  return (
    <div className="container mt-3">
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
          <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
            <div className="me-0" onClick={handleShowForm}>
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
                setCurrentPage(1);
                console.log("Search triggered", searchType, formValues);
                // handleSearch(formValues);
                setSearchFilters(searchType); // Save the search filters if needed
              }}
            />
          )}
          {isListView ? (
            <>
              <InitiativeCharts
                Graph={ConvertedIni3}
                NOIData={ConvertedIni2}
                ByOUData={ConvertedIni1}
              />
              <div className="mb-2"></div>
              <InitiativeTable
                wareHouseIni={wareHouseIni}
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
            </>
          ) : (
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

export default Warehouse;
