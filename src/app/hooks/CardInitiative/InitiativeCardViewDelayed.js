import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format, isValid, parseISO } from "date-fns";

const InitiativeCardViewDelayed = async (currentCardPage3, filters, currentFilter) => {
  const accessToken = sessionStorage.getItem("access_token");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const formatDate = (dateString) => {
    // Create a new Date object from the input string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
      console.warn("Invalid date string:", dateString);
      return null; // Return null for invalid date strings
    }

    // Format the date as "dd/MM/yyyy"
    const formattedDate = format(date, "yyyy-MM-dd");
    console.log("formattedDate", formattedDate);
    return formattedDate; // Return formatted date
  };

  // Function to format all filters
  const formatFilters = (filters) => {
    if (!filters) return {}; // Return an empty object if filters is null

    // Format initiativeFrom and initiativeTo
    const { FromDate, ToDate, ...rest } = filters;

    return {
      ...rest,
      ...(FromDate ? { FromDate: formatDate(FromDate) } : {}),
      ...(ToDate ? { ToDate: formatDate(ToDate) } : {})
    };
  };
  try {
    const formattedFilters = formatFilters(filters);
    if (currentFilter === "D") {
      return []; // Return no data when alterType is 'D'
    }

    // Construct query parameters
    const queryParams = new URLSearchParams({
      alterType: currentFilter,
      employeeId: employeeId,
      PageNo: currentCardPage3,
      ...formattedFilters // Use the formatted filters
    });
    const response = await axios.get(
      `${
        process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
      }/api/InitiativeCardView/GetInitiativeCardViewDelayed?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    console.log("dashboard88", response.data.data);
    return response.data.data.listInitiativeCardDelayedEntity;
  } catch (error) {
    console.error("Error fetching initiative cost list:", error);
    throw new Error("Failed to fetch initiative cost list");
  }
};

export default InitiativeCardViewDelayed;
