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
    initiativeTitle: "",
    convertedTo: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [organizationUnitOptions, setOrganizationUnitOptions] = useState([]);
  const [convertedToOptions, setConvertedToOptions] = useState([]);
  const [selectedBusinessGroup, setSelectedBusinessGroup] = useState(null);

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
      setOrganizationUnitOptions([]);
    }
  }, [selectedBusinessGroup, businessGroupOptions]);

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

      // Fetch Business Group options
      const data = await fetchFilters();
      setBusinessGroupOptions(
        data?.initiativeBusinessGroupFilter?.map((group) => ({
          key: group.businessGroupID,
          text: group.businessGroup,
          initiativeLocationFilter: group.initiativeLocationFilter
        }))
      );

      // Fetch Converted To options
      const convertedToResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=convertedto`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!convertedToResponse.ok) {
        throw new Error("Failed to fetch Converted To options");
      }

      const convertedToData = await convertedToResponse.json();
      setConvertedToOptions(
        convertedToData.data.listInitiativeDetailDropDownEntity.map((item) => ({
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

  const fieldStyle = { width: "300px" }; // Set desired width here

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="natureOfInitiativeId">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiativeId"
              placeholder="Select Nature of Initiative"
              options={natureOfInitiativeOptions}
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiativeId}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="businessGroupId">Business Group</Label>
            <Dropdown
              id="businessGroupId"
              placeholder="Select Business Group"
              options={businessGroupOptions}
              onChange={handleInputChange}
              selectedKey={formValues.businessGroupId}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="organizationUnitId">Organization Unit</Label>
            <Dropdown
              id="organizationUnitId"
              placeholder="Select Organization Unit"
              options={organizationUnitOptions}
              onChange={handleInputChange}
              selectedKey={formValues.organizationUnitId}
              styles={{ dropdown: fieldStyle }}
              disabled={!selectedBusinessGroup}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="initiativeCode">Initiative Code</Label>
            <TextField
              id="initiativeCode"
              name="initiativeCode"
              placeholder="Enter Initiative Code"
              value={formValues.initiativeCode}
              onChange={handleInputChange}
              styles={{ field: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="initiativeTitle">Initiative Title</Label>
            <TextField
              id="initiativeTitle"
              name="initiativeTitle"
              placeholder="Enter Initiative Title"
              value={formValues.initiativeTitle}
              onChange={handleInputChange}
              styles={{ field: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={{ root: { flexGrow: 1 } }}>
            <Label htmlFor="convertedTo">Converted To</Label>
            <Dropdown
              id="convertedTo"
              placeholder="Select Converted To"
              options={convertedToOptions}
              onChange={handleInputChange}
              selectedKey={formValues.convertedTo}
              styles={{ dropdown: fieldStyle }}
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
