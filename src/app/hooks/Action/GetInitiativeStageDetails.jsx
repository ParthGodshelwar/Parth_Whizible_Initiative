import axios from "axios";
import { handleUnauthorizedResponse } from "../apiHelper";
// Update the function to accept parameters dynamically
const GetInitiativeStageDetails = async (IdeaId) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetInitiativeStageDetails`,
      {
        params: {
          IdeaID: 1
        },
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

export default GetInitiativeStageDetails;
