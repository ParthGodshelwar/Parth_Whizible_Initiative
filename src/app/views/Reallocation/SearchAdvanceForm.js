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
import { toast } from "react-toastify";

const SearchAdvanceForm = ({ onClose, onSearch, setShowIniDetails, setInitiatives }) => {
  const initialState = {
    currentApprover: "",
    natureOfInitiativeId: "",
    businessGroupId: "",
    stageOfApprovalId: "",
    initiativeTitle: ""
  };

  const [formValues, setFormValues] = useState(initialState);
  const [currentApproverOptions, setCurrentApproverOptions] = useState([]);
  const [natureOfInitiativeOptions, setNatureOfInitiativeOptions] = useState([]);
  const [businessGroupOptions, setBusinessGroupOptions] = useState([]);
  const [stageOfApprovalOptions, setStageOfApprovalOptions] = useState([]);

  useEffect(() => {
    sessionStorage.removeItem("searchFormValues"); // Clears sessionStorage on page refresh
  }, []);

  // Retrieve stored form values from sessionStorage on component mount
  useEffect(() => {
    const storedFormValues = JSON.parse(sessionStorage.getItem("searchFormValues"));
    if (storedFormValues) {
      setFormValues(storedFormValues);
    }
    fetchDropdownOptions();
  }, []);

  const fetchDropdownOptions = async () => {
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    try {
      const initiativesID = 1;
      const headers = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      };

      // Current Approver
      const currentApproverResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=currentapprover&EmpID=${employeeId}`,
        headers
      );
      const currentApproverData = await currentApproverResponse.json();
      setCurrentApproverOptions(
        currentApproverData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );

      // Nature of Initiative
      const natureResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?userID=${employeeId}&FieldName=noi&EmpID=${employeeId}`,
        headers
      );
      const natureData = await natureResponse.json();
      setNatureOfInitiativeOptions(
        natureData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );

      // Business Group
      const businessGroupResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=businessunitid`,
        headers
      );
      const businessGroupData = await businessGroupResponse.json();
      setBusinessGroupOptions(
        businessGroupData.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );

      // Stage of Approval
      const stageOfApprovalResponse = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=wliststage`,
        headers
      );
      const stageOfApprovalData = await stageOfApprovalResponse.json();
      setStageOfApprovalOptions(
        stageOfApprovalData.data.listInitiativeDetailDropDownEntity.map((item) => ({
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

    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues, [fieldId]: value };
      // Store the updated form values in sessionStorage
      sessionStorage.setItem("searchFormValues", JSON.stringify(updatedValues));
      return updatedValues;
    });
  };

  const handleClearSearch = () => {
    setFormValues(initialState); // Reset form state
    sessionStorage.removeItem("searchFormValues"); // Clear sessionStorage
  
    // Trigger onSearch with the reset state (if needed)
    if (onSearch) {
      onSearch(initialState);
    }

    setShowIniDetails(false);
    setInitiatives([]);
  };  

  const handleSearchClick = () => {
    if (!formValues.currentApprover) {
      toast.error("Select Current Approver to Proceed further.");
      return;
    }
  
    if (!formValues.natureOfInitiativeId) {
      toast.error("Select Nature of Initiative to Proceed further.");
      return;
    }
  
    if (!formValues.businessGroupId) {
      toast.error("Select Business Group to Proceed further.");
      return;
    }

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

  const fieldWidth = { width: "300px" };

  return (
    <div className={boxStyle}>
      <div className="row">
        <div className="col-sm-12 mb-2">
          <Stack tokens={{ childrenGap: 15 }}>
            <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
              <Stack.Item>
                <Label htmlFor="currentApprover">Select Current Approver <span style={{ color: "red" }}>*</span></Label>
                <Dropdown
                  id="currentApprover"
                  placeholder="Select Current Approver"
                  options={currentApproverOptions}
                  selectedKey={formValues.currentApprover}
                  onChange={(e, option) => handleInputChange(e, option)}
                  styles={{ dropdown: fieldWidth }}
                />
              </Stack.Item>

              <Stack.Item>
                <Label htmlFor="natureOfInitiativeId">Nature of Initiative <span style={{ color: "red" }}>*</span></Label>
                <Dropdown
                  id="natureOfInitiativeId"
                  placeholder="Select Nature of Initiative"
                  options={natureOfInitiativeOptions}
                  selectedKey={formValues.natureOfInitiativeId}
                  onChange={(e, option) => handleInputChange(e, option)}
                  styles={{ dropdown: fieldWidth }}
                />
              </Stack.Item>

              <Stack.Item>
                <Label htmlFor="businessGroupId">Business Group <span style={{ color: "red" }}>*</span></Label>
                <Dropdown
                  id="businessGroupId"
                  placeholder="Select Business Group"
                  options={businessGroupOptions}
                  selectedKey={formValues.businessGroupId}
                  onChange={(e, option) => handleInputChange(e, option)}
                  styles={{ dropdown: fieldWidth }}
                />
              </Stack.Item>
            </Stack>
          </Stack>
        </div>

        <div className="row">
          <div className="col-auto">
            <Stack tokens={{ childrenGap: 15 }}>
              <Stack horizontal tokens={{ childrenGap: 20 }} wrap>
                <Stack.Item>
                  <Label htmlFor="stageOfApprovalId">Stage of Approval</Label>
                  <Dropdown
                    id="stageOfApprovalId"
                    placeholder="Select Stage of Approval"
                    options={stageOfApprovalOptions}
                    selectedKey={formValues.stageOfApprovalId}
                    onChange={(e, option) => handleInputChange(e, option)}
                    styles={{ dropdown: fieldWidth }}
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
              </Stack>
            </Stack>
          </div>

          <div className="col-auto d-flex align-items-end">
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <DefaultButton text="Clear Search" onClick={handleClearSearch} />
              <DefaultButton text="Next" primary onClick={handleSearchClick} />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAdvanceForm;
