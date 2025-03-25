import { useState, useEffect } from "react";
import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";

const CompletedIni = (searchFilters, currentPage) => {
  const [completedIni, setCompletedIni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = [
    searchFilters?.natureOfInitiativeId &&
      `natureOfInitiativeId=${searchFilters?.natureOfInitiativeId}`,
    searchFilters?.businessGroupId && `businessGroupId=${searchFilters?.businessGroupId}`,
    searchFilters?.organizationUnitId && `organizationUnitId=${searchFilters?.organizationUnitId}`,
    searchFilters?.DemandCode && `initiativeCode=${searchFilters?.DemandCode}`,
    searchFilters?.InitiativeTitle && `InitiativeTitle=${searchFilters?.InitiativeTitle}`
  ].filter(Boolean); // Filter out any undefined values

  // Join parameters to create the query string
  const queryString =
    params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CompletedIni/Get${queryString}`;

        const response = await axios.get(url, {
          params: {
            ...searchFilters
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status !== 200) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        handleUnauthorizedResponse(response);
        console.log("Graph Data:", response.data);
        setCompletedIni(response.data.data);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchFilters, currentPage]); // Depend on searchParams

  return { completedIni, loading, error };
};

export default CompletedIni;
