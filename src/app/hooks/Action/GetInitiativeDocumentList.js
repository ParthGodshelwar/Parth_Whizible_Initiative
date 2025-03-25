import axios from "axios";

const GetInitiativeDocumentList = async (ActionItemId, UserId) => {
  console.log("GetInitiativeDocumentList", ActionItemId);
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  if (!ActionItemId) {
    console.warn("ActionItemId not prst.");
    return;
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/GetActionItemDocumentList`,
      {
        params: { ActionItemId, UserId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative document list:", error);
    throw new Error("Failed to fetch initiative document list");
  }
};

export default GetInitiativeDocumentList;
