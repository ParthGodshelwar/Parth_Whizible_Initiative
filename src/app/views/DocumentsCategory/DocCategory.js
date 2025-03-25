import React from 'react'
import { Pivot, PivotItem } from "@fluentui/react"; 
import './Style.css';
import DocCategory_Table from './DocCategory_Table';

const DocCategory = () => {
  return (
    <div id="DocCategory_main" className="">
    <Pivot className='bglightblue'>
      <PivotItem headerText="Documents Category">
      </PivotItem>
    </Pivot>
    <div>
      <DocCategory_Table/>
    </div> 
    </div>

  );
}

export default DocCategory


