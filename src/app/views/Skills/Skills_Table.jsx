import React, { useState, useEffect } from "react";
import {SkillsInfo_Section} from "./DummyData"; // Import the dummy data
import { Box, Link, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Ad_SearchIcon from '../../../assets/img/search-list.png';
import { Checkbox, Dropdown, Label, mergeStyles, PrimaryButton } from "@fluentui/react";
import Accor_Skills from "./Accor_Skills";
import Drawer_Skills from "./Drawer_Skills";



const Skills_Table = ({ index }) => {
    const [data, setData] = useState([]);
    const [DrawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState(SkillsInfo_Section.map(() => false));
  
    useEffect(() => {
      // Assuming SkillsInfo_Section is defined somewhere and passed as props or imported
      setData(SkillsInfo_Section);
    }, []);
  
    const handleChangePage = (event, value) => {
      setPage(value);
    };
  
    const currentData = data.slice((page - 1)* rowsPerPage, page *rowsPerPage);
    // Calculate current data to display based on pagination
    const indexOfLastItem = page * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    // const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    const actionOptions = [
        { key: "select", text: "Select Action" },
        { key: "Yes", text: "Yes" },
        { key: "No", text: "No" }
    ]  
    const handleShowForm = () => {
        setShowForm(!showForm);
      };
  
      const handleCloseForm = () => {
        setShowForm(false);
      };

      const handleSelectAllChange = (e, checked) => {
        setSelectAllChecked(checked);
        setIndividualChecks(individualChecks.map(() => checked));
      };
    
      const handleIndividualChange = (index, checked) => {
        const newChecks = [...individualChecks];
        newChecks[index] = checked;
        setIndividualChecks(newChecks);
        setSelectAllChecked(newChecks.every((check) => check));
      };

      const checkboxStyles = {
        checkbox: mergeStyles({
          selectors: {
            "::after": {
              content: '"✓"',
              fontSize: "16px",
              color: "white",
              paddingRight:"7px",
            }
          }
        }),
        checkmark: {
          visibility: "hidden"
        }
      };
        return (
    <div className='mx-4 mt-3'>
         <div className="row align-items-end mb-3">
                                            <div className="col-3 col-sm-3"></div>
                                            <div className="col-3 col-sm-3" align={"start"}>
                                         
                                            </div>
                                            <div className="col-6 col-sm-6 my-2 ">
                <div className="d-flex justify-content-end gap-3">
                <img src={Ad_SearchIcon} alt="" onClick={handleShowForm} data-bs-toggle="tooltip"
                 aria-label="Search List" data-bs-original-title="Search List"/>
                    {/* <Link href="#"><img src={searchlist_red_icn} className='search_ion' id="search_Icn" tooltipText="Search"/></Link> */}
                    <PrimaryButton className="borderbtnbgblue" onClick={() => setDrawerVisible(true)} text='+ Add'/>
                    <PrimaryButton className="borderbtnbgblue" text='Delete'/>
                </div>
            </div>
              <Drawer_Skills visible={DrawerVisible} onClose={() => setDrawerVisible(false)}/>
             </div>
        {showForm && <Accor_Skills className='mb-3' onClose={handleCloseForm} />}
        <Box sx={{height:340}}>
   <TableContainer component={Paper} className="mt-3">
      <Table>
        <TableHead>
        <TableRow>
        <TableCell align="center" className="col-sm-1"> </TableCell>
            <TableCell align="left">Skill</TableCell>
            <TableCell align="center" className="col-sm-1"> 
              <Checkbox styles={checkboxStyles} id="dltAllcost" className="chckHead" checked={selectAllChecked}
                      onChange={(e, checked) => handleSelectAllChange(e, checked)}/>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentData.map((healthsheet, index) => (
            <TableRow
              key={healthsheet.name}
              style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <TableCell></TableCell>
              <TableCell align="left"><Link href="javascript:;" id="ClearSearchBtn" className="closelink" onClick={() => setDrawerVisible(true)}>{healthsheet.Skill }</Link></TableCell>
              <TableCell align="center">
              <Checkbox
                      styles={checkboxStyles}
                      id={`chkRow${index + 1}`}
                      className="dltSingleCost"
                      checked={individualChecks[index]}
                      onChange={(e, checked) => handleIndividualChange(index, checked)}
                    /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    <div>

      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <Pagination count={Math.ceil(data.length / rowsPerPage)}
            page={page} onChange={handleChangePage} color="primary" variant="outlined" shape="rounded"/>
      </Box>
      </div>
    </div>
    
  );
  
}
export default Skills_Table
