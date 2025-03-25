import { useState } from "react";
import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const usePutCurrencyMaster = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putCurrencyData = async (currencyData) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CurrencyMaster/Update`;
      const response = await axios.put(url, currencyData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      handleUnauthorizedResponse(response);
      if (response.status !== 200) {
        throw new Error("Failed to update currency data");
      }

      setResponseData(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error updating currency data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { putCurrencyData, responseData, loading, error };
};

export default usePutCurrencyMaster;
