export default function ConfirmNotification({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-surface rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="text-text-muted mb-8">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-5 py-2 rounded bg-surface-muted text-primary font-semibold hover:bg-surface transition"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-5 py-2 rounded bg-error text-white font-semibold hover:bg-error-deep transition"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}