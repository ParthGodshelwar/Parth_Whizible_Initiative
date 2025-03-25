import React, { useState } from "react";
import {
  Pivot,
  PivotItem,
  Dropdown,
  Label,
  PrimaryButton,
  TextField,
  Stack,
  Icon,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Checkbox
} from "@fluentui/react";
import { Pagination } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import CostTable from "./CostDetailsTable";
import RiskTable from "./RiskDetailsAndMatrix";
import ScheduleComponent from "./ScheduleComponent";
import ResourceComponent from "./ResourceComponent";

const InitiativePrioritization = () => {
  const [selectedTab, setSelectedTab] = useState("ReadyforConversion");
  const [selectedTabParameter, setSelectedTabParameter] = useState("Cost");
  const [currentApprover, setCurrentApprover] = useState("");
  const [natureOfInitiative, setNatureOfInitiative] = useState("");
  const [businessGroup, setBusinessGroup] = useState("");
  const [stageOfApproval, setStageOfApproval] = useState("");
  const [initiativeTitle, setInitiativeTitle] = useState("");
  const [page, setPage] = useState(1);

  const dropdownOptions = (options) => options.map((option) => ({ key: option, text: option }));

  const currentApproverOptions = dropdownOptions(["James", "Kavya", "Mac", "Nirbhay", "Robin"]);
  const initiativeOptions = dropdownOptions(["Initiative 1", "Initiative 2", "Initiative 3"]);
  const businessGroupOptions = dropdownOptions(["Construction", "India International"]);
  const stageApprovalOptions = dropdownOptions([
    "CEO Approval",
    "CFO Approval",
    "Completed",
    "Delivery Manager"
  ]);

  const columns = [
    {
      key: "column1",
      name: "Stage Status",
      fieldName: "stageStatus",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column2",
      name: "Order No.",
      fieldName: "orderNo",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column3",
      name: "Stage of Approval",
      fieldName: "stageOfApproval",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column4",
      name: "Approvers",
      fieldName: "approvers",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true
    },
    {
      key: "column5",
      name: "Delete",
      fieldName: "delete",
      minWidth: 50,
      maxWidth: 100,
      isResizable: true,
      onRender: (item) => <Checkbox />
    }
  ];

  const items = [
    {
      key: 1,
      stageStatus: "Pending Stage",
      orderNo: 4,
      stageOfApproval: "Deployment",
      approvers: "James, Kavya"
    },
    {
      key: 2,
      stageStatus: "Delayed Stage",
      orderNo: 5,
      stageOfApproval: "Deployment",
      approvers: "Mac, Nirbhay"
    }
  ];

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <div className="tab-content px-2">
      <div className="tab-pane active" id="iniManagement">
        <div id="IMActiontabs" className="IM_tabs bglightblue">
          <Pivot
            selectedKey={selectedTab}
            onLinkClick={(item) => setSelectedTab(item.props.itemKey)}
          >
            <PivotItem headerText="Ready for Conversion" itemKey="ReadyforConversion" />
            <PivotItem headerText="In Pipeline" itemKey="InPipeline" />
            <PivotItem headerText="Parameter View" itemKey="ParameterView" />
          </Pivot>
        </div>
        {selectedTab === "ReadyforConversion" && (
          <div className="container-fluid">
            <div className="row align-items-center mb-3">
              <div className="col-12 col-sm-6">
                <div className="note-txt ps-2">
                  <span className="note-title">
                    <i
                      className="fa-regular fa-lightbulb"
                      data-bs-toggle="tooltip"
                      data-bs-original-title="Note"
                    ></i>
                  </span>
                  Listed Initiative details are in sorted order of 'Seed'.
                </div>
              </div>
              <div className="col-12 col-sm-4 d-flex align-items-center">
                <FormControl fullWidth>
                  <InputLabel id="program-select-label">Select Program</InputLabel>
                  <Select
                    labelId="program-select-label"
                    id="program-select"
                    value={currentApprover}
                    onChange={(e) => setCurrentApprover(e.target.value)}
                    aria-label="Select Program"
                  >
                    <MenuItem value="">Select Program</MenuItem>
                    <MenuItem value="Metro India">Metro India</MenuItem>
                    <MenuItem value="Whizible">Whizible</MenuItem>
                    <MenuItem value="Abbreviated">Abbreviated</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-sm-2">
                <div
                  id="RCtopActions"
                  className="toprightactionsCol d-flex gap-3 justify-content-end pe-0"
                >
                  <Button variant="contained" color="warning" id="RC_ShowBtn">
                    Show
                  </Button>
                  <Button variant="outlined" color="primary" id="RC_SaveBtn">
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <DetailsList
                  items={items}
                  columns={columns}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selectionMode={SelectionMode.none}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-center">
                <Pagination count={10} page={page} onChange={handleChangePage} />
              </div>
            </div>
          </div>
        )}
        {selectedTab === "InPipeline" && (
          <div className="container-fluid">
            <div className="row align-items-center mb-3">
              <div className="col-12 col-sm-6">
                <div className="note-txt ps-2">
                  <span className="note-title">
                    <i
                      className="fa-regular fa-lightbulb"
                      data-bs-toggle="tooltip"
                      data-bs-original-title="Note"
                    ></i>
                  </span>
                  Listed Initiative details are in sorted order of 'Seed'.
                </div>
              </div>
              <div className="col-12 col-sm-4 d-flex align-items-center">
                <FormControl fullWidth>
                  <InputLabel id="program-select-label">Select Program</InputLabel>
                  <Select
                    labelId="program-select-label"
                    id="program-select"
                    value={currentApprover}
                    onChange={(e) => setCurrentApprover(e.target.value)}
                    aria-label="Select Program"
                  >
                    <MenuItem value="">Select Program</MenuItem>
                    <MenuItem value="Metro India">Metro India</MenuItem>
                    <MenuItem value="Whizible">Whizible</MenuItem>
                    <MenuItem value="Abbreviated">Abbreviated</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-sm-2">
                <div
                  id="RCtopActions"
                  className="toprightactionsCol d-flex gap-3 justify-content-end pe-0"
                >
                  <Button variant="contained" color="warning" id="RC_ShowBtn">
                    Show
                  </Button>
                  <Button variant="outlined" color="primary" id="RC_SaveBtn">
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <DetailsList
                  items={items}
                  columns={columns}
                  setKey="set"
                  layoutMode={DetailsListLayoutMode.fixedColumns}
                  selectionMode={SelectionMode.none}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-center">
                <Pagination count={10} page={page} onChange={handleChangePage} />
              </div>
            </div>
          </div>
        )}
        {selectedTab === "ParameterView" && (
          <div className="container-fluid">
            <div id="IMActiontabs" className="IM_tabs bglightblue">
              <Pivot
                selectedKey={selectedTab}
                onLinkClick={(item) => setSelectedTabParameter(item.props.itemKey)}
              >
                <PivotItem headerText="Cost" itemKey="Cost" />
                <PivotItem headerText="Risk" itemKey="Risk" />
                <PivotItem headerText="Benefits" itemKey="Benefits" />
                <PivotItem headerText="Schedule" itemKey="Schedule" />
                <PivotItem headerText="Resources" itemKey="Resources" />
              </Pivot>
            </div>
            {selectedTabParameter === "Cost" && <CostTable />}
            {selectedTabParameter === "Risk" && <RiskTable />}
            {selectedTabParameter === "Schedule" && <ScheduleComponent />}
            {selectedTabParameter === "Resources" && <ResourceComponent />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InitiativePrioritization;
