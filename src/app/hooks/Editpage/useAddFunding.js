// import { useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const useAddFunding = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const userdata = JSON.parse(sessionStorage.getItem("user"));
//   const employeeId = userdata?.employeeId;

//   const addFunding = async (fundingDetails) => {
//     setLoading(true);
//     setError(null);
//     console.log("fundingDetails", fundingDetails);
//     if (!fundingDetails.CostCategoryID) {
//       toast.error("Cost Category should not be left blank");
//       setLoading(false);
//       return;
//     }
//     if (!fundingDetails.ApprovedAmount) {
//       toast.error("Approved Amount should not be left blank");
//       setLoading(false);
//       return;
//     }
//     try {
//       const accessToken = sessionStorage.getItem("access_token");
//       const response = await axios.post(
//         `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/InitiativeDetail/PostInitiativeFund`,
//         null,
//         {
//           params: {
//             FundingDetailID: fundingDetails.FundingDetailID,
//             IdeaId: fundingDetails.IdeaId,
//             CostCategoryID: fundingDetails.CostCategoryID,
//             FundingApprrovalAutorityID: fundingDetails.FundingApprrovalAutorityID,
//             FundingSourceID: fundingDetails.FundingSourceID,
//             FundingReference: fundingDetails.FundingReference,
//             ApprovedAmount: fundingDetails.ApprovedAmount,
//             UserID: employeeId // Assuming UserID is the employee ID
//           },
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             Accept: "*/*"
//           }
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Funding details updated successfully!!");
//       } else {
//         throw new Error("Failed to add funding details");
//       }
//     } catch (error) {
//       setError(error.message);
//       toast.error("Failed to add funding: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { addFunding, loading, error };
// };

// export default useAddFunding;
