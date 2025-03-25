import React, { useEffect, useState } from "react";
import { Label, Dropdown, Stack } from "@fluentui/react";

const NatureOfInitiativeReport = ({ searchFilters, formValues, setFormValues, employeeID }) => {
  // Added by Gauri to bind Nature of Initiative Dropdown on 19 Feb 2025
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);

  // Added by Gauri to change Nature of Initiative Dropdown on 19 Feb 2025
  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // Replace with your actual initiativesID

      // Fetch Nature of Initiative options
      const natureResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=noi&EmpID=${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!natureResponse.ok) {
        throw new Error("Failed to fetch Nature of Initiative options");
      }

      const natureData = await natureResponse.json();
      setNatureOfInitiativeOptions(
        natureData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);
  // End of Added by Gauri to change Nature of Initiative Dropdown on 19 Feb 2025

  const handleInputChange = (field) => (value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value, // Update the specific field dynamically
    }));
  };
  
  
  const fieldStyle = {
    width: "100%",
    minHeight: "36px",
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "350px",
      maxWidth: "450px",
    },
  };

  return (
    <div className="search-list-container">
      <div className="search-list-box ps-4 mt-3">
        <Stack tokens={{ childrenGap: 20 }}>
          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          {/* <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="intPeriod" className="ms-Label required">Period</Label>
              <Dropdown
                id="intPeriod" placeholder="Select Period"
                options={
                  searchFilters?.periodOption?.map((Period) => ({
                    key: Period.IPeriod,
                    text: Period.intPeriod,
                  })) || []
                }
                onChange={(event, option) => {
                  handleInputChange("intPeriod")(option.key);
                }}
                selectedKey={formValues.intPeriod}
                styles={fieldStyle}
              />
            </Stack.Item> */}
            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="intPeriod" className="ms-Label required">Period</Label>
              <Dropdown
                id="intPeriod"
                placeholder="Select Period"
                options={[
                  { key: 1, text: "Week" },
                  { key: 2, text: "Previous week" },
                  { key: 3, text: "This Month" },
                  { key: 4, text: "Previous Month" },
                  { key: 5, text: "Year To Date (This Financial Year)" },
                  { key: 6, text: "This Quarter" },
                  { key: 7, text: "Previous Quarter" },
                  { key: 8, text: "Previous Financial Year" },
                  { key: 9, text: "Next Month (Not Used)" },
                  { key: 10, text: "Year Start Date to Year End Date" },
                  { key: 11, text: "Next Week" },
                ]}
                onChange={(event, option) => {
                  // Update the formValues with the selected key (IPeriod)
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    IPeriod: option.key,
                  }));
                }}
                selectedKey={formValues.IPeriod || ""}
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="IOldNOI" className="ms-Label">Old Nature of Initiative</Label>
              {/* Commented and Added by Gauri to change Nature of Initiative Dropdown on 19 Feb 2025 */}
              <Dropdown
                id="IOldNOI"
                placeholder="Select Old Nature of Initiative"
                // options={
                //   searchFilters?.initiativeNOIFilter?.map((nature) => ({
                //     key: nature.natureofDemandID,
                //     text: nature.natureofDemand,
                //   })) || []
                // }
                options={natureOfInitiativeOptions}
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("intOldNOI")(option.key);
                  }
                }}
                selectedKey={formValues.intOldNOI } 
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="intNewNOI" className="ms-Label">New Nature of Initiative</Label>
              {/* Commented and Added by Gauri to change Nature of Initiative Dropdown on 19 Feb 2025 */}
              <Dropdown
                id="intNewNOI"
                placeholder="Select New Nature of Initiative"
                // options={
                //   searchFilters?.initiativeNOIFilter?.map((nature) => ({
                //     key: nature.natureofDemandID,
                //     text: nature.natureofDemand,
                //   })) || []
                // }
                options={natureOfInitiativeOptions}
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("intNewNOI")(option.key);
                  }
                }}
                selectedKey={formValues.intNewNOI } 
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="intEmployeeID">Modified By</Label>
              <Dropdown
                id="intEmployeeID"
                placeholder="Select Modified By"
                options={
                  searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                    key: submitter.employeeID,
                    text: submitter.submittedBy,
                  })) || []
                }
                // onChange={handleInputChange}
                onChange={(event, option) => {
                  handleInputChange("intEmployeeID")(option.key)
                }}
                selectedKey={formValues.intEmployeeID}
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default NatureOfInitiativeReport;

