// src/pages/Learning.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Users, GraduationCap, Recycle, Play, Clock, Award, CheckCircle, Star, Home, HardHat, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { CertificateGenerator } from "@/components/CertificateGenerator";
import { useAuth } from "@/hooks/use-auth";

const WASTE_CFG     = [{ storageKey: "basics_progress",                totalLessons: 3, title: "Waste Management Basics" },          { storageKey: "intermediate_progress",         totalLessons: 6, title: "Advanced Segregation Techniques" }, { storageKey: "advanced_progress",             totalLessons: 6, title: "Waste Processing & Recycling" }];
const STUDENT_CFG   = [{ storageKey: "student_basics_progress",        totalLessons: 5, title: "Campus Sustainability Champion" },    { storageKey: "student_intermediate_progress", totalLessons: 8, title: "Environmental Science & Waste" },    { storageKey: "student_advanced_progress",     totalLessons: 6, title: "Project Planning for Clean Drives" }];
const COMMUNITY_CFG = [{ storageKey: "community_basics_progress",      totalLessons: 5, title: "Community Mobilization" },           { storageKey: "community_intermediate_progress", totalLessons: 6, title: "Local Policy & Advocacy" },         { storageKey: "community_advanced_progress",   totalLessons: 6, title: "Community Sustainability Leadership" }];
const RAGPICKER_CFG = [{ storageKey: "ragpicker_basics_progress",      totalLessons: 5, title: "Safety First: Personal Protection" },{ storageKey: "ragpicker_intermediate_progress", totalLessons: 4, title: "Efficient Collection Techniques" },   { storageKey: "ragpicker_advanced_progress",   totalLessons: 3, title: "Digital Tools & Income Tracking" }];

const readRate = (key: string, total: number): number => {
  try { const s = localStorage.getItem(key); if (!s) return 0; const { completedLessons = [] } = JSON.parse(s); return Math.round((completedLessons.length / total) * 100); } catch { return 0; }
};

const wasteCourses     = [{ id: 1,      title: "Waste Management Basics",           difficulty: "Beginner",     rating: 4.8, enrolled: 12500, modules: 3, duration: "45 min",   route: "/learning/waste-basics",          description: "Fundamentals of waste, 3 R's, and colour-coded segregation",         content: ["What is Waste?", "The 3 R's", "Waste Segregation"] },                           { id: 2, title: "Advanced Segregation Techniques", difficulty: "Intermediate", rating: 4.7, enrolled: 8900,  modules: 6, duration: "1.5 hrs", route: "/learning/advanced-segregation", description: "Advanced segregation, wet/dry/hazardous processing",           content: ["Color Coding", "Wet Waste", "Dry Waste", "Hazardous", "Industrial", "Medical"] }, { id: 3, title: "Waste Processing & Recycling", difficulty: "Advanced", rating: 4.9, enrolled: 5600, modules: 6, duration: "2.5 hrs", route: "/learning/waste-processing", description: "Technologies, circular economy, LCA, policy", content: ["Waste Tech", "Recycling", "MRFs", "Circular Economy", "EIA", "Policy"] }];
const studentCourses   = [{ id: "st-1", title: "Campus Sustainability Champion",    difficulty: "Beginner",     rating: 4.6, enrolled: 2100,  modules: 5, duration: "50 min",   route: "/learning/student-basics",        description: "Waste basics, 5 R's, campus lab, green ambassador",                 content: ["Why Waste Matters", "Sorting Waste", "5 R's", "Campus Lab", "Green Ambassador"] }, { id: "st-2", title: "Environmental Science & Waste", difficulty: "Intermediate", rating: 4.8, enrolled: 1500, modules: 8, duration: "2 hrs", route: "/learning/student-intermediate", description: "Climate, circular economy, fast fashion, policy, research",     content: ["Climate & Waste", "Circular Economy", "Fast Fashion", "Food Waste", "Clean Drives", "Digital Footprint", "Env. Laws", "Planning"] }, { id: "st-3", title: "Project Planning for Clean Drives", difficulty: "Advanced", rating: 4.5, enrolled: 980, modules: 6, duration: "1.75 hrs", route: "/learning/student-advanced", description: "Systems thinking, LCA, env. justice, policy, entrepreneurship", content: ["Systems Thinking", "LCA", "Env. Justice", "Policy Advocacy", "Green Business", "Research"] }];
const communityCourses = [{ id: "cm-1", title: "Community Mobilization",            difficulty: "Beginner",     rating: 4.7, enrolled: 750,   modules: 5, duration: "55 min",   route: "/learning/community-basics",      description: "Community mapping, team building, composting, communication",        content: ["What is a Community", "Mapping Waste", "Building a Team", "Communication", "Composting"] }, { id: "cm-2", title: "Local Policy & Advocacy", difficulty: "Intermediate", rating: 4.6, enrolled: 420, modules: 6, duration: "1.5 hrs", route: "/learning/community-intermediate", description: "Segregation systems, meetings, engagement, funding, technology", content: ["Segregation System", "Community Meetings", "Resistant Members", "Funding", "Technology", "Sustaining Initiatives"] }, { id: "cm-3", title: "Community Sustainability Leadership", difficulty: "Advanced", rating: 4.8, enrolled: 280, modules: 6, duration: "1.75 hrs", route: "/learning/community-advanced", description: "Working with government, Zero Waste, data, scaling, leadership",  content: ["Working with Govt", "Zero Waste", "Data & Measurement", "Scaling", "Conflict Resolution", "Leadership"] }];
const ragPickerCourses = [{ id: "rp-1", title: "Safety First: Personal Protection", difficulty: "Essential",    rating: 4.8, enrolled: 1200,  modules: 5, duration: "55 min",   route: "/learning/ragpicker-basics",      description: "Your rights, PPE, hazardous waste ID, health protection",            content: ["Your Work's Value", "PPE & Equipment", "Hazardous Waste", "Health Risks", "Legal Rights"] }, { id: "rp-2", title: "Efficient Collection Techniques", difficulty: "Intermediate", rating: 4.7, enrolled: 890, modules: 4, duration: "1 hr", route: "/learning/ragpicker-intermediate", description: "Route planning, material ID, negotiation, income maximisation",  content: ["Collection Routes", "Material ID & Prices", "Negotiating Prices", "Maximising Income"] }, { id: "rp-3", title: "Digital Tools & Income Tracking", difficulty: "Beginner", rating: 4.9, enrolled: 650, modules: 3, duration: "50 min", route: "/learning/ragpicker-advanced", description: "Mobile apps, government schemes, business growth",               content: ["Mobile Apps for Income", "Government Schemes", "Building a Business"] }];

const Learning = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const [searchParams] = useSearchParams();

  // ✅ Read tab and cert from URL params
  const urlTab  = searchParams.get("tab")  || "core-training";
  const urlCert = searchParams.get("cert") || null;

  const [showCert, setShowCert] = useState<'waste'|'student'|'community'|'ragpicker'|null>(null);
  const [wasteRates,     setWasteRates]     = useState<number[]>([0,0,0]);
  const [studentRates,   setStudentRates]   = useState<number[]>([0,0,0]);
  const [communityRates, setCommunityRates] = useState<number[]>([0,0,0]);
  const [ragRates,       setRagRates]       = useState<number[]>([0,0,0]);

  const isEmployee = userData?.role === "municipal-employee";
  const userName   = userData?.displayName || user?.displayName || user?.email?.split("@")[0] || "";

  const refreshRates = () => {
    setWasteRates(WASTE_CFG.map(c => readRate(c.storageKey, c.totalLessons)));
    setStudentRates(STUDENT_CFG.map(c => readRate(c.storageKey, c.totalLessons)));
    setCommunityRates(COMMUNITY_CFG.map(c => readRate(c.storageKey, c.totalLessons)));
    setRagRates(RAGPICKER_CFG.map(c => readRate(c.storageKey, c.totalLessons)));
  };

  useEffect(() => { refreshRates(); }, []);

  // ✅ Auto-open certificate if ?cert= param present
  useEffect(() => {
    if (urlCert) setShowCert(urlCert as 'waste'|'student'|'community'|'ragpicker');
  }, [urlCert]);

  useEffect(() => {
    const onV = () => { if (document.visibilityState === "visible") refreshRates(); };
    const onF = () => refreshRates();
    document.addEventListener("visibilitychange", onV); window.addEventListener("focus", onF);
    return () => { document.removeEventListener("visibilitychange", onV); window.removeEventListener("focus", onF); };
  }, []);

  const wasteModules     = WASTE_CFG.map((c,i)     => ({ title: c.title, completed: wasteRates[i] === 100 }));
  const studentModules   = STUDENT_CFG.map((c,i)   => ({ title: c.title, completed: studentRates[i] === 100 }));
  const communityModules = COMMUNITY_CFG.map((c,i) => ({ title: c.title, completed: communityRates[i] === 100 }));
  const ragModules       = RAGPICKER_CFG.map((c,i) => ({ title: c.title, completed: ragRates[i] === 100 }));

  const allWasteDone = wasteRates.every(r => r === 100);
  const allStudentDone = studentRates.every(r => r === 100);
  const allCommunityDone = communityRates.every(r => r === 100);
  const allRagDone = ragRates.every(r => r === 100);
  const avg = (arr: number[]) => Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);
  const getDifficultyColor = (d: string) => d==="Beginner"||d==="Essential" ? "bg-green-500" : d==="Intermediate" ? "bg-yellow-500" : "bg-red-500";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CourseCard = ({ course, rate, onStart }: { course: any; rate?: number; onStart: () => void }) => (
    <Card className={`hover:shadow-lg transition-shadow ${rate===100?"border-green-400 ring-1 ring-green-300":""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={`${getDifficultyColor(course.level||course.difficulty)} text-white text-xs`}>{course.level||course.difficulty}</Badge>
          <div className="flex items-center gap-1.5">
            {rate===100 && <CheckCircle className="h-4 w-4 text-green-600"/>}
            <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"/><span className="text-xs">{course.rating}</span></div>
          </div>
        </div>
        <CardTitle className="text-base md:text-lg">{course.title}</CardTitle>
        <CardDescription className="text-xs md:text-sm">{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1"><Book className="h-3 w-3"/>{course.modules} modules</div>
            <div className="flex items-center gap-1"><Clock className="h-3 w-3"/>{course.duration}</div>
            <div className="flex items-center gap-1"><Users className="h-3 w-3"/>{(course.students||course.enrolled||0).toLocaleString()}</div>
            <div className="flex items-center gap-1"><Award className="h-3 w-3"/>Certificate</div>
          </div>
          {course.content && (
            <div className="space-y-1">
              <p className="font-semibold text-xs">Course Content:</p>
              {course.content.slice(0,3).map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0"/>{item}
                </div>
              ))}
              {course.content.length > 3 && <p className="text-xs text-muted-foreground ml-4">+{course.content.length-3} more</p>}
            </div>
          )}
          {rate !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span className={rate===100?"text-green-600 font-bold":rate>0?"text-yellow-600 font-semibold":"text-muted-foreground"}>
                  {rate===100?"✅ Complete":`${rate}%`}
                </span>
              </div>
              <Progress value={rate} className="h-1.5"/>
            </div>
          )}
          <Button onClick={onStart} className={`w-full ${rate===100?"bg-green-600 hover:bg-green-700":""}`} size="sm">
            <Play className="mr-2 h-3.5 w-3.5"/>
            {rate===100?"Review":rate!==undefined&&rate>0?"Continue":"Start Course"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressBanner = ({ rates, allDone, onCert, label }: { rates: number[]; allDone: boolean; onCert: () => void; label: string }) => {
    const progress = avg(rates);
    return progress > 0 ? (
      <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-xl p-3 md:p-4 mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-semibold text-primary">{label} Progress</span>
          <span className="text-sm font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2 mb-2"/>
        {allDone ? (
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <p className="text-green-700 font-bold text-sm">🏅 All modules complete! Download your certificate!</p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-shrink-0" onClick={onCert}><Award className="h-4 w-4"/> Get Certificate</Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center">Complete all 3 modules to earn your certificate ({rates.filter(r=>r===100).length}/3 done)</p>
        )}
      </div>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full"><GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-primary"/></div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">Learning Hub</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isEmployee ? <><HardHat className="h-3.5 w-3.5 text-blue-600"/><span className="text-xs font-semibold text-blue-600">Employee Track</span></> : <><Leaf className="h-3.5 w-3.5 text-green-600"/><span className="text-xs font-semibold text-green-600">Citizen Track</span></>}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="flex items-center gap-1.5 text-xs md:text-sm"><Home className="h-3.5 w-3.5"/><span className="hidden sm:inline">Home</span></Button>
          </div>
          <p className="text-sm md:text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            {isEmployee ? "Specialised training for municipal employees and field workers" : "Comprehensive education for citizens, students, and communities"}
          </p>
        </div>

        {/* ✅ defaultValue reads from URL param */}
        <Tabs defaultValue={urlTab} className="space-y-6 md:space-y-8">
          <div className="overflow-x-auto pb-1">
            <TabsList className="flex w-max min-w-full md:grid md:grid-cols-3 md:w-full gap-1 md:gap-0 rounded-xl bg-muted/60 p-1">
              <TabsTrigger value="core-training" className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs md:text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"><Book className="h-3.5 w-3.5 flex-shrink-0"/><span>Core Training</span></TabsTrigger>
              {!isEmployee ? (
                <TabsTrigger value="students" className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs md:text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"><GraduationCap className="h-3.5 w-3.5 flex-shrink-0"/><span>Students</span></TabsTrigger>
              ) : (
                <TabsTrigger value="rag-pickers" className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs md:text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"><Recycle className="h-3.5 w-3.5 flex-shrink-0"/><span>Rag Pickers</span></TabsTrigger>
              )}
              <TabsTrigger value="communities" className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-xs md:text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"><Users className="h-3.5 w-3.5 flex-shrink-0"/><span>Communities</span></TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="core-training" className="space-y-4">
            <div className="text-center mb-4"><h2 className="text-xl md:text-2xl font-semibold mb-1">Mandatory Training Levels</h2><p className="text-sm text-muted-foreground">Complete all 3 levels to earn your Waste Management Certificate</p></div>
            <ProgressBanner rates={wasteRates} allDone={allWasteDone} onCert={() => setShowCert('waste')} label="Core Training"/>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
              {wasteCourses.map((c,i) => <CourseCard key={c.id} course={c} rate={wasteRates[i]} onStart={() => navigate(c.route)}/>)}
            </div>
          </TabsContent>

          {!isEmployee && (
            <TabsContent value="students" className="space-y-4">
              <div className="text-center mb-4"><div className="flex items-center justify-center gap-2 mb-2"><GraduationCap className="h-7 w-7 text-primary"/><h2 className="text-xl md:text-2xl font-semibold">Courses for Students</h2></div><p className="text-sm text-muted-foreground">Educational content for schools, colleges, and young changemakers</p></div>
              <ProgressBanner rates={studentRates} allDone={allStudentDone} onCert={() => setShowCert('student')} label="Student Track"/>
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                {studentCourses.map((c,i) => <CourseCard key={c.id} course={c} rate={studentRates[i]} onStart={() => navigate(c.route)}/>)}
              </div>
            </TabsContent>
          )}

          {isEmployee && (
            <TabsContent value="rag-pickers" className="space-y-4">
              <div className="text-center mb-4"><div className="flex items-center justify-center gap-2 mb-2"><Recycle className="h-7 w-7 text-primary"/><h2 className="text-xl md:text-2xl font-semibold">Courses for Rag Pickers</h2></div><p className="text-sm text-muted-foreground">Specialised training on safety, collection efficiency, and income growth</p></div>
              <ProgressBanner rates={ragRates} allDone={allRagDone} onCert={() => setShowCert('ragpicker')} label="Rag Picker Track"/>
              <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
                {ragPickerCourses.map((c,i) => <CourseCard key={c.id} course={c} rate={ragRates[i]} onStart={() => navigate(c.route)}/>)}
              </div>
            </TabsContent>
          )}

          <TabsContent value="communities" className="space-y-4">
            <div className="text-center mb-4"><div className="flex items-center justify-center gap-2 mb-2"><Users className="h-7 w-7 text-primary"/><h2 className="text-xl md:text-2xl font-semibold">Community Leadership</h2></div><p className="text-sm text-muted-foreground">Build skills to lead waste management initiatives in your community</p></div>
            <ProgressBanner rates={communityRates} allDone={allCommunityDone} onCert={() => setShowCert('community')} label="Community Track"/>
            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3">
              {communityCourses.map((c,i) => <CourseCard key={c.id} course={c} rate={communityRates[i]} onStart={() => navigate(c.route)}/>)}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 md:mt-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 md:p-3 bg-primary/10 rounded-full flex-shrink-0"><Award className="h-5 w-5 md:h-6 md:w-6 text-primary"/></div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold">Earn Certificates</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Complete any track to download your official certificate</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className={`flex items-center gap-1.5 ${allWasteDone?"bg-green-600 hover:bg-green-700":""}`} onClick={() => setShowCert('waste')}><Award className="h-4 w-4"/> Waste</Button>
                {!isEmployee && <Button size="sm" variant="outline" className={`flex items-center gap-1.5 ${allStudentDone?"border-purple-400 text-purple-700":""}`} onClick={() => setShowCert('student')}><GraduationCap className="h-4 w-4"/> Student</Button>}
                <Button size="sm" variant="outline" className={`flex items-center gap-1.5 ${allCommunityDone?"border-indigo-400 text-indigo-700":""}`} onClick={() => setShowCert('community')}><Users className="h-4 w-4"/> Community</Button>
                {isEmployee && <Button size="sm" variant="outline" className={`flex items-center gap-1.5 ${allRagDone?"border-orange-400 text-orange-700":""}`} onClick={() => setShowCert('ragpicker')}><Recycle className="h-4 w-4"/> Rag Picker</Button>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CertificateGenerator isOpen={showCert==='waste'}     onClose={() => setShowCert(null)} defaultName={userName} completedModules={wasteModules}     certificateTitle="Waste Management Professional"   trackColor="#16a34a"/>
      {!isEmployee && <CertificateGenerator isOpen={showCert==='student'}   onClose={() => setShowCert(null)} defaultName={userName} completedModules={studentModules}   certificateTitle="Student Sustainability Expert"    trackColor="#7c3aed"/>}
      <CertificateGenerator isOpen={showCert==='community'} onClose={() => setShowCert(null)} defaultName={userName} completedModules={communityModules} certificateTitle="Community Sustainability Leader"  trackColor="#0e7490"/>
      {isEmployee && <CertificateGenerator isOpen={showCert==='ragpicker'} onClose={() => setShowCert(null)} defaultName={userName} completedModules={ragModules}       certificateTitle="Skilled Recycling Professional"  trackColor="#ea580c"/>}
    </div>
  );
};

export default Learning;