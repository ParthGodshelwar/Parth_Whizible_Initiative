import axios from "axios";

const GetExternalAuditDocumentList = async (UniqueID, UserId) => {
  console.log("GetExternalAuditDocumentList", UniqueID);
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  if (!UniqueID) {
    console.warn("UniqueID not prst.");
    return;
  }
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditDocumentList`,
      {
        params: { UniqueID, UserId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching initiative document list:", error);
    throw new Error("Failed to fetch initiative document list");
  }
};

export default GetExternalAuditDocumentList;
