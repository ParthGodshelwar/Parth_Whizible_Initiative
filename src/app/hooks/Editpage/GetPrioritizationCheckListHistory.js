import axios from "axios";

{/* Added UniqueID by Gauri on 08 Feb 2025 */}
const GetPrioritizationCheckListHistory = async (
  IdeaId,
  currentPage,
  UniqueID,   // Passed UniqueID by Gauri on 08 Feb 2025 
  selectedBy,
  selectedField
) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const PageNo = currentPage;
  if (!accessToken || !employeeId) {
    throw new Error("Access token or employee ID is missing. Please login again.");
  }

  try {
    console.log("Before API call");
    const response = await axios.get(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetPrioritizationCheckListHistory`,
      {
        params: {
          IdeaId,
          PageNo,
          // Passed UniqueID by Gauri on 08 Feb 2025 
          UniqueID,
          ...(selectedBy && { ModifiedBy: selectedBy }),
          ...(selectedField && { ModifiedDate: selectedField })
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (response.status === 200) {
      console.log("After API call");
      console.log("history1", response.data);
      return response.data;
    } else {
      console.error("Non-200 response:", response.status);
    }
  } catch (error) {
    console.error("Error fetching initiative history:", error);
    throw new Error("Failed to fetch initiative history");
  }
};

export default GetPrioritizationCheckListHistory;
