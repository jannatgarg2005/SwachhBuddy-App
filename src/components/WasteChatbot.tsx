// src/components/WasteChatbot.tsx
// EcoBuddy — Groq Whisper mic input + Groq LLM chat + Speech Synthesis output
// Supports Hindi, English, Hinglish — auto-detected, spoken back in same language

import { useState, useRef, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, User, X, Loader2, RefreshCw, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isVoice?: boolean;
  lang?: string;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

const BUBBLE_SIZE      = 56;
const CHATBOX_WIDTH    = 384;
const CHATBOX_HEIGHT   = 540;
const VIEWPORT_PADDING = 24;

const isLocalhost = () =>
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

// ── Language detection ────────────────────────────────────────────────────────
const detectLanguage = (text: string): "hi-IN" | "en-IN" => {
  const hindiWords = /\b(kahan|kya|yeh|hai|hain|kaise|kyun|main|mera|meri|aur|lekin|nahi|haan|theek|achha|bhai|didi|bolo|batao|karo|dispose|fridge|purana|naya|ghar|paani|khana|kabhi|abhi|thoda|bahut|sab|jo|woh|iska|uska|kuch|matlab|samajh|dekho|sunno|please|zaroor|bilkul|sirf|toh|phir|seedha|seedhe|yahan|wahan|idhar|udhar|zyada|kam|pura|sahi|galat|pata|maloom|chahiye|lagta|milta|dena|lena|rakhna|daalna|phenko|uthao)\b/i;
  const devanagari = /[\u0900-\u097F]/;
  return (hindiWords.test(text) || devanagari.test(text)) ? "hi-IN" : "en-IN";
};

const langLabel = (lang: string) => lang === "hi-IN" ? "🇮🇳 Hindi" : "🇬🇧 English";

// ── Speech Synthesis ──────────────────────────────────────────────────────────
const hasSpeechSynthesis = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

// ── Strip text for clean TTS output ──────────────────────────────────────────
const cleanForSpeech = (text: string): string =>
  text
    // Remove all emoji (Unicode ranges)
    .replace(/[\u{1F300}-\u{1F9FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{1F000}-\u{1F02F}]/gu, "")
    .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, "")
    .replace(/[\u{1F100}-\u{1F1FF}]/gu, "")
    .replace(/[\u{1F200}-\u{1F2FF}]/gu, "")
    .replace(/[\u{1F004}]/gu, "")
    .replace(/[\u{1F0CF}]/gu, "")
    // Remove markdown bold/italic/headers
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    // Remove bullet symbols and arrows
    .replace(/[•·→←↑↓►◄▸▹♦♣♠♥]/g, "")
    .replace(/[-–—]{2,}/g, ", ")
    // Remove special chars but keep Hindi (Devanagari), English, digits, punctuation
    .replace(/[^\u0900-\u097F\w\s,.!?;:()\-]/g, "")
    // Clean up whitespace
    .replace(/\n+/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim();

const doSpeak = (clean: string, lang: "hi-IN" | "en-IN") => {
  if (!clean) return;
  const utterance  = new SpeechSynthesisUtterance(clean);
  utterance.lang   = lang;
  utterance.rate   = 0.88;
  utterance.pitch  = 1.0;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  let preferred: SpeechSynthesisVoice | undefined;
  if (lang === "hi-IN") {
    preferred =
      voices.find(v => v.lang === "hi-IN") ||
      voices.find(v => v.lang === "hi") ||
      voices.find(v => v.name.toLowerCase().includes("hindi")) ||
      voices.find(v => v.lang.startsWith("hi"));
  } else {
    preferred =
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.lang === "en-GB") ||
      voices.find(v => v.lang === "en-US") ||
      voices.find(v => v.lang.startsWith("en"));
  }

  // Final fallback — use whatever is available
  if (!preferred) preferred = voices[0];
  if (preferred) utterance.voice = preferred;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const speakText = (text: string, lang: "hi-IN" | "en-IN" = "en-IN") => {
  if (!hasSpeechSynthesis()) return;

  const clean = cleanForSpeech(text);
  if (!clean) return;

  const voices = window.speechSynthesis.getVoices();

  if (voices.length > 0) {
    doSpeak(clean, lang);
  } else {
    // Voices not loaded yet — wait then speak
    const onVoicesChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      doSpeak(clean, lang);
    };
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
      doSpeak(clean, lang);
    }, 1000);
  }
};

const stopSpeaking = () => {
  if (hasSpeechSynthesis()) window.speechSynthesis.cancel();
};

// ── Local fallback (used on localhost or when API fails) ──────────────────────
const buildFallback = (q: string): string => {
  const s = q.toLowerCase().trim();

  if (s.match(/^(hi|hello|hey|namaste|hii|helo|howdy|good morning|good evening|good afternoon|sup)[\s!?.]*$/))
    return "Hello! 👋 I'm EcoBuddy, your AI waste management assistant.\n\nAsk me:\n• 🗑️ Which bin any item belongs in\n• 📱 How to use the app and earn points\n• ♻️ Composting, recycling tips\n• 🤖 Anything else!";

  if (s.match(/plastic bottle|pet bottle|water bottle/))
    return "🔵 **Plastic bottles → Blue (Dry Waste) bin**\n\n• Rinse before disposing — clean plastic is worth more\n• Remove the cap separately\n• PET bottles (code ♳) are India's most recycled plastic ♻️";

  if (s.match(/plastic|dry|recycl/))
    return "🔵 **Dry/Recyclable waste → Blue Bin**\n\n• Paper, cardboard, plastic bottles, glass, metals\n• Keep dry and clean — contamination reduces value\n• Earn +15 pts per verified dry waste disposal on Swachh Buddy!";

  if (s.match(/food|vegetable|fruit|peel|cooked|rice|roti|sabzi|organic|khana|peels/))
    return "🟢 **Food waste → Green (Wet Waste) bin**\n\n• All cooked and uncooked food scraps go here\n• Never mix with dry waste — ruins recyclable value\n• 1 kg food waste makes ~0.3 kg compost in 60 days 🌱";

  if (s.match(/compost|composting/))
    return "🌱 **How to Compost at Home:**\n\n1. Green bin scraps + dry leaves in a covered container\n2. Turn weekly, keep slightly moist\n3. Ready in **45–60 days** — rich fertilizer!\n\nVermicomposting with earthworms is faster (30–45 days) 🪱";

  if (s.match(/fridge|refrigerator|washing machine|ac|air condition|geyser|appliance|purana|dispose/))
    return "🟡 **Large appliances (fridge, AC, washing machine) → E-Waste collection**\n\n• Contact your municipality for bulk e-waste pickup\n• Never dump in regular bins — refrigerants are toxic\n• Use Swachh Buddy's Schedule Pickup feature → earn **+75 pts** ⚡\n• Many brands offer buy-back schemes — ask your dealer!";

  if (s.match(/phone|mobile|laptop|computer|cable|charger|electronic/))
    return "🟡 **Electronics → Yellow (E-Waste) collection**\n\n• Never in regular bins — toxic metals pollute soil\n• Use Swachh Buddy's E-Waste Day for **+75 pts** ⚡\n• Wipe personal data before disposing!";

  if (s.match(/battery|batteries/))
    return "🟡 **Batteries → Yellow (E-Waste) / Hazardous collection**\n\n• NEVER in regular bins — fire hazard!\n• Lithium (phones): authorised e-waste centres\n• Lead-acid (cars): return to auto shops 🔋";

  if (s.match(/medicine|tablet|capsule|syrup|expired|drug/))
    return "🔴 **Medicines → Pharmacy take-back or Red (Hazardous) bin**\n\n• NEVER flush — pollutes groundwater\n• Return unused medicines to any pharmacy\n• Expired medicines: Red bin or hazardous collection centre 💊";

  if (s.match(/chemical|paint|pesticide|bleach|acid/))
    return "🔴 **Chemicals → Red (Hazardous) bin**\n\n• NEVER pour down drains — contaminates groundwater\n• Keep in original containers with labels\n• Contact municipality for hazardous collection ☣️";

  if (s.match(/which bin|what bin|where.*put|segregat|sort|kahan|daalna/))
    return "🗑️ **India's 4-Bin System:**\n\n• 🟢 **Green** — Wet/organic (food, peels, garden)\n• 🔵 **Blue** — Dry/recyclable (paper, plastic, glass, metal)\n• 🔴 **Red** — Hazardous (chemicals, medicines, paint)\n• 🟡 **Yellow** — E-Waste (electronics, batteries)";

  if (s.match(/point|earn|reward|coin|redeem/))
    return "🏆 **Earning Points on Swachh Buddy:**\n\n• QR scan: **+25 pts**\n• Report issue: **+50 pts**\n• E-Waste Day: **+75 pts**\n• Training module: **+100 pts**\n\nRedeem in the **Earn** section for rewards!";

  if (s.match(/qr|scan/))
    return "📲 **QR Code Scanning:**\n\nWhen handing waste to the municipal collector, scan their QR code.\n• Earn **+25 points** per verified scan\n• Go to Dashboard → Scan QR Code 🌱";

  if (s.match(/report|issue|missed|pickup|dump/))
    return "📷 **Report Issues:**\n\nSpotted a missed pickup or illegal dumping?\n• Take a photo and submit via Dashboard → Report Issue\n• Earn **+50 points** per verified report 💪";

  if (s.match(/schedule|bulk|furniture|construction/))
    return "📅 **Schedule Pickup:**\n\nBook a bulk waste pickup from home!\n• Dashboard → Schedule Pickup\n• For furniture, e-waste, construction debris\n• 48 hour advance booking 🏠";

  if (s.match(/ewaste|e-waste day|drive|monthly/))
    return "♻️ **E-Waste Day:**\n\nMonthly drives to collect electronics!\n• Drop off phones, laptops, cables, batteries\n• Earn **+75 points** per participation ⚡";

  if (s.match(/map|truck|track|vehicle/))
    return "🗺️ **Live Map:**\n\nSee waste collection vehicles in real-time!\n• Dashboard → Live Map\n• Shows truck location, ETA, and route\n• Also shows illegal dump sites 🚛";

  if (s.match(/learn|train|module|course|certif/))
    return "🎓 **Training Modules:**\n\n• 3 core levels: Basics → Intermediate → Advanced\n• Complete all → earn a **certificate + +100 pts** each\n• Go to the Learn tab 📜";

  if (s.match(/thank|thanks|great|perfect|helpful|awesome|shukriya|dhanyawad/))
    return "You're welcome! 😊\n\nEvery correct waste disposal makes India cleaner. Keep it up! 🇮🇳🌱";

  if (s.match(/who are you|what are you|your name|introduce|kaun ho|kya ho/))
    return "I'm **EcoBuddy** 🌱 — the AI assistant for Swachh Buddy.\n\nI can tell you which bin any item goes in, guide you through app features, help you earn maximum points, and answer questions in Hindi, English, or Hinglish!\n\nAsk me anything!";

  return "I'd love to help! Ask me:\n\n• 🗑️ Which bin any item belongs in\n• 📱 App features — QR scanning, points, map\n• ♻️ Recycling and composting tips\n• 🎤 You can also speak to me using the mic button!";
};

// ── Main Component ────────────────────────────────────────────────────────────
const WasteChatbot = () => {
  const [isOpen, setIsOpen]             = useState(false);
  const [messages, setMessages]         = useState<Message[]>([{
    id: "1",
    content: "Hello! 👋 I'm **EcoBuddy**, your AI waste management assistant.\n\nAsk me anything — or tap 🎤 to **speak** in Hindi, English, or Hinglish!",
    sender: "bot",
    timestamp: new Date(),
  }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading]       = useState(false);

  // ── Voice state ──────────────────────────────────────────────────────────────
  const [isListening, setIsListening]   = useState(false);
  const [isSpeaking, setIsSpeaking]     = useState(false);
  const [voiceMode, setVoiceMode]       = useState(false);
  const [transcript, setTranscript]     = useState("");
  const [micError, setMicError]         = useState("");
  const lastLangRef                     = useRef<"hi-IN" | "en-IN">("en-IN");

  // ── Whisper mic refs ─────────────────────────────────────────────────────────
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);

  // ── Drag state ───────────────────────────────────────────────────────────────
  const scrollRef    = useRef<HTMLDivElement>(null);
  const [position, setPosition]         = useState({ x: 0, y: 0 });
  const [chatboxPos, setChatboxPos]     = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging]     = useState(false);
  const dragOffset   = useRef({ x: 0, y: 0 });
  const wasDragged   = useRef(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [showDot, setShowDot]           = useState(false);

  // ── Init bubble position (bottom-right) ──────────────────────────────────────
  useEffect(() => {
    setPosition({
      x: window.innerWidth  - BUBBLE_SIZE - VIEWPORT_PADDING,
      y: window.innerHeight - BUBBLE_SIZE - VIEWPORT_PADDING,
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setShowGreeting(true); setShowDot(true); }, 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showGreeting) {
      const t = setTimeout(() => setShowGreeting(false), 60000);
      return () => clearTimeout(t);
    }
  }, [showGreeting]);

  useEffect(() => {
    if (isOpen) {
      const idealX = position.x - CHATBOX_WIDTH  + BUBBLE_SIZE;
      const idealY = position.y - CHATBOX_HEIGHT + BUBBLE_SIZE;
      setChatboxPos({
        x: Math.max(VIEWPORT_PADDING, Math.min(idealX, window.innerWidth  - CHATBOX_WIDTH  - VIEWPORT_PADDING)),
        y: Math.max(VIEWPORT_PADDING, Math.min(idealY, window.innerHeight - CHATBOX_HEIGHT - VIEWPORT_PADDING)),
      });
    }
  }, [isOpen, position]);

  // ── Drag ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      wasDragged.current = true;
      setPosition({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => {
      setIsDragging(false);
      setTimeout(() => {
        if (!wasDragged.current) {
          setIsOpen(true);
          setShowDot(false);
          setShowGreeting(false);
        }
      }, 0);
    };
    if (isDragging) {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      return () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
    }
  }, [isDragging]);

  const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    wasDragged.current = false;
    dragOffset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    setIsDragging(true);
  };

  // ── Auto scroll ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, transcript]);

  // ── Track speech synthesis speaking state ────────────────────────────────────
  useEffect(() => {
    if (!hasSpeechSynthesis()) return;
    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // ── Add bot message ───────────────────────────────────────────────────────────
  const addBotMessage = (content: string, lang?: "hi-IN" | "en-IN") => {
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content,
      sender: "bot",
      timestamp: new Date(),
      lang,
    }]);
    if (voiceMode) {
      const speakLang = lang || lastLangRef.current;
      setTimeout(() => speakText(content, speakLang), 400);
    }
  };

  // ── Send message ──────────────────────────────────────────────────────────────
  const sendMessage = async (overrideText?: string, isVoice = false) => {
    const query = (overrideText || inputMessage).trim();
    if (!query || isLoading) return;

    const detectedLang = detectLanguage(query);
    lastLangRef.current = detectedLang;

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date(),
      isVoice,
      lang: detectedLang,
    }]);
    setInputMessage("");
    setIsLoading(true);

    const apiMessages: ApiMessage[] = messages.slice(-8).map(m => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.content,
    }));
    apiMessages.push({ role: "user", content: query });

    try {
      if (isLocalhost()) {
        await new Promise(r => setTimeout(r, 600));
        addBotMessage(buildFallback(query), detectedLang);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        addBotMessage(buildFallback(query), detectedLang);
        return;
      }

      let data: { reply?: string };
      try { data = JSON.parse(responseText); }
      catch { addBotMessage(buildFallback(query), detectedLang); return; }

      addBotMessage(data.reply || buildFallback(query), detectedLang);

    } catch {
      addBotMessage(buildFallback(query), detectedLang);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Whisper mic: start recording ──────────────────────────────────────────────
  const startListening = async () => {
    setMicError("");
    stopSpeaking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Pick best supported mime type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all mic tracks so the red recording indicator in browser clears
        stream.getTracks().forEach(t => t.stop());
        setIsListening(false);
        setTranscript("");

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Reject empty recordings (user tapped mic immediately)
        if (audioBlob.size < 500) {
          setMicError("No speech detected. Tap mic and speak, then tap again to send.");
          setTimeout(() => setMicError(""), 3000);
          return;
        }

        setIsLoading(true);

        try {
          const form = new FormData();
          // Use .webm extension — Groq Whisper accepts it
          form.append("audio", audioBlob, "audio.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: form,
          });

          if (!res.ok) {
            const err = await res.text();
            console.error("Transcribe error:", err);
            setMicError("Transcription failed. Try again or type your message.");
            setTimeout(() => setMicError(""), 4000);
            setIsLoading(false);
            return;
          }

          const data = await res.json();

          if (data.transcript && data.transcript.trim().length > 0) {
            sendMessage(data.transcript.trim(), true);
          } else {
            setMicError("Could not understand speech. Please try again.");
            setTimeout(() => setMicError(""), 3000);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Transcribe fetch error:", err);
          setMicError("Connection error during transcription. Try again.");
          setTimeout(() => setMicError(""), 4000);
          setIsLoading(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
      setTranscript("🎙️ Recording… tap mic again to send");

    } catch (err: any) {
      if (err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError") {
        setMicError("Microphone permission denied. Click the 🔒 icon in the address bar and allow mic.");
      } else if (err?.name === "NotFoundError") {
        setMicError("No microphone found. Please connect a mic and try again.");
      } else {
        setMicError("Could not access microphone. Please try again.");
        console.error("getUserMedia error:", err);
      }
    }
  };

  // ── Whisper mic: stop recording ───────────────────────────────────────────────
  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    // Don't reset isListening here — onstop callback handles it after processing
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([{
      id: Date.now().toString(),
      content: "Chat cleared! 🔄 Ask me anything — or tap 🎤 to speak!",
      sender: "bot",
      timestamp: new Date(),
    }]);
  };

  const quickQuestions = [
    "Where does plastic go?",
    "How do I earn points?",
    "Yeh fridge kahan dispose karein?",
    "Which bin for batteries?",
  ];

  const renderContent = (text: string) => ({
    __html: text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>"),
  });

  // ── Bubble (closed state) ─────────────────────────────────────────────────────
  if (!isOpen) return (
    <div className="fixed z-50" style={{ top: position.y, left: position.x }}>
      {showGreeting && (
        <div className="absolute bottom-0 right-full mr-4 w-max max-w-[200px] bg-card text-card-foreground p-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-left-2 duration-500">
          <p className="text-sm font-medium">Hello! 👋</p>
          <p className="text-sm text-muted-foreground">Ask me anything!</p>
          <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-card" />
        </div>
      )}
      <Button
        onMouseDown={handleMouseDown}
        className="relative h-14 w-14 rounded-full shadow-lg p-0 cursor-grab active:cursor-grabbing"
        size="icon"
        variant="ghost"
      >
        {showDot && (
          <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
        <img
          src="/chatbot.png"
          alt="EcoBuddy"
          className="h-20 w-20 rounded-full object-cover"
          style={{ pointerEvents: "none" }}
        />
      </Button>
    </div>
  );

  // ── Chat window ───────────────────────────────────────────────────────────────
  return (
    <Card
      className="fixed w-96 shadow-2xl z-50 flex flex-col overflow-hidden rounded-2xl border"
      style={{ top: chatboxPos.y, left: chatboxPos.x, height: CHATBOX_HEIGHT }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-primary/10 to-accent/10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/chatbot.png" alt="EcoBuddy" className="h-9 w-9 rounded-full" />
          <div>
            <p className="font-bold text-sm leading-tight">EcoBuddy</p>
            <p className="text-xs text-muted-foreground leading-tight">
              AI Assistant · {voiceMode ? "🔊 Voice On — tap to mute" : "🔇 Voice Off — tap to unmute"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Voice response toggle */}
          <Button
            variant={voiceMode ? "default" : "ghost"}
            size="icon"
            onClick={() => { setVoiceMode(v => !v); stopSpeaking(); }}
            className={`h-7 w-7 ${voiceMode ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            title={voiceMode ? "Voice responses ON — click to turn off" : "Turn on voice responses"}
          >
            {voiceMode
              ? <Volume2 className="h-3.5 w-3.5" />
              : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>

          {/* Stop speaking button — only visible while speaking */}
          {isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              onClick={stopSpeaking}
              className="h-7 w-7 text-red-500 hover:text-red-600"
              title="Stop speaking"
            >
              <VolumeX className="h-3.5 w-3.5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={clearChat} className="h-7 w-7" title="Clear chat">
            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              stopSpeaking();
              stopListening();
            }}
            className="h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Voice mode banner */}
      {voiceMode && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 flex-shrink-0">
          <Volume2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-xs text-green-700 dark:text-green-300">
            Voice responses on — EcoBuddy will speak answers aloud
          </p>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            {msg.sender === "bot" && (
              <img src="/chatbot.png" alt="Bot" className="h-7 w-7 rounded-full flex-shrink-0 mt-0.5" />
            )}
            <div className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm"
            }`}>
              {msg.isVoice && msg.sender === "user" && (
                <p className="text-[10px] text-primary-foreground/60 mb-0.5 flex items-center gap-1">
                  <Mic className="h-2.5 w-2.5" /> Voice · {msg.lang ? langLabel(msg.lang) : ""}
                </p>
              )}
              <span dangerouslySetInnerHTML={renderContent(msg.content)} />
              <div className="flex items-center justify-between mt-1 gap-2">
                <p className={`text-xs ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                {msg.sender === "bot" && hasSpeechSynthesis() && (
                  <button
                    onClick={() => speakText(msg.content, (msg.lang as "hi-IN" | "en-IN") || "en-IN")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Speak this message"
                  >
                    <Volume2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
            {msg.sender === "user" && (
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                {msg.isVoice
                  ? <Mic className="h-4 w-4 text-primary" />
                  : <User className="h-4 w-4 text-primary" />}
              </div>
            )}
          </div>
        ))}

        {/* Live recording indicator */}
        {isListening && (
          <div className="flex gap-2 justify-end">
            <div className="max-w-[78%] rounded-2xl rounded-tr-sm px-3 py-2 bg-primary/20 border border-primary/30 text-sm italic text-foreground/70">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Recording… tap mic to send</span>
              </div>
              {transcript}
            </div>
            <div className="h-7 w-7 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mic className="h-4 w-4 text-red-500" />
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex gap-2 justify-start">
            <img src="/chatbot.png" alt="Bot" className="h-7 w-7 rounded-full flex-shrink-0" />
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 150, 300].map(d => (
                <span
                  key={d}
                  className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mic error banner */}
      {micError && (
        <div className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800 flex-shrink-0">
          <p className="text-xs text-red-600 dark:text-red-400">{micError}</p>
        </div>
      )}

      {/* Quick questions — only on first open */}
      {messages.length === 1 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => setInputMessage(q)}
              className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="p-3 border-t flex gap-2 items-center bg-background flex-shrink-0">
        {/* Mic button — always shown, uses MediaRecorder (no Chrome SpeechRecognition) */}
        <Button
          variant={isListening ? "destructive" : "outline"}
          size="icon"
          className={`h-9 w-9 rounded-xl flex-shrink-0 transition-all ${
            isListening ? "animate-pulse ring-2 ring-red-400" : ""
          }`}
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          title={isListening ? "Tap to send voice" : "Speak in Hindi or English"}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        <Input
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isListening ? "Recording… tap mic to send" : "Ask anything…"}
          className="flex-1 rounded-xl text-sm h-9"
          disabled={isLoading || isListening}
        />

        <Button
          onClick={() => sendMessage()}
          disabled={!inputMessage.trim() || isLoading || isListening}
          size="icon"
          className="h-9 w-9 rounded-xl flex-shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default WasteChatbot;