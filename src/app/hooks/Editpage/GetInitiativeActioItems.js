import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const GetInitiativeActioItems = async (IdeaId, userID) => {
  console.log("GetInitiativeActioItems", IdeaId, userID);
  const accessToken = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeActioItems`,
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

export default GetInitiativeActioItems;
