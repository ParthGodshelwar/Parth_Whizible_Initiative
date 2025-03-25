import React from "react";
import { Stack } from "@fluentui/react";
import SearchAdvanceForm from "./SearchAdvanceForm";

const SearchList = ({ onClose, searchFilters, onSearch, reset }) => {
  return (
    <div className="search-list-container">
      <div className="search-list-box">
        <Stack
          tokens={{ childrenGap: 20 }}
          styles={{ root: { padding: 20, border: "1px solid #ccc", background: "white" } }} // White background for Stack
        >
          <h4 style={{ backgroundColor: "#f2f2f2", padding: "10px" }}>Advanced Search</h4>{" "}
          {/* Background color for h4 */}
          <SearchAdvanceForm
            onClose={onClose}
            searchFilters={searchFilters}
            onSearch={onSearch}
            reset={reset}
          />
        </Stack>
      </div>
    </div>
  );
};

export default SearchList;
