import React from 'react'
import { Pivot, PivotItem } from "@fluentui/react"; 
import './Style.css';
import Skills_Table from './Skills_Table';


const SkillsInfo = () => {
  return (
    <div id="Skills_main" className="">
    <Pivot className='bglightblue'>
      <PivotItem headerText="Skills">
      </PivotItem>
    </Pivot>
    <div>
      <Skills_Table/>
    </div> 
    </div>

  );
}

export default SkillsInfo


