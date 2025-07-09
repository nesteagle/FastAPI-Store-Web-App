import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthControls } from './AuthControls';
import ShoppingCartButton from './ShoppingCartButton';
import Button from './Button';

export default function StoreHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { to: "/", text: "Home" },
        { to: "/catalog", text: "Catalog" },
        { to: "/about", text: "About" }
    ];

    return (
        <header className="bg-bg-secondary shadow-md border-b border-border-muted sticky top-0 z-20 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center group">
                        <span className="inline-block bg-button/10 rounded-full p-2 mr-2">
                            <svg className="w-8 h-8 text-text-accent group-hover:scale-icon-small transition-transform" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary group-hover:text-text-accent transition-colors">
                            nesteagle's store
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex gap-6">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} className="text-base sm:text-lg font-medium link-underline-transition">
                            {link.text}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3 sm:gap-4">
                    <ShoppingCartButton />
                    <AuthControls />
                    <Button variant="secondary" size="xs" onClick={() => setMenuOpen((v) => !v)} className="md:hidden ml-2 p-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-bg-secondary border-t border-border-muted shadow-lg absolute w-full left-0 top-full z-30 animate-fade-in">
                    <nav className="flex flex-col gap-2 px-4 py-3">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-base font-medium py-2 px-2 rounded hover:bg-bg-tertiary transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.text}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
