import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Leaf, 
  Trophy, 
  Users, 
  Target, 
  Award,
  Home,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GreenChampionProps {
  userData?: any;
  onBack?: () => void;
}

const GreenChampion = ({ userData, onBack }: GreenChampionProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    motivation: '',
    experience: '',
    availability: '',
    focusArea: '',
    additionalInfo: ''
  });
  const { toast } = useToast();

  const championBenefits = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Leadership Recognition",
      description: "Official Green Champion certificate and badge"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Impact",
      description: "Lead and organize local environmental initiatives"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Exclusive Training",
      description: "Access to advanced leadership and environmental courses"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Special Rewards",
      description: "Bonus points and exclusive rewards for champions"
    }
  ];

  const requirements = [
    { text: "Complete all 3 core training levels", met: true },
    { text: "Earn minimum 1000 points", met: true },
    { text: "Maintain 30-day activity streak", met: false },
    { text: "Participate in 2+ community events", met: true },
    { text: "Submit application and motivation letter", met: false }
  ];

  const currentChampions = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      initiatives: 12,
      impact: "500+ families",
      specialization: "Community Outreach"
    },
    {
      name: "Raj Patel",
      location: "Ahmedabad, Gujarat", 
      initiatives: 8,
      impact: "300+ students",
      specialization: "Educational Programs"
    },
    {
      name: "Anita Kumar",
      location: "Bangalore, Karnataka",
      initiatives: 15,
      impact: "200+ businesses",
      specialization: "Corporate Engagement"
    }
  ];

  const handleSubmitApplication = () => {
    if (!applicationData.motivation || !applicationData.experience || !applicationData.focusArea) {
      toast({
        title: "Incomplete Application",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted! 🌟",
      description: "Your Green Champion application has been submitted for review. We'll contact you within 5-7 business days.",
    });
    setShowApplicationForm(false);
  };

  const eligibilityMet = requirements.filter(req => req.met).length;
  const totalRequirements = requirements.length;
  const isEligible = eligibilityMet >= 3; // Need to meet at least 3 out of 5 requirements

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              Become a Green Champion
            </h1>
            <p className="text-muted-foreground">Lead environmental change in your community</p>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
        </div>

        {!showApplicationForm ? (
          <>
            {/* Hero Section */}
            <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center">
                  <Leaf className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Make a Real Difference</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                  Join our network of environmental leaders who are driving positive change in their communities. 
                  As a Green Champion, you'll have the tools, training, and support to create lasting impact.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">500+</div>
                    <div className="text-muted-foreground">Active Champions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">50+</div>
                    <div className="text-muted-foreground">Cities Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1M+</div>
                    <div className="text-muted-foreground">Lives Impacted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Champion Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {championBenefits.map((benefit, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center text-green-600">
                        {benefit.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Eligibility Check */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Eligibility Requirements
                  </CardTitle>
                  <CardDescription>
                    Complete these requirements to apply ({eligibilityMet}/{totalRequirements} completed)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          requirement.met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {requirement.met ? <CheckCircle className="h-4 w-4" /> : <div className="w-2 h-2 bg-gray-400 rounded-full" />}
                        </div>
                        <span className={requirement.met ? 'text-foreground' : 'text-muted-foreground'}>
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setShowApplicationForm(true)}
                      disabled={!isEligible}
                      className="w-full"
                    >
                      {isEligible ? (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Apply Now
                        </>
                      ) : (
                        'Complete More Requirements'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Champions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Featured Champions
                  </CardTitle>
                  <CardDescription>
                    Meet some of our active Green Champions making a difference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentChampions.map((champion, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{champion.name}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {champion.location}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {champion.specialization}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Initiatives:</span>
                            <div className="font-medium">{champion.initiatives}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Impact:</span>
                            <div className="font-medium">{champion.impact}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          /* Application Form */
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Green Champion Application</CardTitle>
              <CardDescription>
                Tell us about yourself and your passion for environmental change
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="motivation">Why do you want to become a Green Champion? *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Share your motivation and vision for environmental change..."
                  value={applicationData.motivation}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, motivation: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience *</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe any environmental, community, or leadership experience..."
                  value={applicationData.experience}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusArea">Primary Focus Area *</Label>
                <Select onValueChange={(value) => setApplicationData(prev => ({ ...prev, focusArea: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your area of interest" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community-outreach">Community Outreach</SelectItem>
                    <SelectItem value="educational-programs">Educational Programs</SelectItem>
                    <SelectItem value="corporate-engagement">Corporate Engagement</SelectItem>
                    <SelectItem value="policy-advocacy">Policy & Advocacy</SelectItem>
                    <SelectItem value="youth-engagement">Youth Engagement</SelectItem>
                    <SelectItem value="rural-development">Rural Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Time Commitment</Label>
                <Select onValueChange={(value) => setApplicationData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="How much time can you dedicate?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-4-hours">2-4 hours per week</SelectItem>
                    <SelectItem value="5-8-hours">5-8 hours per week</SelectItem>
                    <SelectItem value="9-15-hours">9-15 hours per week</SelectItem>
                    <SelectItem value="full-time">Full-time commitment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Any additional information you'd like to share..."
                  value={applicationData.additionalInfo}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitApplication}
                  className="flex-1"
                >
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GreenChampion;