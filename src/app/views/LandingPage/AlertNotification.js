import React from "react";
import { Stack, Text } from "@fluentui/react";
import { Carousel } from "react-bootstrap";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import "./AlertNotification.css";

const AlertNotification = ({ alertNot }) => {
  console.log("alertNot", alertNot);
  const notifications =
    alertNot?.landingDBAlertNot?.map((item) => ({
      title: ` ${item.typeDescription}`,
      description: item.initiative ? item.initiative : "No initiative associated",
      date: item.date ? item.date : "No date available",
      color: getColor(item.alertType),
      backgroundColor: getBackgroundColor(item.alertType),
      IconComponent: getIconComponent(item.alertType)
    })) || [];

  function getColor(alertType) {
    switch (alertType) {
      case "Alert":
        return "#dc3545";
      case "Flag":
        return "#ffc107";
      case "Comment":
        return "#28a745";
      default:
        return "#6c757d";
    }
  }

  function getBackgroundColor(alertType) {
    switch (alertType) {
      case "Alert":
        return "#f8d7da";
      case "Flag":
        return "#fff3cd";
      case "Comment":
        return "#d4edda";
      default:
        return "#f1f1f1";
    }
  }

  function getIconComponent(alertType) {
    switch (alertType) {
      case "Alert":
        return NotificationsIcon;
      case "Flag":
        return FlagIcon;
      case "Comment":
        return CommentIcon;
      default:
        return null; // You can return a default icon or null
    }
  }

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          flex: 1,
          backgroundColor: "white",
          padding: "23px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          "@media (max-width: 768px)": {
            padding: "16px"
          }
        }
      }}
    >
      <Text variant="large" styles={{ root: { fontWeight: "bold", marginBottom: "20px" } }}>
        Alert / Notification
      </Text>
      <Carousel
        indicators={false}
        controls={false}
        interval={3000}
        slide
        pause="hover"
        className="vertical-carousel"
      >
        {notifications.map((notification, index) => (
          <Carousel.Item key={index}>
            <Stack tokens={{ childrenGap: 10 }}>
              <Stack
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 12 }}
                wrap
                styles={{
                  root: {
                    backgroundColor: notification.backgroundColor,
                    padding: "24px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    "@media (max-width: 768px)": {
                      padding: "16px",
                      flexDirection: "column",
                      alignItems: "flex-start"
                    }
                  }
                }}
              >
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  <notification.IconComponent style={{ color: "#ffc107", fontSize: 24 }} />
                  <Text variant="large" styles={{ root: { color: notification.color } }}>
                    {notification.title}
                  </Text>
                </Stack>
                <Text variant="medium" styles={{ root: { color: "#6c757d" } }}>
                  {notification.description}
                </Text>
                <Text
                  variant="smallPlus"
                  styles={{
                    root: {
                      color: "#6c757d",
                      marginLeft: "auto",
                      "@media (max-width: 768px)": {
                        marginLeft: 0,
                        marginTop: "8px"
                      }
                    }
                  }}
                >
                  {notification.date}
                </Text>
              </Stack>
            </Stack>
          </Carousel.Item>
        ))}
      </Carousel>
    </Stack>
  );
};

export default AlertNotification;
