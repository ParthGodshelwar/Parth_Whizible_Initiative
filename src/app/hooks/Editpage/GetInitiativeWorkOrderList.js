import axios from "axios";

const GetInitiativeWorkOrderList = async (IdeaId) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const accessToken = sessionStorage.getItem("access_token");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeWorkOrderList`,
      {
        params: { IdeaId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative work order list:", error);
    throw new Error("Failed to fetch initiative work order list");
  }
};

export default GetInitiativeWorkOrderList;
