import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  CreditCard,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      current: location.pathname === "/reports",
    },
    {
      name: "Upload Data",
      href: "/upload",
      icon: Upload,
      current: location.pathname === "/upload",
    },
  ];

  const bottomNavigation = [
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: location.pathname === "/settings",
    },
    {
      name: "Help",
      href: "/help",
      icon: HelpCircle,
      current: location.pathname === "/help",
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-mono text-sm font-bold text-primary-foreground">
              F
            </span>
          </div>
          <span className="text-lg font-semibold">FINCA.AI</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                item.current
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  item.current
                    ? "text-accent-foreground"
                    : "text-muted-foreground group-hover:text-accent-foreground"
                )}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-5 w-5 rounded-full p-0 text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <span className="text-sm font-medium text-accent-foreground">
              JD
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;