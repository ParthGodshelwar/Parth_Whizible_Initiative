// src/app/views/LandingPage/index.jsx
import React, { useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import ProfileCard from "./ProfileCard";
import StatisticsCard from "./StatisticsCard";
import AlertNotification from "./AlertNotification";
import TodayPriority from "./TodayPriority";
import QuickInbox from "./QuickInbox";
import MyTimeline from "./MyTimeline";
import { FaSync, FaRandom, FaCamera, FaLock, FaUnlock } from "react-icons/fa";
import { captureFullPageScreenshot } from "../Action/screenshotUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import stats from "../../hooks/landingpage/stats";
import ProfileMessage from "../../hooks/landingpage/ProfileMessage";
import GetAlertNot from "../../hooks/landingpage/GetAlertNot";
import GetMTimeline from "../../hooks/landingpage/GetMTimeline";
import GetQinbox from "../../hooks/landingpage/GetQinbox";
import GetTPriority from "../../hooks/landingpage/GetTPriority";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayout = [
  { i: "profile", x: 0, y: 0, w: 3, h: 1, minW: 3, maxW: 3, minH: 1, maxH: 1 },
  { i: "statistics", x: 0, y: 1, w: 3, h: 1, minW: 3, maxW: 3, minH: 1, maxH: 1 },
  { i: "alert", x: 3, y: 0, w: 1, h: 2, minW: 1, maxW: 1, minH: 2, maxH: 2 },
  { i: "timeline", x: 0, y: 2, w: 1, h: 1, minW: 1, maxW: 2, minH: 1, maxH: 1 },
  { i: "quick", x: 1, y: 2, w: 1.5, h: 1, minW: 1, maxW: 2, minH: 1, maxH: 1 },
  { i: "today", x: 3, y: 2, w: 1.5, h: 1, minW: 1, maxW: 2, minH: 1, maxH: 1 }
];

const Dashboard = () => {
  const [layout, setLayout] = useState(defaultLayout);
  const [isDraggable, setIsDraggable] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [userProfileData, setUserProfileData] = useState(null);
  const [usermessage, setUserUsermessage] = useState(null);
  const [qinbox, setQinbox] = useState(null);
  const [alertNot, setAlertNot] = useState(null);
  const [mTimeline, setMTimeline] = useState(null);
  const [tPriority, setTPriority] = useState(null);
  const [date, setDate] = useState(new Date());
  const [prevMonth, setPrevMonth] = useState(date.getMonth());
  const [prevYear, setPrevYear] = useState(date.getFullYear());
  const [refrsh, setRefresh] = useState(true);
  const fetchStatsData = async () => {
    try {
      const data = await stats();
      setUserProfileData(data.listLandingDBStatistics[0]);
    } catch (error) {
      console.error("Failed to fetch user profile data:", error);
    }
  };

  const fetchMTimelineData = async (year, month) => {
    try {
      const data = await GetMTimeline(year, month);
      setMTimeline(data);
    } catch (error) {
      console.error("Failed to fetch timeline data:", error);
    }
  };

  const fetchAlertNotData = async () => {
    try {
      const data = await GetAlertNot();
      setAlertNot(data);
    } catch (error) {
      console.error("Failed to fetch alert notifications:", error);
    }
  };

  const fetchQinboxData = async () => {
    try {
      const data = await GetQinbox();
      setQinbox(data);
    } catch (error) {
      console.error("Failed to fetch quick inbox data:", error);
    }
  };

  const fetchProfileMessageData = async () => {
    try {
      const data = await ProfileMessage();
      setUserUsermessage(data);
    } catch (error) {
      console.error("Failed to fetch profile message:", error);
    }
  };

  const fetchTPriorityData = async () => {
    try {
      const data = await GetTPriority();
      setTPriority(data);
    } catch (error) {
      console.error("Failed to fetch today priority data:", error);
    }
  };

  useEffect(() => {
    fetchStatsData();
    fetchProfileMessageData();
    fetchQinboxData();
    fetchTPriorityData();
    fetchAlertNotData();
    // const year = date.getFullYear();
    // const month = date.getMonth() + 1; // Months are zero-based
    // fetchMTimelineData(year, month);
  }, [refrsh]);
  useEffect(() => {
    fetchMTimelineData(prevMonth, prevYear);
  }, [prevMonth, prevYear]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const toggleDraggable = () => {
    setIsDraggable((prev) => !prev);
  };

  const resetLayout = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: "2px", backgroundColor: "#F9F9F9", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2px" }}>
        <button
          onClick={toggleDraggable}
          title={isDraggable ? "Lock layout" : "Unlock layout"} // Tooltip text
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            color: "#0078d4",
            marginRight: "10px"
          }}
        >
          {isDraggable ? <FaUnlock /> : <FaLock />}
        </button>
        <button
          onClick={resetLayout}
          title="Reset layout" // Tooltip text
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            color: "#0078d4",
            marginRight: "10px"
          }}
        >
          <FaRandom />
        </button>
        <button
          onClick={() => {
            setRefresh(!refrsh);
            toast.success("Fetching latest data");
          }}
          title="Refresh data" // Tooltip text
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "15px",
            color: "#0078d4",
            marginRight: "10px"
          }}
        >
          <FaSync />
        </button>
        {/* Uncomment if you want to include the screenshot button */}
        {/* <button
    onClick={handleScreenshot}
    title="Take screenshot" // Tooltip text
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "15px",
      color: "#0078d4"
    }}
  >
    <FaCamera />
  </button> */}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200 }}
        cols={{ lg: 4 }}
        rowHeight={150}
        width={1200}
        isDraggable={isDraggable}
        isResizable={isDraggable}
      >
        <div key="profile" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <ProfileCard usermessage={usermessage} />
        </div>
        <div key="statistics" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <StatisticsCard userProfileData={userProfileData} />
        </div>
        <div key="alert" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <AlertNotification alertNot={alertNot} />
        </div>
        <div key="timeline" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <MyTimeline
            mTimeline={mTimeline}
            prevMonth={prevMonth}
            prevYear={prevYear}
            setPrevMonth={setPrevMonth}
            setPrevYear={setPrevYear}
          />
        </div>
        <div key="quick" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <QuickInbox qinbox={qinbox} />
        </div>
        <div key="today" style={{ backgroundColor: "#fff", padding: "10px" }}>
          <TodayPriority tPriority={tPriority} />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
