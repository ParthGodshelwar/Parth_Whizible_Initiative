import React, { useState, useEffect } from "react";
import { Label, Dropdown, TextField, Stack, DefaultButton, DatePicker } from "@fluentui/react";

const SearchAdvanceForm = ({ onClose, searchFilters, onSearch }) => {
  const initialState = {
    initiativeTitle: "",
    stage: "",
    status: "",
    assignedTo: "",
    submittedById: "",
    actionItem: "",
    submittedOn: null,
    dueDate: null,
    priorityId: "",
    description: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [filteredLocations, setFilteredLocations] = useState(
    searchFilters?.initiativeLocationFilter || []
  );

  useEffect(() => {
    // Filter logic can be added here based on other dropdown selections if needed
  }, [formValues.businessGroupId, searchFilters]);

  const handleInputChange = (e, option) => {
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
  };

  const handleSearchClick = () => {
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([key, value]) => value !== "" && value !== null)
    );

    if (onSearch) {
      // Call the appropriate API function based on your criteria
      if (filteredFormValues.stage === "audit") {
        onSearch("GetInitiativeAuditActionItems", filteredFormValues);
      } else {
        onSearch("GetInitiativeListStageActionItems", filteredFormValues);
      }
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

  return (
    <div className="above-form-container">
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="initiativeTitle">Initiative Title</Label>
            <Dropdown
              id="initiativeTitle"
              placeholder="Select Initiative Title"
              options={
                searchFilters?.initiativeTitleFilter?.map((title) => ({
                  key: title.titleID,
                  text: title.titleName
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.initiativeTitle}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="stage">Stage</Label>
            <Dropdown
              id="stage"
              placeholder="Select Stage"
              options={
                searchFilters?.initiativeRequestStageFilter?.map((stage) => ({
                  key: stage.requestStageID,
                  text: stage.requestStage
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.stage}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="status">Status</Label>
            <Dropdown
              id="status"
              placeholder="Select Status"
              options={
                searchFilters?.initiativeStatusFilter?.map((status) => ({
                  key: status.statusID,
                  text: status.statusName
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.status}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Dropdown
              id="assignedTo"
              placeholder="Select Assigned To"
              options={
                searchFilters?.initiativeAssignedToFilter?.map((assignee) => ({
                  key: assignee.employeeID,
                  text: assignee.assignedTo
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.assignedTo}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
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
            <Label htmlFor="actionItem">Action Item</Label>
            <Dropdown
              id="actionItem"
              placeholder="Select Action Item"
              options={
                searchFilters?.initiativeActionItemFilter?.map((action) => ({
                  key: action.actionItemID,
                  text: action.actionItemName
                })) || []
              }
              onChange={handleInputChange}
              selectedKey={formValues.actionItem}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
            <Label htmlFor="submittedOn">Submitted On</Label>
            <DatePicker
              id="submittedOn"
              placeholder="Select Submitted Date"
              ariaLabel="Select Submitted Date"
              value={formValues.submittedOn}
              onSelectDate={(date) => handleDateChange(date, "submittedOn")}
              styles={fieldStyle}
            />
          </Stack.Item>
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="dueDate">Due Datessss</Label>
            <DatePicker
              id="dueDate"
              placeholder="Select Due Date"
              ariaLabel="Select Due Date"
              value={formValues.dueDate}
              onSelectDate={(date) => handleDateChange(date, "dueDate")}
              styles={fieldStyle}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item grow styles={stackItemStyle}>
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
          <Stack.Item grow styles={alignRight}>
            <Label htmlFor="description">Description</Label>
            <TextField
              id="description"
              placeholder="Enter Description"
              multiline
              value={formValues.description}
              onChange={handleInputChange}
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
