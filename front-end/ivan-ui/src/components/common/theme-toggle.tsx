import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 px-0"
          title="Chuyển đổi giao diện"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Chuyển đổi giao diện</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(
              "Setting theme to light, current theme:",
              theme,
              "resolved:",
              resolvedTheme
            );
            setTheme("light");
          }}
          className="cursor-pointer"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Sáng</span>
          {theme === "light" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(
              "Setting theme to dark, current theme:",
              theme,
              "resolved:",
              resolvedTheme
            );
            setTheme("dark");
          }}
          className="cursor-pointer"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Tối</span>
          {theme === "dark" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(
              "Setting theme to system, current theme:",
              theme,
              "resolved:",
              resolvedTheme
            );
            setTheme("system");
          }}
          className="cursor-pointer"
        >
          <span className="mr-2 h-4 w-4">💻</span>
          <span>Hệ thống</span>
          {theme === "system" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
