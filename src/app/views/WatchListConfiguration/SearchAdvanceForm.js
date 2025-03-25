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
    ChecklistID: "",
    StageApprover: "",
    stageOfApprovalId: "",
    businessGroupId: "",
    StatusId: "",
    organizationUnitId: "",
    stageOfApprovalId:"",
    DemandCode: "",
    initiativeTitle: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [organizationUnitOptions, setOrganizationUnitOptions] = useState([]);
  // const [ChecklistOptions, setChecklistOptions] = useState([]);
    const [stageOfApprovalOptions, setStageOfApprovalOptions] = useState([]);
  const [StatusOption, setStatusOption] = useState([]);
  // const [selectedBusinessGroup, setSelectedBusinessGroup] = useState(null); // State for selected business group
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

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1; // replace with your actual initiativesID
      // Fetch Nature of Initiative options
      const natureResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=noi`,
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
      console.log("Filters", data);
      setBusinessGroupOptions(
        data?.initiativeBusinessGroupFilter?.map((group) => ({
          key: group.businessGroupID,
          text: group.businessGroup,
          initiativeLocationFilter: group.initiativeLocationFilter // Add locations to the group
        }))
      );

      // Fetch Current Stage options
      const CompletedToResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=WListStage`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!CompletedToResponse.ok) {
        throw new Error("Failed to fetch Current Stage options");
      }

      const CompletedToData = await CompletedToResponse.json();
      setStageOfApprovalOptions(
        CompletedToData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }

     // Fetch Status options
     const StagesResponse = await fetch(
      `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=WListStatus`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      }
    );

    if (!StagesResponse.ok) {
      throw new Error("Failed to fetch Stages options");
    }

    const StagesData = await StagesResponse.json();
    setStatusOption(
      StagesData.data.listInitiativeDetailDropDownEntity.map((item) => ({
        key: item.id,
        text: item.name
      }))
    );
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
      Object.entries(formValues).filter(([_, value]) => value !== "")
    );
  
    if (onSearch) {
      onSearch(filteredFormValues); // 🔹 Send filters directly to InitiativeTable
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
      minWidth: "230px",
      maxWidth: "330px"
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
              options={[{ key: "", text: "Select Nature of Initiative" }, ...natureOfInitiativeOptions]}
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiativeId}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="stageOfApprovalId">Current Stage</Label>
            <Dropdown
              id="stageOfApprovalId"
              placeholder="Select Current Stage"
              options={[{ key: "", text: "Select Current Stage" }, ...stageOfApprovalOptions]}
              onChange={handleInputChange}
              selectedKey={formValues.stageOfApprovalId}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>

          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="StageApprover"> Current Stage Approver</Label>
            <TextField
              id="StageApprover"
              name="StageApprover"
              placeholder="Enter Current Stage Approver"
              value={formValues.StageApprover}
              onChange={handleInputChange}
              styles={stackItemStyle}
            />
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="StatusId">Status</Label>
            <Dropdown
              id="StatusId"
              placeholder="Select Business Group"
              options={[{ key: "", text: "Select Status" }, ...StatusOption]}
              selectedKey={formValues.StatusId} // Set value to the form value
              onChange={handleInputChange}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="businessGroupId">Business Group</Label>
            <Dropdown
              id="businessGroupId"
              placeholder="Select Business Group"
              options={[{ key: "", text: "Select Business Group" }, ...businessGroupOptions]}
              selectedKey={formValues.businessGroupId} // Set value to the form value
              onChange={handleInputChange}
              styles={{ dropdown: { width: "100%" } }}
            />
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="organizationUnitId">Organization Unit</Label>
            <Dropdown
              id="organizationUnitId"
              placeholder="Select Organization Unit"
              options={[{ key: "", text: "Select Organization Unit" }, ...organizationUnitOptions]}
              selectedKey={formValues.organizationUnitId} // Set value to the form value
              onChange={handleInputChange}
              styles={{ dropdown: { width: "100%" } }}
              disabled={!selectedBusinessGroup} // Disable if no business group is selected
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="DemandCode">Initiative Code</Label>
            <TextField
              id="DemandCode"
              name="DemandCode"
              placeholder="Enter Initiative Code"
              value={formValues.DemandCode}
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
