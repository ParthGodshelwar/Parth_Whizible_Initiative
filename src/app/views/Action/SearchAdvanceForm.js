import React, { useState, useEffect } from "react";
import {
  Label,
  Dropdown,
  TextField,
  Stack,
  DefaultButton,
  getTheme,
  mergeStyles,
  DatePicker,
  DayOfWeek
} from "@fluentui/react";
import fetchFilters from "../../hooks/SearchFilters/filters";

const SearchAdvanceForm = ({ activeTab, onClose, onSearch, setFormValues, formValues, initialState }) => {
  const [initiativeTitleOptions, setInitiativeTitleOptions] = useState([]);
  const [stageOptions, setStageOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [assignedToOptions, setAssignedToOptions] = useState([]);
  const [submittedByOptions, setSubmittedByOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownData = async (fieldName, setOptionsCallback) => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;
    const initiativesID = 1;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}&EmpID=${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch options for ${fieldName}`);
      }

      const data = await response.json();
      const options = [
        { key: "", text: "Select Option" },
        ...data.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      ];
      setOptionsCallback(options);
    } catch (error) {
      console.error(`Error fetching options for ${fieldName}:`, error);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      await Promise.all([
        // fetchDropdownData("newnatureofinitiative", setInitiativeTitleOptions),
        // fetchDropdownData("requeststage", setStageOptions),
        fetchDropdownData("wliststage", setStageOptions),
        fetchDropdownData("actionstatus", setStatusOptions),
        fetchDropdownData("customfieldnumeric1", setAssignedToOptions),
        fetchDropdownData("customfieldnumeric1", setSubmittedByOptions),
        // fetchDropdownData("priorityid", setPriorityOptions)
        fetchDropdownData("actionpriority", setPriorityOptions)
      ]);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

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

  const fieldStyle = { width: "100%" };

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            {/* Nature of Initiative field commented by Gauri on 13 Feb 2025 */}
            {/* <Label htmlFor="initiativeTitle">Nature of Initiative</Label>
            <Dropdown
              id="initiativeTitle"
              placeholder="Select Initiative Title"
              options={initiativeTitleOptions}
              onChange={handleInputChange}
              selectedKey={formValues.initiativeTitle || ""}
              styles={{ dropdown: fieldStyle }}
            /> */}
            
            {/* Initiative Title field Added by Gauri on 13 Feb 2025 */}
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

          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="status">Status</Label>
            <Dropdown
              id="status"
              placeholder="Select Status"
              options={statusOptions}
              onChange={handleInputChange}
              selectedKey={formValues.status || ""}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Dropdown
              id="assignedTo"
              placeholder="Select Assigned To"
              options={assignedToOptions}
              onChange={handleInputChange}
              selectedKey={formValues.assignedTo || ""}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="actionItem">Action Item</Label>
            <TextField
              id="actionItem"
              name="actionItem"
              placeholder="Enter Action Item"
              value={formValues.actionItem}
              onChange={handleInputChange}
              styles={{ field: fieldStyle }}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="submittedOn">Submitted On</Label>
            <DatePicker
              id="submittedOn"
              name="submittedOn"
              value={formValues.submittedOn}
              onSelectDate={(date) => handleDateChange(date, "submittedOn")}
              placeholder="Select Submitted On Date"
              allowTextInput={false}
              styles={{ root: fieldStyle }}
              firstDayOfWeek={DayOfWeek.Sunday}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="dueDate">Due Date</Label>
            <DatePicker
              id="dueDate"
              name="dueDate"
              value={formValues.dueDate}
              onSelectDate={(date) => handleDateChange(date, "dueDate")}
              placeholder="Select Due Date"
              allowTextInput={false}
              styles={{ root: fieldStyle }}
              firstDayOfWeek={DayOfWeek.Sunday}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="priority">Priority</Label>
            <Dropdown
              id="priority"
              placeholder="Select Priority"
              options={priorityOptions}
              onChange={handleInputChange}
              selectedKey={formValues.priority || ""}
              styles={{ dropdown: fieldStyle }}
            />
          </Stack.Item>

          {activeTab !== "audit-action-items" && (
            <>
              <Stack.Item styles={{ root: { minWidth: "350px" } }}>
                <Label htmlFor="stage">Stage</Label>
                <Dropdown
                  id="stage"
                  placeholder="Select Stage"
                  options={stageOptions}
                  onChange={handleInputChange}
                  selectedKey={formValues.stage || ""}
                  styles={{ dropdown: fieldStyle }}
                />
              </Stack.Item>

              <Stack.Item styles={{ root: { minWidth: "350px" } }}>
                <Label htmlFor="submittedBy">Submitted By</Label>
                <Dropdown
                  id="submittedBy"
                  placeholder="Select Submitted By"
                  options={submittedByOptions}
                  onChange={handleInputChange}
                  selectedKey={formValues.submittedBy || ""}
                  styles={{ dropdown: fieldStyle }}
                />
              </Stack.Item>
            </>
          )}
        </Stack>

        {/* Description field commented by Gauri on 13 Feb 2025 */}
        {/* <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { minWidth: "350px" } }}>
            <Label htmlFor="description">Description</Label>
            <TextField
              id="description"
              name="description"
              placeholder="Enter Description"
              value={formValues.description}
              onChange={handleInputChange}
              styles={{ field: fieldStyle }}
              multiline
              rows={3}
            />
          </Stack.Item>
        </Stack> */}

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
