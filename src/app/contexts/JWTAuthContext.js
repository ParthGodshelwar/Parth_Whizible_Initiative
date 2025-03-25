import React, { createContext, useEffect, useReducer, useState } from "react";
import { useMsal } from "@azure/msal-react";
import fetchUserProfile from "../hooks/fetchUserProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as microsoftTeams from "@microsoft/teams-js";
import msalInstance from "./msalConfig";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import UnauthorizedPage from "app/views/UnauthorizedPage";
// Initialize Fluent UI icons

const initialState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialized: true, user };
    }
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null };
    case "REGISTER":
      return { ...state, isAuthenticated: true, user: action.payload.user };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  logout: () => {},
  handleMicrosoftSignIn: () => {},
  handleMicrosoftSignIn1: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { instance } = useMsal();
  const [msalInitialized, setMsalInitialized] = useState(false);
  const navigate = useNavigate();
  const [isUnregistered, setIsUnregistered] = useState(false);
  const [timer, setTimer] = useState(10);
  const [token, setToken] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [moduleAccess, setModuleAccess] = useState(null);
  const [refreshTokenTimeout, setRefreshTokenTimeout] = useState(null);

  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize();
        setMsalInitialized(true);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
      }
    };

    initializeMSAL();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const token = sessionStorage.getItem("access_token");
      const user = sessionStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser === null) {
          setIsUnregistered(true);
        } else {
          dispatch({ type: "LOGIN", payload: { isAuthenticated: true, user: parsedUser } });
        }
      } else if (token) {
        dispatch({ type: "INIT", payload: { isAuthenticated: true, user: null } });
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (isUnregistered) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 5000);

      setTimeout(() => {
        clearInterval(countdown);
        sessionStorage.clear();
        window.location.href = "/signin"; // Redirect and refresh the page immediately
      }, 5000); // Redirect after 0 seconds

      return () => clearInterval(countdown); // Cleanup the interval on component unmount
    }
  }, [isUnregistered, navigate]);

  const handleMicrosoftSignIn = async () => {
    if (!msalInitialized) {
      console.error("MSAL is not initialized.");
      return;
    }

    try {
      const loginResponse = await instance.loginPopup({
        scopes: ["api://7185a779-a29f-423d-8b66-40cb92dfb5f3/react_UserAccess"],
        prompt: "select_account"
      });

      if (loginResponse.accessToken) {
        const decodedToken = jwtDecode(loginResponse.accessToken);
        const email = decodedToken.preferred_username;

        sessionStorage.setItem("email", email);
        sessionStorage.setItem("access_token", loginResponse.accessToken);
        sessionStorage.setItem("refresh_token", loginResponse.idToken);
        const user = await fetchUserProfile(loginResponse.accessToken);

        if (user) {
          dispatch({ type: "LOGIN", payload: { isAuthenticated: true, user } });
          sessionStorage.setItem("user", JSON.stringify(user));
          toast.success("Microsoft login successful");
          setTimeout(() => {
            navigate("/landingpage");
          }, 3000);
        } else {
          setIsUnregistered(true);
        }
      }
    } catch (error) {
      dispatch({ type: "INIT", payload: { isAuthenticated: false, user: null } });
      console.error("Microsoft sign-in failed:", error);
      toast.error("Microsoft login failed. Please retry.");
    }
  };
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to parse JWT:", error);
      return null;
    }
  };

  const handleMicrosoftSignIn1 = async () => {
    console.log("handleMicrosoftSignIn1:");
    try {
      console.log("handleMicrosoftSignIn133:");
      dispatch({ type: "LOGIN", payload: { isAuthenticated: true } });

      await microsoftTeams.app.initialize();
      console.log("Teams SDK initialized");

      microsoftTeams.authentication.getAuthToken({
        successCallback: async (result) => {
          console.log("Token received2222222222:", result);
          setToken(result);
          sessionStorage.setItem("token", result);
          const decodedToken = parseJwt(result);
          const username = decodedToken.preferred_username;

          const accounts = instance.getAllAccounts();
          const userAccount = accounts.find((account) => account.username === username);
          sessionStorage.setItem("accounts", accounts);
          if (userAccount) {
            sessionStorage.setItem("userAccount", userAccount);
            instance.setActiveAccount(userAccount);
          } else {
            console.error("User account not found in MSAL accounts.");
          }
          dispatch({ type: "LOGIN", payload: { isAuthenticated: true } });

          toast.success("Microsoft login successful");
          // Decode the JWT token to get the preferred_username
          try {
            const decodedToken = jwtDecode(result);
            const emailId = decodedToken.preferred_username;

            // Call the API with the Bearer token
            const userProfileResponse = await fetch(
              `https://pms.whizible.com/W24_Teams_API/api/UserProfile/Get?emailId=${emailId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${result}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (!userProfileResponse.ok) {
              throw new Error(`Error fetching user profile: ${userProfileResponse.statusText}`);
            }

            const userProfileData = await userProfileResponse.json();
            setUserProfile(userProfileData);
            sessionStorage.setItem("user", JSON.stringify(userProfileData));
            sessionStorage.setItem("UserProfilePic", userProfileData?.data?.profilePicURL);
            // Extract empID from userProfileData
            const empID = userProfileData.data.employeeId;
            if (!empID) setIsUnregistered(true);
            console.log("employeeId", userProfileData.data);
            // Call the second API with empID
            const moduleAccessResponse = await fetch(
              `https://pms.whizible.com/W24_Teams_API/api/ModuleAccess/Get?empID=${empID}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${result}`,
                  "Content-Type": "application/json"
                }
              }
            );

            if (!moduleAccessResponse.ok) {
              throw new Error(`Error fetching module access: ${moduleAccessResponse.statusText}`);
            }

            const moduleAccessData = await moduleAccessResponse.json();
            setModuleAccess(moduleAccessData);
            sessionStorage.setItem("tAccess", JSON.stringify(moduleAccessData));
            const empId = moduleAccessData.data.length > 0 ? moduleAccessData.data[0].empId : null;
            if (emailId) navigate("/landingpage");
          } catch (apiError) {
            setError("Error calling API: " + apiError.message);
            // Clear cache if userProfileData is null
            if (!userProfile) {
              sessionStorage.clear();
              toast.error("You are not a registered user");
            }
          }
        },
        failureCallback: (error) => {
          setError("Error getting token: " + error);
        }
      });
    } catch (err) {
      setError("Initialization error: " + err.message);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    toast.success("Logout successful");
  };

  if (isUnregistered) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center"
        }}
      >
        <div>
          <h2>You are not a registered user</h2>
          <p>Redirecting to sign-in page...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        logout,
        handleMicrosoftSignIn,
        handleMicrosoftSignIn1
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
