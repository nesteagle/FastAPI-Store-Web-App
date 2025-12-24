export default function Button({ variant = "primary", size = "md", children, className = "", ...props }) {
    const baseClasses = "items-center justify-center font-semibold rounded transition focus:outline-none focus:ring-2 focus:ring-ring-accent/50 cursor-pointer";
    
    const variants = {
        primary: "inline-flex bg-button text-text-white hover:bg-button-hover btn-transition",
        secondary: "inline-flex gray-btn-transition",
        catalog_disabled: "inline-flex bg-bg-tertiary text-text-primary hover:bg-button hover:text-text-white transition",
        danger: "inline-flex clear-btn-transition",
        warning: "inline-flex warning-btn-transition",
        link: "inline-flex link-primary",
        header: "relative flex sm:w-12 sm:h-12 h-10 w-10 rounded-full hover:bg-button/10 hover:scale-icon-medium duration-200"
    };
    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2",
        lg: "px-6 py-3",
        xs: "px-2 py-2 text-sm",
        xl: "px-8 py-4 text-lg",
        header:"px-0 py-0"
    };
    
    return (
        <button 
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}