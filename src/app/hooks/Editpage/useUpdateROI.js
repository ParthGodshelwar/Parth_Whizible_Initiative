import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom hook for updating ROI
const useUpdateROI = (initiativesID) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;

  const updateROI = async (roiMonth, roiYear, projectedROI) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeROI`,
        null, // No body as the data is passed in query parameters
        {
          params: {
            IdeaId: initiativesID,
            ROIMonth: roiMonth,
            ROIYear: roiYear,
            ProjectedROI: projectedROI,
            UserID: employeeId // Assuming the UserID is the employeeId
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "*/*"
          }
        }
      );

      if (response.status === 200) {
        toast.success("ROI updated successfully");
      } else {
        throw new Error("Failed to update ROI");
      }
    } catch (error) {
      setError(error.message);
      toast.error("Failed to update ROI: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateROI, loading, error };
};

export default useUpdateROI;
