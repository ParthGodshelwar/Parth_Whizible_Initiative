import React, { useState, useEffect } from "react";
import { Drawer, Tabs, Tab, Box, IconButton, Typography } from "@mui/material";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField, Dropdown, Label, Stack } from "@fluentui/react";
import { Close } from "@mui/icons-material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tooltip } from "@mui/material";
import { toast } from "react-toastify";

const FundingDetailsDrawer = ({
  open,
  onClose,
  initialData,
  onSave,
  isEdit,
  roleOptions1, // Cost category options
  skillOptions, // Funding authority options
  source, // Funding source options
  fundings,
  acc
}) => {
  const [formData, setFormData] = useState({
    FundingDetailID: "", // Initialize FundingDetailID
    costCategory: "",
    approvalAuthority: "",
    fundingSource: "",
    fundingReference: "",
    approvedAmount: ""
  });

  const [selectedTab, setSelectedTab] = useState(0);

  // Fetch funding details if FundingDetailID is available
  useEffect(() => {
    const fetchFundingDetails = async () => {
      if (formData.FundingDetailID) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/GetInitiativeFundDetail?FundingDetailID=${formData.FundingDetailID}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
              }
            }
          );
          const fundingDetails = response.data?.data?.listFundingDetails[0];
          if (fundingDetails) {
            setFormData({
              FundingDetailID: fundingDetails.fundingDetailID,
              costCategory: String(fundingDetails.costCategoryID),
              approvalAuthority: String(fundingDetails.fundingApprrovalAutorityID) || "",
              fundingSource: String(fundingDetails.fundingSourceID) || "",
              fundingReference: fundingDetails.fundingReference,
              approvedAmount: fundingDetails.approvedAmount
            });
          }
        } catch (error) {
          console.error("Error fetching funding details:", error);
          toast.error("Failed to fetch funding details.");
        }
      }
    };

    fetchFundingDetails();
  }, [formData.FundingDetailID]);

  // useEffect(() => {
  //   // Populate form data when initialData is available
  //   if (initialData) {
  //     setFormData({
  //       FundingDetailID: initialData.FundingDetailID || "", // Set FundingDetailID from initialData
  //       costCategory: initialData.costCategory || "",
  //       approvalAuthority: initialData.approvalAuthority || "",
  //       fundingSource: initialData.fundingSource || "",
  //       fundingReference: initialData.fundingReference || "",
  //       approvedAmount: initialData.approvedAmount || ""
  //     });
  //   }
  // }, [initialData]);
  useEffect(() => {
    if (initialData) {
    //   setFormData({
    //     FundingDetailID: initialData?.FundingDetailID ?? "",
    //     costCategory: roleOptions1.some(opt => opt.key === initialData?.costCategory) 
    //         ? initialData?.costCategory 
    //         : "placeholder",
    //     approvalAuthority: skillOptions.some(opt => opt.key === initialData?.approvalAuthority) 
    //         ? initialData?.approvalAuthority 
    //         : "placeholder",
    //     fundingSource: source.some(opt => opt.key === initialData?.fundingSource) 
    //         ? initialData?.fundingSource 
    //         : "placeholder",
    //     fundingReference: initialData?.fundingReference ?? "",
    //     approvedAmount: initialData?.approvedAmount ?? ""
    // });
    setFormData({
      FundingDetailID: initialData?.FundingDetailID ?? "",
      costCategory: roleOptions1.some(opt => opt.key === initialData?.costCategory) 
          ? initialData?.costCategory 
          : "placeholder",
      approvalAuthority: skillOptions.some(opt => opt.key === initialData?.approvalAuthority) 
          ? initialData?.approvalAuthority 
          : " 0 ",
      fundingSource: source.some(opt => opt.key === initialData?.fundingSource) 
          ? initialData?.fundingSource 
          : " 0 ",
      fundingReference: initialData?.fundingReference ?? "",
      approvedAmount: initialData?.approvedAmount ?? ""
  });
  
    
    
    

    
    } else {
      // Ensure placeholder appears when no initial data
      setFormData({
        FundingDetailID: "",
        costCategory: "placeholder",
        approvalAuthority: "placeholder",
        fundingSource: "placeholder",
        fundingReference: "",
        approvedAmount: ""
      });
    }
  }, [initialData]);
  
  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // const handleInputChange = (field, value) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [field]: value
  //   }));
  // };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
        ...prevData,
        // [field]: value === "placeholder" || value === "" ? null : value  // Immediately convert to null
        [field]: value === "placeholder" || value === "" ? 0 : value // Ensure "placeholder" never survives
      }));
};


const sanitizePayload = (data) => {
  const sanitizedData = { ...data };
  
  // Set placeholder or empty fields to null
  if (sanitizedData.FundingApprovalAuthorityID === "placeholder") {
      sanitizedData.FundingApprovalAuthorityID = null;
  }
  if (sanitizedData.FundingSourceID === "placeholder") {
      sanitizedData.FundingSourceID = null;
  }

  return sanitizedData;
};

  const handleSaveClick = async () => {
    if (!formData.costCategory) {
      toast.error("Cost Category should not be left blank.");
      return; // Prevent save if Cost Category is missing
    }

    // Check if Approved Amount is provided
    if (!formData.approvedAmount || isNaN(formData.approvedAmount)) {
      toast.error("Approved Amount should not be left blank.");
      return; // Prevent save if Approved Amount is missing or not a number
    }

    // Check if Approved Amount is valid
    if (!(formData.approvedAmount > 0)) {
      toast.error("Approved Amount should be greater than 0.");
      return; // Prevent save if Approved Amount is missing or not a number
    }

    // Added by Gauri To fix UI issue - If the cost category is already added then that value should not be listed in dropdown again on 10 Feb 2025
    const selectedCategory = roleOptions1.find(
      (option) => String(option.key) === String(formData.costCategory)
    );

    const isDuplicate = fundings.some((funding) => {    
      return (
        funding.costCategory.trim().toLowerCase() === selectedCategory?.text.trim().toLowerCase() &&
        (!formData.FundingDetailID || funding.fundingDetailID !== formData.FundingDetailID) // Skip if editing
      );
    });
    
    if (isDuplicate) {
      toast.error("Funding Details for selected cost category is already added.");
      return;
    }
    // End of Added by Gauri To fix UI issue - If the cost category is already added then that value should not be listed in dropdown again on 10 Feb 2025

    try {
      const accessToken = sessionStorage.getItem("access_token");
      if (!formData.costCategory) {
        toast.error("Cost Category should not be left blank.");
        return; // Prevent save if Cost Category is missing
      }

      if (!formData.approvedAmount || isNaN(formData.approvedAmount)) {
        toast.error("Please enter a valid Approved Amount.");
        return; // Prevent save if Approved Amount is missing or not a number
      }

      if (isEdit) {
        const userdata = JSON.parse(sessionStorage.getItem("user"));
        const employeeId = userdata?.employeeId;
        const apiUrl = `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/UpdateInitiativeFund`;
// Changed By Madhuri.K on 21-03-2025
  const requestData = {
  FundingDetailID: formData.FundingDetailID || null,
  IdeaId: formData.id || null,
  CostCategoryID: formData.costCategory !== "placeholder" && formData.costCategory !== "" 
      ? formData.costCategory 
      : "placeholder",
  FundingApprovalAuthorityID: formData.approvalAuthority && formData.approvalAuthority !== "placeholder" 
      ? formData.approvalAuthority 
      : "placeholder",  
  FundingSourceID: formData.fundingSource && formData.fundingSource !== "placeholder" 
      ? formData.fundingSource 
      : "placeholder",  
  FundingReference: formData.fundingReference || "",
  ApprovedAmount: formData.approvedAmount || 0
};

  
  //  Sanitize before sending
  const sanitizedRequestData = sanitizePayload(requestData);
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        };

        let response;
        if (initialData?.FundingDetailID) {
          response = await axios.put(apiUrl, requestData, config);
        } else {
          response = await axios.post(apiUrl, requestData, config);
        }

        console.log("Updated successfully", response);
      } else {
        onSave(formData); // Save new funding detail
      }
    } catch (error) {
      console.error("Error saving funding data", error);
    }

    onClose(); // Close the drawer after saving
  };

  const fieldWidth = { width: "280px" };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      {/* <Box sx={{ width: { xs: "100%", sm: 600 }, padding: 2 }}> */}
      <Box sx={{ width: "70vw", padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
            backgroundColor: "#f5f5f5",
            padding: 1,
            borderRadius: 1
          }}
        >
          <h5>Funding Details</h5>
          <Tooltip title="Close" arrow>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>

        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Details" sx={{ textTransform: "none" }} />
        </Tabs>

        <Box className="tab-pane py-0">
          {acc[2]?.access !== 0 && (
            <div className="text-end mb-1">
              <PrimaryButton text="Save" onClick={handleSaveClick} />
            </div>
          )}

          <div className="col-sm-12 text-end form-group">
            <label className="form-label IM_label">
              (<span style={{ color: "red" }}>*</span> Mandatory)
            </label>
          </div>

          {/* Flexbox for the dropdowns to be on the same line */}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginBottom: "10px" }}
          >
            <Box sx={{ width: "100%" }}>
               <Dropdown
                label={
                  <>
                    Cost Category <span style={{ color: "red" }}>*</span>
                  </>
                }
                options={[
                  { key: "placeholder", text: "Select Cost Category", },
                  ...roleOptions1
                ]}
                selectedKey={
                  roleOptions1.some((opt) => opt.key === formData.costCategory)
                    ? formData.costCategory
                    : "placeholder"
                }
                onChange={(e, option) => handleInputChange("costCategory", option.key)}
                styles={{ dropdown: fieldWidth }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
            {/* Changed By Madhuri.K on 21-03-2025 */}
              <Dropdown
                label="Funding Authority"
                placeholder="Select Funding Authority"
                options={[
                  { key: "placeholder", text: "Select Funding Authority"},
                  ...skillOptions
                ]}
                selectedKey={
                  skillOptions.some((opt) => opt.key === formData.approvalAuthority)
                    ? formData.approvalAuthority
                    : "placeholder"
                }
                onChange={(e, option) => handleInputChange("approvalAuthority", option.key)}
                styles={{ dropdown: fieldWidth }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              {/* Changed By Madhuri.K on 21-03-2025 */}
              <Dropdown
                label="Funding Source"
                options={[
                  { key: "placeholder", text: "Select Funding Source", },
                  ...source
                ]}
                selectedKey={
                  source.some((opt) => opt.key === formData.fundingSource)
                    ? formData.fundingSource
                    : "placeholder"
                }
                onChange={(e, option) => handleInputChange("fundingSource", option.key)}
                styles={{ dropdown: fieldWidth }}
              />

            </Box>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "space-between", gap: 2, marginBottom: "10px" }}
          >
            <Box sx={{ width: "100%" }}>
              <TextField
                type="text" // Use text to enable regex validation
                label="Funding Reference"
                value={formData.fundingReference}
                onChange={(e) => {
                  const newValue = e.target.value;
                  handleInputChange("fundingReference", newValue);
                }}
                inputProps={{
                  inputMode: "decimal" // Ensure appropriate keyboard for numeric input
                }}
                styles={{ dropdown: fieldWidth }}
              />
            </Box>

            <Box sx={{ width: "100%" }}>
              <TextField
                label={
                  <>
                    Approved Amount <span style={{ color: "red" }}>*</span>
                  </>
                }
                value={formData.approvedAmount}
                onChange={(e) => {
                  const newValue = e.target.value;

                  // Regular expression to allow up to 9 digits before the decimal point and up to 2 digits after
                  if (/^\d{0,9}(\.\d{0,2})?$/.test(newValue)) {
                    handleInputChange("approvedAmount", newValue);
                  }
                }}
                type="text" // Use text to enable regex validation
                inputProps={{
                  inputMode: "decimal" // Ensure appropriate keyboard for numeric input
                }}
                styles={{ dropdown: fieldWidth }}
              />
            </Box>

            <Box sx={{ width: "100%" }} />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default FundingDetailsDrawer;
