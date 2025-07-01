import { useAuth0 } from "@auth0/auth0-react";

export function AuthControls() {
  const { isAuthenticated } = useAuth0();
  
  return (
    <div className="auth-controls">
      {isAuthenticated ? (
        <>
          <Profile />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}

export function LoginButton() {
    const { loginWithRedirect } = useAuth0();

    return (<button onClick={() => { loginWithRedirect() }}>Log In</button>);
}

export function LogoutButton() {
    const { logout } = useAuth0();
    return (
        <button onClick={() => { logout({ logoutParams: { returnTo: window.location.origin } }) }}>Log Out</button>
    );
}

export function Profile() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (<div>Loading...</div>);
    }

    return (
        isAuthenticated && (
            <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        )
    )
}