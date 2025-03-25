import React from "react";
import { Stack, Text } from "@fluentui/react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import { Carousel } from "react-bootstrap"; // Import Carousel from react-bootstrap
import "./TodayPriority.css";

const TodayPriority = ({ tPriority }) => {
  console.log("tPriority", tPriority);

  const priorityItems = tPriority?.listLandingDBTPriority?.map((item) => ({
    title: item.type, // Using 'type' for the title
    description: item.content, // Using 'content' for the description
    initiative: item.initiative, // Including 'initiative' for more context
    status: item.status, // Including 'status'
    color: "#007bff",
    backgroundColor: getBackgroundColor(item.type),
    IconComponent: getIconComponent(item.type)
  }));

  function getBackgroundColor(type) {
    switch (type) {
      case "Risk":
        return "#f8d7da"; // Light red
      case "Action":
        return "#fff3cd"; // Light yellow
      case "Initiative":
        return "#d4edda"; // Light green
      default:
        return "#f1f1f1"; // Light grey
    }
  }

  function getIconComponent(type) {
    switch (type) {
      case "Action": // Example type for Notification
        return NotificationsIcon;
      case "Risk": // Example type for Flag
        return FlagIcon;
      case "Initiative": // Example type for Comment
        return CommentIcon;
      default:
        return null; // Or return a default icon if needed
    }
  }

  // Helper to split the items into groups of 3 for the carousel slides
  const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr?.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const priorityItemGroups = chunkArray(priorityItems, 3); // Group the priority items into groups of 3

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack
        styles={{
          root: {
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            flex: 1
          }
        }}
      >
        <Text variant="medium" styles={{ root: { fontWeight: "bold", marginBottom: "16px" } }}>
          Today's Priority
        </Text>

        <Carousel indicators={false} interval={3000} controls={true}>
          {/* Iterate over the grouped items */}
          {priorityItemGroups.map((group, groupIndex) => (
            <Carousel.Item key={groupIndex}>
              <Stack tokens={{ childrenGap: 10 }}>
                {/* Stack 3 cards vertically */}
                {group.map((item, index) => (
                  <Stack
                    key={index}
                    horizontal={false} // Ensure stacking vertically
                    verticalAlign="center"
                    tokens={{ childrenGap: 10 }}
                    styles={{
                      root: {
                        backgroundColor: item.backgroundColor,
                        padding: "16px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        minWidth: "250px",
                        height: "120px"
                      }
                    }}
                  >
                    {item.IconComponent && (
                      <item.IconComponent style={{ color: "#ffc107", fontSize: 32 }} />
                    )}
                    <Stack>
                      <Text variant="medium" styles={{ root: { color: item.color } }}>
                        {item.title}
                      </Text>
                      <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                        {item.description}
                      </Text>
                      <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                        Initiative: {item.initiative} | Status: {item.status}
                      </Text>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Carousel.Item>
          ))}
        </Carousel>
      </Stack>
    </Stack>
  );
};

export default TodayPriority;
