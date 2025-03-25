import React, { useState, useEffect } from "react";
import WatchListConfiguration from "../../hooks/Watch/WatchListConfiguration";
import InitiativeTable from "./InitiativeTable";
import Pagination from "@mui/material/Pagination"; // Pagination Component from Material-UI
import SearchAdvanceForm from "./SearchAdvanceForm";
import { Tooltip } from "@mui/material";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import "./InitiativeTable.css";

import "../../style_custom.css";

const WatchList = () => {
  const [initiativeData, setInitiativeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({
    natureOfInitiativeId: "",
    businessGroupId: "",
    organizationUnitId: "",
    stageOfApprovalId: "",
    StatusId: "",
    DemandCode: "",
    StageApprover: "",
    initiativeTitle: "",
    CompletedTo: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for API request

  const fetchWatchListData = async () => {
    setLoading(true); // Set loading to true before API call
    console.log("searchParams", searchParams?.formValues?.initiativeTitle);
    try {
      const response = await WatchListConfiguration({
        PageNo: currentPage,
        InitiativeTitle: searchParams?.formValues?.initiativeTitle,
        // StatusID: null,
        NatureofInitiativeId: searchParams?.formValues?.natureOfInitiativeId,
        BusinessGroupId: searchParams?.formValues?.businessGroupId,
        OrganizationUnitId: searchParams?.formValues?.organizationUnitId,
        InitiativeCode: searchParams?.formValues?.DemandCode,
        CurrentStageID: searchParams?.formValues?.stageOfApprovalId, 
        StatusID: searchParams?.formValues?.StatusId,
        CurrentStageApprover:searchParams?.formValues?.StageApprover,
      });

      setInitiativeData(response.data.listWatchListConfigurationEntity);
      setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after API response
    }
  };

  const handleShowForm = () => setShowForm(!showForm);
  const handleCloseForm = () => setShowForm(false);

  const handleSearchChange = (formValues) => {
    console.log("searchParams", formValues);
    setSearchParams((prev) => ({
      formValues
    }));
    setCurrentPage(1); // Reset to first page on search change
  };

  useEffect(() => {
    console.log("fetchWatchListData");
    fetchWatchListData(); // Fetch data when currentPage or searchParams change
  }, [currentPage, searchParams]);

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2></h2>
        <div className="d-flex align-items-center gap-1">
          <div className="me-3" onClick={handleShowForm}>
            <Tooltip title="Search">
              <img src={SearchIcon} alt="Search Icon" />
            </Tooltip>
          </div>
        </div>
      </div>

      {showForm && (
        <SearchAdvanceForm
          onClose={handleCloseForm}
          searchFilters={searchParams} // Passing searchParams directly
          onSearch={(searchType, formValues) => {
            handleSearchChange(searchType, formValues); // Handle search change
          }}
        />
      )}

      {/* {loading ? (
        <div>Loading...</div> // Display loading text or spinner during fetch
      ) : ( */}
        <InitiativeTable
          wareHouseIni={initiativeData}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      {/* )} */}

      {/* Pagination Controls */}
    </div>
  );
};

export default WatchList;
