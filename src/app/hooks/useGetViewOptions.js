import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const useGetViewOptions = (tagid) => {
  const [getViewOptions, setGetViewOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const roleID = userdata?.postId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const response = await axios.get(
          process.env.REACT_APP_BASEURL_ACCESS_CONTROL1 +
            `/api/PageAccess/Get?tagId=${tagid}&roleID=${roleID}`,
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
        setGetViewOptions(response.data.data.lstPageAcess);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { getViewOptions, loading, error };
};

export default useGetViewOptions;
