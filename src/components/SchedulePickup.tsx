import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

interface SchedulePickupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulePickup = ({ isOpen, onClose }: SchedulePickupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupScheduled, setPickupScheduled] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const [formData, setFormData] = useState({
    pickupType: "",
    wasteType: "",
    quantity: "",
    address: "",
    contactNumber: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
    urgency: "normal",
  });

  const { toast } = useToast();

  const platformFee = 50; // fixed fee

  const pickupTypes = [
    {
      value: "normal",
      label: "Normal Waste",
      description: "Daily household waste collection",
    },
    {
      value: "recycle",
      label: "Recyclable Waste",
      description: "Plastic, glass, paper etc.",
    },
    {
      value: "scrap",
      label: "Scrap Dealer Pickup",
      description: "Direct pickup by scrap dealers",
    },
    {
      value: "special",
      label: "Special / Bulk Waste",
      description: "Furniture, electronics, garden etc.",
    },
  ];

  const wasteTypes = [
    {
      value: "bulk-furniture",
      label: "Bulk Furniture",
      price: "Free",
      description: "Old furniture, mattresses",
    },
    {
      value: "electronic",
      label: "Electronic Waste",
      price: "Free",
      description: "Computers, phones, appliances",
    },
    {
      value: "construction",
      label: "Construction Debris",
      price: "₹200",
      description: "Tiles, cement, wood",
    },
    {
      value: "garden",
      label: "Garden Waste",
      price: "Free",
      description: "Branches, leaves, organic matter",
    },
    {
      value: "hazardous",
      label: "Hazardous Waste",
      price: "₹150",
      description: "Batteries, chemicals, paint",
    },
    {
      value: "mixed-bulk",
      label: "Mixed Bulk Waste",
      price: "₹100",
      description: "Large quantities of mixed waste",
    },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
  ];

  const selectedWasteType = wasteTypes.find(
    (type) => type.value === formData.wasteType
  );

  const totalCharge = () => {
    let wasteCharge = 0;
    if (formData.pickupType === "special" && selectedWasteType) {
      wasteCharge =
        selectedWasteType.price !== "Free"
          ? parseInt(selectedWasteType.price.replace("₹", ""))
          : 0;
    }
    return wasteCharge + platformFee;
  };

  const sendConfirmationEmail = (pickupId: string) => {
    emailjs
      .send(
        "service_j5k5271", // replace with EmailJS Service ID
        "template_knpwi0s", // replace with EmailJS Template ID
        {
          to_email: formData.email,
          pickup_id: pickupId,
          pickup_date: formData.preferredDate,
          pickup_time: formData.preferredTime,
          pickup_type: formData.pickupType,
        },
        "Mkyk92X3nDoA5nDvu" // replace with EmailJS Public Key
      )
      .then(
        () => {
          console.log("Email sent successfully");
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
  };

  const handleSubmit = () => {
    const pickupId =
      "SP" + Math.random().toString(36).substr(2, 6).toUpperCase();
    setPickupScheduled(true);
    sendConfirmationEmail(pickupId);
    toast({
      title: "Pickup Scheduled Successfully! 📅",
      description: "Confirmation email sent to your registered email.",
    });
  };

  const handleReschedule = () => {
    setRescheduling(true);
    setPickupScheduled(false);
    setCurrentStep(3);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setPickupScheduled(false);
    setRescheduling(false);
    setFormData({
      pickupType: "",
      wasteType: "",
      quantity: "",
      address: "",
      contactNumber: "",
      email: "",
      preferredDate: "",
      preferredTime: "",
      specialInstructions: "",
      urgency: "normal",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Schedule Pickup
          </AlertDialogTitle>
          <AlertDialogDescription>
            Request collection for your waste items
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6">
          {!pickupScheduled ? (
            <>
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-0.5 mx-2 ${
                          step < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Pickup Type */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Pickup Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pickupTypes.map((type) => (
                      <Card
                        key={type.value}
                        className={`cursor-pointer transition-all duration-300 ${
                          formData.pickupType === type.value
                            ? "ring-2 ring-primary shadow-eco"
                            : ""
                        }`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            pickupType: type.value,
                          }))
                        }
                      >
                        <CardContent className="p-4">
                          <h4 className="font-medium">{type.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="eco"
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.pickupType}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Waste / Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {formData.pickupType === "special" && (
                    <div>
                      <h3 className="text-lg font-semibold">
                        Select Waste Type
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {wasteTypes.map((type) => (
                          <Card
                            key={type.value}
                            className={`cursor-pointer ${
                              formData.wasteType === type.value
                                ? "ring-2 ring-primary shadow-eco"
                                : ""
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                wasteType: type.value,
                              }))
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{type.label}</h4>
                                <Badge
                                  variant={
                                    type.price === "Free"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {type.price}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {type.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Common details */}
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Pickup Address</Label>
                    <Textarea
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Contact Number</Label>
                    <Input
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactNumber: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="eco"
                      onClick={() => setCurrentStep(3)}
                      disabled={
                        !formData.address ||
                        !formData.contactNumber ||
                        !formData.email ||
                        (formData.pickupType === "special" &&
                          !formData.wasteType)
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Schedule Pickup</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred Date</Label>
                      <Input

                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferredDate: e.target.value,
                          }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label>Preferred Time</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferredTime: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>



                  {/* Summary */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pickup Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Pickup Type:</span>
                        <span className="font-medium capitalize">
                          {formData.pickupType}
                        </span>
                      </div>
                      {formData.pickupType === "special" && (
                        <div className="flex justify-between">
                          <span>Waste Type:</span>
                          <span className="font-medium">
                            {selectedWasteType?.label}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Platform Fee:</span>
                        <span className="font-medium">₹{platformFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">₹{totalCharge()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="eco"
                      className="flex-1"
                      onClick={handleSubmit}
                      disabled={!formData.preferredDate || !formData.preferredTime}
                    >
                      Schedule Pickup
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Confirmation */
            <div className="text-center py-6">
              <div className="mx-auto mb-4 p-6 bg-success/10 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-xl font-bold text-success mb-2">
                Pickup Scheduled Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                A confirmation email has been sent to your registered email.
              </p>

              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span className="font-medium">What's Next?</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Confirmation call within 2 hours</li>
                  <li>• SMS with exact pickup time 1 day before</li>
                  <li>• Vehicle tracking details on pickup day</li>
                </ul>
              </div>

              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={handleReschedule}>
                  Reschedule
                </Button>
                <Button variant="eco" onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>

        {!pickupScheduled && (
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

export default SchedulePickup;