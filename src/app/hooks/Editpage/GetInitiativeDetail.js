import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const GetInitiativeDetail = async (IdeaId, userID) => {
  console.log("GetInitiativeDetail", IdeaId, userID);
  const accessToken = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GET`,
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

export default GetInitiativeDetail;
