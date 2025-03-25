import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Dropdown, TextField, Stack, PrimaryButton, DatePicker, DayOfWeek } from "@fluentui/react";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";

const ContingencyPlanForm = ({
  setContingencyPlanData,
  contingencyPlanData,
  initiativesID,
  riskID,
  contingencyPlanData1,
  personResponsibleOptions,
  onClose,
  setRefetch,
  refetch
}) => {
  console.log("contingencyPlanData", contingencyPlanData1);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const [newPlan, setNewPlan] = useState({
    responsibility: "",
    dateOfPlan: null,
    duration: "",
    workHours: "",
    contingencyPlan: ""
  });

  useEffect(() => {
    // Check if contingencyPlanData1 is null and set the new plan
    if (contingencyPlanData1 === null) {
      setNewPlan({
        responsibility: "",
        dateOfPlan: "",
        duration: "",
        workHours: "",
        contingencyPlan: ""
      });
    }
  }, [contingencyPlanData1]);

  useEffect(() => {
    if (contingencyPlanData1) {
      setNewPlan({
        responsibility: contingencyPlanData1.responsibility || "", // Use responsibilityID
        dateOfPlan: contingencyPlanData1.dateOfPlan
          ? new Date(contingencyPlanData1.dateOfPlan)
          : null, // Convert to Date
        duration: contingencyPlanData1.expectedDuration || "",
        workHours: contingencyPlanData1.expectedWork || "",
        contingencyPlan: contingencyPlanData1.contingencyPlan || ""
      });
    }
  }, [contingencyPlanData1]);
  console.log("contingencyPlanData", contingencyPlanData1);
  const resetNewPlan = () => {
    setNewPlan({
      responsibility: "",
      dateOfPlan: "",
      duration: "",
      workHours: "",
      contingencyPlan: ""
    });
  };

  const handleCancel = () => {
    resetNewPlan();
    onClose();
  };

  const saveNewPlan = async () => {
    if (!newPlan.responsibility) {
      toast.error("Responsibility should not be left blank");
      return;
    }
    if (!newPlan.dateOfPlan) {
      toast.error("Date of plan should not be left blank");
      return;
    }
    if (!newPlan.duration) {
      toast.error("Duration should not be left blank");
      return;
    }

    if (!newPlan.workHours) {
      toast.error("Work Hours should not be left blank");
      return;
    }
    if (!newPlan.contingencyPlan) {
      toast.error("Contingency Plan should not be left blank");
      return;
    }

    const dataToSave = {
      RiskId: riskID,
      IdeaID: initiativesID,
      ...(contingencyPlanData1?.contingencyPlanID && {
        ContingencyPlanID: contingencyPlanData1.contingencyPlanID
      }),
      Responsibility: newPlan.responsibility?.toString(),
      DateOfPlan: newPlan?.dateOfPlan ? format(new Date(newPlan.dateOfPlan), "MM/dd/yyyy") : "",
      ExpectedDuration: newPlan.duration,
      ExpectedWork: newPlan.workHours,
      ContingencyPlan: newPlan.contingencyPlan,
      UserID: employeeId
    };

    console.log("contingencyPlanData1", contingencyPlanData1.contingencyPlanID);
    try {
      let url;
      let method;

      // Check if riskID is present, use PUT or POST accordingly
      if (contingencyPlanData1?.riskID) {
        // If riskID exists, perform PUT request
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/UpdRiskContingencyPlans`;
        method = "POST";
      } else {
        // Otherwise, perform POST request
        url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeRisk/PostRiskContingencyPlans`;
        method = "POST";
      }

      // Convert dataToSave object to query string
      const queryString = new URLSearchParams(dataToSave)?.toString();

      // Append query string to the URL
      const fullUrl = `${url}?${queryString}`;

      // Perform the request
      await axios({
        method: method,
        url: fullUrl, // Send the full URL with query parameters
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
        }
      });
      if (contingencyPlanData1?.riskID) toast.success("Contingency plan updated successfully!");
      else toast.success("Contingency plan saved successfully!");
      setRefetch(!refetch);
      handleCancel();
    } catch (error) {
      console.error("Error saving contingency plan:", error);
      toast.error("Failed to save contingency plan.");
    }
  };

  console.log("sessionStorage", newPlan);
  return (
    <div className="contingency-plan-form">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Contingency Plan</h3>
      </div>
      <form>
        <Row className="mb-3">
          <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} className="mt-2">
            <PrimaryButton onClick={saveNewPlan} text="Save" />
            <PrimaryButton onClick={handleCancel} text="Cancel" className="ms-2" />
          </Stack>
          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>
          <Col md={4}>
            <Dropdown
              label={
                <span>
                  Responsibility <span style={{ color: "red" }}>*</span>
                </span>
              }
              placeholder="Select Responsibility"
              selectedKey={newPlan?.responsibility} // Ensure this matches the option key
              defaultSelectedKey={newPlan?.responsibility ? String(newPlan?.responsibility) : null}
              // Default value when newPlan?.responsibility is not set
              options={[
                { key: null, text: "Select Responsibility" },
                ...personResponsibleOptions?.map((item) => ({ key: item.id, text: item.name }))
              ]}
              onChange={(e, option) => setNewPlan({ ...newPlan, responsibility: option?.key })} // Store the key
            />
          </Col>
          <Col md={4}>
            <DatePicker
              label={
                <span>
                  Date Of Plan <span style={{ color: "red" }}>*</span>
                </span>
              }
              value={newPlan.dateOfPlan ? new Date(newPlan.dateOfPlan) : null} // Ensure it's a Date object
              onSelectDate={(date) => {
                if (date) {
                  // Adjust for time zone offset
                  const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                  setNewPlan({
                    ...newPlan,
                    dateOfPlan: adjustedDate
                  });
                } else {
                  setNewPlan({
                    ...newPlan,
                    dateOfPlan: null // Handle null case if no date is selected
                  });
                }
              }}
              firstDayOfWeek={DayOfWeek.Sunday} // Starting the week on Sunday
              placeholder="Select a date"
              styles={{ root: { width: 250 } }} // Adjust width as needed
            />
          </Col>
          <Col md={4}>
            <TextField
              label={
                <span>
                  Duration <span style={{ color: "red" }}>*</span>
                </span>
              }
              type="number"
              value={newPlan.duration}
              onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <TextField
              label={
                <span>
                  Work Hrs <span style={{ color: "red" }}>*</span>
                </span>
              }
              type="number"
              value={newPlan.workHours}
              onChange={(e) => setNewPlan({ ...newPlan, workHours: e.target.value })}
            />
          </Col>
          <Col md={4}>
            <TextField
              label={
                <span>
                  Contingency Plan <span style={{ color: "red" }}>*</span>
                </span>
              }
              multiline
              value={newPlan.contingencyPlan}
              onChange={(e) => setNewPlan({ ...newPlan, contingencyPlan: e.target.value })}
            />
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default ContingencyPlanForm;
