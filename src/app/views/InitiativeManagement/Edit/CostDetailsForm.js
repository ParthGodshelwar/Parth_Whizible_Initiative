import React, { useState, useEffect } from "react";
import { PrimaryButton, TextField, DatePicker, Dropdown } from "@fluentui/react";

const CostDetailsForm = ({ formState1, handleSaveClick, roleOptions, acc }) => {
  const [formState, setFormState] = useState({
    costCategory: "",
    costCategoryID: "",
    amount: "",
    costType: 0, // 0 = Fixed, 1 = Running
    fromDate: null,
    toDate: null,
    description: ""
  });

  // Sync formState1 with formState when formState1 is available
  useEffect(() => {
    if (formState1) {
      setFormState((prevState) => ({
        ...prevState,
        ...formState1
      }));
    }
  }, [formState1]);

  const handleCostTypeChange = (id) => {
    if (formState.costType !== id) {
      setFormState((prevState) => ({
        ...prevState,
        costType: id
      }));
    }
  };

  const handleFormChange = (field, value) => {
    setFormState((prevState) => {
      if (prevState[field] === value) return prevState; // Prevent unnecessary updates
      return { ...prevState, [field]: value };
    });
  };

  return (
    <div id="CostDetailsTab1">
      {/* Save Button */}
      {acc[2]?.access !== 0 && (
        <div className="detailsubtabsbtn pb-1 text-end">
          <PrimaryButton
            text="Save"
            onClick={() => handleSaveClick({ formState1: formState })}
            data-bs-toggle="tooltip"
            id="sv_costdetails"
          />
        </div>
      )}

      {/* Mandatory Label */}
      <div className="col-sm-12 text-end form-group">
        <label className="form-label IM_label">
          (<span style={{ color: "red" }}>*</span> Mandatory)
        </label>
      </div>

      {/* Form Fields */}
      <div className="form-group row pt-1 mb-3 d-flex align-items-center">
        {/* Cost Category Field */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            Cost Category <span style={{ color: "red" }}>*</span>
          </label>
          <Dropdown
            placeholder="Select a category"
            id="select_Category"
            selectedKey={formState?.costCategoryID}
            options={roleOptions} // Array of { key, text } objects
            onChange={(e, option) => handleFormChange("costCategoryID", option?.key)}
          />
        </div>

        {/* Cost Type Radio Buttons */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            Cost Type <span style={{ color: "red" }}>*</span>
          </label>
          <div className="d-flex align-items-center">
            <label style={{ marginRight: "8px" }}>
              <input
                type="radio"
                name="costType"
                value="0"
                checked={formState.costType === 0}
                onChange={() => handleCostTypeChange(0)} // Only update when necessary
                style={{ marginRight: "5px" }}
              />
              Fixed
            </label>
            <label>
              <input
                type="radio"
                name="costType"
                value="1"
                checked={formState.costType === 1}
                onChange={() => handleCostTypeChange(1)} // Only update when necessary
                style={{ marginRight: "5px" }}
              />
              Running
            </label>
          </div>
        </div>

        {/* Amount Field */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            Amount <span style={{ color: "red" }}>*</span>
          </label>
          <TextField
            value={formState.amount}
            onChange={(e) => {
              const newValue = e.target.value;

              // Regular expression to allow up to 9 digits before the decimal point and up to 2 digits after
              if (/^\d{0,9}(\.\d{0,2})?$/.test(newValue)) {
                handleFormChange("amount", newValue);
              }
            }}
            type="text"
            inputProps={{
              inputMode: "decimal" // Ensure appropriate keyboard for numeric input
            }}
            styles={{
              fieldGroup: { border: "1px solid #ced4da", borderRadius: "4px" },
              root: { marginTop: "8px" }
            }}
          />
        </div>
      </div>

      <div className="form-group row pt-1 mb-3 align-items-center">
        {/* From Date Field */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            From Date <span style={{ color: "red" }}>*</span>
          </label>
          <DatePicker
            placeholder="Select Date"
            value={formState.fromDate ? new Date(formState.fromDate) : null}
            onSelectDate={(date) => {
              if (date) {
                // Adjust for time zone offset
                const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                handleFormChange("fromDate", adjustedDate);
              } else {
                handleFormChange("fromDate", null);
              }
            }}
            required
          />
        </div>

        {/* To Date Field */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            To Date <span style={{ color: "red" }}>*</span>
          </label>
          <DatePicker
            placeholder="Select Date"
            value={formState.toDate ? new Date(formState.toDate) : null}
            onSelectDate={(date) => {
              if (date) {
                // Adjust for time zone offset
                const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                handleFormChange("toDate", adjustedDate);
              } else {
                handleFormChange("toDate", null);
              }
            }}
            required
          />
        </div>

        {/* Description Field */}
        <div className="col-sm-4 form-group required">
          <label className="form-label IM_label text-end">
            Description<span style={{ color: "red" }}>*</span>
          </label>
          <TextField
            value={formState.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            multiline
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CostDetailsForm;
