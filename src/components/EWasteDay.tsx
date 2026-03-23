import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Recycle,
  Smartphone,
  Monitor,
  Tv,
  Battery,
  Users,
  Navigation,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EWasteDayProps {
  isOpen: boolean;
  onClose: () => void;
}

const EWasteDay = ({ isOpen, onClose }: EWasteDayProps) => {
  const [registered, setRegistered] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const { toast } = useToast();

  const eWasteTypes = [
    { icon: <Smartphone className="h-8 w-8" />, name: "Mobile Phones", description: "Old phones, chargers, accessories" },
    { icon: <Monitor className="h-8 w-8" />, name: "Computers", description: "Laptops, desktops, keyboards, mice" },
    { icon: <Tv className="h-8 w-8" />, name: "Electronics", description: "TVs, radios, cameras, printers" },
    { icon: <Battery className="h-8 w-8" />, name: "Batteries", description: "All types of used batteries" }
  ];

  const locations = [
    {
      id: "central-park",
      name: "Central Park Collection Point",
      address: "Main Gate, Central Park, Sector 5",
      time: "9:00 AM - 4:00 PM",
      registered: 45,
      capacity: 100,
      distance: "1.2 km"
    },
    {
      id: "municipal-office",
      name: "Municipal Office",
      address: "Civil Lines, Municipal Corporation Building",
      time: "10:00 AM - 3:00 PM", 
      registered: 32,
      capacity: 80,
      distance: "2.1 km"
    },
    {
      id: "community-center",
      name: "Community Center",
      address: "Block A, Residential Complex",
      time: "11:00 AM - 5:00 PM",
      registered: 28,
      capacity: 60,
      distance: "0.8 km"
    }
  ];

  const handleRegister = () => {
    if (!selectedLocation) {
      toast({
        title: "Please select a location",
        description: "Choose a collection point to register for E-Waste Day.",
        variant: "destructive"
      });
      return;
    }

    setRegistered(true);
    toast({
      title: "Registration Successful! 🎉",
      description: "You're registered for E-Waste Day. Check your email for details.",
    });
  };

  const resetForm = () => {
    setRegistered(false);
    setSelectedLocation(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-2xl">
            <Recycle className="mr-3 h-6 w-6 text-primary" />
            E-Waste Collection Day
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Join our monthly E-Waste collection drive - Saturday, October 21st, 2024
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {!registered ? (
            <>
              {/* Information Section */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <AlertCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Important Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span><strong>Date:</strong> October 21, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span><strong>Time:</strong> 9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span><strong>Registration:</strong> Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accepted E-Waste Types */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Accepted E-Waste Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {eWasteTypes.map((type, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <div className="flex justify-center mb-3 text-primary">
                          {type.icon}
                        </div>
                        <h4 className="font-medium mb-2">{type.name}</h4>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Collection Locations */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Collection Point</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {locations.map((location) => (
                    <Card 
                      key={location.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedLocation === location.id ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">{location.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Navigation className="h-3 w-3" />
                          {location.distance} away
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                            <span>{location.address}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{location.time}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{location.registered}/{location.capacity}</span>
                            </div>
                            <Badge 
                              variant={location.registered < location.capacity * 0.8 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {location.registered < location.capacity * 0.8 ? "Available" : "Almost Full"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Collection Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Remove all personal data from devices before dropping off</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Separate batteries from devices if possible</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Bring items in bags or boxes for easy handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>Get a collection receipt for your records</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Registration Confirmation */
            <div className="text-center py-8">
              <div className="mx-auto mb-6 p-6 bg-success/10 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              
              <h3 className="text-2xl font-bold text-success mb-3">
                Registration Confirmed!
              </h3>
              
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You're successfully registered for E-Waste Collection Day. We'll send you a reminder email 24 hours before the event.
              </p>

              <Card className="text-left max-w-md mx-auto mb-6">
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold mb-3">Your Registration Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Event:</span>
                      <span className="font-medium">E-Waste Collection Day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">October 21, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{locations.find(l => l.id === selectedLocation)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{locations.find(l => l.id === selectedLocation)?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration ID:</span>
                      <span className="font-medium">EW{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/10 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h4 className="font-medium mb-2">What to expect:</h4>
                <ul className="text-sm space-y-1 text-left">
                  <li>• Reminder email 24 hours before</li>
                  <li>• On-site assistance for sorting</li>
                  <li>• Digital receipt for your contribution</li>
                  <li>• Eco-points added to your account</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          {!registered ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleRegister}
                disabled={!selectedLocation}
                className="bg-primary hover:bg-primary/90"
              >
                Register for E-Waste Day
              </Button>
            </>
          ) : (
            <Button onClick={handleClose} className="bg-primary hover:bg-primary/90">
              Done
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EWasteDay;