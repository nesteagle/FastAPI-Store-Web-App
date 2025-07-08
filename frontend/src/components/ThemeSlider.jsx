import { useInitTheme } from "../hooks/useInitTheme";

export default function ThemeSlider() {
    const { theme, toggleTheme } = useInitTheme();

    return (
        <button
            type="button"
            aria-label={`Activate ${theme === "dark" ? "light" : "dark"} mode`}
            aria-pressed={theme === "dark"}
            onClick={toggleTheme}
            className="
        relative inline-flex h-9 w-18 items-center rounded-full
        bg-bg-tertiary dark:bg-bg-secondary
        transition-colors duration-200 outline-none ring-2 ring-ring-accent
        shadow-sm
        group
        select-none
        touch-manipulation
        hover:scale-minimal cursor-pointer
      "
            style={{ minWidth: 44, minHeight: 24 }}
        >
            <span
                className={`
          absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none
          transition-opacity duration-200 text-text-white
          ${theme === "dark" ? "opacity-60" : "opacity-100"}
        `}
            >
                Off
            </span>
            <span
                className={`
          absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none
          transition-opacity duration-200
          ${theme === "dark" ? "opacity-100" : "opacity-60"}
        `}
            >
                On
            </span>
            <span
                className={`
          absolute top-1 left-1 h-7 w-7 rounded-full
          bg-button
          shadow transition-transform duration-200
          ${theme === "dark" ? "translate-x-9" : "translate-x-0"}
        `}
                style={{ boxShadow: "var(--shadow)" }}
            />
        </button>
    );
}
