import { useState } from "react";
import { THEME } from "@/utils/constants";
import { useAppContext } from "@/contexts/app-context";
import ThemeButton from "./ThemeButton";
import "./theme-toggle.scss";

const THEME_BTN_SIZE = 31;
const THEME_BTNS = Object.values(THEME);

const ThemeToggle = ({ isExpanded }) => {
  const { updateTheme, theme } = useAppContext();
  const [selectedIndex, setSelectedIndex] = useState(THEME_BTNS.indexOf(theme));

  const handleClick = ({ currentTarget }, index) => {
    setSelectedIndex(index);
    updateTheme(currentTarget.value);
  };

  return (
    <div className="theme-toggle">
      <div
        className="theme-toggle__indicator"
        style={{ transform: `translateX(${selectedIndex * THEME_BTN_SIZE}px)` }}
      />
      {THEME_BTNS.map((value, index) => (
        <ThemeButton
          key={`theme-btn-${value}`}
          value={value}
          isExpanded={isExpanded}
          onClick={(event) => handleClick(event, index)}
        />
      ))}
    </div>
  );
};

export default ThemeToggle;
