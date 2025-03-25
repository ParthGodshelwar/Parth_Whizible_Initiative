import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField
} from "@mui/material";
import { Dropdown, DatePicker } from "@fluentui/react"; // Import DatePicker
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { toast } from "react-toastify";

// Added setSelectedCheckBoxes by Gauri to fix checkbox issue on 18 Mar 2025
const ActionItemTable = ({ selectedItems, setRefresh1, refresh, setShowActionItemTable, stageID, setSelectedCheckBoxes }) => {
  console.log("ActionItemTable stageID", stageID);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;
  const [priorities, setPriorities] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [editedDescriptions, setEditedDescriptions] = useState({});

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(selectedItems.length / itemsPerPage))
      setCurrentPage(currentPage + 1);
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    const fields = ["priorityid", "responsibility"];
    const ideaID = selectedItems[0]?.ideaID || "";

    try {
      const fetchData = async (field) => {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${ideaID}&userID=${userID}&FieldName=${field}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        return response.data.data.listInitiativeDetailDropDownEntity;
      };

      const results = await Promise.all(fields.map((field) => fetchData(field)));

      setPriorities(results[0] || []);
      setResponsibilities(results[1] || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Handle dropdown selection
  const handleDropdownChange = (itemIndex, field, selectedKey) => {
    setSelectedValues((prev) => ({
      ...prev,
      [itemIndex]: { ...prev[itemIndex], [field]: selectedKey }
    }));
  };

  // Handle description change
  const handleDescriptionChange = (index, newValue) => {
    setEditedDescriptions((prev) => ({
      ...prev,
      [index]: newValue
    }));
  };
  const formatDate = (date) => {
    const d = new Date(date); // Parse the ISO date string
    const day = String(d.getDate()).padStart(2, "0"); // Ensure two digits for day
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Ensure two digits for month
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  // Handle Save button click
  const handleSave = async () => {
    for (let index = 0; index < selectedItems.length; index++) {
      const assignedTo = selectedValues[index]?.assignedTo || selectedItems[index]?.approver;
      const dueDate = selectedValues[index]?.dueDate || selectedItems[index]?.responseDate;
      console.log("dueDate", dueDate);
      if (!assignedTo) {
        toast.error(`Assigned To should not be left blank `);
        return;
      }

      if (!dueDate) {
        toast.error(`Due Date should not be left blank`);
        return;
      }
    }

    try {
      // Loop through each selected item and collect the data
      const apiData = await Promise.all(
        selectedItems.map((item, index) => {
          console.log("selectedItems", item);
          const description = editedDescriptions[index] || item.checkListName;
          // Commented and Added setSelectedCheckBoxes by Gauri to pass priority on 18 Mar 2025
          // const priority = selectedValues[index]?.priority || item.prioritizationRating;
          const priority = selectedValues[index]?.priority || "";
          const assignedTo = selectedValues[index]?.assignedTo || item.approver;
          const dueDate = selectedValues[index]?.dueDate || item.responseDate;
          const formattedDueDate = formatDate(dueDate);

          // Construct the API URL with query parameters
          const requestUrl = `${
          // Added item.itemName by Gauri to pass itemname instead of ID on 18 Mar 2025
            process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
          }/api/InitiativeDetail/PostConvertToActionItem?ActionItem=${
            // item.itemID
            item.itemName
          }&Description=${encodeURIComponent(
            description
          )}&EmployeeID=${userID}&Priority=${priority}&InitiativeID=${item.ideaID}&StageID=${stageID}
          &ExpectedEndDate=${encodeURIComponent(formattedDueDate)}&ItemID=${
            item.itemID
          }&RevisionID=${item.revisionId}&UserName=${encodeURIComponent(
            item?.approver
          )}&SubmitterID=${userID}`;

          return axios.post(requestUrl, null, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          });
        })
      );

      await Promise.all(apiData);

      setRefresh1(!refresh);
      toast.success("Action Items Converted successfully.");
      // Added by Gauri to Reset selected checkboxes on 18 Mar 2025
      setSelectedCheckBoxes([]);
      setShowActionItemTable((prev) => !prev);
    } catch (error) {
      console.error("Error saving action items:", error);
    }
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action Item</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>
              Assigned To <span style={{ color: "red" }}>*</span>
            </TableCell>
            <TableCell>
              Due Date <span style={{ color: "red" }}>*</span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedItems
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.itemName}</TableCell>

                {/* Editable Description */}
                <TableCell>
                  <TextField
                    value={editedDescriptions[index]}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Edit Description"
                  />
                </TableCell>

                {/* Priority Dropdown */}
                {/* Added by Gauri to select priority on 18 Mar 2025 */}
                <TableCell>
                  <Dropdown
                    placeholder="Select Priority"
                    // selectedKey={selectedValues[index]?.priority || item.prioritizationRating}
                    selectedKey={selectedValues[index]?.priority || ""}
                    options={priorities.map((p) => ({
                      key: p.id.toString(),
                      text: p.name
                    }))}
                    onChange={(e, option) => handleDropdownChange(index, "priority", option?.key)}
                    styles={{ root: { minWidth: 200 } }}
                  />
                </TableCell>

                {/* Assigned To Dropdown */}
                <TableCell>
                  <Dropdown
                    placeholder="Select Assigned To"
                    selectedKey={selectedValues[index]?.assignedTo || item.approver}
                    options={responsibilities.map((r) => ({
                      key: r.id.toString(),
                      text: r.name
                    }))}
                    onChange={(e, option) => handleDropdownChange(index, "assignedTo", option?.key)}
                    styles={{ root: { minWidth: 200 } }}
                  />
                </TableCell>

                {/* Due Date DatePicker */}
                <TableCell>
                  {/* Commented and Added by Gauri to bind DueDate on 18 Mar 2025 */}
                  {/* <DatePicker
                    value={
                      selectedValues[index]?.dueDate &&
                      selectedValues[index]?.dueDate instanceof Date &&
                      !isNaN(selectedValues[index]?.dueDate)
                        ? selectedValues[index]?.dueDate
                        : item.responseDate &&
                          item.responseDate instanceof Date &&
                          !isNaN(item.responseDate)
                        ? item.responseDate
                        : null // Do not prefill if invalid or null
                    }
                    onSelectDate={(date) =>
                      setSelectedValues((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], dueDate: date }
                      }))
                    }
                    placeholder="Select Due Date"
                    formatDate={(date) => {
                      // Format only if date is valid
                      const validDate = date instanceof Date && !isNaN(date);
                      return validDate ? date.toLocaleDateString("en-GB") : "";
                    }}
                  /> */}
                  <DatePicker
                    value={
                      selectedValues[index]?.dueDate instanceof Date && !isNaN(selectedValues[index]?.dueDate)
                        ? selectedValues[index]?.dueDate
                        : item.responseDate
                        ? new Date(item.responseDate) // Convert string to Date
                        : null
                    }
                    onSelectDate={(date) =>
                      setSelectedValues((prev) => ({
                        ...prev,
                        [index]: { ...prev[index], dueDate: date }
                      }))
                    }
                    placeholder="Select Due Date"
                    formatDate={(date) => (date instanceof Date && !isNaN(date) ? date.toDateString() : "")} // Format as "Wed Jan 01 2025"
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 2 }}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
          <ArrowBackIcon />
        </IconButton>
        <Typography>Page {currentPage}</Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(selectedItems.length / itemsPerPage)}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </div>
  );
};

export default ActionItemTable;
