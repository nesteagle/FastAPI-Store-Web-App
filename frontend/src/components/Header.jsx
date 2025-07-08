import { Link } from 'react-router-dom';
import { AuthControls } from './AuthControls';
import ShoppingCartButton from './ShoppingCartButton';

export default function StoreHeader() {
    const links = [
        { to: "/", text: "Home" },
        { to: "/catalog", text: "Catalog" },
        { to: "/about", text: "About" }
    ]; // rendered left to right based on index

    return (
        <header className="bg-bg-secondary shadow-md border-b border-border-muted sticky top-0 z-20 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center group">
                        {/* Logo SVG */}
                        <span className="inline-block bg-button/10 rounded-full p-2 mr-2">
                            <svg className="w-8 h-8 text-text-accent group-hover:scale-icon-small transition-transform" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="font-display text-3xl font-extrabold tracking-tight text-text-primary group-hover:text-text-accent transition-colors">
                            FastAPI Store
                        </span>
                    </Link>
                </div>

                <nav className="flex gap-8">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} className="text-lg font-medium link-underline-transition">
                            {link.text}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <ShoppingCartButton />
                    <AuthControls />
                </div>
            </div>
        </header>
    );
}