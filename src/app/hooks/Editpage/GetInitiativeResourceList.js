import axios from "axios";

const GetInitiativeResourceList = async (IdeaId) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const accessToken = sessionStorage.getItem("access_token");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeResourceList`,
      {
        params: { IdeaId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative resource list:", error);
    throw new Error("Failed to fetch initiative resource list");
  }
};

export default GetInitiativeResourceList;
