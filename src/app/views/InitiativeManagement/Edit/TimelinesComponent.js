import React, { useState, useEffect } from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { DatePicker } from "@fluentui/react";
import TimelineHistoryDrawer from "./TimelineHistoryDrawer"; // Adjust path as needed
import { Drawer } from "@mui/material";
import { TextField } from "@fluentui/react";
import { ToastContainer, toast } from "react-toastify";
import { Table } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TimelinesComponent = ({
  initiativeTimeline,
  initiativesID,
  setRefresh1,
  refresh,
  show,
  acc
}) => {
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedStageIDs, setSelectedStageIDs] = useState([]);
  console.log("initiativesIDxxxx", initiativesID);
  // Watch for changes to initiativeTimeline and update timelineData when it arrives
  useEffect(() => {
    if (initiativeTimeline?.data?.listInitiativeTimeLineEntity) {
      setTimelineData(initiativeTimeline.data.listInitiativeTimeLineEntity);
    }
  }, [initiativeTimeline]);

  // Helper function to calculate Planned TAT based on Planned In Date and Planned Out Date
  const calculatePlannedTAT = (plannedInDate, plannedOutDate) => {
    if (!plannedInDate || !plannedOutDate) return 0;
    const timeDifference = plannedOutDate - plannedInDate;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  };

  // Helper function to update Planned Out Date based on Planned TAT
  const updatePlannedOutDate = (index, tatValue) => {
    const newTimelineData = [...timelineData];
    const inDate = new Date(newTimelineData[index].stagePlannedStartDate);

    // Ensure tatValue defaults to 0 if empty
    const effectiveTATValue = tatValue ? parseInt(tatValue, 10) : 0;

    // Calculate new Planned Out Date based on Planned In Date and TAT
    const outDate = new Date(inDate);
    outDate.setDate(inDate.getDate() + effectiveTATValue);

    // Update the current row's Planned TAT and Planned Out Date
    newTimelineData[index] = {
      ...newTimelineData[index],
      plannedDuration: effectiveTATValue,
      stagePlannedEndDate: outDate.toISOString().split("T")[0]
    };

    // Update subsequent rows based on the new Planned Out Date
    for (let i = index + 1; i < newTimelineData.length; i++) {
      const prevOutDate = new Date(newTimelineData[i - 1].stagePlannedEndDate);
      const plannedTAT = newTimelineData[i].plannedDuration || 0;

      const updatedOutDate = new Date(prevOutDate);
      updatedOutDate.setDate(prevOutDate.getDate() + plannedTAT);

      newTimelineData[i] = {
        ...newTimelineData[i],
        stagePlannedStartDate: prevOutDate.toISOString().split("T")[0],
        stagePlannedEndDate: updatedOutDate.toISOString().split("T")[0]
      };
    }

    setTimelineData(newTimelineData);
  };

  // Function to fetch historical data (simulated)
  const fetchHistoryData = async () => {
    setHistoryDrawerOpen(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeTimelineHistory?IdeaId=${initiativesID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      if (!response.ok) throw new Error("Failed to fetch history data");

      const data = await response.json();
      console.log("GetInitiativeTimelineHistory", data);
      setHistoryData(data.data.listTATHistory); // Set the fetched data as history data
    } catch (error) {
      console.error("Error fetching history data:", error);
      toast.error("Failed to fetch history data");
    }
  };

  // Function to handle saving and logging data as JSON
  const handleSave = async () => {
    if (!comment) {
      toast.error("Comment should not be left blank");
      return;
    }
    const stageIDs = timelineData
      .slice(1)
      .map((data) => data.initiativeStageID)
      .join(",");
    const plannedDurations = timelineData
      .slice(1)
      .map((data) => data.plannedDuration || 0)
      .join(","); // Collecting PlannedDuration for entries from the second onwards

    const payload = {
      IdeaId: 1,
      InitiativeStageIDs: stageIDs,
      PlannedStartDate: timelineData[1].stagePlannedStartDate,
      PlannedDuration: plannedDurations, // Sending comma-separated PlannedDurations
      Comments: comment,
      UserID: 3
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiveTimeline?IdeaId=${payload.IdeaId}&InitiativeStageIDs=${payload.InitiativeStageIDs}&PlannedStartDate=${payload.PlannedStartDate}&PlannedDuration=${payload.PlannedDuration}&Comments=${payload.Comments}&UserID=${payload.UserID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          },
          body: JSON.stringify(payload)
        }
      );
      const result = await response.json();
      // toast.success(result.data[0].result);
      toast.success("Comment saved successfully"); // Explicit success message
       // Clear the comment input field after saving
       setComment("");
      console.log("Save Response:", result.data[0].result);
      setCommentDrawerOpen(false); // Close the comment drawer after saving
    } catch (error) {
      console.error("Error saving timeline:", error);
    }
  };

  // Function to close history drawer
  const handleHistoryDrawerClose = () => {
    setHistoryDrawerOpen(false);
  };

  // Function to handle comment drawer close
  const handleCommentDrawerClose = () => {
    setCommentDrawerOpen(false);
  };

  return (
    <div className="tab-pane" id="Ini_Timelines">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6 text-start"></div>
          <div className="col-12 col-sm-6">
            <div id="TimelinestopActions" className="toprightactionsCol text-end pe-2">
              <PrimaryButton
                className="me-2"
                iconProps={{ iconName: "History" }}
                text="History"
                onClick={fetchHistoryData}
              >
                History
              </PrimaryButton>
              {acc[0]?.access !== 0 && (
                <PrimaryButton
                  className="me-2"
                  iconProps={{ iconName: "Save" }}
                  text="Save"
                  onClick={() => setCommentDrawerOpen(true)}
                >
                  Save
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="Project_Grid_panel_7" className="init_grid_panel m-3">
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0" id="Tbl_ini_Timelines">
            <thead className="table-light">
              <tr>
                <th>Nature of Initiatives</th>
                <th>Stage</th>
                <th>Resource/Approver</th>
                <th style={{ width: "14%" }}>Planned In Date</th>
                <th style={{ width: "14%" }}>Planned Out Date</th>
                <th style={{ width: "10%" }}>Planned TAT</th>
                <th>Actual In Date</th>
                <th>Actual Out Date</th>
                <th className="text-center">Actual TAT</th>
              </tr>
            </thead>
            <tbody className="tbodyROI">
              {timelineData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
                    There are no items to show in this view.
                  </td>
                </tr>
              ) : (
                timelineData.map((timeline, index) => (
                  <tr key={`timeline-${index}`} className="TRtimelines">
                    <td>{timeline.natureofDemand}</td>
                    <td>{timeline.requestStage}</td>
                    <td>{timeline.stakeHolderNames}</td>
                    <td>
                      {/* <DatePicker value={
                          timeline.stagePlannedStartDate
                            ? new Date(timeline.stagePlannedStartDate)
                            : null
                        }
                        ariaLabel="Select a date"
                        onSelectDate={(date) =>
                          updatePlannedOutDate(
                            index,
                            calculatePlannedTAT(new Date(timeline.stagePlannedStartDate), date)
                          )
                        }
                        disabled={true}
                      /> */}
                      <DatePicker value={
                      timeline.stagePlannedStartDate
                        ? new Date(timeline.stagePlannedStartDate)
                        : null
                    }
                    formatDate={(date) =>
                      date
                        ? date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""
                    }
                    ariaLabel="Select a date"
                    onSelectDate={(date) =>
                      updatePlannedOutDate(
                        index,
                        calculatePlannedTAT(new Date(timeline.stagePlannedStartDate), date)
                      )
                    }
                    disabled={true}
                  />
                    </td>
                    <td>
                      {/* <DatePicker value={
                          timeline.stagePlannedEndDate
                            ? new Date(timeline.stagePlannedEndDate)
                            : null
                        }
                        ariaLabel="Select a date"
                        onSelectDate={(date) =>
                          updatePlannedOutDate(
                            index,
                            calculatePlannedTAT(new Date(timeline.stagePlannedStartDate), date)
                          )
                        }
                        disabled={!!timeline.stageOutDate}
                      /> */}

                  <DatePicker value={
                      timeline.stagePlannedEndDate
                        ? new Date(timeline.stagePlannedEndDate)
                        : null
                    }
                    formatDate={(date) =>
                      date
                        ? date.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""
                    }
                    ariaLabel="Select a date"
                    onSelectDate={(date) =>
                      updatePlannedOutDate(
                        index,
                        calculatePlannedTAT(new Date(timeline.stagePlannedStartDate), date)
                      )
                    }
                    disabled={!!timeline.stageOutDate}
                  />
                    </td>
                    <td className="IMrequired d-flex">
                      <input className="form-control form-control-sm text-center required"
                        placeholder="00"
                        type="number"
                        value={timeline.plannedDuration || ""}
                        onChange={(e) => {
                          const tatValue = Math.max(0, e.target.value); // Ensure Planned TAT can't go below 0
                          updatePlannedOutDate(index, tatValue);
                        }}
                        disabled={!!timeline.stageOutDate}
                      />
                    </td>
                    <td>
                      {timeline.stageInDate
                        ? new Date(timeline.stageInDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })
                        : " "}
                    </td>
                    <td>
                      {timeline.stageOutDate
                        ? new Date(timeline.stageOutDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                          })
                        : " "}
                    </td>
                    <td className="text-center">{timeline.actualDuration || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* History Drawer */}

      <TimelineHistoryDrawer
        open={historyDrawerOpen}
        onClose={handleHistoryDrawerClose}
        historyData={historyData}
      />

      {/* Comment Drawer */}
      <Drawer anchor="right" open={commentDrawerOpen} onClose={handleCommentDrawerClose}>
        <div style={{ width: 400, padding: 20 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ backgroundColor: "#f5f5f5", padding: "8px" }}
          >
            <Typography variant="h6">Comment</Typography>
            <IconButton onClick={handleCommentDrawerClose}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>
          <div className="mt-3" style={{ textAlign: "right" }}>
            <PrimaryButton text="Save" onClick={handleSave} />
            {/* <DefaultButton text="Cancel" onClick={handleCommentDrawerClose} /> */}
          </div>
          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>
          <TextField
            label={
              <span>
                Comment <span style={{ color: "red" }}>*</span>
              </span>
            }
            multiline
            rows={4}
            value={comment}
            onChange={(e, newValue) => setComment(newValue)} // Fluent UI provides the new value as the second argument
            styles={{ root: { width: "100%" } }} // Full-width styling
          />
        </div>
      </Drawer>
    </div>
  );
};

export default TimelinesComponent;
