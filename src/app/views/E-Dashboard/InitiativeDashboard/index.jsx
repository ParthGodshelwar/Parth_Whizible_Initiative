import { Pivot, PivotItem, PrimaryButton } from "@fluentui/react";
import "../../../style_custom.css";
import CachedIcon from "@mui/icons-material/Cached";
import GetInitiativePlannedVsConverted from "../../../hooks/InitiativeDashboard/GetPlanVsConvertedGraph";
import GetInitiativePlannedVsAdhoc from "../../../hooks/InitiativeDashboard/GetPlanVsAdhocGraph";
import GetIniCountByIniCategoryGraph from "../../../hooks/InitiativeDashboard/GetIniCountByIniCategoryGraph";
import GetIniCountByNOIGraph from "../../../hooks/InitiativeDashboard/GetIniCountByNOIGraph";
import InitiativeChart from "./InitiativeChart";
const EDashboard = () => {
  const { InitiativeDashboard1 } = GetInitiativePlannedVsConverted();
  const { InitiativeDashboard2 } = GetInitiativePlannedVsAdhoc();
  const { InitiativeDashboard3 } = GetIniCountByIniCategoryGraph();
  const { InitiativeDashboard4 } = GetIniCountByNOIGraph();

  return (
    <>
      <div id="InitiativeDashboard" className="container">
        <div className="d-flex justify-content-between">
          <div className="flex-1">
            {/* <Pivot>
              <PivotItem headerText="Initiative Dashboard">
                <InitiativeChart
                  Graph1={InitiativeDashboard1} 
                  Graph2={InitiativeDashboard2} 
                  Graph3={InitiativeDashboard3} 
                  Graph4={InitiativeDashboard4} 
                />
              </PivotItem>
            </Pivot> */}

            <InitiativeChart
              Graph1={InitiativeDashboard1} 
              Graph2={InitiativeDashboard2} 
              Graph3={InitiativeDashboard3} 
              Graph4={InitiativeDashboard4} 
            />
          </div>
          {/* <PrimaryButton className="btn nostylebtn closelink mt-2">
            <CachedIcon style={{ marginRight: "15px", color: "#ff6262" }} />
          </PrimaryButton> */}
        </div>
      </div>
    </>
  );
};
export default EDashboard;
