import { useState, useEffect } from "react";
import { Drawer, Select, MenuItem, TextField, Box, Tabs, Tab } from "@mui/material";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import useUpdateROI from "../../../hooks/Editpage/useUpdateROI";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";

// Mapping month names to numbers
const monthToNumber = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

const ROIDetailsDrawer = ({
  open,
  onClose,
  initialData,
  onSave,
  initiativesID,
  initiativeDetail,
  setRefresh1,
  refresh,
  acc,
  initiativeROI
}) => {
  const [month, setMonth] = useState(initialData ? initialData.month : "January");
  const [year, setYear] = useState(initialData ? initialData.year : "2023");
  const [projectedROI, setProjectedROI] = useState(initialData ? initialData.projectedROI : "");
  // Below Line Added By Durgesh Dalvi : To ensure it is the value which do not changes when the form value changes
  const [actualProjectedROI, setActualProjectedROI] = useState(
    initialData ? initialData.projectedROI : ""
  );
  const [monthlyData, setMonthlyData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  //Added By Durgesh.D
  const [editableFields, setEditableFields] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [errors, setErrors] = useState({ month: "", year: "", projectedROI: "" });
  // Added by Gauri to get Initiative End Date on 07 Mar 2025
  const [initiativeEndDate, setInitiativeEndDate] = useState(initiativeDetail.data.listInitiativeDetailEntity[11].controlValue);
  const [formState, setFormState] = useState({
    costCategory: "",
    amount: "",
    costType: "", // This will hold 0 or 1 for Recurring or Fixed
    fromDate: null,
    toDate: null,
    description: ""
  });
  const yearRange = Array.from({ length: 50 }, (_, i) => 1990 + i);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const { updateROI, loading, error } = useUpdateROI(initiativesID); // Hook to update ROI

  console.log("employeeId", initialData);
  console.log("ROI initiativeEndDate:", initiativeEndDate);
  
  // Added by Gauri to add validation alert for Initiative End Date on 07 Mar 2025
  const shortMonthToNumber = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, 
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
  };

  let initiativeEndYear = null;
  let initiativeEndMonthNumber = null;
  let initiativeEndMonthName = null;

  // Extract user-selected values
  const newYear = parseInt(year, 10); // User-selected year
  const newMonthNumber = monthToNumber[month]; // User-selected month

  if (initiativeEndDate) {
    // Extract parts of the date string
    const parts = initiativeEndDate.split(" "); // Splitting by space: ["Feb", "28", "2025", "12:00AM"]
  
    if (parts.length >= 3) {
      const monthName = parts[0]; // "Feb"
      const year = parseInt(parts[2], 10); // "2025"
  
      initiativeEndYear = isNaN(year) ? null : year; // Ensure it's a valid number
      initiativeEndMonthNumber = shortMonthToNumber[monthName]; // Convert "Feb" -> 2
      initiativeEndMonthName = monthName; // Already in correct format
    }
  }

  const handleSaveROI = async () => {
    if (!month) {
      toast.error("Month  required field.");
      return; // Stop execution if fields are missing
    }
    if (!year) {
      toast.error("Year required field.");
      return; // Stop execution if fields are missing
    }
    if (!month || !year || !projectedROI) {
      toast.error("Projected ROI  required field.");
      return; // Stop execution if fields are missing
    }

    // Convert values to numbers for comparison
    const newProjectedROI = parseFloat(projectedROI);
    const existingProjectedROI = parseFloat(actualProjectedROI);

    const totalMonthlySum = editedData.reduce((sum, item) => {
      debugger
      return sum +
        (parseFloat(item.jan) || 0) +
        (parseFloat(item.feb) || 0) +
        (parseFloat(item.mar) || 0) +
        (parseFloat(item.april) || 0) +
        (parseFloat(item.may) || 0) +
        (parseFloat(item.june) || 0) +
        (parseFloat(item.july) || 0) +
        (parseFloat(item.aug) || 0) +
        (parseFloat(item.sep) || 0) +
        (parseFloat(item.oct) || 0) +
        (parseFloat(item.nov) || 0) +
        (parseFloat(item.dec) || 0);
    }, 0);
  
    // Check if the new Projected ROI is lower than the existing one
    // if (newProjectedROI < existingProjectedROI) {
    if (newProjectedROI < totalMonthlySum) {
      toast.error(`Value entered for Projected ROI is less than total sum of all months i.e. ${totalMonthlySum}.
        \nYou will require to modify Amount distribution for each month first.`);
      return;
    }

    // Ensure initiativeROI is available
    try {
      // Prepare the request payload for both POST and PUT
      let requestData;

      if (selectedTab === 0) {
        if (initiativeROI?.length > 0) {
          // Sort to find the latest record
          const sortedList = [...initiativeROI].sort((a, b) => {
            if (a.roiYear !== b.roiYear) {
              return a.roiYear - b.roiYear;
            }
            return monthToNumber[a.monthName] - monthToNumber[b.monthName];
          });
          const lastRecord = sortedList[sortedList.length - 1]; // Get the latest record
          const newMonthNumber = monthToNumber[month];
          const newYear = parseInt(year, 10);
          const lastMonthNumber = monthToNumber[lastRecord.monthName];
          const lastYear = lastRecord.roiYear;
        
          // Modified by Gauri to check validation for existing record on 12 Mar 2025
          // Skip validation if editing the same record
          if (initialData?.id) {
            const isEditingSameRecord =
              initialData.month === month && initialData.year.toString() === year;
        
            if (!isEditingSameRecord) {
              // Validate if it's a new entry or different edit
              if (newYear < lastYear || (newYear === lastYear && newMonthNumber <= lastMonthNumber)) {
                toast.error(`Enter Month and Year Date combination greater than '${lastRecord.monthName}-${lastRecord.roiYear}'`);
                return;
              }
            }
          } else {
            // Validation for new records only
            if (newYear < lastYear || (newYear === lastYear && newMonthNumber <= lastMonthNumber)) {
              toast.error(`Enter Month and Year Date combination greater than '${lastRecord.monthName}-${lastRecord.roiYear}'`);
              return;
            }
          }      
        }      

        // Added by Gauri to add validation alert "Enter Month and Year Date combination greater than Initiative End Date on 07 Mar 2025
        if (initiativeEndYear && initiativeEndMonthNumber) {
          if (newYear < initiativeEndYear || (newYear === initiativeEndYear && newMonthNumber <= initiativeEndMonthNumber)) {
            toast.error(
              `Enter Month and Year Date combination greater than '${initiativeEndMonthName}-${initiativeEndYear}'`
            );
            return;
          }
        }        
        // End of Gauri to add validation alert "Enter Month and Year Date combination greater than Initiative End Date on 07 Mar 2025

        if (initialData?.id) {
          // If no initialData, use POST to create new ROI details
          const postUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeROI?ROIID=${initialData.id}&ROIMonth=${monthToNumber[month]}&ROIYear=${year}&ProjectedROI=${projectedROI}&UserID=${employeeId}&IdeaId=${initiativesID}`;
          const postResponse = await axios.put(postUrl, null, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          });

          if (postResponse.data) {
            toast.success("ROI Details Updated Successfully.");
            setRefresh1(!refresh);
            onClose();
            fetchCostMonthlyDistribution();
          } else {
            toast.error("Failed to save ROI details.");
          }
        } else {
          const putUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeROI?ROIMonth=${monthToNumber[month]}&ROIYear=${year}&ProjectedROI=${projectedROI}&UserID=${employeeId}&IdeaId=${initiativesID}`;
          const putResponse = await axios.post(putUrl, null, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          });

          if (putResponse.data) {
            toast.success("ROI Details Save successfully.");
            setRefresh1(!refresh);
            onClose();
            fetchCostMonthlyDistribution();
          } else {
            toast.error("Failed to update ROI details.");
          }
        }
      }
    } catch (error) {
      console.error("Error saving ROI details or monthly distribution:", error);
      toast.error("An error occurred while saving.");
    }
  };

  // Modified By Durgesh Dalvi: to pass pn properly formatted data to the api
  const handleSaveMonthDistribution = async () => {
    debugger
    try { 
      // Added by Gauri to add alert for blank values on 05 Mar 2025
      const hasBlankValue = editedData.some((item, index) => {
        return [
          "jan", "feb", "mar", "april", "may", "june",
          "july", "aug", "sep", "oct", "nov", "dec"
        ].some((month) => {
          const value = item[month];
          const initialValue = editableFields[index]?.[month]; // Get the initial value
      
          // Only show an error if the user cleared a previously filled value
          return initialValue !== "" && initialValue !== null && initialValue !== undefined && value === "";
        });
      });
      
      if (hasBlankValue) {
        toast.error("Monthly Amount should not be blank.");
        return;
      }      
      // End of Added by Gauri to add alert for blank values on 05 Mar 2025

      const hasNegativeValue = editedData.some((item) => {
        return [
        "jan",
        "feb",
        "mar",
        "april",
        "may",
        "june",
        "july",
        "aug",
        "sep",
        "oct",
        "nov",
        "dec"
        ].some((month) => {
          const value = item[month];
          return value < 0;
        });
      });

      if (hasNegativeValue) {
        toast.error("Monthly Amount should not be a negative value.");
        return;
      }

      const hasInvalidCharacter = editedData.some((item) =>
        [
          "jan",
          "feb",
          "mar",
          "april",
          "may",
          "june",
          "july",
          "aug",
          "sep",
          "oct",
          "nov",
          "dec"
        ].some((month) => {
          const value = item[month];
          return (
            value !== null && value !== undefined && value !== "" && !/^\d*\.?\d+$/.test(value)
          );
        })
      );

      if (hasInvalidCharacter) {
        toast.error("Monthly Amount should contain only positive value");
        return;
      }

      // Added by Gauri to add validation for sum of all month values on 19 Mar 2025
      const totalMonthlySum = editedData.reduce((sum, item) => {
        return sum +
          (parseFloat(item.jan) || 0) +
          (parseFloat(item.feb) || 0) +
          (parseFloat(item.mar) || 0) +
          (parseFloat(item.april) || 0) +
          (parseFloat(item.may) || 0) +
          (parseFloat(item.june) || 0) +
          (parseFloat(item.july) || 0) +
          (parseFloat(item.aug) || 0) +
          (parseFloat(item.sep) || 0) +
          (parseFloat(item.oct) || 0) +
          (parseFloat(item.nov) || 0) +
          (parseFloat(item.dec) || 0);
      }, 0);

      // if (exceedsAmount) {
      if (totalMonthlySum > actualProjectedROI) {
        debugger
        toast.error(
          `Total of all monthly distribution should not exceed Amount ${actualProjectedROI}`
        );
        return;
      }
      // End of Added by Gauri to add validation for sum of all month values on 19 Mar 2025

      const requestData = {
        roiid: initialData.id,
        monthlyDistributionROI: editedData.map((item) => ({
          roiDivisionID: item.roiid,
          jan: item.jan !== null && item.jan !== undefined ? parseFloat(item.jan) : null,
          feb: item.feb !== null && item.feb !== undefined ? parseFloat(item.feb) : null,
          mar: item.mar !== null && item.mar !== undefined ? parseFloat(item.mar) : null,
          apr: item.april !== null && item.april !== undefined ? parseFloat(item.april) : null,
          may: item.may !== null && item.may !== undefined ? parseFloat(item.may) : null,
          jun: item.june !== null && item.june !== undefined ? parseFloat(item.june) : null,
          jul: item.july !== null && item.july !== undefined ? parseFloat(item.july) : null,
          aug: item.aug !== null && item.aug !== undefined ? parseFloat(item.aug) : null,
          sep: item.sep !== null && item.sep !== undefined ? parseFloat(item.sep) : null,
          oct: item.oct !== null && item.oct !== undefined ? parseFloat(item.oct) : null,
          nov: item.nov !== null && item.nov !== undefined ? parseFloat(item.nov) : null,
          dec: item.dec !== null && item.dec !== undefined ? parseFloat(item.dec) : null
        }))
      };

      console.log("requestData:", JSON.stringify(requestData));

      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostROIMonthlyDistribution`,
        {
          method: "POST",
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          },
          body: JSON.stringify(requestData)
        }
      );

      const result = await response.json();

      if (result) {
        toast.success("Monthly distribution saved successfully.");
      } else {
        toast.error("Failed to save the data.");
      }
    } catch (error) {
      console.error("Error saving monthly distribution:", error);
      toast.error("An error occurred while saving.");
    }
  };

  const saveMonthlyDistribution = async (editedData) => {
    // Extract the monthly data
    const monthlyData = editedData[0]; // Assuming editedData has a single object

    // Prepare the request body, sending only editedData[0]
    const requestBody = { ...monthlyData };

    // Make the API request
    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostROIMonthlyDistribution`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        },
        body: JSON.stringify(requestBody)
      }
    );

    const result = await response.json();
    return result;
  };

  /* const handleFieldChange = (year, month, value) => {
    // Ensure the value is not less than 0
    const validatedValue = Math.max(1, value);

    setEditedData((prevData) =>
      prevData.map((item) => (item.year === year ? { ...item, [month]: value } : item))
    );
  }; */

  // Modified by Durgesh.D
  const handleFieldChange = (year, month, value) => {
    // Added by Gauri to Prevent negative numbers on 05 Mar 2025
    if (!/^\d*\.?\d*$/.test(value)) {
      return; 
    }

    setEditedData((prevData) =>
      prevData.map((item) =>
        item.year === year
          ? { ...item, [month]: value } // Store null as null, don't convert to -1 here
          : item
      )
    );
  };

  const fetchCostMonthlyDistribution = async () => {
    const ROIID = initialData?.id;
    const token = sessionStorage.getItem("access_token");
    console.log("fetchCostMonthlyDistribution1", formState);
    if (!token) {
      console.error("Access token is missing in session storage.");
      return null;
    }

    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeROIDetails?ROIID=${ROIID}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.data && response.data.data.listROIMonthlyDistribution) {
        setMonthlyData(response.data.data.listROIMonthlyDistribution);
        //Durgesh
        const transformedData = response.data.data.listROIMonthlyDistribution.map((item) => ({
          ...item,
          jan: item.jan === null || item.jan === undefined ? "" : item.jan,
          feb: item.feb === null || item.feb === undefined ? "" : item.feb,
          mar: item.mar === null || item.mar === undefined ? "" : item.mar,
          april: item.april === null || item.april === undefined ? "" : item.april,
          may: item.may === null || item.may === undefined ? "" : item.may,
          june: item.june === null || item.june === undefined ? "" : item.june,
          july: item.july === null || item.july === undefined ? "" : item.july,
          aug: item.aug === null || item.aug === undefined ? "" : item.aug,
          sep: item.sep === null || item.sep === undefined ? "" : item.sep,
          oct: item.oct === null || item.oct === undefined ? "" : item.oct,
          nov: item.nov === null || item.nov === undefined ? "" : item.nov,
          dec: item.dec === null || item.dec === undefined ? "" : item.dec
        }));

        setEditedData(transformedData);
        setEditableFields(transformedData);
      }
    } catch (error) {
      console.error("Error fetching cost monthly distribution data:", error);
      return null;
    }
  };
  useEffect(() => {
    if (open) {
      fetchCostMonthlyDistribution();
    }
  }, [open]);
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "100%", sm: "80vw" }, // Set width to 100% for extra-small screens, 600px for small screens and above
          padding: 2
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            backgroundColor: "#f5f5f5", // Set the background color here (light gray example)
            padding: 2 // Add padding if needed to create spacing around the content
          }}
        >
          <h5>ROI Details</h5>
          <IconButton onClick={onClose}>
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>
        </Box>

        <Box sx={{ marginBottom: 2 }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Details" sx={{ textTransform: "none" }} />
            {initialData?.projectedROI && (
              <Tab label="Monthly Distribution" sx={{ textTransform: "none" }} />
            )}
          </Tabs>
        </Box>

        {selectedTab === 0 && ( // Show input fields only in the "Details" tab
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {acc[2]?.access !== 0 && (
              <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                <PrimaryButton onClick={handleSaveROI} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </PrimaryButton>
              </Box>
            )}
            {/* Code Added By Madhuri.K On 27-Dec-2024 for Mandatory sign Comment start here */}
            <div className="col-sm-12 text-end form-group">
              <label className="form-label IM_label">
                (<span style={{ color: "red" }}>*</span> Mandatory)
              </label>
            </div>
            {/* Code Added By Madhuri.K On 27-Dec-2024 for Mandatory sign Comment end here */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box sx={{ flex: 1 }}>
                <label>
                  Month <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  value={month || ""} // Ensure the value is not undefined
                  onChange={(e) => setMonth(e.target.value)}
                  fullWidth
                  displayEmpty // Ensures the placeholder is visible when no value is selected
                  sx={{ height: 36 }}
                >
                  <MenuItem value="" disabled>
                    Select Month
                  </MenuItem>
                  {Object.keys(monthToNumber).map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
                {errors.month && <span style={{ color: "red" }}>{errors.month}</span>}
              </Box>
              <Box sx={{ flex: 1 }}>
                <label>
                  Year <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  value={year || ""} // Ensure the value is not undefined
                  onChange={(e) => setYear(e.target.value)}
                  fullWidth
                  sx={{ height: 36 }}
                  displayEmpty // Ensures the placeholder is shown even if the value is an empty string
                >
                  <MenuItem value="" disabled>
                    Select Year
                  </MenuItem>
                  {yearRange.map((yearValue) => (
                    <MenuItem key={yearValue} value={yearValue}>
                      {yearValue}
                    </MenuItem>
                  ))}
                </Select>
                {errors.year && (
                  <span style={{ color: "red", fontSize: "12px" }}>{errors.year}</span>
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <label>
                  Projected ROI <span style={{ color: "red" }}>*</span>
                </label>
                <TextField
                  value={projectedROI}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    // Regular expression to allow up to 9 digits before the decimal point and up to 2 digits after
                    if (/^\d{0,9}(\.\d{0,2})?$/.test(newValue)) {
                      setProjectedROI(newValue);
                    }
                  }}
                  type="text" // Use text to enable regex validation
                  inputProps={{
                    inputMode: "decimal" // Ensure appropriate keyboard for numeric input
                  }}
                  fullWidth
                  InputProps={{
                    style: { height: 36 } // Adjust height for TextField
                  }}
                />

                {errors.projectedROI && <span style={{ color: "red" }}>{errors.projectedROI}</span>}
              </Box>
            </Box>
          </Box>
        )}

        {selectedTab === 1 && ( // Show blank space for "Monthly Distribution" tab
          <Box sx={{ padding: 2 }}>
            {acc[2]?.access !== 0 && (
              <div style={{ textAlign: "right" }} className="mb-2">
                <PrimaryButton onClick={handleSaveMonthDistribution}>Save</PrimaryButton>
              </div>
            )}
            <table className="table table-bordered">
              <thead>
                <tr>
                  {/* Added col-sm-1 by Gauri to make consistent columns on 08 Feb 2025 */}
                  <th>Year</th>
                  <th className="col-sm-1">January</th>
                  <th className="col-sm-1">February</th>
                  <th className="col-sm-1">March</th>
                  <th className="col-sm-1">April</th>
                  <th className="col-sm-1">May</th>
                  <th className="col-sm-1">June</th>
                  <th className="col-sm-1">July</th>
                  <th className="col-sm-1">August</th>
                  <th className="col-sm-1">September</th>
                  <th className="col-sm-1">October</th>
                  <th className="col-sm-1">November</th>
                  <th className="col-sm-1">December</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((item) => (
                  <tr key={item.year}>
                    <td>{item.year}</td>
                    {[
                      "jan",
                      "feb",
                      "mar",
                      "april",
                      "may",
                      "june",
                      "july",
                      "aug",
                      "sep",
                      "oct",
                      "nov",
                      "dec"
                    ].map((month, index) => {
                      //const currentValue =
                      //editedData.find((i) => i.year === item.year)?.[month] || "";

                      // const isEditable = currentValue !== ""; // Make it editable only if the data is present

                      //Durgesh

                      const currentValue = editedData.find((i) => i.year === item.year)?.[month];

                      // const displayValue =
                      //  currentValue === null || currentValue === undefined ? "" : currentValue;

                      const initialValue = editableFields.find((i) => i.year === item.year)?.[
                        month
                      ];
                      const isEditable = initialValue !== "" && initialValue !== undefined;

                      return (
                        //Modified By Durgesh Dalvi : implemented disabled attribute
                        <td key={month}>
                          <Tooltip title={`Current value: ${currentValue}`}>
                            <input
                              className="form-control"
                              value={currentValue}
                              style={{ fontSize: "12px" }}
                              onChange={(e) => handleFieldChange(item.year, month, e.target.value)}
                              disabled={!isEditable}
                            />
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ROIDetailsDrawer;
