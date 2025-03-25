import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";

const GetInitiativesReallocation = async (formValues) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  try {
    // Filter out empty fields
    const filteredParams = Object.entries({
      // UserID: employeeId,
      // PageNo: currentPage,
      ApproverID: formValues.currentApprover,
      BGID: formValues.businessGroupId,
      NOI: formValues.natureOfInitiativeId,
      StageID: formValues.stageOfApprovalId,
      title: formValues.initiativeTitle
    }).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeReallocation/GetInitiativesReallocation`,
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

export default GetInitiativesReallocation;
