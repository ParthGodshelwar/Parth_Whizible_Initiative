import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Link} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useState } from 'react'
import { Label, TextField, Stack, DefaultButton } from "@fluentui/react";


const Accor_DocCategory = ({ onClose }) => {
    const CountrySet = {
        filter_Doc_CategoryType: "",
        filter_Dire_name: "",
      };
      
  const [formValues, setFormValues] = useState(CountrySet);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  const handleClearSearch = () => {
    setFormValues(CountrySet);
  };
  return (
    <div className="mb-4" >
      <Accordion className='accordionbg' defaultExpanded>
        <AccordionSummary className='accor_textsize'
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          Advanced Search
        </AccordionSummary>
        <AccordionDetails>
        <div class="row">
          <div className='col-sm-4'>
          <Label htmlFor="filter_Doc_CategoryType">Category Type</Label>
            <TextField id="filter_Doc_CategoryType" value={formValues.filter_Doc_CategoryType} onChange={handleInputChange} placeholder="Issue Management"/>
         </div>
         <div class="col-sm-4 mb-2">
            <Label htmlFor="filter_Dire_name">Directory Name</Label>
            <TextField id="filter_Dire_name" value={formValues.filter_Dire_name} onChange={handleInputChange} placeholder="Test"/>
          </div>
          <div className='col-sm-4'></div>
        </div>
          <div class="row">
              <div class="col-sm-12 d-flex justify-content-end gap-3 mt-3">
                 <DefaultButton id="ClearSearchBtn" className="underline_btn" text='Clear Search'/>
                  <DefaultButton id="SaveSearchBtn" className="underline_btn" text='Save and Search'/>
                  <DefaultButton id="CloseSearchBtn" className="underline_btn" onClick={onClose} text='Close'/>
                  <DefaultButton id="SearchBtn" className="" color="primary" text='Search'/>
              </div>
          </div>
        </AccordionDetails> 
      </Accordion>
    </div>
  );
}

export default Accor_DocCategory

