import axios from "axios";

const GetInitiativeDetails = async () => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  try {
    const Response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeListFilter/Get`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const filters = Response.data.data;

    return filters;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile data");
  }
};

export default GetInitiativeDetails;
