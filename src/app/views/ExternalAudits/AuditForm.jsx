import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col } from "react-bootstrap";
import InitiativeSelection from "./InitiativeSelection";
import AuditorSelection from "./AuditorSelection";
import { toast } from "react-toastify";
import { DatePicker, Dropdown, IconButton, on, PrimaryButton, TextField } from "@fluentui/react";
const AuditForm = ({ id , onRefresh }) => {
  const [auditTypes, setAuditTypes] = useState([]);
  const [checklistOptions, setChecklistOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  // Added By Madhuri.K On 20-Dec-2024
  const [selectedAuditType, setSelectedAuditType] = useState(null);
  // const [selectedAuditType, setSelectedAuditType] = useState("");

  const [title, setTitle] = useState("");
  const [initiative, setInitiative] = useState("");
  const [auditor, setAuditor] = useState("");
  const [auditorN, setAuditorN] = useState("");
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [plannedEndDate, setPlannedEndDate] = useState("");
  const [actualStartDate, setActualFromDate] = useState("");
  const [actualEndDate, setActualToDate] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedChecklist, setSelectedChecklist] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [conclusion, setConclusion] = useState("");

  // New state for toggling visibility of auditor and initiative sections
  const [showAuditorSelection, setShowAuditorSelection] = useState(false);
  const [showInitiativeSelection, setShowInitiativeSelection] = useState(false);

  const auditorInputRef = useRef(null);
  const initiativeInputRef = useRef(null);

  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const initiativesID = id;

  const onDropdownChange = (event, option) => {
    setSelectedAuditType(option ? option.text : null);
  };

  // Function to parse date from string format
const parseDate = (dateString) => {
  if (!dateString) return null; // Handle null or undefined
  if (dateString instanceof Date) return dateString; // If already a Date object

  const normalizedDateString = dateString.replace(/\s+/g, " ").trim();
  const match = normalizedDateString.match(/([A-Za-z]{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2})(AM|PM)/);

  if (match) {
    const [_, month, day, year, hours, minutes, period] = match;
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    let hour = parseInt(hours, 10);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return new Date(year, months[month], parseInt(day, 10), hour, parseInt(minutes, 10));
  }
  console.warn("Date parsing failed:", dateString);
  return null; // Return null if parsing fails
};

// Function to format date before saving
const formatDate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00:00`;
};
  // const handleSelectAuditors = (auditors) => {
  //   console.log("Selected Auditors:", auditors);
  //   const auditorNames = auditors.map((auditor) => auditor.userName).join(", ");
  //   const auditorIDs = auditors.map((auditor) => auditor.employeeID).join(", ");
  
  //   setAuditor(auditorNames);
  //   setAuditorN(auditorIDs);
  //   sessionStorage.setItem("selectedAuditors", JSON.stringify(auditors));
  // };
  const handleSelectAuditors = (auditors) => {
    setAuditor(auditors.map((auditor) => auditor.userName).join(", "));
    setAuditorN(auditors.map((auditor) => auditor.employeeID).join(","));
    
    // ✅ Store entire list in session storage
    sessionStorage.setItem("selectedAuditors", JSON.stringify(auditors));
  };
  
    // commented By Madhuri.K on 11-03-2025 

  // const handleSelectInitiative = (initiative) => {
  //   console.log("Selected Initiative:", initiative);
  //   setInitiative(initiative); // Store full initiative object
  //   // Added By  Madhuri.K on 11-03-2025
  //   // setInitiative(initiative.initiativeTitle || ""); // Store only the title
  // };
  const handleSelectInitiative = (initiative) => {
    console.log("Selected Initiative:", initiative);
    setInitiative({ title: initiative.initiativeTitle, id: initiative.initiativeID });
  };
  
  
  const fetchOptions = async (fieldName, setState) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDropDownDetails?IdeaId=${initiativesID}&userID=${employeeId}&FieldName=${fieldName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );
      const data = await response.json();
      setState(
        data.data.listInitiativeDetailDropDownEntity.map((item) => ({
          key: item.id,
          text: item.name
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [auditList, setAuditList] = useState([]);  // 🔹 Store the list data

const fetchInitiatives = async () => {
  try {
      const response = await fetch(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/GetExternalAuditDetails?AuditID=${id}`,
          {
              method: "GET",
              headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` }
          }
      );

      const data = await response.json();
      console.log("GetExternalAuditDetails API Response:", data);

      // if (data && data.data) {
      //     const auditDetail = data.data.listExternalAuditDetailsEntity?.[0];
        
      //     if (auditDetail.auditor) {
      //       const selectedNames = auditDetail.auditor?.split(",") || [];
      //       const selectedIDs = auditDetail.auditTypeID?.split(",") || [];
          
      //       // Combine Name & ID to pass it as List
      //       const selectedAuditors = selectedNames.map((name, index) => ({
      //         employeeID: selectedIDs[index] ? selectedIDs[index] : "",
      //         userName: name
      //       }));
          
      //       // ✅ Set Only Names in Text Field
      //       setAuditor(selectedAuditors.map((auditor) => auditor.userName).join(", "));
          
      //       // ✅ Store Employee ID Separately to Send in API
      //       setAuditorN(selectedAuditors.map((auditor) => auditor.employeeID).join(","));
          
      //       // ✅ Store Entire Auditor List in SessionStorage for Pre-Selection
      //       sessionStorage.setItem("selectedAuditors", JSON.stringify(selectedAuditors));
      //     }
          
          
         
      //     setTitle(auditDetail.title);
      //     // setInitiative(auditDetail.initiative);
      //     setInitiative({ title: auditDetail.initiative, id: auditDetail.initiativeID });
      //     setSelectedAuditType(auditDetail.auditType);
          
      //     setPlannedStartDate(auditDetail.plannedStartDate ? new Date(auditDetail.plannedStartDate) : null);      
      //     setPlannedEndDate(auditDetail.plannedEndDate ? new Date(auditDetail.plannedEndDate) : null);
      //     setActualFromDate(auditDetail.actualStartDate ? new Date(auditDetail.actualStartDate) : null);
      //     setActualToDate(auditDetail.actualEndDate ? new Date(auditDetail.actualEndDate) : null);
      //     setDuration(auditDetail.duration);
      //     setNotes(auditDetail.notes);
      //     setConclusion(auditDetail.conclusion);
      //     setSelectedChecklist(auditDetail.checklistID);
      //     setSelectedStatus(auditDetail.statusName);
      // }
      if (data && data.data) {
        const auditDetail = data.data.listExternalAuditDetailsEntity?.[0];
    
        if (auditDetail) {
            // ✅ Extract IDs and Names separately
            const selectedIDs = auditDetail.auditors?.split(",") || [];
            const selectedNames = auditDetail.auditorslist?.split(",") || [];
    
            // ✅ Combine ID and Name into an array of objects
            const selectedAuditors = selectedIDs.map((id, index) => ({
                employeeID: id.trim(),                          // ID
                userName: selectedNames[index]?.trim() || ""    // Name
            }));
    
            // ✅ Display only names in the form field
            setAuditor(selectedAuditors.map(auditor => auditor.userName).join(", "));
    
            // ✅ Store IDs separately for API submission
            setAuditorN(selectedAuditors.map(auditor => auditor.employeeID).join(","));
    
            // ✅ Store the entire auditor list in sessionStorage for pre-selection
            sessionStorage.setItem("selectedAuditors", JSON.stringify(selectedAuditors));
        }
    
        // ✅ Set the rest of the audit details
        setTitle(auditDetail.title);
        setInitiative({ title: auditDetail.initiative, id: auditDetail.initiativeID });
        setSelectedAuditType(auditDetail.auditType);
        
        setPlannedStartDate(auditDetail.plannedStartDate ? new Date(auditDetail.plannedStartDate) : null);      
        setPlannedEndDate(auditDetail.plannedEndDate ? new Date(auditDetail.plannedEndDate) : null);
        setActualFromDate(auditDetail.actualStartDate ? new Date(auditDetail.actualStartDate) : null);
        setActualToDate(auditDetail.actualEndDate ? new Date(auditDetail.actualEndDate) : null);
        setDuration(auditDetail.duration);
        setNotes(auditDetail.notes);
        setConclusion(auditDetail.conclusion);
        setSelectedChecklist(auditDetail.checklistID);
        setSelectedStatus(auditDetail.statusName);
    }
    
  } catch (error) {
      console.error("Error fetching initiatives data:", error);
  }
};

useEffect(() => {
  const storedAuditors = sessionStorage.getItem("selectedAuditors");
  if (storedAuditors) {
    const selectedAuditors = JSON.parse(storedAuditors);
    setAuditor(selectedAuditors.map((auditor) => auditor.userName).join(", "));
    setAuditorN(selectedAuditors.map((auditor) => auditor.employeeID).join(","));
  }
}, [id]);

  useEffect(() => {
    fetchOptions("audittype", setAuditTypes);
    fetchOptions("AuditChecklist", setChecklistOptions);
    fetchOptions("ExternalAuditstatus", setStatusOptions);
    fetchInitiatives();
  }, [initiativesID, employeeId]);
// 🔹 Fetch list data when component loads

// useEffect(() => {
//   fetchInitiatives();
// }, []);
useEffect(() => {
  if (id) {
    fetchInitiatives();
  }
}, [id]);


useEffect(() => {
  console.log("Current Auditor Name:", auditor);
  console.log("Current Auditor ID:", auditorN);
}, [auditor, auditorN]);

const handleDateSelect = (setter) => (date) => {
  console.log("Selected Date:", date);
  setter(date ? formatDate(date) : "");
};
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedAuditType) {
    toast.error("Audit Type should not be left blank");
    return;
  }
  if (!title) {
    toast.error("Title should not be left blank");
    return;
  }
  if (!initiative) {
    toast.error("Initiative should not be left blank");
    return;
  }
  if (!auditor || auditor.length === 0) {
    toast.error("Auditor should not be left blank");
    return;
  }
  if (plannedStartDate > plannedEndDate) {
    toast.error("The 'Planned Start Date' should not be greater than 'Planned End Date'.");
    return;
  }
  if (actualStartDate && actualEndDate && actualStartDate > actualEndDate) {
    toast.error("The 'Actual Start Date' should not be greater than 'Actual End Date'.");
    return;
  }

  const payload = {
    auditID: id || 0,
    auditors: auditorN ? auditorN.toString() : "",
    auditTypeID: auditTypes.find((type) => type.text === selectedAuditType)?.key || 0,
    title: title?.trim() || "",
    initiativeID: initiative?.id || 0,
    plannedStartDate: plannedStartDate || null,
    plannedEndDate: plannedEndDate || null,
    actualStartDate: actualStartDate || null,
    actualEndDate: actualEndDate || null,
    duration: duration ? parseInt(duration) : 0,
    AuditChecklist: checklistOptions.find((option) => option.text === selectedChecklist)?.key || 0,
    ExternalAuditstatus: statusOptions.find((s) => s.text === selectedStatus)?.key || 0,
    notes: notes?.trim() || "",
    conclusion: conclusion?.trim() || "",
    userID: employeeId || 0,
  };

  const isEditMode = id !== null && id !== 0;
  const apiEndpoint = isEditMode
    ? `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/UpdExternalAuditPost`
    : `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/ExternalAudit/PostExternalAuditPost`;

  try {
    const response = await fetch(apiEndpoint, {
      method: isEditMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to save audit");
    }

    toast.success(isEditMode ? "Audit updated successfully!" : "Audit saved successfully!");

    if (onRefresh) {
      console.log("Calling Refresh...");
      setTimeout(() => {
        onRefresh();
      }, 1000);
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    toast.error(error.message || "An error occurred while saving.");
  }
};
  const inputStyle = {
    width: "100%",
    border: "1px solid #ced4da",

    color: "#495057"
  };

  const placeholderStyle = {
    color: "#6c757d"
  };

  return (
    <div className="audit-form" style={{ width: "100%" }}>
      {!showInitiativeSelection && !showAuditorSelection && (
        <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Row className="mb-3">
            <Col className="text-end">
              <PrimaryButton variant="primary" type="submit" style={{ width: "auto" }}>
                Save
              </PrimaryButton>
            </Col>
          </Row>
          <div className="col-sm-12 text-end required">
            <label className="IM_label ">
              (<font color="red">*</font> Mandatory)
            </label>
          </div>
          <Row className="mb-2">
            <Col md={4}>
              <Form.Group controlId="auditType">
                <Form.Label className="required">Audit Type</Form.Label>
                <Dropdown
                  placeholder="Select Audit Type"
                  options={auditTypes}
                  selectedKey={
                    selectedAuditType
                      ? auditTypes.find((t) => t.text === selectedAuditType)?.key
                      : undefined
                  }
                  onChange={onDropdownChange}
                  styles={{
                    root: { width: "100%" },
                    dropdown: { width: "100%" }
                  }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="title">
                <Form.Label className="required">Title</Form.Label>

                <TextField
                  value={title}
                  onChange={(event, newValue) => setTitle(newValue)}
                  placeholder="Enter title"
                  styles={{ fieldGroup: { ...inputStyle } }}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="initiative">
                <Form.Label className="required">Initiative</Form.Label>
                <div style={{ position: "relative" }}>
                  {/* commented By Madhuri.K on 11-03-2025 */}
                  {/* <TextField value={initiative} */}
                  <TextField value={initiative?.title || ""}
                    onChange={(event, newValue) => setInitiative(newValue)}
                    placeholder="Select Initiative"
                    disabled
                    styles={{ fieldGroup: { paddingRight: "40px"} }}/>
                  <IconButton
                    iconProps={{ iconName: "Link" }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowInitiativeSelection(!showInitiativeSelection)}
                    ariaLabel="Select Auditor"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={4}>
              <Form.Group controlId="auditor">
                <Form.Label className="required">Auditor</Form.Label>

                <div style={{ position: "relative" }}>
                  <TextField
                    value={auditor || "Select Auditor"}  // Show placeholder text if empty
                    onChange={(e, newValue) => setAuditor(newValue)}
                    placeholder="Select Auditor"
                    disabled
                    styles={{
                      fieldGroup: {
                        paddingRight: "40px"
                      }
                    }}
                  />

                  <IconButton
                    iconProps={{ iconName: "Link" }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer"
                    }}
                    onClick={() => setShowAuditorSelection(!showAuditorSelection)}
                    ariaLabel="Select Auditor"
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="plannedStartDate">
                <Form.Label className="required">Planned Start Date</Form.Label>
                {/* <DatePicker
                  value={plannedStartDate ? new Date(plannedStartDate) : null}
                  onSelectDate={(date) => {
                    console.log("Selected Date:", date);
                    setPlannedStartDate(date ? date.toISOString() : ""); // Store as ISO string
                  }}
                  placeholder="Select Planned Start Date"
                  ariaLabel="Select a planned Start date"
                /> */}
                <DatePicker
                  value={plannedStartDate ? new Date(plannedStartDate) : null}
                  onSelectDate={handleDateSelect(setPlannedStartDate)}
                  placeholder="Select Planned Start Date"
                  ariaLabel="Select a planned Start date"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="plannedEndDate">
                <Form.Label className="required">Planned End Date</Form.Label>
                <DatePicker
                  value={plannedEndDate ? new Date(plannedEndDate) : null}
                  onSelectDate={handleDateSelect(setPlannedEndDate)}
                  placeholder="Select Planned End Date"
                  ariaLabel="Select a planned End date"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={4}>
              <Form.Group controlId="actualStartDate">
                <Form.Label>Actual From Date</Form.Label>
               
                {/* <DatePicker
                  value={actualStartDate ? new Date(actualStartDate) : null}
                  onSelectDate={(date) => {
                    console.log("Selected Date:", date);
                    setActualFromDate(date ? date.toISOString() : ""); // Store as ISO string
                  }}
                  placeholder="Select Actual From Date"
                  ariaLabel="Select a Actual From date"
                /> */}
                <DatePicker
                  value={actualStartDate ? new Date(actualStartDate) : null}
                  onSelectDate={handleDateSelect(setActualFromDate)}
                  placeholder="Select Actual From Date"
                  ariaLabel="Select an Actual From date"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="actualEndDate">
                <Form.Label>Actual To Date</Form.Label>
                {/* <DatePicker
                  value={actualEndDate ? new Date(actualEndDate) : null}
                  onSelectDate={(date) => {
                    console.log("Selected Date:", date);
                    setActualToDate(date ? date.toISOString() : ""); // Store as ISO string
                  }}
                  placeholder="Select Actual To Date"
                  ariaLabel="Select a Actual To date"
                /> */}
                <DatePicker
                  value={actualEndDate ? new Date(actualEndDate) : null}
                  onSelectDate={handleDateSelect(setActualToDate)}
                  placeholder="Select Actual To Date"
                  ariaLabel="Select an Actual To date"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="duration">
                <Form.Label>Duration</Form.Label>
                <TextField
                  value={duration}
                  onChange={(e, newValue) => setDuration(newValue)}
                  placeholder="Enter duration"
                  ariaLabel="Duration"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-2">
            <Col md={4}>
              <Form.Group controlId="checklist">
                <Form.Label>Checklist</Form.Label>
                <Dropdown
                  placeholder="Select Checklist"
                  selectedKey={checklistOptions.find(option => option.key === selectedChecklist)?.key || null}
                  onChange={(event, option) => setSelectedChecklist(option ? option.key : null)}
                  options={checklistOptions.map(option => ({ key: option.key, text: option.text }))}
                  ariaLabel="Checklist Dropdown"
                />

              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Dropdown
                  placeholder="Select Status"
                  selectedKey={
                    selectedStatus
                      ? statusOptions.find((s) => s.text === selectedStatus)?.key
                      : undefined
                  }
                  onChange={(event, option) => setSelectedStatus(option ? option.text : null)}
                  
                  // onChange={onChange}
                  options={statusOptions.map((option) => ({
                    key: option.key,
                    text: option.text
                  }))}
                  // styles={dropdownStyles}
                  ariaLabel="Status Dropdown"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <Form.Group controlId="notes">
                <Form.Label>Notes</Form.Label>
                <TextField
                  multiline
                  rows={3}
                  value={notes}
                  onChange={(e, newValue) => setNotes(newValue)}
                  placeholder="Enter notes"
                  styles={{
                    fieldGroup: { ...inputStyle }
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="conclusion">
                <Form.Label>Conclusion</Form.Label>
                <TextField
                  multiline
                  rows={3}
                  value={conclusion}
                  onChange={(e, newValue) => setConclusion(newValue)}
                  placeholder="Enter conclusion"
                  styles={{
                    fieldGroup: { ...inputStyle }
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      )}

      {showInitiativeSelection && (
        <InitiativeSelection
          onClose={() => setShowInitiativeSelection(false)}
          onSelectInitiative={handleSelectInitiative}
        />
      )}
      {showAuditorSelection && (
        // <AuditorSelection
        //   // auditor={auditor}
        //   // selectedAuditorIds={auditorN ? auditorN.split(",") : []} // Pass array of selected IDs
        //   auditor={auditor}
        //   selectedAuditors={auditorN ? auditorN.split(",").map(id => ({ employeeID: id })) : []}
        //   onClose={() => setShowAuditorSelection(false)}
        //   onSelectAuditors={handleSelectAuditors}
        //   initiativesID={id}
        //   employeeId={employeeId}
        // />
        <AuditorSelection
          auditor={auditor}
          selectedAuditors={JSON.parse(sessionStorage.getItem("selectedAuditors")) || []}
          onClose={() => setShowAuditorSelection(false)}
          onSelectAuditors={handleSelectAuditors}
          initiativesID={id}
          employeeId={employeeId}
        />

      )}

    </div>
  );
};

export default AuditForm;
