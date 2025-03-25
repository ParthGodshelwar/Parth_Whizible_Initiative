import axios from "axios";

const GetPrioritizationCheckList = async (IdeaId, userID) => {
  console.log("GetInitiativeActioItems", IdeaId, userID);
  const accessToken = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetPrioritizationCheckList`,
      {
        params: { UserID: userID, IdeaId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative detail:", error);
    throw new Error("Failed to fetch initiative detail");
  }
};

export default GetPrioritizationCheckList;
