import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";

const GetInitiativeStageActionItems = async (IdeaId, currentPage, formValues) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  console.log("currentPage88", currentPage);

  // Added by Gauri to format date while filtering data by date on 04 Mar 2025
  const formatDateForURL = (date) => {
    if (!date) return ""; // Handle empty/null dates
  
    // Ensure date is a Date object
    const validDate = new Date(date);
  
    if (isNaN(validDate.getTime())) {
      console.error("Invalid date received:", date);
      return "";
    }
  
    return `${validDate.getFullYear()}-${String(validDate.getMonth() + 1).padStart(2, "0")}-${String(validDate.getDate()).padStart(2, "0")}`;
  };  

  try {
    // Filter out empty fields
    const filteredParams = Object.entries({
      UserID: employeeId,
      PageNo: currentPage,
      InitiativeTitle: formValues.initiativeTitle,
      SubmittedBy: formValues.submittedBy,
      StageID: formValues.stage,
      StatusID: formValues.status,
      AssignedBy: formValues.assignedTo,
      ActionItem: formValues.actionItem,
      // Commented and Added by Gauri to format SubmittedOn and DueDate on 04 Mar 2025
      // SubmittedOn: formValues.submittedOn,
      SubmittedOn: formatDateForURL(formValues.submittedOn),
      DueDate: formatDateForURL(formValues.dueDate),
      Priority: formValues.priority
    }).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await axios.get(
      // `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetInitiativeStageActionItems`,
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetInitiativeStageActionItems`,
      {
        params: filteredParams,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    handleUnauthorizedResponse(response);
    console.log("API response data:", response.data.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative detail:", error);
    throw new Error("Failed to fetch initiative detail");
  }
};

export default GetInitiativeStageActionItems;
