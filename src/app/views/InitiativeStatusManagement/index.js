import React, { useEffect, useState } from "react";
import { PrimaryButton, IconButton, Checkbox, Stack, Label, Dropdown, Text } from "@fluentui/react";
import {
  // Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { Tooltip } from "@mui/material";
import commentcolor from "../../../assets/img/comment-color.svg";
import SearchIcon from "../../../assets/img/serachlist-icn.svg";
import SearchAdvanceForm from "./SearchAdvanceForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdsClickOutlinedIcon from '@mui/icons-material/AdsClickOutlined';
import { toast } from "react-toastify";
// import GetIniStatusManagement from '../../hooks/InitiativeStatusManagement/GetIniStatusManagement';
import CommentDrawer from "./CommentDrawer";
import { Table } from "react-bootstrap";
import "../../style_custom.css";

const classNames = mergeStyleSets({
  tableContainer: {
    width: "100%",
    overflowX: "hidden"
  },
  table: {
    minWidth: 650,
    width: "100%"
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid grey"
  },
  drawerContent: {
    padding: "20px"
  },
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    marginTop: "20px"
  },
  saveButtonRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px"
  },
  stripedRow: {
    backgroundColor: "#f9f9f9"
  }
});

const InitiativeStatusManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null); // Store the current row's data
  const [comment, setComment] = useState(""); // Input for comment
  const [numberOfDays, setNumberOfDays] = useState(""); // Input for number of days
  const [showForm, setShowForm] = useState(false);
  const [iniStatusData, setIniStatusData] = useState([]);
  // const [apiData, setApiData] = useState([]);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [actionOptions, setActionOptions] = useState([]);
  const [selectedActionID, setSelectedActionID] = useState("1");
  const [activeActionID, setActiveActionID] = useState("1"); // ActionID for API calls

  // const [searchFilters, setSearchFilters] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    ActionID: "",
    demandCode: "",
    title: "",
    natureofDemandID: "",
    businessGroupId: "",
    organizationUnitId: ""
  });


  // const [iniId, setIniID] = useState("1"); 
  // const [listViewData, setListViewData] = useState([]);

  const pageNo = 1;
  // const { iniStatus } = GetIniStatusManagement(searchFilters, pageNo);

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // replace with your actual initiativesID
      // Fetch Nature of Initiative options
      const actionResponse = await fetch(
        // `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=statusmgtaction&EmpID=${employeeId}`,
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=statusmgtaction`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!actionResponse.ok) {
        throw new Error("Failed to fetch Nature of Initiative options");
      }

      const actionData = await actionResponse.json();
      setActionOptions(
        actionData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  // const handleDropdownChange = (event, option) => {
  //   setSelectedActionID(option.key); // Update the selected ActionID without fetching
  //   setPage(1); // Reset to the first page when ActionID changes
  //   fetchIniStatusList(1, { ActionID: option.key });
  // };

  const handleDropdownChange = (event, option) => {
    setSelectedActionID(option.key); // Update dropdown value
  };

  useEffect(() => {
    fetchIniStatusList(page, { ActionID: activeActionID });
  }, [page, activeActionID]); // Only trigger when these change

  // const handleShowClick = () => {
  //   fetchIniStatusList(1, { ActionID: selectedActionID }); // Pass the selected ActionID
  // };

  const handleShowClick = () => {
    setActiveActionID(selectedActionID); // Update ActionID used for API
    setPage(1); // Reset to the first page
  };

  // Fetch Initiative Status Management list based on page number and search filters
  const fetchIniStatusList = async (pageNumber, filters) => {
    try {
      if (isLoading) return; // Prevent duplicate fetch calls
      setIsLoading(true);

      console.log("searchFilters status", filters);
      const queryParams = new URLSearchParams({
        ActionID: filters.ActionID || selectedActionID, 
        PageNo: pageNumber,
        // ActionID: filters?.ActionID || "1",
        demandCode: filters?.demandCode || "",
        title: filters?.title || "",
        NOI: filters?.natureofDemandID || "",
        BusinessUnitID: filters?.businessGroupId || "",
        OrganizationUnitID: filters?.organizationUnitId || "",
      }).toString();

      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeStatusManagement/GetInitiativesListForStatusManagement?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setIniStatusData(data.data.listInitiativeStatusManagement);
      console.log("API Response Data:", data);
      console.log("listInitiativeStatusManagement:", data.data?.listInitiativeStatusManagement);
    } catch (error) {
      console.error("Failed to fetch Initiative Status Management list:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => {
      const newPage = Math.max(prevPage - 1, 1);
      fetchIniStatusList(newPage, { ...searchFilters, ActionID: activeActionID }); // Merge ActionID into searchFilters
      return newPage;
    });
  };
  
  const handleNextPage = () => {
    setPage((prevPage) => {
      const newPage = prevPage + 1;
      fetchIniStatusList(newPage, { ...searchFilters, ActionID: activeActionID }); // Merge ActionID into searchFilters
      return newPage;
    });
  };


  // Effect to fetch data on page change or search filter change
  useEffect(() => {
    fetchIniStatusList(page, searchFilters); // Fetch the data
  }, [page, searchFilters, refresh]); // Trigger when page or search filters change


  // Function to handle search
  const handleSearch = async (formValues) => {
    const accessToken = sessionStorage.getItem("access_token");
    console.log("formValuessearchFilters", searchFilters);

    // Constructing the query parameters
    const params = [
      // formValues.ActionID && `ActionID=${formValues.ActionID}`,
      formValues.demandCode && `demandCode=${formValues.demandCode}`,
      formValues.title && `title=${formValues.title}`,
      formValues.natureofDemandID && `NOI=${formValues.natureofDemandID}`,
      formValues.businessGroupId && `BusinessUnitID=${formValues.businessGroupId}`,
      formValues.organizationUnitId && `OrganizationUnitID=${formValues.organizationUnitId}`,
    ].filter(Boolean); // Filter out any undefined values

    // Join parameters to create the query string
    const queryString =
      params.length > 0 ? `?${params.join("&")}&PageNo=${page}` : `?PageNo=${page}`;
    console.log("queryString", searchFilters);
  };

  const handleOpenDrawer = (row) => {
    setCurrentRow(row); // Save the current row data
    setDrawerOpen(true); // Open the drawer
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setComment("");
    setNumberOfDays("");
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px"
    }
  };

  return (
    <div className="initiative-status-management container mt-3">
      <div className="row align-items-center justify-content-end">
        <div className="col-auto d-flex align-items-center">
          {/* <span className="text-danger mr-2">* Mandatory</span> */}
          <div className="me-3" onClick={handleShowForm}>
            <Tooltip title="Search">
              <img src={SearchIcon} alt="" />
            </Tooltip>
          </div>
          {/* <PrimaryButton text="Save" onClick={() => setShowConfirmModal(true)} className="ml-2" /> */}
        </div>
      </div>
      {showForm && (
        <SearchAdvanceForm
          onClose={handleCloseForm}
          searchFilters={searchFilters}
          onSearch={(searchType, formValues) => {
            console.log("Search triggered", searchType, formValues);
            // handleSearch(searchType); // Call the search handler
            setSearchFilters(searchType); // Save the search filters if needed
          }}
        />
      )}

      {/* Top Section Start here */}
      <Stack horizontal tokens={{ childrenGap: 20 }} wrap style={{ marginBottom: 10 }}>
        <Stack.Item grow styles={stackItemStyle}>
          <Label className="">Action</Label>
          <Dropdown
            placeholder="Select Action"
            options={actionOptions}
            onChange={handleDropdownChange}
            selectedKey={selectedActionID}
            styles={{ dropdown: { width: "100%" } }}
          />
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyle}>
          <Label className="">&nbsp;</Label>
          <PrimaryButton id="filtershowbtn" text="Show"
            onClick={handleShowClick} />
        </Stack.Item>
        <Stack.Item grow style={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
          <Text variant="small">(Initiatives which do not have status selected in the 'Action' combobox are displayed.)</Text>
        </Stack.Item>
      </Stack>
      {/* Top Section End here */}

      {/* Initiative Status Management List view start here */}
      {/* <TableContainer component={Paper} className={classNames.tableContainer}> */}
      <Table className={classNames.table} aria-label="simple table">
        <thead>
          <tr>
            <th className="text-center">Initiative Code</th>
            <th className="text-center">Initiative Title</th>
            <th className="text-center">Start Date</th>
            <th className="text-center">End Date</th>
            <th className="text-center">Status/Stage Name</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {iniStatusData.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", color: "#666" }}>
                There are no items to show in this view.
              </td>
            </tr>
            ) : (
            iniStatusData.map((row, index) => (
              <tr
                key={`status-${index}`}
                // key={row.demandCode}
                selected={selectedRows.includes(row.id)}
                className={index % 2 === 0 ? classNames.stripedRow : ""}
                onClick={() => console.log(row.id)}
              >
                <td align="center">{row.demandCode}</td>
                <td align="center">{row.title}</td>
                <td align="center">{row.expectedStartDate}</td>
                <td align="center">{row.expectedEndDate}</td>
                <td align="center">{row.status ? row.status : '-'}</td>
                <td align="center">
                  <IconButton onClick={() => handleOpenDrawer(row)}>
                    <Tooltip title="Action">
                      <AdsClickOutlinedIcon />
                    </Tooltip>
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {/* </TableContainer> */}

      {drawerOpen && (
        <CommentDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          statusData={iniStatusData}
          initiativesID={currentRow?.ideaID} // Pass the selected ideaId to CommentDrawer
          actionID={activeActionID}
          fetchIniStatusList={(pageNumber, filters) => fetchIniStatusList(pageNumber, filters)} // Pass the function
          page={page} // Pass current page
        />

      )}
      {/* Initiative Status Management List view end here */}

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={page === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={iniStatusData.length < 5} // Disable if less than 5 entries
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

    </div>
  );
};

export default InitiativeStatusManagement;
