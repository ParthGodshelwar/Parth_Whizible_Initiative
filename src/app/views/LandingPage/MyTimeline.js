import React, { useState, useEffect } from "react";
import { Stack, Text } from "@fluentui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MyTimeline.css";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

const getColorCode = (timelineEntry) => {
  if (timelineEntry.isRed) return "#f8d7da";
  if (timelineEntry.isGreen) return "#77e0b6";
  if (timelineEntry.isBlue) return "#fff3cd";
  return null;
};

const tileContent = ({ date, view }, highlightedDates) => {
  if (view === "month") {
    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );
    if (matchingDate) {
      return (
        <div className="highlighted-date">
          <div
            className="circle"
            style={{
              backgroundColor: matchingDate.color
            }}
          >
            {date.getDate()}
          </div>
        </div>
      );
    }
  }
  return null;
};

const tileClassName = ({ date, view }, highlightedDates) => {
  if (view === "month") {
    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === date.getDate() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getFullYear() === date.getFullYear()
    );
    if (matchingDate) {
      return "highlighted-date";
    }
  }
  return null;
};

const MyTimeline = ({ mTimeline, prevMonth, prevYear, setPrevMonth, setPrevYear }) => {
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {}, [mTimeline]);

  const highlightedDates = mTimeline?.landingDBMTimeline
    ?.map((entry) => {
      const color = getColorCode(entry);
      if (color) {
        return {
          date: new Date(
            entry.year,
            new Date(Date.parse(entry.monthName + " 1, 2021")).getMonth(),
            entry.day
          ),
          color,
          initiativeTitle: entry.initiativeTitle
        };
      }
      return null;
    })
    .filter(Boolean);

  const handleDateChange = (newDate) => {
    const newMonth = newDate.getMonth();
    const newYear = newDate.getFullYear();

    if (newMonth !== prevMonth || newYear !== prevYear) {
      console.log(`Month changed to: ${newMonth}`);
      console.log(`Year changed to: ${newYear}`);
      setPrevMonth(newMonth);
      setPrevYear(newYear);
    }

    const matchingDate = highlightedDates?.find(
      (d) =>
        d.date.getDate() === newDate.getDate() &&
        d.date.getMonth() === newDate.getMonth() &&
        d.date.getFullYear() === newDate.getFullYear()
    );

    if (matchingDate) {
      setSelectedEntry(matchingDate);
      setModalOpen(true);
    }

    setDate(newDate);
    console.log(`Selected Date: ${newDate.toDateString()}`);
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    const newMonth = activeStartDate.getMonth();
    const newYear = activeStartDate.getFullYear();

    if (newMonth !== prevMonth || newYear !== prevYear) {
      console.log(`Month changed to: ${newMonth + 1}`);
      console.log(`Year changed to: ${newYear}`);
      setPrevMonth(newMonth);
      setPrevYear(newYear);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <Stack
      styles={{
        root: {
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          flex: 1,
          maxWidth: "100%",
          boxSizing: "border-box",
          "@media (max-width: 768px)": {
            padding: "12px"
          }
        }
      }}
    >
      <Text variant="medium" styles={{ root: { fontWeight: "bold", marginBottom: "16px" } }}>
        My Timeline
      </Text>
      <Stack>
        <div style={{ width: "100%", height: "400px" }}>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 20 }}
            styles={{
              root: {
                marginBottom: "16px",
                "@media (max-width: 768px)": {
                  flexDirection: "column",
                  childrenGap: 10
                }
              }
            }}
          >
            <Calendar
              onChange={handleDateChange}
              value={date}
              tileContent={(props) => tileContent(props, highlightedDates)}
              tileClassName={(props) => tileClassName(props, highlightedDates)}
              onActiveStartDateChange={handleActiveStartDateChange}
              style={{
                width: "100%",
                "@media (max-width: 768px)": {
                  width: "100%"
                }
              }}
            />
          </Stack>
        </div>
      </Stack>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <Tooltip title="Close">
              <CloseIcon />
            </Tooltip>
          </IconButton>
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedEntry?.date.toDateString()}
          </Typography>
          <Typography variant="body1">{selectedEntry?.initiativeTitle}</Typography>
        </Box>
      </Modal>
    </Stack>
  );
};

export default MyTimeline;
