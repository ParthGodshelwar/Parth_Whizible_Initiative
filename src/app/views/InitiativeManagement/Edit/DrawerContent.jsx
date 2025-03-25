import React, { useState, useEffect } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Drawer, IconButton, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { Dropdown } from "@fluentui/react";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import DocumentsComponentWork from "./DocumentsComponentWork";
import GetInitiativeDocumentList from "app/hooks/Editpage/GetInitiativeDocumentList";

const DrawerContent = ({
  open,
  closeDrawer,
  saveWorkOrderDetails,
  formState,
  handleFormChange,
  vendors,
  acc,
  // Added by Gauri for handling the isWorkOrderIssued state on 12 Mar 2025
  isWorkOrderIssued,     
  setIsWorkOrderIssued
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [ideaID, setIdeaID] = useState(formState?.ideaID);

  const [attachments, setAttachments] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const [documentCategories, setDocumentCategories] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const employeeId = userdata?.employeeId;
  const [drawerData, setDrawerData] = useState(null);
  const [show, setShow] = useState(true);
  // Added by Gauri to hide Issue Work Order and Save button on 06 Mar 2025
  console.log("penalty", formState);
  console.log("Is workOrderIssued", isWorkOrderIssued);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fetch Work Order Details
  // useEffect(() => {
  //   if (activeTab === 1) {
  //     const fetchAttachments = async () => {
  //       try {
  //         const response = await axios.get(
  //           "https://pms.whizible.com/APIWithJWTToken/api/InitiativeDetail/GetWorkOrderDetails?WorkOrderID=1",
  //           {
  //             headers: {
  //               Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
  //             }
  //           }
  //         );
  //         console.log("API Response:", response.data);
  //         setAttachments(response.data.attachments || []);
  //       } catch (error) {
  //         console.error("Error fetching attachments:", error);
  //       }
  //     };

  //     fetchAttachments();
  //   }
  // }, [activeTab]);

  const sendMail = async () => {
    try {
      // Fetch the Work Order Send Email details
      const response = await axios.get(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/WorkOrderSenEmail?WorkOrderID=${formState.id}&UserID=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      console.log("response", response);

      // Extract email details from the response
      const emailData = response?.data?.data?.listWorkOrderSendEmail?.[0];

      if (emailData) {
        const { fromEmail, toEmail, ccEmail, subject, body } = emailData;

        // Now call the SendMail API with the extracted data using POST
        const sendMailResponse = await axios.post(
          `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/EmailService/SendMail`,
          {
            FromAddress: fromEmail,
            ToAddress: toEmail,
            CcAddress: ccEmail,
            Subject: subject,
            Body: body,
            isHtml: 1 // Assuming the body is HTML formatted
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
            }
          }
        );

        if (sendMailResponse.status === 200) {
          toast.success("Email sent successfully!"); // Show success toast
        } else {
          toast.error("Failed to send email."); // Handle failure
        }
      } else {
        toast.error("No email data found."); // If no email data in the response
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email."); // Show error toast
    }
  };

  const handleIssueWorkOrder = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/IssuedWorkOrderDetails?WorkOrderID=${formState.id}&UserID=${employeeId}`,
        {}, // Ensure the body is an empty object if there is no data
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          }
        }
      );

      // Log the full response to check its structure
      console.log("Issue Work Order Response:", response);

      // Show success toast if the response is successful
      if (response.status === 200) {
        toast.success("Work Order has been Issued!");
        setShow(false);
      } else {
        toast.error("Failed to issue work order.");
      }
    } catch (error) {
      toast.error("Failed to issue work order.");
      console.error("Error issuing work order:", error);
    }
    setIsWorkOrderIssued(true);
  };

  // Added by Gauri to Print Work Order PDF on 06 Mar 2025
  const printIssueWorkOrder = async () => {
    const accessToken = sessionStorage.getItem("access_token");
    const userdata = JSON.parse(sessionStorage.getItem("user"));
    const employeeId = userdata?.employeeId;

    if (!accessToken || !employeeId) {
      toast.error("Access token or employee ID is missing.");
      return;
    }

    const url = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetWorkOrderDetailsReport?intSOWDetailID=${formState.id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }

      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Work_Order_Report.pdf";
      link.click();
      toast.success("Work order print successfully.");
    } catch (error) {
      toast.error("Failed to print Work order.");
    }
  };

  useEffect(() => {
    // if (activeTab === 1 && open && formState.id) {
    if (activeTab === 1 && formState.id) {
      const fetchAttachments = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetWorkOrderDetails?WorkOrderID=${formState.id}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
              }
            }
          );
          console.log("Attachments Response:", response.data);
          setAttachments(response.data.attachments || []);
          // setWorkOrderIssued(response.data.data.listWorkOrderDetails[0].isWorkOrderIssued);
          // const workOrderDetails = response.data?.data?.listWorkOrderDetails?.[0];
        
          // if (workOrderDetails) {
          //   setWorkOrderIssued(workOrderDetails.isWorkOrderIssued);
          // }
        } catch (error) {
          console.error("Error fetching attachments:", error);
        }
      };

      fetchAttachments();
    }
  }, [activeTab, formState.id]);

  useEffect(() => {
    console.log("formState111", formState);
    const fetchDocumentCategories = async () => {
      const accessToken = sessionStorage.getItem("access_token");

      // Fetching document categories
      const response = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetDocCatgoryAndSubCategory?userID=${employeeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      setDocumentCategories(data.data.listDocumentCategory);
    };

    fetchDocumentCategories();
  }, [formState]);

  return (
    <div style={{ width: "70vw", padding: 20 }}>
      <div className="graybg container-fluid py-2 mb-2" style={{ backgroundColor: "lightgrey" }}>
        <div className="row">
          <div className="col-sm-10">
            <h5 className="offcanvasTitle">Work Order</h5>
          </div>
          <div className="col-sm-2 text-end">
            <IconButton onClick={closeDrawer}>
              <Tooltip title="Close">
                <CloseIcon />
              </Tooltip>
            </IconButton>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Details" sx={{ textTransform: "none" }} />
        {formState.initiativeCode && <Tab label="Attachments" sx={{ textTransform: "none" }} />}
      </Tabs>

      {activeTab === 0 && (
        <div className="form-group row pt-1 mb-3">
          {/* View All Fields */}
          {/* <div className="col-sm-12 mb-3">
            <div className="alert alert-info">
              <strong>View All Fields:</strong> Fields marked with an asterisk (*) are mandatory.
              These include:
              <ul>
                <li>Date of Issue</li>
                <li>Subject</li>
                <li>Vendor</li>
              </ul>
            </div>
          </div> */}
          {/* Form Actions */}
          <div className="text-end">
          {/* Added by Gauri to hide Issue Work Order and Save button on 06 Mar 2025 */}
            {acc[2]?.access !== 0 && !isWorkOrderIssued && (
              <PrimaryButton text="Save" onClick={saveWorkOrderDetails} />
            )}
            {/* <PrimaryButton text="Cancel" onClick={closeDrawer} style={{ marginLeft: 8 }} /> */}
            {formState.initiativeCode && acc[2]?.access !== 0 && (
              <>
                {!isWorkOrderIssued && (
                  <PrimaryButton
                    text="Issue Work Order"
                    onClick={handleIssueWorkOrder}
                    style={{ marginLeft: 8 }}
                  />
                )}
                <PrimaryButton text="Print Work Order" onClick={printIssueWorkOrder} style={{ marginLeft: 8 }} />

                <PrimaryButton
                  text="Send Mail"
                  style={{ marginLeft: 8 }}
                  onClick={sendMail} // Send mail
                />
              </>
            )}
          </div>
          <div className="col-sm-12 text-end form-group">
            <label className="mb-2">
              ( <span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>
          {formState.workOrderNo && (
            <div className="col-sm-4 form-group mb-3">
              <label className="text-end">Initiative Code</label>
              <TextField value={formState.initiativeCode} readOnly disabled />
            </div>
          )}
          {formState.workOrderNo && (
            <div className="col-sm-4 form-group mb-3">
              <label className="text-end">Initiative Title</label>
              <TextField
                value={formState.initiativeTitle}
                onChange={(e) => handleFormChange("initiativeTitle", e.target.value)}
                readOnly
                disabled
              />
            </div>
          )}
          {formState.workOrderNo && (
            <div className="col-sm-4 form-group mb-3">
              <label className="text-end">Work Order No.</label>
              <TextField value={formState.workOrderNo} readOnly disabled />
            </div>
          )}
          <div className="col-sm-4 form-group required mb-3">
            <label className="text-end">
              Date of Issue <span style={{ color: "red" }}>*</span>
            </label>
            <DatePicker
              placeholder="Select Date of Issue"
              onSelectDate={(date) => {
                if (date) {
                  // Adjust for time zone offset
                  const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                  handleFormChange("dateOfIssue", adjustedDate);
                } else {
                  handleFormChange("dateOfIssue", null); // Handle null case if no date is selected
                }
              }}
              value={formState.dateOfIssue ? new Date(formState.dateOfIssue) : null} // Ensure it's a Date object
              required
            />
          </div>
          <div className="col-sm-4 form-group required mb-3">
            <label className="text-end">
              Subject <span style={{ color: "red" }}>*</span>
            </label>
            <TextField
              value={formState.subject}
              onChange={(e) => handleFormChange("subject", e.target.value)}
            />
          </div>
          <div className="col-sm-4 form-group mb-3">
            <label className="text-end">Relationship Manager</label>
            <TextField
              value={formState.relationshipManager}
              onChange={(e) => handleFormChange("relationshipManager", e.target.value)}
            />
          </div>
          <div className="col-sm-4 form-group mb-3">
            <label className="text-end">Background</label>
            <TextField
              value={formState.background}
              onChange={(e) => handleFormChange("background", e.target.value)}
              multiline
              rows={2}
            />
          </div>
          <div className="col-sm-4 form-group mb-3">
            <label className="text-end">Approach Overview</label>
            <TextField
              value={formState.approachOverview}
              onChange={(e) => handleFormChange("approachOverview", e.target.value)}
              multiline
              rows={2}
            />
          </div>
          <div className="col-sm-4 form-group mb-3">
            <label className="text-end">Instructions</label>
            <TextField
              value={formState.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              multiline
              rows={2}
            />
          </div>
          <div className="form-group row pt-1">
            {/* Vendor Field */}
            <div className="col-sm-4 form-group required mb-3">
              <label className="text-start">
                Vendor <span style={{ color: "red" }}>*</span>
              </label>
              <Dropdown
                placeholder="Select Vendor"
                options={vendors}
                selectedKey={formState.vendor}
                onChange={(event, option) => handleFormChange("vendor", option.key)}
                style={{ width: "100%" }} // Ensures the dropdown fits its container
              />
            </div>

            {/* Senior Management Instructions Field */}
            <div className="col-sm-4 form-group ml-1 mb-3">
              <label className="text-start">
                Senior Management Instructions
              </label>
              <TextField
                value={formState.seniorManagementInstructions}
                onChange={(e) => handleFormChange("seniorManagementInstructions", e.target.value)}
                multiline
                rows={3}
                style={{ width: "100%" }} // Ensures the text field fits its container
              />
            </div>
          </div>

          {/* <div className="text-end mt-3 mb-">
            <PrimaryButton text="Save" onClick={saveWorkOrderDetails} />
          </div> */}
        </div>
      )}

      {(formState?.ideaID || ideaID) && activeTab === 1 && (
        <DocumentsComponentWork id={formState?.ideaID || ideaID} />
      )}
    </div>
  );
};

export default DrawerContent;
