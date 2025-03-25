// src/helpers/apiHelper.js
export const handleUnauthorizedResponse = (response) => {
  console.log("handleUnauthorizedResponse", response);
  if (response.status == 401) {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "/login"; // Adjust to your login route
  }
};
