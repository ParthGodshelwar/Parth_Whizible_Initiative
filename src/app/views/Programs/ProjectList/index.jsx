import React from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import ProjectList from "./ProjectList";

const Index = () => {
  return (
    <div id="initiative-management" className="container">
      <Pivot>
        <PivotItem headerText="Completed Initiatives">
          <ProjectList />
        </PivotItem>
      </Pivot>
      s
    </div>
  );
};

export default Index;
