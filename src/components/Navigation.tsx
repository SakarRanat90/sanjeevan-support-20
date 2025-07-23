import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const protectedNavItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
    { name: "Vitals", href: "/vitals" },
    { name: "Medications", href: "/medications" },
  ];

  const navItems = user ? [...publicNavItems, ...protectedNavItems] : publicNavItems;

  const isActive = (href: string) => location.pathname === href;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-primary p-2 rounded-lg shadow-soft group-hover:shadow-glow transition-smooth">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sanjeevan Support</h1>
              <p className="text-xs text-muted-foreground">Smart Health, Timely Care</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10 shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">Start Monitoring</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border shadow-soft">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10 shadow-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                {user ? (
                  <>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="destructive" size="lg" className="w-full" onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      Start Monitoring
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};