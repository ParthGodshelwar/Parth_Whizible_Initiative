import React, { useEffect, useState } from "react";
import { Label, Dropdown, Stack, TextField } from "@fluentui/react";

const ActionItemsReport = ({ searchFilters, formValues, setFormValues, employeeID }) => {
  
  const [statusOptions, setStatusOptions] = useState([]);

  const handleInputChange = (field) => (value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value, // Update the specific field dynamically
    }));
  };

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // Replace with your actual initiativesID

      // Fetch Status options
      const statusResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=actionstatus&EmpID=${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!statusResponse.ok) {
        throw new Error("Failed to fetch Nature of Initiative options");
      }

      const statusData = await statusResponse.json();
      setStatusOptions(
        statusData.data.listInitiativeDetailDropDownEntity.map((item) => ({
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

            <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="SubmittedByID">Submitted By</Label>
              <Dropdown
                id="SubmittedByID"
                placeholder="Select Submitted By"
                options={
                  searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                    key: submitter.employeeID,
                    text: submitter.submittedBy,
                  })) || []
                }
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("SubmittedByID")(option.key);
                  }
                }}
                selectedKey={formValues.SubmittedByID } 
                styles={fieldStyle}
              />
            </Stack.Item> 
          </Stack>

          <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="selectAssignedTo">Assigned To</Label>
              <Dropdown
                id="selectAssignedTo"
                placeholder="Select Assigned To"
                options={
                  searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                    key: submitter.employeeID,
                    text: submitter.submittedBy,
                  })) || []
                }
                onChange={(event, option) => {
                  if (option) {
                    handleInputChange("AssignedTo")(option.key);
                  }
                }}
                selectedKey={formValues.AssignedTo } 
                styles={fieldStyle}
              />
            </Stack.Item> 
           <Stack.Item grow styles={stackItemStyle}>
              <Label htmlFor="IniStageStatusID">Status</Label>
              <Dropdown
                id="IniStageStatusID"
                placeholder="Select Status"
                // options={
                //   searchFilters?.initiativePriorityFilter?.map((Status) => ({
                //     key: Status.IniStageStatusID,
                //     text: Status.Status,
                //   })) || []
                // }
                options={statusOptions}
                onChange={(event, option) => {
                  handleInputChange("StatusID")(option.key)
                }}
                selectedKey={formValues.StatusID}
                styles={fieldStyle}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default ActionItemsReport;

