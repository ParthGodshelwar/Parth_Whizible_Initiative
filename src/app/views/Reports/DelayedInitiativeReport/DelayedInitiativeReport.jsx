
import React, { useEffect, useState } from "react";
import { Label, Dropdown, Stack } from "@fluentui/react";

const DelayedInitiativeReport = ({ searchFilters, formValues, setFormValues, employeeID }) => {
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

  // const handleInputChange = (e, option) => {
  //   const fieldId = e.target.id || e.target.name; // Use name if id is not available
  //   const value = option.key ? option.key : e.target.value;

  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [fieldId]: value,
  //   }));
  // };
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
                // selectedKey={formValues.natureofDemandID}
                selectedKey={formValues.natureOfDemand ?? undefined}
                styles={fieldStyle}
              />
            </Stack.Item>

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="priorityId">Priority</Label>
              <Dropdown
                id="priorityId"
                placeholder="Select Priority"
                options={
                  searchFilters?.initiativePriorityFilter?.map((priority) => ({
                    key: priority.priorityID,
                    text: priority.priority,
                  })) || []
                }
                // onChange={handleInputChange}
                onChange={(event, option) => {
                  handleInputChange("priorityId")(option.key)
                }}
                selectedKey={formValues.priorityId}
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="selectPlanningManager" className="ms-Label">Planning Manager</Label>
              <Dropdown
                id="selectPlanningManager"
                placeholder="Select Planning Manager"
                options={
                  searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                    key: submitter.employeeID,
                    text: submitter.submittedBy,
                  })) || []
                }
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("PlanningManager")(option.key);
                  }
                }}
                selectedKey={formValues.PlanningManager } 
                styles={fieldStyle}
              />
            </Stack.Item>

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
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default DelayedInitiativeReport;
