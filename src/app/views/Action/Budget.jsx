import React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { Stack, Text } from "@fluentui/react";

const itemStyles = mergeStyles({
  padding: 8,
  borderBottom: "1px solid #ddd",
  display: "flex",
  justifyContent: "space-between"
});

export default function Budget({ slicedActionItems }) {
  console.log("slicedActionItems", slicedActionItems);

  return (
    <div className="mt-4">
      <Stack>
        {slicedActionItems.map((item, index) => (
          <Stack key={index} className={itemStyles}>
            <Text>{item.actionItem}</Text>
            <Text>{item.dueDate}</Text>
            <Text>{item.stage}</Text>
            <Text>{item.assignedTo}</Text>
            <Text>{item.submittedBy}</Text>
            <Text>{item.status}</Text>
            <Text>{item.priority}</Text>
            <Text>{item.initiative}</Text>
            {/* Add Fluent UI components for other columns */}
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
