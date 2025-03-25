import axios from "axios";
import { toast } from "react-toastify";
import { format, isValid, parse } from "date-fns";

const Initiative = async (currentPage, currentFilter, filters) => {
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  console.log("formatFilters", filters);
  // Safely format date as "yyyy-MM-dd"
  const formatDate = (dateString) => {
    const date = typeof dateString === "string" ? new Date(dateString) : dateString;
    return isValid(date) ? format(date, "yyyy-MM-dd") : null; // Return null for invalid dates
  };

  // Format all filters
  const formatFilters = (filters) => {
    if (!filters) return {};

    const { FromDate, ToDate, ...rest } = filters;

    return {
      ...rest,
      ...(FromDate ? { FromDate: formatDate(FromDate) } : {}),
      ...(ToDate ? { ToDate: formatDate(ToDate) } : {})
    };
  };

  try {
    const accessToken = sessionStorage.getItem("access_token");

    console.log("currentFilter", filters);
    const formattedFilters = formatFilters(filters);
    console.log("currentFilter111", formattedFilters);

    const queryParams = new URLSearchParams({
      alterType: currentFilter,
      employeeId: employeeId,
      PageNo: currentPage,
      ...formattedFilters
    });

    const response = await axios.get(
      `${
        process.env.REACT_APP_BASEURL_ACCESS_CONTROL1
      }/api/InitiativeList/Get?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (response.status === 200) {
      // toast.success("Dashboard data fetched successfully");
      return response.data.data;
    } else {
      throw new Error("Failed to fetch dashboard data");
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    toast.error("Failed to fetch dashboard data");
    throw error;
  }
};

export default Initiative;
