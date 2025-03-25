// useSubmitAction.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom hook for handling the workflow actions (Submit, Approve, Push Back)
const useSubmitAction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitAction = async (ideaID, userID, action, comments) => {
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem("access_token");
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeWorflowActions/WorkflowActions`,
        null, // No body, data passed in query parameters
        {
          params: {
            IdeaID: ideaID,
            UserID: userID,
            Action: action,
            Comments: comments
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "*/*"
          }
        }
      );

      if (response.status === 200) {
        toast.success(`${action} action successful`);
      } else {
        throw new Error("Action failed");
      }
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to perform ${action}: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return { submitAction, loading, error };
};

export default useSubmitAction;
