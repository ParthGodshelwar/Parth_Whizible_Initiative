import React from "react";
import { Table } from "react-bootstrap";

const WorkflowDetails = ({ data }) => {
  // initiationDate, demandCode, du, dt fields binded by Gauri on 05 Feb 2025 
  const initiativeDetails = data || {};
  const {
    title,
    initiationDate: createdDate,
    businessGroup,
    ou: organizationUnit,
    demandCode: initiativeCode,
    natureofDemand,
    du: deliveryUnit,
    dt: deliveryTeam
  } = initiativeDetails;

  return (
    <div className="row">
      <div className="details-main-sec">
        <div className="d-sec1 px-4">
          <table className="table details-table1 mb-0">
            <tbody>
              <tr>
                <td>Initiative title:</td>
                <td className="font-weight-600">{title || "N/A"}</td>
              </tr>
              <tr>
                <td>Initiated on:</td>
                <td className="font-weight-600">
                  {createdDate ? new Date(createdDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
              <tr>
                <td>Business group:</td>
                <td className="font-weight-600">{businessGroup || "N/A"}</td>
              </tr>
              <tr>
                <td>Organization unit:</td>
                <td className="font-weight-600">{organizationUnit || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="vertical-line"></div>
        <div className="d-sec2 px-4">
          <table className="table details-table2 mb-0">
            <tbody>
              <tr>
                <td>Initiative code:</td>
                <td className="font-weight-600">{initiativeCode || "N/A"}</td>
              </tr>
              <tr>
                <td>Nature of Initiative:</td>
                <td className="font-weight-600">{natureofDemand || "N/A"}</td>
              </tr>
              <tr>
                <td>Delivery unit:</td>
                <td className="font-weight-600">{deliveryUnit || "N/A"}</td>
              </tr>
              <tr>
                <td>Delivery team:</td>
                <td className="font-weight-600">{deliveryTeam || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetails;
