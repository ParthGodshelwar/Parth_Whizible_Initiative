import React, { useState, useEffect } from "react";
import {
  Label,
  Dropdown,
  TextField,
  Stack,
  DefaultButton,
  getTheme,
  mergeStyles
} from "@fluentui/react";

const SearchAdvanceForm = ({ onClose, onSearch }) => {
  const initialState = {
    initiativeCode: "",
    initiativeTitle: "",
    natureOfInitiativeID: "",
    StatusID: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [status, setStatus] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const initiativesID = 1;

  useEffect(() => {
    fetchDropdownOptions();
  }, []);
  useEffect(() => {
    fetchOptions("warehousestatus", setStatus);
  }, []);
  const fetchOptions = async (fieldName, setState) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const data = await response.json();
      setState(
        data.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Save form data to sessionStorage whenever it changes

  const fetchDropdownOptions = async () => {
    try {
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

      // Fetch other dropdowns similarly...
      // Skipping other dropdown fetches for brevity
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;
    if (fieldId == "businessGroupId") formValues.organizationUnitId = "";
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  const handleClearSearch = () => {
    setFormValues(initialState);
    // Clear sessionStorage
    onSearch(initialState);
  };

  const handleSearchClick = () => {
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "")
    );

    if (onSearch) {
      onSearch(filteredFormValues);
    }
  };

  const boxStyle = mergeStyles({
    border: `1px solid ${getTheme().palette.neutralLight}`,
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px"
  });

  const fieldWidth = { width: "330px" };

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item>
            <Label htmlFor="initiativeCode">Initiative Code</Label>
            <TextField
              id="initiativeCode"
              placeholder="Enter Initiative Code"
              value={formValues.initiativeCode}
              onChange={handleInputChange}
              styles={{ field: fieldWidth }}
            />
          </Stack.Item>

          <Stack.Item>
            <Label htmlFor="initiativeTitle">Initiative Title</Label>
            <TextField
              id="initiativeTitle"
              name="initiativeTitle"
              placeholder="Enter Initiative Title"
              value={formValues.initiativeTitle}
              onChange={handleInputChange}
              styles={{ field: fieldWidth }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label htmlFor="natureOfInitiativeID">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiativeID"
              placeholder="Select Nature of Initiative"
              options={natureOfInitiativeOptions}
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiativeID}
              styles={{ dropdown: fieldWidth }}
            />
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item>
            <Label htmlFor="StatusID">Status</Label>
            <Dropdown
              id="StatusID"
              placeholder="Select Status"
              options={status}
              onChange={handleInputChange}
              selectedKey={formValues.StatusID}
              styles={{ dropdown: fieldWidth }}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Close" onClick={onClose} />
          <DefaultButton text="Clear Search" onClick={handleClearSearch} />
          <DefaultButton text="Search" primary onClick={handleSearchClick} />
        </Stack>
      </Stack>
    </div>
  );
};

export default SearchAdvanceForm;
