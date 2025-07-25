import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Button variant="outline" asChild className="mb-4">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Call
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure API keys and other settings for the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input id="openai-key" type="password" placeholder="sk-..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fireworks-key">Fireworks.ai API Key</Label>
            <Input id="fireworks-key" type="password" placeholder="fw-..." />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">
                Dark Mode
              </Label>
              <CardDescription>
                Toggle between light and dark themes.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
              <Moon className="h-5 w-5" />
            </div>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;