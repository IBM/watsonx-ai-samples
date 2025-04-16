import cx from "classnames";
import { useAppContext } from "@/contexts/app-context";
import { getThemeIcon } from "@/utils/theme-util";

const ThemeButton = ({ value, onClick, isExpanded }) => {
  const { theme } = useAppContext();
  const themeIcon = getThemeIcon(value, 18);

  return (
    <button
      type="button"
      value={value}
      tabIndex={isExpanded ? "0" : "-1"}
      className={cx("theme-toggle__btn", {
        "theme-toggle__btn--selected": value === theme,
      })}
      onClick={onClick}
      aria-label={`Theme button ${value}`}
    >
      {themeIcon}
    </button>
  );
};

export default ThemeButton;
