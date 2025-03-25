import React from "react";
import { Stack, Text } from "@fluentui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faInbox,
  faPause,
  faClock,
  faPlaneSlash
} from "@fortawesome/free-solid-svg-icons";

const StatisticsCard = ({ userProfileData }) => {
  console.log("userProfileData", userProfileData);

  return (
    <Stack
      styles={{
        root: {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          boxSizing: "border-box",
          "@media (max-width: 768px)": {
            // Adjust padding for smaller screens
            padding: "8px"
          }
        }
      }}
    >
      <Text variant="medium" styles={{ root: { fontWeight: "bold", marginBottom: "16px" } }}>
        <FontAwesomeIcon icon={faCircleNotch} /> Statistics{" "}
        <span style={{ color: "#6c757d" }}>(past 30 days)</span>
      </Text>

      <Stack
        horizontal
        wrap
        tokens={{ childrenGap: 20 }}
        styles={{ root: { textAlign: "center" } }}
      >
        {/* Inbox */}
        <Stack.Item grow>
          <Stack
            styles={{
              root: {
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                flex: 1,
                "@media (max-width: 768px)": {
                  // Make cards full-width on small screens
                  width: "100%",
                  marginBottom: "10px"
                }
              }
            }}
          >
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
              styles={{ root: { textAlign: "center" } }}
            >
              <FontAwesomeIcon
                icon={faInbox}
                className="box_icon"
                style={{ fontSize: "28px", color: "#0078d4" }}
              />

              <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                {userProfileData?.inbox}
              </Text>
              <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                Inbox
              </Text>
            </Stack>
          </Stack>
        </Stack.Item>

        {/* Draft */}
        <Stack.Item grow>
          <Stack
            styles={{
              root: {
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                flex: 1,
                "@media (max-width: 768px)": {
                  // Make cards full-width on small screens
                  width: "100%",
                  marginBottom: "10px"
                }
              }
            }}
          >
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
              styles={{ root: { textAlign: "center" } }}
            >
              <FontAwesomeIcon icon={faPause} style={{ fontSize: "28px", color: "#0078d4" }} />
              <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                {userProfileData?.draft}
              </Text>
              <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                Draft
              </Text>
            </Stack>
          </Stack>
        </Stack.Item>

        {/* Watchlist */}
        <Stack.Item grow>
          <Stack
            styles={{
              root: {
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                flex: 1,
                "@media (max-width: 768px)": {
                  // Make cards full-width on small screens
                  width: "100%",
                  marginBottom: "10px"
                }
              }
            }}
          >
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
              styles={{ root: { textAlign: "center" } }}
            >
              <FontAwesomeIcon icon={faClock} style={{ fontSize: "28px", color: "#0078d4" }} />
              <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                {userProfileData?.watchList}
              </Text>
              <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                Watchlist
              </Text>
            </Stack>
          </Stack>
        </Stack.Item>

        {/* Ageing */}
        <Stack.Item grow>
          <Stack
            styles={{
              root: {
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                flex: 1,
                "@media (max-width: 768px)": {
                  // Make cards full-width on small screens
                  width: "100%"
                }
              }
            }}
          >
            <Stack
              horizontal
              verticalAlign="center"
              tokens={{ childrenGap: 10 }}
              styles={{ root: { textAlign: "center" } }}
            >
              <FontAwesomeIcon icon={faPlaneSlash} style={{ fontSize: "28px", color: "#0078d4" }} />
              <Text variant="large" styles={{ root: { fontWeight: "bold" } }}>
                {userProfileData?.ageing}
              </Text>
              <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
                Ageing
              </Text>
            </Stack>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default StatisticsCard;
