import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  TextField,
  FormControl,
  MenuItem,
  Typography,
  Box,
  IconButton,
  // Table,
  // TableBody,
  Grid,
  TableCell,
  TableContainer,
  TableHead,
  Divider,
  TableRow,
  Paper,
  Tooltip
} from "@mui/material";
import { Table } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import AccessTimeIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import { styled } from "@mui/material/styles";
import GetExternalAuditDocumentList from "app/hooks/ExternalAudit/GetExternalAuditDocumentList";
import { ToastContainer, toast } from "react-toastify";
import { PrimaryButton, Stack } from "@fluentui/react";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#666",
  borderRadius: "4px",
  marginBottom: "20px"
});

const DocumentsComponent = ({ id, initiativeId, auditId, setRefreshDoc, refreshDoc }) => {
  console.log("Initiative ID on Doc:", id);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isDocHistoryOpen, setIsDocHistoryOpen] = useState(false);
  const [isUrlDrawerOpen, setIsUrlDrawerOpen] = useState(false);
  // const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  // const [description, setDescription] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [urlDescription, setUrlDescription] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);
  const [documentCategories, setDocumentCategories] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docIdToDelete, setDocIdToDelete] = useState(null);
  const [documentList, setDocumentList] = useState({ data: { externalAuditDocEntity: [] } });
  const [refresh, setrefresh] = useState(false);
  const [documentHistoryData, setDocumentHistoryData] = useState(null);

  useEffect(() => {
    // Modified fetchDocumentList by Gauri to fetch document list on 13 Mar 2025
    const fetchDocumentList = async () => {
      if (id) {
        const document = await GetExternalAuditDocumentList(id, employeeId);
        console.log("Raw API Response:", document); // Debugging
        if (document && document.data && document.data.externalAuditDocEntity) {
          setDocumentList(document);
        } else {
          setDocumentList({ data: { externalAuditDocEntity: [] } });
        }
      }
    };

    fetchDocumentList();
  }, [refreshDoc, id]);

  // const fetchDocumentList = async () => {
  //   const document = await GetExternalAuditDocumentList(id, employeeId);
  //   console.log("API Response:", document); // Debugging
  //   // setDocumentList(document?.data?.externalAuditDocEntity || []);
  //   // setDocumentList(document || []);
  //   setDocumentList(document ?? { data: { externalAuditDocEntity: [] } });
  // }

  // useEffect(() => {
  //   if (id) {
  //     fetchDocumentList();
  //   };

  // }, [refreshDoc, id]);

  useEffect(() => {
    console.log("Updated document list:", documentList);
  }, [documentList]);

  const toggleDetailDrawer = () => {
    // setIsDetailDrawerOpen(!isDetailDrawerOpen);
    // Added by Gauri to reset fields when drawer close
    setIsDetailDrawerOpen((prev) => {
      if (prev) {
        setSelectedFile(null); // Reset selected file when drawer is closed
        setCategory("");
        setSubCategory("");
        setUploadDescription("");
      }
      return !prev;
    });
  };

  const toggleDocHistoryDrawer = () => {
    setIsDocHistoryOpen(!isDocHistoryOpen);
  };

  const toggleUrlDrawer = () => {
    // Added by Gauri to reset fields when drawer close on 11 Mar 2025
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

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const validateUrl = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  };

  // Modified by Gauri to Attach URL on 11 Mar 2025
  const handleAttachUrl = async () => {
    // Commented and Added by Gauri to add Validation alert on URL on 11 Mar 2025
    // if (!url || !validateUrl(url)) {
    //   toast.error("Please enter a valid URL.");
    //   return;
    // }
    console.log("UniqueId", id);
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

    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));

    if (!userdata || !userdata.employeeId) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    if (!initiativeId) {
      // toast.error("Ideaid (id) is missing.");
      toast.error("Ideaid (id) is missing.");
      return;
    }
    if (!id) {
      toast.error("UniqueID is missing.");
      return;
    }

    // ${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/AttachURLExternalAudit?Ideaid=${initiativeId}
        &URL=${encodeURIComponent(url)}
        &CategoryID=${category}
        &SubCategoryID=${subCategory}
        &Description=${encodeURIComponent(urlDescription)}
        &UserID=${employeeId}
        &uniqueid=${id}`;

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
        setDocumentList(data);
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

  const handleOpenInNewTab = (filePath) => {
    const newWindow = window.open(filePath, "_blank");
    if (newWindow) {
      newWindow.focus(); // Focus the new tab if it successfully opens
    } else {
      console.error("Failed to open the file in a new tab.");
    }
  };

  // Modified by Gauri to Upload Document on 11 Mar 2025
  const handleUploadClick = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const accessToken = sessionStorage.getItem("access_token");

    if (!selectedFile) {
      toast.error("Select document to upload");
      return;
    }
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
      const response = await fetch(`${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/UploadExternalAuditDocument?IniID=${initiativeId?.toString().trim()}&EmpID=${employeeId}&categoryid=${category}&Subcategoryid=${subCategory}&Description=${uploadDescription.replace(/\s+/g, "")}&uniqueid=${id?.toString().trim()}&documentcode="0"`,
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
        toggleDetailDrawer();
      } else {
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Modified by Gauri to Delete Document on 11 Mar 2025
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
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/DeleteExternalAuditDocumentFromList?DocID=${docId}&UserID=${userId}`;

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
      // setDocumentList(document?.data?.externalAuditDocEntity || []);
      // setDocumentList(document ?? { data: { externalAuditDocEntity: [] } });
      console.log("fetchDocumentCategories documentList", documentList);
      if (response.ok) {
        const data = await response.json();
        setDocumentCategories(data.data.listDocumentCategory);
      } else {
        console.error("Failed to fetch document categories");
      }
    };

    fetchDocumentCategories();
  }, [refresh]);  // This ensures the list refreshes after delete []);

  // Modified by Gauri to Document History on 11 Mar 2025
  const fetchDocumentHistory = async (docId, auditId) => {
    setIsDocHistoryOpen(true); // Open the Document Details drawer

    try {
      console.log("Fetching document history for docId:", docId, "and auditId:", auditId); // Debugging

      const queryParams = new URLSearchParams({
        ActionItemID: auditId,  // Using auditTypeID instead
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
      console.log("API Response Data:", data);

      if (Array.isArray(data?.data?.data?.data?.listActionItemDocumentHistory) &&
          data.data.data.data.listActionItemDocumentHistory.length > 0) {
        
        setDocumentHistoryData(data.data.data.data.listActionItemDocumentHistory[0]);  // ✅ Access the first object
        console.log("Setting document history:", data.data.data.data.listActionItemDocumentHistory[0]);

      } else {
        setDocumentHistoryData(null);
        console.log("No document history found.");
      }
    } catch (error) {
      console.error("Failed to fetch Document History:", error);
    }
  };

  useEffect(() => {
    console.log("Updated documentHistoryData:", documentHistoryData);
  }, [documentHistoryData]);

  return (
    <div className="tab-pane" id="Ini_Documents">
      <div className="container-fluid mb-2">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <Typography variant="body1"></Typography>
          </div>
          <div className="col-12 col-sm-9 text-end">
            <Button variant="primary" onClick={toggleDetailDrawer}>
              Upload Document
            </Button>
            <Button variant="text" className="btn nostylebtn closelink" onClick={toggleUrlDrawer}>
              Attach URL
            </Button>
          </div>
        </div>
      </div>

      {/* Added column names by Gauri on 12 Mar 2025 */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Document Category</th>
            <th>Document Sub Category</th>
            <th>Document Name</th>
            <th>Uploaded Date</th>
            <th>Last Modified</th>
            <th>Uploaded By</th>
            <th>File Size(kb)</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {documentList?.data?.externalAuditDocEntity?.length > 0 ? ( */}
          {Array.isArray(documentList?.data?.externalAuditDocEntity) && documentList.data.externalAuditDocEntity.length > 0 ? (
            documentList.data.externalAuditDocEntity.map((doc) => (
              <tr key={doc.id} className="MuiTableRow-hover">
                <td>{doc.category}</td>
                <td>{doc.subCategory}</td>
                <td
                  // align="center"
                  onClick={() => handleOpenInNewTab(doc.filePath)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
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
                  {new Date(doc.updatedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.fileSize}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip title="History">
                      <IconButton className="p-1" onClick={() => fetchDocumentHistory(doc.documentID, auditId)}>
                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      {/* <IconButton onClick={() => handleDelete(doc.id)}> */}
                      <IconButton className="p-1" onClick={() => {
                        console.log("Delete clicked for Document ID:", doc.documentID); // Debugging line
                        setDocIdToDelete(doc.documentID)
                        setShowDeleteModal(true)
                      }}>
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                There are no items to show in this view.
              </td>
            </tr>
          )}
        </tbody>

      </Table>


      {/* Drawer for document upload */}
      <Drawer
        anchor="right"
        open={isDetailDrawerOpen}
        onClose={toggleDetailDrawer}
        PaperProps={{ sx: { width: "40vw" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">Upload Document</Typography>
            <IconButton onClick={toggleDetailDrawer}>
              <Tooltip title="Close">
                <Tooltip title="Close">
                  <CloseIcon />
                </Tooltip>
              </Tooltip>
            </IconButton>
          </Box>


          <Stack className="mb-3" horizontalAlign="end">
            <PrimaryButton variant="contained" onClick={handleUploadClick}>
              Upload
            </PrimaryButton>
            <Typography variant="small">
              ( <span style={{ color: "#F00" }}>*</span> Mandatory)
            </Typography>
          </Stack>
          <DropZone onClick={() => document.getElementById("fileUpload").click()}>
            {/* Drop file here or click to upload
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              accept=".pdf, .doc, .docx" // Accept PDF and DOC/DOCX files
              onChange={handleFileUpload}
            /> */}
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
                  Select document sub category
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

      {/* Drawer for attaching URL */}

      <Drawer
        anchor="right"
        open={isUrlDrawerOpen}
        onClose={toggleUrlDrawer}
        PaperProps={{ sx: { width: "40vw" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">Attach URL</Typography>
            {/* (<span style={{ color: "red" }}>*</span> Mandatory) */}
            <IconButton onClick={toggleUrlDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          <Stack horizontalAlign="end">
            <PrimaryButton variant="contained" onClick={handleAttachUrl}>
              Attach URL
            </PrimaryButton>
            <Typography variant="small">
              ( <span style={{ color: "#F00" }}>*</span> Mandatory)
            </Typography>
          </Stack>

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
            {/* <FormControl fullWidth> */}
            {/* <Typography variant="subtitle1" gutterBottom>
              Description <span style={{ color: "red" }}>*</span>
            </Typography> */}
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

          {/* <Button variant="contained" onClick={uploadFileData}>
            Save
          </Button> */}
        </Box>
      </Drawer>
      
      {/* Drawer for Document History Start here */}
      <Drawer
        anchor="right"
        open={isDocHistoryOpen}
        onClose={toggleDocHistoryDrawer}
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

      {/* <Drawer
        anchor="right"
        open={isDocHistoryOpen}
        onClose={toggleDocHistoryDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">Document Details</Typography>
            <IconButton onClick={toggleDocHistoryDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          {documentHistoryData ? (
            <Box>
              <Typography variant="body2"><strong>Category:</strong> {documentHistoryData.category || "N/A"}</Typography>
              <Typography variant="body2"><strong>File Name:</strong> {documentHistoryData.fileName || "N/A"}</Typography>
              <Typography variant="body2"><strong>Uploaded Date:</strong> {documentHistoryData.uploadDate || "N/A"}</Typography>
              <Typography variant="body2"><strong>Last Modified:</strong> {documentHistoryData.lastModified || "N/A"}</Typography>
              <Typography variant="body2"><strong>Description:</strong> {documentHistoryData.description || "N/A"}</Typography>
              <Typography variant="body2"><strong>Uploaded By:</strong> {documentHistoryData.uploadedBy || "N/A"}</Typography>
              <Typography variant="body2"><strong>File Size:</strong> {documentHistoryData.fileSize || "N/A"}</Typography>
            </Box>
          ) : (
            <Typography>No document history available.</Typography>
          )}
        </Box>
      </Drawer> */}

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
          {/* <PrimaryButton onClick={() => confirmDelete} text="Yes" /> */}
          {/* <PrimaryButton onClick={confirmDelete} text="Yes" /> */}
          <PrimaryButton onClick={() => handleDocDelete(docIdToDelete)} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DocumentsComponent;

