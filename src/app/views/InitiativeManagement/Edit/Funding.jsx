import React, { useState, useEffect } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Table } from "react-bootstrap";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import FundingDetailsDrawer from "./FundingDetailsDrawer";
import useAddFunding from "../../../hooks/Editpage/useAddFunding";
import ApprovalAuthority from "../../../hooks/useFundingApprovalAuthority";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog"; // Import Fluent UI Dialog
import { Stack } from "@fluentui/react/lib/Stack";
import { Tooltip } from "@mui/material";
import axios from "axios";

const FundingTab = ({ fundData, initiativesID, setRefresh1, refresh, show, acc }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [roleOptions1, setRoleOptions1] = useState([]); // Cost Category options
  const [skillOptions, setSkillOptions] = useState([]); // Funding Authority options
  const [source, setSource] = useState([]); // Funding Source options
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // State to control delete dialog visibility
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null); // State to store the item being deleted
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  // const { addFunding, loading, error } = useAddFunding();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch Funding Approval Authority options
        const fundingApprovalAuthorityResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=fundingapprovalauthority&EmpID=${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!fundingApprovalAuthorityResponse.ok) {
          throw new Error("Failed to fetch Funding Approval Authority options");
        }

        const fundingApprovalAuthorityData = await fundingApprovalAuthorityResponse.json();
        setSkillOptions(
          fundingApprovalAuthorityData.data.listInitiativeDetailDropDownEntity.map((item) => ({
            key: item.id,
            text: item.name
          }))
        );

        // Fetch Funding Source options
        const fundingSourceResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=fundingsource&EmpID=${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!fundingSourceResponse.ok) {
          throw new Error("Failed to fetch Funding Source options");
        }

        const fundingSourceData = await fundingSourceResponse.json();
        setSource(
          fundingSourceData.data.listInitiativeDetailDropDownEntity.map((item) => ({
            key: item.id,
            text: item.name
          }))
        );

        // Fetch Cost Category options
        const costCategoryResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=costcategory&EmpID=${employeeId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!costCategoryResponse.ok) {
          throw new Error("Failed to fetch Cost Category options");
        }

        const costCategoryData = await costCategoryResponse.json();
        setRoleOptions1(
          costCategoryData.data.listInitiativeDetailDropDownEntity.map((item) => ({
            key: item.id,
            text: item.name
          }))
        );
      } catch (error) {
        toast.error(`Error fetching options: ${error.message}`);
      }
    };

    fetchOptions();
  }, [initiativesID, employeeId]);

  const handleDrawerOpen = (data) => {
    setEditData(data);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setEditData(null);
    setDrawerOpen(false);
  };

  const handleSave = async (fundingDetails) => {
    const {
      FundingDetailID,
      IdeaId = initiativesID,
      CostCategoryID,
      FundingApprrovalAutorityID,
      FundingSourceID,
      costCategory,
      FundingReference,
      ApprovedAmount
    } = fundingDetails;
    console.log("CostCategoryID", fundingDetails);
    if (!fundingDetails.costCategory) {
      toast.error("Cost Category should not be left blank");

      return;
    }
    if (!fundingDetails.approvedAmount) {
      toast.error("Approved Amount should not be left blank");

      return;
    }
    const endpoint = FundingDetailID
      ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeFund`
      : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeFund`;

    try {
      const response = await axios({
        method: FundingDetailID ? "put" : "post",
        url: endpoint,
        params: {
          FundingDetailID: FundingDetailID || 0, // Default to 0 if not present
          IdeaId,
          CostCategoryID: costCategory,
          FundingApprovalAuthorityID: fundingDetails.approvalAuthority || 0,
          FundingSourceID: fundingDetails.fundingSource || 0,
          FundingReference: fundingDetails.fundingReference,
          ApprovedAmount: fundingDetails.approvedAmount,
          UserID: employeeId // Assuming UserID is the employee ID
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          Accept: "*/*"
        }
      });

      if (response.status === 200) {
        toast.success(
          FundingDetailID
            ? "Funding details updated successfully!"
            : "Funding details saved successfully!"
        );
        setRefresh1(!refresh);
      } else {
        throw new Error(`Failed to ${FundingDetailID ? "update" : "add"} funding details`);
      }
    } catch (error) {
      console.error(
        `Error while ${FundingDetailID ? "updating" : "adding"} funding details:`,
        error
      );
      toast.error(
        `An error occurred while ${FundingDetailID ? "updating" : "adding"} funding details.`
      );
    }
  };

  const fundings = fundData?.data?.listInitiativeFundListEntity || [];

  const handleCheckboxChange = (id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelectedItems = [];

    if (selectedIndex === -1) {
      newSelectedItems = [...selectedItems, id];
    } else {
      newSelectedItems = selectedItems.filter((item) => item !== id);
    }

    setSelectedItems(newSelectedItems);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allIds = fundings.map((funding, index) => index);
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteConfirmation = (docId) => {
    console.log("selectedItemToDelete", docId);
    setSelectedItemToDelete(docId?.fundingDetailID);
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const handleDelete = () => {
    const docId = selectedItemToDelete;
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }

    const userId = userdata?.employeeId;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/DeleteInitiativeFund?FundingID=${selectedItemToDelete}&UserID=${userId}`;

    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
    };

    fetch(apiUrl, {
      method: "DELETE",
      headers: headers
    })
      .then(async (response) => {
        if (!response.ok) {
          // If the response is not okay, throw an error
          const errorData = await response.json();
          throw new Error(errorData?.message || "Failed to delete the document");
        }
        return response.json(); // Parse the response JSON
      })
      .then((data) => {
        const result = data?.data?.[0]?.result;
        if (result && result.toLowerCase() === "success") {
          toast.success("Funding deleted successfully!");
          setRefresh1(!refresh); // Trigger refresh for the parent component
        } else {
          // Handle custom API error messages
          toast.error(result || "An unexpected error occurred during deletion.");
        }
      })
      .catch((error) => {
        // Handle fetch errors
        console.error("Error deleting:", error);
        toast.error(error.message || "Error deleting the document.");
      })
      .finally(() => {
        setDeleteDialogOpen(false); // Close the confirmation dialog
        setSelectedItemToDelete(null); // Reset the selected item
      });
  };

  return (
    <div className="container-fluid mt-3">
      <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="space-between">
        <div></div>
        {acc[0]?.access !== 0 && (
          <div>
            <PrimaryButton
              text="Add"
              onClick={() => {
                setEditMode(true);
                handleDrawerOpen({});
              }}
              style={{ marginLeft: 8 }}
            />
          </div>
        )}
      </Stack>
      <div className="table_wrapper stageGridPanel mt-2">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="thOuter col-sm-4">
                <span className="ms-2">Cost Category</span>
              </th>
              <th className="ms-2">Funding source</th>
              <th className="ms-2">Approved amount</th>
              <th className="ms-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {fundings.length > 0 ? (
              fundings.map((funding, index) => (
                <tr key={index} className="TRfunding">
                  <td className="tdOuter">
                    <div className="igph_title position-relative">
                      <a href="javascript:;">{funding.costCategory}</a>
                    </div>
                  </td>
                  <td className="tdOuter">
                    <div className="init_title position-relative">
                      {funding.fundingSource || "N/A"}
                    </div>
                  </td>
                  <td className="tdOuter">
                    <div className="igph_title position-relative">{funding.approvedAmount}</div>
                  </td>
                  <td className="">
                    <IconButton
                      onClick={() => {
                        setEditMode(true);
                        handleDrawerOpen({
                          FundingDetailID: funding.fundingDetailID,
                          costCategory: funding.costCategory,
                          fundingSource: funding.fundingSource,
                          fundingReference: funding.fundingReference,
                          approvedAmount: funding.approvedAmount
                        });
                      }}
                    >
                      <Tooltip title="Edit">
                        <EditIcon />
                      </Tooltip>
                    </IconButton>
                    {acc[1]?.access !== 0 && (
                      <IconButton onClick={() => handleDeleteConfirmation(funding)}>
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  There are no items to show in this view.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setDeleteDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Deletion",
          subText: "Are you sure, you want to delete this record?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete} text="Yes" />
          <PrimaryButton onClick={() => setDeleteDialogOpen(false)} text="No" />
        </DialogFooter>
      </Dialog>

      {drawerOpen && (
        <FundingDetailsDrawer
          open={drawerOpen}
          initialData={editData}
          onClose={handleDrawerClose}
          onSave={handleSave}
          source={source} // Pass the fetched data for funding source
          skillOptions={skillOptions} // Pass the fetched data for skill options
          roleOptions1={roleOptions1}
          fundings={fundings} 
          acc={acc}
        />
      )}
    </div>
  );
};

export default FundingTab;
