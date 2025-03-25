import React, { useState } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  IconButton,
  Stack,
  PrimaryButton,
  DefaultButton,
  Text,
  Dropdown
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import SearchIcon from "@mui/icons-material/Search";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";

const initiativeOptions = [
  { key: "", text: "Select Nature of Initiative" },
  { key: "1", text: "Initiative 1" },
  { key: "2", text: "Test Initiative" },
  { key: "3", text: "Initiative 2" },
  { key: "4", text: "Initiative Risk Management" },
  { key: "5", text: "Management" },
  { key: "6", text: "Tool Management" },
  { key: "7", text: "Whiz Implementation" },
  { key: "8", text: "Tool Management" }
];

const businessGroupOptions = [
  { key: "", text: "Select Business Group" },
  { key: "1", text: "Construction" },
  { key: "2", text: "Construction2" },
  { key: "3", text: "India International" },
  { key: "4", text: "India International2" },
  { key: "5", text: "Metro" },
  { key: "6", text: "Small Metro" }
];
const classNames = mergeStyleSets({
  formControl: {
    margin: "8px",
    minWidth: "120px"
  },
  table: {
    minWidth: 650
  }
});
// Define the columns and items using plain JavaScript
const columns = [
  { key: "column1", name: "Column 1", fieldName: "column1", minWidth: 100, maxWidth: 200 },
  { key: "column2", name: "Column 2", fieldName: "column2", minWidth: 100, maxWidth: 200 },
  { key: "column3", name: "Column 3", fieldName: "column3", minWidth: 100, maxWidth: 200 }
];

const items = [
  { column1: "Item 1", column2: "Value 1", column3: "Details 1" },
  { column1: "Item 2", column2: "Value 2", column3: "Details 2" },
  { column1: "Item 3", column2: "Value 3", column3: "Details 3" }
];

const legends = [
  { color: "clearedStage", label: "XXX" },
  { color: "pendingStage", label: "YYY" },
  { color: "currStage", label: "ZZZ" }
];

const dropdownOptions = [
  { key: "select", text: "Select Initiative Title" },
  { key: "initiatives1", text: "Initiative 1" },
  { key: "initiatives2", text: "Initiative 2" },
  { key: "initiatives3", text: "Initiative 3" }
];

const projectOptions = [
  { key: "select", text: "Select Project" },
  { key: "iciciLife", text: "ICICI Life" },
  { key: "lifeline", text: "Lifeline System Solution" },
  { key: "metro", text: "Metro" }
];

const InitiativeProgressTable = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

  return (
    <div className="container-fluid">
      <div className="row mb-3 align-items-center justify-content-end">
        <div className="col-auto d-flex align-items-center">
          <span className="text-danger mr-2">* Mandatory</span>
          <IconButton onClick={toggleAdvancedSearch}>
            <SearchIcon />
          </IconButton>
          <PrimaryButton text="Save" className="ml-2" />
        </div>
      </div>
      <div className="stages-div px-4 pt-3" id="stages-div">
        <div className="stage-status d-flex justify-content-end">
          <div className="stage-title">
            <Text variant="large">Legends</Text>
          </div>
          <div className="stage-content d-flex">
            {legends.map((legend, index) => (
              <div key={index} className="d-flex gap-1 ms-3">
                <div className={`StageboxDiv ${legend.color}`}></div>
                <Text>{legend.label}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAdvancedSearch && (
        <div className="advanced-search mb-4">
          <div className="actions row mb-3">
            <div className="col-md-4">
              <Dropdown
                placeholder="Select Nature of Initiative"
                options={initiativeOptions}
                className={classNames.formControl}
              />
            </div>
            <div className="col-md-4">
              <Dropdown
                placeholder="Select Business Group"
                options={businessGroupOptions}
                className={classNames.formControl}
              />
            </div>
          </div>

          <div className="buttons mb-4">
            <DefaultButton text="Clear Search" />
            <DefaultButton text="Save and Search" className="ml-2" />
            <DefaultButton text="Close" className="ml-2" />
            <PrimaryButton text="Search" className="ml-2" />
          </div>
        </div>
      )}
      <DetailsList
        items={items}
        columns={columns}
        layoutMode={DetailsListLayoutMode.fixedColumns}
        selectionMode={0}
      />
    </div>
  );
};

export default InitiativeProgressTable;
