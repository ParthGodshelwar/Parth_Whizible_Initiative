import React, { useState, useEffect } from "react";
import { Box, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Dropdown, Label} from "@fluentui/react";
import { Hist_section } from "./DummyData";



const CountryInformation_Hist_Tbl = ({ index }) => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
  
    useEffect(() => {
      setData(Hist_section);
    }, []);
  
    const handleChangePage = (event, value) => {
      setPage(value);
    };
  
    const handleShowForm = () => {
        setShowForm(!showForm);
      };
    
      const handleCloseForm = () => {
        setShowForm(false);
      };
      const currentData = data.slice((page - 1)* rowsPerPage, page *rowsPerPage);

      const healthsheetModiFields = [
        { key: "select", text: "Select Field" },
        { key: "Field1", text: "Field 1" },
        { key: "Field2", text: "Field 2" },
        { key: "Field3", text: "Field 3" },
        { key: "Field4", text: "Field 4" },
        { key: "Field5", text: "Field 5" }
      ];
      const healthsheetModifiedBy = [
        { key: "select", text: "Select Field" },
        { key: "Admin", text: "Admin" },
        { key: "User", text: "User" },
        { key: "Customer", text: "Customer" }
      ];
        return (
    <div className='mx-4 mt-3'>

<div className="row mb-3 mt-2">
        <div className="col-sm-4">
          <Label className="form-label IM_label">Modified Field</Label>
          <Dropdown
            placeholder="Select Modified Field"
            options={healthsheetModiFields}
            styles={{ dropdown: { width: "100%" } }}
          />
        </div>
        <div className="col-sm-4">
          <Label className="form-label IM_label">Modified By</Label>
          <Dropdown
            placeholder="Select Modified By"
            options={healthsheetModifiedBy}
            styles={{ dropdown: { width: "100%" } }}
          />
        </div>
      </div>

   <TableContainer component={Paper}>
      <Table>
        <TableHead>
        <TableRow>
            <TableCell align="center">Modified Field</TableCell>
            <TableCell align="center">Modified Date</TableCell>
            <TableCell align="center">Value</TableCell>
            <TableCell align="center">Modified By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentData.map((healthsheet, index) => (
            <TableRow
              key={healthsheet.name}
              style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
            >
              <TableCell align="center">{healthsheet.Mod_field }</TableCell>
              <TableCell align="center">{healthsheet.Mod_Date}</TableCell>
              <TableCell align="center">{healthsheet.Value}</TableCell>
              <TableCell align="center">{healthsheet.Mod_By}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div>
    <Box display="flex" justifyContent="right" alignItems="center" p={2}>
        <Pagination
          count={Math.ceil(Hist_section.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
         variant="outlined" shape="rounded"
        />
      </Box>
      </div>
    </div>
    
  );
  
}
export default CountryInformation_Hist_Tbl
