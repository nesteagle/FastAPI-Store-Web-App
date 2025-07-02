import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.jsx'
import './index.css';

const DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Auth0Provider
            domain={DOMAIN}
            clientId={CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin + "/callback",
                audience: AUDIENCE,
                scope: "openid profile email"
            }}
        >
            <App />
        </Auth0Provider>
    </StrictMode>,
)
