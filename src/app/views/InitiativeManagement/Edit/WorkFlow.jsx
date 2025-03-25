import React from "react";
import { Nav, Tab } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import WorkflowDetails from "./WorkflowDetails";
import WorkflowStages from "./WorkflowStages";
import WorkflowConfiguration from "./WorkflowConfiguration";
import WorkflowApprovers from "./WorkflowApprovers";
import WorkflowForcePush from "./WorkflowForcePush";

const WorkflowTabs = ({ initiativeWorkFlow }) => {
  // Destructure data from initiativeWorkFlow
  const workflowData = initiativeWorkFlow?.data?.listInitiativeWorkflowEntity || [];
  console.log("WorkflowConfiguration", WorkflowConfiguration);
  // Get the first and last stage data for displaying the summary
  const startStage = workflowData[0];
  const endStage = workflowData[workflowData.length - 1];

  return (
    <Tab.Container defaultActiveKey="workflowInfo">
      <div className="container-fluid">
        <div className="row align-items-center workflowheader">
          <div className="col-12 col-sm-8 text-start">
            <div id="Workflows_IMpgtabs" className="IM_tabs">
              <Nav className="nav nav-tabs IM_horizontal_tablinks border-bottom-0">
                <Nav.Item>
                  <Nav.Link eventKey="workflowInfo" className="nav-link" role="button">
                    Workflow information
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="manageWorkflow" className="nav-link" role="button">
                    Manage workflow
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          </div>
        </div>

        <Tab.Content className="tab-content">
          <Tab.Pane eventKey="workflowInfo" className="tab-pane">
            <div className="details-div py-3">
              <div className="row">
                <div className="details-main-sec">
                  <div className="d-sec1 px-4">
                    <Table striped className="details-table1 mb-0 w-50">
                      <tbody>
                        <tr>
                          <td>Started :</td>
                          <td className="tital22">{startStage?.eventTime || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Originator :</td>
                          <td className="tital22">{startStage?.employeeName || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Current Stage:</td>
                          <td className="tital22">{endStage?.toStageName || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                  <div className="vertical-line"></div>{" "}
                  {/* Vertical line between d-sec1 and d-sec2 */}
                  <div className="d-sec2 px-4">
                    <Table striped className="details-table2 mb-0 w-50">
                      <tbody>
                        <tr>
                          <td>Last :</td>
                          <td className="tital22">{endStage?.eventTime || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Last Actor :</td>
                          <td className="tital22">{endStage?.employeeName || "N/A"}</td>
                        </tr>
                        <tr>
                          <td>Approvers :</td>
                          <td className="tital22">{endStage?.comments || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
            <hr className="horizontal-line" /> {/* Horizontal line before Workflow Summary */}
            <div className="col-sm-4 pt-3">
              <span>Workflow Summary</span>
            </div>
            <div className="row">
              <div className="col-sm-3">&nbsp;</div>
              <div className="col-sm-3 text-start">
                <div
                  className="border rounded-5 mx-5 p-3 text-center text_workflow_1 btnblue"
                  style={{ backgroundColor: "#2B55CE" }}
                >
                  <span className="" id="Wstart1" style={{ color: "white" }}>
                    {startStage?.fromStageName || ""}
                  </span>
                </div>
                <div className="text-center workflowmain_stagesshow" style={{ fontSize: "60px" }}>
                  ↓
                </div>
                <div
                  className="border rounded-3 p-3 text-center WF_chart1"
                  style={{ backgroundColor: "#2B55CE" }}
                >
                  <span className="" style={{ color: "white" }}>
                    {startStage?.toStageName || ""}
                  </span>
                </div>
                <div className="text-center workflowmain_stagesshow" style={{ fontSize: "60px" }}>
                  ↓
                </div>
                <div
                  className="border rounded-3 p-3 text-center WF_chart1"
                  style={{ backgroundColor: "#2B55CE" }}
                >
                  <span className="" style={{ color: "white" }}>
                    {endStage?.toStageName || ""}
                  </span>
                </div>
                {/* <div className="text-center workflowmain_stagesshow" style={{ fontSize: "60px" }}>
                  ↓
                </div> */}
              </div>
              <div className="col-sm-3">
                <Table striped className="details-table2 mb-0 w-50">
                  <tbody>
                    <tr>
                      <td>Time :</td>
                      <td className="tital22">{startStage?.eventTime || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Actor :</td>
                      <td className="tital22">{startStage?.employeeName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Action :</td>
                      <td className="tital22">{startStage?.userActionName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>Comments :</td>
                      <td className="tital22">{startStage?.comments || "N/A"}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane
            eventKey="manageWorkflow"
            className="tab-pane Initcustmodal page-content bgwhite p-4"
          >
            <div className="details-div py-3">
              <div className="row">
                <div className="details-main-sec">
                  <div className="d-sec1 px-4">
                    <div
                      className="tab-pane Initcustmodal page-content bgwhite p-4"
                      id="tblmanageworkflow"
                    >
                      <WorkflowDetails />
                      <WorkflowStages />
                      <WorkflowConfiguration />
                      <WorkflowApprovers />
                      <WorkflowForcePush />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </div>
    </Tab.Container>
  );
};

export default WorkflowTabs;
