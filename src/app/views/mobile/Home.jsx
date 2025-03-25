import React from "react";
import { Row, Col } from "react-bootstrap";

const Initiatives = () => {
  const initiatives = [
    {
      id: "onTimeInitiatives",
      count: 5,
      text: "On-time initiatives",
      className: "caseBoxes1"
    },
    {
      id: "delayedInitiatives",
      count: 7,
      text: "Delayed initiatives",
      className: "caseBoxes2"
    },
    {
      id: "pendingAppInitiatives",
      count: 20,
      text: "Pending for approval initiatives",
      className: "caseBoxes3"
    },
    {
      id: "notStartedInitiatives",
      count: 15,
      text: "Not started initiatives",
      className: "caseBoxes4"
    }
  ];

  return (
    <Row className="g-3 text-center">
      {initiatives.map((initiative) => (
        <Col key={initiative.id} sm={6} xs={6}>
          <div className={`caseBoxes ${initiative.className} pt-3`} id={initiative.id}>
            <p className="initiativeCnt">{initiative.count}</p>
            <a href="javascript:void(0);">
              <p className="initiativeTxt">{initiative.text}</p>
            </a>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default Initiatives;
