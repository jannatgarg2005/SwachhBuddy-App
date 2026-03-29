// src/components/ragpicker/RagPickerIdentityWidget.tsx
// Compact card widget for embedding in CDashboard / EDashboard quick-actions
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IdCard, UserPlus, Package, ArrowRight } from "lucide-react";
import RagPickerRegistration from "./RagPickerRegistration";
import LogCollectionModal from "./LogCollectionModal";
import { RagPickerProfile } from "@/services/ragpickerIdentity";

interface Props {
  /** If passed, skip registration and go straight to logging */
  preloadedProfile?: RagPickerProfile | null;
  verifyingEmployeeId?: string;
}

const RagPickerIdentityWidget: React.FC<Props> = ({ preloadedProfile, verifyingEmployeeId }) => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showLog, setShowLog]           = useState(false);
  const [profile, setProfile]           = useState<RagPickerProfile | null>(preloadedProfile || null);

  return (
    <>
      <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-green-700 text-white rounded-lg p-2 shrink-0">
              <IdCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-green-800 dark:text-green-300">Rag Picker Digital ID</h3>
              <p className="text-xs text-green-600 dark:text-green-400">
                Register waste pickers · log collections · generate income certificates
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1"
              onClick={() => setShowRegister(true)}
            >
              <UserPlus className="h-3.5 w-3.5" /> Register
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1"
              onClick={() => setShowLog(true)}
            >
              <Package className="h-3.5 w-3.5" /> Log Collection
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs gap-1"
            onClick={() => navigate("/ragpicker-identity")}
          >
            Open Full Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>

      <RagPickerRegistration
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegistered={p => { setProfile(p); setShowRegister(false); }}
      />
      <LogCollectionModal
        isOpen={showLog}
        onClose={() => setShowLog(false)}
        ragPickerProfile={profile}
        verifyingEmployeeId={verifyingEmployeeId}
      />
    </>
  );
};

export default RagPickerIdentityWidget;