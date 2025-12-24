import ThemeSlider from "./ThemeSlider";
import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "./Icon";
import Menu from "./Menu";
import Button from "./Button";

export function SettingsButton() {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef(null);

    const handleClick = useCallback(
        (e) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target)) {
                setOpen(false);
            }
        },
        [setOpen]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener("mousedown", handleClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open, handleClick]);

    return (
        <div className="relative" ref={buttonRef}>
            <Button
                variant="header"
                size="header"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open settings"
            >
                <Icon name="settings" className="text-text-accent" />
            </Button>
            {open && (
                <Menu className="w-64 max-w-[85vw]">
                    <div className="flex flex-col w-full space-y-1">
                        <div className="flex items-center justify-between px-1 py-1">
                            <span className="text-text-primary font-medium">Dark Mode</span>
                            <ThemeSlider />
                        </div>
                    </div>
                </Menu>
            )}
        </div>
    );
}