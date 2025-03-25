import { useState, useEffect } from "react";
import axios from "axios";

const WareHouseIni = (searchFilters, currentPage) => {
  const [wareHouseIni, setWareHouseIni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = [
    searchFilters?.natureOfInitiativeId &&
      `natureOfInitiativeId=${searchFilters?.natureOfInitiativeId}`,
    searchFilters?.businessGroupId && `businessGroupId=${searchFilters?.businessGroupId}`,
    searchFilters?.organizationUnitId && `Status=${searchFilters?.organizationUnitId}`,
    searchFilters?.demandCode && `initiativeCode=${searchFilters?.demandCode}`,
    searchFilters?.initiativeTitle && `Title=${searchFilters?.initiativeTitle}`,
    searchFilters?.ConvertedTo && `ConvertedTo=${searchFilters?.ConvertedTo}`
  ].filter(Boolean); // Filter out any undefined values

  // Join parameters to create the query string
  const queryString =
    params.length > 0 ? `?${params.join("&")}&PageNo=${currentPage}` : `?PageNo=${currentPage}`;
  console.log("DemandCodeDemandCode", queryString);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WareHouseIni/Get${queryString}`;

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

        console.log("Graph Data:", response.data);
        setWareHouseIni(response.data.data);
      } catch (error) {
        setError(error.message || "An unexpected error occurred");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchFilters, currentPage]); // Depend on searchParams

  return { wareHouseIni, loading, error };
};

export default WareHouseIni;
