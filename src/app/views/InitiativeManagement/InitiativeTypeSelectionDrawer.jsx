import React, { useState, useEffect } from "react";
import { Drawer, IconButton, Tooltip, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Text } from "@fluentui/react";
import { Table } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ControlDrawer from "./ControlDrawer";

const InitiativeTypeSelectionDrawer = ({
  open,
  onClose,
  setIsAdd,
  isAdd,
  ideaID,
  setIdeaID,
  setIsEditing,
  setDrawerOpen,
  drawerOpen,
  isEditing
}) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedNOIID, setSelectedNOIID] = useState(null);
  const [selectedNOIID1, setSelectedNOIID1] = useState(null);
  const [controlDrawerOpen, setControlDrawerOpen] = useState(false);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [selectedInitiative, setSelectedInitiative] = useState(null);
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAddNew/GetNOIList?UserID=${employeeId}&PageNo=${page}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const result = await response.json();
      setData(result?.data?.listGetNOI);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setCurrentPage(1); // Reset to first page when drawer opens
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      fetchData(currentPage);
    }
  }, [open, currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // const handleCellClick = (natureofDemandID, row) => {
  //   onClose();
  //   setSelectedNOIID1(row);
  //   setSelectedNOIID(natureofDemandID);
  //   setControlDrawerOpen(true);
  //   setIsAdd(!isAdd);
  // };

  const handleCellClick = (natureofDemandID, natureofDemandName, row) => {
    onClose();
    setSelectedNOIID1(row);
    setSelectedNOIID(natureofDemandID);
    setSelectedInitiative(natureofDemandName); // Store name
    setControlDrawerOpen(true);
    setIsAdd(!isAdd);
  };
  const columns = [
    {
      dataField: "natureofDemand",
      text: "Nature of Initiative",
      sort: true
    }
  ];

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            style={{
              backgroundColor: "#f0f0f0",
              padding: "8px",
              borderRadius: "4px",
              marginBottom: "20px"
            }}
          >
            <Typography variant="h6" style={{ color: "#333" }}>
              Initiative Type Selection
            </Typography>

            <Tooltip title="Close">
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table striped hover condensed>
              <thead>
                <tr>
                  {columns.map((column, index) => (
                    <th key={index}>{column.text}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      // <td
                      //   key={colIndex}
                      //   onClick={() => handleCellClick(row.natureofDemandID, row.revisionID)}
                      //   style={{ cursor: "pointer" }}
                      // >
                      //   {row[column.dataField]}
                      // </td>
                      <td
                        key={colIndex}
                        onClick={() =>
                          handleCellClick(row.natureofDemandID, row.natureofDemand, row.revisionID)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {row[column.dataField]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2
            }}
          >
            <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
              <ArrowBackIcon />
            </IconButton>
            <Text> Page {currentPage}</Text>
            <IconButton onClick={handleNextPage} disabled={data.length < 5}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>

      {controlDrawerOpen && (
        // <ControlDrawer
        //   open={controlDrawerOpen}
        //   onClose={() => setControlDrawerOpen(false)}
        //   NOIID={selectedNOIID}
        //   selectedNOIID1={selectedNOIID1}
        //   ideaID={ideaID}
        //   setIsAdd={setIsAdd}
        //   isAdd={isAdd}
        //   setIdeaID={setIdeaID}
        //   setIsEditing={setIsEditing}
        //   isEditing={isEditing}
        //   initialData={selectedInitiative}
        //   data={{
        //     natureOfDemand: selectedInitiative?.natureOfDemand,
        //   }}
        // />
        <ControlDrawer
          open={controlDrawerOpen}
          setDrawerOpen={setDrawerOpen}
          drawerOpen={drawerOpen}
          onClose={() => setControlDrawerOpen(false)}
          onClose1={onClose}
          NOIID={selectedNOIID}
          selectedNOIID1={selectedNOIID1}
          ideaID={ideaID}
          setIsAdd={setIsAdd}
          isAdd={isAdd}
          setIdeaID={setIdeaID}
          setIsEditing={setIsEditing}
          isEditing={isEditing}
          natureOfInitiativeName={selectedInitiative} // Pass the name
        />
      )}
    </>
  );
};

export default InitiativeTypeSelectionDrawer;
