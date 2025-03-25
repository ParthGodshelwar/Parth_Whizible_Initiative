import axios from "axios";

// Update the function to accept dynamic parameters and handle undefined/null values
const WatchListConfiguration = async ({
  PageNo,
  InitiativeTitle = "", // Default to empty string if not provided
  StatusID = null, // Default to null if not provided
  NatureofInitiativeId = null,
  BusinessGroupId = null,
  OrganizationUnitId = null,
  InitiativeCode = "",
  CurrentStageID = null,
  CurrentStageApprover = "",
  searchParams
}) => {
  console.log("WatchListConfiguration", {
    PageNo,
    InitiativeTitle,
    StatusID,
    NatureofInitiativeId,
    BusinessGroupId,
    OrganizationUnitId,
    InitiativeCode,
    CurrentStageID,
    CurrentStageApprover
  });

  const accessToken = sessionStorage.getItem("access_token");

  // Build the params dynamically by removing undefined or null values
  const params = {
    PageNo,
    InitiativeTitle,
    StatusID,
    NatureofInitiativeId,
    BusinessGroupId,
    OrganizationUnitId,
    InitiativeCode,
    CurrentStageID,
    CurrentStageApprover
  };

  // Remove any keys with null or empty values to avoid unnecessary params in the request
  Object.keys(params).forEach((key) => {
    if (params[key] === null || params[key] === "") {
      delete params[key];
    }
  });

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeList/WatchListConfiguration`,
      {
        params: params,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching watch list configuration:", error);
    throw new Error("Failed to fetch watch list configuration");
  }
};

export default WatchListConfiguration;
