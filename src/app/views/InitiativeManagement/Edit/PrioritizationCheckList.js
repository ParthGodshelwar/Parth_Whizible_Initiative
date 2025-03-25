import React, { useState, useEffect } from "react";
import {
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Divider,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import InitiativeDetails from "./InitiativeDetails";
import Tooltip from "@mui/material/Tooltip";

const PrioritizationCheckList = ({
  prioritizationCheckList,
  open,
  setOpen,
  setRefresh1,
  refresh
}) => {
  const [selectedCheckList, setSelectedCheckList] = useState(null); // Store selected checklist data
  {
    /* Added selectedCheckListResponseId and priorChecklistID by Gauri on 08 Feb 2025 */
  }

  const [selectedCheckListResponseId, setSelectedCheckListResponseId] = useState(null); // Store selected checklist data
  const [priorChecklistID, setPriorChecklistID] = useState(null); // Store selected checklist data
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const [checkListID1, setCheckListID1] = useState("");
  // Added stageID by Gauri on 18 Mar 2025
  const [stageID, setStageID] = useState(null);
  var checkListID;
  const employeeId = userdata?.employeeId;
  var ideaID1;
  // Function to close the drawer
  const handleClose = () => {
    setRefresh1(!refresh);
    setOpen(false);
  };

  // Function to handle selecting a checklist and making the API call
  const handleCheckListSelection = (checklistID, revisionID, ideaID, stageID) => {
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetCheckListResponse?checklistID=${checklistID}&RevisionID=${revisionID}&IdeaID=${ideaID}&UserID=${employeeId}&StageID=${stageID}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Pass the token in the header
        }
      })
      .then((response) => {
        const responseData = response?.data?.data;
        setSelectedCheckList(response?.data?.data); // Handle the response, store the result in state
        console.log("Checklist API response:", response?.data?.data);
        {
          /* Added checkListResponsesID to selectedCheckListResponseId by Gauri on 08 Feb 2025 */
        }
        // setSelectedCheckListResponseId(response?.data?.data?.listInitiativeChecklistResponsesEntity?.[0]?.checkListResponsesID)
        const checkListResponsesID =
          responseData?.listInitiativeChecklistResponsesEntity?.[0]?.checkListResponsesID || null;
        setSelectedCheckListResponseId(checkListResponsesID);
        console.log(
          "selectedCheckListResponseId selectedCheckListResponseId",
          selectedCheckListResponseId
        );

        // Added by Gauri to extract `stageID` from response on 18 Mar 2025
        const extractedStageID = responseData?.listInitiativeChecklistResponsesEntity?.[0]?.stageID || stageID;
        setStageID(extractedStageID); // Store stageID in state

        // Extract checklistID from the response if it exists
        const returnedChecklistID = responseData?.checklistID || checklistID; // Fallback to input ID
        console.log("Extracted Checklist ID:", returnedChecklistID);
        setPriorChecklistID(returnedChecklistID);
      })
      .catch((error) => {
        console.error("Error fetching checklist data:", error);
      });
  };
  console.log("priorChecklistID priorChecklistID", priorChecklistID);

  // Handle default selection of the first item when the component mounts or data is updated
  useEffect(() => {
    if (prioritizationCheckList?.data?.listInitiativePrioritizationChecklistEntity?.length > 0) {
      const firstItem = prioritizationCheckList.data.listInitiativePrioritizationChecklistEntity[0];
      ideaID1 = firstItem.ideaID;
      setCheckListID1(firstItem.checkListID);
      checkListID = firstItem.checkListID;
      handleCheckListSelection(
        firstItem.checkListID,
        firstItem.revisionID,
        firstItem.ideaID,
        firstItem.stageID
      );
    }
  }, [prioritizationCheckList, refresh]); // Only run when prioritizationCheckList changes

  // Fetch checkListID from prioritizationCheckList by Gauri on 08 Feb 2025
  // useEffect(() => {
  //   if (prioritizationCheckList?.data?.listInitiativePrioritizationChecklistEntity?.length > 0) {
  //     const checklistID = prioritizationCheckList?.data?.listInitiativePrioritizationChecklistEntity[0]?.checkListID;
  //     setPriorChecklistID(checklistID);
  //   }
  // }, [prioritizationCheckList, refresh]);

  // console.log("prioritizationCheckList?.data?.listInitiativeChecklistCategoryEntity", priorChecklistID)

  const renderPercentageBar = (value) => {
    const percentage = Math.max(0, Math.min(100, value));

    // Set the background color conditionally
    const barColor = percentage < 50 ? "#F55D30" : "#03BA28"; // Color changes if less than 50%

    return (
      <div
        style={{
          width: "100%",
          backgroundColor: "lightgrey",
          borderRadius: "4px",
          height: "12px", // Reduced height
          display: "flex",
          position: "relative"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor, // Use the conditional color
            height: "100%",
            borderRadius: "4px 0 0 4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            fontWeight: "bold",
            fontSize: "8px" // Adjusted font size to fit better in reduced height
          }}
        >
          {percentage}%
        </div>
        <div
          style={{
            width: `${100 - percentage}%`,
            backgroundColor: "grey",
            height: "100%",
            borderRadius: "0 4px 4px 0"
          }}
        />
      </div>
    );
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} sx={{ width: "90vw" }}>
      <div style={{ width: "90vw", padding: 20 }}>
        <div style={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <IconButton
            onClick={handleClose}
            style={{
              position: "absolute",
              top: 30,
              right: 30
            }}
          >
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>

          <div style={{ marginBottom: "16px", padding: "8px" }}>
            <Typography variant="h6" sx={{ color: "#333" }}>
              Prioritization CheckList
            </Typography>
          </div>
        </div>

        {/* Prioritization CheckList and Checklist Categories Section */}
        <Grid container spacing={2}>
          {/* Prioritization CheckList Table */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#333" }}>Prioritization CheckList</Typography>

            <TableContainer sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
              <Table aria-label="Prioritization Checklist Table">
                <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>Responded By</TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>
                      Priority Checklist
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>
                      Priority Rating
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>Stage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prioritizationCheckList?.data?.listInitiativePrioritizationChecklistEntity
                    ?.length > 0 ? (
                    prioritizationCheckList.data.listInitiativePrioritizationChecklistEntity.map(
                      (item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "transparent"
                          }}
                          onClick={() => {
                            setCheckListID1(item.checkListID);
                            checkListID = item.checkListID;
                            handleCheckListSelection(
                              item.checkListID,
                              item.revisionID,
                              item.ideaID,
                              item.stageID
                            );
                          }}
                        >
                          <TableCell sx={{ padding: "12px" }}>{item.respondedBY}</TableCell>
                          <TableCell
                            sx={{ padding: "12px", textDecoration: "underline", cursor: "pointer" }}
                          >
                            {item.checkListName}
                          </TableCell>
                          <TableCell sx={{ padding: "12px" }}>
                            {renderPercentageBar(item.weightage)}
                          </TableCell>
                          <TableCell sx={{ padding: "12px" }}>{item.stageName}</TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" sx={{ textAlign: "center", padding: "12px" }}>
                        No Prioritization Checklist Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Checklist Categories Table */}
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#333" }}>Checklist Categories</Typography>

            <TableContainer sx={{ border: "1px solid #ccc", borderRadius: "8px" }}>
              <Table aria-label="Checklist Categories Table">
                <TableHead sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold", padding: "12px" }}>
                      Category Rating
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prioritizationCheckList?.data?.listInitiativeChecklistCategoryEntity?.length >
                  0 ? (
                    prioritizationCheckList.data.listInitiativeChecklistCategoryEntity.map(
                      (item, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "transparent"
                          }}
                        >
                          <TableCell sx={{ padding: "12px" }}>{item.description}</TableCell>
                          <TableCell sx={{ padding: "12px" }}>
                            {renderPercentageBar(item.weightage)}
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan="2" sx={{ textAlign: "center", padding: "12px" }}>
                        No Checklist Categories Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
        {/* Added CheckListResponseId as UniqueID, checkListID and stageID as priorChecklistID by Gauri on 08 Feb 2025 */}
        <InitiativeDetails
          checkListID={checkListID}
          checkListID1={checkListID1}
          initiativeData1={selectedCheckList}
          ideaID1={ideaID1}
          UniqueID={selectedCheckListResponseId}
          priorChecklistID={priorChecklistID}
          setRefresh1={setRefresh1}
          refresh={refresh}
          stageID={stageID}
        />
      </div>
    </Drawer>
  );
};

export default PrioritizationCheckList;
