import React, { useState, useEffect } from "react";
import { Label, TextField, Stack, PrimaryButton, Dropdown } from "@fluentui/react";
import currencySymbolMap from "currency-symbol-map";
import currencyCodes from "currency-codes";
import { useTranslation } from "react-i18next";

// Function to get currency symbol options
const getCurrencySymbolOptions = () => {
  return currencyCodes.codes().map((code) => {
    const symbol = currencySymbolMap(code);
    const currencyName = currencyCodes.code(code).currency;
    return { key: symbol, text: `${symbol} - ${currencyName} (${code})` };
  });
};

const DetailsCurrency = ({
  onClose,
  selectedCurrencyNames,
  handleAddCurrency,
  handleEditCurrency
}) => {
  const { t } = useTranslation();
  const currencySymbolOptions = getCurrencySymbolOptions();
  const userdata = JSON.parse(sessionStorage.getItem("user"));
  const employeeId = userdata?.employeeId;
  const Currency = {
    CurrencyCode: "",
    CurrencyName: "",
    CurrencySymbol: "",
    ConversionRate: "",
    Major: "",
    Minor: ""
  };

  const [formValues, setFormValues] = useState(Currency);
  const [errors, setErrors] = useState({});

  // Use custom hook for PUT request

  useEffect(() => {
    if (selectedCurrencyNames && selectedCurrencyNames.length > 0) {
      const currency = selectedCurrencyNames[0];
      setFormValues({
        CurrencyCode: currency.currencyCode || "",
        CurrencyName: currency.currencyName || "",
        CurrencySymbol: currency.currencySymbol || "",
        ConversionRate: currency.conversionRate || "",
        Major: currency.majorCurrencyUnit || "",
        Minor: currency.minorCurrencyUnit || ""
      });
    } else {
      setFormValues(Currency);
    }
  }, [selectedCurrencyNames]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value
    }));
  };

  const handleDropdownChange = (event, option) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      CurrencySymbol: option.key
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValues.CurrencyCode) newErrors.CurrencyCode = t("CurrencyCode") + " is required.";
    if (!formValues.CurrencyName) newErrors.CurrencyName = t("CurrencyName") + " is required.";
    if (!formValues.CurrencySymbol)
      newErrors.CurrencySymbol = t("CurrencySymbol") + " is required.";
    if (!formValues.ConversionRate || isNaN(formValues.ConversionRate))
      newErrors.ConversionRate = t("ConversionRate") + " must be a floating-point number.";
    if (!formValues.Major || isNaN(formValues.Major) || !Number.isInteger(Number(formValues.Major)))
      newErrors.Major = t("Major") + " must be an integer.";
    if (!formValues.Minor || isNaN(formValues.Minor) || !Number.isInteger(Number(formValues.Minor)))
      newErrors.Minor = t("Minor") + " must be an integer.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const payload = {
        currencyID:
          selectedCurrencyNames && selectedCurrencyNames.length > 0
            ? selectedCurrencyNames[0].currencyID
            : 0,
        currencyCode: formValues.CurrencyCode,
        currencyName: formValues.CurrencyName,
        currencySymbol: formValues.CurrencySymbol,
        conversionRate: parseFloat(formValues.ConversionRate),
        majorCurrencyUnit: formValues.Major.toString(), // Convert to string
        minorCurrencyUnit: formValues.Minor.toString(), // Convert to string
        createdBYID: employeeId
      };

      try {
        if (selectedCurrencyNames && selectedCurrencyNames.length > 0) {
          await handleEditCurrency(payload); // Call the PUT API if currency exists
        } else {
          handleAddCurrency(payload); // Call the POST API otherwise
        }
        onClose(); // Close the form or perform other actions
      } catch (error) {
        console.error("Error saving currency data:", error);
      }
    } else {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          element.focus();
        }
      }
    }
  };

  const textFieldStyles = {
    fieldGroup: { width: "100%" },
    field: {
      color: "#000",
      "::placeholder": {
        color: "lightgrey",
        opacity: 1
      }
    }
  };

  return (
    <div className="above-form-container">
      <div className="d-flex justify-content-end gap-3 mt-2">
        <PrimaryButton text={t("Save")} className="borderbtnbgblue" onClick={handleSave} />
        <PrimaryButton text={t("SaveAndAdd")} className="borderbtnbgblue" onClick={handleSave} />
      </div>

      <div className="row mt-1">
        <div className="col-sm-12 text-end required">
          <label className="IM_label">{t("Mandatory")}</label>
        </div>
      </div>

      <div className="row">
        <Stack tokens={{ childrenGap: 15 }} wrap>
          <Stack horizontal tokens={{ childrenGap: 15 }} wrap>
            <Stack.Item grow>
              <Label htmlFor="CurrencyCode" className="form-label">
                {t("CurrencyCode")}
              </Label>
              <TextField
                id="CurrencyCode"
                value={formValues.CurrencyCode}
                onChange={handleInputChange}
                placeholder="INR"
                errorMessage={errors.CurrencyCode}
                styles={textFieldStyles}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Label htmlFor="CurrencyName" className="form-label">
                {t("CurrencyName")}
              </Label>
              <TextField
                id="CurrencyName"
                value={formValues.CurrencyName}
                onChange={handleInputChange}
                placeholder="Indian Rupee"
                errorMessage={errors.CurrencyName}
                styles={textFieldStyles}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Label htmlFor="ConversionRate" className="form-label">
                {t("ConversionRate")}
              </Label>
              <TextField
                id="ConversionRate"
                value={formValues.ConversionRate}
                onChange={handleInputChange}
                placeholder="e.g., 74.85"
                errorMessage={errors.ConversionRate}
                styles={textFieldStyles}
              />
            </Stack.Item>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 15 }} wrap>
            <Stack.Item grow>
              <Label htmlFor="Major" className="form-label">
                {t("Major")}
              </Label>
              <TextField
                id="Major"
                value={formValues.Major}
                onChange={handleInputChange}
                placeholder="1"
                errorMessage={errors.Major}
                styles={textFieldStyles}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Label htmlFor="Minor" className="form-label">
                {t("Minor")}
              </Label>
              <TextField
                id="Minor"
                value={formValues.Minor}
                onChange={handleInputChange}
                placeholder="5"
                errorMessage={errors.Minor}
                styles={textFieldStyles}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Label htmlFor="CurrencySymbol" className="form-label">
                {t("CurrencySymbol")}
              </Label>
              <Dropdown
                id="CurrencySymbol"
                selectedKey={formValues.CurrencySymbol}
                onChange={handleDropdownChange}
                placeholder={t("SelectSymbol")}
                options={currencySymbolOptions}
                errorMessage={errors.CurrencySymbol}
              />
            </Stack.Item>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default DetailsCurrency;
