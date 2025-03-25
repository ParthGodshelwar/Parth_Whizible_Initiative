import React from "react";
import Table from "react-bootstrap/Table";

const StageComponent = ({ stageData }) => {
  // Sort the stageData by orderno with a fallback to an empty array
  const sortedStageData = (stageData?.data?.listInitiativeStageListEntity || []).sort(
    (a, b) => (a?.orderno || 0) - (b?.orderno || 0)
  );

  return (
    <div className="tab-pane" id="Ini_Stage">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6 text-start"></div>
        </div>
      </div>
      <div id="Project_Grid_panel_6" className="init_grid_panel m-3">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nature of Initiative</th>
              <th>Order No</th>
              <th>Stage Name</th>
              <th className="text-center">Approvers</th>
            </tr>
          </thead>
          <tbody className="tbodystage">
            {sortedStageData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  No stages available
                </td>
              </tr>
            ) : (
              sortedStageData.map((stage, index) => (
                <tr key={`stage-${index}`} className="TR_stages">
                  <td>{stage.natureofDemand}</td>
                  <td>{stage.orderno}</td>
                  <td>{stage.requestStage}</td>
                  <td className="text-center">{stage.stakeHolderNames}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
      <div className="clearfix"></div>
      <div id="IMstages_pagination" className="text-center Init_pagination"></div>
      <div className="clearfix"></div>
    </div>
  );
};

export default StageComponent;
