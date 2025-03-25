import { useState } from "react";
import axios from "axios";

const AlertDurations = () => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.employeeId;
  const fetchData = async () => {
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAlerts/GetAlertDurations`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      console.log("Graph Data:", response.data);
      setAlert(response.data.data);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchData when the component is created
  if (loading) {
    fetchData();
  }

  return { alert, loading, error };
};

export default AlertDurations;
