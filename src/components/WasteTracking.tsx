import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Truck, MapPin, Clock, Navigation, Phone, CheckCircle, Calendar } from "lucide-react";
import LiveMap from "./LiveMap";

interface WasteTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

const WasteTracking = ({ isOpen, onClose }: WasteTrackingProps) => {
  const [activeVehicles, setActiveVehicles] = useState([
    {
      id: "WM001",
      type: "Collection Truck",
      driver: "Rajesh Kumar",
      area: "Sector 15-18",
      status: "En Route",
      eta: "15 mins",
      currentLocation: "Park Street",
      phone: "+91 98765 43210",
      capacity: "75%",
      nextStop: "Community Center"
    },
    {
      id: "WM002",
      type: "Recycling Van",
      driver: "Priya Sharma",
      area: "Sector 12-14",
      status: "Collecting",
      eta: "25 mins",
      currentLocation: "Mall Road",
      phone: "+91 98765 43211",
      capacity: "45%",
      nextStop: "Metro Station"
    },
    {
      id: "WM003",
      type: "Hazardous Waste",
      driver: "Vikram Singh",
      area: "Industrial Zone",
      status: "Available",
      eta: "40 mins",
      currentLocation: "Processing Center",
      phone: "+91 98765 43212",
      capacity: "20%",
      nextStop: "Office Complex"
    }
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [scheduledPickups, setScheduledPickups] = useState([
    {
      id: "SP001",
      address: "123 Main Street",
      wasteType: "Bulk Furniture",
      scheduledTime: "Today, 2:00 PM",
      status: "Confirmed"
    },
    {
      id: "SP002",
      address: "456 Park Avenue",
      wasteType: "Electronic Waste",
      scheduledTime: "Tomorrow, 10:00 AM",
      status: "Pending"
    }
  ]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setActiveVehicles(prev => prev.map(vehicle => ({
        ...vehicle,
        eta: `${Math.max(5, parseInt(vehicle.eta) - 1)} mins`,
        capacity: `${Math.min(90, parseInt(vehicle.capacity) + Math.floor(Math.random() * 5))}%`
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Route": return "bg-primary text-primary-foreground";
      case "Collecting": return "bg-warning text-warning-foreground";
      case "Available": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Live Waste Collection Tracking
          </AlertDialogTitle>
          <AlertDialogDescription>
            Track waste collection vehicles in your area and manage pickup schedules
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Active Vehicles Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Active Vehicles in Your Area
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-eco transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{vehicle.id}</CardTitle>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <CardDescription>{vehicle.type}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Navigation className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{vehicle.currentLocation}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>ETA: {vehicle.eta}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Capacity: {vehicle.capacity}</span>
                      <span className="text-muted-foreground">Area: {vehicle.area}</span>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Next Stop: {vehicle.nextStop}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicle(vehicle.id)}
                      >
                        Track Live
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Scheduled Pickups Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Your Scheduled Pickups
            </h3>

            <div className="space-y-3">
              {scheduledPickups.map((pickup) => (
                <Card key={pickup.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={pickup.status === "Confirmed" ? "default" : "secondary"}>
                            {pickup.status}
                          </Badge>
                          <span className="text-sm font-medium">{pickup.wasteType}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{pickup.address}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {pickup.scheduledTime}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="eco" className="w-full mt-4">
              Schedule New Pickup
            </Button>
          </div>

          {/* Live Map Placeholder */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Live Location Map</h3>
            <LiveMap vehicles={activeVehicles.filter(v => selectedVehicle ? v.id === selectedVehicle : true)} />
          </div>
        </div>

        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WasteTracking;