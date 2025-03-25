import React, { useState } from "react";
import { DetailsList, DetailsListLayoutMode, DetailsListProps, IColumn } from "@fluentui/react";
import { Collapse, Button, Form, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "../../../assets/img/searchlist-red-icn.svg";
import img2 from "../../../assets/img/WF_Process.gif";
const InitiativeLinking = () => {
  const [isAdvancedSearchOpen, setAdvancedSearchOpen] = useState(false);

  const columns = [
    { key: "title", name: "Title", fieldName: "title", minWidth: 100, maxWidth: 200 },
    { key: "code", name: "Initiative Code", fieldName: "code", minWidth: 100, maxWidth: 200 },
    {
      key: "businessGroup",
      name: "Business Group",
      fieldName: "businessGroup",
      minWidth: 100,
      maxWidth: 200
    },
    { key: "startDate", name: "Start Date", fieldName: "startDate", minWidth: 100, maxWidth: 200 },
    { key: "endDate", name: "End Date", fieldName: "endDate", minWidth: 100, maxWidth: 200 },
    { key: "status", name: "Current Status", fieldName: "status", minWidth: 100, maxWidth: 200 }
  ];

  const items = [
    {
      title: "Infotech Solutions",
      code: "CR-0374",
      businessGroup: "Construction",
      startDate: "01 Jan 2023",
      endDate: "30 Jun 2023",
      status: "Completed"
    },
    {
      title: "Wipro Production",
      code: "CR-0374",
      businessGroup: "Core",
      startDate: "01 Jan 2023",
      endDate: "30 Jun 2023",
      status: "Converted"
    },
    {
      title: "Core",
      code: "CR-0385",
      businessGroup: "C1",
      startDate: "03 May 2023",
      endDate: "24 May 2023",
      status: "Ready for Conversion"
    }
    // Add more items as needed
  ];

  return (
    <div id="initiative-management" className="page-content bgcolorwhite">
      <div id="IMpgtabs" className="IM_tabs bglightblue d-flex justify-content-between">
        <ul className="nav nav-tabs IM_horizontal_tablinks">
          <li className="nav-item">
            <a
              href="javascript:;"
              id="link_InitiativeLinking"
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#InitiativeLinking"
            >
              Initiative Linking
            </a>
          </li>
        </ul>

        <ul className="list-unstyled IM_horizontal_tablinks d-flex mb-0">
          <li>
            <img src={img2} alt="" /> Initiatives{" "}
          </li>
          <li>
            <img src="https://pms.whizible.com/ini/Images/ProjectImage.gif" alt="" /> Project{" "}
          </li>
          <li>
            <img src="https://pms.whizible.com/ini/Images/MilestoneImage.gif" alt="" /> Milestone{" "}
          </li>
          <li>
            <img src="https://pms.whizible.com/ini/Images/ModuleImage.gif" alt="" /> Module{" "}
          </li>
          <li>
            <img src="https://pms.whizible.com/ini/Images/Diamond.gif" alt="" /> Deliverable
          </li>
        </ul>
      </div>

      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6">&nbsp;</div>
          <div className="col-12 col-sm-6">
            <div
              id="topActions"
              className="toprightactionsCol d-flex align-items-center gap-3 justify-content-end pt-3 pe-3"
            >
              <div className="searchList me-3" id="searching">
                <Button onClick={() => setAdvancedSearchOpen(!isAdvancedSearchOpen)}>
                  <img src={img} alt="" />
                </Button>
                <Button
                  id="RefreshBtn_External"
                  variant="outline-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Collapse in={isAdvancedSearchOpen}>
        <div
          className="accordion collapse Init_acordian_panel container-fluid mb-3"
          id="AllInitAdvancedSearch"
        >
          <div className="accordion-item mx-3">
            <h2 className="accordion-header" id="headingOne">
              <Button
                className="accordion-button"
                onClick={() => setAdvancedSearchOpen(!isAdvancedSearchOpen)}
              >
                Advanced Search
              </Button>
            </h2>
            <div
              id="IntcollapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
            >
              <div className="accordion-body">
                <Form>
                  <Form.Group controlId="IniLinkingNOI" className="mb-3">
                    <Form.Label>Nature of Initiative</Form.Label>
                    <Form.Control as="select">
                      <option>Select Nature of Initiative</option>
                      <option>Initiative 1</option>
                      <option>Initiative 2</option>
                      <option>Initiative 3</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="IniLinkingBG" className="mb-3">
                    <Form.Label>Business Group</Form.Label>
                    <Form.Control as="select">
                      <option>Select Business Group</option>
                      <option>Construction</option>
                      <option>Construction2</option>
                      <option>Business Group 1</option>
                      <option>Business Group 2</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="IniLinkingOrganizationUnit" className="mb-3">
                    <Form.Label>Organization Unit</Form.Label>
                    <Form.Control as="select">
                      <option>Select Organization Unit</option>
                      <option>Pune</option>
                      {/* Add more options if needed */}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="IniLinkingIniTitle" className="mb-3">
                    <Form.Label>Initiative Title</Form.Label>
                    <Form.Control type="text" placeholder="Add Initiative Title" />
                  </Form.Group>
                  <Form.Group controlId="IniLinkingIniCode" className="mb-3">
                    <Form.Label>Initiative Code</Form.Label>
                    <Form.Control type="text" placeholder="Add Initiative Code" />
                  </Form.Group>
                  <Form.Group controlId="IniLinkingStatus" className="mb-3">
                    <Form.Label>Initiative Status</Form.Label>
                    <Form.Control as="select">
                      <option>Select Initiative Status</option>
                      <option>Completed</option>
                      <option>Converted</option>
                      <option>Ready for Conversion</option>
                      <option>Submitted</option>
                    </Form.Control>
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={() => setAdvancedSearchOpen(false)}
                    >
                      Close
                    </Button>
                    <Button variant="secondary" className="me-2">
                      Clear Search
                    </Button>
                    <Button variant="primary" className="me-2">
                      Save and Search
                    </Button>
                    <Button variant="primary">Search</Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Collapse>

      <div className="tab-content px-2">
        <div className="tab-pane active show" id="InitiativeLinking">
          <div id="Init-Grid" className="table-responsive init_grid_panel mx-3">
            <DetailsList
              items={items}
              columns={columns}
              layoutMode={DetailsListLayoutMode.fixedColumns}
              isMultiline={true}
              compact={true}
            />
          </div>
          <div id="IntLinkingPagination" className="text-center Init_pagination position-relative">
            {/* Add pagination logic here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeLinking;
