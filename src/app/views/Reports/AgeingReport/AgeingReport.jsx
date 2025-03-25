import React, { useState } from "react";

const AgeingReport = ({ searchFilters}) => {
  const initialState = {
    businessGroupId: "",
    natureOfInitiativeId: "",
    initiativeCategory: "",
    submittedById: "",
    StatusId: "",
  };

  const [formValues, setFormValues] = useState(initialState);

  const handleInputChange = (e, option) => {
    const fieldId = e.target.id || e.target.name; // Use name if id is not available
    const value = option.key ? option.key : e.target.value;

    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value
    }));
  };

  const fieldStyle = {
    width: "100%",
    minHeight: "36px"
  };

  const stackItemStyle = {
    root: {
      flexGrow: 1,
      minWidth: "350px",
      maxWidth: "450px"
    }
  };

  return (
    <> </>
  );
};
export default AgeingReport;