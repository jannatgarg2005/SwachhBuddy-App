// src/components/ragpicker/DigitalIDCard.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RagPickerProfile } from "@/services/ragpickerIdentity";
import { ShieldCheck, Star, Recycle, Download } from "lucide-react";
import { Timestamp } from "firebase/firestore";

interface Props {
  profile: RagPickerProfile;
  onDownload?: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 700) return "text-green-600";
  if (score >= 400) return "text-amber-600";
  return "text-slate-500";
};

const getScoreBadge = (score: number) => {
  if (score >= 700) return { label: "Gold", color: "bg-amber-400 text-amber-900" };
  if (score >= 400) return { label: "Silver", color: "bg-slate-300 text-slate-800" };
  return { label: "Bronze", color: "bg-amber-700 text-white" };
};

const DigitalIDCard: React.FC<Props> = ({ profile, onDownload }) => {
  const badge  = getScoreBadge(profile.swachhScore);
  const regDate = profile.registeredAt instanceof Timestamp
    ? profile.registeredAt.toDate().toLocaleDateString("en-IN")
    : new Date(profile.registeredAt as Date).toLocaleDateString("en-IN");

  return (
    <div
      id="digital-id-card"
      className="relative overflow-hidden rounded-2xl border-2 border-green-700 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white shadow-2xl w-full max-w-sm"
      style={{ aspectRatio: "1.586/1", minHeight: 200 }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Recycle
            key={i}
            className="absolute text-white"
            style={{ top: `${(i % 4) * 28}%`, left: `${(i % 3) * 38}%`, width: 48, height: 48 }}
          />
        ))}
      </div>

      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-200 tracking-widest uppercase">
              <Recycle className="h-3 w-3" /> SwachhBuddy
            </div>
            <p className="text-[10px] text-green-300 mt-0.5">Digital Waste Picker Identity</p>
          </div>
          {profile.isVerified ? (
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-green-200" />
              <span className="font-semibold">Verified</span>
            </div>
          ) : (
            <Badge variant="outline" className="text-amber-300 border-amber-300 text-[10px]">
              Pending
            </Badge>
          )}
        </div>

        {/* Name + ID */}
        <div>
          <h2 className="text-xl font-bold leading-tight">{profile.name}</h2>
          <p className="text-xs text-green-300 font-mono">{profile.id}</p>
          <p className="text-xs text-green-200 mt-0.5">{profile.city} · {profile.zone}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Swachh Score */}
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className={`text-lg font-bold ${getScoreColor(profile.swachhScore)} text-white`}>
              {profile.swachhScore}
            </div>
            <div className="text-[9px] text-green-200 leading-tight">Swachha<br/>Score</div>
          </div>
          {/* Total kg */}
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">
              {profile.totalKgCollected.toFixed(0)}<span className="text-xs">kg</span>
            </div>
            <div className="text-[9px] text-green-200 leading-tight">Total<br/>Collected</div>
          </div>
          {/* Earnings */}
          <div className="bg-white/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold">
              ₹{profile.totalEarningsRs >= 1000
                ? (profile.totalEarningsRs / 1000).toFixed(1) + "k"
                : profile.totalEarningsRs.toFixed(0)
              }
            </div>
            <div className="text-[9px] text-green-200 leading-tight">Verified<br/>Earnings</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-[9px] text-green-300">Since {regDate}</div>
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${badge.color}`}>
            <Star className="h-2.5 w-2.5" /> {badge.label} Member
          </div>
        </div>
      </div>
    </div>
  );
};

interface CardWithButtonProps extends Props {
  showDownload?: boolean;
}

export const DigitalIDCardWithActions: React.FC<CardWithButtonProps> = ({
  profile,
  showDownload = true,
}) => {
  const handleDownload = () => {
    // Simple text fallback
    const text = [
      "SWACHH BUDDY DIGITAL IDENTITY",
      `Name: ${profile.name}`,
      `ID: ${profile.id}`,
      `City: ${profile.city} | Zone: ${profile.zone}`,
      `Swachh Score: ${profile.swachhScore}`,
      `Total Collected: ${profile.totalKgCollected} kg`,
      `Verified Earnings: ₹${profile.totalEarningsRs}`,
      `Status: ${profile.isVerified ? "Verified ✅" : "Pending Verification"}`,
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `SwachhBuddy-ID-${profile.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-3">
      <DigitalIDCard profile={profile} />
      {showDownload && (
        <Button
          variant="outline"
          className="w-full text-green-700 border-green-300"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download ID Card
        </Button>
      )}
    </div>
  );
};

export default DigitalIDCard;