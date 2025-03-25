import React from "react";
import { Stack, Text, Persona, PersonaSize } from "@fluentui/react";
import { Carousel } from "react-bootstrap";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import "bootstrap/dist/css/bootstrap.min.css";

// Function to map typeID to icon and bannerColor
const getIconAndColor = (typeID) => {
  switch (typeID) {
    case 3:
    case 5:
      return { icon: <NotificationsIcon style={{ color: "#ffc107" }} />, bannerColor: "#fff3cd" };
    case 4:
      return { icon: <FlagIcon style={{ color: "#ffc107" }} />, bannerColor: "#f8d7da" };
    case 1:
    case 2:
      return { icon: <CommentIcon style={{ color: "#ffc107" }} />, bannerColor: "#d4edda" };
    default:
      return { icon: <NotificationsIcon style={{ color: "#ffc107" }} />, bannerColor: "#e2e3e5" };
  }
};

const ProfileCard = ({ usermessage }) => {
  const storedImage = sessionStorage.getItem("UserProfilePic");
  const carouselItems = usermessage?.listLandingDBMessage?.map((message) => {
    const { icon, bannerColor } = getIconAndColor(message.typeID);
    return {
      title: message.typeDescription,
      text: message.content,
      icon,
      bannerColor
    };
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user", user);

  return (
    <Stack
      horizontal
      verticalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          flexDirection: "row",
          "@media (max-width: 768px)": {
            flexDirection: "column",
            textAlign: "center"
          }
        }
      }}
    >
      <Persona
        text={user.employeeName}
        secondaryText={user.department}
        size={PersonaSize.size72}
        imageUrl={storedImage}
        imageAlt="User"
        styles={{
          primaryText: { display: "none" },
          secondaryText: { display: "none" },
          root: {
            "@media (max-width: 768px)": {
              alignSelf: "center"
            }
          }
        }}
      />
      <Stack styles={{ root: { flex: 1 } }}>
        <Text variant="large">Welcome {user.employeeName},</Text>
        <Text variant="small" styles={{ root: { color: "#6c757d" } }}>
          Have a Wonderful Day!
        </Text>
      </Stack>
      <Stack
        verticalAlign="center"
        horizontalAlign="center" // Center-align carousel horizontally
        styles={{
          root: {
            flex: 1,
            display: "flex",
            justifyContent: "center", // Center horizontally
            alignItems: "center", // Center vertically
            textAlign: "center",
            "@media (max-width: 768px)": {
              textAlign: "center",
              marginTop: "16px"
            }
          }
        }}
      >
        <div className="mt-2">
          <Carousel
            indicators={false}
            controls={false}
            interval={3000}
            style={{ height: "150px", width: "100%" }} // Fixed height and full width
          >
            {carouselItems?.map((item, index) => (
              <Carousel.Item key={index}>
                <Stack
                  verticalAlign="center"
                  tokens={{ childrenGap: 10 }}
                  styles={{
                    root: {
                      backgroundColor: item.bannerColor,
                      padding: "10px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      height: "100%", // Ensure the item takes up full carousel height
                      display: "flex",
                      justifyContent: "center", // Vertically center content
                      alignItems: "center" // Horizontally center content
                    }
                  }}
                >
                  <Stack
                    horizontal
                    verticalAlign="center"
                    horizontalAlign="center"
                    tokens={{ childrenGap: 10 }}
                  >
                    {item.icon}
                    <Text variant="large" styles={{ root: { color: "black" } }}>
                      {item.title}
                    </Text>
                  </Stack>
                  <Text
                    variant="small"
                    styles={{
                      root: {
                        color: "black",
                        marginTop: "8px",
                        textAlign: "center"
                      }
                    }}
                  >
                    {item.text}
                  </Text>
                </Stack>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Stack>
    </Stack>
  );
};

export default ProfileCard;
