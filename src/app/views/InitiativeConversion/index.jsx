import React, { useState } from "react";
import {
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IconButton,
  Checkbox,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  TooltipHost,
  IColumn
} from "@fluentui/react";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { Search20Regular as SearchIcon } from "@fluentui/react-icons";

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div style={{ marginTop: "20px" }}>
    <DefaultButton
      text="Previous"
      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    />
    <span style={{ margin: "0 10px" }}>
      Page {currentPage} of {totalPages}
    </span>
    <DefaultButton
      text="Next"
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    />
  </div>
);
const classNames = mergeStyleSets({
  formControl: {
    margin: "8px",
    minWidth: "120px"
  },
  table: {
    marginTop: "20px"
  },
  searchIcon: {
    fontSize: "20px"
  }
});

const InitiativeConversion = () => {
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
  };

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

  const organizationUnitOptions = [
    { key: "", text: "Select Organization Unit" },
    { key: "1", text: "Pune" },
    { key: "2", text: "Mumbai" },
    { key: "3", text: "Kerala" },
    { key: "4", text: "USA" },
    { key: "5", text: "Nashik" }
  ];

  const rows = [
    {
      key: 1,
      seed: 14,
      code: "CR-0374",
      title: "Infotech Solutions",
      startDate: "01 Jan 2023",
      endDate: "30 Jun 2023"
    },
    {
      key: 2,
      seed: 13,
      code: "CR-0365",
      title: "Wipro Production",
      startDate: "01 Apr 2023",
      endDate: "30 Jun 2023"
    },
    {
      key: 3,
      seed: 4,
      code: "CR-0385",
      title: "Core",
      startDate: "03 May 2023",
      endDate: "24 May 2023"
    },
    {
      key: 4,
      seed: 2,
      code: "CR-0343",
      title: "C1",
      startDate: "07 Mar 2023",
      endDate: "23 Apr 2023"
    },
    {
      key: 5,
      seed: 0,
      code: "CR-0394",
      title: "Is Action Item Allowed",
      startDate: "29 May 2023",
      endDate: "31 May 2023"
    },
    {
      key: 6,
      seed: 10,
      code: "CR-0386",
      title: "Initiative designs",
      startDate: "01 May 2023",
      endDate: "31 Jul 2023"
    },
    {
      key: 7,
      seed: 10,
      code: "CR-0402",
      title: "Customer Meeting",
      startDate: "01 Jan 2023",
      endDate: "02 Jun 2023"
    }
  ];

  const columns = [
    {
      key: "seed",
      name: "Seed",
      fieldName: "seed",
      minWidth: 50,
      maxWidth: 100,
      isResizable: true
    },
    {
      key: "code",
      name: "Initiative Code",
      fieldName: "code",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: "title",
      name: "Initiative Title",
      fieldName: "title",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <div className="init_title_name position-relative">
          <a href="javascript:void(0);">{item.title}</a>
          {item.title === "Initiative Title" && (
            <div className="search-box position-absolute top-50 end-0 translate-middle-y me-2">
              <TextField id="initgrid-srch-input" placeholder="Search" className="search-text" />
              <IconButton
                id="initgrid-srch-title"
                iconProps={{ iconName: "Search" }}
                className="search-btn"
                title="Search"
                ariaLabel="Search"
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: "startDate",
      name: "Start Date",
      fieldName: "startDate",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: "endDate",
      name: "End Date",
      fieldName: "endDate",
      minWidth: 100,
      maxWidth: 150,
      isResizable: true
    },
    {
      key: "convertToProject",
      name: "Convert to Project",
      fieldName: "convertToProject",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => <a href="javascript:void(0);">Convert to Project</a>
    },
    {
      key: "convertToMilestone",
      name: "Convert to Milestone",
      fieldName: "convertToMilestone",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => <a href="javascript:void(0);">Convert to Milestone</a>
    },
    {
      key: "convertToModule",
      name: "Convert to Module",
      fieldName: "convertToModule",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => <a href="javascript:void(0);">Convert to Module</a>
    },
    {
      key: "convertToDeliverable",
      name: "Convert to Deliverable",
      fieldName: "convertToDeliverable",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => <a href="javascript:void(0);">Convert to Deliverable</a>
    },
    {
      key: "markAsComplete",
      name: "Mark as Complete",
      fieldName: "markAsComplete",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => <a href="javascript:void(0);">Mark as Complete</a>
    }
  ];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedItems = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="initiative-status-management container">
      <div className="header my-4">
        <h1>Initiative Conversion</h1>
      </div>
      <div className="row mb-3 align-items-center justify-content-end">
        <div className="col-auto d-flex align-items-center">
          <span className="text-danger mr-2">* Mandatory</span>
          <IconButton onClick={toggleAdvancedSearch}>
            <SearchIcon className={classNames.searchIcon} />
          </IconButton>
          <PrimaryButton text="Save" className="ml-2" />
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
            <div className="col-md-4">
              <Dropdown
                placeholder="Select Organization Unit"
                options={organizationUnitOptions}
                className={classNames.formControl}
              />
            </div>
          </div>
          <div className="inputs row mb-3">
            <div className="col-md-6">
              <TextField
                label="Initiative Code"
                placeholder="Add Initiative Code"
                className={classNames.formControl}
              />
            </div>
            <div className="col-md-6">
              <TextField
                label="Initiative Title"
                placeholder="Add Initiative Title"
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
      <div className={classNames.table}>
        <DetailsList
          items={rows}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(rows.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default InitiativeConversion;
