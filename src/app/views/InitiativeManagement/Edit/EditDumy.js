export const resourcesData = [
  {
    role: "Developer",
    skills: ["C#", "Dot Net", "SQL"],
    inDate: "2022-08-10",
    outDate: "2022-08-10",
    fte: ""
  },
  {
    role: "Tester",
    skills: ["Java", "Selenium"],
    inDate: "2022-09-15",
    outDate: "2022-09-15",
    fte: ""
  }
  // Add more data as needed
];
export const tabData = [
  {
    id: "basic-details",
    title: "Basic Details"
  },
  {
    id: "resources",
    title: "Resources"
  },
  {
    id: "cost",
    title: "Cost"
  },
  {
    id: "work-order",
    title: "Work Order"
  },
  {
    id: "funding",
    title: "Funding"
  },
  {
    id: "roi",
    title: "ROI"
  },
  {
    id: "stage",
    title: "Stage"
  },
  {
    id: "timelines",
    title: "Timelines"
  },
  {
    id: "documents",
    title: "Documents"
  },
  {
    id: "workflows",
    title: "Workflows"
  },
  {
    id: "more-actions",
    title: "More Actions"
  },
  {
    id: "discussion-thread",
    title: "Discussion Thread"
  },
  {
    id: "initiative-history",
    title: "Initiative History"
  }
];
export const buttonData = [
  {
    label: "Push back",
    onClick: () => {
      // Define your action for Push back button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Approve",
    onClick: () => {
      // Define your action for Approve button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Withdraw Initiative",
    onClick: () => {
      // Define your action for Withdraw Initiative button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Save",
    onClick: () => {
      // Define your action for Save button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Save & Draft",
    onClick: () => {
      // Define your action for Save & Draft button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Send",
    onClick: () => {
      // Define your action for Send button
    },
    display: true // Set to true to display this button
  },
  {
    label: "Submit",
    onClick: () => {
      // Define your action for Submit button
    },
    display: true // Set to true to display this button
  }
];
export const costData = [
  {
    category: "Lorem Ipsum 1",
    amount: "6,21,75,831",
    startDate: "10 Aug 2022",
    endDate: "10 Aug 2022"
  },
  {
    category: "Lorem Ipsum 2",
    amount: "4,32,54,123",
    startDate: "12 Sep 2022",
    endDate: "12 Sep 2022"
  }
  // Add more objects as needed
];
export const formData = [
  {
    display: true,
    label: "Nature Of Initiative",
    placeholder: "Enter nature of initiative",
    type: "TextField",
    required: true,
    editable: true,
    stateKey: "natureOfInitiative"
  },
  {
    display: true,
    label: "Initiative Code",
    placeholder: "Enter initiative code",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "initiativeCode"
  },
  {
    display: true,
    label: "Select Initiative Icon (Upload)",
    placeholder: "Select Initiative Icon (Upload)",
    type: "FileUpload",
    required: false,
    editable: true,
    stateKey: "initiativeIcon"
  },
  {
    display: true,
    label: "Business Group",
    placeholder: "Select Business Group",
    type: "Dropdown",
    required: true,
    editable: true,
    stateKey: "businessGroup",
    options: [
      { key: "bg1", text: "Business Group 1" },
      { key: "bg2", text: "Business Group 2" },
      { key: "bg3", text: "Business Group 3" }
    ]
  },
  {
    display: true,
    label: "Organization Unit",
    placeholder: "Select Organization Unit",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "organizationUnit",
    options: [
      { key: "ou1", text: "Organization Unit 1" },
      { key: "ou2", text: "Organization Unit 2" },
      { key: "ou3", text: "Organization Unit 3" }
    ]
  },
  {
    display: true,
    label: "Delivery Unit",
    placeholder: "Select Delivery Unit",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "deliveryUnit",
    options: [
      { key: "du1", text: "Delivery Unit 1" },
      { key: "du2", text: "Delivery Unit 2" },
      { key: "du3", text: "Delivery Unit 3" }
    ]
  },
  {
    display: true,
    label: "Delivery Team",
    placeholder: "Select Delivery Team",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "deliveryTeam",
    options: [
      { key: "dt1", text: "Delivery Team 1" },
      { key: "dt2", text: "Delivery Team 2" },
      { key: "dt3", text: "Delivery Team 3" }
    ]
  },
  {
    display: true,
    label: "Project Manager",
    placeholder: "Select Project Manager",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "projectManager",
    options: [
      { key: "pm1", text: "Project Manager 1" },
      { key: "pm2", text: "Project Manager 2" },
      { key: "pm3", text: "Project Manager 3" }
    ]
  },
  {
    display: true,
    label: "Sponsor",
    placeholder: "Select Sponsor",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "sponsor",
    options: [
      { key: "sp1", text: "Sponsor 1" },
      { key: "sp2", text: "Sponsor 2" },
      { key: "sp3", text: "Sponsor 3" }
    ]
  },
  {
    display: true,
    label: "Overall Initiative Effort (PD)",
    placeholder: "Enter overall initiative effort",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "overallEffort"
  },
  {
    display: true,
    label: "Size",
    placeholder: "Select Size",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "size",
    options: [
      { key: "s1", text: "Small" },
      { key: "s2", text: "Medium" },
      { key: "s3", text: "Large" }
    ]
  },
  {
    display: true,
    label: "Application",
    placeholder: "Select Application",
    type: "Dropdown",
    required: true,
    editable: true,
    stateKey: "application",
    options: [
      { key: "app1", text: "Application 1" },
      { key: "app2", text: "Application 2" },
      { key: "app3", text: "Application 3" }
    ]
  },
  {
    display: true,
    label: "Resource Approach",
    placeholder: "Select Resource Approach",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "resourceApproach",
    options: [
      { key: "ra1", text: "Resource Approach 1" },
      { key: "ra2", text: "Resource Approach 2" },
      { key: "ra3", text: "Resource Approach 3" }
    ]
  },
  {
    display: true,
    label: "Initiative Reporting Frequency",
    placeholder: "Select Initiative Reporting Frequency",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "reportingFrequency",
    options: [
      { key: "rf1", text: "Weekly" },
      { key: "rf2", text: "Monthly" },
      { key: "rf3", text: "Quarterly" }
    ]
  },
  {
    display: true,
    label: "Vendor",
    placeholder: "Enter vendor name",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "vendor"
  },
  {
    display: true,
    label: "Planned High Level Start Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: true,
    editable: true,
    stateKey: "plannedStart"
  },
  {
    display: true,
    label: "Planned High Level End Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: true,
    editable: true,
    stateKey: "plannedEnd"
  },
  {
    display: true,
    label: "Initiative Submission Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "submissionDate"
  },
  {
    display: true,
    label: "Requested By",
    placeholder: "Select",
    type: "Dropdown",
    required: false,
    editable: true,
    stateKey: "requestedBy",
    options: [
      { key: "rb1", text: "Person 1" },
      { key: "rb2", text: "Person 2" },
      { key: "rb3", text: "Person 3" }
    ]
  },
  {
    display: true,
    label: "Objectives and Planned Results of Proposed Program",
    placeholder: "Enter objectives",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "objectives"
  },
  {
    display: true,
    label: "Conceptualization Start Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: true,
    editable: true,
    stateKey: "conceptualizationStart"
  },
  {
    display: true,
    label: "Conceptualization End Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: true,
    editable: true,
    stateKey: "conceptualizationEnd"
  },
  {
    display: true,
    label: "Conceptualization Comments",
    placeholder: "Enter comments",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "conceptualizationComments"
  },
  {
    display: true,
    label: "Planned Solutioning Start Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedSolutioningStart"
  },
  {
    display: true,
    label: "Planned Solutioning End Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedSolutioningEnd"
  },
  {
    display: true,
    label: "Solutioning Comments",
    placeholder: "Enter comments",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "solutioningComments"
  },
  {
    display: true,
    label: "Planned Execution Start Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedExecutionStart"
  },
  {
    display: true,
    label: "Planned Execution End Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedExecutionEnd"
  },
  {
    display: true,
    label: "Planned Acceptance Start Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedAcceptanceStart"
  },
  {
    display: true,
    label: "Planned Acceptance End Date",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "plannedAcceptanceEnd"
  },
  {
    display: true,
    label: "Acceptance Comments",
    placeholder: "Enter comments",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "acceptanceComments"
  },
  {
    display: true,
    label: "CustomFieldText1",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldText1"
  },
  {
    display: true,
    label: "CustomFieldText2",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldText2"
  },
  {
    display: true,
    label: "CustomFieldText3",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldText3"
  },
  {
    display: true,
    label: "CustomFieldText4",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldText4"
  },
  {
    display: true,
    label: "CustomFieldText5",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldText5"
  },
  {
    display: true,
    label: "CustomFieldNumeric1",
    placeholder: "Enter number",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldNumeric1"
  },
  {
    display: true,
    label: "CustomFieldNumeric2",
    placeholder: "Enter number",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldNumeric2"
  },
  {
    display: true,
    label: "CustomFieldNumeric3",
    placeholder: "Enter number",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldNumeric3"
  },
  {
    display: true,
    label: "CustomFieldNumeric4",
    placeholder: "Enter number",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldNumeric4"
  },
  {
    display: true,
    label: "CustomFieldNumeric5",
    placeholder: "Enter number",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customFieldNumeric5"
  },
  {
    display: true,
    label: "CustomFieldDate1",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "customFieldDate1"
  },
  {
    display: true,
    label: "CustomFieldDate2",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "customFieldDate2"
  },
  {
    display: true,
    label: "CustomFieldDate3",
    placeholder: "Select date",
    type: "DatePicker",
    required: false,
    editable: true,
    stateKey: "customFieldDate3"
  },
  {
    display: true,
    label: "CustomTextArea1",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customTextArea1"
  },
  {
    display: true,
    label: "CustomTextArea2",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customTextArea2"
  },
  {
    display: true,
    label: "CustomTextArea3",
    placeholder: "Enter text",
    type: "TextField",
    required: false,
    editable: true,
    stateKey: "customTextArea3"
  }
];
