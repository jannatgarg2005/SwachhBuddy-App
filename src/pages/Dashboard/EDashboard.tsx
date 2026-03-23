// src/pages/Dashboard/EDashboard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode, Calendar, GraduationCap, Gamepad2, Users, BarChart3,
  CheckCircle, Clock, MapPin, Download, AlertTriangle,
  ClipboardList, Truck, Package, Bot, Flame, Medal, TrendingUp, ScanLine,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RewardsSystem from "@/components/RewardsSystem";
import { useAuth } from "@/hooks/use-auth";
import WasteTracking from "@/components/WasteTracking";
import EWasteDay from "@/components/EWasteDay";
import WasteChatbot from "@/components/WasteChatbot";
import Activities from "../Activities";
import { usePoints } from "@/contexts/PointsContext";
import { FiHome, FiActivity, FiBook, FiAward, FiMap } from "react-icons/fi";
import { Progress } from "@/components/ui/progress";
import SchedulePickup from "@/components/SchedulePickup";
import CitizenPickupRequests from "@/components/CitizenPickupRequests";
import { EmployeeMapDashboard } from "@/components/EmployeeMapDashboard";
import AIWasteClassifier from "@/components/AIWasteClassifier";
import DashboardHeader from "@/components/DashboardHeader";

const EDashboard: React.FC = () => {
  const { user, userData } = useAuth();
  const { toast }          = useToast();
  const { coins, earn, redeem } = usePoints();

  const [streak, setStreak]             = useState<number>(7);
  const [weeklyGoal]                    = useState<number>(500);
  const [weeklyProgress]                = useState<number>(350);
  const [showRewards, setShowRewards]   = useState(false);
  const [showWasteTracking, setShowWasteTracking]               = useState(false);
  const [showEWasteDay, setShowEWasteDay]                       = useState(false);
  const [showSchedulePickup, setShowSchedulePickup]             = useState(false);
  const [showCitizenPickupRequests, setShowCitizenPickupRequests] = useState(false);
  const [showAIClassifier, setShowAIClassifier]                 = useState(false);
  const [generatedQR, setGeneratedQR]   = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [scansToday, setScansToday]     = useState<number>(3);

  const [pickupRequests, setPickupRequests] = useState([
    { id: "REQ001", citizen: "Aisha Khan",    address: "12/A, Sector 4, Delhi",       type: "Dry Waste",  scheduledTime: "Today, 10:00 AM",   status: "pending" },
    { id: "REQ002", citizen: "Mohan Das",     address: "B-7, Green Park, Delhi",      type: "Wet Waste",  scheduledTime: "Today, 11:30 AM",   status: "pending" },
    { id: "REQ003", citizen: "Sunita Sharma", address: "Plot 5, Rohini Sector 3",     type: "E-Waste",    scheduledTime: "Today, 2:00 PM",    status: "completed" },
    { id: "REQ004", citizen: "Ravi Kumar",    address: "Flat 201, DDA Flats, Dwarka", type: "Hazardous",  scheduledTime: "Tomorrow, 9:00 AM", status: "pending" },
  ]);

  const leaderboardData = [
    { rank: 1, name: "Priya Sharma", points: 2850, district: "Mumbai" },
    { rank: 2, name: "Raj Patel",    points: 2720, district: "Delhi" },
    { rank: 3, name: "Anita Kumar",  points: 2650, district: "Bangalore" },
    { rank: 4, name: user ? (user.displayName || "You") : "You", points: coins, district: "Your District", isUser: true },
  ];

  const handlePointsRedeemedWrapper = (points: number): void => { redeem(points); };

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true);
    try {
      const empId  = userData?.employeeId || user?.uid?.slice(0, 8) || "EMP001";
      const qrData = `SWACHH-EMP-${empId}-${Date.now()}`;
      const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&color=166534&bgcolor=ffffff&data=${encodeURIComponent(qrData)}&format=png&margin=10`;
      setGeneratedQR(qrUrl);
      toast({ title: "QR Code Generated! ✅", description: "Share this with citizens. Each scan gives them +25 pts!" });
    } catch {
      toast({ title: "Error", description: "Could not generate QR. Try again." });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;
    const link = document.createElement("a");
    link.href = generatedQR; link.download = "swachh-buddy-emp-qr.png"; link.target = "_blank";
    link.click();
  };

  const handleCitizenScanned = () => {
    setScansToday(p => p + 1); setStreak(p => p + 1);
    earn(10, { source: "citizen-scan" });
    toast({ title: "Citizen Scanned Your QR! 🎉", description: "Citizen earned +25 pts. Your streak increased! (+10 pts)" });
  };

  const handleCompletePickup = (reqId: string) => {
    setPickupRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "completed" } : r));
    earn(30, { source: "pickup-completed" });
    toast({ title: "Pickup Completed! ✅", description: `Request ${reqId} marked done. +30 pts earned!` });
  };

  const pendingCount = pickupRequests.filter(r => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Upgraded Header ── */}
      <DashboardHeader
        name={user?.displayName || "Employee"}
        subtitle={`Municipal Employee · ID: ${userData?.employeeId || (user?.uid?.slice(0, 10) + "…")}${userData?.department ? ` · Dept: ${userData.department}` : ""}`}
        role="employee"
        levelBadge="Level 1"
        stats={[
          {
            value: coins,
            label: "Points",
            icon: <TrendingUp className="h-3.5 w-3.5 text-white" />,
            highlight: true,
          },
          {
            value: scansToday,
            label: "Scans",
            icon: <ScanLine className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: `🔥 ${streak}`,
            label: "Streak",
            icon: <Flame className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: pendingCount,
            label: "Pending",
            icon: <Package className="h-3.5 w-3.5 text-white" />,
          },
          {
            value: `${Math.round((weeklyProgress / weeklyGoal) * 100)}%`,
            label: "Weekly Goal",
            icon: <Medal className="h-3.5 w-3.5 text-white" />,
          },
        ]}
      />

      {/* ── Tabs ── */}
      <div className="container mx-auto p-3 md:p-5">
        <Tabs defaultValue="overview" className="w-full">

          <TabsList className="grid w-full grid-cols-5 gap-1 md:gap-2 rounded-2xl bg-muted/60 p-1.5 md:p-2 shadow-sm">
            {[
              { value: "overview",    icon: <FiHome className="w-4 h-4 flex-shrink-0" />,    label: "Overview" },
              { value: "map",         icon: <FiMap className="w-4 h-4 flex-shrink-0" />,      label: "Live Map" },
              { value: "activities",  icon: <FiActivity className="w-4 h-4 flex-shrink-0" />, label: "Activities" },
              { value: "learning",    icon: <FiBook className="w-4 h-4 flex-shrink-0" />,     label: "Learning" },
              { value: "leaderboard", icon: <FiAward className="w-4 h-4 flex-shrink-0" />,    label: "Leaderboard" },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}
                className="flex items-center justify-center gap-1 md:gap-2 rounded-xl py-2 px-1 md:px-3 text-xs md:text-sm font-medium transition-all
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent
                  data-[state=active]:text-white data-[state=active]:shadow-md">
                {tab.icon}<span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Quick Actions</h2>
              <div className="flex space-x-3 md:space-x-4 overflow-x-auto py-2 pb-3">
                {[
                  { icon: <QrCode className="h-6 w-6 md:h-7 md:w-7" />,   label: "Generate QR",     desc: isGeneratingQR ? "Generating…" : "Citizens scan to verify", onClick: handleGenerateQR,                              badge: null },
                  { icon: <Package className="h-6 w-6 md:h-7 md:w-7" />, label: "Citizen Pickups", desc: `${pendingCount} pending requests`,                          onClick: () => setShowCitizenPickupRequests(true),       badge: pendingCount > 0 ? pendingCount : null },
                  { icon: <Truck className="h-6 w-6 md:h-7 md:w-7" />,   label: "Track Waste",     desc: "Live vehicles & map",                                        onClick: () => setShowWasteTracking(true),               badge: null },
                  { icon: <Bot className="h-6 w-6 md:h-7 md:w-7" />,     label: "AI Classifier",   desc: "Photo → AI identifies waste",                               onClick: () => setShowAIClassifier(true),                badge: null },
                  { icon: <Calendar className="h-6 w-6 md:h-7 md:w-7" />,label: "E-Waste Day",     desc: "Monthly drive",                                              onClick: () => setShowEWasteDay(true),                   badge: null },
                ].map((action, i) => (
                  <Card key={i} className="cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all flex-shrink-0 w-36 md:w-64 relative" onClick={action.onClick}>
                    {action.badge && (
                      <div className="absolute -top-1.5 -right-1.5 z-10 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                        {action.badge}
                      </div>
                    )}
                    <CardContent className="p-3 md:p-6 flex flex-col items-center text-center space-y-2 md:space-y-3">
                      <div className="p-2 md:p-3 rounded-full bg-primary/10 text-primary">{action.icon}</div>
                      <h3 className="font-semibold text-xs md:text-base">{action.label}</h3>
                      <p className="text-xs text-muted-foreground hidden md:block">{action.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {generatedQR && (
              <Card className="border-primary/30 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-2 md:pb-4">
                  <CardTitle className="flex items-center gap-2 text-primary text-base md:text-lg">
                    <QrCode className="h-5 w-5" /> Your Active Verification QR
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Citizens scan → they get <strong>+25 pts</strong> → your garbage streak increases!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                    <img src={generatedQR} alt="QR Code" className="w-36 h-36 md:w-44 md:h-44 rounded-xl border-2 border-primary/20 shadow-md flex-shrink-0" />
                    <div className="space-y-3 w-full">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 md:p-3 bg-white dark:bg-background rounded-lg border"><p className="text-muted-foreground text-xs">Employee</p><p className="font-semibold text-xs md:text-sm truncate">{user?.displayName || "—"}</p></div>
                        <div className="p-2 md:p-3 bg-white dark:bg-background rounded-lg border"><p className="text-muted-foreground text-xs">Employee ID</p><p className="font-semibold text-xs md:text-sm">{userData?.employeeId || user?.uid?.slice(0, 8)}</p></div>
                        <div className="p-2 md:p-3 bg-white dark:bg-background rounded-lg border"><p className="text-muted-foreground text-xs">Scans Today</p><p className="font-semibold text-primary">{scansToday}</p></div>
                        <div className="p-2 md:p-3 bg-white dark:bg-background rounded-lg border"><p className="text-muted-foreground text-xs">Streak</p><p className="font-semibold text-orange-500">🔥 {streak} days</p></div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button onClick={handleDownloadQR} variant="outline" size="sm" className="flex items-center gap-2 flex-1"><Download className="h-4 w-4" /> Download</Button>
                        <Button onClick={handleCitizenScanned} size="sm" className="flex items-center gap-2 flex-1"><CheckCircle className="h-4 w-4" /> Simulate Scan</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">💡 "Simulate Scan" is for demo — in production, citizens scan via the app.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg flex-wrap">
                  <ClipboardList className="h-5 w-5 text-primary flex-shrink-0" />
                  Citizen Pickup Requests
                  <Badge variant="destructive" className="ml-1">{pendingCount} Pending</Badge>
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Requests from citizens in your zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pickupRequests.map((req) => (
                    <div key={req.id} className={`p-3 md:p-4 rounded-lg border ${req.status === "completed" ? "bg-green-50 border-green-200 dark:bg-green-950/20" : "bg-orange-50 border-orange-200 dark:bg-orange-950/20"}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-sm">{req.citizen}</div>
                            <div className="text-xs text-muted-foreground truncate">{req.address}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full flex-shrink-0 ${req.status === "completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{req.status}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{req.type}</Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {req.scheduledTime}</span>
                        </div>
                        {req.status === "pending" && (
                          <Button size="sm" className="text-xs h-7 flex-shrink-0" onClick={() => handleCompletePickup(req.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />Mark Done (+30 pts)
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-3 text-sm" onClick={() => setShowCitizenPickupRequests(true)}>
                  View All Requests →
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base md:text-lg">Points Legend</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">📲 QR Scan — +10 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">📦 Pickup — +30 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">🎓 Training — +100 pts</div>
                    <div className="p-2 md:p-3 bg-muted/30 rounded-md text-xs md:text-sm">♻️ E-Waste — +75 pts</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base md:text-lg">Weekly Progress</CardTitle>
                  <CardDescription className="text-xs md:text-sm">{weeklyGoal - weeklyProgress} pts away from goal!</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-medium text-sm">{weeklyProgress} / {weeklyGoal} pts</div>
                  <div className="h-3 bg-muted/20 rounded overflow-hidden">
                    <div style={{ width: `${Math.min(100, (weeklyProgress / weeklyGoal) * 100)}%` }} className="h-full bg-primary transition-all duration-500" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{Math.round((weeklyProgress / weeklyGoal) * 100)}% complete this week 💪</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base md:text-lg">Recent Achievements</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                  <div className="p-2 md:p-3 bg-success/10 rounded border border-success/20 text-xs md:text-sm">✅ Joined as Municipal Employee (+10 pts)</div>
                  <div className="p-2 md:p-3 bg-success/10 rounded border border-success/20 text-xs md:text-sm">✅ First QR Generated (+10 pts)</div>
                  <div className="p-2 md:p-3 bg-success/10 rounded border border-success/20 text-xs md:text-sm">✅ 3 Pickups Completed this week (+90 pts)</div>
                  <div className="p-2 md:p-3 bg-success/10 rounded border border-success/20 text-xs md:text-sm">✅ 7-Day Garbage Streak 🔥</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── LIVE MAP ── */}
          <TabsContent value="map" className="mt-0 p-0">
            <div className="rounded-xl overflow-hidden border shadow-sm" style={{ height: "calc(100vh - 280px)", minHeight: 520 }}>
              <EmployeeMapDashboard />
            </div>
          </TabsContent>

          {/* ── ACTIVITIES ── */}
          <TabsContent value="activities"><Activities /></TabsContent>

          {/* ── LEARNING ── */}
          <TabsContent value="learning" className="space-y-4 md:space-y-6">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Employee Training Hub</h2>
              <p className="text-muted-foreground text-sm md:text-base">Complete training and learn your duties</p>
            </div>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="flex items-center gap-2 text-primary text-base md:text-lg">
                  <AlertTriangle className="h-5 w-5" /> Your Duties as Municipal Employee
                </CardTitle>
                <CardDescription>Key responsibilities to fulfil daily</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                  {[
                    { icon: "📲", duty: "Generate QR Code daily for citizen verification" },
                    { icon: "🚛", duty: "Ensure timely waste collection in your zone" },
                    { icon: "📋", duty: "Review and complete citizen pickup requests" },
                    { icon: "♻️", duty: "Conduct weekly E-Waste collection drives" },
                    { icon: "📊", duty: "Submit daily waste collection reports" },
                    { icon: "🎓", duty: "Complete all mandatory training modules" },
                    { icon: "🗺️", duty: "Track and update waste truck locations" },
                    { icon: "📣", duty: "Educate citizens on proper waste segregation" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-white dark:bg-background rounded-lg border border-primary/10">
                      <span className="text-lg md:text-xl flex-shrink-0">{item.icon}</span>
                      <p className="text-xs md:text-sm text-foreground">{item.duty}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="text-base md:text-lg flex items-center"><GraduationCap className="mr-2 h-5 w-5" /> Core Training</CardTitle><CardDescription>Complete the mandatory training program</CardDescription></CardHeader>
                <CardContent><div className="space-y-3"><div className="flex justify-between text-sm"><span>Progress</span><span>2/3 levels</span></div><Progress value={67} className="h-2" /><Button asChild className="w-full"><Link to="/learning">Continue Training</Link></Button></div></CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="text-base md:text-lg flex items-center"><Gamepad2 className="mr-2 h-5 w-5" /> Learning Games</CardTitle><CardDescription>Play games to reinforce knowledge</CardDescription></CardHeader>
                <CardContent><div className="space-y-3"><div className="flex justify-between text-sm"><span>Games Played</span><span>12</span></div><div className="flex justify-between text-sm"><span>Points Earned</span><span>850 pts</span></div><Button asChild variant="outline" className="w-full"><Link to="/play">Play Games</Link></Button></div></CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader><CardTitle className="text-base md:text-lg flex items-center"><Users className="mr-2 h-5 w-5" /> Employee Courses</CardTitle><CardDescription>Role-specific training modules</CardDescription></CardHeader>
                <CardContent><Button asChild variant="secondary" className="w-full"><Link to="/learning">Explore Courses</Link></Button></CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader><CardTitle className="flex items-center text-base md:text-lg"><BarChart3 className="mr-2 h-5 w-5" /> Learning Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-primary">67%</div><div className="text-xs md:text-sm text-muted-foreground">Training</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-success">12</div><div className="text-xs md:text-sm text-muted-foreground">Games</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-warning">5</div><div className="text-xs md:text-sm text-muted-foreground">Certificates</div></div>
                  <div className="text-center"><div className="text-xl md:text-2xl font-bold text-accent">850</div><div className="text-xs md:text-sm text-muted-foreground">Pts Earned</div></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── LEADERBOARD ── */}
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader><CardTitle className="text-base md:text-lg">District Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 md:space-y-3">
                  {leaderboardData.map((u, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2 md:p-3 rounded ${u.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"}`}>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${u.rank === 1 ? "bg-yellow-400 text-yellow-900" : u.rank === 2 ? "bg-gray-300 text-gray-700" : u.rank === 3 ? "bg-orange-400 text-orange-900" : "bg-muted text-foreground"}`}>
                          {u.rank === 1 ? "🥇" : u.rank === 2 ? "🥈" : u.rank === 3 ? "🥉" : u.rank}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{u.name} {u.isUser && <span className="text-primary text-xs">(You)</span>}</div>
                          <div className="text-xs text-muted-foreground">{u.district}</div>
                        </div>
                      </div>
                      <div className="font-bold text-primary text-sm">{u.points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Modals ── */}
      <WasteTracking isOpen={showWasteTracking} onClose={() => setShowWasteTracking(false)} />
      <SchedulePickup isOpen={showSchedulePickup} onClose={() => setShowSchedulePickup(false)} />
      <EWasteDay isOpen={showEWasteDay} onClose={() => setShowEWasteDay(false)} />
      <CitizenPickupRequests isOpen={showCitizenPickupRequests} onClose={() => setShowCitizenPickupRequests(false)} />
      <AIWasteClassifier isOpen={showAIClassifier} onClose={() => setShowAIClassifier(false)} />
      <WasteChatbot />

      {showRewards && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 md:p-6 overflow-auto">
          <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Rewards</h3>
              <Button variant="ghost" onClick={() => setShowRewards(false)}>Close</Button>
            </div>
            <div style={{ minHeight: 600 }}>
              <RewardsSystem onBack={() => setShowRewards(false)} onRedeem={handlePointsRedeemedWrapper} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EDashboard;