import axios from "axios";

export const changePassword = async (username, oldPassword, newPassword) => {
  try {
    console.log("Cancel");
    const response = await axios.post("/api/change-password", {
      username,
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "An error occurred while changing the password."
    );
  }
};
