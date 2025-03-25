import React, { useState } from "react";
import { Text } from "@fluentui/react";
import { Drawer } from "@mui/material";
import { Nav } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import Details_Country from "./Details_Country";
import CountryInformation_Hist_Tbl from "./History_Currency";
import Tooltip from "@mui/material/Tooltip";

const Drawer_Country = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState("healthsheet-Details");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInitiative, setSelectedInitiative] = useState(0); // Default selected initiative index

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedInitiative(0); // Reset selected initiative when changing tabs
    setCurrentPage(1); // Reset to the first page when changing tabs
  };
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const renderActionItems = () => {
    // Depending on the activeTab, render the corresponding action items
    if (activeTab === "healthsheet-Details") {
      return <Details_Country />;
    } else if (activeTab === "History-Details") {
      // Render Audit Action Items logic here
      return <CountryInformation_Hist_Tbl />;
    }
    return null;
  };
  return (
    <Drawer
      anchor="right"
      open={visible}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      headerText="healthsheet Section Details"
      closeButtonAriaLabel="Close"
    >
      <div style={{ width: 940, padding: 20 }}>
        <div className="HeaderTxt_Grid d-flex justify-content-between">
          <Text>Country Details</Text>
          <Tooltip title="Close">
            <CloseIcon className="IcnStyle" onClick={onClose} />
          </Tooltip>
        </div>
        <div className="container-fluid p-0">
          <Nav variant="tabs" defaultActiveKey={activeTab} className="mt-2">
            <Nav.Item>
              <Nav.Link
                eventKey="healthsheet-Details"
                onClick={() => handleTabChange("healthsheet-Details")}
              >
                Details
              </Nav.Link>
            </Nav.Item>
            {/* <Nav.Item>
          <Nav.Link
            eventKey="History-Details"
            onClick={() => handleTabChange("History-Details")}>
           Show History
          </Nav.Link>
        </Nav.Item> */}
          </Nav>
          {/* Render selected initiative content */}
          {renderActionItems()}
        </div>
      </div>
    </Drawer>
  );
};

export default Drawer_Country;
