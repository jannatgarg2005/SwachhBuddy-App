// src/components/EcoSorterGame.tsx
import React, { useState, useRef, useCallback } from "react";

const itemsData = [
  { name: "🍌 Peel",       type: "wet" },
  { name: "🥤 Plastic",    type: "dry" },
  { name: "📰 Paper",      type: "dry" },
  { name: "🍎 Core",       type: "wet" },
  { name: "💊 Medicine",   type: "haz" },
  { name: "🔋 Battery",    type: "haz" },
  { name: "🥗 Leftovers",  type: "wet" },
  { name: "📦 Cardboard",  type: "dry" },
];

const bins = [
  { type: "wet", label: "🌿 Wet Waste",  bg: "linear-gradient(135deg,#66bb6a,#2e7d32)" },
  { type: "dry", label: "📦 Dry Waste",  bg: "linear-gradient(135deg,#ffb74d,#f57c00)" },
  { type: "haz", label: "☠ Hazardous",  bg: "linear-gradient(135deg,#e57373,#c62828)" },
];

interface DragGhost {
  name: string;
  x: number;
  y: number;
}

const EcoSorterGame: React.FC = () => {
  const [score, setScore]             = useState(0);
  const [started, setStarted]         = useState(false);
  const [removed, setRemoved]         = useState<number[]>([]);
  const [ghost, setGhost]             = useState<DragGhost | null>(null);
  const [activeBin, setActiveBin]     = useState<string | null>(null);
  const [feedback, setFeedback]       = useState<{ msg: string; ok: boolean } | null>(null);

  const draggingIndex = useRef<number | null>(null);
  const binRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedItems = removed.length;
  const totalItems  = itemsData.length;

  // ── Feedback helper ───────────────────────────────────────────────────────
  const showFeedback = (msg: string, ok: boolean) => {
    setFeedback({ msg, ok });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1500);
  };

  // ── Desktop drag handlers ─────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text", String(index));
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const onDrop = (e: React.DragEvent<HTMLDivElement>, binType: string) => {
    e.preventDefault();
    const index = parseInt(e.dataTransfer.getData("text"), 10);
    handleSort(index, binType);
  };

  // ── Shared sort logic ─────────────────────────────────────────────────────
  const handleSort = useCallback((index: number, binType: string) => {
    if (removed.includes(index)) return;
    const item = itemsData[index];
    if (item.type === binType) {
      setScore(p => p + 1);
      showFeedback(`✅ Correct! ${item.name}`, true);
    } else {
      setScore(p => p - 1);
      showFeedback(`❌ Wrong! ${item.name}`, false);
    }
    setRemoved(p => [...p, index]);
  }, [removed]);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>, index: number) => {
    draggingIndex.current = index;
    const touch = e.touches[0];
    setGhost({ name: itemsData[index].name, x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // stop page scroll while dragging
    const touch = e.touches[0];
    setGhost(g => g ? { ...g, x: touch.clientX, y: touch.clientY } : null);

    // Highlight bin under finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    let found: string | null = null;
    binRefs.current.forEach((ref, i) => {
      if (ref && ref.contains(el as Node)) found = bins[i].type;
    });
    setActiveBin(found);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    setGhost(null);
    setActiveBin(null);

    if (draggingIndex.current === null) return;

    // Find which bin the finger released on
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    let targetBin: string | null = null;
    binRefs.current.forEach((ref, i) => {
      if (ref && ref.contains(el as Node)) targetBin = bins[i].type;
    });

    if (targetBin) handleSort(draggingIndex.current, targetBin);
    draggingIndex.current = null;
  };

  const resetGame = () => {
    setScore(0);
    setRemoved([]);
    setStarted(false);
    setGhost(null);
    setActiveBin(null);
    setFeedback(null);
  };

  return (
    <div style={{
      background: "#ffffff", borderRadius: "24px", padding: "24px",
      textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      width: "95%", maxWidth: "850px", margin: "auto", position: "relative",
      userSelect: "none",
    }}>

      {/* ── Start Screen ── */}
      {!started && sortedItems === 0 && (
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#2e7d32" }}>
            ♻ Eco Sorter Training
          </h1>
          <p style={{ fontSize: "1rem", color: "#555", lineHeight: 1.7 }}>
            Instructions:<br />
            👉 Drag (or tap &amp; drag on mobile) items into the correct bins.<br />
            ✅ Correct drop = +1 point &nbsp;|&nbsp; ❌ Wrong drop = –1 point.<br />
            🏆 Complete all items to finish!
          </p>
          <button
            style={{
              padding: "14px 28px", marginTop: "25px",
              background: "linear-gradient(135deg,#43cea2,#185a9d)",
              border: "none", borderRadius: "14px", color: "white",
              fontSize: "17px", cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
            onClick={() => setStarted(true)}
          >
            Start Game
          </button>
        </div>
      )}

      {/* ── Game Screen ── */}
      {started && sortedItems < totalItems && (
        <div>
          <h2 style={{ color: "#388e3c", marginBottom: "8px" }}>
            Drag items into bins
          </h2>

          {/* Feedback toast */}
          {feedback && (
            <div style={{
              padding: "8px 18px", borderRadius: "12px", display: "inline-block",
              background: feedback.ok ? "#e8f5e9" : "#ffebee",
              color: feedback.ok ? "#2e7d32" : "#c62828",
              fontWeight: "bold", fontSize: "0.95rem", marginBottom: "8px",
              transition: "opacity 0.3s",
            }}>
              {feedback.msg}
            </div>
          )}

          {/* Waste items */}
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "14px", flexWrap: "wrap", margin: "20px 0",
          }}>
            {itemsData.map((item, index) => {
              if (removed.includes(index)) return null;
              return (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onTouchStart={(e) => onTouchStart(e, index)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{
                    width: "80px", height: "80px", borderRadius: "16px",
                    background: "#f9f9f9", display: "flex",
                    justifyContent: "center", alignItems: "center",
                    cursor: "grab", fontWeight: "bold",
                    fontSize: "1.1rem", color: "#333",
                    border: "2px solid #ddd",
                    touchAction: "none", // critical — prevents scroll hijack
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>

          {/* Bins */}
          <div style={{
            display: "flex", justifyContent: "space-around",
            gap: "12px", flexWrap: "wrap", marginTop: "24px",
          }}>
            {bins.map((bin, i) => (
              <div
                key={bin.type}
                ref={el => { binRefs.current[i] = el; }}
                onDrop={(e) => onDrop(e, bin.type)}
                onDragOver={allowDrop}
                style={{
                  width: "140px", minHeight: "140px", borderRadius: "16px",
                  display: "flex", justifyContent: "center", alignItems: "center",
                  background: bin.bg, color: "white", fontWeight: "bold",
                  fontSize: "15px", boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
                  flexDirection: "column", gap: "6px", padding: "10px",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  transform: activeBin === bin.type ? "scale(1.08)" : "scale(1)",
                  outline: activeBin === bin.type ? "3px solid white" : "none",
                }}
              >
                <span style={{ fontSize: "1.8rem" }}>
                  {bin.type === "wet" ? "🗑️" : bin.type === "dry" ? "♻️" : "⚠️"}
                </span>
                {bin.label}
                <span style={{ fontSize: "11px", opacity: 0.85 }}>Drop here</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "1.2rem", marginTop: "20px", fontWeight: "bold", color: "#2e7d32" }}>
            ⭐ Score: {score} &nbsp;|&nbsp; {sortedItems}/{totalItems} sorted
          </p>
        </div>
      )}

      {/* ── End Screen ── */}
      {started && sortedItems === totalItems && (
        <div>
          <h2 style={{ color: "#388e3c", marginBottom: "15px" }}>🎉 Sorting Complete!</h2>
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            Final score: <strong>{score}</strong> / {totalItems}
          </p>
          <p style={{ color: score >= totalItems * 0.7 ? "#2e7d32" : "#e53935", fontWeight: "bold" }}>
            {score >= totalItems * 0.7 ? "🌟 Excellent eco-sorter!" : "📚 Keep practising!"}
          </p>
          <button
            style={{
              padding: "14px 28px", marginTop: "20px",
              background: "linear-gradient(135deg,#43cea2,#185a9d)",
              border: "none", borderRadius: "14px", color: "white",
              fontSize: "17px", cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
            }}
            onClick={resetGame}
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {/* ── Touch Ghost (floating drag preview) ── */}
      {ghost && (
        <div
          style={{
            position: "fixed",
            left: ghost.x - 40,
            top: ghost.y - 40,
            width: "80px", height: "80px",
            borderRadius: "16px", background: "#fff",
            display: "flex", justifyContent: "center", alignItems: "center",
            fontWeight: "bold", fontSize: "1.1rem",
            border: "2px solid #43cea2",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            pointerEvents: "none", zIndex: 9999,
            opacity: 0.92,
          }}
        >
          {ghost.name}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EcoSorterGame;