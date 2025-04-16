import { Asleep, Awake, Screen } from "@carbon/icons-react";
import { THEME } from "./constants";

export async function updateThemeCookie(newTheme) {
  await fetch("/api/theme", {
    method: "POST",
    body: JSON.stringify({ theme: newTheme }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function getThemeCookie() {
  const data = await fetch("/api/theme", {
    headers: { "Content-Type": "application/json" },
  });
  const result = await data.json();

  return result.theme;
}

export const getThemeIcon = (theme, size) => {
  if (theme === THEME.DARK) {
    return <Asleep size={size} />;
  } else if (theme === THEME.LIGHT) {
    return <Awake size={size} />;
  } else if (theme === THEME.SYSTEM) {
    return <Screen size={size} />;
  }
};

export const findInitialIndex = () => {};
