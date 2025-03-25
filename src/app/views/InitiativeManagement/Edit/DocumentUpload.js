import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  TextField,
  MenuItem,
  Typography,
  Box,
  IconButton,
  Table,
  TableBody,
  Grid,
  TableCell,
  TableContainer,
  TableHead,
  Divider,
  TableRow,
  Paper,
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Import AccessTimeIcon
import DeleteIcon from "@mui/icons-material/Delete"; // Import DeleteIcon
import { styled } from "@mui/material/styles";
import { Refresh } from "@mui/icons-material";
import GetInitiativeDocumentList from "app/hooks/Editpage/GetInitiativeDocumentList";

const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#666",
  borderRadius: "4px",
  marginBottom: "20px"
});

const DocumentsComponent = ({ id }) => {
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
  const [documentList, setDocumentList] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  console.log("DocumentUpload", id);
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
    const apiUrl = `${
      process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
    }/api/FileUpDown/IniAttachURL?Ideaid=${id}&URL=${encodeURIComponent(
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
  useEffect(() => {
    const fetchDocumentCategories = async () => {
      const document = await GetInitiativeDocumentList(id, employeeId);
      setDocumentList(document || []);
    };

    fetchDocumentCategories();
  }, [refresh]);
  const handleUploadClick = async () => {
    const accessToken = sessionStorage.getItem("access_token");

    if (!selectedFile || !category) {
      alert("Please fill out all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("formFile", selectedFile, selectedFile.name);

    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
        }/api/FileUpDown/IniDocUpload?IniID=${id}&EmpID=${employeeId}&categoryid=${category}&Subcategoryid=${
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
        alert("File uploaded successfully.");
        setrefresh(!refresh);
        toggleDrawer();
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAccessTimeClick = (doc) => {
    setSelectedDocDetails(doc);
    toggleDetailDrawer();
  };

  const handleDelete = (docId) => {
    // Implement delete functionality here
    alert(`Document with ID ${docId} will be deleted.`);
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

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table responsive striped bordered hover style={{ marginTop: "20px" }}>
          <TableHead>
            <TableRow>
              <TableCell>Document Category</TableCell>
              {/* <TableCell>Document Sub Category</TableCell> */}
              <TableCell align="center">File Name</TableCell>
              <TableCell>Uploaded Date</TableCell>
              <TableCell>Last Modified</TableCell>
              <TableCell align="center">Uploaded By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentList?.data?.listInitiativeDocumentListEntity?.map((doc) => (
              <TableRow key={doc.id} hover className="MuiTableRow-hover">
                <TableCell>{doc.category}</TableCell>
                {/* <TableCell>{doc.subCategory}</TableCell> */}
                <TableCell
                  align="center"
                  onClick={() => handleOpenInNewTab(doc.filePath)}
                  style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                  {doc.fileName}
                </TableCell>
                <TableCell>
                  {" "}
                  {new Date(doc.uploadedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell>
                  {" "}
                  {new Date(doc.updatedDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  })}
                </TableCell>
                <TableCell align="center">{doc.uploadedBy}</TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Drawer for document upload */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: "70vw" } }}
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
            <IconButton onClick={toggleDrawer}>
              <Tooltip title="Close">
                <Tooltip title="Close">
                  <CloseIcon />
                </Tooltip>
              </Tooltip>
            </IconButton>
          </Box>
          <DropZone onClick={() => document.getElementById("fileUpload").click()}>
            Drop file here or click to upload
            <input
              type="file"
              id="fileUpload"
              style={{ display: "none" }}
              accept=".pdf, .doc, .docx" // Accept PDF and DOC/DOCX files
              onChange={handleFileUpload}
            />
          </DropZone>
          <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
            <TextField
              select
              label="Select document category"
              fullWidth
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory(""); // Reset subCategory when category changes
              }}
            >
              {documentCategories.map((cat) => (
                <MenuItem key={cat.categoryID} value={cat.categoryID}>
                  {cat.category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Please select document sub category"
              fullWidth
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category} // Disable if no category is selected
            >
              {documentCategories
                .find((cat) => cat.categoryID === category)
                ?.listSubCategory.map((subCat) => (
                  <MenuItem key={subCat.subCategoryID} value={subCat.subCategoryID}>
                    {subCat.subCategory}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin="normal"
          />
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
        PaperProps={{ sx: { width: "70vw" } }}
      >
        <Box p={3}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            <Typography variant="h6">Attach Document</Typography>
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
          <Box display="flex" gap={2} alignItems="flex-start" mb={2}>
            <TextField
              select
              label="Select document category"
              fullWidth
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory(""); // Reset subCategory when category changes
              }}
            >
              {documentCategories.map((cat) => (
                <MenuItem key={cat.categoryID} value={cat.categoryID}>
                  {cat.category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Please select document sub category"
              fullWidth
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category} // Disable if no category is selected
            >
              {documentCategories
                .find((cat) => cat.categoryID === category)
                ?.listSubCategory.map((subCat) => (
                  <MenuItem key={subCat.subCategoryID} value={subCat.subCategoryID}>
                    {subCat.subCategory}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            margin="normal"
          />
          <Button variant="contained" onClick={uploadFileData}>
            Save
          </Button>
        </Box>
      </Drawer>

      {/* Drawer for document details */}
      <Drawer
        anchor="right"
        open={isDetailDrawerOpen}
        onClose={toggleDrawer}
        PaperProps={{ sx: { width: "400px" } }}
      >
        <Box p={3}>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={3}>
            <Typography variant="h6">Document Details</Typography>
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
              <Box mb={2}>
                <Typography variant="body2" fontWeight="bold">
                  Description:
                </Typography>
                <Typography variant="body2">{selectedDocDetails.description}</Typography>
              </Box>
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
              {/* <Divider sx={{ my: 3 }} />
              <Box>
                <Button variant="outlined" onClick={toggleDrawer} sx={{ marginRight: 2 }}>
                  Close
                </Button>
                <Button variant="contained" onClick={() => handleDelete(selectedDocDetails.id)}>
                  Delete
                </Button>
              </Box> */}
            </Box>
          )}
        </Box>
      </Drawer>
    </div>
  );
};

export default DocumentsComponent;
