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

const columns1 = [
  { key: "initiative", name: "Initiative", fieldName: "initiative", minWidth: 100 },
  { key: "q2_2023_apr", name: "Apr", fieldName: "q2_2023_apr", minWidth: 50 },
  { key: "q2_2023_may", name: "May", fieldName: "q2_2023_may", minWidth: 50 },
  { key: "q2_2023_jun", name: "Jun", fieldName: "q2_2023_jun", minWidth: 50 }
  // Add columns for other months similarly
];

const columns2 = [
  { key: "startDate", name: "High Level Start Date", fieldName: "startDate", minWidth: 150 },
  { key: "endDate", name: "High Level End Date", fieldName: "endDate", minWidth: 150 },
  { key: "comments", name: "Comments", fieldName: "comments", minWidth: 200 }
];

const columns3 = [
  { key: "costCategory", name: "Cost Category", fieldName: "costCategory", minWidth: 150 },
  { key: "description", name: "Description", fieldName: "description", minWidth: 200 },
  { key: "startDate", name: "Start Date", fieldName: "startDate", minWidth: 150 },
  { key: "endDate", name: "End Date", fieldName: "endDate", minWidth: 150 },
  { key: "amount", name: "Amount", fieldName: "amount", minWidth: 100 }
];

const scheduleData1 = [
  {
    initiative: "Metro",
    q2_2023_apr: "",
    q2_2023_may: "",
    q2_2023_jun: "" /* Add other months similarly */
  },
  {
    initiative: "R",
    q2_2023_apr: "X",
    q2_2023_may: "X",
    q2_2023_jun: "X" /* Add other months similarly */
  },
  {
    initiative: "Annual Budget Projection",
    q2_2023_apr: "X",
    q2_2023_may: "X",
    q2_2023_jun: "X" /* Add other months similarly */
  }
];

const scheduleData2 = [
  { startDate: "15 May 2023", endDate: "25 Jun 2023", comments: "-" },
  { startDate: "12 July 2023", endDate: "23 Sep 2023", comments: "-" }
];

const scheduleData3 = [
  {
    costCategory: "xyz",
    description: "xyz",
    startDate: "10 Jun 2023",
    endDate: "25 Jun 2023",
    amount: "10000"
  }
];

const ScheduleComponent = () => {
  return (
    <Stack>
      {/* Schedule Table 1 */}
      <Stack className={tableWrapperStyle}>
        <Text variant="large" className={sectionHeaderStyle}>
          Schedule Details Table 1
        </Text>
        <DetailsList
          items={scheduleData1}
          columns={columns1}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </Stack>

      {/* Schedule Table 2 */}
      <Stack className={tableWrapperStyle}>
        <Text variant="large" className={sectionHeaderStyle}>
          Schedule Details Table 2
        </Text>
        <DetailsList
          items={scheduleData2}
          columns={columns2}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </Stack>

      {/* Schedule Table 3 */}
      <Stack className={tableWrapperStyle}>
        <Text variant="large" className={sectionHeaderStyle}>
          Schedule Details Table 3
        </Text>
        <DetailsList
          items={scheduleData3}
          columns={columns3}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </Stack>
    </Stack>
  );
};

export default ScheduleComponent;
