import { createContext, useState } from "react";
import merge from "lodash/merge";
// CUSTOM COMPONENT
import { WhizLayoutSettings } from "app/components/WhizLayout/settings";

export const SettingsContext = createContext({
  settings: WhizLayoutSettings,
  updateSettings: () => {}
});

export default function SettingsProvider({ settings, children }) {
  const [currentSettings, setCurrentSettings] = useState(settings || WhizLayoutSettings);

  const handleUpdateSettings = (update = {}) => {
    const marged = merge({}, currentSettings, update);
    setCurrentSettings(marged);
  };

  return (
    <SettingsContext.Provider
      value={{ settings: currentSettings, updateSettings: handleUpdateSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
