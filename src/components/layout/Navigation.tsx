import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useClerkAuth';
import { 
  Accessibility, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Info, 
  Upload, 
  User 
} from 'lucide-react';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home, ariaLabel: 'Go to dashboard' },
    { path: '/about', label: 'About', icon: Info, ariaLabel: 'Learn about VisionGuide AI' },
    { path: '/upload', label: 'Upload Video', icon: Upload, ariaLabel: 'Upload video for processing' },
    { path: '/profile', label: 'Profile', icon: User, ariaLabel: 'View your profile and history' },
  ];

  const isCurrentPage = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav 
      className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg p-1"
            aria-label="VisionGuide AI - Go to homepage"
            onClick={closeMobileMenu}
          >
            <div className="p-2 bg-primary rounded-lg animate-float">
              <Accessibility className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">VisionGuide AI</h1>
              <p className="text-xs text-muted-foreground">Navigate with Confidence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  isCurrentPage(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                aria-label={item.ariaLabel}
                aria-current={isCurrentPage(item.path) ? 'page' : undefined}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu & Mobile Toggle */}
          <div className="flex items-center space-x-2">
            {/* User Info */}
            <div className="hidden lg:flex items-center space-x-3 text-sm">
              <span className="text-muted-foreground">Welcome,</span>
              <span className="font-medium text-foreground truncate max-w-32">
                {user?.emailAddresses?.[0]?.emailAddress || user?.firstName || 'User'}
              </span>
            </div>

            {/* Sign Out Button */}
            <Button
              onClick={signOut}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center space-x-2"
              aria-label="Sign out of VisionGuide AI"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">Sign Out</span>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden py-4 space-y-2 border-t border-border/50 animate-scale-in"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  isCurrentPage(item.path)
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
                role="menuitem"
                aria-label={item.ariaLabel}
                aria-current={isCurrentPage(item.path) ? 'page' : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Sign Out */}
            <div className="pt-2 border-t border-border/50">
              <div className="px-4 py-2 text-xs text-muted-foreground">
                Signed in as: {user?.emailAddresses?.[0]?.emailAddress || user?.firstName || 'User'}
              </div>
              <Button
                onClick={() => {
                  signOut();
                  closeMobileMenu();
                }}
                variant="outline"
                size="sm"
                className="mx-4 flex items-center space-x-2 w-auto"
                aria-label="Sign out of VisionGuide AI"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;