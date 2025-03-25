import { useState, useEffect } from "react";
import axios from "axios";

const Notification = (searchParams, duration, page) => {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const UserID = userdata?.employeeId;

  const fetchData = async () => {
    setLoading(true); // Set loading to true at the start of fetch
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeAlerts/GetInitiativeAlerts?UserID=${UserID}&Flag=${duration}&PageNo=${page}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      console.log("Graph Data:", response.data);
      setNotification(response.data.data);
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  // Use useEffect to fetch data when the component mounts and whenever duration or page changes
  useEffect(() => {
    fetchData(); // Fetch notifications whenever duration or page changes
  }, [duration, page]); // Dependencies array with duration and page

  // Initial call on component mount
  useEffect(() => {
    fetchData(); // Fetch notifications when the component first mounts
  }, []); // Empty dependency array for the initial call

  return { notification, loading, error };
};

export default Notification;
