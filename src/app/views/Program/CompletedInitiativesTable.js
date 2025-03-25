// components/CompletedInitiativesTablesTable.js
import React, { useState } from "react";
import { DetailsList, DetailsListLayoutMode, SelectionMode } from "@fluentui/react";
import { Pagination } from "@mui/material";

const itemsPerPage = 5;
const items = [
  {
    key: "1",
    title: "Metro Small",
    code: "CR-034",
    nature: "Budget",
    date: "07 Aug 2022",
    group: "Business Group",
    unit: "Organization Unit",
    project: "Project Name",
    deliverable: "Milestone/Deliverable/Module",
    vendor: "Admin"
  },
  {
    key: "2",
    title: "Initiative title main",
    code: "CR-034",
    nature: "Budget",
    date: "07 Aug 2022",
    group: "Business Group",
    unit: "Organization Unit",
    project: "Project Name",
    deliverable: "Milestone/Deliverable/Module",
    vendor: "Admin"
  }
  // Add more items as needed
];

const columns = [
  {
    key: "title",
    name: "Initiative Title",
    fieldName: "title",
    minWidth: 100,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: "nature",
    name: "Nature of Initiative",
    fieldName: "nature",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true
  },
  {
    key: "group",
    name: "Organization Unit",
    fieldName: "group",
    minWidth: 100,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: "project",
    name: "Converted To",
    fieldName: "project",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true
  },
  {
    key: "vendor",
    name: "Vendor",
    fieldName: "vendor",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true
  },
  {
    key: "action",
    name: "Action",
    fieldName: "action",
    minWidth: 100,
    maxWidth: 150,
    isResizable: true
  }
];

const CompletedInitiativesTable = () => {
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const paginatedItems = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <DetailsList
        items={paginatedItems}
        columns={columns}
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      <Pagination
        count={Math.ceil(items.length / itemsPerPage)}
        page={page}
        onChange={handleChange}
        color="primary"
      />
    </>
  );
};

export default CompletedInitiativesTable;
