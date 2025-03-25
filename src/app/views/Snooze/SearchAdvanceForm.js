import React, { useState, useEffect } from "react";
import {
  Label,
  Dropdown,
  TextField,
  Stack,
  DefaultButton,
  DatePicker,
  DayOfWeek,
  getTheme,
  mergeStyles
} from "@fluentui/react";
import { format } from "date-fns";
import axios from "axios";

const SearchAdvanceForm = ({ onClose, onSearch }) => {
  const initialState = {
    initiationDate: null,
    isActive: "",
    natureOfInitiativeId: "",
    initiativeTitle: "",
    demandCode: "",
    StageID: "",
    createdBy: ""
  };
  const [formValues, setFormValues] = useState(initialState);
  const [snoozeactive, setsnoozeactive] = useState([]);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [stageOptions, setstageOptions] = useState([]);
  const [active_snooze_createdby, setSubmittedByOptions] = useState([]);
  // const [Created, setCreated] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const userID = userdata?.employeeId;

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async (fieldName) => {
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


      // Fetch Active snooze options
      const ActiveResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=snoozeactive`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!ActiveResponse.ok) {
        throw new Error("Failed to fetch Completed To options");
      }

      const ActiveData = await ActiveResponse.json();
      setsnoozeactive(
        ActiveData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );



      // Fetch Stages options
      const StagesResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?EmpID=${employeeId}&userID=${employeeId}&FieldName=wliststage`,
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
      setstageOptions(
        StagesData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
      // Fetch Created By options
      const CreatedResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?EmpID=${employeeId}&userID=${employeeId}&FieldName=active_snooze_createdby`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      if (!CreatedResponse.ok) throw new Error("Failed to fetch Created By options");

      const CreatedData = await CreatedResponse.json();

      if (!CreatedData?.data?.listInitiativeDetailDropDownEntity) {
        console.error("Invalid Created By API response:", CreatedData);
        return;
      }

      setSubmittedByOptions(
        CreatedData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.name,
          text: item.name || "Unknown"
        }))
      );
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  // const handleInputChange = (e, option) => {
  //   const fieldId = e.target.id || e.target.name;
  //   const value = option?.key || e.target.value;

  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     [fieldId]: value,
  //     createdBy: prevValues.createdBy || userID, // Always include logged-in user
  //   }));
  // };

  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name;
    const value = option?.key || e.target.value;
  
    updateFormValues(fieldId, value, option);
  };
  
  const updateFormValues = (fieldId, value, option) => {
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [fieldId]: value,
      };
  
      if (fieldId === "createdBy") {
        if (option) {
          // When selecting from dropdown, show the display name
          updatedValues.createdBy = option.text;  
        } else {
          // When automatically setting the logged-in user, show the ID
          updatedValues.createdBy = userID;
        }
      }
  
      return updatedValues;
    });
  };
  
  const handleDateChange = (date, id) => {
    console.log("Selected Date (Raw):", date);

    if (!date) return;

    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log("Converted Local Date:", localDate);

    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: localDate,
    }));
  };


  const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date); // Format as '29 Jan 2025'
  };

  const parseDateFromString = (dateString) => {
    const [day, month, year] = dateString.split(" ");
    const monthIndex = new Date(`${month} 1`).getMonth(); // Convert month name to index
    return new Date(year, monthIndex, day);
  };

  const handleClearSearch = () => {
    setFormValues(initialState); // Reset form values
    if (onSearch) {
      onSearch(initialState); // Notify parent about cleared form
    }
  };

  const handleSearchClick = () => {
    const filteredFormValues = { ...formValues };

    // Ensure isActive is a Boolean, otherwise set as empty string
    filteredFormValues.isActive =
      filteredFormValues.isActive === true
        ? true
        : filteredFormValues.isActive === false
          ? false
          : "";

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

  const fieldWidth = "320px";
  const fieldStyle = { width: "100%" };
  return (
    <div className={boxStyle}>
      <Stack tokens={{ childrenGap: 15 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="isActive">Active</Label>
            <Dropdown
              id="isActive"
              placeholder="Select Active Status"
              options={[
                { key: true, text: "Yes" }, // Send Boolean `true`
                { key: false, text: "No" }, // Send Boolean `false`
              ]}
              selectedKey={formValues.isActive}
              onChange={(e, option) => setFormValues((prev) => ({ ...prev, isActive: option.key }))}
            />

          </Stack.Item>

          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="natureOfInitiativeId">Nature of Initiative</Label>
            <Dropdown
              id="natureOfInitiativeId"
              placeholder="Select Nature of Initiative"
              options={natureOfInitiativeOptions}
              selectedKey={formValues.natureOfInitiativeId}
              onChange={handleInputChange}
            />
          </Stack.Item>


          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="initiativeTitle">Initiative Title</Label>
            <TextField
              id="initiativeTitle"
              name="initiativeTitle"
              placeholder="Enter Initiative Title"
              value={formValues.initiativeTitle}
              onChange={handleInputChange}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="demandCode">Initiative Code</Label>
            <TextField
              id="demandCode"
              name="demandCode"
              placeholder="Enter Initiative Code"
              value={formValues.demandCode}
              onChange={handleInputChange}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="initiationDate">Initiation Date</Label>
            <DatePicker
              id="initiationDate"
              placeholder="Select Initiation Date"
              ariaLabel="Select Initiation Date"
              value={formValues?.initiationDate}
              onSelectDate={(date) => handleDateChange(date, "initiationDate")}
              styles={fieldStyle}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="StageID">Stage</Label>
            <Dropdown
              id="StageID"
              placeholder="Select Stage"
              options={stageOptions}
              selectedKey={formValues.StageID}
              onChange={handleInputChange}
            />
          </Stack.Item>
        </Stack>

        <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
          <Stack.Item styles={{ root: { width: fieldWidth } }}>
            <Label htmlFor="createdBy">Created By</Label>
            <Dropdown
              id="createdBy"
              placeholder="Select Created By"
              options={active_snooze_createdby}
              selectedKey={formValues.createdBy}
              onChange={(e, option) => setFormValues((prev) => ({ ...prev, createdBy: option.key }))}
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
