import React, { useState } from "react";
import InitiativeTable from "./ProjectListTable";
import InitiativeCharts from "./ProjectListCharts";

const ProjectList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div className="container">
      <InitiativeCharts />
      <div className="mb-2"></div>
      <InitiativeTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default ProjectList;
