import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Items from './pages/Items';
import Users from './pages/Users';
import Orders from './pages/Orders';

import './styles/App.css';

function App() {
    return (
        <BrowserRouter>
            <div style={{ padding: '2rem' }}>
                <nav style={{ marginBottom: '1rem' }}>
                    <a href="/" style={{ marginRight: '1rem' }}>Home</a>
                    <a href="/items" style={{ marginRight: '1rem' }}>Items</a>
                    <a href="/users" style={{ marginRight: '1rem' }}>Users</a>
                    <a href="/orders" style={{ marginRight: '1rem' }}>Orders</a>
                </nav>
            </div>
            <Routes>
                <Route path="/items" element={<Items />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;