import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  // Table,
  TableBody,
  Grid,
  TableCell,
  TableContainer,
  TableHead,
  Divider,
  TableRow,
  Paper,
  FormControl,
  InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import AccessTimeIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import { styled } from "@mui/material/styles";
import { Refresh } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { Modal, Table } from "react-bootstrap"; // Assuming you're using React-Bootstrap
import { toast, ToastContainer } from "react-toastify";

const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#666",
  borderRadius: "4px",
  marginBottom: "20px"
});

const DocumentsComponentWork = ({ initiativeDocument, initiativesID, setRefresh, refresh }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUrlDrawerOpen, setIsUrlDrawerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);
  const [documentCategories, setDocumentCategories] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docIdToDelete, setDocIdToDelete] = useState(null);
  const [fileName, setFileName] = useState("");

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleUrlDrawer = () => {
    setIsUrlDrawerOpen(!isUrlDrawerOpen);
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

  const handleAttachUrl = () => {
    if (!url || !validateUrl(url)) {
      setUrlError("Please enter a valid URL.");
      return;
    }
    alert("URL attached successfully.");
    toggleUrlDrawer();
  };

  const handleOpenInNewTab = (filePath) => {
    const newWindow = window.open(filePath, "_blank");
    if (newWindow) {
      newWindow.focus(); // Focus the new tab if it successfully opens
    } else {
      console.error("Failed to open the file in a new tab.");
    }
  };

  const uploadFileData = async () => {
    // Validate the URL before proceeding
    // if (!isValidUrl(url)) {
    //   console.error("Invalid URL:", url);
    //   return;
    // }

    // Construct the API URL
    if (!category) {
      toast.error("Select document category");
      return;
    }

    if (!description) {
      toast.error("Please enter a description");
      return;
    }
    if (!url) {
      toast.error("Please provide a valid URL");
      return;
    }
    const apiUrl = `${
      process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
    }/api/FileUpDown/IniAttachURL?Ideaid=${initiativesID}&URL=${encodeURIComponent(
      url
    )}&CategoryID=${category}&SubCategoryID=${subCategory}&Description=${encodeURIComponent(
      description
    )}&UserID=${employeeId}&LoginType=E`;

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
        console.log("Response data:", data);
        toggleUrlDrawer();
        toast.success("Upload succesfull");
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
    if (!description) {
      toast.error("Select document category");
      return;
    }
    if (!subCategory) {
      toast.error("Select document category");
      return;
    }
    // Proceed with form submission if validations pass
    const formData = new FormData();
    formData.append("formFile", selectedFile, selectedFile.name);
    // Additional data can be appended to formData if needed

    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
        }/api/FileUpDown/IniDocUpload?IniID=${initiativesID}&EmpID=${employeeId}&categoryid=${category}&Subcategoryid=${
          subCategory?.trim() === "" ? 0 : subCategory
        }&Description=${description}`,
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
        setRefresh(!refresh);
        toggleDrawer();
      } else {
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleAccessTimeClick = (doc) => {
    setSelectedDocDetails(doc);
    toggleDetailDrawer();
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
  const handleDelete = (docId) => {
    setDocIdToDelete(docId); // Set the ID of the item to delete
    setShowDeleteModal(true); // Show the modal
  };

  const confirmDelete = () => {
    // Add your API call or delete logic here
    alert(`Document with ID ${docIdToDelete} will be deleted.`);
    setShowDeleteModal(false); // Close the modal
    setDocIdToDelete(null); // Reset the ID
  };
  return (
    <div className="tab-pane" id="Ini_Documents">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-3">
            <Typography variant="body1"></Typography>
          </div>
          {/* <div className="col-12 col-sm-9 text-end">
            <Button variant="primary" onClick={toggleDrawer}>
              Upload Document
            </Button>
            <Button variant="text" className="btn nostylebtn closelink" onClick={toggleUrlDrawer}>
              Attach URL
            </Button>
          </div> */}
        </div>
      </div>

      <Table responsive striped bordered hover style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Category</th>
            <th className="text-center">Sub Category</th>
            <th className="text-center">Name(Latest)</th>
            <th className="text-center">Uploaded By</th>
            <th>File Size</th>
            <th>Uploaded Date</th>
            <th>Last Modified</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* If there are no records in table, then note should display issue fixed by Gauri on 07 Feb 2025 start here */}
          {initiativeDocument?.data?.listInitiativeDocumentListEntity &&
            initiativeDocument.data.listInitiativeDocumentListEntity.length > 0 ? (
            initiativeDocument.data.listInitiativeDocumentListEntity.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.category}</td>
                <td className="text-center">{doc.subCategory}</td>
                <td
                  className="text-center"
                  onClick={() => handleOpenInNewTab(doc.filePath)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {doc.fileName}
                </td>
                <td className="text-center">{doc.uploadedBy}</td>
                <td>{doc.fileSize} kb</td>
                <td>{new Date(doc.uploadedDate).toLocaleString()}</td>
                <td>{new Date(doc.updatedDate).toLocaleString()}</td>
                <td className="text-center" style={{ padding: "16px", width: "100px" }}>
                  <Tooltip title="History">
                    <IconButton onClick={() => handleAccessTimeClick(doc)}>
                      <AccessTimeIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(doc.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            )) 
          ): (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                There are no items to show in this view.
              </td>
            </tr>
          )}
          {/* If there are no records in table, then note should display issue fixed by Gauri on 07 Feb 2025 end here */}
        </tbody>
      </Table>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        style={{ zIndex: 2000 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this document?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            No
          </Button>
          <Button variant="danger" onClick={() => confirmDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
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
              Upload Document (<span style={{ color: "red" }}>*</span> Mandatory)
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>
          <DropZone onClick={() => document.getElementById("fileUpload").click()}>
            {!selectedFile?.name && "Drop file here or click to upload"}{" "}
            {selectedFile?.name && `File selected: ${selectedFile?.name}`}{" "}
            {/* Only show this if no file is selected */}
            <input
              type="file"
              id="fileUpload"
              accept=".pdf, .doc, .docx"
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
                  htmlFor="category-select"
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
                  id="category-select"
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
                  htmlFor="subcategory-select"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Please select document sub category <span style={{ color: "red" }}>*</span>
                </label>
                <TextField
                  id="subcategory-select"
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
            <Typography variant="subtitle1" gutterBottom>
              Description <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              margin="normal"
              multiline
              minRows={4} // Adjust number of rows as needed
              sx={{
                backgroundColor: "#f5f5f5", // Light grey background
                borderRadius: 1, // Optional: Add rounded corners
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

          <Button variant="contained" onClick={handleUploadClick}>
            Upload
          </Button>
        </Box>
      </Drawer>

      {/* Drawer for attaching URL */}
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
              Attach URL (<span style={{ color: "red" }}>*</span> Mandatory)
            </Typography>
            <IconButton onClick={toggleUrlDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>
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
                  htmlFor="category-select"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    display: "block"
                  }}
                >
                  Select document category
                </label>
                <TextField
                  id="category-select"
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
                  htmlFor="subcategory-select"
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
                  id="subcategory-select"
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
            <Typography variant="subtitle1" gutterBottom>
              Description <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              margin="normal"
              multiline
              minRows={4} // Adjust number of rows as needed
              sx={{
                backgroundColor: "#f5f5f5", // Light grey background
                borderRadius: 1, // Optional: Add rounded corners
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

          <Button variant="contained" onClick={uploadFileData}>
            Save
          </Button>
        </Box>
      </Drawer>

      {/* Drawer for document details */}
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
            sx={{ backgroundColor: "lightgrey", padding: "8px", borderRadius: "4px" }}
          >
            <Typography variant="subtitle1">Document Details</Typography>
            <IconButton onClick={toggleDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </Box>

          {selectedDocDetails && (
            <Box>
              {/* Document Details */}
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Document Category:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.category}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  File Name:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.fileName}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Upload Date:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.uploadDate}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Last Modified:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.lastModified}</Typography>
              </Box>
              {/* <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Description:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.description}</Typography>
              </Box> */}
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Uploaded By:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.uploadedBy}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  File Size:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.fileSize}</Typography>
              </Box>

              {/* Actions */}
              <Divider sx={{ my: 3 }} />
              <Box>
                <Button variant="outlined" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
                  Close
                </Button>
                <Button variant="contained" onClick={() => handleDelete(selectedDocDetails.id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default DocumentsComponentWork;
