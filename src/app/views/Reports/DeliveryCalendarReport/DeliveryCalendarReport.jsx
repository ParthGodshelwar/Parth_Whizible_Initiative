import React, { useEffect, useState } from "react";
import { Label, Dropdown, Stack } from "@fluentui/react";

const DeliveryCalendarReport = ({ searchFilters, formValues, setFormValues, employeeID }) => {
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

  const statusOption = [
    { key: 1, text: "Converted Initiatives"},
    { key: 2, text: "Warehouse Initiatives"},
    { key: 3, text: "Withdrawn Initiatives"}
  ]

  return (
    <div className="search-list-container">
      <div className="search-list-box ps-4 mt-3">
        <Stack tokens={{ childrenGap: 20 }}>
          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="businessGroupId">Business Group</Label>
              <Dropdown
                id="businessGroupId"
                placeholder="Select Business Group"
                options={
                  searchFilters?.initiativeBusinessGroupFilter?.map((group) => ({
                    key: group.businessGroupID,
                    text: group.businessGroup,
                  })) || []
                }
                onChange={(event, option) => {
                  handleInputChange("businessGroupId")(option.key);
                }}
                selectedKey={formValues.businessGroupId || ''}
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="NatureOfDemand" className="ms-Label">Nature of Initiative</Label>
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
                selectedKey={formValues.natureofDemandID}
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="initiativeCategory" className="ms-Label">Initiative Category</Label>
              <Dropdown
                id="initiativeCategory"
                placeholder="Select Initiative Category"
                options={
                  searchFilters?.initiativeRequestTypeFilter?.map((category) => ({
                    key: category.requestTypeID,
                    text: category.requestType
                  })) || []
                }
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("requestTypeID")(option.key);
                  }
                }}
                selectedKey={formValues.requestTypeID } 
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="IniStageStatusID">Initiative Status</Label>
              <Dropdown
                id="IniStageStatusID"
                placeholder="Select Initiative Status"
                // options={
                //   searchFilters?.initiativePriorityFilter?.map((Status) => ({
                //     key: Status.IniStageStatusID,
                //     text: Status.Status,
                //   })) || []
                // }
                options={[
                  { key: 2, text: "Converted Initiatives"},
                  { key: 3, text: "Warehouse Initiatives"},
                  { key: 1, text: "Withdrawn Initiatives"},
                ]}
                // onChange={handleInputChange}
                onChange={(event, option) => {
                  handleInputChange("IniStageStatusID")(option.key)
                }}
                selectedKey={formValues.IniStageStatusID}
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default DeliveryCalendarReport;
