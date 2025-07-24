import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { TooltipWrapper } from "@/components/common/TooltipWrapper";
import { ThemeToggle } from "./theme-toggle";
import {
  Users,
  Building2,
  Calendar,
  Handshake,
  LayoutDashboard,
  User,
  Settings,
  Shield,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                IVAN
              </span>
            </Link>
          </div>

          {/* Enhanced Navigation Menu */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Direct navigation items */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/volunteers"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Tình nguyện viên
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/organizations"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Tổ chức
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/partners"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Handshake className="w-4 h-4 mr-2" />
                      Đối tác
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Events Menu */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/events"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Sự kiện
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Dashboard Menu (for authenticated users) */}
                {isAuthenticated && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/dashboard"
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side - Auth and User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <NotificationBell />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.profile?.avatarUrl}
                          alt={user?.fullName || ""}
                        />
                        <AvatarFallback>
                          {user?.fullName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.fullName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Theme Toggle */}
                <ThemeToggle />

                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Đăng nhập</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <TooltipWrapper content="Menu điều hướng">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipWrapper>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
