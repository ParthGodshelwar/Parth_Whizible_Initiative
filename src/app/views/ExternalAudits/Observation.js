import React, { useState, useEffect } from "react";
import { Button, Form, Table, Row, Col } from "react-bootstrap";
import { Box, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { PrimaryButton, TextField } from "@fluentui/react";
import { toast } from "react-toastify";
import axios from "axios";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";

const Observation = ({ id, onSuccess, setRefresh1, refresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [observations, setObservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    observation: "",
    comment: ""
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [observation, setobservation] = useState(null);
  const [observationId, setObservationId] = useState(null); // Store ID when editing

  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const accessToken = sessionStorage.getItem("access_token");

  const fetchObservations = async (page) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditObservationList?AuditID=${id}&PageNo=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      const data = await response.json();
      console.log("API Response Data:", data);
  
      if (data.data && data.data.listExternalAuditObservationEntity) {
        const observationsWithIds = data.data.listExternalAuditObservationEntity.map((obs) => ({
          ...obs,
          ObservationID: obs.observationID, //  Use correct key from API response
          comment: obs.comment || "",  //  Ensure null is replaced with an empty string
        }));
        console.log("Mapped Observations:", observationsWithIds);
        setObservations(observationsWithIds);
      }
    } catch (error) {
      console.error(" Error fetching observations:", error);
    }
  };
  
  useEffect(() => {
    fetchObservations(currentPage);
  }, [currentPage, id]);

  useEffect(() => {
    fetchObservations(currentPage);
  }, [currentPage, id]);
  const confirmDelete = (obsId) => {
    console.log("🔹 Confirm delete for Observation ID:", obsId);
  
    if (!obsId) {
      toast.error("Observation ID is missing!");
      return;
    }
  
    setObservationId(obsId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = async () => {
    console.log("🔹 Delete Function Called. ObservationID:", observationId);
  
    if (!observationId) {
      toast.error("Observation ID is missing!");
      return;
    }
  
    try {
      const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/DeleteExternalAuditObservation?ObservationID=${observationId}&UserID=${employeeId}`;
      
      console.log("🔹 Calling DELETE API:", apiUrl);
  
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const responseData = await response.json();
      console.log("🔹 API Response:", responseData);
  
      // ✅ Fix: Properly check for success response
      if (!responseData.data || !Array.isArray(responseData.data) || responseData.data[0].result.toLowerCase() !== "success") {
        throw new Error(responseData.message || "Failed to delete observation.");
      }
  
      // ✅ Show success message
      toast.success("Observation deleted successfully!");
  
      // ✅ Close the delete modal
      setShowDeleteModal(false);
  
      // ✅ Reset selected observation ID
      setObservationId(null);
  
      // ✅ Refresh observations list
      fetchObservations(1);
      
    } catch (error) {
      console.error("❌ Error deleting observation:", error);
      toast.error("Error deleting observation.");
    }
  };

  const handleAdd = () => {
    setEditMode(false); // Ensure add mode
    setShowForm(true);
    setFormData({ observation: "", comment: "" });
  };

  const handleEdit = (obs) => {
    console.log("Editing Observation:", obs); // Debugging
    if (!obs.observationID) {
      console.error(" ObservationID is missing in this observation:", obs);
    }
  
    setEditMode(true);
    setShowForm(true);
    setObservationId(obs.observationID); //  Use correct key
    setFormData({ observation: obs.observation, comment: obs.comment });
  };
  

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ observation: "", comment: "" });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   console.log("Before Submit - ObservationID:", observationId); // Debugging
  
  //   if (editMode && !observationId) {
  //     toast.error("ObservationID is missing for update.");
  //     return;
  //   }
  //   if (!id) {
  //     toast.error("AuditID is missing.");
  //     return;
  //   }
  
  //   if (!employeeId) {
  //     toast.error("UserID is missing.");
  //     return;
  //   }
  
  //   // if (editMode && !observationId) {
  //   //   toast.error("ObservationID is missing for update.");
  //   //   return;
  //   // }
  
  //   // ✅ Check if Observation already exists before making API call
  //   const observationExists = observations.some(
  //     (item) => item.observation.trim().toLowerCase() === formData.observation.trim().toLowerCase()
  //   );
  
  //   if (!editMode && observationExists) {
  //     toast.error("Observation already exists.");
  //     return; // ✅ Prevent API call
  //   }
  //   const comment = formData.comment?.trim() || ""; // ✅ Replace null with ""
  //   // ✅ Build API URL with query parameters
  //   const baseUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/`;
  //   const apiUrl = editMode
  //   ? `${baseUrl}UpdExternalAuditObservationDetail?AuditID=${id}&ObservationID=${observationId}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(formData.comment)}&UserId=${employeeId}`
  //   : `${baseUrl}PostExternalAuditObservationDetail?AuditID=${id}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(formData.comment)}&UserId=${employeeId}`;
  
  //   const method = editMode ? "POST" : "POST";
  
  //   console.log("🔹 API Request URL:", apiUrl);
  
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: method,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log("Fetched Observations:", observations);

  //     const responseData = await response.json();
  //     console.log("🔹 API Response:", responseData);
  
  //     // ✅ Check if the API returned "Success"
  //     const isSuccess =
  //       response.ok &&
  //       responseData?.data &&
  //       Array.isArray(responseData.data) &&
  //       responseData.data.length > 0 &&
  //       responseData.data[0].result.toLowerCase() === "success";
  
  //     if (!isSuccess) {
  //       throw new Error(responseData?.message || "Failed to update observation.");
  //     }
  
  //     // ✅ Show correct toast message
  //     toast.success(editMode ? "Observation updated successfully!" : "Observation saved successfully!");
  
  //     // ✅ Refresh the UI after save
  //     setShowForm(false);
  //     setObservationId(null);
  //     fetchObservations(1); // ✅ Ensure updated data is loaded
  
  //   } catch (error) {
  //     console.error("Error saving observation:", error);
  //     toast.error(error.message || "An error occurred while saving.");
  //   }
  // };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!id) {
  //     toast.error("AuditID is missing.");
  //     return;
  //   }
  
  //   if (!employeeId) {
  //     toast.error("UserID is missing.");
  //     return;
  //   }
  
  //   // ✅ Trim input values
  //   const newObservation = formData.observation.trim().toLowerCase();
  //   const comment = formData.comment?.trim() || ""; // Ensure no null value
  
  //   // ✅ Check if Observation already exists before making API call
  //   const observationExists = observations.some(
  //     (item) => item.observation.trim().toLowerCase() === newObservation
  //   );
  
  //   if (!editMode && observationExists) {
  //     toast.error("Observation already exists.");
  //     return; // ✅ Prevent API call
  //   }
  
  //   // ✅ Build API URL with query parameters
  //   const baseUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/`;
  //   const apiUrl = editMode
  //     ? `${baseUrl}UpdExternalAuditObservationDetail?AuditID=${id}&ObservationID=${observationId}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`
  //     : `${baseUrl}PostExternalAuditObservationDetail?AuditID=${id}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`;
  
  //   console.log("🔹 API Request URL:", apiUrl);
  
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     const responseData = await response.json();
  //     console.log("🔹 API Response:", responseData);
  
  //     // ✅ Check if the API returned "Success"
  //     const isSuccess =
  //       response.ok &&
  //       responseData?.data &&
  //       Array.isArray(responseData.data) &&
  //       responseData.data.length > 0 &&
  //       responseData.data[0].result.toLowerCase() === "success";
  
  //     if (!isSuccess) {
  //       throw new Error(responseData?.message || "Failed to update observation.");
  //     }
  
  //     // ✅ Show correct toast message
  //     toast.success(editMode ? "Observation updated successfully!" : "Observation saved successfully!");
  
  //     // ✅ Refresh the UI after save
  //     setShowForm(false);
  //     setObservationId(null);
  //     fetchObservations(1); // ✅ Ensure updated data is loaded
  
  //   } catch (error) {
  //     console.error("❌ Error saving observation:", error);
  //     toast.error(error.message || "An error occurred while saving.");
  //   }
  // };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   console.log("Before Submit - ObservationID:", observationId); // Debugging
  
  //   if (editMode && !observationId) {
  //     toast.error("ObservationID is missing for update.");
  //     return;
  //   }
  //   if (!id) {
  //     toast.error("AuditID is missing.");
  //     return;
  //   }
  //   if (!employeeId) {
  //     toast.error("UserID is missing.");
  //     return;
  //   }
  
  //   // ✅ First, check if the observations array is empty
  //   if (!editMode && observations.length > 0) {
  //     const observationExists = observations.some(
  //       (item) => item.observation.trim().toLowerCase() === formData.observation.trim().toLowerCase()
  //     );
  
  //     if (observationExists) {
  //       toast.error("Observation already exists.");
  //       return; // ✅ Prevent API call
  //     }
  //   }
  
  //   const comment = formData.comment?.trim() || ""; // ✅ Replace null with ""
    
  //   // ✅ Build API URL with query parameters
  //   const baseUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/`;
  //   const apiUrl = editMode
  //     ? `${baseUrl}UpdExternalAuditObservationDetail?AuditID=${id}&ObservationID=${observationId}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`
  //     : `${baseUrl}PostExternalAuditObservationDetail?AuditID=${id}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`;
  
  //   console.log("🔹 API Request URL:", apiUrl);
  
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     console.log("Fetched Observations:", observations);
  
  //     const responseData = await response.json();
  //     console.log("🔹 API Response:", responseData);
  
  //     // ✅ Check if the API returned "Success"
  //     const isSuccess =
  //       response.ok &&
  //       responseData?.data &&
  //       Array.isArray(responseData.data) &&
  //       responseData.data.length > 0 &&
  //       responseData.data[0].result.toLowerCase() === "success";
  
  //     if (!isSuccess) {
  //       throw new Error(responseData?.message || "Failed to update observation.");
  //     }
  
  //     // ✅ Show correct toast message
  //     toast.success(editMode ? "Observation updated successfully!" : "Observation saved successfully!");
  
  //     // ✅ Refresh the UI after save
  //     setShowForm(false);
  //     setObservationId(null);
  //     fetchObservations(1); // ✅ Ensure updated data is loaded
  
  //   } catch (error) {
  //     console.error("Error saving observation:", error);
  //     toast.error(error.message || "An error occurred while saving.");
  //   }
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Before Submit - ObservationID:", observationId); // Debugging
  
    if (!id) {
      toast.error("AuditID is missing.");
      return;
    }
  
    if (!employeeId) {
      toast.error("UserID is missing.");
      return;
    }
  
    // ✅ Trim input values
    const newObservation = formData.observation.trim().toLowerCase();
    const comment = formData.comment?.trim() || ""; // Ensure no null value
  
    // ✅ Check for duplicates only in the table, NOT in the API
    const observationExists = observations.some(
      (item) =>
        item.observation.trim().toLowerCase() === newObservation &&
        item.ObservationID !== observationId // ✅ Allow editing same row
    );
  
    if (observationExists) {
      toast.error("Observation already exists .");
      return; // ✅ Stop execution, prevent API call
    }
  
    // ✅ Build API URL with query parameters
    const baseUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/`;
    const apiUrl = editMode
      ? `${baseUrl}UpdExternalAuditObservationDetail?AuditID=${id}&ObservationID=${observationId}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`
      : `${baseUrl}PostExternalAuditObservationDetail?AuditID=${id}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`;
  
    console.log("🔹 API Request URL:", apiUrl);
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      const responseData = await response.json();
      console.log("🔹 API Response:", responseData);
  
      // ✅ Directly check for success without checking for duplicates in the API
      const isSuccess =
        response.ok &&
        responseData?.data &&
        Array.isArray(responseData.data) &&
        responseData.data.length > 0 &&
        responseData.data[0].result.toLowerCase() === "success";
  
      if (!isSuccess) {
        throw new Error(responseData?.message || "Failed to update observation.");
      }
  
      // ✅ Show success message
      toast.success(editMode ? "Observation updated successfully!" : "Observation saved successfully!");
  
      // ✅ Refresh the UI after save
      setShowForm(false);
      setObservationId(null);
      fetchObservations(1); // ✅ Ensure updated data is loaded
  
    } catch (error) {
      console.error("❌ Error saving observation:", error);
      toast.error(error.message || "An error occurred while saving.");
    }
  };
  
  
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   console.log("Before Submit - ObservationID:", observationId); // Debugging
  
  //   if (!id) {
  //     toast.error("AuditID is missing.");
  //     return;
  //   }
  
  //   if (!employeeId) {
  //     toast.error("UserID is missing.");
  //     return;
  //   }
  
  //   // ✅ Trim input values
  //   const newObservation = formData.observation.trim().toLowerCase();
  //   const comment = formData.comment?.trim() || ""; // Ensure no null value
  
  //   // ✅ Check if Observation already exists in the table before making API call
  //   const observationExists = observations.some(
  //     (item) => item.observation.trim().toLowerCase() === newObservation
  //   );
  
  //   if (!editMode && observationExists) {
  //     toast.error("Observation already exists in the table.");
  //     return; // ✅ Prevent API call
  //   }
  
  //   // ✅ Build API URL with query parameters
  //   const baseUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/`;
  //   const apiUrl = editMode
  //     ? `${baseUrl}UpdExternalAuditObservationDetail?AuditID=${id}&ObservationID=${observationId}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`
  //     : `${baseUrl}PostExternalAuditObservationDetail?AuditID=${id}&Observation=${encodeURIComponent(formData.observation)}&Comment=${encodeURIComponent(comment)}&UserId=${employeeId}`;
  
  //   console.log("🔹 API Request URL:", apiUrl);
  
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     const responseData = await response.json();
  //     console.log("🔹 API Response:", responseData);
  
  //     // ✅ Check if the API returned a duplicate observation error
  //     if (
  //       responseData?.data &&
  //       Array.isArray(responseData.data) &&
  //       responseData.data.length > 0 &&
  //       responseData.data[0].result.includes("already exists")
  //     ) {
  //       toast.error("Observation already exists in the system.");
  //       return; // ✅ Stop execution, don't show success toast
  //     }
  
  //     // ✅ Check if the API returned "Success"
  //     const isSuccess =
  //       response.ok &&
  //       responseData?.data &&
  //       Array.isArray(responseData.data) &&
  //       responseData.data.length > 0 &&
  //       responseData.data[0].result.toLowerCase() === "success";
  
  //     if (!isSuccess) {
  //       throw new Error(responseData?.message || "Failed to update observation.");
  //     }
  
  //     // ✅ Show correct toast message
  //     toast.success(editMode ? "Observation updated successfully!" : "Observation saved successfully!");
  
  //     // ✅ Refresh the UI after save
  //     setShowForm(false);
  //     setObservationId(null);
  //     fetchObservations(1); // ✅ Ensure updated data is loaded
  
  //   } catch (error) {
  //     console.error("❌ Error saving observation:", error);
  //     toast.error(error.message || "An error occurred while saving.");
  //   }
  // };  
  console.log("Debugging - AuditID:", id);
  console.log("Debugging - UserID:", employeeId);
  console.log("Debugging - Observation:", formData.observation);
  console.log("Debugging - Comment:", formData.comment);

  return (
    <>
      <div className="observation">
        <Row className="mb-3">
          <Col className="text-end">
            {!showForm && (
              <PrimaryButton variant="primary" onClick={handleAdd}>
                Add
              </PrimaryButton>
            )}
          </Col>
        </Row>

        {showForm && (
          <Form onSubmit={handleSubmit} className="mb-4">
            <Row className="mb-3">
              <Col className="text-end">
                <PrimaryButton variant="primary" className="me-2" type="submit">
                  Save
                </PrimaryButton>
                <PrimaryButton variant="primary" onClick={handleCancel}>
                  Cancel
                </PrimaryButton>
              </Col>
            </Row>
            <div className="col-sm-12 text-end required">
              <label className="IM_label ">
                (<font color="red">*</font> Mandatory)
              </label>
            </div>
            <Row>
              <Col md={6}>
                <Form.Group controlId="observation">
                  <Form.Label className="required">Observation</Form.Label>
                  <TextField
                    value={formData.observation}
                    onChange={(e, newValue) => handleInputChange("observation", newValue)}
                    placeholder="Enter observation"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="comment">
                  <Form.Label>Comment</Form.Label>
                  <TextField
                    value={formData.comment}
                    onChange={(e, newValue) => handleInputChange("comment", newValue)}
                    placeholder="Enter comment"
                    multiline
                    rows={3}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}

        {!showForm && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Observation</th>
                  <th>Comment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {observations.length > 0 ? (
                  observations.map((obs, index) => (
                    <tr key={obs.id || index}>
                      <td>{obs.observation}</td>
                      {/* <td>{obs.comment}</td> */}
                      <td>{obs.comment || ""}</td>
                      <td>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEdit(obs)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => confirmDelete(obs.ObservationID)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>


                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      There are no items to show in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
              <IconButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography sx={{ margin: "0 10px", marginTop: "10px" }}>Page {currentPage}</Typography>
              <IconButton
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={observations.length < 5} // Disable if fewer than 5 entries
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>

          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure you want to delete this item?",
        }}
      >
        <DialogFooter>
          {/* ✅ Ensure 'Yes' button correctly calls handleDelete */}
          <PrimaryButton onClick={handleDelete} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>

    </>
  );
};

export default Observation;

