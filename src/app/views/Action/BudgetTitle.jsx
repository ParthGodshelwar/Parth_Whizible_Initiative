import React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react/lib/DetailsList";

const tableStyles = mergeStyles({
  root: {
    minWidth: 650,
    selectors: {
      "& th": {
        backgroundColor: "#f2f2f2",
        border: "1px solid #ddd",
        padding: "8px"
      },
      "& td": {
        border: "1px solid #ddd",
        padding: "8px"
      }
    }
  },
  selectedRow: {
    backgroundColor: "#e3f2fd"
  }
});

function BudgetPlan({ slicedActionItems }) {
  console.log("slicedActionItems", slicedActionItems);

  return (
    <div className="mt-4">
      <DetailsList
        items={slicedActionItems}
        columns={[
          { key: "actionItem", name: "Action Item", fieldName: "actionItem", minWidth: 100 },
          { key: "dueDate", name: "Due Date", fieldName: "dueDate", minWidth: 100 },
          { key: "stage", name: "Stage", fieldName: "stage", minWidth: 100 },
          { key: "assignedTo", name: "Assigned To", fieldName: "assignedTo", minWidth: 100 },
          { key: "submittedBy", name: "Submitted By", fieldName: "submittedBy", minWidth: 100 },
          { key: "status", name: "Status", fieldName: "status", minWidth: 100 },
          { key: "priority", name: "Priority", fieldName: "priority", minWidth: 100 },
          { key: "initiative", name: "Initiative", fieldName: "initiative", minWidth: 100 }
        ]}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionMode={SelectionMode.none}
        styles={tableStyles}
      />
    </div>
  );
}

export default BudgetPlan;
