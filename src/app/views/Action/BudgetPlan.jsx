import React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  CheckboxVisibility
} from "@fluentui/react";

const useStyles = mergeStyles({
  selectedRow: {
    backgroundColor: "#e3f2fd"
  }
});

function BudgetPlan({ slicedActionItems }) {
  console.log("slicedActionItems", slicedActionItems);
  const classes = useStyles();

  const columns = [
    {
      key: "column1",
      name: "Action Item",
      fieldName: "actionItem",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column2",
      name: "Due Date",
      fieldName: "dueDate",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column3",
      name: "Stage",
      fieldName: "stage",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column4",
      name: "Assigned To",
      fieldName: "assignedTo",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column5",
      name: "Submitted By",
      fieldName: "submittedBy",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column6",
      name: "Status",
      fieldName: "status",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column7",
      name: "Priority",
      fieldName: "priority",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column8",
      name: "Initiative",
      fieldName: "initiative",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    }
  ];

  return (
    <div className="mt-4">
      <DetailsList
        items={slicedActionItems}
        columns={columns}
        selectionMode={SelectionMode.none}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        checkboxVisibility={CheckboxVisibility.hidden}
        onRenderRow={(props, defaultRender) => (
          <div className={props.itemIndex === 0 ? classes.selectedRow : ""}>
            {defaultRender(props)}
          </div>
        )}
      />
    </div>
  );
}

export default BudgetPlan;
