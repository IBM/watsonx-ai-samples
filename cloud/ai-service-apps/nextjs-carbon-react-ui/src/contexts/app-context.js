import { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { getThemeCookie, updateThemeCookie } from "@/utils/theme-util";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
  const [appContext, setAppContext] = useState({
    isThemeLoaded: false,
    userData: {},
  });

  useEffect(() => {
    async function fetchTheme() {
      const theme = await getThemeCookie();
      setAppContext((prevState) => ({ ...prevState, theme }));
    }
    async function fetchSettings() {
      const settings = await _getSettings();
      setAppContext((prevState) => ({ ...prevState, userData: settings }));
    }

    fetchSettings();
    fetchTheme();
    setAppContext((prevState) => ({
      ...prevState,
      isThemeLoaded: true,
    }));
  }, []);

  const updateTheme = useCallback((theme) => {
    updateThemeCookie(theme);
    setAppContext((prevState) => ({ ...prevState, theme }));
    document.body.dataset.theme = theme;
  }, []);

  const context = useMemo(
    () => ({
      ...appContext,
      updateTheme: (theme) => updateTheme(theme),
    }),
    [appContext, updateTheme]
  );

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};

async function _getSettings() {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    const { error } = await response.json();
    console.error(`Error while fetching settings: ${error}`);
    return {};
  }
  return await response.json();
}

export { AppProvider };
