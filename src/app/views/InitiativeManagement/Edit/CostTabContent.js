import React, { useState, useEffect } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { Stack } from "@fluentui/react/lib/Stack";
import Drawer from "@mui/material/Drawer";
import { Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import "@fluentui/react/dist/css/fabric.css";
import { Tooltip } from "@mui/material";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { TextField } from "@fluentui/react/lib/TextField";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { Tabs, Tab, Box } from "@mui/material";
import { Dropdown } from "@fluentui/react";
import debounce from "lodash.debounce";
import CostDetailsForm from "./CostDetailsForm";
import { Dialog, DialogFooter, DialogType } from "@fluentui/react";

const formatDate = (dateString, format = "yyyy/mm/dd") => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return format === "yyyy/mm/dd" ? `${year}/${month}/${day}` : `${day}/${month}/${year}`;
};

const CostTabContent = ({ costData, initiativesID, setRefresh1, refresh, show, acc }) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]); // Cost Category options
  const [monthlyData, setMonthlyData] = useState([]);
  const [id, setid] = useState();
  const [planToDelete, setPlanToDelete] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [individualChecks, setIndividualChecks] = useState(
    costData?.data?.listInitiativeCostListEntity
      ? costData.data.listInitiativeCostListEntity.map(() => false)
      : []
  );
  const [showDrawer, setShowDrawer] = useState(false);

  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [showDetailTab, setShowDetailTab] = useState(true);
  const [showMonthlyDistribution, setShowMonthlyDistribution] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [formState, setFormState] = useState({
    costCategory: "",
    costCategoryID: "",
    amount: "",
    costType: "", // This will hold 0 or 1 for Recurring or Fixed
    fromDate: null,
    toDate: null,
    description: ""
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  console.log("costData", costData);

  const openDrawer = () => {
    setShowDrawer(true);
    setShowDetailTab(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedTab(0);
    setShowDetailTab(false);
    // Reset form state when closing drawer
    setFormState({
      costCategoryID: "",
      costCategory: "",
      amount: "",
      costType: "",
      fromDate: null,
      toDate: null,
      description: ""
    });
  };

  console.log("costItem12", formState);
  useEffect(() => {
    if (showDrawer) {
      fetchRoleOptions();
      fetchCostMonthlyDistribution();
    }
  }, [showDrawer]);

  const fetchRoleOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      // Fetch Cost Category
      const categoryResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=costcategory`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!categoryResponse.ok) {
        throw new Error("Failed to fetch cost category options");
      }

      const categoryData = await categoryResponse.json();
      const categoryOptions = categoryData?.data?.listInitiativeDetailDropDownEntity?.map(
        (role) => ({
          key: role.id,
          text: role.name
        })
      );

      setRoleOptions(categoryOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const toggleMonthlyDistribution = () => {
    setShowMonthlyDistribution(!showMonthlyDistribution);
  };

  const handleSave = async () => {
    try {
      //Added By : Durgesh.D
      const hasNullValues = editedData.some((item) => {
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
          const currentMonthDate = new Date(
            item.year,
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
            ].indexOf(month)
          );
          const isWithinRange = (() => {
            if (!formState?.fromDate || !formState?.toDate) {
              return false;
            }

            const extractMonthYear = (date) => {
              const normalized = new Date(date);
              return {
                year: normalized.getFullYear(),
                month: normalized.getMonth()
              };
            };

            const fromDateParts = extractMonthYear(formState.fromDate);
            const toDateParts = extractMonthYear(formState.toDate);
            const currentMonthParts = extractMonthYear(currentMonthDate);

            return (
              (currentMonthParts.year > fromDateParts.year ||
                (currentMonthParts.year === fromDateParts.year &&
                  currentMonthParts.month >= fromDateParts.month)) &&
              (currentMonthParts.year < toDateParts.year ||
                (currentMonthParts.year === toDateParts.year &&
                  currentMonthParts.month <= toDateParts.month))
            );
          })();
          const isDisabled = !isWithinRange;
          return !isDisabled && (value === null || value === "");
        });
      });

      if (hasNullValues) {
        toast.error("Monthly Amount should not be blank.");
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

      console.log("editedData11", JSON.stringify(editedData));

      // Check if any value exceeds formState1.amount
      const { amount } = formState;

      // Calculate if any item's monthly sum exceeds the total amount
      //Modified By : Durgesh.D
      const exceedsAmount = editedData.some((item) => {
        const totalMonthlySum =
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

        console.log("totalMonthlySum" + totalMonthlySum);
        console.log("amount" + amount);
        return totalMonthlySum > amount;
      });

      // Display an error message if any item's total monthly sum exceeds the total amount
      if (exceedsAmount) {
        toast.error(`Total of all monthly distribution should not exceed Amount ${amount}`);
        return;
      }

      //Added By Durgesh.D
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
      // Format the request body according to the desired structure
      const requestData = {
        costID: 0, // Assuming this is 0 for now or needs to come from somewhere else
        monthlyDistributionCost: editedData.map((item) => ({
          costDivisionID: item.costDetailID, // Adjust to match the correct field for costDivisionID
          jan: item.jan || 0,
          feb: item.feb || 0,
          mar: item.mar || 0,
          apr: item.april || 0,
          may: item.may || 0,
          jun: item.june || 0,
          jul: item.july || 0,
          aug: item.aug || 0,
          sep: item.sep || 0,
          oct: item.oct || 0,
          nov: item.nov || 0,
          dec: item.dec || 0,
          year: item.year || 0 // passed year by Gauri on 12 Feb 2025
        }))
      };

      // Call the save API
      const result = await saveMonthlyDistribution(requestData);
      if (result && result.data === "Success") {
        toast.success("Monthly distribution saved successfully.");
      } else {
        toast.error("Failed to save the data.");
      }
    } catch (error) {
      console.error("Error saving monthly distribution:", error);
      toast.error("An error occurred while saving.");
    }
  };

  // const handleSaveClick = async ({ formState1 }) => {
  //   const { costCategoryID, costType, amount, fromDate, toDate } = formState1;
  //   console.log("formState", formState1);

  //   // Track missing fields
  //   if (!costCategoryID) {
  //     toast.error("Cost Category should not be left blank");
  //     return;
  //   }
  //   // if (!costType) {
  //   //   toast.error("Cost Type should not be left blank");
  //   //   return;
  //   // }
  //   if (!amount) {
  //     toast.error("Amount should not be left blank");
  //     return;
  //   }
  //   // Alert toast added by Gauri, If 'Amount is not greater than 0' start here on 06 Feb 2025
  //   if (!(amount > 0)) {
  //     toast.error("Amount should be greater than 0.");
  //     return;
  //   }
  //   // Alert toast added by Gauri, If 'Amount is not greater than 0' end here on 06 Feb 2025
  //   if (!fromDate) {
  //     toast.error("From Date should not be left blank");
  //     return;
  //   }
  //   if (!toDate) {
  //     toast.error("To Date should not be left blank");
  //     return;
  //   }
  //   if (!formState1.description) {
  //     toast.error("Description should not be left blank");
  //     return;
  //   }
  //   if (new Date(toDate) < new Date(fromDate)) {
  //     toast.error("'From Date' should not be greater than 'To Date'.");
  //     return;
  //   }
  //   // Set costType value based on selected cost type
  //   const costTypeValue = costType;

  //   // Prepare the query string parameters
  //   const queryString = new URLSearchParams({
  //     CostCategoryID: costCategoryID,
  //     CostType: costTypeValue,
  //     Amount: amount,
  //     StartDate: formatDate(fromDate, "yyyy/mm/dd"),
  //     EndDate: formatDate(toDate, "yyyy/mm/dd"),
  //     Description: formState1.description,
  //     UserID: employeeId,
  //     IdeaID: initiativesID
  //   }).toString();

  //   const accessToken = sessionStorage.getItem("access_token");

  //   try {
  //     let response;

  //     if (formState1?.costDetailID) {
  //       // Use the Update API if id is present (PUT request)
  //       response = await axios.put(
  //         `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeCost?CostID=${formState1?.costDetailID}&${queryString}`,
  //         {}, // No request body required if data is in the query string
  //         {
  //           headers: {
  //             Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
  //             Accept: "*/*"
  //           }
  //         }
  //       );
  //     } else {
  //       // Use the Post API if id is not present (POST request)
  //       response = await axios.post(
  //         `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeCost?${queryString}`,
  //         {}, // POST might not need an empty body if you pass all data via query string
  //         {
  //           headers: {
  //             Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
  //             Accept: "*/*"
  //           }
  //         }
  //       );
  //     }

  //     const result = response?.data?.data?.[0]?.result;
  //     if (result && result.toLowerCase() === "success") {
  //       console.log("Cost details updated successfully!", response);
  //       if (formState1?.costDetailID) toast.success("Cost Updated successfully!");
  //       else toast.success("Cost details saved successfully! ");
  //       setRefresh1(!refresh); // Trigger refresh to update UI
  //       closeDrawer(); // Close the drawer after success
  //     } else {
  //       // Show the result message returned from the API if it exists
  //       toast.error(result || "An unexpected error occurred.");
  //     }
  //   } catch (error) {
  //     // On Failure
  //     console.error("Error updating cost data", error);
  //     toast.error("Failed to update cost data. Please try again.");
  //   }
  // };

  const handleSaveClick = async ({ formState1 }) => {
    const { costCategoryID, costType, amount, fromDate, toDate } = formState1;
    console.log("formState", formState1);

    // Track missing fields
    if (!costCategoryID) {
      toast.error("Cost Category should not be left blank");
      return;
    }

    if (!amount) {
      toast.error("Amount should not be left blank");
      return;
    }

    if (!(amount > 0)) {
      toast.error("Amount should be greater than 0.");
      return;
    }

    if (!fromDate) {
      toast.error("From Date should not be left blank");
      return;
    }
    if (!toDate) {
      toast.error("To Date should not be left blank");
      return;
    }
    if (!formState1.description) {
      toast.error("Description should not be left blank");
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      toast.error("'From Date' should not be greater than 'To Date'.");
      return;
    }

    // Set costType value based on selected cost type
    const costTypeValue = costType;

    // Prepare the query string parameters
    const queryString = new URLSearchParams({
      CostCategoryID: costCategoryID,
      CostType: costTypeValue,
      Amount: amount,
      StartDate: formatDate(fromDate, "yyyy/mm/dd"),
      EndDate: formatDate(toDate, "yyyy/mm/dd"),
      Description: formState1.description,
      UserID: employeeId,
      IdeaID: initiativesID
    }).toString();

    try {
      let response;
      const accessToken = sessionStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "*/*"
      };

      if (formState1?.costDetailID) {
        // Use the Update API if id is present (PUT request)
        response = await axios.put(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeCost?CostID=${formState1?.costDetailID}&${queryString}`,
          {},
          { headers }
        );
      } else {
        // Use the Post API if id is not present (POST request)
        response = await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeCost?${queryString}`,
          {},
          { headers }
        );
      }

      const result = response?.data?.data?.[0]?.result;

      if (result && result.toLowerCase() === "success") {
        console.log("Cost details updated successfully!", response);
        toast.success(
          formState1?.costDetailID
            ? "Cost Updated successfully!"
            : "Cost details saved successfully!"
        );
        setRefresh1(!refresh);
        closeDrawer();
      } else if (result && result.toLowerCase().includes("already present")) {
        // If the response contains duplicate cost message, show only one toast
        toast.error("The cost is already present for selected dates.");
      } else {
        toast.error(result || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error updating cost data", error);

      // Check if the error response contains duplicate entry information
      if (error.response?.data?.message?.toLowerCase().includes("already present")) {
        toast.error("The cost is already present for selected dates.");
      } else {
        toast.error("Failed to update cost data. Please try again.");
      }
    }
  };

  const handleCostCategoryClick = async (costItem) => {
    const token = sessionStorage.getItem("access_token"); // Get the token from session storage
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeCostDetails?CostDetailsID=${costItem?.costDetailID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );
      setFormState({
        costDetailID: costItem?.costDetailID,
        costCategoryID: String(costItem.costCategoryID),
        costCategory: costItem.costCategory, // Assuming this is the ID for the cost category
        amount: costItem.amount,
        costType: response.data?.data.listInitiativeCost[0].costType, // This should be either 0 or 1
        fromDate: new Date(costItem.startDate),
        toDate: new Date(costItem.endDate),
        description: costItem.description
      });
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching cost details:", error);
    }

    console.log("costItem12", costItem, formState);
    openDrawer();
  };

  const fetchCostMonthlyDistribution = async () => {
    const token = sessionStorage.getItem("access_token");
    console.log("fetchCostMonthlyDistribution1", formState);
    if (!token) {
      console.error("Access token is missing in session storage.");
      return null;
    }

    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetCostMonthlyDistribution?CostDetailsID=${formState.costDetailID}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.data && response.data.data.listMonthlyDistribution) {
        setMonthlyData(response.data.data.listMonthlyDistribution);
        console.log("costDetailID", response.data.data.listMonthlyDistribution[0].costDetailID);
        setid(response.data.data.listMonthlyDistribution[0].costDetailID);
        setEditedData(
          response.data.data.listMonthlyDistribution.map((item) => ({
            ...item,
            jan: item.jan || "",
            feb: item.feb || "",
            mar: item.mar || "",
            april: item.april || "",
            may: item.may || "",
            june: item.june || "",
            july: item.july || "",
            aug: item.aug || "",
            sep: item.sep || "",
            oct: item.oct || "",
            nov: item.nov || "",
            dec: item.dec || "",
            year: item.year || ""
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching cost monthly distribution data:", error);
      return null;
    }
  };
  const handleFieldChange = (year, month, value) => {
    setEditedData((prevData) =>
      prevData.map((item) => (item.year === year ? { ...item, [month]: value } : item))
    );
  };
  const saveMonthlyDistribution = async (editedData) => {
    console.table("editedData", editedData);
    const requestBody = {
      ...editedData
    };

    const response = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostCostMonthlyDistribution`,
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

  // Add the radio button handling logic for costType

  console.log("selectedTab1111", formState);
  const DrawerContent = () => (
    <div style={{ width: "80vw", padding: 20 }}>
      <div id="initcost_Sec" className="inithistDetails">
        <div className="graybg container-fluid py-2 mb-2" style={{ backgroundColor: "lightgrey" }}>
          <div className="row">
            <div className="col-sm-10">
              <h5 className="offcanvasTitle">Cost Details</h5>
            </div>
            <div className="col-sm-2 text-end">
              <IconButton onClick={closeDrawer}>
                <Tooltip title="Close">
                  <CloseIcon />
                </Tooltip>
              </IconButton>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Cost Details Tabs"
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Details" sx={{ textTransform: "none" }} />
            {formState?.costCategory && (
              <Tab label="Monthly Distribution" sx={{ textTransform: "none" }} />
            )}
          </Tabs>
          <div className="tab-content detailsmenutab">
            {selectedTab == 0 && (
              <CostDetailsForm
                formState1={formState}
                handleSaveClick={handleSaveClick}
                roleOptions={roleOptions}
                acc={acc}
              />
            )}
            {selectedTab === 1 && (
              <Box sx={{ padding: 2 }}>
                <div style={{ textAlign: "right" }} className="mb-2">
                  {acc[2]?.access !== 0 && <PrimaryButton onClick={handleSave}>Save</PrimaryButton>}
                </div>
                <Table className="table table-bordered">
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
                          const currentValue =
                            editedData.find((i) => i.year === item.year)[month] || "";

                          // Create a date for the current month
                          const currentMonthDate = new Date(item.year, index); // Index represents month (0=Jan, 11=Dec)

                          // Check if currentMonthDate falls within the range of fromDate and toDate
                          const isWithinRange = (() => {
                            if (!formState?.fromDate || !formState?.toDate) {
                              return false;
                            }

                            const extractMonthYear = (date) => {
                              const normalized = new Date(date);
                              return {
                                year: normalized.getFullYear(),
                                month: normalized.getMonth()
                              };
                            };

                            const fromDateParts = extractMonthYear(formState.fromDate);
                            const toDateParts = extractMonthYear(formState.toDate);
                            const currentMonthParts = extractMonthYear(currentMonthDate);

                            return (
                              (currentMonthParts.year > fromDateParts.year ||
                                (currentMonthParts.year === fromDateParts.year &&
                                  currentMonthParts.month >= fromDateParts.month)) &&
                              (currentMonthParts.year < toDateParts.year ||
                                (currentMonthParts.year === toDateParts.year &&
                                  currentMonthParts.month <= toDateParts.month))
                            );
                          })();

                          return (
                            <td key={month}>
                              <Tooltip title={`Current value: ${currentValue}`}>
                                {/* Added fontSize by Gauri on 08 Feb 2025 */}
                                <div
                                  contentEditable={isWithinRange ? "true" : "false"}
                                  suppressContentEditableWarning={true} // This is required to avoid React warning
                                  style={{
                                    fontSize: "12px",
                                    height: "25px",
                                    borderRadius: "5px",
                                    padding: "4px",
                                    border: `1px solid ${isWithinRange ? "lightgray" : "EDEDED"}`, // Add border conditionally
                                    backgroundColor: isWithinRange ? "white" : "#EDEDED" // Background color based on disabled state
                                  }}
                                  onBlur={(e) => {
                                    handleFieldChange(item.year, month, e.target.innerText); // Get inner text on blur
                                  }}
                                >
                                  {currentValue}
                                </div>
                              </Tooltip>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  const handleDelete = (docId) => {
    console.log("planToDelete", planToDelete);
    const accessToken = sessionStorage.getItem("access_token");

    if (!accessToken) {
      toast.error("Access token not found. Please log in again.");
      return;
    }

    // Get the user ID from sessionStorage
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const userId = userdata?.employeeId;

    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    // Construct the API URL with the provided docId
    const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeCostDelete?CostDetailsID=${planToDelete?.costDetailID}&UserID=${userId}`;

    // Set up the request headers, including the authorization token
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    // Make the API call to delete the document
    fetch(apiUrl, {
      method: "DELETE", // Using DELETE method as it's for deletion
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the document");
        }
        setRefresh1(!refresh);
        return response.json();
      })
      .then((data) => {
        setShowDeleteModal(false);
        toast.success(`Cost details deleted successfully!`);
        // Optionally, update the UI or data after the deletion (e.g., refresh the list)
      })
      .catch((error) => {
        console.error("Error deleting document:", error);
        toast.error(`Error deleting document!`);
      });
  };

  return (
    <>
      <Stack
        className="mb-2"
        horizontal
        tokens={{ childrenGap: 10 }}
        horizontalAlign="space-between"
      >
        <div></div>
        {acc[0]?.access !== 0 && (
          <PrimaryButton
            onClick={() => {
              setid(""); // Reset the id state
              openDrawer(); // Open the drawer
            }}
          >
            Add
          </PrimaryButton>
        )}
      </Stack>

      <Drawer anchor="right" open={showDrawer} onClose={closeDrawer}>
        <DrawerContent />
      </Drawer>
      <div className="cost-data-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cost Category</th>
              <th>Amount</th>
              {/* <th>Cost Type</th> */}
              <th>Start Date</th>
              <th>End Date</th>
              {/* <th>Description</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {costData?.data?.listInitiativeCostListEntity?.length > 0 ? (
              costData.data.listInitiativeCostListEntity.map((costItem, index) => (
                <tr key={costItem.id}>
                  <td>{costItem.costCategory}</td>
                  <td>{costItem.amount}</td>
                  {/* <td>{costItem.costType === 0 ? "Recurring" : "Fixed"}</td> */}
                  <td>
                    {new Date(costItem.startDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  <td>
                    {new Date(costItem.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </td>
                  {/* <td>{costItem.description}</td> */}
                  <td>
                    <IconButton onClick={() => handleCostCategoryClick(costItem)}>
                      <Tooltip title="Edit">
                        <EditIcon />
                      </Tooltip>
                    </IconButton>
                    {acc[1]?.access !== 0 && (
                      <IconButton
                        onClick={() => {
                          setPlanToDelete(costItem);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Tooltip title="Delete">
                          <DeleteIcon />
                        </Tooltip>
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  There are no items to show in this view.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Drawer anchor="right" open={showDrawer} onClose={closeDrawer}>
        <DrawerContent />
      </Drawer>
      <Dialog
        hidden={!showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Confirm Delete",
          subText: "Are you sure, you want to delete this record?"
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={handleDelete} text="Yes" />
          <PrimaryButton onClick={() => setShowDeleteModal(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default CostTabContent;
