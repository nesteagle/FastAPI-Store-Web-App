import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingIcon from "./LoadingIcon";
import Button from "./Button";
import Menu from "./Menu";

export function AuthControls() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <LoadingIcon />;
    }
    return (
        <div className="flex items-center">
            {isAuthenticated ? <ProfileMenu /> : <LoginButton />}
        </div>
    );
}

export function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button variant="primary" onClick={() => loginWithRedirect()}>
            Sign In
        </Button>
    );
}

export function LogoutButton() {
    const { logout } = useAuth0();
    return (
        <Button
            variant="warning"
            onClick={() => {
                localStorage.clear();
                logout({ logoutParams: { returnTo: window.location.origin } });
            }}
            className="w-full justify-start">
            Log Out
        </Button>
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
            <Button
                variant="header"
                size="header"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
            >
                <img
                    src={user.picture}
                    alt={user.name}
                    className="rounded-full"
                />
            </Button>

            {open && (
                <Menu className="w-72 max-w-[85vw]">
                    <div className="flex items-center gap-3 px-2 mb-2">
                        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="font-semibold text-text-primary truncate">{user.name}</div>
                            <div className="text-xs text-text-muted truncate max-w-[140px]">{user.email}</div>
                        </div>
                    </div>
                    <div className="pt-1 flex flex-col w-full space-y-1">
                        <Link
                            to="/account"
                            className="w-full px-5 py-2 rounded text-text-primary hover:bg-bg-tertiary transition font-medium"
                            onClick={() => setOpen(false)}
                        >
                            Order History
                        </Link>
                        <LogoutButton />
                    </div>
                </Menu>
            )}
        </div>
    );
}