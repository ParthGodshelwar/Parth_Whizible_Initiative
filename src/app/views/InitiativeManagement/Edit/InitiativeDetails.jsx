import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ActionItemTable from "./ActionItemTable";
import InitiativeHistoryDrawer from "./InitiativeHistoryDrawer";
import { toast } from "react-toastify";

// Added by Gauri to pass UniqueID on 20 Mar 2025
const InitiativeDetails = ({ initiativeData1, ideaID1, setRefresh1, refresh, checkListID1, stageID, UniqueID }) => {
  const initiativeData = initiativeData1?.listInitiativeChecklistResponsesEntity;
  
  // Added by Gauri to hide Convert to Action Item Button on 19 Mar 2025
  const checkListResponsesID = initiativeData?.[0]?.checkListResponsesID || 0;
  const showConvertToActionButton = checkListResponsesID !== 0;
  const IsSaveAccess = initiativeData?.[0]?.isSaveAccess;
  const showSaveButton = IsSaveAccess === 1;

  const [showActionItemTable, setShowActionItemTable] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [initiativeId, setInitiativeId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedCheckBoxes, setSelectedCheckBoxes] = useState([]);
  const userdata = JSON.parse(sessionStorage.getItem("user"));

  const employeeId = userdata?.employeeId;
  const [comments, setComments] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const groupedData = useMemo(() => {
    return initiativeData?.reduce((acc, section) => {
      if (!acc[section.sectionName]) {
        acc[section.sectionName] = [];
      }
      acc[section.sectionName].push(section);
      return acc;
    }, {});
  }, [initiativeData]);
  // const groupedData = useMemo(() => {
  //   console.log("initiativeData before grouping:", initiativeData);
    
  //   if (!initiativeData || initiativeData.length === 0) {
  //     console.warn("initiativeData is empty, returning empty groupedData.");
  //     return {};
  //   }
  
  //   return initiativeData.reduce((acc, section) => {
  //     if (!acc[section.sectionName]) {
  //       acc[section.sectionName] = [];
  //     }
  //     acc[section.sectionName].push(section);
  //     return acc;
  //   }, {});
  // }, [initiativeData]);
  
  console.log("groupedData", initiativeData1);
  const handleRadioChange = useCallback((sectionIndex, itemIndex, optionID) => {
    console.log("handleRadioChange", sectionIndex, itemIndex, optionID);
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [sectionIndex]: {
        ...prevSelectedOptions[sectionIndex],
        [itemIndex]: optionID
      }
    }));
  }, []);

  const handleCheckboxChange = useCallback(
    (sectionIndex, itemIndex) => {
      const checkboxKey = `${sectionIndex}-${itemIndex}`;
      setSelectedCheckBoxes((prevSelectedCheckBoxes) => {
        const newSelectedCheckBoxes = prevSelectedCheckBoxes.includes(checkboxKey)
          ? prevSelectedCheckBoxes.filter((item) => item !== checkboxKey)
          : [...prevSelectedCheckBoxes, checkboxKey];

        // Update groupedData when checkbox is clicked
        const updatedGroupedData = { ...groupedData };
        const item = updatedGroupedData[Object.keys(updatedGroupedData)[sectionIndex]][itemIndex];
        if (newSelectedCheckBoxes.includes(checkboxKey)) {
          item.isChecked = true; // Mark the item as selected
        } else {
          item.isChecked = false; // Uncheck it if it was already selected
        }
        return newSelectedCheckBoxes;
      });
    },
    [groupedData]
  );

  const handleConvertToActionItem = useCallback(() => {
    setRefresh1(!refresh);
    if (selectedCheckBoxes.length === 0) {
      toast.error("Please select at least one Checklist Item.");
      return;
    }

    // Extract selected items from initiativeData
    const selected = Object.keys(groupedData).flatMap((sectionName, sectionIndex) =>
      groupedData[sectionName].filter((item, itemIndex) =>
        selectedCheckBoxes.includes(`${sectionIndex}-${itemIndex}`)
      )
    );

    setSelectedItems(selected);
    setShowActionItemTable(true);
  }, [selectedCheckBoxes, groupedData]);

  // Added function by Gauri to update comments on 20 Mar 2025
  const handleCommentChange = (sectionIndex, itemIndex, value) => {
    setComments((prev) => ({
      ...prev,
      [`${sectionIndex}-${itemIndex}`]: value, // Updating specific comment field
    }));
  };  

  useEffect(() => {
    console.log("Updated Comments State:", comments);
  }, [comments]); 

  const handleSave = useCallback(async () => {
    const unselectedItems = Object.keys(groupedData).flatMap((sectionName, sectionIndex) =>
      groupedData[sectionName].filter((item, itemIndex) => {
        return !selectedOptions[sectionIndex]?.[itemIndex];
      })
    );

    if (unselectedItems.length > 0) {
      toast.error("Please fill all checklist items");
      return;
    }
    try {
      const checklistItemParam = Object.keys(selectedOptions).flatMap((sectionIndex) =>
        Object.keys(selectedOptions[sectionIndex]).map((itemIndex, i) => {
          const item = groupedData[Object.keys(groupedData)[sectionIndex]][itemIndex];

          // Added stageID by Gauri pass it on save on 18 Mar 2025
          return {
            responseId: selectedOptions[sectionIndex][i], // Now dynamic
            // Commented and Added by Gauri to update comments on 20 Mar 2025
            // comments: comments[`${sectionIndex}-${i}`] || "",
            comments: comments?.[`${sectionIndex}-${itemIndex}`] ?? "",
            contextId: item.ideaID,
            checkListItemId: item.itemID,
            // stageID: Number(sessionStorage.getItem("RequestStageID")),
            stageID: stageID,
            revisionId: item.revisionId,
            approverID: employeeId,
            checkListID: checkListID1
          };
        })
      );

      const payload = {
        ideaID: initiativeData1?.listInitiativeChecklistResponsesEntity[0]?.ideaID || 0,
        checklistItemParam
      };

      const response = await fetch(
        "https://pms.whizible.com/APIWithJWTToken/api/InitiativeDetail/PostCheckListResponse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error("Failed to save checklist data");
      setRefresh1(!refresh);
      const result = await response.json();
      console.log("API Response:", result);
      toast.success("Checklist data saved successfully!");
    } catch (error) {
      console.error("Error saving checklist data:", error);
      toast.error("Failed to save checklist data. Please try again.");
    }
  }, [selectedOptions, groupedData, initiativeData, initiativeData1, comments]);

  const renderPercentageBar = useCallback((value) => {
    const percentage = Math.max(0, Math.min(100, value));
    const barColor = percentage < 50 ? "#F55D30" : "#03BA28";
    return (
      <div
        style={{
          width: "100%",
          backgroundColor: "lightgrey",
          borderRadius: "4px",
          height: "12px",
          display: "flex",
          position: "relative"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: barColor,
            height: "100%",
            borderRadius: "4px 0 0 4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "black",
            fontWeight: "bold",
            fontSize: "8px"
          }}
        >
          {percentage}%
        </div>
        <div
          style={{
            width: `${100 - percentage}%`,
            backgroundColor: "grey",
            height: "100%",
            borderRadius: "0 4px 4px 0"
          }}
        />
      </div>
    );
  }, []);
  // useEffect(() => {
  //   if (groupedData && Object.keys(groupedData).length > 0) {
  //     Object.keys(groupedData).forEach((sectionName, sectionIndex) => {
  //       groupedData[sectionName].forEach((item, itemIndex) => {
  //         setComments((prev) => ({
  //           ...prev,
  //           [`${sectionIndex}-${itemIndex}`]: item.comments || "" // Default to existing comment or empty string
  //         }));
  //       });
  //     });
  //   }
  // }, [groupedData]);

  // Modified by Gauri to update comments on 20 Mar 2025
  useEffect(() => {
    console.log("groupedData inside useEffect:", groupedData); // Log groupedData
    if (!groupedData || Object.keys(groupedData).length === 0) {
      console.warn("groupedData is empty, skipping loop.");
      return; // Stop execution if groupedData is empty
    }
  
    setComments((prevComments) => {
      const newComments = { ...prevComments };
      
      Object.keys(groupedData).forEach((sectionName, sectionIndex) => {
        groupedData[sectionName].forEach((item, itemIndex) => {
          if (!newComments.hasOwnProperty(`${sectionIndex}-${itemIndex}`)) {
            newComments[`${sectionIndex}-${itemIndex}`] = item.comments || "";
          }
        });
      });
  
      console.log("Initializing Comments:", newComments);
      return newComments;
    });
  }, [groupedData]);
  
  useEffect(() => {
    if (groupedData && Object.keys(groupedData).length > 0) {
      Object.keys(groupedData).forEach((sectionName, sectionIndex) => {
        groupedData[sectionName].forEach((item, itemIndex) => {
          item.listChecklistAnswerSetEntity?.forEach((answer) => {
            if (item.responseID === answer.optionID) {
              // Save the default selected option
              setSelectedOptions((prev) => ({
                ...prev,
                [sectionIndex]: {
                  ...prev[sectionIndex],
                  [itemIndex]: answer.optionID
                }
              }));
            }
          });
        });
      });
    }
  }, [groupedData]);

  const renderCheckbox = useCallback(
    (item, sectionIndex, itemIndex) => {
      // Default checked if responseID matches optionID
      const isChecked = item.listChecklistAnswerSetEntity.some(
        (answer) => answer.responseID === answer.optionID
      );
      // Added by Gauri to check if isConverttoActionItems is 1 on 18 Mar 2025
      const isDisabled = item.isConverttoActionItems === 1; // Disable if isConverttoActionItems is 1
      return (
        <input
          type="checkbox"
          checked={isChecked || item.isChecked}
          // Commented and Added by Gauri to check if isConverttoActionItems is 1 on 18 Mar 2025
          // onChange={() => handleCheckboxChange(sectionIndex, itemIndex)}
          disabled={isDisabled}
          onChange={() => !isDisabled && handleCheckboxChange(sectionIndex, itemIndex)}
        />
      );
    },
    [handleCheckboxChange]
  );

  const handlePrint = useCallback(() => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Checklist Details", 10, 10);

    const tableColumn = ["Checklist Items", "W%", "Scores", "Rationale", "Action"];
    const tableRows = initiativeData.map((section) => [
      section.sectionName,
      `${section.sectionWattage}%`,
      section.listChecklistAnswerSetEntity.map((item) => item.optionName).join(", "),
      "",
      ""
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save("Checklist_Details.pdf");
  }, [initiativeData]); 

  return (
    <div className="accordion-body mt-2">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        sx={{ padding: 2, boxShadow: 2, width: "100%" }}
      >
        <Typography variant="h6" sx={{ color: "#333" }}>
          Checklist Details
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, alignItems: "center" }}>
        {/* Added showConvertToActionButton by Gauri to hide Convert to Action Item Button on 19 Mar 2025 */}
          {showConvertToActionButton && !showActionItemTable && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConvertToActionItem}
              sx={{ paddingX: 2, textTransform: "none", "&:hover": { backgroundColor: "#2b6cb0" } }}
            >
              Convert to Action Item
            </Button>
          )}
          {showActionItemTable && (
            <Button
              variant="contained"
              onClick={() => {
                setShowActionItemTable((prev) => !prev);
                // Added by Gauri to reset checkbox state on 21 Mar 2025
                setSelectedCheckBoxes([]);
              }}
              sx={{ paddingX: 2, textTransform: "none", "&:hover": { backgroundColor: "#e53e3e" } }}
            >
              Close
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setHistoryDrawerOpen(true);
              console.log("initiativeData1", initiativeData1);
              setInitiativeId(initiativeData1?.listInitiativeChecklistResponsesEntity[0]?.ideaID);
            }}
            sx={{ paddingX: 2, textTransform: "none", "&:hover": { backgroundColor: "#9b66f4" } }}
          >
            Show History
          </Button>
          {groupedData && Object.keys(groupedData).length > 0 && !showActionItemTable && showSaveButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{
                paddingX: 2,
                textTransform: "none",
                "&:hover": { backgroundColor: "#17a2b8" }
              }}
            >
              Save
            </Button>
          )}
        </Box>
      </Box>

      {/* Added showConvertToActionButton, stageID and setSelectedCheckBoxes by Gauri on 18 Mar 2025 */}
      {showActionItemTable ? (
        <ActionItemTable
          selectedItems={selectedItems}
          handleActionItemClick={(item) => console.log(item)}
          setRefresh1={setRefresh1}
          refresh={refresh}
          setShowActionItemTable={setShowActionItemTable}
          stageID={stageID}
          setSelectedCheckBoxes={setSelectedCheckBoxes} 
        />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3, boxShadow: 1 }}>
          <table className="table details-table mb-0">
            <thead>
              <tr>
                <th>Checklist Items</th>
                <th>W%</th>
                <th>Scores</th>
                <th>Rationale</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {groupedData && Object.keys(groupedData).length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    There are no items to show in this view.
                  </td>
                </tr>
              ) : (
                groupedData &&
                Object.keys(groupedData).map((sectionName, sectionIndex) => {
                  const section = groupedData[sectionName][0];
                  return (
                    <React.Fragment key={sectionIndex}>
                      <tr className="bglightblue">
                        <td>
                          <strong>{sectionName}</strong>
                        </td>
                        <td>{section.sectionWattage}%</td>
                        {/* Added by Gauri to update Section Rating on 21 Mar 2025 */}
                        <td>Section Rating : [{section.sectionRating}% of {section.sectionWattage} = {((section.sectionRating / 100) * section.sectionWattage).toFixed(2)}]</td>
                        <td >{renderPercentageBar(section.sectionRating)}</td>
                        <td></td>
                      </tr>
                      {groupedData[sectionName].map((item, itemIndex) => (
                        <tr key={`${sectionIndex}-${itemIndex}`}>
                          <td>{item.itemName}</td>
                          <td>{item.itemWattage}%</td>
                          <td>
                            {item.listChecklistAnswerSetEntity?.map((answer, answerIndex) => (
                              <div key={`${itemIndex}-${answerIndex}`}>
                                <input
                                  type="radio"
                                  name={`section_${sectionIndex}_item_${itemIndex}`}
                                  value={answer.optionID}
                                  checked={
                                    selectedOptions[sectionIndex]?.[itemIndex] === answer.optionID
                                  }
                                  onChange={() =>
                                    handleRadioChange(sectionIndex, itemIndex, answer.optionID)
                                  }
                                />
                                {answer.optionName}
                              </div>
                            ))}
                          </td>
                          <td>
                            {/* Commented and Added comment field by Gauri on 20 Mar 2025 */}
                            {/* <textarea
                              className="form-control"
                              placeholder="Comment"
                              rows="3"
                              value={comments[`${sectionIndex}-${itemIndex}`] || ""}
                              onChange={(e) =>
                                setComments((prevComments) => ({
                                  ...prevComments,
                                  [`${sectionIndex}-${itemIndex}`]: e.target.value
                                }))
                              }
                            /> */}
                            {/* Added by Gauri to update comments on 20 Mar 2025 */}
                            <textarea
                              rows="3"
                              value={comments[`${sectionIndex}-${itemIndex}`] || ""}
                              onChange={(e) => handleCommentChange(sectionIndex, itemIndex, e.target.value)}
                              placeholder="Comment"
                              className="form-control"
                            />
                          </td>

                          <td>{renderCheckbox(item, sectionIndex, itemIndex)}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>
      )}

      {historyDrawerOpen && (
        <InitiativeHistoryDrawer
          isOpen={historyDrawerOpen}
          onClose={() => setHistoryDrawerOpen(false)}
          id1={initiativeId}
          // Added by Gauri to pass UniqueID on 20 Mar 2025
          UniqueID={UniqueID}
        />
      )}
    </div>
  );
};

export default InitiativeDetails;
