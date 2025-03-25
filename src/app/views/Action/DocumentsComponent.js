import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Divider,
  FormControl,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import AccessTimeIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import { styled } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { Table } from "react-bootstrap"; // Assuming you're using React-Bootstrap
import { toast } from "react-toastify";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { Stack } from "@fluentui/react";

const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#666",
  borderRadius: "4px",
  marginBottom: "20px"
});

const DocumentsComponent = ({
  initiativeDocument,
  actionItemID,
  setRefreshDoc,
  refreshDoc,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUrlDrawerOpen, setIsUrlDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [urlDescription, setUrlDescription] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [documentCategories, setDocumentCategories] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docIdToDelete, setDocIdToDelete] = useState(null);
  const [documentHistoryData, setDocumentHistoryData] = useState(null);
  console.log("DocumentsComponent111", refreshDoc);

  useEffect(() => {
    console.log("Updated initiativeDocument:", initiativeDocument);
  }, [initiativeDocument]);

  
  const toggleDrawer = () => {
    // Added by Gauri to reset fields when drawer close
    setIsDrawerOpen((prev) => {
      if (prev) {
        setSelectedFile(null); // Reset selected file when drawer is closed
        setCategory("");
        setSubCategory("");
        setUploadDescription("");
      }
      return !prev;
    });
  };

  const toggleUrlDrawer = () => {
    // Added by Gauri to reset fields when drawer close
    setIsUrlDrawerOpen((prev) => {
      if (prev) {
        setUrl("");
        setCategory("");
        setSubCategory("");
        setUrlDescription("");
      }
      return !prev;
    });
    setUrl("");
    setUrlError("");
  };

  const toggleDetailDrawer = () => {
    setIsDetailDrawerOpen(!isDetailDrawerOpen);
  };

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log("setSelectedFile", event.target.files[0]);
  };

  const validateUrl = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  const handleOpenInNewTab = (filePath) => {
    const newWindow = window.open(filePath, "_blank");
    if (newWindow) {
      newWindow.focus(); // Focus the new tab if it successfully opens
    } else {
      console.error("Failed to open the file in a new tab.");
    }
  };

  // Function for Attach URL Added by Gauri on 21 Feb 2025
  const uploadAttachURL = async () => {
    // Construct the API URL
    if (!url) {
      toast.error("Please enter URL");
      return;
    }
    if (!validateUrl(url)) {
      toast.error("Please enter valid URL");
      return;
    }
    if (!category) {
      toast.error("Select document category");
      return;
    }

    if (!urlDescription) {
      toast.error("Enter description for document");
      return;
    }
    // ${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/ActionItemAttachURL?
    ActionItemID=${actionItemID}
    &URL=${encodeURIComponent(url)}
    &CategoryID=${category}
    &SubCategoryID=${subCategory}
    &Description=${encodeURIComponent(urlDescription)}
    &UserID=${employeeId}
    &LoginType=E`.replace(/\s+/g, "");

    try {
      // Perform the fetch request
      const response = await fetch(apiUrl, {
        method: "POST", // You can use 'POST' if needed
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}` // Add the token from session storage
        }
      });

      // Check if the request was successful
      if (response.ok) {
        const data = await response.json();
        // setDocumentList(data); 
        console.log("Response data:", data);
        toggleUrlDrawer();
        toast.success("URL save successfully!");
        setRefreshDoc(!refreshDoc);
        return data; // Return the fetched data
      } else {
        console.error("Failed to fetch data:", response.statusText);
        return null;
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error("Error fetching data:", error);
      return null;
    }
  };

  // Function for Upload Document Added by Gauri on 21 Feb 2025
  const handleUploadClick = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const accessToken = sessionStorage.getItem("access_token");

    if (!selectedFile) {
      toast.error("Select document to upload");
      return;
    }

    // Check if category is selected
    if (!category) {
      toast.error("Select document category");
      return;
    }
    if (!uploadDescription) {
      toast.error("Enter description for document");
      return;
    }

    // Proceed with form submission if validations pass
    const formData = new FormData();
    formData.append("formFile", selectedFile, selectedFile.name);
    // Additional data can be appended to formData if needed

    try {
      const response = await fetch(`${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/ActionItemDocUpload?
        ActionItemID=${actionItemID}
        &EmpID=${employeeId}
        &categoryid=${category}
        &Subcategoryid=${subCategory}
        &Description=${uploadDescription}`.replace(/\s+/g, ""),

        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        }
      );

      if (response.ok) {
        toast.success("File uploaded successfully.");
        setRefreshDoc(!refreshDoc);
        toggleDrawer();
      } else {
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Fetch document categories and subcategories
  useEffect(() => {
    const fetchDocumentCategories = async () => {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDocCatgoryAndSubCategory?userID=${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocumentCategories(data.data.listDocumentCategory);
      } else {
        console.error("Failed to fetch document categories");
      }
    };

    fetchDocumentCategories();
  }, []);

  const handleDocDelete = (docId) => {
    console.log("Deleting document with ID:", docId); // Debugging log

    if (!docId) {
      toast.error("Document ID is missing.");
      return;
    }
    
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
  
    // Construct the API URL with the provided docId (instead of docIdToDelete)
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/DeleteActionItemDocument?ActionItemID=${actionItemID}&DocumentID=${docId}&UserID=${userId}`;
  
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
        toast.success(`Document Deleted Successfully!`);
        setShowDeleteModal(false);
        setRefreshDoc(!refreshDoc); // Refresh the list
      })
      .catch((error) => {
        toast.error(`Error deleting document with ID ${docId}: ${error.message}`);
      });
  };

  const fetchDocumentHistory = async (docId) => {  
    setIsDetailDrawerOpen(true);
    try {
      const queryParams = new URLSearchParams({
        ActionItemID: actionItemID, 
        DocumentID: docId, 
      }).toString();

      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetActionItemDocumentHistory?${queryParams}`,
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
      // setDocumentHistoryData(data?.data?.data?.listActionItemDocumentHistory);
      setDocumentHistoryData(data.data.data.data.listActionItemDocumentHistory[0] || []);

      console.log("API Response Data:", data);
      // console.log("StageActionItems Edit Details:", itemDetails);
      console.log("setDocumentHistoryData:", documentHistoryData);
    } catch (error) {
      console.error("Failed to fetch Stage Action Items:", error);
    } 
  };

  useEffect(() => {
    console.log("Updated documentHistoryData:", documentHistoryData);
  }, [documentHistoryData]);  

  return (
    <div className="tab-pane" id="Ini_Documents">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <Typography variant="body1"></Typography>
          </div>
          <div className="col-12 col-sm-9 text-end">
            <Button variant="primary" onClick={toggleDrawer}>
              Upload Document
            </Button>
            <Button variant="text" className="btn nostylebtn closelink" onClick={toggleUrlDrawer}>
              Attach URL
            </Button>
          </div>
        </div>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Document Category</th>
            <th>Document Sub Category</th>
            <th>Document Name</th>
            <th>Uploaded Date</th>
            <th>Last Modified</th>
            <th>Uploaded By</th>
            <th>File Size(kb)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {initiativeDocument.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", color: "#666" }}>
                There are no items to show in this view.
              </td>
            </tr>
          ) : (
            initiativeDocument.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.category}</td>
                <td>{doc.subCategory}</td>
                <td
                  onClick={() => handleOpenInNewTab(doc.filePath)}
                  style={{ cursor: "pointer", color: "#0a58ca", textDecoration: "underline" }}
                >
                  <Tooltip title={doc.fileName}>
                    {doc.fileName.length > 6 ? `${doc.fileName.slice(0, 6)}...` : doc.fileName}
                  </Tooltip>
                </td>
                <td>
                  {new Date(doc.uploadedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td>
                  {/* {new Date(doc.updatedDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })} */}
                  {doc.updatedDate
                    ? new Date(doc.updatedDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })
                    : ""}
                </td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.fileSize} kb</td>
                <td>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Tooltip title="History">
                    <IconButton size="small" onClick={() => fetchDocumentHistory(doc.documentID)}>
                      <AccessTimeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                    {/* {acc[0]?.access !== 0 && ( */}
                      <Tooltip title="Delete">
                        <IconButton size="small"
                          onClick={() => {
                            setDocIdToDelete(doc.documentID); // Store the ID for UI purposes
                            setShowDeleteModal(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    {/* )} */}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Deletion",
          subText: "Are you sure you want to delete this Document?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => handleDocDelete(docIdToDelete)} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>

      {/* Drawer for Upload Document Start here */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: "60vw" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{
              backgroundColor: "#f5f5f5", // Light grey background
              padding: 2, // Optional: Add padding for spacing
              borderRadius: 1 // Optional: Add rounded corners
            }}
          >
            <Typography variant="h6">
              Upload Document
              {/* (<span style={{ color: "red" }}>*</span> Mandatory) */}
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>
          {/* {acc[0]?.access !== 0 && ( */}
            <>
              <Stack className="mb-3" horizontalAlign="end">
                <Button variant="contained" onClick={handleUploadClick}>
                  Upload
                </Button>
                <Typography variant="small">
                  ( <span style={{ color: "#F00" }}>*</span> Mandatory)
                </Typography>
              </Stack>
            </>
          {/* )} */}
          <DropZone onClick={() => document.getElementById("fileUpload").click()}>
            {!selectedFile?.name && "Drop file here or click to upload"}{" "}
            {selectedFile?.name && `File selected: ${selectedFile?.name}`}{" "}
            {/* Only show this if no file is selected */}
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              id="fileUpload"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            {/* {selectedFile.name && (
              <Typography variant="body2" color="textSecondary" mt={2}>
                File selected: {selectedFile.name}
              </Typography>
            )} */}
          </DropZone>
          <Box mb={3}>
            <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
              <FormControl fullWidth>
                <label
                  htmlFor="DocCategorySelect"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Select document category <span style={{ color: "red" }}>*</span>
                </label>
                <TextField
                  id="DocCategorySelect"
                  select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory(""); // Reset subCategory when category changes
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {documentCategories.map((cat) => (
                    <MenuItem key={cat.categoryID} value={cat.categoryID}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              <FormControl fullWidth disabled={!category}>
                <label
                  htmlFor="DocSubCategorySelect"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Please select document sub category
                  {/* <span style={{ color: "red" }}>*</span> */}
                </label>
                <TextField
                  id="DocSubCategorySelect"
                  select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Select a subcategory
                  </MenuItem>
                  {documentCategories
                    .find((cat) => cat.categoryID === category)
                    ?.listSubCategory.map((subCat) => (
                      <MenuItem key={subCat.subCategoryID} value={subCat.subCategoryID}>
                        {subCat.subCategory}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </Box>
          </Box>

          <Box mb={3}>
            <label
              htmlFor="description"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block"
              }}
            >
              Description <span style={{ color: "red" }}>*</span>
            </label>
            <TextField
              fullWidth
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              required
              margin="normal"
              multiline
              minRows={4} // Adjust number of rows as needed
              sx={{
                backgroundColor: "#f5f5f5", // Light grey background
                borderRadius: 1, // Optional: Add rounded corners
                marginTop: 0, // Remove top margin
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc" // Optional: Light border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaa" // Optional: Darker border on hover
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>
      {/* Drawer for Upload Document End here */}

      {/* Drawer for Attaching URL Start here */}
      <Drawer
        anchor="right"
        open={isUrlDrawerOpen}
        onClose={toggleUrlDrawer}
        PaperProps={{ sx: { width: "600px" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{
              backgroundColor: "#f5f5f5", // Light grey background
              padding: 2, // Optional: Add padding for spacing
              borderRadius: 1 // Optional: Add rounded corners
            }}
          >
            <Typography variant="h6">
              Attach URL
              {/* (<span style={{ color: "red" }}>*</span> Mandatory) */}
            </Typography>
            <IconButton onClick={toggleUrlDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          {/* Added access by Gauri on 07 Feb 2025 start here */}
          {/* {acc[0]?.access !== 0 && ( */}
            <Stack horizontalAlign="end">
              <Button variant="contained" onClick={uploadAttachURL}>
                Attach URL
              </Button>
              <Typography variant="small">
                ( <span style={{ color: "#F00" }}>*</span> Mandatory)
              </Typography>
            </Stack>
          {/* )} */}
          {/* Added access by Gauri on 07 Feb 2025 end here */}

          <TextField
            label="URL"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            margin="normal"
          />
          <Box mb={3}>
            <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
              <FormControl fullWidth>
                <label
                  htmlFor="URLCategorySelect"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Select document category <span style={{ color: "red" }}>*</span>
                </label>
                <TextField
                  id="URLCategorySelect"
                  select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubCategory(""); // Reset subCategory when category changes
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {documentCategories.map((cat) => (
                    <MenuItem key={cat.categoryID} value={cat.categoryID}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>

              <FormControl fullWidth disabled={!category}>
                <label
                  htmlFor="URLSubCategorySelect"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Please select document sub category
                </label>
                <TextField
                  id="URLSubCategorySelect"
                  select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    Select a subcategory
                  </MenuItem>
                  {documentCategories
                    .find((cat) => cat.categoryID === category)
                    ?.listSubCategory.map((subCat) => (
                      <MenuItem key={subCat.subCategoryID} value={subCat.subCategoryID}>
                        {subCat.subCategory}
                      </MenuItem>
                    ))}
                </TextField>
              </FormControl>
            </Box>
          </Box>

          <Box mb={3}>
            <label
              htmlFor="description"
              style={{
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
                display: "block"
              }}
            >
              Description <span style={{ color: "red" }}>*</span>
            </label>
            <TextField
              fullWidth
              value={urlDescription}
              onChange={(e) => setUrlDescription(e.target.value)}
              required
              margin="normal"
              multiline
              minRows={4} // Adjust number of rows as needed
              sx={{
                backgroundColor: "#f5f5f5", // Light grey background
                borderRadius: 1, // Optional: Add rounded corners
                marginTop: 0, // Remove top margin
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc" // Optional: Light border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#aaa" // Optional: Darker border on hover
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Drawer>
      {/* Drawer for Attaching URL End here */}

      {/* Drawer for Document History Start here */}
      <Drawer
        anchor="right"
        open={isDetailDrawerOpen}
        onClose={toggleDetailDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="start"
            mb={3}
            sx={{ backgroundColor: "#f5f5f5", padding: "8px", borderRadius: "4px" }}
          >
            <Typography variant="subtitle1">Document History</Typography>
            <IconButton onClick={toggleDetailDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          {documentHistoryData && (
            <Box>
              {/* Document Details */}
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Document Category:
                </Typography>
                <Typography variant="body2">{documentHistoryData.category}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  File Name:
                </Typography>
                <Typography variant="body2" style={{ "word-break": "break-word" }}>
                  {documentHistoryData.fileName}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Upload Date:
                </Typography>
                <Typography variant="body2">
                  {documentHistoryData.uploadedDate
                    ? new Date(documentHistoryData.uploadedDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })
                    : ""}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Last Modified:
                </Typography>
                <Typography variant="body2">
                  {documentHistoryData.updatedDate
                    ? new Date(documentHistoryData.updatedDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })
                    : ""}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Description:
                </Typography>
                <Typography variant="body2">{documentHistoryData.description}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Uploaded By:
                </Typography>
                <Typography variant="body2">{documentHistoryData.uploadedBy}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  File Size:
                </Typography>
                <Typography variant="body2">{documentHistoryData.fileSize}</Typography>
              </Box>

              {/* Actions */}
              <Divider sx={{ my: 3 }} />
            </Box>
          )}
        </Box>
      </Drawer>
      {/* Drawer for Document History End here */}
    </div>
  );
};

export default DocumentsComponent;
