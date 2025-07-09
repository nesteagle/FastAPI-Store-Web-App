const icons = {
    cart: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6 m-4.4 7V5",
    lock: "M7 11V7a5 5 0 0110 0v4M3 11h18v10H3z",
    close: "M6 18L18 6M6 6l12 12",
    search: "M11 11L21 21M11 3a8 8 0 000 16 8 8 0 000-16z",
    plus: "M12 4v16m8-8H4",
    check: "M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM8 12l2 2 4-4",
    mobile: "M4 6h16M4 12h16M4 18h16"
};

export default function Icon({ name, size = 6, className = "" }) {
    return (
        <svg 
            className={`w-${size} h-${size} ${className}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
        >
            <path d={icons[name]} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}