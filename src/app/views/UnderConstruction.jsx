// UnderConstruction.js
import React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const containerStyles = mergeStyles({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  textAlign: "center",
  padding: "20px"
});

const alertStyles = mergeStyles({
  maxWidth: "400px",
  padding: "20px"
});

const UnderConstruction = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard/default"); // Replace with your desired route
  };

  return (
    <div className={containerStyles}>
      <Alert variant="warning" className={alertStyles}>
        <Alert.Heading>Under Construction</Alert.Heading>
        <p>This page is currently under construction. Check back later!</p>
        <hr />
        <div>
          <Button onClick={handleGoBack} variant="primary">
            Go Back to Dashboard
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default UnderConstruction;
