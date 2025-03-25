import React from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

const TimelineHistoryDrawer = ({ open, onClose, historyData }) => {
  console.log("historyData", historyData);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: "70%",
          maxWidth: "100%"
        }
      }}
    >
      <div className="offcanvas-body">
        <div id="initSnooze" className="inithistDetails">
          {/* Title Section */}
          <div className="graybg container-fluid py-2 mb-2" style={{ backgroundColor: "#f0f0f0" }}>
            <div className="row">
              <div className="col-sm-10">
                <h5 className="offcanvasTitle">Timeline History</h5>
              </div>
              <div className="col-sm-2 text-end">
                <IconButton onClick={onClose}>
                  <Tooltip title="Close">
                    <CloseIcon />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
          </div>

          <div className="historyHeight px-3">
            <div className="table-responsive offTable_wrapper mt-2">
              <table
                className="table table-striped table-bordered table-hover"
                aria-label="Timeline History Table"
              >
                <thead>
                  <tr>
                    <th className="text-center">Comments</th>
                    <th>Stage</th>
                    <th>Planned Start Date</th>
                    <th>Planned End Date</th>
                    <th>Planned Duration</th>
                    <th>Modified By</th>
                    <th>Modified Date</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData && historyData.length > 0 ? (
                    historyData.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{item?.comments}</td>
                        <td>{item?.requestStage}</td>
                        <td>
                          {item?.stagePlannedStartDate
                            ? new Date(item.stagePlannedStartDate).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                        <td>
                          {item?.stagePlannedEndDate
                            ? new Date(item.stagePlannedEndDate).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                        <td>{item?.plannedDuration}</td>
                        <td>{item?.modifiedBy}</td>
                        <td>
                          {item?.modifiedDate
                            ? new Date(item.modifiedDate).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        There are no items to show in this view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="clearfix"></div>
          <div id="IMhistory_pagination" className="text-center Init_pagination"></div>
          <div className="clearfix"></div>
        </div>
      </div>
    </Drawer>
  );
};

export default TimelineHistoryDrawer;
