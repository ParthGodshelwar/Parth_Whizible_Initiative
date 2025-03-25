import React from 'react'
import { Pivot, PivotItem } from "@fluentui/react"; 
import './Style.css';
import AuditType_Defin_Table from './AuditType_Defin_Table';

const AuditTypeDefiInfo = () => {
  return (
    <div id="AuditType_Definition_main" className="">
    <Pivot className='bglightblue'>
      <PivotItem headerText="Audit Type Definition">
      </PivotItem>
    </Pivot>
    <div>
      <AuditType_Defin_Table/>
    </div> 
    </div>

  );
}

export default AuditTypeDefiInfo


