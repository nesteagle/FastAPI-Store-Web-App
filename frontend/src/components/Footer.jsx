import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-bg-secondary text-text-muted border-t border-border-muted py-6 px-4 transition-colors duration-200 relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-button/10">
                        <svg className="w-5 h-5 text-text-accent" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <span className="font-display text-lg font-bold text-text-primary tracking-tight">nesteagle</span>
                </div>
                <div className="text-sm text-text-muted">
                    © {new Date().getFullYear()} <Link to="https://github.com/nesteagle" className="link-primary">nesteagle</Link>. All rights reserved.
                </div>
            </div>
            <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-accent/30 via-accent/0 to-accent/30 pointer-events-none" />
        </footer>
    );
}