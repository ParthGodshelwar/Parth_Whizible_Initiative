import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  DetailsListProps,
  SelectionMode,
  Stack,
  Text
} from "@fluentui/react";

const riskData = [
  {
    title: "Budget",
    items: [
      {
        risk: "C1",
        probability: "0",
        impact: "0",
        rationale: "N/A",
        status: "N/A",
        identifiedOn: "N/A",
        identifiedBy: "N/A"
      },
      {
        risk: "R",
        probability: "0",
        impact: "0",
        rationale: "N/A",
        status: "N/A",
        identifiedOn: "N/A",
        identifiedBy: "N/A"
      }
    ]
  },
  {
    title: "Build Sea link",
    items: [
      {
        risk: "R",
        probability: "0",
        impact: "0",
        rationale: "N/A",
        status: "N/A",
        identifiedOn: "N/A",
        identifiedBy: "N/A"
      }
    ]
  }
  // Add more risk data items here as needed
];

const columns = [
  {
    key: "risk",
    name: "Risks",
    fieldName: "risk",
    minWidth: 150,
    maxWidth: 150,
    isMultiline: true
  },
  {
    key: "probability",
    name: "Probability",
    fieldName: "probability",
    minWidth: 150,
    maxWidth: 150,
    isMultiline: true
  },
  { key: "impact", name: "Impact", fieldName: "impact", minWidth: 100, maxWidth: 100 },
  { key: "rationale", name: "Rationale", fieldName: "rationale", minWidth: 150, maxWidth: 150 },
  { key: "status", name: "Status", fieldName: "status", minWidth: 100, maxWidth: 100 },
  {
    key: "identifiedOn",
    name: "Identified on",
    fieldName: "identifiedOn",
    minWidth: 100,
    maxWidth: 100
  },
  {
    key: "identifiedBy",
    name: "Identified by",
    fieldName: "identifiedBy",
    minWidth: 100,
    maxWidth: 100
  }
];


const RiskTable = () => {
  return (
    <Stack>
      {riskData.map((section, index) => (
        <Stack key={index} tokens={{ childrenGap: 10 }} style={{ marginBottom: "20px" }}>
          <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
            {section.title}
          </Text>
          <DetailsList
            items={section.items}
            columns={columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
          />
        </Stack>
      ))}
    </Stack>
  );
};

export default RiskTable;
