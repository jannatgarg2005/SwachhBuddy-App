import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Mail, Phone, MapPin, Calendar,
  Edit, Save, Trophy, Award, Target, TrendingUp, CheckCircle, Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface UserProfileProps {
  userData?: any;
  onBack?: () => void;
}

const UserProfile = ({ onBack }: UserProfileProps) => {
  const { user, userData, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "+91 98765 43210",
    address: "123 Green Street, Eco City, State 560001",
    bio: "Passionate about creating a cleaner, greener India through proper waste management.",
    occupation: "Environmental Enthusiast",
    joinDate: "2024-01-15",
  });

  // ✅ KEY FIX: update profileData AFTER Firebase finishes loading
  useEffect(() => {
    if (!loading && user) {
      const realName =
        userData?.displayName ||
        user.displayName ||
        (user.email ? user.email.split("@")[0] : "") ||
        "";

      const realEmail = user.email || "";

      const realJoinDate = user.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toISOString().split("T")[0]
        : "2024-01-15";

      const realOccupation =
        userData?.role === "municipal-employee"
          ? "Municipal Waste Officer"
          : "Environmental Enthusiast";

      setProfileData(prev => ({
        ...prev,
        name: realName,
        email: realEmail,
        joinDate: realJoinDate,
        occupation: realOccupation,
      }));
    }
  }, [loading, user, userData]);

  const isEmployee = userData?.role === "municipal-employee";

  const initials = profileData.name
    ? profileData.name.charAt(0).toUpperCase()
    : profileData.email
    ? profileData.email.charAt(0).toUpperCase()
    : "U";

  const handleSave = () => {
    setIsEditing(false);
    toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
  };

  const stats = [
    { label: "Total Points", value: "1,250", icon: <Trophy className="h-5 w-5" />, color: "text-yellow-500" },
    { label: "Current Streak", value: "7 days", icon: <Target className="h-5 w-5" />, color: "text-green-500" },
    { label: "Achievements", value: "12", icon: <Award className="h-5 w-5" />, color: "text-blue-500" },
    { label: "Rank", value: "#4", icon: <TrendingUp className="h-5 w-5" />, color: "text-purple-500" },
  ];

  const recentAchievements = [
    { title: "First Steps", description: "Completed mandatory training", date: "2024-01-15", icon: <CheckCircle className="h-5 w-5" /> },
    { title: "Week Warrior", description: "Maintained 7-day streak", date: "2024-01-22", icon: <Target className="h-5 w-5" /> },
    { title: "QR Scanner", description: "Scanned 25 QR codes", date: "2024-01-28", icon: <Trophy className="h-5 w-5" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">User Profile</h1>
          <Button
            variant="outline" size="sm"
            onClick={onBack || (() => navigate(-1))}
            className="flex items-center gap-1.5 text-xs md:text-sm"
          >
            <Home className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-4 md:space-y-6">
          <TabsList className="bg-muted w-full grid grid-cols-3">
            <TabsTrigger value="profile" className="text-xs md:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs md:text-sm">Statistics</TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs md:text-sm">Achievements</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile" className="space-y-4 md:space-y-6">
            <Card className="border-2">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <Avatar className="h-14 w-14 md:h-20 md:w-20 border-4 border-primary flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl md:text-2xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <CardTitle className="text-lg md:text-2xl text-foreground truncate">
                        {/* ✅ Shows real name, falls back gracefully */}
                        {profileData.name || user?.email?.split("@")[0] || "User"}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge variant={isEmployee ? "default" : "secondary"} className="text-xs">
                          {isEmployee ? "Municipal Employee" : "Eco Citizen"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Member since {new Date(profileData.joinDate).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className="flex-shrink-0 w-full sm:w-auto"
                  >
                    {isEditing
                      ? <><Save className="mr-2 h-4 w-4" />Save Changes</>
                      : <><Edit className="mr-2 h-4 w-4" />Edit Profile</>}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 md:space-y-6 pt-4 md:pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        placeholder={user?.email?.split("@")[0] || "Your name"}
                        className="pl-10 bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="your@email.com"
                        className="pl-10 bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10 bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-foreground">Occupation</Label>
                    <Input
                      value={profileData.occupation}
                      onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-10 bg-background text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">Bio</Label>
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={3}
                    className="bg-background text-foreground"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* STATS TAB */}
          <TabsContent value="stats" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 md:p-6 text-center">
                    <div className={`mx-auto mb-2 md:mb-3 p-2 md:p-3 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-muted ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="text-xl md:text-2xl font-bold mb-1 text-foreground">{stat.value}</div>
                    <div className="text-xs md:text-sm font-medium text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-base md:text-lg text-foreground">Activity Overview</CardTitle>
                <CardDescription className="text-xs md:text-sm">Your waste management contribution</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {[
                    { label: "QR Codes Scanned", value: "25 this month" },
                    { label: "Training Modules Completed", value: "8 total" },
                    { label: "Community Events Joined", value: "3 this quarter" },
                    { label: "Reports Submitted", value: "12 total" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-muted/30 gap-2">
                      <span className="font-medium text-foreground text-xs md:text-sm">{item.label}</span>
                      <Badge variant="secondary" className="font-semibold text-xs flex-shrink-0">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACHIEVEMENTS TAB */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg text-foreground">Recent Achievements</CardTitle>
                <CardDescription className="text-xs md:text-sm">Your latest accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="p-2 bg-green-500/20 text-green-500 rounded-full flex-shrink-0">
                        {achievement.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm md:text-base text-foreground">{achievement.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
