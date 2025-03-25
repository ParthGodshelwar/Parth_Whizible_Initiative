import { ToastContainer, toast } from "react-toastify";

export const uploadImage = async (imageData) => {
  try {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const formData = new FormData();

    // Append the file to the FormData object
    formData.append("formFile", imageData, imageData.name); // Ensure `imageData` is a File object

    const accessToken = sessionStorage.getItem("access_token");
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/FileUpDown/UserProfile?LogId=${employeeId}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      }
    );

    if (response.status === 204) {
      // Handle the 204 No Content response
      return 204;
    } else if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(
        `Failed to upload image: ${errorResponse.errors?.formFile?.[0] || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (response) {
    console.error("Error uploading image:", response);
    toast.error("Failed to upload. Please select a file under 10 KB in JPG or PNG format.");
    throw response.errors;
  }
};
