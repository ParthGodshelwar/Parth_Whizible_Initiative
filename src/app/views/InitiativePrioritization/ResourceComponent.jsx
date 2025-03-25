import React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Stack,
  Text,
  mergeStyles
} from "@fluentui/react";

// Styles
const tableWrapperStyle = mergeStyles({
  marginBottom: "20px"
});

const sectionHeaderStyle = mergeStyles({
  backgroundColor: "#D9EAD3",
  padding: "10px"
});

const columns = [
  { key: "initiativeTitle", name: "Initiative Title", fieldName: "initiativeTitle", minWidth: 150 },
  { key: "role", name: "Role", fieldName: "role", minWidth: 150 },
  { key: "fte", name: "FTE", fieldName: "fte", minWidth: 50 },
  { key: "skills", name: "Skills", fieldName: "skills", minWidth: 150 }
];

const resourceData = [
  { initiativeTitle: "Core", role: "CEO", fte: "1", skills: "Java" },
  { initiativeTitle: "Core", role: "Administrators", fte: "1.9", skills: "Java" },
  { initiativeTitle: "Infotech Solutions", role: "CEO", fte: "0", skills: "Java" },
  { initiativeTitle: "Management", role: "Developer", fte: "2", skills: "Java" },
  { initiativeTitle: "Initiative Management", role: "Administrators", fte: "0", skills: "Java" },
  { initiativeTitle: "New Enhancement", role: "Test Lead", fte: "1.2", skills: "Java" }
];

const ResourceComponent = () => {
  return (
    <Stack>
      {/* Resource Table */}
      <Stack className={tableWrapperStyle}>
        <Text variant="large" className={sectionHeaderStyle}>
          Resource Details
        </Text>
        <DetailsList
          items={resourceData}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </Stack>
    </Stack>
  );
};

export default ResourceComponent;
