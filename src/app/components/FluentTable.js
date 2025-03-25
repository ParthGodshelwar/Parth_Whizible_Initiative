import React, { useState, useEffect } from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  Stack,
  Text,
  DetailsRow,
  IColumn
} from "@fluentui/react";
import { Box, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const FluentTable = ({ columns, items, itemsPerPage, currentPage, setCurrentPage }) => {
  console.log("FluentTable", columns, items);
  useEffect(() => {
    setCurrentPage(currentPage); // Reset to first page when items change
  }, [items]);

  // Customize columns to add vertical lines
  const customizedColumns = columns.map((column, index) => ({
    ...column,
    onRender: (item) => (
      <div
        style={{
          borderRight: index < columns.length - 1 ? "1px solid #ddd" : "none",
          padding: "8px"
        }}
      >
        {column.onRender ? column.onRender(item) : item[column.key]}
      </div>
    )
  }));

  // Customize headers to add vertical lines
  const headerStyles = {
    root: {
      display: "flex"
    },
    cell: {
      borderRight: "1px solid #ddd"
    }
  };

  // Handlers for previous and next page
  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <DetailsList
        items={items.length === 0 ? [{}] : items} // Provide a single empty object if no items
        columns={customizedColumns} // Always show the defined columns, including headers
        setKey="set"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        onRenderRow={(props) => {
          if (items.length === 0 && props) {
            return (
              <div style={{ textAlign: "center", width: "100%", padding: "10px" }}>
                There are no items to show in this view.
              </div>
            );
          }
          return <DetailsRow {...props} />;
        }}
        styles={{
          root: {
            border: "1px solid #ddd", // Add border around the entire table
            overflowY: "hidden", // Hide scrollbar by preventing overflow
            scrollbarWidth: "none" // For Firefox
          },
          headerCell: headerStyles.cell // Apply vertical lines to header cells
        }}
      />

      {items.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 2
          }}
        >
          <IconButton onClick={handlePreviousPage} disabled={currentPage === 1}>
            <ArrowBackIcon />
          </IconButton>
          <Text> Page {currentPage}</Text>
          <IconButton onClick={handleNextPage} disabled={items.length < 5}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

export default FluentTable;
