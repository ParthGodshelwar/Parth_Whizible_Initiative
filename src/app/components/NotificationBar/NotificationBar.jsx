import { Fragment, useState, useEffect } from "react";
import {
  Box,
  Badge,
  IconButton,
  ThemeProvider,
  Drawer,
  Button,
  Typography,
  Select,
  MenuItem,
  Paper,
  Tooltip
} from "@mui/material";
import { Table } from "react-bootstrap";
import { Clear, Notifications } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Left Arrow
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Right Arrow
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import useSettings from "app/hooks/useSettings";
import notification from "../../hooks/notification/notification"; // Import the notification API call
import alertDurations from "../../hooks/notification/alertDurations"; // Import the alert durations API call
import "./Notification.css";
// Added By Madhuri.K On 21-Jan-2025 for Top section close icon and for Dropdown
import CloseIcon from "@mui/icons-material/Close";
import { Dropdown } from "@fluentui/react"; // Import Fluent UI Dropdown
import moment from "moment";

export default function NotificationBar() {
  
  const { settings } = useSettings();
  const [panelOpen, setPanelOpen] = useState(false);
  // const [duration, setDuration] = useState("6. Older"); // Default to "6. Older"
  // commented By Madhuri.K on 30-Jan-2025 for defalut Today's Alerts should be display 
  const [duration, setDuration] = useState("2. Today"); // Default to "6. Today"
  const [page, setPage] = useState(1);
  const [apiNotifications, setApiNotifications] = useState([]); // Initialize with an empty array
  const [alertOptions, setAlertOptions] = useState([]); // Initialize as an empty array
  const itemsPerPage = 5; // Number of items per page

  // Fetch notifications
  const { notification: fetchedNotifications, loading, error } = notification("", duration, page);
  

  // Fetch alert durations
  const { alert, loading: alertLoading } = alertDurations();

  // Fetch notifications whenever duration or page changes, including initial load
  // useEffect(() => {
  //   if (!loading && fetchedNotifications?.listInitiativeAlertsEntity) {
  //     setApiNotifications(fetchedNotifications.listInitiativeAlertsEntity);
  //   }
  // }, [fetchedNotifications, loading, duration, page]);
  useEffect(() => {
    if (!loading && fetchedNotifications?.listInitiativeAlertsEntity) {
      setApiNotifications(fetchedNotifications.listInitiativeAlertsEntity);
    }
  }, [fetchedNotifications, loading, duration, page]);  // Added 'page' dependency
// Commented By Madhuri.K On 21-Jan-2025

  // Fetch alert options on load
  // useEffect(() => {
  //   if (!alertLoading && alert?.listAlterDurationEntity) {
  //     setAlertOptions(alert.listAlterDurationEntity); 
  //   }
  // }, [alert, alertLoading]);

      {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment start here */}
    useEffect(() => {
      if (!alertLoading && alert?.listAlterDurationEntity) {
        setAlertOptions(
          alert.listAlterDurationEntity.map((opt) => ({
            key: opt.id,
            text: opt.value,
          }))
        );
      }
    }, [alert, alertLoading]);
      {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment end here */}

  // const handleDrawerToggle = () => setPanelOpen(!panelOpen);
  // const handleDurationChange = (event) => {
  //   setDuration(event.target.value); 
  //   setPage(1); 
  // };
      {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment start here */}

// const handleDrawerToggle = () => setPanelOpen(!panelOpen);
// const handleDurationChange = (event, option) => {
//   setDuration(option.key);
//   setPage(1);
// };
const handleDurationChange = (event, option) => {
  setDuration(option.key);
  setPage(1);
};

const handleDrawerToggle = () => {
  setPanelOpen(!panelOpen);

  if (panelOpen) { // When closing the drawer
    setDuration("2. Today");  // Reset duration to "Today"
    setPage(1); // Reset pagination
  }
};

      {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment end here */}

  // Handle previous and next page navigation added by Madhuri.K on 30-Jan-2025
  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
  // Ensure apiNotifications is an array and apply .slice() safely
  // const paginatedNotifications = Array.isArray(apiNotifications)
  //   ? apiNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  //   : [];
  const paginatedNotifications = Array.isArray(fetchedNotifications?.listInitiativeAlertsEntity)
  ? fetchedNotifications.listInitiativeAlertsEntity
  : [];
 
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString, "MMM DD YYYY hh:mmA").format("DD/MM/YYYY");
  };
  
  
  return (
    <Fragment>
      <IconButton onClick={handleDrawerToggle}>
        {/* code Added BY Madhuri.K On 24-Feb-2025 for Noti.Count */}
        <Badge color="secondary" badgeContent={apiNotifications.length || 0}>
          <NotificationsNoneIcon sx={{ color: "text.primary" }} />
        </Badge>
      </IconButton>

      <ThemeProvider theme={settings.themes[settings.activeTheme]}>
        <Drawer
          anchor="right"
          open={panelOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: { width: "60vw" } // Set drawer width to 60vw
          }}
        >

          {/* Added By Madhuri.K On 21-Jan-2025 for Changed Top header section  */}
            <Box p={3} width="100%">
             <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
              backgroundColor: "#e7edf0",
              padding: "0 10px"
            }}
          >
            <h6 className="mb-0">Alert</h6>
            <IconButton onClick={handleDrawerToggle}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
             </Box>
          <Box padding={3}>
            <div className=" d-flex justify-content-between" >
            <Box mb={3} display="flex" alignItems="center">
              <NotificationsNoneIcon color="action" sx={{ color: "#fd7e14", mr: 1 }} />
             {/* Added By Madhuri.K for Chnaging text format  start here*/}
              <h6 className="mb-0">Alerts</h6>
               {/* Added By Madhuri.K for Chnaging text format end here*/}
            </Box>
            <Box mb={3}  className=" d-flex justify-content-center" >
              <Typography variant="body1" className="pe-2 mt-1">Duration</Typography>
              {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment start here */}
             <Dropdown
                placeholder="Select your Duration"
                selectedKey={duration}
                options={alertOptions}
                onChange={handleDurationChange}
                styles={{ dropdown: { width: 200 } }}
                />
                      {/* Added By Madhuri.K For chnaging select section into FluentUI Dropdown comment end here */}
            </Box>
            </div>

            {/* Notification Table */}
            <Box className="mt-2">
              {/* <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}> */}
                {/* <Table sx={{ minWidth: 650 }} aria-label="alert table"> */}
                {/* Table styling changed materialUI into react-bootstrap by Madhuri.K On 21-Jan-2025 */}
                <Table striped bordered hover>  
                <thead>
                   <tr>
                      <th>Initiative Title</th>
                      <th>Flag To</th>
                      <th>Created Date</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>

                  <tbody>
                      {paginatedNotifications.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", color: "#666" }}>
                            There are no items to show in this view.
                          </td>
                        </tr>
                      ) : (
                        paginatedNotifications.map((notification) => (
                          <tr
                            key={notification.uniqueID}
                            style={{
                              backgroundColor:
                                notification.dueDateState === "L" ? "#f0f0f0" : "transparent",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                notification.dueDateState === "L" ? "#f0f0f0" : "transparent")
                            }
                          >
                            <td>
                              <a href={`Initiative_Information.aspx?id=${notification.initiativeID}`}>
                                {notification.title}
                              </a>
                            </td>
                            <td>{notification.contextType}</td>
                            {/* <td>{notification.dueDate}</td>
                            <td>{notification.dueDate}</td> */}
                            <td>{formatDate(notification.dueDate)}</td>
                            <td>{formatDate(notification.dueDate)}</td>


                          </tr>
                        ))
                      )}

                  </tbody>
                </Table>
              {/* </TableContainer> */}
            </Box>

            {/* Pagination with only left and right arrows */}
        {/* changed pagination logic By Madhuri.K on 30-Jan-2025 */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        <IconButton onClick={handlePreviousPage} disabled={page === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ margin: "0 10px", alignSelf: "center" }}>Page {page}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={fetchedNotifications?.listInitiativeAlertsEntity?.length < itemsPerPage} // Check API response length
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
            {/* <Box textAlign="right" className="modal-footer">
              <Button variant="outlined" color="primary" onClick={handleDrawerToggle}>
                Close
              </Button>
            </Box> */}
          </Box>
           </Box>
        </Drawer>
      </ThemeProvider>
    </Fragment>
  );
}

