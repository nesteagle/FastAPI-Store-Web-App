import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthControls } from './AuthControls';
import ShoppingCartButton from './ShoppingCartButton';
import Button from './Button';
import Icon from './Icon';
import Container from './Container';

export default function StoreHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { to: "/", text: "Home" },
        { to: "/catalog", text: "Catalog" },
        { to: "/account", text: "Orders" }
    ];

    return (
        <header className="bg-bg-secondary shadow-md border-b border-border-muted sticky top-0 z-20 transition-colors duration-200">
            <Container className="flex items-center justify-between py-3 sm:py-4">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center group">
                        <span className="inline-block bg-button/10 rounded-full p-2 mr-2">
                            <Icon name="check" size={8} className="text-text-accent hover:scale-icon-small transition-transform" />
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
                    <Button variant="secondary" size="xs" onClick={() => setMenuOpen((v) => !v)} className="md:hidden">
                        <Icon name="mobile" />
                    </Button>
                </div>
            </Container>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-bg-secondary border-t border-border-muted shadow-lg absolute w-full left-0 top-full z-30 animate-fade-in">
                    <nav className="flex flex-col gap-2 px-4 py-3">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-base font-medium p-2 rounded hover:bg-bg-tertiary transition"
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
