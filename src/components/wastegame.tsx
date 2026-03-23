// src/components/WasteSortingGame/WordSearch.tsx (or wherever this file lives)
import React, { useState, useRef, useEffect, useCallback } from "react";

const words = [
  "GLASS", "PLASTIC", "COMPOST", "MANURE", "BIN",
  "PAPER", "EWASTE", "RECYCLING", "ORGANIC", "SEGREGATE",
];

const GRID_SIZE = 15;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Position { row: number; col: number; }

interface PlacedWord {
  word: string;
  positions: Position[];
}

// ─── Grid Generation ──────────────────────────────────────────────────────────
// Directions: H (→), V (↓), D (↘) — only these 3 so isFound is reliable
const DIRECTIONS = [
  { dr: 0, dc: 1  }, // horizontal →
  { dr: 1, dc: 0  }, // vertical ↓
  { dr: 1, dc: 1  }, // diagonal ↘
];

const generateGrid = (): { grid: string[][]; placedWords: PlacedWord[] } => {
  // Start with empty grid
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("")
  );
  const placedWords: PlacedWord[] = [];

  // Try to place each word up to 100 times
  for (const word of words) {
    let placed = false;
    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const maxRow = GRID_SIZE - word.length * Math.abs(dir.dr);
      const maxCol = GRID_SIZE - word.length * Math.abs(dir.dc);
      if (maxRow < 0 || maxCol < 0) continue;

      const startRow = Math.floor(Math.random() * (maxRow + 1));
      const startCol = Math.floor(Math.random() * (maxCol + 1));

      // Check no conflict (empty cell or same letter)
      let canPlace = true;
      const positions: Position[] = [];
      for (let i = 0; i < word.length; i++) {
        const r = startRow + i * dir.dr;
        const c = startCol + i * dir.dc;
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) {
          canPlace = false;
          break;
        }
        positions.push({ row: r, col: c });
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[positions[i].row][positions[i].col] = word[i];
        }
        placedWords.push({ word, positions });
        placed = true;
      }
    }
  }

  // Fill remaining empty cells with random letters
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, placedWords };
};

// ─── Component ────────────────────────────────────────────────────────────────
const WordSearch: React.FC = () => {
  const [{ grid, placedWords }] = useState(() => generateGrid());
  const [foundWords, setFoundWords]   = useState<string[]>([]);
  const [selection, setSelection]     = useState<Position[]>([]);
  const [lastResult, setLastResult]   = useState<"correct" | "wrong" | null>(null);
  const isSelecting = useRef(false);
  const gridRef     = useRef<HTMLDivElement>(null);
  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Responsive cell size ─────────────────────────────────────────────────
  const [cellSize, setCellSize] = useState(35);
  useEffect(() => {
    const update = () => {
      const available = Math.min(window.innerWidth - 48, 520);
      setCellSize(Math.max(18, Math.min(35, Math.floor(available / GRID_SIZE))));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ── Build lookup maps from placedWords for O(1) highlight ────────────────
  // Maps "row,col" → word it belongs to
  const cellWordMap = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    const map = new Map<string, string>();
    for (const { word, positions } of placedWords) {
      for (const { row, col } of positions) {
        map.set(`${row},${col}`, word);
      }
    }
    cellWordMap.current = map;
  }, [placedWords]);

  const isFound = useCallback((row: number, col: number): boolean => {
    const word = cellWordMap.current.get(`${row},${col}`);
    return word ? foundWords.includes(word) : false;
  }, [foundWords]);

  const isSelected = useCallback((row: number, col: number): boolean =>
    selection.some(p => p.row === row && p.col === col),
  [selection]);

  // ── Get cell from pixel coords ───────────────────────────────────────────
  const getCell = useCallback((clientX: number, clientY: number): Position | null => {
    if (!gridRef.current) return null;
    const rect = gridRef.current.getBoundingClientRect();
    const col = Math.floor((clientX - rect.left) / cellSize);
    const row = Math.floor((clientY - rect.top)  / cellSize);
    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE)
      return { row, col };
    return null;
  }, [cellSize]);

  // ── Selection logic ──────────────────────────────────────────────────────
  const startSelection = useCallback((row: number, col: number) => {
    isSelecting.current = true;
    setSelection([{ row, col }]);
  }, []);

  const extendSelection = useCallback((row: number, col: number) => {
    if (!isSelecting.current) return;
    setSelection(prev => {
      const first = prev[0];
      if (!first) return prev;

      // Only allow straight lines: H, V, or D (↘ / ↗)
      const dr = row - first.row;
      const dc = col - first.col;

      // Must be on a straight line from start
      const isH  = dr === 0;
      const isV  = dc === 0;
      const isDR  = Math.abs(dr) === Math.abs(dc); // diagonal

      if (!isH && !isV && !isDR) return prev;

      // Build all cells from start → current
      const len  = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = len === 0 ? 0 : dr / len;
      const stepC = len === 0 ? 0 : dc / len;

      const cells: Position[] = [];
      for (let i = 0; i <= len; i++) {
        cells.push({
          row: first.row + Math.round(i * stepR),
          col: first.col + Math.round(i * stepC),
        });
      }
      return cells;
    });
  }, []);

  const endSelection = useCallback(() => {
    if (selection.length >= 2) {
      const selected = selection.map(p => grid[p.row][p.col]).join("");
      const reversed = selected.split("").reverse().join("");

      const match = words.find(
        w => (w === selected || w === reversed) && !foundWords.includes(w)
      );

      if (match) {
        setFoundWords(prev => [...prev, match]);
        setLastResult("correct");
      } else {
        setLastResult("wrong");
      }

      if (resultTimer.current) clearTimeout(resultTimer.current);
      resultTimer.current = setTimeout(() => setLastResult(null), 900);
    }
    setSelection([]);
    isSelecting.current = false;
  }, [selection, grid, foundWords]);

  // ── Mouse events ─────────────────────────────────────────────────────────
  const onMouseDown = (row: number, col: number) => startSelection(row, col);
  const onMouseEnter = (row: number, col: number) => extendSelection(row, col);
  const onMouseUp   = () => endSelection();

  // ── Touch events ─────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const cell = getCell(e.touches[0].clientX, e.touches[0].clientY);
    if (cell) startSelection(cell.row, cell.col);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const cell = getCell(e.touches[0].clientX, e.touches[0].clientY);
    if (cell) extendSelection(cell.row, cell.col);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    endSelection();
  };

  const fontSize = Math.max(9, cellSize - 14);
  const allFound = foundWords.length === words.length;

  return (
    <div className="flex flex-col items-center w-full p-4 md:p-6 bg-green-50 dark:bg-green-950 rounded-xl select-none">

      <h2 className="text-lg md:text-2xl font-bold text-green-800 dark:text-green-200 mb-1 text-center">
        🌱 Waste Segregation Word Search 🌱
      </h2>
      <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mb-3 text-center">
        📱 Drag to select words • Find all {words.length} words!
      </p>

      {/* Progress */}
      <div className="mb-2 text-sm font-semibold text-green-700 dark:text-green-300 text-center">
        {foundWords.length}/{words.length} words found
        {allFound && <span className="ml-2 text-green-500">🎉 You found them all!</span>}
      </div>

      {/* Feedback flash */}
      {lastResult && (
        <div className={`mb-2 px-4 py-1 rounded-full text-sm font-bold transition-all
          ${lastResult === "correct"
            ? "bg-green-200 text-green-800"
            : "bg-red-100 text-red-700"}`}>
          {lastResult === "correct" ? "✅ Word found!" : "❌ Not a word, try again"}
        </div>
      )}

      {/* Grid */}
      <div
        ref={gridRef}
        className="inline-block cursor-pointer touch-none"
        style={{
          boxShadow: "0 0 20px rgba(0,128,0,0.2)",
          borderRadius: 8, overflow: "hidden",
        }}
        onMouseLeave={() => { setSelection([]); isSelecting.current = false; }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {grid.map((rowArr, rowIdx) => (
          <div key={rowIdx} style={{ display: "flex" }}>
            {rowArr.map((letter, colIdx) => {
              const found    = isFound(rowIdx, colIdx);
              const selected = isSelected(rowIdx, colIdx);
              return (
                <div
                  key={colIdx}
                  style={{
                    width: cellSize, height: cellSize,
                    border: "1px solid #4caf50",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize,
                    cursor: "pointer",
                    transition: "background 0.1s",
                    backgroundColor: found
                      ? "#4caf50"
                      : selected
                      ? "#a5d6a7"
                      : "#f0fff0",
                    color: found ? "white" : "#1a1a1a",
                    userSelect: "none",
                  }}
                  onMouseDown={() => onMouseDown(rowIdx, colIdx)}
                  onMouseEnter={() => onMouseEnter(rowIdx, colIdx)}
                  onMouseUp={onMouseUp}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Word list */}
      <div className="mt-5 w-full max-w-sm">
        <h3 className="font-bold text-green-800 dark:text-green-200 mb-2 text-sm md:text-base text-center">
          Find these words:
        </h3>
        <div className="grid grid-cols-2 gap-1">
          {words.map(word => (
            <div
              key={word}
              className={`text-sm md:text-base font-bold px-2 py-1 rounded text-center transition-all ${
                foundWords.includes(word)
                  ? "line-through text-green-500 bg-green-100 dark:bg-green-900"
                  : "text-green-800 dark:text-green-300 bg-white/50 dark:bg-white/10"
              }`}
            >
              {foundWords.includes(word) ? "✅ " : ""}{word}
            </div>
          ))}
        </div>
      </div>

      {/* Play again */}
      {allFound && (
        <button
          className="mt-5 px-6 py-2 bg-green-600 text-white font-bold rounded-xl shadow hover:bg-green-700 transition-all"
          onClick={() => window.location.reload()}
        >
          🔄 Play Again
        </button>
      )}
    </div>
  );
};

export default WordSearch;