import React, { useState } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import Table from "react-bootstrap/Table";
import ROIDetailsDrawer from "./ROIDetailsDrawer";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip"; // Ensure Tooltip is imported
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";

// Added by Gauri to pass Initiative details to ROI on 07 Mar 2025
const ROIComponent = ({ initiativeROI, initiativesID, initiativeDetail, setRefresh1, refresh, show, acc }) => {
  console.log("ROI initiativeDetail", initiativeDetail);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  
  const handleDrawerOpen = (roi = null) => {
    setEditData(roi || { id: "", month: "", year: "", projectedROI: "" });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditData(null);
  };

  const handleSave = (updatedROI) => {
    console.log("Updated ROI Data: ", updatedROI);
    // Perform save operation here (e.g., update state or make API call)
  };

  const toggleSelectAll = () => {
    if (selectAllChecked) {
      setSelectedRows([]);
    } else {
      const allRows = initiativeROI?.data?.listInitiativeROIListEntity?.map(
        (_, index) => index + 1
      );
      setSelectedRows(allRows);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const toggleRowSelection = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  const handleDelete = (docId) => {
    // Get the access token from sessionStorage
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }

    // Get the user ID from sessionStorage
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userId = userdata?.employeeId;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    // Construct the API URL with the provided docId
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteInitiativeROI?ROIID=${planToDelete}&UserID=${userId}`;

    // Set up the request headers, including the authorization token
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    // Make the API call to delete the document
    fetch(apiUrl, {
      method: "DELETE", // Using DELETE method as it's for deletion
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the document");
        }
        return response.json();
      })
      .then((data) => {
        toast.success(`ROI deleted successfully!`);
        setShowDeleteModal(false);
        // Optionally, update the UI or data after the deletion (e.g., refresh the list)
        setRefresh1(!refresh);
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
        toast.error(`Error deleting document with ID ${docId}: ${error.message}`);
      });
  };
  return (
    <div className="tab-pane" id="Ini_ROI">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6 text-start"></div>
          <div className="col-12 col-sm-6">
            <div id="ROItopActions" className="toprightactionsCol text-end pe-2">
              {acc[0]?.access !== 0 && (
                <PrimaryButton
                  className="me-2"
                  // iconProps={{ iconName: "Add" }}
                  text="Add"
                  onClick={() => handleDrawerOpen()}
                >
                  Add
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="Project_Grid_panel_5" className="init_grid_panel m-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Projected ROI</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="tbodyROI">
            {initiativeROI?.data?.listInitiativeROIListEntity?.length > 0 ? (
              initiativeROI?.data?.listInitiativeROIListEntity?.map((roi, index) => (
                <tr key={`roi-${index}`} className="TR_ROI">
                  <td>
                    <a href="javascript:;">{roi.monthName}</a>
                  </td>
                  <td>{roi.roiYear}</td>
                  <td>{roi.projectedROI.toLocaleString()}</td>
                  <td className="text-center">
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() =>
                          handleDrawerOpen({
                            id: roi?.roiid,
                            month: roi?.monthName,
                            year: roi?.roiYear?.toString(),
                            projectedROI: roi?.projectedROI?.toLocaleString()
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {acc[1]?.access !== 0 && (
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setPlanToDelete(roi?.roiid);
                            setShowDeleteModal(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  There are no items to show in this view.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div className="clearfix"></div>
      <div id="IMROI_pagination" className="text-center Init_pagination"></div>
      <div className="clearfix"></div>
      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure, you want to delete this record?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
      {drawerOpen && (
        <ROIDetailsDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          initialData={editData}
          onSave={handleSave}
          initiativesID={initiativesID}
          // Added by Gauri to pass Initiative details to ROI Drawer on 07 Mar 2025
          initiativeDetail={initiativeDetail}
          setRefresh1={setRefresh1}
          refresh={refresh}
          acc={acc}
          initiativeROI={initiativeROI?.data?.listInitiativeROIListEntity || []}
        />
      )}
    </div>
  );
};

export default ROIComponent;
