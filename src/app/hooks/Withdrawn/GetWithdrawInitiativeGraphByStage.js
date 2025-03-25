import { useState, useEffect } from "react";
import axios from "axios";

const GetWithdrawInitiativeGraphByStage = (searchParams) => {
  const [WithdrawInitiative3, setWithdrawInitiative3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem("access_token");
        const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/WithdrawnIni/GetWithdrawInitiativeGraphByStage`;

        const response = await axios.get(url, {
          params: searchParams, // Pass searchParams as query parameters
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch currency data");
        }
        console.log("currencyData199", response.data.data.listConvertedIniByOU);
        setWithdrawInitiative3(response.data.data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching currency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]); // Depend on searchParams

  return { WithdrawInitiative3, loading, error };
};

export default GetWithdrawInitiativeGraphByStage;
