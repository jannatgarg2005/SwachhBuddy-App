// src/App.tsx  ← UPDATED: added /ragpicker-identity route
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Play from "./pages/play";
import Earn from "./pages/earn";
import Resolve from "./pages/resolve";

import CommunityEngagement from "./pages/landing-details/CommunityEngagement";
import SmartSegregation from "./pages/landing-details/SmartSegregation";
import ProgressTracking from "./pages/landing-details/ProgressTracking";
import RewardsSystemLanding from "./pages/landing-details/RewardsSystem";
import Transparency from "./pages/landing-details/Transparency";
import DigitalFirst from "./pages/landing-details/DigitalFirst";

import UserProfile from "./components/UserProfile";
import Certifications from "./components/Certifications";
import RewardsSystem from "./components/RewardsSystem";
import Settings from "./components/settings";
import MapDashboard from "./components/MapDashboard";

import Learning from "./pages/Learning";

// Waste management modules
import { WasteBasicsModule }        from "./components/learning/WasteBasicsModule";
import { WasteIntermediateModule }  from "./components/learning/WasteIntermediateModule";
import { WasteAdvancedModule }      from "./components/learning/WasteAdvanceModule";

// Student modules
import { StudentBasicsModule }       from "./components/learning/StudentBasicsModule";
import { StudentIntermediateModule } from "./components/learning/StudentIntermediateModule";
import { StudentAdvancedModule }     from "./components/learning/StudentAdvancedModule";

// Community modules
import { CommunityBasicsModule }       from "./components/learning/CommunityBasicsModule";
import { CommunityIntermediateModule } from "./components/learning/CommunityIntermediateModule";
import { CommunityAdvancedModule }     from "./components/learning/CommunityAdvancedModule";

// Rag Picker modules
import { RagPickerBasicsModule }       from "./components/learning/RagPickerBasicsModule";
import { RagPickerIntermediateModule } from "./components/learning/RagPickerIntermediateModule";
import { RagPickerAdvancedModule }     from "./components/learning/RagPickerAdvancedModule";

import WasteSortingGame from "./components/WasteSortingGame";
import WasteGame from "@/components/wastegame";
import EcoSorterGame from "@/components/EcoSorterGame";
import EcoRunner from "@/components/EcoRunner";
import EcoMario from "@/components/EcoMario";

import UserTypeSelection from "./pages/UserTypeSelection";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import CDashboard from "./pages/Dashboard/CDashboard";
import EDashboard from "./pages/Dashboard/EDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { EcoEscapeRoom } from "./components/EcoEscapeRoom";
import NotFound from "./pages/NotFound";
import { PointsProvider } from "@/contexts/PointsContext";

// ── NEW: Rag Picker Digital Identity ─────────────────────────────────────────
import RagPickerIdentityDashboard from "./pages/RagPickerIdentityDashboard";
// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

const App = () => (
  <PointsProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Landing onUserTypeSelect={() => { }} />} />
              <Route path="/play"    element={<Play />} />
              <Route path="/earn"    element={<Earn />} />
              <Route path="/resolve" element={<Resolve />} />

              <Route path="/community-engagement" element={<CommunityEngagement />} />
              <Route path="/smart-segregation"    element={<SmartSegregation />} />
              <Route path="/progress-tracking"    element={<ProgressTracking />} />
              <Route path="/rewards-system"       element={<RewardsSystemLanding />} />
              <Route path="/transparency"         element={<Transparency />} />
              <Route path="/digital-first"        element={<DigitalFirst />} />
              <Route path="/live-map"             element={<MapDashboard />} />

              <Route path="/profile"        element={<UserProfile userData={{}} />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/rewards"        element={<RewardsSystem />} />
              <Route path="/settings"       element={<Settings />} />

              <Route path="/learning" element={<Learning />} />

              {/* Waste Management */}
              <Route path="/learning/waste-basics"         element={<WasteBasicsModule />} />
              <Route path="/learning/advanced-segregation" element={<WasteIntermediateModule />} />
              <Route path="/learning/waste-processing"     element={<WasteAdvancedModule />} />
              <Route path="/learning/waste-advance"        element={<WasteAdvancedModule />} />

              {/* Student */}
              <Route path="/learning/student-basics"       element={<StudentBasicsModule />} />
              <Route path="/learning/student-intermediate" element={<StudentIntermediateModule />} />
              <Route path="/learning/student-advanced"     element={<StudentAdvancedModule />} />

              {/* Community */}
              <Route path="/learning/community-basics"       element={<CommunityBasicsModule />} />
              <Route path="/learning/community-intermediate" element={<CommunityIntermediateModule />} />
              <Route path="/learning/community-advanced"     element={<CommunityAdvancedModule />} />

              {/* Rag Picker */}
              <Route path="/learning/ragpicker-basics"       element={<RagPickerBasicsModule />} />
              <Route path="/learning/ragpicker-intermediate" element={<RagPickerIntermediateModule />} />
              <Route path="/learning/ragpicker-advanced"     element={<RagPickerAdvancedModule />} />

              <Route path="/learning/waste-sorting-game" element={<WasteSortingGame />} />

              <Route path="/get-started" element={<UserTypeSelection />} />
              <Route path="/login"  element={<ProtectedRoute requireAuth={false}><Login /></ProtectedRoute>} />
              <Route path="/signup" element={<ProtectedRoute requireAuth={false}><Signup /></ProtectedRoute>} />
              <Route path="/auth"   element={<Auth />} />

              <Route path="/dashboard/corporate" element={<ProtectedRoute requireAuth={true}><CDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/enduser"   element={<ProtectedRoute requireAuth={true}><EDashboard /></ProtectedRoute>} />

              {/* ── NEW ROUTE ── */}
              <Route path="/ragpicker-identity" element={<RagPickerIdentityDashboard />} />

              <Route path="/manage-waste"    element={<WasteGame />} />
              <Route path="/eco-sorter-game" element={<EcoSorterGame />} />
              <Route path="/eco-escape-room" element={<EcoEscapeRoom />} />
              <Route path="/eco-runner-game" element={<EcoRunner />} />
              <Route path="/eco-mario-game"  element={<EcoMario />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PointsProvider>
);

export default App;