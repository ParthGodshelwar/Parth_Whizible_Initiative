import axios from "axios";

const GetInitiativeRisksHeat = async (IdeaId, userID) => {
  console.log("GetInitiativeDetail", IdeaId, userID);
  const accessToken = sessionStorage.getItem("access_token");

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/GetRisksHeatMatrix`,
      {
        params: { IdeaId },
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

export default GetInitiativeRisksHeat;
