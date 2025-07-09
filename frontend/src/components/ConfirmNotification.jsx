import Button from "./Button";

export default function ConfirmNotification({ open, title, message, confirmLabel = "Confirm", onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-bg-secondary rounded-xl shadow-xl p-8 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4 text-text-primary">{title}</h2>
                <p className="text-text-muted mb-8">{message}</p>
                <div className="flex justify-end gap-4">
                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}