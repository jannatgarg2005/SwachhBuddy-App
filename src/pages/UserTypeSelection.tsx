import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Recycle, ArrowLeft, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserTypeSelection = () => {
  const [selectedType, setSelectedType] = useState<"citizen" | "employee" | null>(null);
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: "citizen" | "employee") => {
    navigate("/auth", { state: { userType: type } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary-glow to-accent text-white p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Recycle className="mr-2 h-4 w-4" />
            Swachh Bharat Digital
          </Badge>
        </div>
      </div>

      {/* Main */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Choose Your Role</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Select your role to get personalized features and training content.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link to="/learning">
              <GraduationCap className="mr-2 h-4 w-4" />
              Explore Learning First
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Citizen */}
          <Card
            className={`cursor-pointer hover:shadow-glow hover:scale-105 transition ${
              selectedType === "citizen" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedType("citizen")}
          >
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Citizen</CardTitle>
              <CardDescription>For households and community members</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedType === "citizen" && (
                <Button className="w-full mt-4" onClick={() => handleUserTypeSelect("citizen")}>
                  Continue as Citizen
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Employee */}
          <Card
            className={`cursor-pointer hover:shadow-glow hover:scale-105 transition ${
              selectedType === "employee" ? "ring-2 ring-accent" : ""
            }`}
            onClick={() => setSelectedType("employee")}
          >
            <CardHeader className="text-center">
              <UserCheck className="h-12 w-12 text-accent mx-auto mb-4" />
              <CardTitle>Municipal Employee</CardTitle>
              <CardDescription>For workers and supervisors</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedType === "employee" && (
                <Button
                  className="w-full mt-4 bg-accent hover:bg-accent/90 text-white"
                  onClick={() => handleUserTypeSelect("employee")}
                >
                  Continue as Employee
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
