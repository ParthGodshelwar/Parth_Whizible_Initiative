import React, { useState, useEffect } from "react";
import InitiativeList from "./InitiativeList";
import {
  Container,
  Box,
  Tooltip,
  Pagination,
  IconButton,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import { PrimaryButton } from "@fluentui/react";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import SearchList from "../../utils/SearchList";
import Initiative from "../../hooks/Initiative";
import { WhizLoading } from "app/components";
import EditPage from "./Edit/EditPage";
import InitiativeTypeSelectionDrawer from "./InitiativeTypeSelectionDrawer";
import { ViewList, ViewModule, SortByAlpha, TrendingUp, CalendarToday } from "@mui/icons-material";
import SearchIcon1 from "../../../assets/img/search-icn.svg";
import useGetViewOptions from "app/hooks/useGetViewOptions";
import tagMappings from "../../../app/TagNames/tag";
import { useTranslation } from "react-i18next";
import fetchFilters from "../../hooks/SearchFilters/filters"; // Assume this is the correct import
import InitiativeCardViewDraft from "../../hooks/CardInitiative/GetInitiativeCardViewDraft";
import InitiativeCardViewDelayed from "app/hooks/CardInitiative/InitiativeCardViewDelayed";
import InitiativeCardViewOnTime from "../../hooks/CardInitiative/GetInitiativeCardViewOnTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
const InitiativeManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCardPage1, setCurrentCardPage1] = useState(1);
  const [currentCardPage2, setCurrentCardPage2] = useState(1);
  const [currentCardPage3, setCurrentCardPage3] = useState(1);
  const [currentFilter, setCurrentFilter] = useState("T");
  const [filters, setFilters] = useState(null);
  const [searchFilters, setSearchFilters] = useState(null);
  const [reset, setRest] = useState(true);
  const [ideaID, setIdeaID] = useState(null);
  const [refresh12, setRefresh12] = useState(false);
  // const { dashboardData, loading, error } = useInitiative(currentPage, currentFilter, filters);
  const [initiatives, setInitiatives] = useState([]);
  const [finitiatives, setfInitiatives] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [initiativesID, SetinitiativesID] = useState(false);
  const [isListView, setIsListView] = useState(true);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Manage total pages with state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getViewOptions } = useGetViewOptions(tagMappings.Initiative.toString());
  const viewPermission = getViewOptions && getViewOptions[0] ? getViewOptions[0] : {};
  const { a: canAdd, e: canEdit, d: canDelete } = viewPermission;
  const { t } = useTranslation();
  const [dashboardData1, setDashboardData1] = useState(null);
  const [dashboardData2, setDashboardData2] = useState(null);
  const [dashboardData3, setDashboardData3] = useState(null);
  const [image, setImage] = useState(null);
  const [previousFilterCounts, setPreviousFilterCounts] = useState({
    inbox: 0,
    watchlist: 0,
    draft: 0
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("Initiative4441", currentPage);
  useEffect(() => {
    const fetchInitiativeData = async () => {
      console.log("Initiative4455", currentFilter, filters);
      setLoading(true); // Set loading to true when fetching starts
      try {
        const data = await Initiative(currentPage, currentFilter, filters); // Call the function and await the result
        setDashboardData(data.initiativeList); // Set the fetched data
        console.log("setDashboardData", data);
        setCount(data.initiativeListCount[0]);
      } catch (error) {
        setError(error.message); // Set the error message
      } finally {
        setLoading(false); // Set loading to false after fetching completes
      }
    };

    fetchInitiativeData(); // Fetch data when dependencies change
  }, [currentPage, currentFilter, filters, refresh12]); // Dependencies

  // Load data when isListView is true
  useEffect(() => {
    if (!isListView) {
      const fetchData = async () => {
        try {
          const data1 = await InitiativeCardViewDraft(currentCardPage1, filters, currentFilter);
          const data2 = await InitiativeCardViewOnTime(currentCardPage2, filters, currentFilter);
          const data3 = await InitiativeCardViewDelayed(currentCardPage3, filters, currentFilter);
          console.log("DashboardData1", data1, data2, data3);
          setDashboardData1(data1);
          setDashboardData2(data2);
          setDashboardData3(data3);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [
    isListView,
    currentCardPage1,
    currentCardPage2,
    currentCardPage3,
    filters,
    currentFilter,
    refresh12
  ]);

  // Conditionally use the data based on `isListView`

  const loadFilters = async () => {
    try {
      const data = await fetchFilters(); // Call the imported filters function
      console.log("Filters", data);
      setSearchFilters(data); // Store the data in state
    } catch (error) {
      console.error("Failed to fetch filters:", error);
    }
  };

  useEffect(() => {
    loadFilters(); // Correctly call the function
  }, []);

  useEffect(() => {
    if (dashboardData) {
      setInitiatives(dashboardData);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (initiatives.length > 0) {
      const counts = {
        T: count?.toDolIstCount,
        W: count?.watchlistCount,
        D: count?.draftCount
      };
      const totalCount = counts[currentFilter] || 0;
      setTotalPages((prevTotalPages) => {
        const newTotalPages = Math.ceil(totalCount / 5);
        return prevTotalPages !== newTotalPages ? newTotalPages : prevTotalPages;
      });
    }
  }, [initiatives, currentFilter]);

  useEffect(() => {
    setCurrentPage(1);
    setCurrentCardPage1(1);
    setCurrentCardPage2(1);
    setCurrentCardPage3(1);
  }, [currentFilter]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleSortOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortSelect = (option) => {
    console.log("Sorting by:", option);
    handleSortClose();
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDisabledClick = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const calculateFilterCounts = () => {
    console.log("calculateFilterCounts", count);

    // Extract the counts from the first object in the data array
    const counts = count;

    const newCounts = {
      inbox: counts?.toDolIstCount || 0,
      watchlist: counts?.watchlistCount || 0,
      draft: counts?.draftCount || 0
    };

    return newCounts;
  };
  useEffect(() => {
    setRest(!reset);
  }, [isEditing]);

  const filterCounts = calculateFilterCounts(initiatives);

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const onSearch = (filters) => {
    console.log("Filters", filters);
    setFilters(filters);

    setCurrentPage(1); // Reset page to 1 for new search results
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // if (loading) {
  //   return <WhizLoading />;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleView = () => {
    setIsListView((prevView) => !prevView);
  };
  console.log("Initiative88888", ideaID);
  return (
    <Container>
      <div className="container-fluid">
        <div className="row align-items-end">
          <div className="col-12 col-sm-5"></div>
        </div>
      </div>
      <InitiativeTypeSelectionDrawer
        open={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        drawerOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        setIsAdd={setIsAdd}
        isAdd={isAdd}
        ideaID={ideaID}
        setIdeaID={setIdeaID}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />

      {!isAdd && isEditing ? (
        <>
          <EditPage
            initiativesID={ideaID ? ideaID : initiativesID}
            setIsEditing={setIsEditing}
            image={image}
            setRefresh12={setRefresh12}
            refresh12={refresh12}
            show={1}
          />
        </>
      ) : !isAdd ? (
        <>
          <div className="container-fluid pb-3" style={{ paddingLeft: 0 }}>
            <div className="row align-items-end">
              <div className="col-12 col-sm-7">
                <div id="intFilters" className="init_filters">
                  <ul className="list-unstyled init_filtersList d-flex pt-3 mb-0">
                    <li
                      id="ImFltr-Inbox"
                      data-bs-toggle="tooltip"
                      className={currentFilter === "Inbox" ? "active" : ""}
                      data-bs-original-title="Inbox"
                      onClick={() => {
                        setCurrentFilter("T");
                      }}
                    >
                      <a>
                        <span id="FltrCountInbox" className="fltrcount">
                          {filterCounts.inbox}
                        </span>
                        <span className="fltrtitle">Inbox</span>
                      </a>
                    </li>
                    <li
                      id="ImFltr-Watchlist"
                      data-bs-toggle="tooltip"
                      className={currentFilter === "Watchlist" ? "active" : ""}
                      data-bs-original-title="Watchlist"
                      onClick={() => {
                        setCurrentFilter("W");
                      }}
                    >
                      <a>
                        <span id="FltrCountWatchlist" className="fltrcount">
                          {filterCounts.watchlist}
                        </span>
                        <span className="fltrtitle">Watchlist</span>
                      </a>
                    </li>
                    <li
                      id="ImFltr-Draft"
                      data-bs-toggle="tooltip"
                      className={currentFilter === "Draft" ? "active" : ""}
                      data-bs-original-title="Draft"
                      onClick={() => {
                        setCurrentFilter("D");
                      }}
                    >
                      <a>
                        <span id="FltrCountDraft" className="fltrcount">
                          {filterCounts.draft}
                        </span>
                        <span className="fltrtitle">Draft</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-sm-5 d-flex justify-content-end">
                <div className="d-flex align-items-center">
                  {/* <div className="search-box position-relative me-3">
                    <input
                      id="InitMangntSrchInput"
                      className="search-text"
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <a id="initgrid-srch-title" className="search-btn" href="javascript:void(0);">
                      <img
                        src={SearchIcon1}
                        alt="Search"
                        data-bs-toggle="tooltip"
                        aria-label="Search"
                        data-bs-original-title="Search"
                      />
                    </a>
                  </div> */}

                  <div className="me-3" onClick={handleShowForm}>
                    <Tooltip title="Search">
                      <img
                        src={SearchIcon}
                        alt=""
                        data-bs-toggle="tooltip"
                        aria-label="Search List"
                        data-bs-original-title="Search List"
                      />
                    </Tooltip>
                  </div>
                  {/* Toggle between list and card view */}
                  <Tooltip title={!isListView ? "Switch to List view" : "Switch to Card view"}>
                    <IconButton onClick={toggleView}>
                      {isListView ? <ViewModule /> : <ViewList />}
                    </IconButton>
                  </Tooltip>
                  {/* <div className="d-flex align-items-center">
                    <Button
                      aria-controls="sort-menu"
                      aria-haspopup="true"
                      onClick={handleSortOpen}
                      variant="outlined"
                      className="me-3"
                    >
                      Sort
                    </Button>
                    <Menu
                      id="sort-menu"
                      anchorEl={sortAnchorEl}
                      keepMounted
                      open={Boolean(sortAnchorEl)}
                      onClose={handleSortClose}
                    >
                      <MenuItem onClick={() => handleSortSelect("A to Z")}>
                        <SortByAlpha /> A to Z (Initiative Name)
                      </MenuItem>
                      <MenuItem onClick={() => handleSortSelect("% Complete (ASC)")}>
                        <TrendingUp /> % Complete (ASC)
                      </MenuItem>
                      <MenuItem onClick={() => handleSortSelect("Stages Completed")}>
                        Stages Completed
                      </MenuItem>
                      <MenuItem onClick={() => handleSortSelect("Initiation Date (DSC)")}>
                        <CalendarToday /> Initiation Date (DSC)
                      </MenuItem>
                    </Menu>
                  </div> */}
                  <Tooltip title={!canAdd ? t("no_rights_add") : ""}>
                    <span>
                      <PrimaryButton
                        onClick={() => {
                          if (!canAdd) {
                            handleDisabledClick(t("no_rights_add"));
                          } else {
                            setDrawerOpen(true);
                          }
                        }}
                        text={t("Add")}
                        disabled={!canAdd}
                        styles={{
                          root: { backgroundColor: canAdd ? "#1976d2" : "#ccc", color: "#fff" }
                        }}
                      />
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div
            className="filter-detail d-flex align-items-center justify-content-end"
            style={{ marginTop: "1rem" }}
          >
            {/* <FontAwesomeIcon
              icon={faLightbulb}
              style={{
                color: currentFilter === "T" ? "green" : currentFilter === "W" ? "blue" : "orange",
                filter: `drop-shadow(0 0 10px ${
                  currentFilter === "T" ? "green" : currentFilter === "W" ? "blue" : "orange"
                })`,
                marginRight: "10px"
              }}
              size="lg"
            /> */}

            <div
              style={{
                color: currentFilter === "T" ? "green" : currentFilter === "W" ? "blue" : "orange"
              }}
            >
              {currentFilter === "T" && <div>Inbox Detail</div>}
              {currentFilter === "D" && <div>Draft Detail</div>}
              {currentFilter === "W" && <div>Watchlist Detail</div>}
            </div>
          </div>

          {showForm && (
            <SearchList
              onClose={handleCloseForm}
              searchFilters={searchFilters}
              onSearch={onSearch}
              rest={reset}
            />
          )}
          <InitiativeList
            initiatives={dashboardData}
            dashboardData1={dashboardData1}
            dashboardData2={dashboardData2}
            dashboardData3={dashboardData3}
            currentCardPage1={currentCardPage1}
            currentCardPage2={currentCardPage2}
            currentCardPage3={currentCardPage3}
            setCurrentCardPage1={setCurrentCardPage1}
            setCurrentCardPage2={setCurrentCardPage2}
            setCurrentCardPage3={setCurrentCardPage3}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            SetinitiativesID={SetinitiativesID}
            startEditing={startEditing}
            stopEditing={stopEditing}
            handleSearchChange={handleSearchChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isListView={isListView}
            canEdit={canEdit}
            handleDisabledClick={handleDisabledClick}
            totalPages={totalPages}
            setImage={setImage}
            image={image}
          />

          {/* {isListView && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
              />
            </Box>
          )} */}
        </>
      ) : null}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Notice"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{modalMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InitiativeManagement;
