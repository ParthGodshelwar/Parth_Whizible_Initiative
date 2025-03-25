// Resource.js
const API_URL = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeResource`;

export const postResource = async (
  ideaID,
  roleID,
  toolID,
  tentativeStartDate,
  tentativeEndDate,
  resourceEffort,
  userID,
  setRefresh1,
  refresh
) => {
  const url = `${API_URL}?IdeaId=${ideaID}&RoleID=${roleID}&ToolID=${toolID}&TentativeStartDate=${tentativeStartDate}&TentativeEndDate=${tentativeEndDate}&ResourceEffort=${resourceEffort}&UserID=${userID}`;
  const accessToken = sessionStorage.getItem("access_token");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*"
      },
      body: JSON.stringify({}) // Assuming the API expects an empty body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to post resource:", error);
    throw error; // Rethrow the error for handling in the component
  }
};
