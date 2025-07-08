import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ThemeSlider from "./ThemeSlider";
import LoadingIcon from "./LoadingIcon";

export function AuthControls() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <LoadingIcon />;
    }
    return (
        <div className="flex items-center gap-4">
            {isAuthenticated ? <ProfileMenu /> : <LoginButton />}
        </div>
    );
}

export function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (
        <button
            className="btn-transition text-text-white font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring-accent/50"
            onClick={() => { loginWithRedirect(); }}
        >
            Log In
        </button>
    );
}

export function LogoutButton() {
    const { logout } = useAuth0();
    return (
        <button
            className="mt-2 w-full text-left px-4 py-2 rounded warning-btn-transition"
            onClick={() => {
                localStorage.clear();
                logout({ logoutParams: { returnTo: window.location.origin } });
            }}
        >
            Log Out
        </button>
    );
}

export function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <LoadingIcon />;
    }

    return (
        isAuthenticated && (
            <div className="flex items-center gap-3 px-2">
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-border-muted shadow-sm"
                />
                <span className="hidden sm:inline text-sm text-text-muted font-medium truncate max-w-[120px]">{user.email}</span>
            </div>
        )
    );
}

export function ProfileMenu() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        function handleClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    if (!isAuthenticated || isLoading) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center gap-2 transition-transform hover:scale-icon-medium cursor-pointer"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
            >
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border border-border-muted shadow-sm transition-transform"
                />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-bg-secondary rounded-xl shadow-lg border border-border-muted p-4 animate-fade-in">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div className="min-w-0">
                            <div className="font-semibold text-text-primary truncate">{user.name}</div>
                            <div className="text-xs text-text-muted truncate max-w-[140px]">{user.email}</div>
                        </div>
                    </div>
                    <div className="pt-1 flex flex-col items-center w-full space-y-1">
                        <div className="flex items-center px-3 py-2 w-full">
                            <span className="text-text-primary font-medium mr-6">
                                Dark Mode
                            </span>
                            <ThemeSlider />
                        </div>
                        <Link
                            to="/account"
                            className="w-full text-left px-3 py-2 rounded text-text-primary hover:bg-bg-tertiary transition font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Order History
                        </Link>
                        <div className="w-full">
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}