import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock,
  Trophy,
  Target,
  Star,
  Home,
  FileText,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificationsProps {
  userData?: any;
  onBack?: () => void;
}

const Certifications = ({ userData, onBack }: CertificationsProps) => {
  const { toast } = useToast();

  const earnedCertifications = [
    {
      id: 1,
      title: "Waste Management Fundamentals",
      description: "Completed comprehensive training on waste management basics",
      issueDate: "2024-01-15",
      expiryDate: "2025-01-15",
      score: 92,
      level: "Beginner",
      status: "active",
      credentialId: "SB-WMF-2024-001234"
    },
    {
      id: 2,
      title: "Advanced Segregation Specialist",
      description: "Expert-level knowledge in waste segregation techniques",
      issueDate: "2024-02-10",
      expiryDate: "2025-02-10",
      score: 88,
      level: "Intermediate",
      status: "active",
      credentialId: "SB-ASS-2024-005678"
    }
  ];

  const availableCertifications = [
    {
      id: 3,
      title: "Waste Processing & Recycling Expert",
      description: "Master advanced waste processing and recycling methodologies",
      duration: "3 hours",
      modules: 10,
      level: "Advanced",
      prerequisites: ["Waste Management Fundamentals", "Advanced Segregation Specialist"],
      progress: 0,
      status: "available"
    },
    {
      id: 4,
      title: "Community Leadership in Waste Management",
      description: "Lead waste management initiatives in your community",
      duration: "2.5 hours",
      modules: 8,
      level: "Intermediate",
      prerequisites: ["Waste Management Fundamentals"],
      progress: 0,
      status: "available"
    },
    {
      id: 5,
      title: "Digital Waste Management Tools",
      description: "Master digital tools for efficient waste management",
      duration: "1.5 hours",
      modules: 5,
      level: "Beginner",
      prerequisites: [],
      progress: 45,
      status: "in-progress"
    }
  ];

  const handleDownload = (certId: number) => {
    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    });
  };

  const handleShare = (certId: number) => {
    toast({
      title: "Certificate Shared",
      description: "Share link copied to clipboard.",
    });
  };

  const handleStartCourse = (certId: number) => {
    toast({
      title: "Course Started",
      description: "Redirecting to the certification course...",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600";
      case "expired": return "text-red-600";
      case "expiring": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Certifications</h1>
            <p className="text-muted-foreground">Track your waste management learning achievements</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-success/10 text-success">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">{earnedCertifications.length}</div>
              <div className="text-sm text-muted-foreground">Earned Certificates</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">{availableCertifications.length}</div>
              <div className="text-sm text-muted-foreground">Available Courses</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-warning/10 text-warning">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">1</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-3 p-3 rounded-full w-14 h-14 flex items-center justify-center bg-yellow-500/10 text-yellow-600">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">90%</div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Earned Certifications */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Earned Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earnedCertifications.map((cert) => (
              <Card key={cert.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary to-accent opacity-10"></div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{cert.title}</CardTitle>
                      <CardDescription className="mb-3">{cert.description}</CardDescription>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getLevelColor(cert.level)}>
                          {cert.level}
                        </Badge>
                        <Badge variant="secondary">
                          Score: {cert.score}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-success/10 rounded-full">
                        <Award className="h-5 w-5 text-success" />
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(cert.status)}`}>
                        Active
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Issue Date:</span>
                        <div className="font-medium">{new Date(cert.issueDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expires:</span>
                        <div className="font-medium">{new Date(cert.expiryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Credential ID: {cert.credentialId}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDownload(cert.id)}
                        className="flex-1"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleShare(cert.id)}
                        className="flex-1"
                      >
                        <Share2 className="mr-1 h-3 w-3" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Certifications */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCertifications.map((cert) => (
              <Card key={cert.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className={getLevelColor(cert.level)}>
                      {cert.level}
                    </Badge>
                    {cert.status === 'in-progress' && (
                      <Badge variant="secondary">
                        In Progress
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{cert.title}</CardTitle>
                  <CardDescription>{cert.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{cert.duration}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Modules:</span>
                        <div className="font-medium">{cert.modules}</div>
                      </div>
                    </div>

                    {cert.prerequisites.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Prerequisites:</span>
                        <div className="mt-1">
                          {cert.prerequisites.map((prereq, index) => (
                            <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {cert.status === 'in-progress' && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                      </div>
                    )}

                    <Button 
                      onClick={() => handleStartCourse(cert.id)}
                      className="w-full"
                      variant={cert.status === 'in-progress' ? 'default' : 'outline'}
                    >
                      {cert.status === 'in-progress' ? (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Continue Course
                        </>
                      ) : (
                        <>
                          <Trophy className="mr-2 h-4 w-4" />
                          Start Certification
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;