import React, { useState, useEffect } from "react";
import {
  IconButton,
  Drawer,
  Tabs,
  Tab,
  Box,
  Button,
  MenuItem,
  Typography,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper
} from "@mui/material";
import { Stack, PrimaryButton, Dropdown, Pivot, PivotItem, TextField } from "@fluentui/react";
import axios from "axios";
import RiskOccurrenceDetails from "./RiskOccurrenceDetails";
import RiskMitigation from "./RiskMitigation";
import EarlyWarnings from "./EarlyWarnings";
import ContingencyPlanModal from "./ContingencyPlanModal";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { dataGridCellClassNames } from "@fluentui/react-components";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import GetInitiativeDocumentList from "app/hooks/Editpage/GetInitiativeDocumentList";
import DocumentsComponentA from "./DocumentsComponentA";
import Tooltip from "@mui/material/Tooltip";
import { DatePicker, DayOfWeek } from "@fluentui/react";

const DropZone = styled(Box)({
  border: "2px dashed #ccc",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  color: "#666",
  borderRadius: "4px",
  marginBottom: "20px"
});
const ActionDrawer = ({ initiativesID, data, open, onClose, setRefetch, refetch, acc }) => {
  const [selectedKey, setSelectedKey] = useState("details");
  const [priorityOptions, SetPriorityOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [changePriorities, setChangePriorities] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [personResponsibleOptions, setPersonResponsibleOptions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [access, setAccess] = useState([]);
  const [contingencyPlanData, setContingencyPlanData] = useState([]);
  const [drawerData, setDrawerData] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentList, setDocumentList] = useState([]); // state for documents
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [attach, setAttach] = useState(false); // state for upload drawer
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [documentCategories, setDocumentCategories] = useState([]);
  const [url, setUrl] = useState("");
  console.log("first1111", data);
  const employeeId = userdata?.employeeId;
  //Added By durgesh dalvi to store prior assignTo data so that suring updation if assign to value changes the
  // mail can be sent
  const [earlierAssignedTo, setEarlierAssignedTo] = useState();

  const [refresh, setRefresh] = useState(false);
  const [stageOptions, SetStageOptions] = useState([]);
  const [formValues, setFormValues] = useState({
    submitterLoginType: "",
    initiativeID: "",
    initiativeTitle: "",
    stage: "",
    actionItem: "",
    submittedOn: "",
    dueDate: "",
    assignedTo: "",
    submitterID: "",
    priorityID: "",
    statusID: "2",
    actualDueDate: "",
    description: ""
  });

  useEffect(() => {
    const fetchAuditDetails = async () => {
      // Check if auditID and actionID are available
      // if (!data?.actionID) {
      //   console.warn("AuditID or ActionID is missing. Skipping API call.", data);
      //   return;
      // }

      console.log("GetExternalAuditActionitemsDetail API Called");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeActioItemsDeatils?ActionItemID=${data?.actionID}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        const result = response?.data?.data?.initiativeActionItemsDetails[0];
        //added by durgesh dalvi
        setEarlierAssignedTo(result?.employeeId);
        //end of added by durgesh dalvi
        console.log("drawerData0000", result);
        setFormValues({
          submitterLoginType: result?.submitterLoginType,
          initiativeID: result?.initiativeID,
          actionID: result?.actionID || "",
          initiativeTitle: result?.initiativeTitle || "",
          stage: result?.requestStageID?.toString() || "",
          actionItem: result?.actionItem || "",
          submittedOn: result?.actionDate || "",
          dueDate: result?.expectedEndDate || "",
          assignedTo: result?.employeeId || "",
          submitterID: result?.submitterID || "",
          priorityID: result?.priorityID?.toString() || "",
          statusID: result?.statusID?.toString() || "2",
          actualDueDate: result?.actualEndDate || "",
          description: result?.description || ""
        });
      } catch (error) {
        console.error("Error fetching audit details:", error);
      }
    };
    if (data?.actionID) fetchAuditDetails();
  }, [data]);

  const handleDownload = (filePath) => {
    // Handle document download logic
    console.log("Downloading", filePath);
  };
  const handleAccessTimeClick = (doc) => {
    // Handle document access time logic
    console.log("Accessing time for doc", doc);
  };
  useEffect(() => {
    const fetchDocumentCategories = async () => {
      const accessToken = sessionStorage.getItem("access_token");

      // Fetching document categories
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

      console.log("GetInitiativeDocumentList12", data?.initiativeID);
      // if (data?.initiativeID) {
      const document = await GetInitiativeDocumentList(data?.initiativeID, employeeId);
      setDocumentList(document || []);
      // }
    };

    fetchDocumentCategories();
  }, [open, refresh]);
  const handleDelete = async (id) => {
    // Handle document deletion logic
    console.log("Deleting document with ID", id);

    const accessToken = sessionStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/FileUpDown/IniDocDelete?DocumentID=${id}`,
        {
          method: "DELETE", // Use DELETE method
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Document deleted successfully:", data);
        // Optionally, update UI state or show a success message
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error during document deletion:", error);
    }
  };
  useEffect(() => {
    if (open) {
      fetchDropdownData();
      // fetchRiskDetails();
    }
  }, [data]);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setAttach(false);
  };
  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const fetchDropdownData = async () => {
    const fields = [
      "riskcategory",
      "assignedToOptions",
      "priorityid",
      "status",
      "wliststage",
      "personfieldnumeric1",
      "actionpriority"
    ];
    const ideaID = drawerData?.ideaID || initiativesID;
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
      const results = await Promise.all(fields?.map((field) => fetchData(field)));
      SetPriorityOptions(results[6] || []);
      setAssignedToOptions(results[1] || []);
      setChangePriorities(results[2] || []);
      setStatuses(results[3] || []);
      SetStageOptions(results[4] || []);
      setPersonResponsibleOptions(results[5] || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("Failed to fetch dropdown data.");
    }
  };

  // const fetchRiskDetails = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetInitiativeRisksDetails?RiskID=${data.riskID}&UserID=${userID}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
  //         }
  //       }
  //     );

  //     setAccess(response.data.data.listRiskSubtabAccessEntity);
  //     if (response.data.data && response.data.data.listInitiativeRiskDetail.length > 0) {
  //       setDrawerData(response.data.data.listInitiativeRiskDetail[0]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching risk details:", error);
  //     toast.error("Failed to fetch risk details.");
  //   }
  // };
  const uploadFileData = async () => {
    // Validate the URL before proceeding
    // if (!isValidUrl(url)) {
    //   console.error("Invalid URL:", url);
    //   return;
    // }

    // Construct the API URL
    const apiUrl = `${
      process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
    }/api/FileUpDown/IniAttachURL?Ideaid=${data?.initiativeID}&URL=${encodeURIComponent(
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
  const fetchGraph = async () => {
    if (!formValues?.riskID || !userID) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRiskAnalysisGraph?RiskID=${data.riskID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      console.log("graph", response.data.data);
    } catch (error) {
      console.error("Error fetching risk details:", error);
      toast.error("Failed to fetch risk details.");
    }
  };

  const handlePivotChange = (item) => {
    setSelectedKey(item.props.itemKey);
  };

  const close = () => {
    onClose();
    setFormValues({
      initiativeTitle: "",
      stage: "",
      actionItem: "",
      submittedOn: "",
      dueDate: "",
      assignedTo: "",
      submitterID: "",
      priorityID: "",
      statusID: "2",
      actualDueDate: "",
      description: ""
    });
  };
  const handleUploadClick = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const accessToken = sessionStorage.getItem("access_token");

    // if (!selectedFile || !category) {
    //   alert("Please fill out all fields and select a file.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("formFile", selectedFile, selectedFile.name);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/FileUpDown/IniDocUpload?IniID=${
          data?.initiativeID
        }&EmpID=${employeeId}&categoryid=${category}&Subcategoryid=${
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
        setRefresh(!refresh);
        toggleDrawer();
      } else {
        alert("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handleSave = async () => {
    console.log("here");
    console.log("drawerData0000", formValues);
    if (!formValues?.actionItem) {
      toast.error("ActionItem should not be left blank");
      return;
    }
    if (!formValues?.submittedOn) {
      toast.error("Submitted On should not be left blank");
      return;
    }
    if (!formValues?.dueDate) {
      toast.error("Due date should not be left blank");
      return;
    }
    if (!formValues?.assignedTo) {
      toast.error("Assigned To should not be left blank");
      return;
    }
    if (!formValues?.statusID) {
      toast.error("Status should not be left blank");
      return;
    }
    // Prepare the payload
    const dataToSave = {
      submitterLoginType: formValues?.submitterLoginType,
      initiativeID: formValues?.initiativeID,
      actionItemID: formValues?.actionID,
      actionItem: formValues?.actionItem,
      actionDate: new Date(formValues?.submittedOn || Date.now()).toISOString(),
      description: formValues?.description,
      employeeId: formValues?.assignedTo,
      expectedEndDate: new Date(formValues?.dueDate || Date.now()).toISOString(),
      priorityID: Number(formValues?.priorityID),
      statusID: Number(formValues?.statusID),
      requestStageID: Number(sessionStorage.getItem("RequestStageID")),
      initiativeID: formValues?.initiativeID || sessionStorage.getItem("ideaIdPk"),
      submitterID: userID,
      submitterLoginType: formValues?.submitterLoginType || "E"
    };

    // Determine the API endpoint and method
    const isUpdate = formValues?.actionID && formValues?.actionID > 0;
    console.log("isUpdate", isUpdate, formValues);
    const apiEndpoint = isUpdate
      ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeActioItemsDeatils`
      : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeActioItemsDeatils`;

    const method = isUpdate ? "PUT" : "POST";

    try {
      // Make the API request
      const response = await axios({
        method,
        url: apiEndpoint,
        data: dataToSave,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });

      // Check for success in the response
      //Modified by Durgesh Dalvi: added .listEmailResult to properly get the correct value and show toast
      const result = response?.data?.data?.listEmailResult?.[0]?.result;
      const listEmailResult = response?.data?.data?.listEmailResult?.[0];

      const fromEmailID = listEmailResult?.fromEmailID;
      const toEmailID = listEmailResult?.toEmailID;
      const ccEmailID = listEmailResult?.ccEmailID;
      const subject = listEmailResult?.subject;
      const body = listEmailResult?.body;

      if (response.status === 200 && result?.toLowerCase() === "success") {
        if (formValues?.assignedTo != earlierAssignedTo) {
          sendEmail(fromEmailID, toEmailID, ccEmailID, subject, body);
        } else if (method == "POST") {
          sendEmail(fromEmailID, toEmailID, ccEmailID, subject, body);
        }

        const successMessage = isUpdate
          ? "Action item updated successfully!"
          : "Action item saved successfully!";
        toast.success(successMessage); // Show success toast
        setRefetch(!refetch);
        // Close the drawer or reset the form
        onClose();
        setFormValues(null); // Reset form values
      } else {
        // Handle API error messages
        toast.error(result || "Failed to save the action item. Please try again.");
        onClose();
        setFormValues(null);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error saving action item:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while saving the action item."
      );
    }
  };

  //Added By Durgesh Dalvi : to send update after successfull updation when the assignTo value get change
  const sendEmail = async (fromEmailID, toEmailID, ccEmailID, subject, body) => {
    const apiEndPoint = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`;

    const mailData = {
      fromAddress: encodeURIComponent(fromEmailID),
      toAddress: encodeURIComponent(toEmailID),
      ccAddress: encodeURIComponent(ccEmailID),
      subject: encodeURIComponent(subject),
      body: encodeURIComponent(body),
      isHtml: 1
    };

    try {
      const response = await axios({
        method: "POST", // Use POST to send the data in the body
        url: apiEndPoint,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        },
        data: mailData // Send mailData in the body of the request
      });

      console.log("Email sent successfully:", response.data);
      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error.response?.data?.message || "An error occurred while sending the email.");
    }
  };
  // End Of Added By Durgesh Dalvi

  console.log("drawerData0000", formValues);
  return (
    <Drawer anchor="right" open={open} onClose={close}>
      <div className="drawer-content p-4" style={{ width: "70vw", padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            backgroundColor: "#f5f5f5", // Light grey background color
            padding: 2, // Optional padding for spacing
            borderRadius: 1 // Optional for rounded corners
          }}
        >
          <h5 className="drawer-title">Action Item Details</h5>
          <IconButton onClick={() => onClose()}>
            <Tooltip title="Close">
              <Close />
            </Tooltip>
          </IconButton>
        </Box>

        <Pivot onLinkClick={handlePivotChange} selectedKey={selectedKey}>
          <PivotItem headerText="Details" itemKey="details">
            <div>
              <Stack horizontal horizontalAlign="end" className="mt-4 mb-4">
                {acc[2]?.access !== 0 && (
                  <PrimaryButton text="Save" className="ms-2" onClick={handleSave} />
                )}
              </Stack>
              <form>
                <Stack tokens={{ childrenGap: 16 }} className="mt-4">
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    {formValues?.actionID && (
                      <Stack.Item grow>
                        <TextField
                          label="Initiative Title"
                          value={formValues?.initiativeTitle || ""}
                          onChange={(e, newValue) =>
                            setFormValues({ ...formValues, initiativeTitle: newValue })
                          }
                          styles={{ root: { minWidth: 200 } }}
                          disabled={true}
                        />
                      </Stack.Item>
                    )}
                    {formValues?.actionID && (
                      <Stack.Item grow>
                        <Dropdown
                          label="Stage"
                          placeholder="Select Stage"
                          defaultSelectedKey={formValues?.stage || ""}
                          options={stageOptions?.map((item) => ({
                            key: item.id,
                            text: item.name
                          }))}
                          onChange={(e, option) =>
                            setFormValues({ ...formValues, stage: option?.key })
                          }
                          styles={{ root: { minWidth: 200 } }}
                          disabled={true}
                        />
                      </Stack.Item>
                    )}
                    {formValues?.actionID && (
                      <Stack.Item grow>
                        <DatePicker
                          label="Actual End Date"
                          placeholder="Select a date"
                          disabled={true}
                          value={
                            formValues?.actualDueDate ? new Date(formValues.actualDueDate) : null
                          }
                          onSelectDate={(date) => {
                            if (date) {
                              // Adjust the date for time zone offset
                              const adjustedDate = new Date(
                                date.getTime() - date.getTimezoneOffset() * 60000
                              );
                              setFormValues({
                                ...formValues,
                                actualDueDate: adjustedDate.toISOString().split("T")[0] // Format as yyyy-MM-dd
                              });
                            } else {
                              setFormValues({
                                ...formValues,
                                actualDueDate: null
                              });
                            }
                          }}
                          styles={{ root: { minWidth: 200 } }}
                        />
                      </Stack.Item>
                    )}
                  </Stack>

                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <TextField
                        label={
                          <span>
                            Action Item <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={formValues?.actionItem || ""}
                        onChange={(e, newValue) =>
                          setFormValues({ ...formValues, actionItem: newValue })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <DatePicker
                        label={
                          <span>
                            Submitted On <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Select a date"
                        value={formValues?.submittedOn ? new Date(formValues.submittedOn) : null}
                        onSelectDate={(date) => {
                          if (date) {
                            // Adjust the date for time zone offset
                            const adjustedDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            setFormValues({
                              ...formValues,
                              submittedOn: adjustedDate.toISOString().split("T")[0] // Format as yyyy-MM-dd
                            });
                          } else {
                            setFormValues({
                              ...formValues,
                              submittedOn: null
                            });
                          }
                        }}
                        styles={{ root: { minWidth: 200 } }}
                        disabled={formValues?.actionID}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <DatePicker
                        label={
                          <span>
                            Due Date <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Select a date"
                        value={formValues?.dueDate ? new Date(formValues.dueDate) : null}
                        onSelectDate={(date) => {
                          if (date) {
                            // Adjust the date for time zone offset
                            const adjustedDate = new Date(
                              date.getTime() - date.getTimezoneOffset() * 60000
                            );
                            setFormValues({
                              ...formValues,
                              dueDate: adjustedDate.toISOString().split("T")[0] // Format as yyyy-MM-dd
                            });
                          } else {
                            setFormValues({
                              ...formValues,
                              dueDate: null
                            });
                          }
                        }}
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                  </Stack>

                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
                    <Stack.Item grow>
                      <Dropdown
                        label={
                          <span>
                            Assigned To <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Select Assigned Person"
                        defaultSelectedKey={
                          formValues?.assignedTo ? String(formValues.assignedTo) : undefined
                        }
                        options={assignedToOptions.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setFormValues({ ...formValues, assignedTo: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        label="Priority"
                        placeholder="Select Priority"
                        defaultSelectedKey={formValues?.priorityID}
                        options={priorityOptions?.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setFormValues({ ...formValues, priorityID: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                      />
                    </Stack.Item>
                    <Stack.Item grow>
                      <Dropdown
                        label={
                          <span>
                            Status <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Select Status"
                        defaultSelectedKey={formValues?.statusID}
                        options={statuses?.map((item) => ({
                          key: item.id,
                          text: item.name
                        }))}
                        onChange={(e, option) =>
                          setFormValues({ ...formValues, statusID: option?.key })
                        }
                        styles={{ root: { minWidth: 200 } }}
                        //disabled={!formValues?.actionID}
                        disabled={false}
                      />
                    </Stack.Item>
                  </Stack>
                  <Stack horizontal tokens={{ childrenGap: 16 }} wrap></Stack>
                  <Stack.Item grow>
                    <TextField
                      label="Description"
                      value={formValues?.description || ""}
                      onChange={(e, newValue) =>
                        setFormValues({ ...formValues, description: newValue })
                      }
                      multiline
                      rows={4}
                      styles={{
                        root: {
                          width: "100%",
                          maxWidth: 420
                        }
                      }}
                    />
                  </Stack.Item>
                </Stack>
              </form>
            </div>
          </PivotItem>
          {formValues?.actionID && (
            <PivotItem headerText="Document Upload" itemKey="upload">
              <DocumentsComponentA
                setRefresh={setRefresh}
                initiativeDocument={documentList}
                initiativesID={formValues?.ideaID || initiativesID}
                acc={acc}
              />
            </PivotItem>
          )}
        </Pivot>
      </div>
    </Drawer>
  );
};

export default ActionDrawer;
