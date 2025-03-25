import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import * as microsoftTeams from "@microsoft/teams-js";
import { useRoutes } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import { WhizTheme } from "./components";
import { handleUnauthorizedResponse } from "./apiHelper";
// ALL CONTEXTS
import { AuthProvider } from "./contexts/JWTAuthContext";

import SettingsProvider from "./contexts/SettingsContext";
// ROUTES
import routes from "./routes";
import mroutes from "./mroutes";
// FAKE SERVER
import "../fake-db";
import { toast } from "react-toastify";
import "./app.css";
import { initializeIcons } from "@fluentui/react";

initializeIcons(); // Ensure this is called only once in your app

const App = () => {
  const { instance } = useMsal();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [error, setError] = useState(null);
  const content = useRoutes(routes);
  const mcontent = useRoutes(mroutes);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Delay execution by 10 seconds
    const timer = setTimeout(() => {
      const user = sessionStorage.getItem("user");
      const accessToken = sessionStorage.getItem("access_token");

      // Check if access_token exists and if user contains a valid employeeId
      if (!accessToken || !user || !JSON.parse(user)?.employeeId) {
        navigate("/UnauthorizedPage"); // Redirect to the unauthorized page
      }
    }, 20000); // 10 seconds delay

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // Function to handle window resizing for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile view if the window width is 768px or smaller
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Add event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       // Initialize Microsoft Teams SDK
  //       microsoftTeams.initialize();

  //       // Check if initialization is complete
  //       microsoftTeams.getContext((context) => {
  //         if (context) {
  //           console.log("Teams context:", context);

  //           // Handle MSAL login via popup
  //           instance
  //             .loginPopup({
  //               scopes: [
  //                 "api://initiatives1.netlify.app/8a2c1a76-c99f-4235-b95b-43da1016e96d/access_as_user"
  //               ]
  //             })
  //             .then((loginResponse) => {
  //               console.log("Login response:", loginResponse);
  //               instance.setActiveAccount(loginResponse.account);
  //               setAccessToken(loginResponse.accessToken);
  //               sessionStorage.setItem("Ttoken", loginResponse.accessToken);

  //               // You can store refresh token in loginResponse if available
  //               if (loginResponse.idToken) {
  //                 setRefreshToken(loginResponse.idToken);
  //               }

  //               acquireTokenWithScopes(); // Call API after authentication
  //             })
  //             .catch((error) => {
  //               console.error("Error during popup login:", error);
  //               setError(error);
  //             });
  //         } else {
  //           throw new Error("Teams context is not available");
  //         }
  //       });
  //     } catch (e) {
  //       console.error("Error initializing apps:", e);
  //       setError(e);
  //     }
  //   };

  //   initializeApp();
  // }, [instance]);

  const acquireTokenWithScopes = async () => {
    const options = {
      scopes: ["api://7185a779-a29f-423d-8b66-40cb92dfb5f3/react_UserAccess"]
    };

    try {
      const tokenResponse = await instance.acquireTokenSilent(options);
      console.log("Token response:", tokenResponse);
      sessionStorage.setItem("email", tokenResponse?.account?.username);
      const payload = await fetch(
        `${process.env.REACT_APP_BASEURL_ACCESS_CONTROL1}/api/UserProfile/Get?emailId=${tokenResponse?.account?.username}`,
        {
          headers: {
            Authorization: "Bearer " + tokenResponse.accessToken
          }
        }
      );
      handleUnauthorizedResponse(payload);
      const jsonResponse = await payload.json();
      console.log("API response:", jsonResponse);
    } catch (error) {
      console.error("Error acquiring token with scopes:", error);
      setError(error);
    }
  };
  const refreshAccessToken = async () => {
    const activeAccount = instance.getActiveAccount();
    if (!activeAccount) {
      console.error("No active account. Please log in again.");
      // toast.error("Session expired. Please log in again.");
      return;
    }
    const refreshToken = sessionStorage.getItem("refresh_token");
    console.log("Token refresh failed:", sessionStorage.getItem("refresh_token"));
    if (!refreshToken) {
      console.error("No refresh token available.");
      return;
    }

    try {
      const refreshResponse = await instance.acquireTokenSilent({
        scopes: ["api://7185a779-a29f-423d-8b66-40cb92dfb5f3/react_UserAccess"],
        refreshToken
      });

      if (refreshResponse && refreshResponse.accessToken) {
        sessionStorage.setItem("access_token", refreshResponse.accessToken);
        console.log("Access token refreshed.");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      // toast.error("Session expired. Please log in again.");
      // sessionStorage.clear();
      // navigate("/signin");
    }
  };

  // Refresh Token Timer
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 10 * 60 * 1000); // Refresh token every 10 minutes

    return () => clearInterval(interval);
  }, []);
  return (
    <SettingsProvider>
      <AuthProvider>
        <WhizTheme>
          <CssBaseline />
          {isMobile ? (
            // Mobile-specific component or layout here
            <div>{mcontent}</div>
          ) : (
            // Desktop or tablet component/layout
            <div>{content}</div>
          )}
        </WhizTheme>
      </AuthProvider>
    </SettingsProvider>
  );
};

export default App;
