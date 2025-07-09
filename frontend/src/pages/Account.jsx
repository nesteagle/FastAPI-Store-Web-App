import { useState, useMemo } from "react";
import useFetchList from "../hooks/useFetchList";
import Main from "../components/Main";
import Card from "../components/Card";
import Button from "../components/Button";

export default function AccountPage() {
    const fetchFunction = useMemo(() => ({
        endpoint: "/orders/",
        method: "GET"
    }), []);
    const { data, isDataLoading, error } = useFetchList(fetchFunction, "orders", "orders_cache", 3 * 60 * 1000);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const orders = [...(data || [])].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    function formatDate(dateString) {
        return new Date(dateString.concat("Z")).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        });
    }

    function truncate(str, max = 64) {
        if (!str) return '';
        return str.length > max ? str.slice(0, max - 1) + '…' : str;
    }

    if (!orders?.length) {
        return (
            <Main className="py-16">
                <Card className="max-w-2xl mx-auto px-4 py-5 text-center shadow-lg">
                    <span className="font-display text-2xl mb-2 block text-text-primary">No Orders Yet</span>
                    <p className="text-text-muted">Your orders will appear here after your first purchase.</p>
                </Card>
            </Main>
        );
    }

    return (
        <Main>
            <div className="max-w-3xl mx-auto py-10 px-4">
                <h1 className="font-display text-3xl font-bold mb-8 text-text-primary text-center">Order History</h1>
                <div className="space-y-8">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="group bg-bg-secondary rounded shadow hover:scale-minimal hover:shadow-lg transition-transform duration-200 overflow-hidden"
                            tabIndex={0}
                            aria-label={`Order ${order.id} placed on ${formatDate(order.date)}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-8">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-medium text-text-muted text-sm">
                                            {formatDate(order.date)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="font-display text-lg mb-2 text-text-primary truncate">
                                            Order #{order.id.slice(-6).toUpperCase()}
                                        </h2>
                                        <ul className="space-y-2">
                                            {order.items.map(item => (
                                                <li key={item.id} className="flex items-center gap-4">
                                                    <img
                                                        src={item.image_src}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded object-cover border border-bg-tertiary shadow-sm"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <span className="font-sans font-semibold text-base text-text-primary block truncate">{item.name}</span>
                                                        <span className="text-xs text-text-muted" title={item.description}>{truncate(item.description)}</span>
                                                    </div>
                                                    <span className="text-sm text-text-muted">x{item.quantity}</span>
                                                    <span className="text-base font-medium text-button">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end md:items-center md:justify-center min-w-120px">
                                    <span className="text-button font-bold text-2xl mb-1">
                                        ${order.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
                                    </span>
                                    <Button variant="primary" onClick={() => setSelectedOrder(order)}>
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <Card className="shadow max-w-lg w-full p-8 relative animate-fadeIn">
                            <button
                                className="absolute top-4 right-4 text-text-muted hover:text-button text-2xl focus:outline-none"
                                onClick={() => setSelectedOrder(null)}
                                aria-label="Close order details"
                            >
                                &times;
                            </button>
                            <h2 className="font-display text-2xl font-bold mb-2 text-text-primary text-center">Order Details</h2>
                            <div className="text-center text-text-muted mb-4">
                                Order #{selectedOrder.id.slice(-6).toUpperCase()} &bull; {formatDate(selectedOrder.date)}
                            </div>
                            <ul className="divide-y divide-bg-tertiary mb-4">
                                {selectedOrder.items.map(item => (
                                    <li key={item.id} className="flex items-center gap-4 py-3">
                                        <img
                                            src={item.image_src}
                                            alt={item.name}
                                            className="w-12 h-12 rounded object-cover border border-bg-tertiary shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <span className="font-sans font-semibold text-base text-text-primary block">{item.name}</span>
                                            <span className="text-xs text-text-muted">{item.description}</span>
                                        </div>
                                        <span className="text-sm text-text-muted">x{item.quantity}</span>
                                        <span className="text-base font-medium text-button">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-medium text-text-muted">Total</span>
                                <span className="text-button font-bold text-xl">
                                    ${selectedOrder.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2)}
                                </span>
                            </div>
                            <Button variant="primary" size="lg" onClick={() => setSelectedOrder(null)}>
                                Done
                            </Button>
                        </Card>
                    </div>
                )}
            </div>
        </Main>
    );
}