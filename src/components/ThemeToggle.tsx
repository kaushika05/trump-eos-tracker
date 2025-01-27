import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        // Force light theme on initial load
        setTheme("light");
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
                id="theme-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
            <Moon className="h-4 w-4" />
            <Label htmlFor="theme-mode" className="sr-only">
                Toggle theme
            </Label>
        </div>
    );
}