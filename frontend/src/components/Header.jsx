import { Link } from 'react-router-dom';
import { AuthControls } from './AuthControls';
import ShoppingCartButton from './ShoppingCartButton';

export default function StoreHeader() {
    return (
        <header className="bg-surface shadow-md border-b border-surface-muted sticky top-0 z-20 transition-colors duration-200">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center group">
                        {/* Logo SVG (flourish) */}
                        <span className="inline-block bg-accent/10 rounded-full p-2 mr-2">
                            <svg className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="font-display text-3xl font-extrabold tracking-tight text-primary group-hover:text-accent transition-colors">
                            FastAPI Store
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex gap-8">
                    <Link to="/items" className="text-lg font-medium text-primary hover:text-accent transition-colors relative after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                        Items (admin)
                    </Link>
                    <Link to="/catalog" className="text-lg font-medium text-primary hover:text-accent transition-colors relative after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                        Catalog
                    </Link>
                    <Link to="/orders" className="text-lg font-medium text-primary hover:text-accent transition-colors relative after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                        Orders (admin)
                    </Link>
                    <Link to="/users" className="text-lg font-medium text-primary hover:text-accent transition-colors relative after:block after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full">
                        Users (admin)
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ShoppingCartButton />
                    <AuthControls />
                </div>
            </div>
        </header>
    );
}