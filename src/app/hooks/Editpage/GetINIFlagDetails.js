import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const GetINIFlagDetails = async (IdeaId) => {
  console.log("GetInitiativeActioItems", IdeaId);
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetINIFlagDetails`,
      {
        params: { IdeaId, userID },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    handleUnauthorizedResponse(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative detail:", error);
    throw new Error("Failed to fetch initiative detail");
  }
};

export default GetINIFlagDetails;
