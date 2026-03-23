// src/components/CitizenPickupRequests.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  MapPin, Clock, CheckCircle, X, AlertTriangle,
  User, Phone, Trash2, Flame, Recycle, Package,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CitizenPickupRequestsProps {
  isOpen: boolean;
  onClose: () => void;
}

type Urgency = 'high' | 'medium' | 'low';
type Status  = 'pending' | 'assigned' | 'completed' | 'rejected';

interface PickupRequest {
  id: string;
  citizen: string;
  phone: string;
  address: string;
  area: string;
  wasteType: string;
  wasteIcon: React.ReactNode;
  urgency: Urgency;
  scheduledTime: string;
  quantity: string;
  notes: string;
  status: Status;
  distance: string;
}

const INITIAL_REQUESTS: PickupRequest[] = [
  {
    id: 'PR001', citizen: 'Aisha Khan',    phone: '+91 98765 43210',
    address: '12/A, Sector 4, Green Park', area: 'North Zone',
    wasteType: 'Hazardous Waste',   wasteIcon: <Flame className="h-4 w-4" />,
    urgency: 'high',   scheduledTime: 'Today, 10:00 AM',
    quantity: '~20 kg', notes: 'Old batteries and paint cans', status: 'pending', distance: '1.2 km',
  },
  {
    id: 'PR002', citizen: 'Mohan Das',     phone: '+91 98765 43211',
    address: 'B-7, MG Road, Lajpat Nagar', area: 'South Zone',
    wasteType: 'Bulk Furniture',    wasteIcon: <Package className="h-4 w-4" />,
    urgency: 'medium', scheduledTime: 'Today, 11:30 AM',
    quantity: '3 items', notes: 'Old sofa, wardrobe, table', status: 'pending', distance: '2.5 km',
  },
  {
    id: 'PR003', citizen: 'Sunita Sharma', phone: '+91 98765 43212',
    address: 'Plot 5, Rohini Sector 3',    area: 'West Zone',
    wasteType: 'Electronic Waste',  wasteIcon: <Recycle className="h-4 w-4" />,
    urgency: 'low',    scheduledTime: 'Today, 2:00 PM',
    quantity: '~8 kg', notes: 'Old laptop, phones, cables', status: 'assigned', distance: '3.8 km',
  },
  {
    id: 'PR004', citizen: 'Ravi Kumar',    phone: '+91 98765 43213',
    address: 'Flat 201, DDA Flats, Dwarka', area: 'West Zone',
    wasteType: 'Construction Debris', wasteIcon: <Trash2 className="h-4 w-4" />,
    urgency: 'high',   scheduledTime: 'Today, 3:30 PM',
    quantity: '~80 kg', notes: 'Renovation debris — tiles, cement bags', status: 'pending', distance: '5.1 km',
  },
  {
    id: 'PR005', citizen: 'Priya Verma',   phone: '+91 98765 43214',
    address: '22, Vasant Kunj Phase II',    area: 'South Zone',
    wasteType: 'Garden Waste',      wasteIcon: <Recycle className="h-4 w-4" />,
    urgency: 'low',    scheduledTime: 'Tomorrow, 9:00 AM',
    quantity: '~15 kg', notes: 'Tree branches and dry leaves', status: 'pending', distance: '4.3 km',
  },
  {
    id: 'PR006', citizen: 'Deepak Gupta',  phone: '+91 98765 43215',
    address: 'H-14, Saket Block C',         area: 'South Zone',
    wasteType: 'Dry Waste',          wasteIcon: <Trash2 className="h-4 w-4" />,
    urgency: 'medium', scheduledTime: 'Tomorrow, 11:00 AM',
    quantity: '~10 kg', notes: 'Cardboard, paper, plastic bottles', status: 'pending', distance: '2.9 km',
  },
];

const urgencyConfig: Record<Urgency, { label: string; bg: string; text: string; border: string }> = {
  high:   { label: 'High',   bg: 'bg-red-100 dark:bg-red-950',    text: 'text-red-700 dark:text-red-300',    border: 'border-red-400' },
  medium: { label: 'Medium', bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-400' },
  low:    { label: 'Low',    bg: 'bg-green-100 dark:bg-green-950', text: 'text-green-700 dark:text-green-300',  border: 'border-green-400' },
};

const statusConfig: Record<Status, { label: string; className: string }> = {
  pending:   { label: 'Pending',   className: 'bg-orange-500 text-white' },
  assigned:  { label: 'Assigned',  className: 'bg-blue-500 text-white' },
  completed: { label: 'Completed', className: 'bg-green-500 text-white' },
  rejected:  { label: 'Rejected',  className: 'bg-gray-400 text-white' },
};

const CitizenPickupRequests = ({ isOpen, onClose }: CitizenPickupRequestsProps) => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<PickupRequest[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = useState<'all' | Urgency | Status>('all');

  const updateStatus = (id: string, status: Status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    const labels: Record<Status, string> = { completed: 'Marked as Completed ✅', assigned: 'Assigned to you 📋', rejected: 'Request Rejected ❌', pending: 'Moved to Pending' };
    toast({ title: labels[status], description: `Request ${id} updated.` });
  };

  const filtered = requests.filter(r => {
    if (filter === 'all') return true;
    return r.urgency === filter || r.status === filter;
  });

  const counts = {
    pending:   requests.filter(r => r.status === 'pending').length,
    high:      requests.filter(r => r.urgency === 'high' && r.status !== 'completed' && r.status !== 'rejected').length,
    assigned:  requests.filter(r => r.status === 'assigned').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[88vh] overflow-hidden flex flex-col p-0">

        {/* Header */}
        <AlertDialogHeader className="p-4 md:p-5 pb-3 border-b">
          <AlertDialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Citizen Pickup Requests
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs md:text-sm">
            Manage and respond to waste pickup requests from citizens in your zone
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">

          {/* Summary stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Pending',   val: counts.pending,   color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950' },
              { label: 'High',      val: counts.high,      color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-950' },
              { label: 'Assigned',  val: counts.assigned,  color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-950' },
              { label: 'Completed', val: counts.completed, color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-950' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center border`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'high', 'assigned', 'completed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all border
                  ${filter === f ? 'bg-primary text-white border-primary' : 'bg-muted/50 border-border hover:bg-muted'}`}>
                {f === 'all' ? `All (${requests.length})` : f}
              </button>
            ))}
          </div>

          {/* Request cards */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
                <p className="font-semibold text-sm">No requests in this category</p>
              </div>
            )}
            {filtered.map(req => {
              const urg  = urgencyConfig[req.urgency];
              const stat = statusConfig[req.status];
              return (
                <Card key={req.id} className={`border-l-4 ${urg.border}`}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className={`p-1.5 rounded-lg ${urg.bg}`}>{req.wasteIcon}</div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="font-semibold text-sm">{req.citizen}</span>
                            <Badge className={`text-xs px-1.5 py-0 ${stat.className}`}>{stat.label}</Badge>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${urg.bg} ${urg.text}`}>
                              {urg.label} Priority
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-primary">{req.wasteType} — {req.quantity}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">{req.distance}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0 text-primary" />
                        <span className="truncate">{req.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span>{req.area}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span>{req.scheduledTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{req.phone}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-2.5 py-1.5 mb-2.5">
                        📝 {req.notes}
                      </p>
                    )}

                    {/* Action buttons */}
                    {req.status !== 'completed' && req.status !== 'rejected' && (
                      <div className="flex gap-2 flex-wrap">
                        {req.status === 'pending' && (
                          <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => updateStatus(req.id, 'assigned')}>
                            <User className="h-3 w-3 mr-1" /> Assign to Me
                          </Button>
                        )}
                        <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateStatus(req.id, 'completed')}>
                          <CheckCircle className="h-3 w-3 mr-1" /> Mark Complete
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => updateStatus(req.id, 'rejected')}>
                          <X className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                    {req.status === 'completed' && (
                      <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Completed successfully
                      </p>
                    )}
                    {req.status === 'rejected' && (
                      <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                        <X className="h-3 w-3" /> Request rejected
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <AlertDialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CitizenPickupRequests;