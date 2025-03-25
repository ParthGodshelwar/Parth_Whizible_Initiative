import React, { useState, useEffect } from "react";
import { Label, Dropdown, TextField, Stack, DefaultButton, DatePicker } from "@fluentui/react";

const SearchAdvanceForm = ({ onClose, searchFilters, onSearch, reset }) => {
  const initialState = {
    DemandCode: "",
    FromDate: null,
    ToDate: null,
    lastActionName: "",
    submittedById: "",
    natureOfInitiativeId: "",
    stageId: "",
    vendorId: "",
    priorityId: "",
    initiativeCategoryId: "",
    businessGroupId: "",
    organizationUnitId: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [filteredLocations, setFilteredLocations] = useState(
    searchFilters?.initiativeLocationFilter || []
  );

  // Retrieve saved state on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem("searchFormState");
    if (savedState) {
      setFormValues(JSON.parse(savedState));
    }
  }, []);

  // Update sessionStorage whenever formValues change
  useEffect(() => {
    sessionStorage.setItem("searchFormState", JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    setFormValues(initialState);
  }, [reset]);

  useEffect(() => {
    if (formValues.businessGroupId) {
      const selectedGroup = searchFilters?.initiativeBusinessGroupFilter.find(
        (group) => group.businessGroupID === formValues.businessGroupId
      );
      setFilteredLocations(selectedGroup ? selectedGroup.initiativeLocationFilter : []);
    } else {
      setFilteredLocations(searchFilters?.initiativeLocationFilter);
    }
  }, [
    formValues.businessGroupId,
    searchFilters?.initiativeLocationFilter,
    searchFilters?.initiativeBusinessGroupFilter
  ]);

  const handleInputChange = (e, option) => {
    console.log("InitiativeList/Get", e.target.id);
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  const handleDateChange = (date, id) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: date
    }));
  };

  const handleClearSearch = () => {
    setFormValues(initialState);
    setFilteredLocations(searchFilters?.initiativeLocationFilter);
    sessionStorage.removeItem("searchFormState"); // Clear saved state
    onSearch(initialState);
  };

  const handleSearchClick = () => {
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "" && value !== null)
    );
    console.log("SearchAdvanceForm", filteredFormValues);
    if (onSearch) {
      onSearch(filteredFormValues);
    }
  };

  const fieldStyle = {
    width: "100%",
    minHeight: "36px"
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px"
    }
  };

  const alignRight = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px",
      alignSelf: "flex-end"
    }
  };

  const alignCenter = {
    root: {
      flexGrow: 1,
      minWidth: "200px",
      maxWidth: "300px",
      alignSelf: "center"
    }
  };

  return (
    <div className="above-form-container">
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="DemandCode">Initiative Code</Label>
            <TextField
              id="DemandCode"
              name="DemandCode"
              placeholder="Enter Initiative Code"
              value={formValues.DemandCode}
              onChange={handleInputChange}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="FromDate">Initiative From</Label>
            <DatePicker
              id="FromDate"
              placeholder="Select Start Date"
              ariaLabel="Select Start Date"
              value={formValues?.FromDate}
              onSelectDate={(date) => handleDateChange(date, "FromDate")}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="ToDate">Initiative To</Label>
            <DatePicker
              id="ToDate"
              placeholder="Select End Date"
              ariaLabel="Select End Date"
              value={formValues.ToDate}
              onSelectDate={(date) => handleDateChange(date, "ToDate")}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="lastAction">Last Action</Label>
            <Dropdown
              id="lastActionName"
              placeholder="Select Last Action"
              options={
                searchFilters?.initiativeActionFilter?.map((action) => ({
                  key: action.actioID,
                  text: action.actionName
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.lastActionName}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="submittedById">Submitted By</Label>
            <Dropdown
              id="submittedById"
              placeholder="Select Submitted By"
              options={
                searchFilters?.initiativeSubmittedFilter?.map((submitter) => ({
                  key: submitter.employeeID,
                  text: submitter.submittedBy
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.submittedById}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="natureOfInitiativeId">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiativeId"
              placeholder="Select Nature of Initiative"
              options={
                searchFilters?.initiativeNOIFilter?.map((nature) => ({
                  key: nature.natureofDemandID,
                  text: nature.natureofDemand
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.natureOfInitiativeId}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="stageId">Select Stage</Label>
            <Dropdown
              id="stageId"
              placeholder="Select Stage"
              options={
                searchFilters?.initiativeRequestStageFilter?.map((stage) => ({
                  key: stage.requestStageID,
                  text: stage.requestStage
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.stageId}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="vendorId">Vendor</Label>
            <Dropdown
              id="vendorId"
              placeholder="Select Vendor"
              options={
                searchFilters?.initiativeVendorFilter?.map((vendor) => ({
                  key: vendor.vendorID,
                  text: vendor.vendorNameAbbr
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.vendorId}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="priorityId">Priority</Label>
            <Dropdown
              id="priorityId"
              placeholder="Select Priority"
              options={
                searchFilters?.initiativePriorityFilter?.map((priority) => ({
                  key: priority.priorityID,
                  text: priority.priority
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.priorityId}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        {/* <Stack horizontal tokens={{ childrenGap: 20 }} wrap></Stack> */}
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeCategory">Initiative Category</Label>
            <Dropdown
              id="initiativeCategoryId"
              placeholder="Select Initiative Category"
              options={
                searchFilters?.initiativeRequestTypeFilter?.map((category) => ({
                  key: category.requestTypeID,
                  text: category.requestType
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.initiativeCategoryId}
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
                  text: group.businessGroup
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.businessGroupId}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignCenter}>
            <Label htmlFor="organizationUnitId">Organization Unit</Label>
            <Dropdown
              id="organizationUnitId"
              placeholder="Select Organization Unit"
              disabled={!formValues.businessGroupId}
              options={
                filteredLocations?.map((unit) => ({
                  key: unit.locationID,
                  text: unit.location
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.organizationUnitId}
              styles={fieldStyle}
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
