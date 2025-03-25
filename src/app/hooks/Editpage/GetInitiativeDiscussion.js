import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const GetInitiativeDiscussion = async (IdeaId) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.employeeId;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeDiscussion`,
      {
        params: { IdeaId, UserID },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    handleUnauthorizedResponse(response);
    console.log("GetInitiativeDiscussion response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative discussion:", error);
    throw new Error("Failed to fetch initiative discussion");
  }
};

export default GetInitiativeDiscussion;
