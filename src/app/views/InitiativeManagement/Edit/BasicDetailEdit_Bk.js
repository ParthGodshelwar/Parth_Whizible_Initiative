import React, { useState, useEffect } from "react";
import { DefaultButton, PrimaryButton, IconButton } from "@fluentui/react/lib/Button";
import moment from "moment";
import { Modal } from "@fluentui/react/lib/Modal";
import { getTheme, mergeStyleSets, mergeStyles } from "@fluentui/react/lib/Styling";
import "bootstrap/dist/css/bootstrap.min.css";
import currentstage from "../../../../assets/img/currentstage.svg";
import useSubmitAction from "../../../hooks/Editpage/useSubmitAction";
import axios from "axios";
import { toast } from "react-toastify";
import { Stack, Image, TextField, Dropdown, DatePicker } from "@fluentui/react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InitiativeDetailsModal from "app/views/InitiativeManagement/InitiativeDetailsModal";
import { ImageFit } from "@fluentui/react/lib/Image";
import PrioritizationCheckList from "./PrioritizationCheckList";
import WorkflowInfo from "./WorkflowInfo";
import ActionItems from "./ActionItem";
import { Tooltip } from "@mui/material";
import "./basicDetailEdit.css";
import CloseIcon from "@mui/icons-material/Close";
import WorkflowDrawer from "./WorkflowDrawer";
import InitiativeHistoryDrawer12 from "./InitiativeHistoryDrawer12";
const theme = getTheme();

const profilePictureContainerStyles = mergeStyles({
  position: "relative",
  display: "inline-block"
});

const editIconStyles = mergeStyles({
  position: "absolute",
  bottom: 0,
  right: 0,
  // backgroundColor: "#ffffff",
  borderRadius: "50%",
  cursor: "pointer",
  padding: 5,
  fontSize: 24,
  color: "#000000",
  zIndex: 10
});

const buttonGroupStyles = mergeStyles({
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 10
});

const profilePictureStyles = mergeStyles({
  borderRadius: "50%",
  width: 72,
  height: 72,
  objectFit: "cover",
  border: "2px solid #e1dfdd"
});

const fieldContainerStyles = mergeStyles({
  display: "flex",
  alignItems: "flex-start",
  gap: 20
});

const fieldGroupStyles = mergeStyles({
  flexBasis: "48%"
});
const classNames = mergeStyleSets({
  modalWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)" // backdrop effect
  },
  modal: {
    width: "40vw",
    maxHeight: "80vh",
    backgroundColor: theme.palette.white, // Ensure modal has a white background
    padding: theme.spacing.m,
    borderRadius: theme.effects.roundedCorner2,
    boxShadow: theme.effects.elevation16,
    overflowY: "auto",
    position: "relative" // For the close button
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing.s1} ${theme.spacing.m}`,
    borderBottom: `1px solid ${theme.palette.neutralLight}`
  },
  body: {
    padding: theme.spacing.m
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: `${theme.spacing.s1} ${theme.spacing.m}`,
    borderTop: `1px solid ${theme.palette.neutralLight}`
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.s1,
    top: theme.spacing.s1
  }
});

function BasicDetailEdit({
  initiativesID,
  image,
  initiativeLinkAccess,
  initiativeDetail = {},
  handleFieldChange,
  handleGoBack,
  setRefresh1,
  refresh,
  prioritizationCheckList,
  initiativeActioItems
}) {
  console.log("initiativesID", initiativesID);
  const [formDataState, setFormDataState] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const { submitAction, loading1 } = useSubmitAction();
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  // Assuming these are fetched from somewhere, hardcoded for now:
  const ideaID = initiativesID;
  let pimage = "";
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const userID = userdata?.employeeId;
  const [aopen, setAOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [initiativeWorkFlow, setInitiativeWorkFlow] = useState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInitiativeId, setSelectedInitiativeId] = useState(null);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  useEffect(() => {
    if (initiativeDetail?.data?.listInitiativeDetailEntity) {
      console.log("RequestStageID888888888", initiativeDetail?.data?.listInitiativeDetailEntity);
      initiativeDetail.data.listInitiativeDetailEntity.forEach((item) => {
        if (item.fieldName === "RequestStageID") {
          // Store the controlValue in sessionStorage if the fieldName is "RequestStageID"
          sessionStorage.setItem("RequestStageID", item.controlValue);
        }
      });
      const initialData = {};
      initiativeDetail.data.listInitiativeDetailEntity.forEach((field) => {
        if (field.applicable === 1) {
          // Ignore fields where isEditable is 1
          initialData[field.fieldName] = field.controlValue || "";
        }
      });
      setFormDataState(initialData);
    } else {
      console.log("Initiative detail data is missing or incorrect");
    }
  }, [initiativeDetail]);

  const openModal = (action) => {
    setModalTitle(action); // Set the modal title as the action (Submit, Approve, Reject)
    setIsModalOpen(true);
  };
  const openModal1 = (action) => {
    setModalTitle(action); // Set the modal title as the action (Submit, Approve, Reject)
    handleSubmitAction();
  };
  const handleOpenDetailsModal = () => {
    setOpenDetailsModal(true);
  };

  const handleClose = () => {
    setOpenDetailsModal(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setComments("");
  };
  const monthToNumber = (month) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };
    return months[month] || "00"; // Return '00' if month is not found
  };

  const getValidDate = (field, formDataState) => {
    if (formDataState[field.actualFieldName]) {
      const parsedStoredDate = new Date(formDataState[field.actualFieldName]);
      if (!isNaN(parsedStoredDate)) return parsedStoredDate;
    }

    const parsedControlDate = parseDate(field.controlValue);
    return isValidDate(parsedControlDate) ? parsedControlDate : null;
  };

  // Function to safely parse dates
  const parseDate = (dateString) => {
    if (!dateString) return null;

    const formattedString = dateString.replace(/\s+/g, " ").trim();
    let parsedDate = new Date(formattedString);

    if (!isNaN(parsedDate)) return parsedDate;

    // Handle specific format: "Feb 19 2025 6:30PM"
    const match = formattedString.match(/([A-Za-z]+) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2})(AM|PM)/);
    if (match) {
      const [_, month, day, year, hours, minutes, period] = match;
      const months = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11
      };
      let hour = parseInt(hours, 10);
      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      parsedDate = new Date(year, months[month], day, hour, minutes);
    }

    return isValidDate(parsedDate) ? parsedDate : null;
  };

  // Validate parsed date
  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  const handleSave = async (linkName) => {
    if (linkName === "Save") {
      const missingFields = [];
      console.log("mandatory", initiativeDetail?.data?.listInitiativeDetailEntity);
      // Loop through the form fields and check for empty mandatory fields
      for (const field of initiativeDetail?.data?.listInitiativeDetailEntity || []) {
        if (field.mandatory === 1) {
          const fieldValue = formDataState[field.fieldName];
          if (!fieldValue || fieldValue.trim() === "") {
            missingFields.push(field.label); // Add the missing field label to the array
          }
        }
      }

      // If there are missing fields, show a toast and exit the function
      if (missingFields.length > 0) {
        toast.error(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`);
        return; // Exit the function without saving
      }
    }
    const plannedStart = new Date(formDataState["PlannedExecutionStartDate"]);
    const plannedEnd = new Date(formDataState["PlannedExecutionEndDate"]);

    // Validation: Ensure plannedEnd is greater than plannedStart
    if (plannedStart >= plannedEnd) {
      toast.error("The 'Planned High Level Start Date' should not be greater than 'End Date'.");
      return;
    }
    console.log("formDataToSave", formDataState);
    const formDataToSave = {
      ideaID: initiativesID,
      title: formDataState["Initiative Title"],
      description: formDataState["Initiative Description"],
      businessUnitID: formDataState["BusinessUnitID"]
        ? parseInt(formDataState["BusinessUnitID"])
        : 0,
      organizationUnit: formDataState["OrganizationUnit"]
        ? parseInt(formDataState["OrganizationUnit"])
        : 0
        ? parseInt(formDataState["Organization Unit"])
        : 0,
      deliveryUnit: formDataState["Delivery Unit"] ? parseInt(formDataState["Delivery Unit"]) : 0,
      deliveryTeam: formDataState["Delivery Team"] ? parseInt(formDataState["Delivery Team"]) : 0,
      bgRepresentatives: formDataState["BG Representatives"],
      resourceEffort: formDataState["Resource Effort"]
        ? parseFloat(formDataState["Resource Effort"])
        : 0,
      priorityID: formDataState["Priority"] ? parseInt(formDataState["Priority"]) : 0,
      requestTypeID: formDataState["Initiative Type"]
        ? parseInt(formDataState["Initiative Type"])
        : 0,
      frequency: formDataState["Frequency"],
      productLineId: formDataState["Product Line ID"]
        ? parseInt(formDataState["Product Line ID"])
        : 0,
      productID: formDataState["Product ID"] ? parseInt(formDataState["Product ID"]) : 0,
      expectedStartDate: formDataState["ExpectedEndDate"],
      expectedEndDate: formDataState["ExpectedStartDate"],
      initiationDate: new Date().toISOString(),
      originalRequester: formDataState["Original Requester"]
        ? parseInt(formDataState["Original Requester"])
        : 0,
      objectives: formDataState["Objectives"],
      conceptualizationStartDate: new Date().toISOString(),
      conceptualizationEndDate: new Date().toISOString(),
      conceptualizationComment: formDataState["Conceptualization Comment"],
      plannedSolutioningStartdate: formDataState["PlannedSolutioningStartDate"],
      plannedSolutioningEndDate: formDataState["PlannedSolutioningEndDate"],
      solutioningComment: formDataState["SolutioningComment"],
      plannedExecutionStartDate: formDataState["PlannedExecutionStartDate"],
      plannedExecutionEndDate: formDataState["PlannedExecutionEndDate"],
      executionComment: formDataState["ExecutionComment"],
      plannedAcceptanceStartDate: formDataState["PlannedAcceptanceStartDate"],
      plannedAcceptanceEndDate: formDataState["PlannedAcceptanceEndDate"],
      acceptanceComment: formDataState["AcceptanceComment"],
      plannedHandoverStartDate: formDataState["PlannedHandoverStartDate"],
      plannedHandoverEndDate: formDataState["PlannedHandoverEndDate"],
      handoverComment: formDataState["HandoverComment"],
      systemAffected: formDataState["SystemAffected"],
      customFieldText1: formDataState["CustomFieldText1"],
      customFieldText2: formDataState["CustomFieldText2"],
      customFieldText3: formDataState["CustomFieldText3"],
      customFieldText4: formDataState["CustomFieldText4"],
      customFieldText5: formDataState["CustomFieldText5"],
      customFieldDate1: formDataState["CustomFieldDate1"],
      customFieldDate2: formDataState["CustomFieldDate2"],
      customFieldDate3: formDataState["CustomFieldDate3"],
      customTextArea1: formDataState["CustomTextArea1"],
      customTextArea2: formDataState["CustomTextArea2"],
      customTextArea3: formDataState["CustomTextArea3"],
      customFieldNumeric1: formDataState["CustomFieldNumeric1"]
        ? parseFloat(formDataState["CustomFieldNumeric1"])
        : 0,
      customFieldNumeric2: formDataState["CustomFieldNumeric2"]
        ? parseFloat(formDataState["CustomFieldNumeric2"])
        : 0,
      customFieldNumeric3: formDataState["CustomFieldNumeric3"]
        ? parseFloat(formDataState["CustomFieldNumeric3"])
        : 0,
      customFieldNumeric4: formDataState["CustomFieldNumeric4"]
        ? parseFloat(formDataState["CustomFieldNumeric4"])
        : 0,
      customFieldNumeric5: formDataState["CustomFieldNumeric5"]
        ? parseFloat(formDataState["CustomFieldNumeric5"])
        : 0,
      customFieldDate4: formDataState["CustomFieldDate4"],
      customFieldDate5: formDataState["CustomFieldDate5"],
      modifiedBy: employeeId,
      modifiedDate: new Date().toISOString()
    };

    const accessToken = sessionStorage.getItem("access_token");
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAddNew/UpdInitiativeDetails`;

    try {
      const response = await axios.put(url, formDataToSave, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        toast.success("Data saved successfully!");
      } else {
        toast.error("Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving data.");
    }
  };

  const MAX_IMAGE_SIZE = 10 * 1024; // 10 KB in bytes
  const renderFormElements = () => {
    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png"];
      const MAX_IMAGE_SIZE = 10 * 1024; // 10 KB

      if (!file) {
        alert("No file selected. Please choose an image.");
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG and PNG files are allowed. Please upload a valid image.");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        alert("File size exceeds 10 KB. Please upload a smaller image.");
        return;
      }
      console.log("allowed", allowedTypes.includes(file.type));
      const formData = new FormData();
      formData.append("formFile", file, file.name); // Append file with key 'formFile'

      const iniID = initiativesID; // Replace with dynamic IniID
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/FileUpDown/IniIconUpload?IniID=${iniID}&EmpID=${employeeId}`;
      const accessToken = sessionStorage.getItem("access_token");

      try {
        const response = await axios.put(url, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        });

        console.log("setRefresh", response.status);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          setFormDataState({
            ...formDataState,
            profileImage: base64Image
          });
        };
        reader.readAsDataURL(file);

        setTimeout(() => {
          setRefresh1(!refresh);
        }, 2000);

        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image. Please try again.");
      }
    };

    if (initiativeDetail) {
      const fields = Array.isArray(initiativeDetail?.data?.listInitiativeDetailEntity)
        ? [...initiativeDetail?.data?.listInitiativeDetailEntity]
        : [];

      const applicableFields = fields.filter((field) => field.applicable === 1);
      const groupedFields = applicableFields.reduce((acc, field) => {
        if (!acc[field.pageRoWNo]) {
          acc[field.pageRoWNo] = [];
        }
        acc[field.pageRoWNo].push(field);
        return acc;
      }, {});

      Object.keys(groupedFields).forEach((rowNo) => {
        groupedFields[rowNo].sort((a, b) => a.pageOrderNo - b.pageOrderNo);
      });

      const sortedRows = Object.keys(groupedFields).sort((a, b) => a - b);
      const isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
      };

      return (
        <>
          {/* Render the rest of the form */}
          {sortedRows.map((rowNo) => (
            <div className="row" key={rowNo}>
              {groupedFields[rowNo].map((field, index) => {
                if (field.id == -1) {
                  console.log("field12222", field);
                  pimage = field.controlValue;
                }
                console.log("field.controlValue", field); // Debugging line
                const isRequired = field.mandatory === 1; // This should only return true if mandatory is 1
                const isEditable = field.isEditable === 1;
                const options = field.initiativeDetailDropDownEntity.map((item) => ({
                  key: item.id,
                  text: item.name
                }));

                // Render the image and TextField on the same line for pageRoWNo: 1 and pageOrderNo: 1
                if (field.pageRoWNo === 1 && field.pageOrderNo === 1) {
                  console.log("field1111", field);
                  return (
                    <div key={index} className="col-md-12 d-flex align-items-center mt-2">
                      <div className={profilePictureContainerStyles}>
                        <Image
                          src={pimage || "https://via.placeholder.com/72"}
                          alt="Profile Picture"
                          className={profilePictureStyles}
                          imageFit={ImageFit.cover}
                          width={72}
                          height={72}
                        />
                        <Tooltip title="Upload Image">
                          <EditOutlinedIcon
                            className={editIconStyles}
                            onClick={() => document.getElementById("uploadImage").click()}
                          />
                        </Tooltip>
                        <input
                          type="file"
                          id="uploadImage"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                      <TextField
                        label={<>{field.label}</>}
                        // placeholder={field.controlValue || ""}
                        className="ml-4"
                        // value={formDataState[field.actualFieldName] || ""} // Use actualFieldName
                        //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder start here
                        placeholder={field.placeholder || ""} // Use a separate placeholder if needed
                        value={
                          formDataState[field.actualFieldName] !== undefined
                            ? formDataState[field.actualFieldName]
                            : field.controlValue || ""
                        } // Ensure controlValue is shown when no user input is available
                        //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder end here
                        onChange={(ev, newValue) => {
                          setFormDataState({
                            ...formDataState,
                            [field.actualFieldName]: newValue // Use actualFieldName
                          });
                          handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                        }}
                        // required={isRequired}
                        disabled={!isEditable}
                        style={{
                          marginLeft: "20px",
                          flex: 1,
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)" // Set default border color
                          },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.5)" // Set hover border color
                          },
                          "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.87)" // Set focused border color
                          }
                        }}
                        InputProps={{
                          style: {
                            borderColor: "rgba(0, 0, 0, 0.23)" // Set default border color for InputProps
                          },
                          classes: {
                            notchedOutline: "Custom-notched-outline" // Optional: Add a custom class if needed
                          }
                        }} // Adjust margin and flex properties
                      />
                    </div>
                  );
                }
                const isRequired1 = field.mandatory === 1;
                console.log("isRequired1", field.actualFieldName, isRequired1); // Use actualFieldName
                // Handle other field render logic
                switch (field.controlType) {
                  case "Text Box":
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <TextField
                          // Commented By Madhuri.K on 06-Feb-2025
                          label={<>{field.label}</>}
                          // placeholder={field.controlValue || ""}
                          // value={formDataState[field.actualFieldName] || ""} // Use actualFieldName

                          //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder start here
                          placeholder={field.placeholder || ""} // Use a separate placeholder if needed
                          value={
                            formDataState[field.actualFieldName] !== undefined
                              ? formDataState[field.actualFieldName]
                              : field.controlValue || ""
                          } // Ensure controlValue is shown when no user input is available
                          //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder end here
                          onChange={(ev, newValue) => {
                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: newValue // Use actualFieldName
                            });
                            handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                          }}
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          sx={{
                            marginLeft: "20px",
                            flex: 1,
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.23)"
                            },
                            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(0, 0, 0, 0.5)"
                            },
                            "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "rgba(0, 0, 0, 0.87)"
                              },
                            "& .MuiInputLabel-root": {
                              color: "black !important"
                            },
                            "& .Mui-disabled .MuiInputLabel-root": {
                              color: "black !important"
                            }
                          }}
                        />
                      </div>
                    );

                  case "Combo Box":
                    const defaultOption = {
                      key: null,
                      text: `Select ${field.label}`
                    };

                    const dropdownOptions = [
                      defaultOption,
                      ...field.initiativeDetailDropDownEntity.map((option) => ({
                        key: option.id,
                        text: option.name
                      }))
                    ];

                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <Dropdown
                          label={<>{field.label}</>}
                          placeholder={`Select ${field.label}`} // Placeholder text for the dropdown
                          options={dropdownOptions}
                          selectedKey={formDataState[field.actualFieldName] ?? null} // Use actualFieldName
                          onChange={(ev, item) => {
                            const value = item ? item.key : null;
                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: value // Use actualFieldName
                            });
                            handleFieldChange(value, field.actualFieldName); // Use actualFieldName
                          }}
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          styles={{
                            label: {
                              color: !isEditable ? "black !important" : "" // Ensure label stays black even when disabled
                            }
                          }}
                        />
                      </div>
                    );
                  case "Date":
                    console.log("field.label", field.label, parseDate(field.controlValue));
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <DatePicker
                          label={<>{field.label}</>}
                          value={getValidDate(field, formDataState)} // Ensure only valid dates are passed
                          placeholder={getValidDate(field, formDataState) ? "" : "Select Date"}
                          onSelectDate={(date) => {
                            if (!date) return; // Prevent null values

                            // Convert to ISO format for consistency
                            const isoDate = date.toISOString();

                            // Update form state
                            setFormDataState((prevState) => ({
                              ...prevState,
                              [field.actualFieldName]: isoDate
                            }));

                            console.log("Selected Date:", isoDate);

                            // Trigger field change handler
                            handleFieldChange(isoDate, field.actualFieldName);
                          }}
                          isRequired={isRequired1}
                          disabled={!isEditable}
                          styles={{
                            label: {
                              color: !isEditable ? "black !important" : ""
                            }
                          }}
                        />
                      </div>
                    );

                  case "Text Area":
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <TextField
                          label={<>{field.label}</>}
                          // placeholder={field.controlValue || ""}
                          // value={formDataState[field.actualFieldName] || ""} // Use actualFieldName
                          //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder start here
                          placeholder={field.placeholder || ""} // Use a separate placeholder if needed
                          value={
                            formDataState[field.actualFieldName] !== undefined
                              ? formDataState[field.actualFieldName]
                              : field.controlValue || ""
                          } // Ensure controlValue is shown when no user input is available
                          //  Added By Madhuri.K On 06-Feb-2025 for value is showing as placeholder end here
                          onChange={(ev, newValue) => {
                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: newValue // Use actualFieldName
                            });
                            handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                          }}
                          multiline
                          autoAdjustHeight
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          InputLabelProps={{
                            style: {
                              color: !isEditable ? "black !important" : "" // Ensure label stays black even when disabled
                            }
                          }}
                        />
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          ))}
        </>
      );
    }
  };
  const handleWithdrawInitiative = async () => {
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/WithDrawInitiative?UserID=${userID}&IdeaID=${ideaID}`;

    try {
      const result = await axios.put(
        url,
        {}, // Empty request body (if no data is being sent)
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      // Check the API response
      if (result.data && result.data.data && result.data.data.length > 0) {
        const responseResult = result.data.data[0].result;

        // Case-sensitive check for "success"
        if (responseResult === "Success") {
          toast.success("Initiative Withdrawn successfully!", {
            position: "top-right",
            autoClose: 3000 // Close after 3 seconds
          });
          setRefresh1(!refresh);
        } else {
          // Show the result message in an error toast
          toast.error(responseResult);
        }
      } else {
        // Handle unexpected response format
        toast.error("Unexpected response from the server.");
      }

      console.log("API Response:", result.data);
    } catch (err) {
      // Show error toast for network or server errors
      toast.error("Failed to withdraw initiative. Please try again.");
      console.error("Error withdrawing initiative:", err);
    }
  };
  const handleSubmitAction = async () => {
    setLoading(true);

    let action = modalTitle;
    if (action === "Push Back") {
      action = "Reject";
    }

    const accessToken = sessionStorage.getItem("access_token");
    let url = "";

    switch (action) {
      case "Submit":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateSubmit?IdeaID=${ideaID}`;
        break;
      case "Approve":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateApprove?IdeaID=${ideaID}&UserID=${userID}`;
        break;
      case "Reject":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateReject?IdeaID=${ideaID}&UserID=${userID}`;
        break;

      default:
        console.log("Unknown action:", action);
        setLoading(false);
        return; // Exit if the action is unknown
    }

    try {
      if (action === "Approve") {
        const missingFields = [];

        // Loop through the form fields and check for empty mandatory fields
        for (const field of initiativeDetail?.data?.listInitiativeDetailEntity || []) {
          if (field.mandatory === 1 && field.isEditable === 1) {
            console.log("mandatory", field);
            const fieldValue = formDataState[field.fieldName];
            if (!fieldValue || fieldValue.trim() === "") {
              missingFields.push(field.label); // Add the missing field label to the array
            }
          }
        }

        // If there are missing fields, show a toast and exit the function
        if (missingFields.length > 0) {
          toast.error(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`);
          return; // Exit the function without saving
        }
      }
      // Make the API call
      const response = await axios.get(
        url,
        { comments },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      const result = response?.data?.data?.[0]?.result;

      if (result === "Success") {
        setIsModalOpen(true); // Open the modal
      } else {
        toast(result, { type: "error" }); // Show the result message in a toast
      }
    } catch (error) {
      // Show error toast
      const errorMessage =
        error.response?.data?.message || "An error occurred while submitting the action.";
      toast.error(errorMessage); // Show error toast with message from API
      console.error("Error while submitting the action:", error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };
  const handleSubmitAction1 = async () => {
    setLoading(true);

    let action = modalTitle;
    if (action === "Push Back") {
      action = "Reject";
    }

    const accessToken = sessionStorage.getItem("access_token");
    let url = "";

    switch (action) {
      case "Submit":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateSubmit?IdeaID=${ideaID}`;
        break;
      case "Approve":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateApprove?IdeaID=${ideaID}&UserID=${userID}`;
        break;
      case "Reject":
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/ValidateReject?IdeaID=${ideaID}&UserID=${userID}`;
        break;

      default:
        console.log("Unknown action:", action);
        setLoading(false);
        return; // Exit if the action is unknown
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/WorkflowActions?IdeaID=${ideaID}&Action=${action}&UserID=${userID}&Comments=${comments}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      toast.success(`${modalTitle} action completed successfully!`); // Show success toast

      closeModal(); // Close the modal on successful submission
      setRefresh1(!refresh);
      // handleGoBack();
    } catch (error) {
      // Show error toast
      const errorMessage =
        error.response?.data?.message || "An error occurred while submitting the action.";
      toast.error(errorMessage); // Show error toast with message from API
      console.error("Error while submitting the action:", error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };
  const renderDynamicButtons = () => {
    const buttonTexts = (initiativeLinkAccess?.data?.listInitiativeLinkAccessEntity || [])
      .filter((button) => button.display === 1) // Exclude "Manage Workflow"
      .map((button, index) => (
        <span
          key={index}
          onClick={() => handleButtonClick(button.linkName)}
          style={{
            cursor: "pointer",
            marginRight:
              index < initiativeLinkAccess.data.listInitiativeLinkAccessEntity.length - 1
                ? "8px"
                : "0"
          }}
        >
          {button.linkName}
        </span>
      ));

    if (buttonTexts.length === 0) {
      return null;
    }

    return (
      <div style={{ textAlign: "right" }}>
        <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
          <Tooltip title="Current Stage" arrow>
            <Image
              src={currentstage}
              alt="Dynamic Image"
              width={25}
              height={25}
              styles={{ root: { marginRight: 8 } }}
              onClick={handleOpenDetailsModal}
            />
          </Tooltip>
          {buttonTexts.reduce((prev, curr) => [prev, " | ", curr], [])}
        </Stack>
      </div>
    );
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleButtonClick = (linkName) => {
    console.log("handleButtonClick", linkName);
    switch (linkName) {
      case "Save":
      case "Save As Draft":
        handleSave(linkName);
        break;
      case "Withdraw Initiative":
        handleWithdrawInitiative();
        break;
      case "Submit":
      case "Approve":
      case "Push Back":
      case "Withdraw Initiative": // Added Reject option
        openModal1(linkName); // Open the modal with the respective action
        break;
      case "Show History": // Added Reject option
        console.log("Show History");
        handleOpenDrawer(initiativesID); // Open the modal with the respective action
        break;
      case "Back":
        handleGoBack();
      case "Workflow Information":
        handleDrawerOpen();
        break;
      case "Prioritization CheckList":
        setOpen(true);
        break;
      case "Manage Workflow":
        setOpen1(true);
        break;
      default:
        console.log("Unknown action:", linkName);
        break;
    }
  };
  console.log("Prioritization CheckList", prioritizationCheckList);
  return (
    <div className="container-fluid mt-3">
      <div className="d-flex justify-content-end">{renderDynamicButtons()}</div>
      <form>
        <div>{renderFormElements()}</div>
      </form>
      {isModalOpen && (
        <div className={classNames.modalWrapper}>
          <div className={classNames.modal}>
            <div
              className={classNames.header}
              style={{
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 1rem"
              }}
            >
              <h6>{modalTitle}</h6>

              <IconButton
                onClick={closeModal}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  border: "none",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <Tooltip title="Close">
                  <CloseIcon />
                </Tooltip>
              </IconButton>
            </div>
            <div className={classNames.body}>
              <TextField
                label={`Comments for ${modalTitle}`}
                multiline
                rows={4}
                value={comments}
                onChange={(ev, newValue) => setComments(newValue)}
              />
            </div>
            <div className={classNames.footer}>
              <PrimaryButton onClick={handleSubmitAction1} disabled={loading}>
                {loading ? "Submitting..." : modalTitle}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {openDetailsModal && (
        <InitiativeDetailsModal
          open={openDetailsModal}
          handleClose={handleClose}
          initiativesID={initiativesID}
        />
      )}
      <PrioritizationCheckList
        prioritizationCheckList={prioritizationCheckList}
        open={open}
        setOpen={setOpen}
        setRefresh1={setRefresh1}
        refresh={refresh}
      />
      <InitiativeHistoryDrawer12
        initiativeId={initiativesID}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
      <WorkflowDrawer initiativesID={initiativesID} open={open1} setOpen={setOpen1} />
      <ActionItems initiativeActioItems={initiativeActioItems} open={aopen} setOpen={setAOpen} />
      <WorkflowInfo open={drawerOpen} onClose={handleDrawerClose} initiativesID={initiativesID} />
    </div>
  );
}

export default BasicDetailEdit;
