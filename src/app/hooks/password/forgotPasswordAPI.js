import axios from "axios";

export const forgotPassword = async (username, email) => {
  try {
    console.log("Cancel");
    const response = await axios.post("/api/forgot-password", {
      username,
      email
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "An error occurred while resetting the password."
    );
  }
};
