import React from 'react'
import { Pivot, PivotItem } from "@fluentui/react"; 
import './Style.css';
import DeptMaster_Table from './DeptMaster_Table';



const DepartmentMaster = () => {
  return (
    <div id="DepMaster_main" className="">
    <Pivot className='bglightblue'>
      <PivotItem headerText="Department Master">
      </PivotItem>
    </Pivot>
    <div>
      <DeptMaster_Table/>
    </div> 
    </div>

  );
}

export default DepartmentMaster


