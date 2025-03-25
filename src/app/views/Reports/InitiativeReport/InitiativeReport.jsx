
import React, { useEffect, useState } from "react";
import { Label, Dropdown, Stack, TextField, DatePicker } from "@fluentui/react";

const InitiativeReport = ({ searchFilters, formValues, setFormValues, employeeID }) => {
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
    const handleDateChange = (date, id) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: date
    }));
  };
  return (
    <div className="search-list-container">
      <div className="search-list-box ps-4 mt-3">
        <Stack tokens={{ childrenGap: 20 }}>
          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="NatureOfDemand" className="ms-Label required">Nature of Initiative</Label>
              {/* Commented and Added by Gauri to change Nature of Initiative Dropdown on 19 Feb 2025 */}
              <Dropdown
                id="NatureOfDemand"
                placeholder="Select Nature of Initiative"
                // options={
                //   searchFilters?.initiativeNOIFilter?.map((nature) => ({
                //     key: nature.natureofDemandID,
                //     text: nature.natureofDemand,
                //   })) || []
                // }
                options={natureOfInitiativeOptions}
                // onChange={handleInputChange}
                onChange={(event, option) => {
                  handleInputChange("natureOfDemand")(option.key)
                }}
                // selectedKey={formValues.natureofDemandID}
                selectedKey={formValues.natureOfDemand ?? undefined} // Ensure reset works
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="initiativeTitle" className="ms-Label">Initiative Title</Label>
            <TextField
              id="initiativeTitle"
              name="initiativeTitle"
              placeholder="Enter Initiative Title"
              value={formValues.initiativeTitle}
              onChange={(e, newValue) => handleInputChange("initiativeTitle")(newValue)}
              styles={fieldStyle}
            />
            </Stack.Item>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
               <Label htmlFor="StartDate" className="ms-Label">Initiative Between Start Date</Label>
                <DatePicker
                  id="StartDate"
                  placeholder="Select Start Date"
                  ariaLabel="Select Start Date"
                  value={formValues.StartDate}
                  onSelectDate={(date) => handleDateChange(date, "StartDate")}
                  styles={fieldStyle}
                />
              </Stack.Item>
              <Stack.Item grow styles={stackItemStyle}>
               <Label htmlFor="EndDate" className="ms-Label">End Date</Label>
                <DatePicker
                  id="EndDate"
                  placeholder="Select End Date"
                  ariaLabel="Select End Date"
                  value={formValues.EndDate}
                  onSelectDate={(date) => handleDateChange(date, "EndDate")}
                  styles={fieldStyle}
                />
              </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default InitiativeReport;



