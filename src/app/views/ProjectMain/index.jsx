// components/ProjectMain.js
import React from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import CompletedInitiativesTable from "./CompletedInitiativesTable";
import Charts from "./Charts";

const ProjectMain = () => {
  return (
    <div id="initiative-management" className="page-content">
      <Pivot>
        <PivotItem headerText="Completed Initiatives">
          <Charts />
          <CompletedInitiativesTable />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default ProjectMain;
