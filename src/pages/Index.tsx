import { useState, useEffect } from "react";
import Landing from "./Landing";
import Auth from "./Auth";
import Training from "./Training";
import Dashboard from "./Dashboard";
import Navbar from "@/components/Navbar";
import UserProfile from "@/components/UserProfile";
import Certifications from "@/components/Certifications";
import RewardsSystem from "@/components/RewardsSystem";
import GreenChampion from "@/components/GreenChampion";

type AppState =
  | "landing"
  | "auth"
  | "training"
  | "dashboard"
  | "profile"
  | "certifications"
  | "rewards"
  | "green-champion";

type UserType =
  | "waste-collector"
  | "student"
  | "community-leader"
  | "employee";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUserData = localStorage.getItem("swachh-bharat-user");
    if (savedUserData) {
      const user = JSON.parse(savedUserData);
      setUserData(user);
      if (user.trainingCompleted) {
        setAppState("dashboard");
      } else {
        setAppState("training");
      }
    }
  }, []);

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setAppState("auth");
  };

  const handleAuthSuccess = (user: any) => {
    setUserData(user);
    localStorage.setItem("swachh-bharat-user", JSON.stringify(user));

    if (user.isNewUser) {
      setAppState("training");
    } else {
      setAppState("dashboard");
    }
  };

  const handleTrainingComplete = (completedUserData: any) => {
    const updatedUser = { ...completedUserData, trainingCompleted: true };
    setUserData(updatedUser);
    localStorage.setItem("swachh-bharat-user", JSON.stringify(updatedUser));
    setAppState("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("swachh-bharat-user");
    setUserData(null);
    setUserType(null);
    setAppState("landing");
  };

  const handleNavigate = (path: string) => {
    switch (path) {
      case "/":
        setAppState("dashboard");
        break;
      case "/learning":
        // handled separately
        break;
      case "/profile":
        setAppState("profile");
        break;
      case "/certifications":
        setAppState("certifications");
        break;
      case "/rewards":
        setAppState("rewards");
        break;
      case "/green-champion":
        setAppState("green-champion");
        break;
      default:
        setAppState("dashboard");
    }
  };

  const handleBack = () => {
    if (appState === "auth") {
      setAppState("landing");
      setUserType(null);
    } else if (
      ["profile", "certifications", "rewards", "green-champion"].includes(
        appState
      )
    ) {
      setAppState("dashboard");
    }
  };

  const showNavbar = [
    "dashboard",
    "profile",
    "certifications",
    "rewards",
    "green-champion",
  ].includes(appState);

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && (
        <Navbar
          userData={userData}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {(() => {
        switch (appState) {
          case "landing":
            return <Landing onUserTypeSelect={handleUserTypeSelect} />;

          case "auth":
            if (!userType) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return (
              <Auth
                userType={userType}
                onBack={handleBack}
                onAuthSuccess={handleAuthSuccess}
              />
            );

          case "training":
            return (
              <Training
                userData={userData}
                onTrainingComplete={handleTrainingComplete}
              />
            );

          case "dashboard":
            if (!userData) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return (
              <Dashboard userData={userData} onNavigate={handleNavigate} />
            );

          case "profile":
            if (!userData) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return <UserProfile userData={userData} onBack={handleBack} />;

          case "certifications":
            if (!userData) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return (
              <Certifications userData={userData} onBack={handleBack} />
            );

          case "rewards":
            if (!userData) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return <RewardsSystem userData={userData} onBack={handleBack} />;

          case "green-champion":
            if (!userData) {
              return <Landing onUserTypeSelect={handleUserTypeSelect} />;
            }
            return <GreenChampion userData={userData} onBack={handleBack} />;

          default:
            return <Landing onUserTypeSelect={handleUserTypeSelect} />;
        }
      })()}
    </div>
  );
};

export default Index;
