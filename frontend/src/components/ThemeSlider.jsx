import { useInitTheme } from "../hooks/useInitTheme";

export default function ThemeSlider() {
    const {theme, toggleTheme} = useInitTheme();

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
        hover:scale-minimal
      "
            style={{ minWidth: 44, minHeight: 32 }}
        >
            <span
                className={`
          absolute left-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none
          transition-opacity duration-200
          ${theme === "dark" ? "opacity-60" : "opacity-100"}
        `}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                    className="block"
                >
                    <circle
                        cx="11"
                        cy="11"
                        r="5"
                        fill="white"
                        className="transition-colors"
                    />
                    <g stroke="white" strokeWidth="1.3">
                        <line x1="11" y1="2" x2="11" y2="5" />
                        <line x1="11" y1="17" x2="11" y2="20" />
                        <line x1="2" y1="11" x2="5" y2="11" />
                        <line x1="17" y1="11" x2="20" y2="11" />
                        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                        <line x1="15.66" y1="15.66" x2="17.78" y2="17.78" />
                        <line x1="4.22" y1="17.78" x2="6.34" y2="15.66" />
                        <line x1="15.66" y1="6.34" x2="17.78" y2="4.22" />
                    </g>
                </svg>
            </span>
            <span
                className={`
          absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none
          transition-opacity duration-200
          ${theme === "dark" ? "opacity-100" : "opacity-60"}
        `}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 22 22"
                    fill="none"
                    aria-hidden="true"
                    className="block"
                >
                    <path
                        d="M16.5 11.5A6.5 6.5 0 0 1 10.5 4a.5.5 0 0 0-.5-.5A7.5 7.5 0 1 0 17 12a.5.5 0 0 0-.5-.5Z"
                        fill="var(--color-accent)"
                        className="transition-colors"
                    />
                </svg>
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
