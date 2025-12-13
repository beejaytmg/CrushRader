import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Compass, Users, Settings, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/discover", label: "Discover", icon: Compass },
    { path: "/matches", label: "Matches", icon: Heart },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="relative">
              <Heart className="w-7 h-7 text-primary fill-primary" />
              <div className="absolute inset-0 w-7 h-7 bg-primary/30 blur-md" />
            </div>
            <span className="text-lg font-bold">CrushRadar</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={isActive(item.path) ? "text-primary" : ""}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">3 hints left</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-primary">U</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`justify-start ${isActive(item.path) ? "text-primary" : ""}`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
