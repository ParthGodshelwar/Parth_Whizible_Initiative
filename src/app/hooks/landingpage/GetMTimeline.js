import axios from "axios";

const GetMTimeline = async (year, month) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  // Get today's date
  const today = new Date();
  const years = today.getFullYear();
  const months = today.getMonth() + 1; // Months are zero-based

  try {
    const userProfileResponse = await axios.get(
      `${
        process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
      }/api/LandingPageDB/GetMTimeline?logID=${employeeId}&year=${month}&month=${year + 1}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const userProfileData = userProfileResponse.data.data;

    return userProfileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile data");
  }
};

export default GetMTimeline;
