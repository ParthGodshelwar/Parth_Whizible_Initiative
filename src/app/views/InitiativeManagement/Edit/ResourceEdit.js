import React, { useState, useEffect } from "react";
import { Drawer, Tabs, Tab, Box, Typography } from "@mui/material";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField, Dropdown, DatePicker } from "@fluentui/react";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { postResource } from "../../../hooks/Editpage/Resource";
import { toast } from "react-toastify";
import axios from "axios";
import { Close as CloseIcon } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Modal } from "react-bootstrap";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Pivot, PivotItem } from "@fluentui/react";
const formatDate = (date) => {
  if (!date) return ""; // Handle null or undefined dates

  if (typeof date === "string") {
    const datePart = date.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  }

  if (date instanceof Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return "";
};

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
};

const ResourceEdit = ({ initiativeResource, initiativesID, setRefresh1, refresh, show, acc }) => {
  const [roleOptions1, setRoleOptions1] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  console.log("acc", acc);
  const [resources, setResources] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [warningToDelete, setWarningToDelete] = useState(null);
  const [newResource, setNewResource] = useState({
    roleDescription: "",
    skill: "",
    tentativeStartDate: null,
    tentativeEndDate: null,
    resourceEffort: ""
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setEditIndex(null);
  };

  useEffect(() => {
    if (initiativeResource) {
      setResources(initiativeResource.data.listInitiativeResourceListEntity || []);
      setLoading(false); // Set loading to false when data is received
    }
  }, [initiativeResource]);

  const handleSaveResource = () => {
    handleSave(newResource);
  };
  const handleSave = async () => {
    console.log("handleSave");
    const startDate = parseDate(formatDate(newResource.tentativeStartDate));
    const endDate = parseDate(formatDate(newResource.tentativeEndDate));

    // List of missing fields
    const missingFields = [];

    if (!newResource.roleDescription) missingFields.push("Role ");
    if (!newResource.skill) missingFields.push("Skill");
    if (!newResource.tentativeStartDate) missingFields.push("Resource-In Date");
    if (!newResource.tentativeEndDate) missingFields.push("Resource-Out Date");
    if (!newResource.resourceEffort) missingFields.push("FTE");

    // Show only the first missing field in the toast
    if (missingFields.length > 0) {
      toast.error(`${missingFields[0]} should not be left blank`);
      return; // Exit the function
    }

    // Check if startDate is after endDate
    if (startDate > endDate) {
      toast.error("Resource In Date should be less than or Equal To Resource Out Date");
      return; // Exit the function
    }

    // Added by Gauri to check if FTE value is greater than 0 on 06 Feb 2025
    if (!(newResource.resourceEffort > 0)) {
      toast.error("FTE should be greater than 0.");
      return; // Exit the function
    }

    const updatedResources = [...resources];
    const resourceData = {
      roleDescription: newResource.roleDescription,
      skill: newResource.skill,
      tentativeStartDate: parseDate(formatDate(newResource.tentativeStartDate)),
      tentativeEndDate: parseDate(formatDate(newResource.tentativeEndDate)),
      resourceEffort: newResource.resourceEffort
    };
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userID = userdata?.employeeId;

    try {
      if (editIndex !== null) {
        const resourceToUpdate = resources[editIndex];
        const resourceDemandID = resourceToUpdate?.resourceDemandID;
        console.log("ResourceDemandID", resourceDemandID);
        const queryParams = new URLSearchParams({
          ResourceDemandID: data?.resourceDemandID,
          IdeaId: initiativesID,
          RoleID: resourceData.roleDescription,
          ToolID: resourceData.skill,
          TentativeStartDate: resourceData.tentativeStartDate,
          TentativeEndDate: resourceData.tentativeEndDate,
          ResourceEffort: resourceData.resourceEffort,
          UserID: userID
        }).toString();

        const response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeResource?${queryParams}`,
          {}, // PUT requests often require a body; leave this empty if not needed
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        const result = response?.data?.data?.[0]?.result;
        console.log("success", response);
        if (result && result.toLowerCase() === "success") {
          toast.success("Resource details updated successfully!");
        } else {
          // Show the result message returned from the API if it exists
          toast.error(result || "An unexpected error occurred.");
        }

        updatedResources[editIndex] = resourceData; // Update local state
        handleDrawerClose();
      } else {
        updatedResources.push(resourceData);
        const response = await postResource(
          initiativesID,
          resourceData.roleDescription,
          resourceData.skill,
          resourceData.tentativeStartDate,
          resourceData.tentativeEndDate,
          resourceData.resourceEffort,
          userID,
          setRefresh1,
          refresh
        );
        console.log("response", response.data?.[0]?.result);
        const result = response?.data?.[0]?.result;
        if (result && result.toLowerCase() === "success") {
          toast.success("Resource details saved successfully!");
          handleDrawerClose();
        } else {
          // Show the result message returned from the API
          toast.error(response?.data?.[0]?.result);
        }
      }
      setRefresh1(!refresh);
      setResources(updatedResources);
      // setNewResource({
      //   roleDescription: "",
      //   skill: "",
      //   tentativeStartDate: null,
      //   tentativeEndDate: null,
      //   resourceEffort: ""
      // });
      
      // Commented by Gauri to fixed issue "Alert is coming then offcanvas window getting closed" on 06 Feb 2025
      // handleDrawerClose();
    } catch (error) {
      console.error("Failed to save resource:", error);
    }
  };

  const handleChange = (field, value) => {
    setNewResource({
      ...newResource,
      [field]: value
    });
  };

  const handleEdit = async (index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeResourceDetails?ResourceID=${index}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch resource details.");
      }

      const resourceDetails = await response.json();
      const data1 = resourceDetails.data.listInitiativeResources[0];
      console.log("Fetched Resource Details: ", data);

      setData(data1);

      // Confirm the new resource values after state update
      console.log("Updated newResource: ", data); // This might still log the previous value due to React batching
      setEditIndex(index);
      handleDrawerOpen();
    } catch (error) {
      console.error("Error fetching resource details:", error);
    }
  };
  useEffect(() => {
    console.log("Updated newResource: ", newResource);
  }, [newResource]);

  const handleDelete = async (resource) => {
    setWarningToDelete(resource); // Set the warning to delete
    setShowDeleteModal(true);

    console.log("plan", resource);
  };
  const deleteWarning = async (resource) => {
    console.log("Deleting resource:", resource);

    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    if (!accessToken || !employeeId) {
      toast.error("Invalid session. Please log in again.");
      return;
    }

    try {
      // Construct the API URL with resourceDemandID and employeeId
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeResourceDelete?ResourceID=${resource.resourceDemandID}&UserID=${employeeId}`;

      // Make the DELETE request
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status === 200) {
        console.log("Delete response:", response.data);
        setRefresh1(!refresh);
        toast.success(" Resource details deleted successfully!");
        setShowDeleteModal(false);
      } else {
        throw new Error("Failed to delete resource");
      }
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete Resource details. Please try again.");
    }
  };

  useEffect(() => {
    const fetchRoleOptions = async () => {
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=role`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch role options");
        }

        const jsonData = await response.json();
        const options = jsonData.data.listInitiativeDetailDropDownEntity.map((role) => ({
          key: role.id,
          text: role.name
        }));

        setRoleOptions1(options);
      } catch (error) {
        console.error("Error fetching role options:", error);
      }
    };

    const fetchSkillOptions = async () => {
      const userdata = JSON.parse(sessionStorage.getItem("user"));
      const employeeId = userdata?.employeeId;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=skill`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch skill options");
        }

        const jsonData = await response.json();
        const options = jsonData.data.listInitiativeDetailDropDownEntity.map((skill) => ({
          key: skill.id,
          text: skill.name
        }));

        setSkillOptions(options);
      } catch (error) {
        console.error("Error fetching skill options:", error);
      }
    };

    fetchRoleOptions();
    fetchSkillOptions();
  }, [initiativesID]);
  useEffect(() => {
    setNewResource({
      roleDescription: String(data.roleID || ""),
      skill: String(data.toolID || ""),
      tentativeStartDate: new Date(data.tentativeStartDate) || null,
      tentativeEndDate: new Date(data.tentativeEndDate) || null,
      resourceEffort: data.resourceEffort || ""
    });
  }, [data]);

  console.log("resourceEffort", newResource, roleOptions1);
  console.log("Updated newResource11: ", data);
  return (
    <div>
      <div className="d-flex justify-content-end mb-2">
        {acc[0]?.access !== 0 && (
          <PrimaryButton
            className="me-2"
            text="Add"
            onClick={() => {
              handleDrawerOpen();
              setNewResource({
                roleDescription: "",
                skill: "",
                tentativeStartDate: null,
                tentativeEndDate: null,
                resourceEffort: ""
              });
            }}
          />
        )}
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div className="drawer-content p-4" style={{ width: "70vw" }}>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor: "#f0f0f0", // light grey for the header
                padding: "8px",
                borderRadius: "4px",
                marginBottom: "20px"
              }}
            >
              <Typography variant="h6" style={{ color: "#333" }}>
                Resources
              </Typography>
              <IconButton onClick={handleDrawerClose}>
                <Tooltip title="Close">
                  <CloseIcon style={{ color: "#333" }} />
                </Tooltip>
              </IconButton>
            </Box>

            <div>
              <Tabs
                value={selectedTab}
                aria-label="Cost Details Tabs"
                variant="scrollable"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Details" sx={{ textTransform: "none" }} />
              </Tabs>
              {/* Tab Content */}
              {selectedTab === 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {acc[2]?.access !== 0 && (
                    <div className="col-sm-12 text-end form-group">
                      <div className="detailsubtabsbtn pb-1">
                        <PrimaryButton text="Save" onClick={handleSaveResource} />
                      </div>
                      <label className="form-label IM_label">
                        (<span style={{ color: "red" }}>*</span> Mandatory)
                      </label>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "16px", width: "100%" }}>
                    <Dropdown
                      label="Role"
                      placeholder="Select a Role"
                      options={[
                        { key: "", text: "Select a Role", disabled: true },
                        ...roleOptions1
                      ]}
                      required
                      selectedKey={String(newResource.roleDescription)}
                      onChange={(e, option) => handleChange("roleDescription", option.key)}
                      styles={{ root: { flex: "0 0 250px" } }} // Smaller size for fields
                    />
                    <Dropdown
                      label="Skill"
                      placeholder="Select a Skill"
                      options={[
                        { key: "", text: "Select a Skill", disabled: true },
                        ...skillOptions
                      ]}
                      required
                      selectedKey={newResource.skill}
                      onChange={(e, option) => handleChange("skill", option.key)}
                      styles={{ root: { flex: "0 0 250px" } }} // Smaller size for fields
                    />
                    <div style={{ flex: "0 0 250px" }}>
                      <label className="form-label">
                        Resource-In Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        placeholder="Select Date"
                        value={
                          newResource.tentativeStartDate
                            ? new Date(newResource.tentativeStartDate)
                            : null
                        } // Ensure it's a Date object
                        onSelectDate={(date) => {
                          if (date) {
                            // Adjust for time zone offset
                            const adjustedDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            handleChange("tentativeStartDate", adjustedDate);
                          } else {
                            handleChange("tentativeStartDate", null); // Handle null case if no date is selected
                          }
                        }}
                        styles={{ root: { width: "100%" } }} // Ensures the field takes up full width
                        required={true}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px", width: "100%" }}>
                    <div style={{ flex: "0 0 250px" }}>
                      <label className="form-label">
                        Resource-Out Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <DatePicker
                        placeholder="Select Date"
                        value={
                          newResource.tentativeEndDate
                            ? new Date(newResource.tentativeEndDate)
                            : null
                        } // Ensure it's a Date object
                        onSelectDate={(date) => {
                          if (date) {
                            // Adjust for time zone offset
                            const adjustedDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            handleChange("tentativeEndDate", adjustedDate);
                          } else {
                            handleChange("tentativeEndDate", null); // Handle null case if no date is selected
                          }
                        }}
                        styles={{ root: { width: "100%" } }} // Ensures the field takes up full width
                        required={true}
                      />
                    </div>

                    <TextField
                      label="FTE"
                      type="number"
                      required
                      value={newResource.resourceEffort}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value >= 0 || e.target.value === "") {
                          handleChange("resourceEffort", e.target.value);
                        }
                      }}
                      styles={{ root: { flex: "0 0 250px" } }} // Smaller size for fields
                    />
                  </div>
                </div>
              )}
            </div>
          </Box>
        </div>
      </Drawer>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Role</th>
            <th>Skills</th>
            <th>Resource-In Date</th>
            <th>Resource-Out Date</th>
            <th>FTE</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                There are no items to show in this view
              </td>
            </tr>
          ) : (
            resources.map((resource, index) => (
              <tr key={index}>
                <td>{resource.roleDescription}</td>
                <td>{resource.skill}</td>
                <td>{formatDate(resource.tentativeStartDate)}</td>
                <td>{formatDate(resource.tentativeEndDate)}</td>
                <td>{resource.resourceEffort}</td>
                <td>
                  <IconButton onClick={() => handleEdit(resource.resourceDemandID)}>
                    <Tooltip title="Edit">
                      <EditIcon />
                    </Tooltip>
                  </IconButton>
                  {acc[1]?.access !== 0 && (
                    <IconButton onClick={() => handleDelete(resource)}>
                      <Tooltip title="Delete">
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)} // Pass as a function
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure, you want to delete this record?</DialogContent>
        <DialogActions>
          <PrimaryButton text="Yes" onClick={() => deleteWarning(warningToDelete)} />
          <PrimaryButton text="No" onClick={() => setShowDeleteModal(false)} />
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResourceEdit;
