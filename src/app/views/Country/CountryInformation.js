import React from 'react'
import { Pivot, PivotItem } from "@fluentui/react"; 
import './Style.css';
import Country_Table from './Country_Table';


const CountryInformation = () => {
  return (
    <div id="Country_main" className="">
    <Pivot className='bglightblue'>
      <PivotItem headerText="Country">
      </PivotItem>
    </Pivot>
    <div>
      <Country_Table/>
    </div> 
    </div>

  );
}

export default CountryInformation


