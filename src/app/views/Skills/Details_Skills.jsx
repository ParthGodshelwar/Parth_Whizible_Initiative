import React, { useState } from 'react'
import { Label, TextField, Stack, PrimaryButton } from "@fluentui/react";
import { Checkbox, FormControlLabel } from '@mui/material';
const Details_Skills = ({ onClose }) => {
    const Skills_grid = {
        Skills: ""
      };

      const [showForm, setShowForm] = useState(false);
      const [formValues, setFormValues] = useState(Skills_grid);
    
      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
          ...prevValues,
          [id]: value
        }));
      };
    
      const handleShowForm = () => {
        setShowForm(!showForm);
      };
  
      const handleCloseForm = () => {
        setShowForm(false);
      };
   
  return (
    <div className="above-form-container">
       <div className='d-flex justify-content-end gap-3 mt-2'>
           <PrimaryButton text="Save" className='borderbtnbgblue' onClick={onClose} />
            <PrimaryButton text="Save and Add" className='borderbtnbgblue' onClick={onClose} />
  </div>

  <div className="row mt-1">
     <div className="col-sm-12 text-end required">
       <label className="IM_label ">
         (<font color="red">*</font> Mandatory)
       </label>
     </div>
   </div>
   <div className='row'>
   <div className='col-sm-4'>
     <Stack.Item grow={1}>
       <Label htmlFor="Skills" className='form-label'>Skill</Label>
       <TextField id="Skills" value={formValues.Skills} onChange={handleInputChange} placeholder="SQL"/>
     </Stack.Item>
     </div>
     <div className='col-sm-2'></div>
     </div>
</div>

);
};

export default Details_Skills;

