import React, { useState } from "react";
import {
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {
  Pivot,
  PivotItem,
  PrimaryButton,
  Stack,
  Checkbox,
  TooltipHost,
  TextField,
  DatePicker
} from "@fluentui/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MoreActions = ({ initiativeActioItems, open, setOpen }) => {
  const [drawerData1, setDrawerData1] = useState({});
  const [drawerOpen1, setDrawerOpen1] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleDrawerOpen1 = (data, index = null) => {
    console.log("first11122", data);
    setDrawerData1(data || {});
    setDrawerOpen1(true);
  };
  const handleDelete = (index) => {
    console.log("Deleted item at index:", index);
  };

  return (
    <Drawer
      anchor="right" // Adjust position of the drawer
      open={open}
      onClose={setOpen(false)}
      sx={{ width: "80vw" }} // You can adjust the width as needed
    >
      <div style={{ width: "80vw", padding: 20 }}>
        <Stack horizontal horizontalAlign="end" className="pe-2 mb-2">
          <TooltipHost content="Add Action">
            <PrimaryButton className="me-2" text="Add Action" onClick={handleDrawerOpen1} />
          </TooltipHost>
        </Stack>

        <div className="table-responsive table_wrapper">
          <Table striped className="init-stickytable mb-0 table_Documents">
            <thead>
              <tr className="sm-wid">
                <th>Action Item</th>
                <th>Priority</th>
                <th>Assigned to</th>

                <th>Due Date</th>

                <th>Submitted By </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {initiativeActioItems?.data?.listInitiativeActionItemsEntity?.length > 0 ? (
                initiativeActioItems.data.listInitiativeActionItemsEntity.map((item, index) => (
                  <tr key={index}>
                    <td>{item.actionItem}</td>
                    <td>{item.priority}</td>
                    <td>{item.responsiblePerson}</td>
                    {/* <td>{new Date(item.expectedEndDate).toLocaleDateString()}</td> */}
                    {/* <td>{item.initiativeID}</td>
                    <td>{item.submitterID}</td> */}
                    <td>{item.submittedByName}</td>
                    <td>{item.submittedByName}</td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleDrawerOpen1(item, index)} size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(index)} size="small">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No Action Items Available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </Drawer>
  );
};

export default MoreActions;
