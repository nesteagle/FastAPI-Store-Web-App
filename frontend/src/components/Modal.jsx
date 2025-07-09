export default function Modal({ isOpen, onClose, title, children, className = "" }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className={`bg-bg-secondary rounded-xl shadow-xl p-8 max-w-md w-full ${className}`}>
                {title && (
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="text-text-muted hover:text-text-primary"
                        >
                            <Icon name="close" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}