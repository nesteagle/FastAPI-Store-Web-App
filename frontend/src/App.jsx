import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Items from './pages/Items';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Callback from "./pages/Callback";
import Header from './components/Header';
import Footer from './components/Footer';

import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/callback" element={<Callback />} />
                <Route path="/items" element={<Items />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders" element={<Orders />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;