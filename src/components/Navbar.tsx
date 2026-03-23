// fixed it 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  LogOut,
  Home,
  GraduationCap,
  Trophy,
  Award,
  Gift,
  LayoutDashboard,
  Gamepad,
  Leaf,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import ReferAndEarn from "./ReferAndEarn";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

const Navbar = ({ onNavigate }: NavbarProps) => {
  const [showReferModal, setShowReferModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { user, userData, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    {
      path: user
        ? userData?.role === "municipal-employee"
          ? "/dashboard/enduser"
          : "/dashboard/corporate"
        : "/signup",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { path: "/play", label: "Play", icon: Gamepad },
    { path: "/learning", label: "Learn", icon: GraduationCap },
    { path: "/earn", label: "Earn", icon: Trophy },
    { path: "/resolve", label: "Resolve", icon: Leaf },
  ];

  return (
    <>
      <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => handleNavigation("/")}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-green-600 to-emerald-400 flex items-center justify-center shadow-md"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <Leaf className="w-5 h-5 text-white" />
                </motion.div>
              </motion.div>
              <motion.span
                className="font-extrabold text-xl bg-gradient-to-r from-green-700 to-emerald-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                SwachhBuddy
              </motion.span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(path)}
                  className={`flex items-center gap-2 ${
                    location.pathname === path ? "text-primary font-semibold" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <motion.button
                whileTap={{ rotate: 90, scale: 0.9 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-accent"
              >
                {darkMode ? (
                  <Moon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Sun className="h-5 w-5 text-orange-500" />
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded hover:bg-accent z-50"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen
                  ? <X className="h-6 w-6" />
                  : <Menu className="h-6 w-6" />}
              </button>

              {/* Desktop User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 px-2 flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userData?.displayName?.charAt(0)?.toUpperCase() ||
                            user.email?.charAt(0)?.toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {userData?.displayName || user.displayName || "User"}
                        </span>
                        <Badge variant="secondary" className="text-xs h-4">
                          {userData?.role === "municipal-employee" ? "Employee" : "Citizen"}
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">
                        {userData?.displayName || user.displayName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {userData?.role === "municipal-employee" ? "Employee" : "Citizen"}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                      <User className="mr-2 h-4 w-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/certifications")}>
                      <Award className="mr-2 h-4 w-4" /> Certifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/rewards")}>
                      <Trophy className="mr-2 h-4 w-4" /> Rewards
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowReferModal(true)}>
                      <Gift className="mr-2 h-4 w-4" /> Refer & Earn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation("/login")}>
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => handleNavigation("/signup")}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer — FIXED: backdrop + proper positioning */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark backdrop — closes drawer when tapped */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              className="fixed top-0 right-0 w-72 h-full bg-background shadow-2xl z-50 flex flex-col md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg text-primary">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-accent">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User info in drawer if logged in */}
              {user && (
                <div className="px-4 py-3 border-b bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {userData?.displayName?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        {userData?.displayName || user.displayName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="text-xs mt-0.5">
                        {userData?.role === "municipal-employee" ? "Employee" : "Citizen"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Button
                    key={label}
                    variant={location.pathname === path ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(path)}
                    className="w-full flex items-center gap-3 justify-start h-11 text-base"
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </Button>
                ))}

                {/* Extra links for logged in users */}
                {user && (
                  <>
                    <div className="border-t my-3" />
                    <Button variant="ghost" size="sm" onClick={() => handleNavigation("/profile")}
                      className="w-full flex items-center gap-3 justify-start h-11">
                      <User className="h-5 w-5" /> Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleNavigation("/rewards")}
                      className="w-full flex items-center gap-3 justify-start h-11">
                      <Trophy className="h-5 w-5" /> Rewards
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleNavigation("/settings")}
                      className="w-full flex items-center gap-3 justify-start h-11">
                      <Settings className="h-5 w-5" /> Settings
                    </Button>
                  </>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t space-y-2">
                {user ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 h-11"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigation("/login")}
                      className="w-full h-11 text-base"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleNavigation("/signup")}
                      className="w-full h-11 text-base bg-primary hover:bg-primary/90"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ReferAndEarn
        isOpen={showReferModal}
        onClose={() => setShowReferModal(false)}
      />
    </>
  );
};

export default Navbar;
