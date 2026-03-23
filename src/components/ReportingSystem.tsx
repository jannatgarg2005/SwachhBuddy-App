import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Camera, MapPin, AlertTriangle, CheckCircle, Upload, Loader2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsEarned: (points: number) => void;
}

const ReportingSystem = ({ isOpen, onClose, onPointsEarned }: ReportingSystemProps) => {
  const [reportType, setReportType] = useState<'missed-pickup' | 'waste-dumping' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    photo: null as File | null,
    urgency: 'medium'
  });

  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setReportSubmitted(true);
    setIsSubmitting(false);
    
    // Award points for reporting
    const points = reportType === 'waste-dumping' ? 50 : 30;
    onPointsEarned(points);
    
    toast({
      title: "Report Submitted Successfully! 🎉",
      description: `Thank you for helping keep our city clean. +${points} points earned.`,
    });
  };

  const resetForm = () => {
    setReportType(null);
    setReportSubmitted(false);
    setFormData({
      location: '',
      description: '',
      photo: null,
      urgency: 'medium'
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const recentReports = [
    {
      id: "RPT001",
      type: "Waste Dumping",
      location: "Near Park Street Metro",
      status: "Under Review",
      timeAgo: "2 hours ago",
      points: 50
    },
    {
      id: "RPT002", 
      type: "Missed Pickup",
      location: "Residential Block A",
      status: "Resolved",
      timeAgo: "1 day ago",
      points: 30
    },
    {
      id: "RPT003",
      type: "Waste Dumping", 
      location: "Market Street",
      status: "In Progress",
      timeAgo: "3 days ago",
      points: 50
    }
  ];

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Report Waste Issues
          </AlertDialogTitle>
          <AlertDialogDescription>
            Help keep your community clean by reporting issues
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {!reportType && !reportSubmitted && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4">What would you like to report?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className="cursor-pointer hover:shadow-eco transition-all duration-300 hover:scale-105"
                    onClick={() => setReportType('missed-pickup')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 p-4 bg-warning/10 rounded-full w-16 h-16 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-warning" />
                      </div>
                      <h3 className="font-semibold mb-2">Missed Pickup</h3>
                      <p className="text-sm text-muted-foreground">
                        Report when scheduled waste collection was missed
                      </p>
                      <Badge variant="outline" className="mt-2">+30 Points</Badge>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-eco transition-all duration-300 hover:scale-105"
                    onClick={() => setReportType('waste-dumping')}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 p-4 bg-destructive/10 rounded-full w-16 h-16 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                      </div>
                      <h3 className="font-semibold mb-2">Illegal Dumping</h3>
                      <p className="text-sm text-muted-foreground">
                        Report waste dumped in public places
                      </p>
                      <Badge variant="outline" className="mt-2">+50 Points</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Reports */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Recent Reports</h3>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <Card key={report.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={
                                report.status === "Resolved" ? "default" :
                                report.status === "In Progress" ? "secondary" : "outline"
                              }>
                                {report.status}
                              </Badge>
                              <span className="text-sm font-medium">{report.type}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{report.location}</p>
                            <p className="text-xs text-muted-foreground">{report.timeAgo}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="default" className="bg-success">
                              +{report.points} pts
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          {reportType && !reportSubmitted && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Button variant="ghost" size="sm" onClick={() => setReportType(null)}>
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold">
                  Report {reportType === 'missed-pickup' ? 'Missed Pickup' : 'Illegal Dumping'}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Enter location or address"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <MapPin className="mr-2 h-4 w-4" />
                    Use Current Location
                  </Button>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder={
                      reportType === 'missed-pickup' 
                        ? "Describe when the pickup was scheduled and any other relevant details..."
                        : "Describe the waste dumping situation, types of waste, and any hazards..."
                    }
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['low', 'medium', 'high'].map((level) => (
                      <Button
                        key={level}
                        variant={formData.urgency === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, urgency: level }))}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="photo">Photo Evidence</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('photo')?.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {formData.photo ? formData.photo.name : 'Upload Photo'}
                    </Button>
                  </div>
                  {formData.photo && (
                    <Badge variant="default" className="mt-2">
                      Photo uploaded
                    </Badge>
                  )}
                </div>

                <Button 
                  variant="eco" 
                  size="lg" 
                  className="w-full"
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || !formData.location || !formData.description}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </div>
          )}

          {reportSubmitted && (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 p-6 bg-success/10 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-xl font-bold text-success mb-2">
                Report Submitted Successfully!
              </h3>
              <p className="text-muted-foreground mb-4">
                Thank you for helping keep our community clean. Your report has been sent to the local authorities.
              </p>
              <div className="bg-success/10 rounded-lg p-4 mb-4">
                <p className="text-sm">
                  <strong>Report ID:</strong> RPT{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
                <p className="text-sm">
                  <strong>Expected Resolution:</strong> 2-3 business days
                </p>
                <p className="text-sm">
                  <strong>Points Earned:</strong> +{reportType === 'waste-dumping' ? 50 : 30}
                </p>
              </div>
              <Button variant="eco" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}
        </div>

        {!reportSubmitted && (
          <AlertDialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportingSystem;