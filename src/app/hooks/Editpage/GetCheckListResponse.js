import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const GetCheckListResponse = async (IdeaID, checklistID, RevisionID, UserID, StageID) => {
  console.log("GetInitiativeActioItems", IdeaID, userID);
  const accessToken = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetCheckListResponse`,
      {
        params: { IdeaID, checklistID, RevisionID, UserID, StageID },
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

export default GetCheckListResponse;
