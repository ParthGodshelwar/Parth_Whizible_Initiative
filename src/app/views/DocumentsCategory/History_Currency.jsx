import React, { useState, useEffect } from "react";
import { Box, Checkbox, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Dropdown, Label, mergeStyles, PrimaryButton} from "@fluentui/react";
import {Hist_section } from "./DummyData";



const DocCategory_Hist_Tbl = ({ index }) => {
    const [data, setData] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showForm, setShowForm] = useState(false);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [individualChecks, setIndividualChecks] = useState(Hist_section.map(() => false));
  
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
          <div className="mx-4 mt-3">
            <div className="row mt-2">
              <div className="col-sm-12 d-flex justify-content-end gap-3">
                <PrimaryButton className="borderbtnbgblue" text="+ Add" />
                <PrimaryButton
                  className="borderbtnbgblue"
                  text="Delete"
                  style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                />
              </div>
            </div>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Sub Category</TableCell>
                    <TableCell align="center">Directory Name</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        styles={checkboxStyles}
                        id="dltAllcost"
                        className="chckHead"
                        checked={selectAllChecked}
                        onChange={(e, checked) => handleSelectAllChange(e, checked)}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentData.map((healthsheet, index) => (
                    <TableRow
                      key={healthsheet.name}
                      style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" }}
                    >
                      <TableCell align="center">{healthsheet.Mod_field}</TableCell>
                      <TableCell align="center">{healthsheet.Mod_Date}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          styles={checkboxStyles}
                          id={`chkRow${index + 1}`}
                          className="dltSingleCost"
                          checked={individualChecks[index]}
                          onChange={(e, checked) => handleIndividualChange(index, checked)}
                        />
                      </TableCell>
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
                  variant="outlined"
                  shape="rounded"
                />
              </Box>
            </div>
          </div>
        );
  
}
export default DocCategory_Hist_Tbl
