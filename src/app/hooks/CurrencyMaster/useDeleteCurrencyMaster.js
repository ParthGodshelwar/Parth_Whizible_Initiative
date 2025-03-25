import { useState } from "react";
import axios from "axios";
import { handleUnauthorizedResponse } from "../../apiHelper";
const useDeleteCurrencyMaster = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteCurrencyData = async (id, logID) => {
    setLoading(true);
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/CurrencyMaster/Delete`;
      const response = await axios.delete(url, {
        data: { id, logID },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      handleUnauthorizedResponse(response);
      if (response.status !== 200) {
        throw new Error("Failed to delete currency data");
      }

      setResponseData(response.data);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting currency data:", error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteCurrencyData, responseData, loading, error };
};

export default useDeleteCurrencyMaster;
