import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Bell, Globe, User, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [language, setLanguage] = useState("en");

  // Sync with existing dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
    }
  }, []);

  const handleDarkModeToggle = (val: boolean) => {
    setDarkMode(val);
    if (val) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const settingCards = [
    {
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      title: "Theme",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Eco Light Mode</p>
              <p className="text-xs text-muted-foreground">Easy on the eyes</p>
            </div>
            <Badge variant="secondary" className="text-xs">Recommended</Badge>
          </div>
        </div>
      ),
    },
    {
      icon: <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />,
      title: "Notifications",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email Alerts</p>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">In-app notifications</p>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </div>
      ),
    },
    {
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      title: "Language",
      content: (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground mb-2">Select your preferred language:</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border border-border rounded-md p-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="mr">मराठी</option>
            <option value="gu">ગુજરાતી</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      ),
    },
    {
      icon: <User className="h-5 w-5 text-purple-500" />,
      title: "Account",
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">Update your password</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs h-8">Update</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground text-red-500">This cannot be undone</p>
            </div>
            <Button variant="destructive" size="sm" className="text-xs h-8">Delete</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <Button
          variant="ghost" size="sm"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {/* Header — FIXED: theme-aware text */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
          Customize your preferences to make your experience more eco-friendly and sustainable.
        </p>

        {/* Settings Cards — FIXED: bg-card instead of hardcoded bg-green-100 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {settingCards.map((card, i) => (
            <Card key={i} className="bg-card border border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg text-foreground">
                  {card.icon}
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {card.content}
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Settings;
