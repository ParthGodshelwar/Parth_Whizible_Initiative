import { useState } from "react";
import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const usePostCurrencyMaster = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postCurrencyData = async (currencyData) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CurrencyMaster/Add`;
      const response = await axios.post(url, currencyData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      handleUnauthorizedResponse(response);
      if (response.status !== 200) {
        throw new Error("Failed to post currency data");
      }

      setResponseData(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error posting currency data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { postCurrencyData, responseData, loading, error };
};

export default usePostCurrencyMaster;
