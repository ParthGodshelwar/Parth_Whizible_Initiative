import React, { useState, useEffect } from "react";
import {
  Label,
  Dropdown,
  TextField,
  Stack,
  DefaultButton,
  getTheme,
  mergeStyles,
  DatePicker // Import DatePicker component
} from "@fluentui/react";

const SearchAdvanceForm = ({ onClose, onSearch }) => {
  const initialState = {
    title: "",
    plannedStartDate: null,
    plannedEndDate: null,
    actualFromDate: null,
    actualToDate: null,
    duration: "",
    checklistId: "",
    status: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [auditTypeOptions, setAuditTypeOptions] = useState([]);
  const [checklistOptions, setChecklistOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1;

      const fetchOptions = async (fieldName) => {
        const auditTypeResponse = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );
        if (!auditTypeResponse.ok) throw new Error(`Failed to fetch ${fieldName} options`);
        const data = await auditTypeResponse.json();
        return data.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }));
      };

      setAuditTypeOptions([
        { key: "", text: "Select Audit Type" },
        ...(await fetchOptions("AuditType"))
      ]);
      setChecklistOptions([
        { key: "", text: "Select Checklist" },
        ...(await fetchOptions("checklist"))
      ]);
      setStatusOptions([
        { key: "", text: "Select Status" },
        ...(await fetchOptions("AuditChecklist"))
      ]);

       // Fetch Status By options
       const StatusResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=ExternalAuditstatus`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!StatusResponse.ok) {
        throw new Error("Failed to fetch Status To options");
      }

      const StatusData = await StatusResponse.json();
      setStatusOptions(
        StatusData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
       // Fetch Checklist By options
       const ChecklistResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?&userID=${employeeId}&FieldName=AuditChecklist`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!ChecklistResponse.ok) {
        throw new Error("Failed to fetch Checklist To options");
      }

      const ChecklistData = await ChecklistResponse.json();
      setChecklistOptions(
        ChecklistData.data.listInitiativeDetailDropDownEntity.map((item) => ({
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

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  // const handleDateChange = (date, fieldId) => {
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [fieldId]: date instanceof Date && !isNaN(date) ? date.toISOString() : ""
  //   }));
  // };


  const handleDateChange = (date, id) => {
    if (!date) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [id]: null, // Ensure null is set if date is not selected
      }));
      return;
    }
  
    // Convert to "YYYY-MM-DD" format
    // const formattedDate = date.toISOString().split("T")[0];
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    console.log("Formatted Date:", formattedDate);
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: formattedDate, // Store formatted date
    }));
  };
  
  
  const parseDateFromString = (dateString) => {
    const [day, month, year] = dateString.split(" ");
    const monthIndex = new Date(`${month} 1`).getMonth(); // Convert month name to index
    return new Date(year, monthIndex, day);
  };

  const handleClearSearch = () => {
    setFormValues(initialState);
    onSearch(initialState);
  };

  // const handleSearchClick = () => {
  //   const filteredFormValues = Object.fromEntries(
  //     Object.entries(formValues).filter(([key, value]) => value !== "")
  //   );

  //   if (onSearch) {
  //     onSearch(filteredFormValues);
  //   }
  // };
  const handleSearchClick = () => {
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(([_, value]) => value !== "" && value !== null)
    );
  
    console.log("Filtered Search Values:", filteredFormValues);
  
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

  const fieldWidth = { width: "300px" };

  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item>
            <Label htmlFor="auditTypeID">Audit Type</Label>
            <Dropdown
              id="auditTypeID"
              placeholder="Select Audit Type"
              options={auditTypeOptions}
              onChange={handleInputChange}
              selectedKey={formValues.auditTypeID || ""}
              styles={{ dropdown: fieldWidth }}
            />
          
          </Stack.Item>
          <Stack.Item>
            <Label htmlFor="title">Title</Label>
            <TextField
              id="title"
              name="title"
              placeholder="Enter Title"
              value={formValues.title}
              onChange={handleInputChange}
              styles={{ field: fieldWidth }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label htmlFor="plannedStartDate">Planned Start Date</Label>
            <DatePicker
              id="plannedStartDate"
              placeholder="Select Planned Start Date"
              value={formValues.plannedStartDate ? new Date(formValues.plannedStartDate) : null}
              onSelectDate={(date) => handleDateChange(date, "plannedStartDate")}
              styles={{ textField: fieldWidth }}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item>
            <Label htmlFor="plannedEndDate">Planned End Date</Label>
            <DatePicker
              id="plannedEndDate"
              placeholder="Select Planned End Date"
              value={formValues.plannedEndDate ? new Date(formValues.plannedEndDate) : null}
              onSelectDate={(date) => handleDateChange(date, "plannedEndDate")}
              styles={{ textField: fieldWidth }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label htmlFor="actualFromDate">Actual From Date</Label>
            <DatePicker
              id="actualFromDate"
              placeholder="Select Actual From Date"
              value={formValues.actualFromDate ? new Date(formValues.actualFromDate) : null}
              onSelectDate={(date) => handleDateChange(date, "actualFromDate")}
              styles={{ textField: fieldWidth }}
            />
          </Stack.Item>
          <Stack.Item>
            <Label htmlFor="actualToDate">Actual To Date</Label>
            <DatePicker
              id="actualToDate"
              placeholder="Select Actual To Date"
              value={formValues.actualToDate ? new Date(formValues.actualToDate) : null}
              onSelectDate={(date) => handleDateChange(date, "actualToDate")}
              styles={{ textField: fieldWidth }}
            />

          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item>
            <Label htmlFor="duration">Duration</Label>
            <TextField
              id="duration"
              name="duration"
              placeholder="Enter Duration"
              value={formValues.duration}
              onChange={handleInputChange}
              styles={{ field: fieldWidth }}
            />
          </Stack.Item>

          <Stack.Item>
            <Label htmlFor="checklistId">Checklist</Label>
            <Dropdown
              id="checklistId"
              placeholder="Select Checklist"
              options={checklistOptions}
              onChange={handleInputChange}
              selectedKey={formValues.checklistId} // Bind selected value to form state
              styles={{ dropdown: fieldWidth }}
            />
          </Stack.Item>

          <Stack.Item>
            <Label htmlFor="status">Status</Label>
            <Dropdown
              id="status"
              placeholder="Select Status"
              options={statusOptions}
              onChange={handleInputChange}
              selectedKey={formValues.status} // Bind selected value to form state
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
