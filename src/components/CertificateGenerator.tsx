// src/components/CertificateGenerator.tsx
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Award, X, CheckCircle, Edit2, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface CertificateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
  completedModules: { title: string; completed: boolean }[];
  certificateTitle?: string;   // e.g. "Waste Management Professional" or "Student Sustainability Expert"
  trackColor?: string;         // hex color e.g. "#16a34a" (green) or "#7c3aed" (purple)
}

const CERT_W = 1056;
const CERT_H = 748;

const drawCertificate = (
  canvas: HTMLCanvasElement,
  name: string,
  completedModules: { title: string; completed: boolean }[],
  date: string,
  certTitle: string,
  color: string,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width  = CERT_W;
  canvas.height = CERT_H;

  // Parse color to a lighter version for backgrounds
  const colorLight = color + "22"; // low opacity version

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, CERT_W, CERT_H);
  bgGrad.addColorStop(0,   "#f9fafb");
  bgGrad.addColorStop(0.5, color + "11");
  bgGrad.addColorStop(1,   "#f9fafb");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Outer border
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, CERT_W - 40, CERT_H - 40);
  ctx.strokeStyle = color + "66";
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, CERT_W - 64, CERT_H - 64);

  // Corner dots
  [[48,48],[CERT_W-48,48],[48,CERT_H-48],[CERT_W-48,CERT_H-48]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
  });

  // Header stripe
  const hGrad = ctx.createLinearGradient(0,0,CERT_W,0);
  hGrad.addColorStop(0, color + "dd"); hGrad.addColorStop(0.5, color); hGrad.addColorStop(1, color + "dd");
  ctx.fillStyle = hGrad;
  ctx.fillRect(40, 40, CERT_W - 80, 90);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("SWACHH BUDDY — SUSTAINABLE DEVELOPMENT SYSTEM", CERT_W/2, 75);
  ctx.font = "12px 'Georgia', serif";
  ctx.fillStyle = "#ffffff99";
  ctx.fillText("Swachh Bharat Mission  •  Waste Management Education Programme", CERT_W/2, 98);

  // Symbol
  const cx = CERT_W/2;
  ctx.save(); ctx.translate(cx, 178); ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    ctx.save(); ctx.rotate((i * 2 * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0,-28); ctx.lineTo(10,-14); ctx.lineTo(5,-14);
    ctx.lineTo(5,-4); ctx.lineTo(-5,-4); ctx.lineTo(-5,-14);
    ctx.lineTo(-10,-14); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Certificate of Completion
  ctx.fillStyle = color;
  ctx.font = "italic 22px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", CERT_W/2, 228);

  ctx.strokeStyle = color + "88"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx-180, 238); ctx.lineTo(cx+180, 238); ctx.stroke();

  ctx.fillStyle = "#374151"; ctx.font = "16px 'Georgia', serif";
  ctx.fillText("This is to certify that", CERT_W/2, 272);

  // Name
  const nGrad = ctx.createLinearGradient(cx-200,0,cx+200,0);
  nGrad.addColorStop(0, color + "cc"); nGrad.addColorStop(0.5, color); nGrad.addColorStop(1, color + "cc");
  ctx.fillStyle = nGrad;
  ctx.font = "bold 42px 'Georgia', serif";
  ctx.fillText(name || "Your Name", CERT_W/2, 322);

  const nW = ctx.measureText(name || "Your Name").width;
  ctx.strokeStyle = color; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx-nW/2,330); ctx.lineTo(cx+nW/2,330); ctx.stroke();

  ctx.fillStyle = "#374151"; ctx.font = "15px 'Georgia', serif";
  ctx.fillText("has successfully completed all mandatory training modules in", CERT_W/2, 362);
  ctx.font = "bold 15px 'Georgia', serif"; ctx.fillStyle = color;
  ctx.fillText(certTitle, CERT_W/2, 384);

  // Module pills
  const done = completedModules.filter(m => m.completed);
  const pillW = 220, pillH = 30;
  const totalPW = done.length * (pillW+12) - 12;
  const pStartX = cx - totalPW/2;
  done.forEach((m, i) => {
    const px = pStartX + i*(pillW+12), py = 408;
    ctx.fillStyle = color + "22"; ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    roundRect(ctx, px, py, pillW, pillH, 6); ctx.fill(); ctx.stroke();
    ctx.fillStyle = color; ctx.font = "bold 11px Arial, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("✓ " + m.title, px + pillW/2, py+19);
  });

  ctx.fillStyle = "#6b7280"; ctx.font = "13px 'Georgia', serif"; ctx.textAlign = "center";
  ctx.fillText(`Issued on: ${date}`, CERT_W/2, 462);

  // Left signature
  ctx.strokeStyle = "#9ca3af"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(120,565); ctx.lineTo(340,565); ctx.stroke();
  ctx.fillStyle = "#374151"; ctx.font = "bold 13px 'Georgia', serif"; ctx.textAlign = "center";
  ctx.fillText("Programme Director", 230, 582);
  ctx.fillStyle = "#6b7280"; ctx.font = "11px 'Georgia', serif";
  ctx.fillText("Swachh Buddy Initiative", 230, 597);

  // Seal
  ctx.save(); ctx.translate(cx, 548);
  ctx.beginPath(); ctx.arc(0,0,46,0,Math.PI*2);
  const sGrad = ctx.createRadialGradient(0,0,10,0,0,46);
  sGrad.addColorStop(0, color + "22"); sGrad.addColorStop(1, color + "44");
  ctx.fillStyle = sGrad; ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(0,0,38,0,Math.PI*2); ctx.strokeStyle = color + "66"; ctx.lineWidth=1; ctx.stroke();
  ctx.fillStyle = color; ctx.font = "bold 9px Arial,sans-serif"; ctx.textAlign="center";
  ctx.fillText("SWACHH",0,-14); ctx.fillText("BUDDY",0,-3);
  ctx.font = "7px Arial,sans-serif";
  ctx.fillText("CERTIFIED",0,9); ctx.fillText(`✓ ${done.length}/3 MODULES`,0,20);
  ctx.restore();

  // Right signature
  ctx.strokeStyle="#9ca3af"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(CERT_W-340,565); ctx.lineTo(CERT_W-120,565); ctx.stroke();
  ctx.fillStyle="#374151"; ctx.font="bold 13px 'Georgia',serif"; ctx.textAlign="center";
  ctx.fillText("Swachh Bharat Mission", CERT_W-230, 582);
  ctx.fillStyle="#6b7280"; ctx.font="11px 'Georgia',serif";
  ctx.fillText("Government of India", CERT_W-230, 597);

  // Footer
  const fGrad = ctx.createLinearGradient(0,0,CERT_W,0);
  fGrad.addColorStop(0,color+"dd"); fGrad.addColorStop(0.5,color); fGrad.addColorStop(1,color+"dd");
  ctx.fillStyle = fGrad;
  ctx.fillRect(40, CERT_H-80, CERT_W-80, 38);
  ctx.fillStyle="#ffffff"; ctx.font="11px 'Georgia',serif"; ctx.textAlign="center";
  ctx.fillText("🌱 Together for a Cleaner, Greener India  •  swachh-buddy-sigma.vercel.app", CERT_W/2, CERT_H-56);
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  isOpen, onClose, defaultName = "", completedModules,
  certificateTitle = "Waste Management Professional",
  trackColor = "#16a34a",
}) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [name, setName]       = useState(defaultName);
  const [editing, setEditing] = useState(!defaultName);

  const allDone   = completedModules.every(m => m.completed);
  const doneCount = completedModules.filter(m => m.completed).length;

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCertificate(canvas, name, completedModules, today, certificateTitle, trackColor);
    const preview = previewRef.current;
    if (preview) {
      preview.width  = CERT_W / 2;
      preview.height = CERT_H / 2;
      const pCtx = preview.getContext("2d");
      if (pCtx) { pCtx.setTransform(1,0,0,1,0,0); pCtx.scale(0.5, 0.5); pCtx.drawImage(canvas, 0, 0); }
    }
  }, [name, isOpen, completedModules, certificateTitle, trackColor]);

  const handleDownload = () => {
    if (!allDone) { toast.error("Complete all 3 modules first!"); return; }
    if (!name.trim()) { toast.error("Please enter your name first."); return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawCertificate(canvas, name, completedModules, today, certificateTitle, trackColor);
    const link = document.createElement("a");
    link.download = `SwachhBuddy_${certificateTitle.replace(/\s+/g,"_")}_${name.trim().replace(/\s+/g,"_")}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
    toast.success("Certificate downloaded! 🎉");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[95vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow" style={{ backgroundColor: trackColor }}>
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{certificateTitle}</h2>
              <p className="text-xs text-gray-500">Download your official completion certificate</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all">
            <ArrowLeft className="h-4 w-4" /> Back to Learning
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Module status */}
          <div className="grid grid-cols-3 gap-2">
            {completedModules.map((m, i) => (
              <div key={i} className={`p-3 rounded-xl border-2 text-center transition-all
                ${m.completed ? "bg-green-50 border-green-300 dark:bg-green-950" : "bg-gray-50 border-gray-200 dark:bg-gray-800"}`}>
                {m.completed
                  ? <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1.5" />
                  : <div className="h-5 w-5 rounded-full border-2 border-gray-300 mx-auto mb-1.5" />}
                <p className={`text-xs font-bold leading-tight ${m.completed ? "text-green-800 dark:text-green-300" : "text-gray-400"}`}>{m.title}</p>
                <p className={`text-xs mt-1 ${m.completed ? "text-green-600" : "text-gray-400"}`}>{m.completed ? "✅ Done" : "⏳ Pending"}</p>
              </div>
            ))}
          </div>

          {!allDone && (
            <div className="bg-orange-50 dark:bg-orange-950 border-2 border-orange-300 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="h-5 w-5 text-orange-600 flex-shrink-0" />
                <p className="text-sm font-bold text-orange-800 dark:text-orange-300">Certificate Locked — {doneCount}/3 modules complete</p>
              </div>
              <p className="text-xs text-orange-700 ml-8">Complete all 3 modules to unlock and download your certificate.</p>
              <button onClick={onClose} className="mt-3 ml-8 flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:underline">
                <ArrowLeft className="h-3.5 w-3.5" /> Go back and complete remaining modules
              </button>
            </div>
          )}

          {/* Name input */}
          <div className="space-y-2">
            <Label className={`text-sm font-semibold flex items-center gap-2 ${!allDone ? "text-gray-400" : ""}`}>
              {!allDone && <Lock className="h-3.5 w-3.5" />} Your Name on Certificate
            </Label>
            <div className="flex gap-2">
              <Input value={name} onChange={e => setName(e.target.value)}
                placeholder={allDone ? "Enter your full name" : "Complete all modules to unlock"}
                className={`flex-1 ${!allDone ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={!allDone || !editing} />
              {allDone && (
                <Button variant="outline" size="sm" onClick={() => setEditing(e => !e)} className="flex items-center gap-1.5 flex-shrink-0">
                  <Edit2 className="h-3.5 w-3.5" />{editing ? "Done" : "Edit"}
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-500">Preview</p>
            <div className={`rounded-xl overflow-hidden border-2 shadow-md relative transition-all ${allDone ? "border-green-300" : "border-gray-200"}`}>
              <canvas ref={previewRef} style={{ width: "100%", height: "auto", display: "block", filter: allDone ? "none" : "blur(4px) grayscale(0.5)", opacity: allDone ? 1 : 0.5 }} />
              {!allDone && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 rounded-xl">
                  <Lock className="h-10 w-10 text-white drop-shadow-lg mb-2" />
                  <p className="text-white font-bold text-sm drop-shadow-lg">Complete all 3 modules to unlock</p>
                </div>
              )}
            </div>
          </div>

          <canvas ref={canvasRef} style={{ display: "none" }} />

          <Button className={`w-full h-12 text-base font-bold shadow-md ${allDone ? "text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"}`}
            style={allDone ? { backgroundColor: trackColor } : {}}
            onClick={handleDownload} disabled={!allDone || !name.trim()}>
            {allDone ? <><Download className="h-5 w-5 mr-2" /> Download Certificate (PNG)</> : <><Lock className="h-5 w-5 mr-2" /> Complete All 3 Modules to Download</>}
          </Button>

          {allDone && !name.trim() && <p className="text-xs text-center text-red-500">Please enter your name above to download.</p>}
          <p className="text-xs text-center text-gray-400">Certificate is generated locally — your data stays on your device.</p>
        </div>
      </div>
    </div>
  );
};