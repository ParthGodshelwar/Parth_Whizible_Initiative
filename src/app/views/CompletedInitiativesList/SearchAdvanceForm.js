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
import fetchFilters from "../../hooks/SearchFilters/filters";

const SearchAdvanceForm = ({ onClose, onSearch }) => {
  const initialState = {
    natureOfInitiativeId: "",
    businessGroupId: "",
    organizationUnitId: "",
    initiativeCode: "",
    initiativeTitle: ""
    // Commented By Madhuri.K On 16-Dec-2024
    // CompletedTo: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [organizationUnitOptions, setOrganizationUnitOptions] = useState([]);
  const [CompletedToOptions, setCompletedToOptions] = useState([]);
  const [selectedBusinessGroup, setSelectedBusinessGroup] = useState(
    formValues.businessGroupId || null // Load saved selection
  );

  useEffect(() => {
    // Retrieve saved form values from sessionStorage
    const savedFormValues = JSON.parse(sessionStorage.getItem("formValues"));
    if (savedFormValues) {
      setFormValues(savedFormValues);
      setSelectedBusinessGroup(savedFormValues.businessGroupId || null);
    }

    fetchDropdownOptions();
  }, []);

  useEffect(() => {
    // Update organization unit options based on the selected business group
    if (selectedBusinessGroup) {
      const businessGroup = businessGroupOptions.find((bg) => bg.key === selectedBusinessGroup);
      if (businessGroup) {
        setOrganizationUnitOptions(
          businessGroup.initiativeLocationFilter.map((location) => ({
            key: location.locationID,
            text: location.location
          }))
        );
      } else {
        setOrganizationUnitOptions([]);
      }
    } else {
      setOrganizationUnitOptions([]); // Clear options if no business group is selected
    }
  }, [selectedBusinessGroup, businessGroupOptions]);

  // Save form values to sessionStorage whenever they change
  // useEffect(() => {
  //   sessionStorage.setItem("searchFormValues", JSON.stringify(formValues));
  // }, [formValues]);

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // replace with your actual initiativesID
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

      // Fetch Business Group options
      const data = await fetchFilters(); // Call the imported filters function
      setBusinessGroupOptions(
        data?.initiativeBusinessGroupFilter?.map((group) => ({
          key: group.businessGroupID,
          text: group.businessGroup,
          initiativeLocationFilter: group.initiativeLocationFilter // Add locations to the group
        }))
      );

      // Fetch Completed To options
      const CompletedToResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=convertedto`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!CompletedToResponse.ok) {
        throw new Error("Failed to fetch Completed To options");
      }

      const CompletedToData = await CompletedToResponse.json();
      setCompletedToOptions(
        CompletedToData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;

    const updatedFormValues = {
      ...formValues,
      [fieldId]: value
    };
    if (fieldId == "businessGroupId") updatedFormValues.organizationUnitId = "";
    setFormValues(updatedFormValues);

    // Save updated form values to sessionStorage
    sessionStorage.setItem("formValues", JSON.stringify(updatedFormValues));

    if (fieldId === "businessGroupId") {
      setSelectedBusinessGroup(value);
    }
  };

  const handleClearSearch = () => {
    setFormValues(initialState);
    setSelectedBusinessGroup(null);
    onSearch(initialState);
    setOrganizationUnitOptions([]);

    // Clear saved form values from sessionStorage
    sessionStorage.removeItem("formValues");
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

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "250px",
      maxWidth: "350px"
    }
  };

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="natureOfInitiativeId">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiativeId"
              placeholder="Select Nature of Initiative"
              options={natureOfInitiativeOptions}
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiativeId}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="businessGroupId">Business Group</Label>
            <Dropdown
              id="businessGroupId"
              placeholder="Select Business Group"
              options={businessGroupOptions}
              onChange={handleInputChange}
              selectedKey={formValues.businessGroupId}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="organizationUnitId">Organization Unit</Label>
            <Dropdown
              id="organizationUnitId"
              placeholder="Select Organization Unit"
              options={organizationUnitOptions}
              onChange={handleInputChange}
              selectedKey={formValues.organizationUnitId}
              styles={{ dropdown: { width: "100%" } }}
              disabled={!selectedBusinessGroup} // Disable if no business group is selected
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeCode">Initiative Code</Label>
            <TextField
              id="initiativeCode"
              name="initiativeCode"
              placeholder="Enter Initiative Code"
              value={formValues.initiativeCode}
              onChange={handleInputChange}
              styles={stackItemStyle}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeTitle">Initiative Title</Label>
            <TextField
              id="initiativeTitle"
              name="initiativeTitle"
              placeholder="Enter Initiative Title"
              value={formValues.initiativeTitle}
              onChange={handleInputChange}
              styles={stackItemStyle}
            />
          </Stack.Item>
          {/* Commented By Madhuri.K On 16-Dec-2024 */}
          <Stack.Item>
            <Label htmlFor="CompletedTo">Converted To</Label>
            <Dropdown
              id="CompletedTo"
              placeholder="Select Completed To"
              options={CompletedToOptions}
              onChange={handleInputChange}
              styles={{
                dropdown: { width: "350px" }, // Set a fixed width here
                root: { width: "350px" } // Optional: Ensures the root container also has the same width
              }}
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
