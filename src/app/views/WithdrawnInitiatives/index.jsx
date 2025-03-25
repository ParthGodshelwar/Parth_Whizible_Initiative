import React from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import WithdrawnInitiatives from "./WithdrawnInitiatives";
import useWithdrawnIni from "../../hooks/useWithdrawnIni";
import "../../style_custom.css";

const WithdrawnInitiativesList = () => {
  return (
    <div id="initiative-management" className="container">
      <Pivot>
        <PivotItem headerText="Withdrawn Initiatives">
          <WithdrawnInitiatives />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default WithdrawnInitiativesList;
