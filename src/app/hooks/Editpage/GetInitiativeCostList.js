import axios from "axios";

const GetInitiativeCostList = async (IdeaId) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeCostList`,
      {
        params: { IdeaId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative cost list:", error);
    throw new Error("Failed to fetch initiative cost list");
  }
};

export default GetInitiativeCostList;
