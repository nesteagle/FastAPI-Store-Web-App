import { useApi } from "../hooks/useApi";
import { useEffect, useState, useMemo } from "react";
import ObjectTable from "../components/ObjectViewTable";
import ItemCreationForm from "../components/ItemCreationForm";
import { useAuth0 } from "@auth0/auth0-react";

export default function Items() {
    const { callApi } = useApi();
    const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0();
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    const columns = useMemo(() => [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "price", label: "Price" },
        { key: "image_src", label: "Image SRC" },
    ], []);

    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            // Wait 2s before showing login prompt
            const timer = setTimeout(() => setShowLogin(true), 2000);
            return () => clearTimeout(timer);
        }
        setShowLogin(false);
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        callApi("/items/")
            .then(response => setItems(response.items))
            .catch(setError)
            .finally(() => setIsLoading(false));
    }, [callApi, isAuthenticated]);

    if (isLoading || authLoading) return <div>Loading...</div>;

    if (!isAuthenticated && showLogin) {
        return (
            <div>
                <p>You must be logged in to view items.</p>
                <button onClick={loginWithRedirect}>Log In</button>
            </div>
        );
    }

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h2>Items</h2>
            <ObjectTable data={items} columns={columns} />
            <h3>Create New Item</h3>
            <ItemCreationForm />
        </div>
    );
}