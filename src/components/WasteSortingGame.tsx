// src/components/WasteSortingGame.tsx
import React, { useState, useRef, useCallback } from "react";

type WasteItem = {
  id: number;
  emoji: string;
  type: "organic" | "recyclable" | "hazardous";
};

const initialItems: WasteItem[] = [
  { id: 1, emoji: "🍎", type: "organic"    },
  { id: 2, emoji: "🥤", type: "recyclable" },
  { id: 3, emoji: "💡", type: "hazardous"  },
  { id: 4, emoji: "🍌", type: "organic"    },
  { id: 5, emoji: "📦", type: "recyclable" },
];

const categories = [
  { id: "organic",    label: "Organic ♻",    color: "#66bb6a" },
  { id: "recyclable", label: "Recyclable 🔄", color: "#42a5f5" },
  { id: "hazardous",  label: "Hazardous ☣",  color: "#e57373" },
];

interface DragGhost {
  emoji: string;
  x: number;
  y: number;
}

const WasteSortingGame: React.FC = () => {
  const [items, setItems]       = useState<WasteItem[]>(initialItems);
  const [score, setScore]       = useState(0);
  const [feedback, setFeedback] = useState("");
  const [activeBin, setActiveBin] = useState<string | null>(null);
  const [ghost, setGhost]       = useState<DragGhost | null>(null);

  const draggingId  = useRef<number | null>(null);
  const binRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const fbTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Feedback helper ───────────────────────────────────────────────────────
  const showFeedback = (msg: string) => {
    setFeedback(msg);
    if (fbTimer.current) clearTimeout(fbTimer.current);
    fbTimer.current = setTimeout(() => setFeedback(""), 1600);
  };

  // ── Shared sort logic ─────────────────────────────────────────────────────
  const handleSort = useCallback((id: number, category: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    if (item.type === category) {
      setScore(p => p + 1);
      showFeedback(`✅ Correct! ${item.emoji} goes into ${category}`);
      setItems(p => p.filter(i => i.id !== id));
    } else {
      showFeedback(`❌ Wrong! ${item.emoji} does NOT belong to ${category}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // ── Desktop drag handlers ─────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.dataTransfer.setData("text/plain", id.toString());
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, category: string) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("text/plain"), 10);
    handleSort(id, category);
  };

  // ── Touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>, id: number) => {
    draggingId.current = id;
    const touch = e.touches[0];
    const item = initialItems.find(i => i.id === id);
    setGhost({ emoji: item?.emoji ?? "?", x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent scroll while dragging
    const touch = e.touches[0];
    setGhost(g => g ? { ...g, x: touch.clientX, y: touch.clientY } : null);

    // Highlight bin under finger
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    let found: string | null = null;
    binRefs.current.forEach((ref, i) => {
      if (ref && ref.contains(el as Node)) found = categories[i].id;
    });
    setActiveBin(found);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    setGhost(null);
    setActiveBin(null);

    if (draggingId.current === null) return;

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    let targetCat: string | null = null;
    binRefs.current.forEach((ref, i) => {
      if (ref && ref.contains(el as Node)) targetCat = categories[i].id;
    });

    if (targetCat) handleSort(draggingId.current, targetCat);
    draggingId.current = null;
  };

  const restart = () => {
    setItems(initialItems);
    setScore(0);
    setFeedback("");
    setGhost(null);
    setActiveBin(null);
  };

  return (
    <div style={{
      maxWidth: 700, margin: "auto", padding: 20,
      textAlign: "center", userSelect: "none", position: "relative",
    }}>
      <h1 style={{ color: "#2e7d32" }}>Waste Sorting Game</h1>
      <p style={{ color: "#555" }}>Drag the items into the correct bin!</p>
      <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}>⭐ Score: {score}</p>

      {/* Feedback */}
      {feedback && (
        <div style={{
          padding: "8px 18px", borderRadius: "12px", display: "inline-block",
          background: feedback.startsWith("✅") ? "#e8f5e9" : "#ffebee",
          color: feedback.startsWith("✅") ? "#2e7d32" : "#c62828",
          fontWeight: "bold", fontSize: "0.95rem", marginBottom: "10px",
        }}>
          {feedback}
        </div>
      )}

      {/* Items */}
      <div style={{
        display: "flex", justifyContent: "center",
        gap: 15, flexWrap: "wrap", margin: "20px 0",
      }}>
        {items.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onTouchStart={(e) => onTouchStart(e, item.id)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#f9f9f9", display: "flex",
              justifyContent: "center", alignItems: "center",
              fontSize: 30, cursor: "grab",
              border: "2px solid #ddd",
              touchAction: "none", // critical for mobile drag
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {item.emoji}
          </div>
        ))}

        {items.length === 0 && (
          <p style={{ color: "#388e3c", fontWeight: "bold", fontSize: "1.1rem" }}>
            🎉 All items sorted!
          </p>
        )}
      </div>

      {/* Bins */}
      <div style={{
        display: "flex", justifyContent: "space-around",
        marginTop: 20, gap: 12, flexWrap: "wrap",
      }}>
        {categories.map((cat, i) => (
          <div
            key={cat.id}
            ref={el => { binRefs.current[i] = el; }}
            onDrop={(e) => onDrop(e, cat.id)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              width: 130, minHeight: 110,
              background: cat.color, borderRadius: 15,
              display: "flex", justifyContent: "center",
              alignItems: "center", fontWeight: "bold",
              color: "#fff", flexDirection: "column",
              gap: 6, padding: "10px",
              transition: "transform 0.15s, box-shadow 0.15s",
              transform: activeBin === cat.id ? "scale(1.1)" : "scale(1)",
              boxShadow: activeBin === cat.id
                ? "0 0 0 3px white, 0 8px 20px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <span>{cat.label}</span>
            <span style={{ fontSize: 11, opacity: 0.85 }}>Drop items here</span>
          </div>
        ))}
      </div>

      <button
        onClick={restart}
        style={{
          marginTop: 24, padding: "10px 24px",
          background: "linear-gradient(135deg,#43cea2,#185a9d)",
          color: "#fff", border: "none", borderRadius: 10,
          cursor: "pointer", fontSize: "1rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        🔄 Restart
      </button>

      {/* Touch ghost — floating item preview while dragging on mobile */}
      {ghost && (
        <div style={{
          position: "fixed",
          left: ghost.x - 32,
          top: ghost.y - 32,
          width: 64, height: 64,
          borderRadius: "50%", background: "#fff",
          display: "flex", justifyContent: "center",
          alignItems: "center", fontSize: 30,
          border: "2px solid #43cea2",
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          pointerEvents: "none", zIndex: 9999,
          opacity: 0.92,
        }}>
          {ghost.emoji}
        </div>
      )}
    </div>
  );
};

export default WasteSortingGame;