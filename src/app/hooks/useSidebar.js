import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const useSidebar = () => {
  const [SidebarData, setSidebarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const response = await axios.get(
          process.env.REACT_APP_BASEURL_ACCESS_CONTROL1 +
            `/api/Navigation/Get?employeeId=${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
            // Optionally, if you need to ignore SSL certificate errors (not recommended in production):
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch dashboard data");
        }
        setSidebarData(response.data.data.leftMenu);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    const delayFetch = setTimeout(() => {
      fetchData();
    }, 3000);
  }, []);

  return { SidebarData, loading, error };
};

export default useSidebar;
