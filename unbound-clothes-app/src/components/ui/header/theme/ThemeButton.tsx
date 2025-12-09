import useTheme from "../../../../hooks/useTheme";
// import Styles from "./ThemeButton.module.css";
import { LightMode, DarkMode } from "@mui/icons-material";
import Styles from "./ThemeButton.module.css";

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={Styles.themeButton}
      title="Toggle Theme"
    >
      {theme === "light" ? <DarkMode className={Styles.themeButton_icon} /> : <LightMode className={Styles.themeButton_icon} />}
    </button>
  );
}

export default ThemeButton
