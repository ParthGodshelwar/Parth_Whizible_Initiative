import React, { useState, useEffect } from "react";
import { Box, Tooltip, Modal, Typography, IconButton } from "@mui/material";
import {
  Checkbox,
  PrimaryButton,
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn
} from "@fluentui/react";
import DrawerCurrency from "./DrawerCurrency";
import AccorCurrency from "./AccorCurrency";
import { CurrencyInfo_Section } from "./DummyData";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import Ad_SearchIcon from "../../../../assets/img/search-list.png";
import Pagination from "@mui/material/Pagination";
import EditIcon from "@mui/icons-material/Edit"; // Import the pencil icon
import usePostCurrencyMaster from "../../../hooks/CurrencyMaster/usePostCurrencyMaster";
import useDeleteCurrencyMaster from "../../../hooks/CurrencyMaster/useDeleteCurrencyMaster";
import usePutCurrencyMaster from "../../../hooks/CurrencyMaster/usePutCurrencyMaster";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CurrencyTable = ({ currencyData, onSearch, onClose, getViewOptions }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [individualChecks, setIndividualChecks] = useState(CurrencyInfo_Section.map(() => false));
  const [selectedCurrencyNames, setSelectedCurrencyNames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const viewPermission = getViewOptions && getViewOptions[0] ? getViewOptions[0] : {};
  const { a: canAdd, e: canEdit, d: canDelete } = viewPermission;

  // Use custom hooks
  const {
    postCurrencyData,
    responseData: postResponseData,
    loading: postLoading,
    error: postError
  } = usePostCurrencyMaster();
  const {
    deleteCurrencyData,
    responseData: deleteResponseData,
    loading: deleteLoading,
    error: deleteError
  } = useDeleteCurrencyMaster();
  const {
    putCurrencyData,
    responseData: putResponseData,
    loading: putLoading,
    error: putError
  } = usePutCurrencyMaster();

  useEffect(() => {
    setData(currencyData);
  }, [currencyData, postResponseData, deleteResponseData]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const currentData = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSelectAllChange = (e, checked) => {
    setSelectAllChecked(checked);
    setIndividualChecks(individualChecks.map(() => checked));
  };

  const handleIndividualChange = (index, checked) => {
    const newChecks = [...individualChecks];
    newChecks[index] = checked;
    setIndividualChecks(newChecks);
    setSelectAllChecked(newChecks.every((check) => check));
  };

  const handleDisabledClick = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddCurrency = async (currencyData) => {
    try {
      await postCurrencyData(currencyData);
      setDrawerVisible(false);
      onSearch();
      toast.success("Currency added successfully");
    } catch (error) {
      console.error("Failed to add currency:", error);
      toast.error("Failed. Please retry.");
    }
  };
  const handleEditCurrency = async (currencyData) => {
    try {
      await putCurrencyData(currencyData);
      setDrawerVisible(false);
      onSearch();
      toast.success("Currency edited successfully");
    } catch (error) {
      console.error("Failed to add currency:", error);
      toast.error("Failed. Please retry.");
    }
  };
  const handleDeleteSelected = async () => {
    const selectedIndices = individualChecks
      .map((checked, index) => (checked ? index : -1))
      .filter((index) => index !== -1);

    const selectedItems = selectedIndices.map((index) => currentData[index]);

    for (const item of selectedItems) {
      try {
        await deleteCurrencyData(item.currencyID, employeeId);
        onSearch();
        toast.success("Currency deleted successfully");
      } catch (error) {
        console.error("Failed to delete currency:", error);
        toast.error("Failed. Please retry.");
      }
    }

    onSearch(); // Trigger search or refresh after deleting data
  };

  const handleEdit = (currency) => {
    if (!canEdit) {
      handleDisabledClick("You don't have rights to edit, contact admin.");
    } else {
      setSelectedCurrencyNames([currency]);
      setDrawerVisible(true);
    }
  };

  const checkboxStyles = {
    checkbox: {
      selectors: {
        "::after": {
          content: '"✓"',
          fontSize: "16px",
          color: "white",
          paddingRight: "7px"
        }
      }
    },
    checkmark: {
      visibility: "hidden"
    }
  };

  const columns = [
    {
      key: "currencyID",
      name: t("Generation Date"),
      fieldName: "currencyID",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: false
    },
    {
      key: "currencyName",
      name: t("From Date"),
      fieldName: "currencyName",
      minWidth: 150,
      maxWidth: 200,
      isMultiline: false
    },
    {
      key: "currencySymbol",
      name: t("To Date"),
      fieldName: "currencySymbol",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: false
    },

    {
      key: "actions",
      name: t("actions"),
      fieldName: "actions",
      minWidth: 100,
      maxWidth: 150,
      isMultiline: false,
      onRender: (item) => (
        <IconButton
          color="primary"
          onClick={() => handleEdit(item)}
          disabled={!canEdit}
          sx={{
            color: canEdit ? "#1976d2" : "#ccc",
            cursor: canEdit ? "pointer" : "not-allowed"
          }}
        >
          <EditIcon />
        </IconButton>
      )
    },
    {
      key: "select",
      name: "",
      fieldName: "select",
      minWidth: 50,
      maxWidth: 50,
      isMultiline: false,
      onRender: (item, index) => (
        <Checkbox
          styles={checkboxStyles}
          id={`chkRow${index + 1}`}
          className="dltSingleCost"
          checked={individualChecks[index]}
          onChange={(e, checked) => handleIndividualChange(index, checked)}
        />
      )
    }
  ];

  return (
    <div className="mx-4 mt-3">
      <div className="row align-items-end mb-3">
        <div className="col-3 col-sm-3"></div>
        <div className="col-3 col-sm-3" align={"start"}></div>
        <div className="col-6 col-sm-6 my-2">
          <div className="d-flex justify-content-end gap-3">
            <img
              src={Ad_SearchIcon}
              alt=""
              onClick={handleShowForm}
              data-bs-toggle="tooltip"
              aria-label={t("search_list")}
              data-bs-original-title={t("search_list")}
              style={{ width: "30px", height: "30px" }}
            />
            <Tooltip title={!canAdd ? t("no_rights_add") : ""}>
              <span>
                <PrimaryButton
                  onClick={() => {
                    if (!canAdd) {
                      handleDisabledClick(t("no_rights_add"));
                    } else {
                      setSelectedCurrencyNames([]);
                      setDrawerVisible(true);
                    }
                  }}
                  text={t("add")}
                  disabled={!canAdd}
                  styles={{
                    root: { backgroundColor: canAdd ? "#1976d2" : "#ccc", color: "#fff" }
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip title={!canDelete ? t("no_rights_delete") : ""}>
              <span>
                <PrimaryButton
                  text={t("delete")}
                  onClick={() => {
                    if (!canDelete) {
                      handleDisabledClick(t("no_rights_delete"));
                    } else {
                      handleDeleteSelected();
                    }
                  }}
                  disabled={!canDelete}
                  styles={{
                    root: { backgroundColor: canDelete ? "#1976d2" : "#ccc", color: "#fff" }
                  }}
                />
              </span>
            </Tooltip>
          </div>
        </div>
        <DrawerCurrency
          visible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          selectedCurrencyNames={selectedCurrencyNames}
          handleAddCurrency={handleAddCurrency} // Pass the add handler to the DrawerCurrency component
          handleEditCurrency={handleEditCurrency}
        />
      </div>
      {showForm && <AccorCurrency onClose={onClose} onSearch={onSearch} />}
      <Box sx={{ height: 340 }}>
        <DetailsList
          items={currentData}
          columns={columns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </Box>
      <div>
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <Pagination
            count={Math.ceil(data.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {t("attention")}
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          <PrimaryButton onClick={handleCloseModal} variant="contained" color="primary">
            {t("close")}
          </PrimaryButton>
        </Box>
      </Modal>
    </div>
  );
};

export default CurrencyTable;
