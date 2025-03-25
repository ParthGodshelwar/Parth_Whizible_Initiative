import * as React from "react";
import { Stack, Text, DefaultButton, Separator, Image, ImageFit } from "@fluentui/react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { uploadImage } from "../../hooks/userProfile/useProfileImage";
import fetchUserProfile from "../../hooks/fetchUserProfile";
import { red } from "@mui/material/colors";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";
import { format } from "date-fns";

const profileContainerStyles = mergeStyles({
  maxWidth: 1200,
  padding: 20,
  margin: "auto",
  borderRadius: 10,
  position: "relative"
});

const profilePictureContainerStyles = mergeStyles({
  position: "relative",
  display: "inline-block"
});

const editIconStyles = mergeStyles({
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: "#ffffff",
  borderRadius: "50%",
  cursor: "pointer",
  padding: 5,
  fontSize: 24,
  color: "#000000",
  zIndex: 10
});

const buttonGroupStyles = mergeStyles({
  position: "absolute",
  top: 20,
  right: 20,
  zIndex: 10
});

const profilePictureStyles = mergeStyles({
  borderRadius: "50%",
  width: 72,
  height: 72,
  objectFit: "cover",
  border: "2px solid #e1dfdd"
});

const fieldContainerStyles = mergeStyles({
  display: "flex",
  alignItems: "flex-start",
  gap: 20
});

const fieldGroupStyles = mergeStyles({
  flexBasis: "48%"
});

const verticalBarStyles = mergeStyles({
  width: 1,
  backgroundColor: "#e1dfdd",
  height: "auto",
  alignSelf: "stretch"
});

const ProfilePage = () => {
  const [profileData, setProfileData] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [refresh, setRefresh] = React.useState(true);
  const fetchProfileData = async () => {
    try {
      const accessToken = sessionStorage.getItem("access_token");
      const user = await fetchUserProfile(accessToken);
      sessionStorage.setItem("user", JSON.stringify(user));
      setProfileData(user);
      // Check if UserProfilePic is present in sessionStorage
      const storedImage = sessionStorage.getItem("UserProfilePic");
      setImage(storedImage || user.profileImage || null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };
  React.useEffect(() => {}, [refresh]);

  React.useEffect(() => {
    fetchProfileData();
  }, []);

  const handleDelete = () => {
    // Handle delete logic
  };

  const handleInputChange = (e, field) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    console.log("result1");
    const file = e.target.files[0];
    if (file) {
      try {
        const result = await uploadImage(file);
        console.log("result", result);
        fetchProfileData();
        toast.success("Upload successful");
        toast.success("Please sit back while we get the latest data.");
        setRefresh(!refresh);

        // Clear "text" from session storage
        sessionStorage.removeItem("UserProfilePic");

        // Add a 2-second delay before reloading the page
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const renderField = (label, value, showValue = true, marginTop = 0) => (
    <Text block style={{ marginTop }}>
      <strong>{label}:</strong> {showValue && value ? value : "N/A"}
    </Text>
  );

  if (!profileData) return <div>Loading...</div>;

  const {
    employeeName,
    roleName,
    emailId,
    address,
    city,
    currentAddress,
    phone,
    currentPhone,
    birthDate,
    currentCity,
    currentCountry,
    pinCode,
    currentPinCode,
    businessGroup,
    location,
    state,
    currentState,
    // deliveryUnit,
  } = profileData;

  return (
    <div className={profileContainerStyles}>
      {/* <DefaultButton
        text="Delete Profile"
        onClick={handleDelete}
        styles={{ root: { color: "#d13438", borderColor: "#d13438" } }}
        className={buttonGroupStyles}
      /> */}
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <div className={profilePictureContainerStyles}>
            <Image
              src={image || "https://via.placeholder.com/72"}
              alt={employeeName || "Profile Picture"}
              className={profilePictureStyles}
              imageFit={ImageFit.cover}
            />
            {/* Tooltip Added By Madhuri.K on 30-Jan-2025 comment start here*/}
              <Tooltip title="Edit Profile Picture">
                <EditOutlinedIcon
                  className={editIconStyles}
                  onClick={() => document.getElementById("uploadImage").click()}
                />
              </Tooltip>
            {/* Tooltip Added By Madhuri.K on 30-Jan-2025 comment end here*/}
            <input
              type="file"
              id="uploadImage"
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <Stack>
            <Text variant="xLarge">{employeeName || "N/A"}</Text>
            <Text variant="mediumPlus" style={{ color: "#605e5c" }}>
              {roleName || "N/A"}
            </Text>
          </Stack>
        </Stack>
        <Separator />
        <div className={fieldContainerStyles}>
          <div className={fieldGroupStyles}>
            {renderField("User Name", employeeName)}
            {/* {renderField("Birth Date", birthDate)} */}
            {renderField("Birth Date", birthDate ? format(new Date(birthDate), "dd-MM-yyyy") : "N/A")}
            {renderField("Email ID", emailId)}
            {/* {renderField("Address", address)} */}
            {renderField("Phone", phone)}
            {/* Changed By Madhuri.K On 24-Feb-2024 */}
            {renderField("Current Address", address)}
            {renderField("City", city)}
            {renderField("State", state)}
            {renderField("Zip Code", pinCode)}
          </div>
          <div className={verticalBarStyles}></div>
          <div className={fieldGroupStyles}>
            {renderField("Role Name", roleName)}
            {/* Changed By Madhuri.K On 24-Feb-2024 */}
            {renderField("Business Group", businessGroup)}
            {renderField("Organiztion Unit", location)}
            {/* {renderField("Delivery Unit", deliveryUnit)} */}
            {renderField("Permanent Address", currentAddress)}
            {renderField("Phone", currentPhone)}
            {renderField("City", currentCity)}
            {renderField("State", currentState)}
            {renderField("Zip Code", currentPinCode)}
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default ProfilePage;
