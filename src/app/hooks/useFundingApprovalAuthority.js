import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleUnauthorizedResponse } from "../apiHelper";

const ApprovalAuthority = (ideaId, userId, type) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${ideaId}&userID=${userId}&FieldName=${type}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        handleUnauthorizedResponse(response);
        setData(response.data); // Adjust this based on the structure of the response
        toast.success("Data fetched successfully");
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ideaId, userId]); // Dependencies to refetch data if ideaId or userId changes

  return { data };
};

export default ApprovalAuthority;
