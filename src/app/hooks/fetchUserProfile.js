import axios from "axios";

const fetchUserProfile = async (accessToken) => {
  const email = sessionStorage.getItem("email");
  try {
    const userProfileResponse = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${email}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const userProfileData = userProfileResponse.data.data;
    sessionStorage.setItem("user", JSON.stringify(userProfileData));
    if (userProfileData && userProfileData.employeeId) {
      await fetchProfileImage(accessToken, userProfileData.employeeId);
    }

    return userProfileData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile data");
  }
};

const fetchProfileImage = async (accessToken, employeeId) => {
  try {
    const profileImageResponse = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/FileUpDown/GetProfileImage?logID=${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "*/*"
        }
      }
    );
    sessionStorage.setItem("UserProfilePic", profileImageResponse.data);

    console.log("Profile image fetched successfully:", profileImageResponse.data);
  } catch (error) {}
};

export default fetchUserProfile;
