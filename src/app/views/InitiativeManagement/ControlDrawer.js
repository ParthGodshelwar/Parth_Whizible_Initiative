import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  Tooltip,
  Box,
  Typography,
  // TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { DatePicker, DayOfWeek } from "@fluentui/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Added By Madhuri.K On 04-Feb-2025 for TextField import from FluentUI
import { Dropdown, TextField } from "@fluentui/react";
// const ControlDrawer = ({
//   open,
//   onClose,
//   selectedNOIID1,
//   NOIID,
//   ideaID,
//   setIdeaID,
//   setIsEditing,
//   isEditing,
//   setIsAdd,
//   isAdd,
//   natureOfInitiativeName, // Add this
// }) => {
const ControlDrawer = ({
  open,
  onClose,
  selectedNOIID1,
  NOIID,
  ideaID,
  setIdeaID,
  setIsEditing,
  isEditing,
  setIsAdd,
  isAdd,
  natureOfInitiativeName // Add this
}) => {
  const [controlData, setControlData] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const natureofDemandID = natureOfInitiativeName; // Use the passed prop directly
  const handleGoBack = () => {
    setIsAdd(!isAdd);
    onClose();
  };
  // Fetch data from API
  const fetchControlData = async () => {
    if (!NOIID) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAddNew/GetControlForAddNew?NOIID=${NOIID}&UserID=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const result = await response.json();
      const controls = result?.data?.listAddNewControls || [];

      // Sort by `pageRoWNo` and `pageOrderNo`
      const sortedControls = controls.sort(
        (a, b) => a.pageRoWNo - b.pageRoWNo || a.pageOrderNo - b.pageOrderNo
      );

      setControlData(controls);

      // Initialize form data state
      const initialData = {};
      sortedControls.forEach((field) => {
        initialData[field.actualFieldName] = field.controlType === "Date" ? null : "";
      });
      setFormData(initialData);
    } catch (error) {
      console.error("Error fetching control data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchControlData();
    }
  }, [open, NOIID]);

  // Modified function by Gauri to fix numeric fields issue on 20 Mar 2025
  const handleChange = (name, value) => {
    console.log(`Updating field: ${name} with value: ${value}`); // Debugging log

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      console.log("Updated formData:", updatedFormData); // Log to see if it's updating
      return updatedFormData;
    });
  };

  // Function to render label with red asterisk for mandatory fields
  const renderLabel = (label, isMandatory) => {
    return (
      <span>
        {label}
        {isMandatory && <span style={{ color: "red", marginLeft: "4px" }}>*</span>}
      </span>
    );
  };

  // Function to validate mandatory fields
  const validateMandatoryFields = () => {
    const mandatoryFields = controlData.filter(
      (field) => field.mandatory === 1 && field.isEditable === 1
    );

    for (const field of mandatoryFields) {
      if (!formData[field.actualFieldName]) {
        toast.error(`${field.label} cannot be left blank`);
        return false; // Stop further validation after the first error
      }
    }

    return true;
  };

  // Modified function by Gauri to fix numeric fields issue on 20 Mar 2025
  const handleAdd = async () => {
    // Check if title already exists
    const existingTitle = controlData.find(
      (item) => item.actualFieldName === "Title" && item.controlValue === formData.Title
    );

    if (existingTitle) {
      toast.error("Initiative Title already exists");
      return; // Stop further execution
    }
    if (!validateMandatoryFields()) {
      return; // Stop execution if mandatory fields are missing
    }

    // Added by Gauri to add validation for numeric fields on 20 Mar 2025
    // Step 1: Get Only Visible Fields
    const visibleFields = controlData
    .filter((field) => field.applicable === 1) // Only visible fields
    .map((field) => field.actualFieldName);

    // Step 2: Define Numeric Fields & Filter Only Visible Numeric Fields
    const numericFields = [
      "CustomFieldNumeric1",
      "CustomFieldNumeric2",
      "CustomFieldNumeric3",
      "CustomFieldNumeric4",
      "CustomFieldNumeric5"
    ];

    // Get only numeric fields that are visible
    // const visibleNumericFields = numericFields.filter((field) => visibleFields.includes(field));
    const visibleNumericFields = controlData
    .filter(
      (field) =>
        field.applicable === 1 && // Only visible fields
        numericFields.includes(field.actualFieldName) && // Only numeric fields
        field.controlType !== "Combo Box" // Exclude dropdowns
    )
    .map((field) => field.actualFieldName);
  
    console.log("Visible Numeric Fields (should NOT include Business Group):", visibleNumericFields);
  

    // Step 3: Validate Numeric Fields ONLY
    for (const fieldName of visibleNumericFields) {
      const fieldConfig = controlData.find((field) => field.actualFieldName === fieldName);
      if (!fieldConfig || fieldConfig.controlType === "Combo Box") {
        console.log(`Skipping '${fieldName}' because it's a dropdown.`);
        continue; // Skip dropdowns
      }
    
      const fieldValue = formData[fieldName];
    
      console.log(`Validating Numeric Field: ${fieldName}, Value:`, fieldValue);
    
      // if (!fieldValue || fieldValue.trim() === "") {
      //   toast.error(`'${fieldConfig.label}' should not be left blank.`);
      //   return;
      // }

      if (fieldConfig.mandatory === 1 && (!fieldValue || fieldValue.trim() === "")) {
        toast.error(`'${fieldConfig.label}' should not be left blank.`);
        return;
      }
    
      // Convert value to a number
      const numericValue = Number(fieldValue);
      if (isNaN(numericValue) || numericValue <= 0) {
        toast.error(`Please enter only numeric values for '${fieldConfig.label}'.`);
        return;
      }
    }
    

    // Convert form date values to Date objects
    const expectedStart = formData.ExpectedStartDate ? new Date(formData.ExpectedStartDate) : null;
    const expectedEnd = formData.ExpectedEndDate ? new Date(formData.ExpectedEndDate) : null;

    // **Identify Dynamic Labels for Expected Start/End Dates**
    const expectedStartLabel = controlData.find(field => field.actualFieldName === "ExpectedStartDate")?.label || "Expected Start Date";
    const expectedEndLabel = controlData.find(field => field.actualFieldName === "ExpectedEndDate")?.label || "Expected End Date";

    //  **Expected Start & End Date Validation (Dynamic Labels)**
    if (expectedStart && expectedEnd && expectedStart > expectedEnd) {
      if (expectedStartLabel.includes("Planned High Level")) {
        toast.error(`'${expectedStartLabel}' should not be greater than '${expectedEndLabel}'.`);
      } else if (expectedStartLabel.includes("Process")) {
        toast.error(`'${expectedStartLabel}' should not be greater than '${expectedEndLabel}'.`);
      } else {
        toast.error(`'${expectedStartLabel}' should not be greater than '${expectedEndLabel}'.`);
      }
      return;
    }
    console.log("requestBody111", formData);
    // Prepare the API request body
    const requestBody = {
      natureofDemandID: Number(NOIID),
      natureOfDemand_RevisionID: Number(selectedNOIID1),
      title: String(formData.Title || ""),
      description: String(formData.Description || ""),
      businessUnitID: Number(formData.BusinessUnitID) || 0,
      organizationUnit: Number(formData.OrganizationUnit) || 0,
      deliveryUnit: Number(formData.DeliveryUnit) || 0,
      deliveryTeam: Number(formData.DeliveryTeam) || 0,
      bgRepresentatives: String(formData.bgRepresentatives || ""),
      resourceEffort: Number(formData.ResourceEffort) || 0,
      priorityID: Number(formData.PriorityID) || 0,
      requestTypeID: Number(formData.RequestTypeID) || 0,
      frequency: String(formData.Frequency || ""),
      productLineId: Number(formData.ProductLineId) || 0,
      productID: Number(formData.ProductID) || 0,
      expectedStartDate: new Date(formData.ExpectedStartDate || new Date()).toISOString(),
      expectedEndDate: new Date(formData.ExpectedEndDate || new Date()).toISOString(),
      // initiationDate: new Date(formData.InitiationDate || new Date()).toISOString(),
      initiationDate: new Date(
        formData.InitiationDate || new Date()
      ).toISOString(),
      originalRequester: Number(formData.OriginalRequester) || 0,
      objectives: String(formData.Objectives || ""),
      conceptualizationStartDate: new Date(
        formData.ConceptualizationStartDate || new Date()
      ).toISOString(),
      conceptualizationEndDate: new Date(
        formData.ConceptualizationEndDate || new Date()
      ).toISOString(),
      conceptualizationComment: String(formData.ConceptualizationComment || ""),
      plannedSolutioningStartdate: new Date(
        formData.PlannedSolutioningStartdate || new Date()
      ).toISOString(),
      plannedSolutioningEndDate: new Date(
        formData.PlannedSolutioningEndDate || new Date()
      ).toISOString(),
      solutioningComment: String(formData.SolutioningComment || ""),
      plannedExecutionStartDate: new Date(
        formData.PlannedExecutionStartDate || new Date()
      ).toISOString(),
      plannedExecutionEndDate: new Date(
        formData.PlannedExecutionEndDate || new Date()
      ).toISOString(),
      executionComment: String(formData.ExecutionComment || ""),
      plannedAcceptanceStartDate: new Date(
        formData.PlannedAcceptanceStartDate || new Date()
      ).toISOString(),
      plannedAcceptanceEndDate: new Date(
        formData.PlannedAcceptanceEndDate || new Date()
      ).toISOString(),
      acceptanceComment: String(formData.AcceptanceComment || ""),
      plannedHandoverStartDate: new Date(
        formData.PlannedHandoverStartDate || new Date()
      ).toISOString(),
      plannedHandoverEndDate: new Date(formData.PlannedHandoverEndDate || new Date()).toISOString(),
      handoverComment: String(formData.HandoverComment || ""),
      systemAffected: String(formData.SystemAffected || ""),
      customFieldText1: String(formData.CustomFieldText1 || ""),
      customFieldText2: String(formData.CustomFieldText2 || ""),
      customFieldText3: String(formData.CustomFieldText3 || ""),
      customFieldText4: String(formData.CustomFieldText4 || ""),
      customFieldText5: String(formData.CustomFieldText5 || ""),
      customFieldDate1: new Date(formData.CustomFieldDate1 || new Date()).toISOString(),
      customFieldDate2: new Date(formData.CustomFieldDate2 || new Date()).toISOString(),
      customFieldDate3: new Date(formData.CustomFieldDate3 || new Date()).toISOString(),
      customTextArea1: String(formData.CustomTextArea1 || ""),
      customTextArea2: String(formData.CustomTextArea2 || ""),
      customTextArea3: String(formData.CustomTextArea3 || ""),
      customFieldNumeric1: Number(formData.CustomFieldNumeric1) || 0,
      customFieldNumeric2: Number(formData.CustomFieldNumeric2) || 0,
      customFieldNumeric3: Number(formData.CustomFieldNumeric3) || 0,
      customFieldNumeric4: Number(formData.CustomFieldNumeric4) || 0,
      customFieldNumeric5: Number(formData.CustomFieldNumeric5) || 0,
      customFieldDate4: new Date(formData.CustomFieldDate4 || new Date()).toISOString(),
      customFieldDate5: new Date(formData.CustomFieldDate5 || new Date()).toISOString(),
      createdBy: Number(employeeId), // Ensure it's a number
      createdDate: new Date().toISOString()
    };

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAddNew/PostInitiativeAddNew`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          },
          body: JSON.stringify(requestBody) // Assuming requestBody is defined
        }
      );

      const result = await response.json();
      setLoading(false);

      if (result.data && result.data.length > 0 && result.data[0].result === "Success") {
        setIsAdd(!isAdd);
        onClose();
        toast.success("Data added successfully!");
        setIdeaID(result.data[0].ideaID); // Store the ideaID in useState
        setIsEditing(!isEditing);
      } else {
        toast.error(`${result.data?.[0]?.result || "Unexpected error"}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to add data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render form elements
  const renderFormElements = () => {
    if (controlData) {
      const fields = Array.isArray(controlData) ? [...controlData] : [];

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

      return (
        <>
          {sortedRows?.map((rowNo) => (
            <div className="row" key={rowNo}>
              {groupedFields[rowNo]?.map((field, index) => {
                const isRequired = field.mandatory === 1;
                const isEditable = field.isEditable === 1;
                const options = field?.initiativeDetailDropDownEntity?.map((item) => ({
                  key: item.id,
                  text: item.name
                }));

                switch (field.controlType) {
                  case "Text Box":
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <TextField
                          label={renderLabel(field.label, isRequired)}
                          // placeholder={field.controlValue || ""}
                          placeholder={`Enter ${field.label}`}
                          value={formData[field.actualFieldName] ?? ""}
                          onChange={(e) => handleChange(field.actualFieldName, e.target.value)}
                          disabled={!isEditable}
                          fullWidth
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
                      ...(field.initiativeDetailDropDownEntity?.map((option) => ({
                        key: option.id,
                        text: option.name
                      })) || [])
                    ];

                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <FormControl fullWidth>
                          {/* <InputLabel>{renderLabel(field.label, isRequired)}</InputLabel>{" "} */}
                          {/* Added By Madhuri.K for changed Dropdown style from Material UI to Fluent UI comment start here */}
                          <Dropdown
                            label={renderLabel(field.label, isRequired)} // Use renderLabel for label
                            placeholder={`Select ${field.label}`}
                            selectedKey={formData[field.actualFieldName] ?? null} // Use selectedKey instead of value
                            onChange={(event, option) =>
                              handleChange(field.actualFieldName, option.key)
                            } // Adjust onChange handler
                            // required={isRequired}
                            disabled={!isEditable}
                            options={dropdownOptions.map((option) => ({
                              key: option.key,
                              text: option.text
                            }))} // Map options directly
                            styles={{ dropdown: { width: "100%" } }} // Optional: Ensure full-width styling
                          />

                          {/* Added By Madhuri.K for changed Dropdown style from Material UI to Fluent UI comment end here */}
                        </FormControl>
                      </div>
                    );

                  case "Date":
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label={renderLabel(field.label, isRequired)} // Use renderLabel for label
                            value={
                              formData[field.actualFieldName]
                                ? dayjs(formData[field.actualFieldName])
                                : field.controlValue
                                ? dayjs(field.controlValue)
                                : null
                            }
                            onChange={(date) => {
                              if (date) {
                                const adjustedDate = new Date(
                                  date.toDate().getTime() -
                                    date.toDate().getTimezoneOffset() * 60000
                                );
                                handleChange(field.actualFieldName, adjustedDate);
                              } else {
                                handleChange(field.actualFieldName, null);
                              }
                            }}
                            placeholder="Select Date"
                            required={isRequired}
                            disabled={!isEditable}
                            fullWidth
                          />
                        </LocalizationProvider> */}
                        <DatePicker
                          label={renderLabel(field.label, isRequired)} // Fluent UI handles label here
                          value={
                            formData[field.actualFieldName]
                              ? new Date(formData[field.actualFieldName])
                              : field.controlValue
                                ? new Date(field.controlValue)
                                : null
                          }
                          onSelectDate={(date) => {
                            if (date) {
                              const adjustedDate = new Date(
                                date.getTime() - date.getTimezoneOffset() * 60000
                              ); // Adjust for timezone
                              handleChange(field.actualFieldName, adjustedDate);
                            } else {
                              handleChange(field.actualFieldName, null);
                            }
                          }}
                          placeholder="Select Date"
                          // isRequired={isRequired} // Use isRequired instead of required
                          disabled={!isEditable}
                          allowTextInput={true} // Allows manual date entry
                          firstDayOfWeek={DayOfWeek.Sunday} // Optional: Set first day of the week
                          styles={{ root: { width: "100%" } }} // Full-width styling
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
                          label={renderLabel(field.label, isRequired)} // Use renderLabel for label
                          placeholder={field.controlValue || ""}
                          value={formData[field.actualFieldName] || ""}
                          onChange={(e) => handleChange(field.actualFieldName, e.target.value)}
                          multiline
                          rows={4}
                          // required={isRequired}
                          disabled={!isEditable}
                          fullWidth
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

  return (
    <>
      <div className="container-fluid mt-3">
        <Box>
          <Box>
            <div className="d-flex gap-2 justify-content-between align-items-start">
              <div>
                <Box
                  className=" mb-3"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 2
                  }}
                >
                  {/* header text changed By Madhuri.K On 04-Feb-2025 */}
                  <h5>Initiative</h5>
                </Box>
              </div>
              <div>
                <Button variant="contained" color="primary" onClick={handleAdd} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : "Save as Draft"}
                </Button>
                <Button variant="text" className="btn nostylebtn closelink" onClick={handleGoBack}>
                  Back
                </Button>
              </div>
            </div>
          </Box>

          {/* Div Section Added By Madhuri.K On 04-Feb-2025  comment start here*/}
          {/* header text changed By Madhuri.K On 04-Feb-2025 */}
          <div className="row">
            <div className="col-md-6 text-start">
              <div className="row">
                <div className="col-md-3 text-start">
                  <strong>Nature of Initiative : </strong>
                </div>
                <div className="col-md-8 text-start">{natureofDemandID || "N/A"}</div>
              </div>
            </div>
            <div className="col-md-6 text-end ">
              <label className="form-label IM_label">
                (<span style={{ color: "red" }}>*</span> Mandatory)
              </label>
            </div>
          </div>

          {/* Form */}
          <form className="mb-3">
            <div>{renderFormElements()}</div>
          </form>

          {/* Add Button */}
        </Box>
      </div>
    </>
  );
};

export default ControlDrawer;
