import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export function AuthControls() {
    const { isAuthenticated } = useAuth0();

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
            className="bg-accent text-white font-semibold px-4 py-2 rounded shadow hover:bg-accent-hover transition focus:outline-none focus:ring-2 focus:ring-accent/50"
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
            className="mt-2 w-full text-left px-3 py-2 rounded text-error hover:bg-error/10 transition"
            onClick={() => { logout({ logoutParams: { returnTo: window.location.origin } }); }}
        >
            Log Out
        </button>
    );
}

export function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-text-muted animate-pulse">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
                Loading...
            </div>
        );
    }

    return (
        isAuthenticated && (
            <div className="flex items-center gap-3 px-2">
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-surface-muted shadow-sm"
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
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/50"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
            >
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border border-surface-muted shadow-sm"
                />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-lg border border-surface-muted z-50 p-4 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div className="min-w-0">
                            <div className="font-semibold text-primary truncate">{user.name}</div>
                            <div className="text-xs text-text-muted truncate max-w-[140px]">{user.email}</div>
                        </div>
                    </div>
                    <Link
                        to="/settings"
                        className="block w-full text-left px-3 py-2 rounded text-primary hover:bg-surface-muted transition"
                        onClick={() => setOpen(false)}
                    >
                        Account Settings
                    </Link>
                    <div className="mt-2">
                        <LogoutButton />
                    </div>
                </div>
            )}
        </div>
    );
}