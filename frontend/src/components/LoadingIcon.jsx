export default function LoadingIcon() {
    return (
        <div className="flex items-center gap-2 text-text-muted animate-pulse">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
            Loading...
        </div>
    );
}