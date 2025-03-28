import React, { useState, useEffect } from "react";
import {
  DefaultButton,
  PrimaryButton,
  IconButton,
} from "@fluentui/react/lib/Button";
import moment from "moment";
import { Modal } from "@fluentui/react/lib/Modal";
import {
  getTheme,
  mergeStyleSets,
  mergeStyles,
} from "@fluentui/react/lib/Styling";
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
  display: "inline-block",
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
  zIndex: 10,
});

const buttonGroupStyles = mergeStyles({
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 10,
});

const profilePictureStyles = mergeStyles({
  borderRadius: "50%",
  width: 72,
  height: 72,
  objectFit: "cover",
  border: "2px solid #e1dfdd",
});

const fieldContainerStyles = mergeStyles({
  display: "flex",
  alignItems: "flex-start",
  gap: 20,
});

const fieldGroupStyles = mergeStyles({
  flexBasis: "48%",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // backdrop effect
  },
  modal: {
    width: "40vw",
    maxHeight: "80vh",
    backgroundColor: theme.palette.white, // Ensure modal has a white background
    padding: theme.spacing.m,
    borderRadius: theme.effects.roundedCorner2,
    boxShadow: theme.effects.elevation16,
    overflowY: "auto",
    position: "relative", // For the close button
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${theme.spacing.s1} ${theme.spacing.m}`,
    borderBottom: `1px solid ${theme.palette.neutralLight}`,
  },
  body: {
    padding: theme.spacing.m,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    padding: `${theme.spacing.s1} ${theme.spacing.m}`,
    borderTop: `1px solid ${theme.palette.neutralLight}`,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing.s1,
    top: theme.spacing.s1,
  },
});

{
  /* Passed initiativesData by Gauri for manage workflow stages on 24 Mar 2025 */
}
function BasicDetailEdit({
  initiativesID,
  image,
  initiativeLinkAccess,
  initiativeDetail = {},
  handleFieldChange,
  handleGoBack,
  setRefresh1,
  refresh,
  setRefresh12,
  prioritizationCheckList,
  initiativeActioItems,
  initiativesData,
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
  const [iniData, setIniData] = useState(null);

  useEffect(() => {
    if (initiativesData) {
      setIniData(initiativesData);
    }
  }, [initiativesData, setRefresh12]);

  console.log("BasicDetailEdit initiativesData", iniData);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (initiativeDetail?.data?.listInitiativeDetailEntity) {
      console.log(
        "Initiative Detail Data:",
        initiativeDetail?.data?.listInitiativeDetailEntity
      );

      const initialData = {};
      initiativeDetail.data.listInitiativeDetailEntity.forEach((field) => {
        const { actualFieldName, controlValue } = field;

        // Parse dates correctly (handle both display and UTC formats)
        if (actualFieldName.includes("Date") && controlValue) {
          const parsedDate = moment(controlValue, [
            "MMM D YYYY h:mmA",
            moment.ISO_8601,
          ]);
          initialData[actualFieldName] = parsedDate.isValid()
            ? parsedDate.toISOString()
            : controlValue;
        } else {
          initialData[actualFieldName] = controlValue || "";
        }
      });

      console.log("Initial Data for Form:", initialData); // Debugging
      setFormDataState(initialData);
    } else {
      console.log("Initiative detail data is missing or incorrect");
    }
  }, [initiativeDetail, setRefresh12]);

  const getFieldValue = (field) => {
    return (
      formDataState[field.actualFieldName] ||
      formDataState[field.fieldName] ||
      ""
    );
  };

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
      Dec: "12",
    };
    return months[month] || "00"; // Return '00' if month is not found
  };

  const getDateOrNull = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.toISOString();
  };

  const parseDate = (dateString) => {
    if (!dateString) return null; // Return null if dateString is empty
    // Normalize the date string (replace multiple spaces with a single space)
    const normalizedDateString = dateString.trim().replace(/\s+/g, " ");

    // Split the date string
    const [month, day, year, time] = normalizedDateString.split(" ");

    // Ensure day is zero-padded
    const paddedDay = String(day).padStart(2, "0");

    // Convert AM/PM time to 24-hour format
    const [hour, minute] = time.slice(0, -2).split(":");
    const period = time.slice(-2); // Get AM/PM

    let adjustedHour = parseInt(hour, 10);
    if (period === "PM" && adjustedHour < 12) {
      adjustedHour += 12; // Convert PM hour to 24-hour format
    }
    if (period === "AM" && adjustedHour === 12) {
      adjustedHour = 0; // Convert midnight hour to 0
    }

    // Create a formatted date string
    const formattedDateString = `${year}-${monthToNumber(
      month
    )}-${paddedDay}T${String(adjustedHour).padStart(2, "0")}:${minute}:00`;

    // Create a new Date object
    const parsedDate = new Date(formattedDateString);

    console.log("Formatted Date String:", formattedDateString); // Debugging
    console.log("Parsed Date:", parsedDate); // Debugging

    // Check if the date is valid
    return isNaN(parsedDate) ? null : parsedDate; // Return null if the date is invalid
  };

  // Function to validate mandatory fields
  const validateMandatoryFields = () => {
    const mandatoryFields =
      initiativeDetail?.data?.listInitiativeDetailEntity.filter(
        (field) => field.mandatory === 1 && field.isEditable === 1
      );

    for (const field of mandatoryFields) {
      if (!formDataState[field.actualFieldName]) {
        toast.error(`${field.label} cannot be left blank`);
        return false; // Stop further validation after the first error
      }
    }

    return true;
  };

  // Function to validate mandatory fields
  const validateDateFields = () => {
    debugger;
    const mandatoryFields =
      initiativeDetail?.data?.listInitiativeDetailEntity.filter((field) =>
        [
          "ExpectedStartDate",
          "ExpectedEndDate",
          "PlannedExecutionStartDate",
          "PlannedExecutionEndDate",
        ].includes(field.actualFieldName)
      );

    let dateFields = {};

    const parseDate = (dateStr) => {
      if (!dateStr) return null;

      // Replace multiple spaces to ensure correct parsing
      dateStr = dateStr.replace(/\s+/g, " ");

      // Convert the date string to a valid format
      const parsedDate = Date.parse(dateStr);

      return isNaN(parsedDate) ? null : new Date(parsedDate);
    };

    // Validate missing fields
    for (const field of mandatoryFields) {
      const fieldValue = formDataState[field.actualFieldName];

      const parsedDate = fieldValue
        ? moment
            .utc(
              fieldValue,
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                fieldValue,
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null;

      dateFields[field.actualFieldName] = {
        value: new Date(parsedDate),
        field,
      };
    }

    // Compare start and end dates
    const datePairs = [
      ["ExpectedStartDate", "ExpectedEndDate"],
      ["PlannedExecutionStartDate", "PlannedExecutionEndDate"],
    ];

    for (const [startField, endField] of datePairs) {
      if (dateFields[startField] && dateFields[endField]) {
        if (dateFields[startField].value > dateFields[endField].value) {
          toast.error(
            // `${dateFields[startField].field.label} (${startField}) cannot be later than ${dateFields[endField].field.label} (${endField})`
            `${dateFields[startField].field.label}  cannot be later than ${dateFields[endField].field.label} `
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSave = async () => {
    const missingFields = [];

    if (!validateMandatoryFields()) {
      return; // Stop execution if mandatory fields are missing
    }

    if (!validateDateFields()) {
      return; // Stop execution if mandatory fields are missing
    }

    // Check if the title already exists
    const existingTitle =
      initiativeDetail?.data?.listInitiativeDetailEntity.find(
        (item) =>
          item.fieldName === "Title" &&
          item.controlValue === formDataState["Initiative Title"]
      );

    if (existingTitle) {
      toast.error("Initiative Title already exists");
      return; // Stop further execution
    }

    debugger;

    // Added by Parth.G to add validation for numeric fields on 28 Mar 2025
    // Step 1: Get Only Visible Fields
    const visibleFields = initiativeDetail?.data?.listInitiativeDetailEntity
      .filter((field) => field.applicable === 1) // Only visible fields
      .map((field) => field.actualFieldName);

    // Step 2: Define Numeric Fields & Filter Only Visible Numeric Fields
    const numericFields = [
      "CustomFieldNumeric1",
      "CustomFieldNumeric2",
      "CustomFieldNumeric3",
      "CustomFieldNumeric4",
      "CustomFieldNumeric5",
    ];

    // Get only numeric fields that are visible
    // const visibleNumericFields = numericFields.filter((field) => visibleFields.includes(field));
    const visibleNumericFields =
      initiativeDetail?.data?.listInitiativeDetailEntity
        .filter(
          (field) =>
            field.applicable === 1 && // Only visible fields
            numericFields.includes(field.actualFieldName) && // Only numeric fields
            field.controlType !== "Combo Box" // Exclude dropdowns
        )
        .map((field) => field.actualFieldName);

    console.log(
      "Visible Numeric Fields (should NOT include Business Group):",
      visibleNumericFields
    );

    // Step 3: Validate Numeric Fields ONLY
    for (const fieldName of visibleNumericFields) {
      const fieldConfig =
        initiativeDetail?.data?.listInitiativeDetailEntity.find(
          (field) => field.actualFieldName === fieldName
        );
      if (!fieldConfig || fieldConfig.controlType === "Combo Box") {
        console.log(`Skipping '${fieldName}' because it's a dropdown.`);
        continue; // Skip dropdowns
      }

      const fieldValue = formDataState[fieldName];

      console.log(`Validating Numeric Field: ${fieldName}, Value:`, fieldValue);

      // if (!fieldValue || fieldValue.trim() === "") {
      //   toast.error(`'${fieldConfig.label}' should not be left blank.`);
      //   return;
      // }

      if (
        fieldConfig.mandatory === 1 &&
        (!fieldValue || fieldValue.trim() === "")
      ) {
        toast.error(`'${fieldConfig.label}' should not be left blank.`);
        return;
      }

      // Convert value to a number
      const numericValue = Number(fieldValue);
      if (isNaN(numericValue) || numericValue <= 0) {
        toast.error(
          `Please enter only numeric values for '${fieldConfig.label}'.`
        );
        return;
      }
    }

    // Proceed with API call if all checks pass
    console.log("formDataToSave", formDataState);

    const formDataToSave = {
      projectManager: Number(formDataState["ProjectManager"]),
      ideaID: initiativesID,
      title: formDataState["Initiative Title"],
      title: getFieldValue({
        actualFieldName: "Title",
        fieldName: "Initiative Title",
      }),
      organizationUnit: formDataState["Organization Unit"]
        ? parseInt(formDataState["Organization Unit"])
        : 0,

      description: getFieldValue({
        actualFieldName: "Description",
        fieldName: "Initiative Description",
      }),
      businessUnitID: getFieldValue({
        actualFieldName: "BusinessUnitID",
        fieldName: "Business Unit",
      }),
      // organizationUnit: getFieldValue({ actualFieldName: "OrganizationUnit", fieldName: "OrganizationUnit" }),
      requestTypeID: getFieldValue({
        actualFieldName: "RequestTypeID",
        fieldName: "Initiative Type",
      }),
      vendorID: getFieldValue({
        actualFieldName: "VendorID",
        fieldName: "Vendor",
      }),

      // expectedStartDate: formDataState["ExpectedStartDate"] || null,

      expectedStartDate: formDataState["ExpectedStartDate"]
        ? moment
            .utc(
              formDataState["ExpectedStartDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["ExpectedStartDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // expectedEndDate: formDataState["ExpectedEndDate"] || null,
      expectedEndDate: formDataState["ExpectedEndDate"]
        ? moment
            .utc(
              formDataState["ExpectedEndDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["ExpectedEndDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // customFieldDate1: formDataState["customFieldDate1"] || null,
      customFieldDate1: formDataState["CustomFieldDate1"]
        ? moment
            .utc(
              formDataState["CustomFieldDate1"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate1"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,

      deliveryUnit: formDataState["Delivery Unit"]
        ? parseInt(formDataState["Delivery Unit"])
        : 0,
      deliveryTeam: formDataState["Delivery Team"]
        ? parseInt(formDataState["Delivery Team"])
        : 0,
      bgRepresentatives: formDataState["BG Representatives"],
      resourceEffort: formDataState["Resource Effort"]
        ? parseFloat(formDataState["Resource Effort"])
        : 0,
      priorityID: formDataState["Priority"]
        ? parseInt(formDataState["Priority"])
        : 0,
      requestTypeID: formDataState["Initiative Type"]
        ? parseInt(formDataState["Initiative Type"])
        : 0,
      frequency: formDataState["Frequency"],
      productLineId: formDataState["Product Line ID"]
        ? parseInt(formDataState["Product Line ID"])
        : 0,
      productID: formDataState["Product ID"]
        ? parseInt(formDataState["Product ID"])
        : 0,
      initiationDate: new Date().toISOString(),
      originalRequester: formDataState["Original Requester"]
        ? parseInt(formDataState["Original Requester"])
        : 0,
      objectives: formDataState["Objectives"],
      // conceptualizationStartDate: new Date().toISOString(),
      conceptualizationStartDate: formDataState["conceptualizationStartDate"]
        ? new Date(formDataState["conceptualizationStartDate"]).toISOString()
        : new Date().toISOString(),
      // conceptualizationEndDate: new Date().toISOString(),
      conceptualizationStartDate: formDataState["conceptualizationStartDate"]
        ? new Date(formDataState["conceptualizationStartDate"]).toISOString()
        : new Date().toISOString(),
      conceptualizationComment: formDataState["Conceptualization Comment"],
      // plannedSolutioningStartdate: formDataState["PlannedSolutioningStartDate"],
      plannedSolutioningStartdate: formDataState["PlannedSolutioningStartDate"]
        ? moment
            .utc(
              formDataState["PlannedSolutioningStartDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedSolutioningStartDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // plannedSolutioningEndDate: formDataState["PlannedSolutioningEndDate"],
      plannedSolutioningEndDate: formDataState["PlannedSolutioningEndDate"]
        ? moment
            .utc(
              formDataState["PlannedSolutioningEndDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedSolutioningEndDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      solutioningComment: formDataState["SolutioningComment"],
      // plannedExecutionStartDate: formDataState["PlannedExecutionStartDate"],
      plannedExecutionStartDate: formDataState["PlannedExecutionStartDate"]
        ? moment
            .utc(
              formDataState["PlannedExecutionStartDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedExecutionStartDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,

      // plannedExecutionEndDate: formDataState["PlannedExecutionEndDate"],
      plannedExecutionEndDate: formDataState["PlannedExecutionEndDate"]
        ? moment
            .utc(
              formDataState["PlannedExecutionEndDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedExecutionEndDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      executionComment: formDataState["ExecutionComment"],
      // plannedAcceptanceStartDate: formDataState["PlannedAcceptanceStartDate"],
      plannedAcceptanceStartDate: formDataState["PlannedAcceptanceStartDate"]
        ? moment
            .utc(
              formDataState["PlannedAcceptanceStartDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedAcceptanceStartDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // plannedAcceptanceEndDate: formDataState["PlannedAcceptanceEndDate"],
      plannedAcceptanceEndDate: formDataState["PlannedAcceptanceEndDate"]
        ? moment
            .utc(
              formDataState["PlannedAcceptanceEndDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedAcceptanceEndDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      acceptanceComment: formDataState["AcceptanceComment"],
      // plannedHandoverStartDate: formDataState["PlannedHandoverStartDate"],
      plannedHandoverStartDate: formDataState["PlannedHandoverStartDate"]
        ? moment
            .utc(
              formDataState["PlannedHandoverStartDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedHandoverStartDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // plannedHandoverEndDate: formDataState["PlannedHandoverEndDate"],
      plannedHandoverEndDate: formDataState["PlannedHandoverEndDate"]
        ? moment
            .utc(
              formDataState["PlannedHandoverEndDate"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["PlannedHandoverEndDate"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      handoverComment: formDataState["HandoverComment"],
      systemAffected: formDataState["SystemAffected"],
      customFieldText1: formDataState["CustomFieldText1"],
      customFieldText2: formDataState["CustomFieldText2"],
      customFieldText3: formDataState["CustomFieldText3"],
      customFieldText4: formDataState["CustomFieldText4"],
      customFieldText5: formDataState["CustomFieldText5"],
      // customFieldDate1: formDataState["CustomFieldDate1"]
      //   ? moment(
      //       formDataState["CustomFieldDate1"],
      //       "MMM DD YYYY h:mmA"
      //     ).toISOString()
      //   : "",
      customFieldDate1: formDataState["CustomFieldDate1"]
        ? moment
            .utc(
              formDataState["CustomFieldDate1"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate1"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // customFieldDate2: formDataState["CustomFieldDate2"],
      customFieldDate2: formDataState["CustomFieldDate2"]
        ? moment
            .utc(
              formDataState["CustomFieldDate2"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate2"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      // customFieldDate3: formDataState["CustomFieldDate3"],
      customFieldDate3: formDataState["CustomFieldDate3"]
        ? moment
            .utc(
              formDataState["CustomFieldDate3"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate3"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
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
      // customFieldDate4: formDataState["CustomFieldDate4"],
      customFieldDate4: formDataState["CustomFieldDate4"]
        ? moment
            .utc(
              formDataState["CustomFieldDate4"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate4"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,

      // customFieldDate5: formDataState["CustomFieldDate5"],
      customFieldDate5: formDataState["CustomFieldDate5"]
        ? moment
            .utc(
              formDataState["CustomFieldDate5"],
              ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Handle both formats
            )
            .isValid()
          ? moment
              .utc(
                formDataState["CustomFieldDate5"],
                ["YYYY-MM-DDTHH:mm:ss.SSSZ", "MMM DD YYYY h:mmA"] // Use same formats
              )
              .toDate()
          : null
        : null,
      modifiedBy: employeeId,
      modifiedDate: new Date().toISOString(),
    };

    const accessToken = sessionStorage.getItem("access_token");
    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAddNew/UpdInitiativeDetails`;

    try {
      // const response = await axios.put(url, formDataToSave, {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //     "Content-Type": "application/json"
      //   }
      // });
      const response = await axios.put(url, formDataToSave, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      // console.log("API Save Response:", response.data);

      if (response.status === 200) {
        const result = response.data;

        if (result.data?.length > 0 && result.data[0].result === "Success") {
          toast.success("Data saved successfully!");
        } else {
          toast.error(result.data?.[0]?.result || "Unexpected error occurred.");
        }

        // if (
        //   result.data &&
        //   result.data.length > 0 &&
        //   result.data[0].result === "Success"
        // ) {
        //   toast.success("Data saved successfully!");
        // } else {
        //   toast.error(`${result.data?.[0]?.result || "Unexpected error"}`);
        // }

        // toast.success("Data saved successfully!");

        // Fetch updated initiative details again
        setRefresh1(!refresh);
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
        alert(
          "Only JPG and PNG files are allowed. Please upload a valid image."
        );
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
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("setRefresh", response.status);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Image = reader.result;
          setFormDataState({
            ...formDataState,
            profileImage: base64Image,
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
      const fields = Array.isArray(
        initiativeDetail?.data?.listInitiativeDetailEntity
      )
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
                console.log(
                  `Field: ${field.label}, Mandatory: ${field.mandatory}`
                ); // Debugging line
                const isRequired = field.mandatory === 1; // This should only return true if mandatory is 1
                const isEditable = field.isEditable === 1;
                const options = field.initiativeDetailDropDownEntity.map(
                  (item) => ({
                    key: item.id,
                    text: item.name,
                  })
                );

                // Render the image and TextField on the same line for pageRoWNo: 1 and pageOrderNo: 1
                if (field.pageRoWNo === 1 && field.pageOrderNo === 1) {
                  console.log("field1111", field);
                  return (
                    <div
                      key={index}
                      className="col-md-12 d-flex align-items-center mt-2"
                    >
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
                            onClick={() =>
                              document.getElementById("uploadImage").click()
                            }
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
                            [field.actualFieldName]: newValue, // Use actualFieldName
                          });
                          handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                        }}
                        // required={isRequired}
                        disabled={!isEditable}
                        style={{
                          marginLeft: "20px",
                          flex: 1,
                          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "rgba(0, 0, 0, 0.23)", // Set default border color
                            },
                          "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "rgba(0, 0, 0, 0.5)", // Set hover border color
                            },
                          "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "rgba(0, 0, 0, 0.87)", // Set focused border color
                            },
                        }}
                        InputProps={{
                          style: {
                            borderColor: "rgba(0, 0, 0, 0.23)", // Set default border color for InputProps
                          },
                          classes: {
                            notchedOutline: "Custom-notched-outline", // Optional: Add a custom class if needed
                          },
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
                              [field.actualFieldName]: newValue, // Use actualFieldName
                            });
                            handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                          }}
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          sx={{
                            marginLeft: "20px",
                            flex: 1,
                            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "rgba(0, 0, 0, 0.23)",
                              },
                            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "rgba(0, 0, 0, 0.5)",
                              },
                            "&.Mui-focused .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                              {
                                borderColor: "rgba(0, 0, 0, 0.87)",
                              },
                            "& .MuiInputLabel-root": {
                              color: "black !important",
                            },
                            "& .Mui-disabled .MuiInputLabel-root": {
                              color: "black !important",
                            },
                          }}
                        />
                      </div>
                    );

                  case "Combo Box":
                    const defaultOption = {
                      key: null,
                      text: `Select ${field.label}`,
                    };

                    const dropdownOptions = [
                      defaultOption,
                      ...field.initiativeDetailDropDownEntity.map((option) => ({
                        key: option.id,
                        text: option.name,
                      })),
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
                          selectedKey={
                            formDataState[field.actualFieldName] ?? null
                          } // Use actualFieldName
                          onChange={(ev, item) => {
                            const value = item ? item.key : null;
                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: value, // Use actualFieldName
                            });
                            handleFieldChange(value, field.actualFieldName); // Use actualFieldName
                          }}
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          styles={{
                            label: {
                              color: !isEditable ? "black !important" : "", // Ensure label stays black even when disabled
                            },
                          }}
                        />
                      </div>
                    );
                  case "Date":
                    return (
                      <div
                        key={index}
                        className={`col-md-4 mt-2 form-group row-${field.pageRoWNo}`}
                      >
                        <DatePicker
                          label={<>{field.label}</>}
                          value={
                            formDataState[field.actualFieldName]
                              ? moment
                                  .utc(
                                    formDataState[field.actualFieldName],
                                    // "MMM DD YYYY h:mmA","YYYY-MM-DDTHH:mm:ss.SSSZ"
                                    [
                                      "MMM DD YYYY h:mmA",
                                      "YYYY-MM-DDTHH:mm:ss.SSSZ",
                                    ]
                                  )
                                  .isValid()
                                ? moment
                                    .utc(formDataState[field.actualFieldName], [
                                      "YYYY-MM-DDTHH:mm:ss.SSSZ",
                                      "MMM DD YYYY h:mmA",
                                    ])
                                    .toDate()
                                : null
                              : null
                          }
                          // value={
                          //   formDataState[field.actualFieldName]
                          //     ? (() => {
                          //         const dateValue =
                          //           formDataState[field.actualFieldName];
                          //         return dateValue instanceof Date &&
                          //           !isNaN(dateValue)
                          //           ? dateValue
                          //           : moment(
                          //               dateValue,
                          //               "MMM DD YYYY h:mmA"
                          //             ).isValid()
                          //           ? moment(
                          //               dateValue,
                          //               "MMM DD YYYY h:mmA"
                          //             ).toDate()
                          //           : null;
                          //       })()
                          //     : null
                          // }
                          onSelectDate={(date) => {
                            if (!date) return;

                            // ✅ Convert selected date to UTC before saving
                            const isoDate = moment(date).utc().toISOString();

                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: isoDate,
                            });

                            console.log(
                              `✅ ${field.actualFieldName} saved as UTC:`,
                              isoDate
                            );

                            handleFieldChange(isoDate, field.actualFieldName);
                          }}
                          placeholder="Select Date"
                          isRequired={field.mandatory === 1}
                          disabled={!field.isEditable}
                          styles={{
                            label: {
                              color: !field.isEditable
                                ? "black !important"
                                : "",
                            },
                          }}
                        />

                        {/* <DatePicker
                          label={<>{field.label}</>}
                          value={
                            formDataState[field.actualFieldName]
                              ? moment(formDataState[field.actualFieldName]).isValid()
                                ? moment(formDataState[field.actualFieldName]).toDate()
                                : null
                              : parseDate(field.controlValue)
                          }
                          onSelectDate={(date) => {
                            if (!date) return;

                            const isoDate = moment(date).toISOString();

                            setFormDataState({
                              ...formDataState,
                              [field.actualFieldName]: isoDate
                            });

                            handleFieldChange(isoDate, field.actualFieldName);
                          }}
                          placeholder="Select Date"
                          isRequired={field.mandatory === 1}
                          disabled={!field.isEditable}
                          styles={{
                            label: {
                              color: !field.isEditable ? "black !important" : "" // Ensure label stays black even when disabled
                            }
                          }}
                        /> */}
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
                              [field.actualFieldName]: newValue, // Use actualFieldName
                            });
                            handleFieldChange(newValue, field.actualFieldName); // Use actualFieldName
                          }}
                          multiline
                          autoAdjustHeight
                          required={field.mandatory === 1}
                          disabled={!isEditable}
                          InputLabelProps={{
                            style: {
                              color: !isEditable ? "black !important" : "", // Ensure label stays black even when disabled
                            },
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
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
          },
        }
      );

      // Check the API response
      if (result.data && result.data.data && result.data.data.length > 0) {
        const responseResult = result.data.data[0].result;

        // Case-sensitive check for "success"
        if (responseResult === "Success") {
          toast.success("Initiative Withdrawn successfully!", {
            position: "top-right",
            autoClose: 3000, // Close after 3 seconds
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
    if (!accessToken) {
      console.error("Access token is missing");
      toast.error("Authentication error. Please log in again.");
      return;
    }

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
      // if ((action = "Approve")) {
      //   const missingFields = [];

      //   // Loop through the form fields and check for empty mandatory fields
      //   for (const field of initiativeDetail?.data?.listInitiativeDetailEntity || []) {
      //     if (field.mandatory === 1) {
      //       // Check if the field is mandatory
      //       const fieldValue = formDataState[field.fieldName];
      //       if (!fieldValue || fieldValue.trim() === "") {
      //         missingFields.push(field.label); // Add the missing field label to the array
      //       }
      //     }
      //   }

      //   // If there are missing fields, show a toast and exit the function
      //   if (missingFields.length > 0) {
      //     toast.error(`Please fill in the following mandatory fields: ${missingFields.join(", ")}`);
      //     return; // Exit the function without saving
      //   }
      // }

      // Make the API call
      const response = await axios.get(
        url,
        // { comments },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
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
        error.response?.data?.message ||
        "An error occurred while submitting the action.";
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
      if (!comments || comments.trim() === "") {
        toast.error("Comment should not be left blank"); // Show toast if comments are empty
        return; // Exit the function
      }
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/WorkflowActions?IdeaID=${ideaID}&Action=${action}&UserID=${userID}&Comments=${comments}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success(`${modalTitle} action completed successfully!`); // Show success toast

      const emailData =
        response?.data?.data?.listWorkflowActionResponseEntity[0];
      console.log("emailData listWorkflowActionResponseEntity", emailData);
      if (emailData?.message === "Success") {
        await sendSubmitActionEmail(emailData);
      }

      closeModal(); // Close the modal on successful submission
      setRefresh1(!refresh);
      // handleGoBack();
    } catch (error) {
      // Show error toast
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while submitting the action.";
      toast.error(errorMessage); // Show error toast with message from API
      console.error("Error while submitting the action:", error);
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  // Added by Gauri to send mail after save on 05 Mar 2025
  const sendSubmitActionEmail = async (emailData) => {
    try {
      const emailUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`;
      const params = {
        fromAddress: emailData.fromAddress,
        toAddress: emailData.toAddress,
        ccAddress: emailData.ccEmailAddress,
        subject: emailData.subject.replace(/\r\n/g, " "),
        body: emailData.body.replace(/\r\n/g, "<br>"),
        isHtml: 1,
      };
      console.log("Sending Email with params:", params);

      const token = sessionStorage.getItem("access_token");
      const response = await axios.post(emailUrl, params, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
      });

      console.log("Email response", response);

      if (response.status >= 200 && response.status < 300) {
        if (!response.data || response.data?.result === "Success") {
          toast.success("Email sent successfully!!");
        } else {
          toast.error("Failed to send Email.");
        }
      } else {
        toast.error(`Email failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email.");
    }
  };

  const renderDynamicButtons = () => {
    const buttonTexts = (
      initiativeLinkAccess?.data?.listInitiativeLinkAccessEntity || []
    )
      .filter((button) => button.display === 1) // Exclude "Manage Workflow"
      .map((button, index) => (
        <span
          key={index}
          onClick={() => handleButtonClick(button.linkName)}
          style={{
            cursor: "pointer",
            marginRight:
              index <
              initiativeLinkAccess.data.listInitiativeLinkAccessEntity.length -
                1
                ? "8px"
                : "0",
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
                padding: "0.5rem 1rem",
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
                  cursor: "pointer",
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
      {/* Passed initiativesData by Gauri for manage workflow stages on 24 Mar 2025 */}
      <WorkflowDrawer
        initiativesID={initiativesID}
        initiativesData={iniData}
        open={open1}
        setOpen={setOpen1}
      />
      <ActionItems
        initiativeActioItems={initiativeActioItems}
        open={aopen}
        setOpen={setAOpen}
      />
      <WorkflowInfo
        open={drawerOpen}
        onClose={handleDrawerClose}
        initiativesID={initiativesID}
      />
    </div>
  );
}

export default BasicDetailEdit;
