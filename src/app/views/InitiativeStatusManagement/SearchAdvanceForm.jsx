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
  // Define initial state with only necessary fields
  const initialState = {
    natureofDemandID: "",
    businessGroupId: "",
    organizationUnitId: "",
    demandCode: "",
    title: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [organizationUnitOptions, setOrganizationUnitOptions] = useState([]);
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
      const data = await fetchFilters();
      setBusinessGroupOptions(
        data?.initiativeBusinessGroupFilter?.map((group) => ({
          key: group.businessGroupID,
          text: group.businessGroup,
          initiativeLocationFilter: group.initiativeLocationFilter
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

  // const handleInputChange = (e, option) => {
  //   const fieldId = e.target.id || e.target.name;
  //   const value = option?.key || e.target.value;
  //   if (fieldId == "businessGroupId") formValues.organizationUnitId = "";
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [fieldId]: value
  //   }));
  // };

  // const handleClearSearch = () => {
  //   setFormValues(initialState);
  //   setSelectedBusinessGroup(null); // Reset selected business group
  //   setNatureOfInitiativeOptions([]); // Reset options to an empty array
  //   setBusinessGroupOptions([]); // Reset options to an empty array
  //   setOrganizationUnitOptions([]); // Clear organization unit options
  //   // sessionStorage.removeItem("formValues"); // Clear saved data
  //   onSearch(initialState);
  // };

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

    // Call the passed onSearch function with filtered values
    if (onSearch) {
      onSearch(filteredFormValues);
    }
  };

  // Define styles for the box
  const boxStyle = mergeStyles({
    border: `1px solid ${getTheme().palette.neutralLight}`,
    padding: "20px",
    borderRadius: "5px",
    marginBottom: "20px"
  });

  const fieldStyle = { width: "300px" };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px"
    }
  };

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="natureofDemandID">Nature of Initiative</Label>
            <Dropdown
              id="natureofDemandID"
              placeholder="Select Nature of Initiative"
              options={natureOfInitiativeOptions}
              onChange={handleInputChange}
              selectedKey={formValues.natureofDemandID}
              styles={{ dropdown: fieldStyle }}
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
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="organizationUnitId">Organization Unit</Label>
            <Dropdown
              id="organizationUnitId"
              placeholder="Select Organization Unit"
              options={organizationUnitOptions}
              onChange={handleInputChange}
              styles={{ dropdown: fieldStyle }}
              selectedKey={formValues.organizationUnitId}
              disabled={!selectedBusinessGroup}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="demandCode">Initiative Code</Label>
            <TextField
              id="demandCode"
              name="demandCode"
              placeholder="Enter Initiative Code"
              value={formValues.demandCode}
              onChange={handleInputChange}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="title">Initiative Title</Label>
            <TextField
              id="title"
              name="title"
              placeholder="Enter Initiative Title"
              value={formValues.title}
              onChange={handleInputChange}
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
