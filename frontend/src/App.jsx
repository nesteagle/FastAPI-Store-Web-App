import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Items from './pages/Items';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Catalog from './pages/Catalog';
import Callback from './pages/Callback';
import AccountPage from './pages/Account.jsx';
import ProductPage from './pages/Product.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import './index.css';
import CheckoutPage from './pages/Checkout.jsx';
import HomePage from './pages/Home.jsx';
import { useInitTheme } from './hooks/useInitTheme.js';

function App() {
    useInitTheme();
    return (
        <BrowserRouter>
            <CartProvider>
                <NotificationProvider>
                    <Header />
                    <Routes>
                        <Route path="/callback" element={<Callback />} />
                        <Route path="/items" element={<Items />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/account" element = {<AccountPage/>}/>
                        <Route path="/users" element={<Users />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/products/:id" element={<ProductPage />} />
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/checkout" element={<CheckoutPage/>}/>
                    </Routes>
                </NotificationProvider>
            </CartProvider>
            <Footer />
        </BrowserRouter>
    );
}

export default App;