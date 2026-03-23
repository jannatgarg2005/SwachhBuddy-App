import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
type Vector2D = { x: number; y: number };
type ItemObject = { id: number; position: Vector2D; size: Vector2D; type: 'biodegradable'; name: 'apple' | 'banana' | 'paperball'; };
type EnemyObject = { id: number; position: Vector2D; size: Vector2D; type: 'non-biodegradable'; name: 'bottle' | 'can' | 'plasticbag'; velocity: Vector2D; };
type HazardObject = { id: number; position: Vector2D; size: Vector2D; type: 'hazard'; name: 'glass'; };
type CloudObject = { id: number; position: Vector2D; size: Vector2D; speed: number; };
type Platform = { id: number; position: Vector2D; size: Vector2D; type: 'G' | 'D' | 'B' | 'P' | 'S'; };
type GameState = 'start' | 'playing' | 'gameOver';

// --- GAME CONSTANTS ---
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 48;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -15;
const BASE_PLAYER_SPEED = 4;
const BASE_ENEMY_SPEED = 0.5;
const TILE_SIZE = 40;
const LEVEL_CHUNK_WIDTH = SCREEN_WIDTH;

// --- ASSET COMPONENTS ---
const PlayerCharacter = ({ direction }: { direction: 'left' | 'right' }) => (
  <div style={{ width: PLAYER_WIDTH, height: PLAYER_HEIGHT, transform: `scaleX(${direction === 'left' ? -1 : 1})` }}>
    <svg viewBox="0 0 16 24" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <rect x="4" y="0" width="8" height="2" fill="#22C55E" />
      <rect x="3" y="2" width="12" height="2" fill="#22C55E" />
      <rect x="2" y="4" width="2" height="4" fill="#A16207" />
      <rect x="11" y="4" width="2" height="2" fill="#A16207" />
      <rect x="4" y="4" width="7" height="6" fill="#FCD34D" />
      <rect x="8" y="6" width="2" height="2" fill="#000000" />
      <rect x="4" y="10" width="8" height="4" fill="#2563EB" />
      <rect x="2" y="12" width="2" height="2" fill="#2563EB" />
      <rect x="12" y="12" width="2" height="2" fill="#2563EB" />
      <rect x="4" y="10" width="2" height="4" fill="#E11D48" />
      <rect x="10" y="10" width="2" height="4" fill="#E11D48" />
      <rect x="2" y="14" width="12" height="2" fill="#E11D48" />
      <rect x="2" y="20" width="4" height="4" fill="#A16207" />
      <rect x="10" y="20" width="4" height="4" fill="#A16207" />
      <rect x="4" y="16" width="2" height="4" fill="#FCD34D" />
      <rect x="10" y="16" width="2" height="4" fill="#FCD34D" />
    </svg>
  </div>
);

const Apple = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <rect x="6" y="1" width="2" height="2" fill="#654321" />
      <rect x="5" y="3" width="1" height="1" fill="#22C55E" />
      <rect x="4" y="4" width="8" height="2" fill="#EF4444" />
      <rect x="3" y="6" width="10" height="6" fill="#EF4444" />
      <rect x="4" y="12" width="8" height="1" fill="#DC2626" />
      <rect x="5" y="5" width="2" height="2" fill="#FDE047" opacity="0.7" />
    </svg>
  </div>
);

const Banana = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <path d="M3,12 C3,12 4,8 8,7 C12,6 13,3 13,3 C13,3 12,6 8,8 C4,10 3,13 3,13Z" fill="#FDE047" />
      <path d="M13,3 L12,4 L8,8 L4,13 L3,12 L8,7 L12,3Z" stroke="#FBBF24" fill="none" />
      <rect x="11" y="1" width="2" height="2" fill="#654321" />
    </svg>
  </div>
);

const PaperBall = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <path d="M4,4 C2,6 3,10 5,12 C7,14 11,15 13,12 C15,9 14,5 11,4 C9,3 6,2 4,4Z" fill="#E5E7EB" />
      <path d="M5,5 L7,8 L5,9Z" fill="#9CA3AF" />
      <path d="M10,9 L12,11 L12,9Z" fill="#9CA3AF" />
    </svg>
  </div>
);

const PlasticBottle = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <rect x="6" y="1" width="4" height="2" fill="#DC2626" />
      <rect x="5" y="3" width="6" height="1" fill="#99F6E4" />
      <rect x="4" y="4" width="8" height="10" fill="#67E8F9" opacity="0.8" />
      <rect x="4" y="14" width="8" height="1" fill="#0D9488" />
    </svg>
  </div>
);

const SodaCan = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <rect x="4" y="3" width="8" height="10" fill="#9CA3AF" />
      <rect x="3" y="4" width="10" height="8" fill="#6B7280" />
      <rect x="4" y="3" width="8" height="1" fill="#E5E7EB" />
      <rect x="4" y="12" width="8" height="1" fill="#4B5563" />
      <rect x="6" y="5" width="4" height="6" fill="#EF4444" />
    </svg>
  </div>
);

const PlasticBag = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE }}>
    <svg viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <path d="M3,6 C3,3 5,2 8,2 C11,2 13,3 13,6 L14,14 L2,14 L3,6Z" fill="#F9FAFB" opacity="0.8" />
      <rect x="6" y="3" width="1" height="3" fill="#EF4444" />
      <rect x="9" y="3" width="1" height="3" fill="#EF4444" />
      <path d="M4,6 L12,6" stroke="#E5E7EB" fill="none" />
    </svg>
  </div>
);

const BrokenGlass = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE / 2 }}>
    <svg viewBox="0 0 16 8" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <path d="M2,7 L4,2 L6,7Z" fill="#67E8F9" opacity="0.6" />
      <path d="M7,7 L8,4 L10,7Z" fill="#99F6E4" opacity="0.6" />
      <path d="M11,7 L13,1 L14,7Z" fill="#67E8F9" opacity="0.6" />
    </svg>
  </div>
);

const Cloud = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute" style={style}>
    <svg viewBox="0 0 40 20" style={{ imageRendering: 'pixelated', width: '100%', height: '100%' }}>
      <rect x="5" y="5" width="30" height="10" fill="white" />
      <rect x="10" y="0" width="20" height="5" fill="white" />
      <rect x="0" y="10" width="5" height="5" fill="white" />
      <rect x="35" y="10" width="5" height="5" fill="white" />
    </svg>
  </div>
);

const BrickBlock = () => (
  <div style={{ width: TILE_SIZE, height: TILE_SIZE, background: '#F97316', border: '2px solid #9A3412' }}>
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 w-full h-px bg-[#9A3412]"></div>
      <div className="absolute top-1/2 left-0 w-full h-px bg-[#9A3412] -translate-y-px"></div>
      <div className="absolute top-0 left-1/2 w-px h-full bg-[#9A3412]"></div>
    </div>
  </div>
);

const TouchControls = ({
  onLeftStart, onLeftEnd, onRightStart, onRightEnd, onJump,
}: {
  onLeftStart: () => void; onLeftEnd: () => void;
  onRightStart: () => void; onRightEnd: () => void;
  onJump: () => void;
}) => {
  const btnStyle: React.CSSProperties = {
    width: 60, height: 60, borderRadius: 12,
    background: 'rgba(255,255,255,0.25)',
    border: '2px solid rgba(255,255,255,0.5)',
    color: 'white', fontSize: 24,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    userSelect: 'none', WebkitUserSelect: 'none',
    touchAction: 'none', cursor: 'pointer',
  };
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      padding: '0 16px', zIndex: 30, pointerEvents: 'none',
    }}>
      <div style={{ display: 'flex', gap: 8, pointerEvents: 'all' }}>
        <div style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onLeftStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onLeftEnd(); }}
          onMouseDown={onLeftStart} onMouseUp={onLeftEnd} onMouseLeave={onLeftEnd}>◀</div>
        <div style={btnStyle}
          onTouchStart={(e) => { e.preventDefault(); onRightStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onRightEnd(); }}
          onMouseDown={onRightStart} onMouseUp={onRightEnd} onMouseLeave={onRightEnd}>▶</div>
      </div>
      <div style={{ pointerEvents: 'all' }}>
        <div style={{ ...btnStyle, width: 70, height: 70, borderRadius: 35, background: 'rgba(34,197,94,0.6)', border: '2px solid rgba(34,197,94,0.9)', fontSize: 28 }}
          onTouchStart={(e) => { e.preventDefault(); onJump(); }}
          onMouseDown={onJump}>⬆</div>
      </div>
    </div>
  );
};

// --- MAIN GAME ---
export default function EcoMario() {
  const [gameState, setGameState]           = useState<GameState>('start');
  const [score, setScore]                   = useState(0);
  const [playerPosition, setPlayerPosition] = useState<Vector2D>({ x: 100, y: 400 });
  const [playerVelocity, setPlayerVelocity] = useState<Vector2D>({ x: 0, y: 0 });
  const [isJumping, setIsJumping]           = useState(false);
  const [direction, setDirection]           = useState<'left' | 'right'>('right');
  const [cameraX, setCameraX]               = useState(0);
  const [items, setItems]                   = useState<ItemObject[]>([]);
  const [enemies, setEnemies]               = useState<EnemyObject[]>([]);
  const [hazards, setHazards]               = useState<HazardObject[]>([]);
  const [platforms, setPlatforms]           = useState<Platform[]>([]);
  const [clouds, setClouds]                 = useState<CloudObject[]>([]);

  // ✅ FIX 1: use keysRef.current everywhere — never .current extracted once
  const keysRef          = useRef<{ [key: string]: boolean }>({});
  const generatedUntilX  = useRef(0);
  const gameFrame        = useRef(0);
  const animationFrameId = useRef<number>();

  // ✅ FIX 2: scale tracked in state, canvas uses overflow:hidden + transform from center
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const parentW = wrapperRef.current.parentElement?.clientWidth ?? window.innerWidth;
      // Use full available width, leave 32px padding, cap at 1
      const s = Math.min(1, (parentW - 16) / SCREEN_WIDTH);
      setScale(s);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const generateChunk = useCallback((startX: number) => {
    const newPlatforms: Platform[] = [];
    const newItems: ItemObject[]   = [];
    const newEnemies: EnemyObject[] = [];
    const newHazards: HazardObject[] = [];
    let lastPlatformY = SCREEN_HEIGHT - TILE_SIZE * 2;
    let currentX = startX;
    const endX = startX + LEVEL_CHUNK_WIDTH;

    while (currentX < endX) {
      const groundY = SCREEN_HEIGHT - TILE_SIZE;
      newPlatforms.push({ id: Math.random(), position: { x: currentX, y: groundY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'G' });
      newPlatforms.push({ id: Math.random(), position: { x: currentX, y: groundY + TILE_SIZE }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'D' });

      if (currentX > TILE_SIZE * 5 && Math.random() < 0.15) {
        const objectX = currentX;
        const objectY = groundY - TILE_SIZE;
        const rand = Math.random();
        if (rand < 0.5) {
          const t = Math.random();
          const name: 'apple' | 'banana' | 'paperball' = t < 0.45 ? 'apple' : t < 0.9 ? 'banana' : 'paperball';
          newItems.push({ id: Math.random(), position: { x: objectX, y: objectY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'biodegradable', name });
        } else if (rand < 0.85) {
          const name: 'bottle' | 'can' = Math.random() < 0.5 ? 'bottle' : 'can';
          newEnemies.push({ id: Math.random(), position: { x: objectX, y: objectY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'non-biodegradable', name, velocity: { x: -BASE_ENEMY_SPEED, y: 0 } });
        } else {
          newHazards.push({ id: Math.random(), position: { x: objectX, y: groundY - TILE_SIZE / 2 }, size: { x: TILE_SIZE, y: TILE_SIZE / 2 }, type: 'hazard', name: 'glass' });
        }
      }

      if (Math.random() < 0.7 && currentX > startX + TILE_SIZE * 3) {
        const heightVar = (Math.random() - 0.5) * TILE_SIZE * 4;
        const platformY = Math.max(TILE_SIZE * 4, Math.min(SCREEN_HEIGHT - TILE_SIZE * 5, lastPlatformY + heightVar));
        const platformLength = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < platformLength; i++) {
          const x = currentX + i * TILE_SIZE;
          if (x > endX) break;
          newPlatforms.push({ id: Math.random(), position: { x, y: platformY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'B' });
        }
        if (Math.random() < 0.65) {
          const objectX = currentX + Math.floor(platformLength / 2) * TILE_SIZE;
          const objectY = platformY - TILE_SIZE;
          const rand = Math.random();
          if (rand < 0.55) {
            const t = Math.random();
            const name: 'apple' | 'banana' | 'paperball' = t < 0.45 ? 'apple' : t < 0.9 ? 'banana' : 'paperball';
            newItems.push({ id: Math.random(), position: { x: objectX, y: objectY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'biodegradable', name });
          } else if (rand < 0.85) {
            const t = Math.random();
            const name: 'bottle' | 'can' | 'plasticbag' = t < 0.45 ? 'bottle' : t < 0.9 ? 'can' : 'plasticbag';
            newEnemies.push({ id: Math.random(), position: { x: objectX, y: objectY }, size: { x: TILE_SIZE, y: TILE_SIZE }, type: 'non-biodegradable', name, velocity: { x: name === 'plasticbag' ? 0 : -BASE_ENEMY_SPEED, y: 0 } });
          } else {
            newHazards.push({ id: Math.random(), position: { x: objectX, y: platformY - TILE_SIZE / 2 }, size: { x: TILE_SIZE, y: TILE_SIZE / 2 }, type: 'hazard', name: 'glass' });
          }
        }
        currentX += (platformLength + Math.floor(Math.random() * 2) + 1) * TILE_SIZE;
      } else {
        currentX += TILE_SIZE;
      }
    }
    setPlatforms(prev => [...prev, ...newPlatforms]);
    setItems(prev => [...prev, ...newItems]);
    setEnemies(prev => [...prev, ...newEnemies]);
    setHazards(prev => [...prev, ...newHazards]);
    generatedUntilX.current = endX;
  }, []);

  const cleanupDistantObjects = useCallback((camX: number) => {
    const cleanupLimit = camX - SCREEN_WIDTH;
    if (gameFrame.current % 120 === 0) {
      setPlatforms(prev => prev.filter(p => p.position.x > cleanupLimit));
      setItems(prev => prev.filter(i => i.position.x > cleanupLimit));
      setEnemies(prev => prev.filter(e => e.position.x > cleanupLimit));
      setHazards(prev => prev.filter(h => h.position.x > cleanupLimit));
    }
  }, []);

  // ✅ FIX 1: wipe ALL key states on every restart
  const resetGame = useCallback(() => {
    keysRef.current = {};
    setPlayerPosition({ x: 100, y: 400 });
    setPlayerVelocity({ x: 0, y: 0 });
    setIsJumping(false);
    setDirection('right');
    setScore(0);
    setPlatforms([]); setItems([]); setEnemies([]); setHazards([]);
    setCameraX(0);
    generatedUntilX.current = 0;
    gameFrame.current = 0;
    const initialClouds: CloudObject[] = [];
    for (let i = 0; i < 5; i++) {
      initialClouds.push({ id: i, position: { x: Math.random() * SCREEN_WIDTH, y: Math.random() * (SCREEN_HEIGHT / 3) }, size: { x: (Math.random() * 50) + 60, y: (Math.random() * 25) + 30 }, speed: (Math.random() * 0.2) + 0.1 });
    }
    setClouds(initialClouds);
    generateChunk(0);
    generateChunk(LEVEL_CHUNK_WIDTH);
    setGameState('playing');
  }, [generateChunk]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'Space') e.preventDefault();
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.code === 'Space') e.preventDefault();
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysRef.current = {};
    };
  }, []);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;
    gameFrame.current++;

    if (playerPosition.x > generatedUntilX.current - LEVEL_CHUNK_WIDTH) generateChunk(generatedUntilX.current);
    cleanupDistantObjects(cameraX);

    setClouds(prevClouds => prevClouds.map(cloud => {
      let newX = cloud.position.x - cloud.speed;
      if (newX < -cloud.size.x) newX = SCREEN_WIDTH;
      return { ...cloud, position: { ...cloud.position, x: newX } };
    }));

    let pos = { ...playerPosition };
    let vel = { ...playerVelocity };
    const keys = keysRef.current;
    const currentPlayerSpeed = BASE_PLAYER_SPEED + Math.floor(score / 50) * 0.5;

    vel.x = 0;
    if (keys['ArrowLeft'])  { vel.x = -currentPlayerSpeed; setDirection('left'); }
    if (keys['ArrowRight']) { vel.x = currentPlayerSpeed;  setDirection('right'); }
    pos.x += vel.x;
    pos.x = Math.max(0, pos.x);

    vel.y += GRAVITY;
    pos.y += vel.y;

    let onGround = false;
    const playerRect = { x: pos.x, y: pos.y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };

    for (const p of platforms) {
      const pr = { x: p.position.x, y: p.position.y, width: p.size.x, height: p.size.y };
      if (playerRect.x < pr.x + pr.width && playerRect.x + playerRect.width > pr.x && playerRect.y < pr.y + pr.height && playerRect.y + playerRect.height > pr.y) {
        const prevBottom = (pos.y - vel.y) + PLAYER_HEIGHT;
        if (vel.y >= 0 && prevBottom <= pr.y) {
          pos.y = pr.y - PLAYER_HEIGHT; vel.y = 0; onGround = true; setIsJumping(false);
        } else if (vel.y < 0 && pos.y >= pr.y + pr.height) {
          pos.y = pr.y + pr.height; vel.y = 0;
        } else {
          if (vel.x > 0) pos.x = pr.x - PLAYER_WIDTH;
          else if (vel.x < 0) pos.x = pr.x + pr.width;
        }
      }
    }

    if ((keys['ArrowUp'] || keys['Space']) && onGround && !isJumping) {
      vel.y = JUMP_STRENGTH; setIsJumping(true);
    }

    setItems(prev => prev.filter(item => {
      if (Math.abs(pos.x - item.position.x) < 40 && Math.abs(pos.y - item.position.y) < 40) { setScore(s => s + 10); return false; }
      return true;
    }));

    for (const hazard of hazards) {
      if (playerRect.x < hazard.position.x + hazard.size.x && playerRect.x + playerRect.width > hazard.position.x && playerRect.y < hazard.position.y + hazard.size.y && playerRect.y + playerRect.height > hazard.position.y) {
        setGameState('gameOver'); return;
      }
    }

    setEnemies(prevEnemies => {
      const updatedEnemies = prevEnemies.map(enemy => {
        let newPos = { ...enemy.position };
        let newVel = { ...enemy.velocity };
        if (enemy.name === 'plasticbag') {
          newPos.y += Math.sin(gameFrame.current / 30) * 0.7;
        } else {
          newPos.x += newVel.x;
          newVel.y += GRAVITY;
          newPos.y += newVel.y;
          for (const p of platforms) {
            const er = { ...newPos, width: TILE_SIZE, height: TILE_SIZE };
            const pr = { ...p.position, width: p.size.x, height: p.size.y };
            if (er.x < pr.x + pr.width && er.x + er.width > pr.x && er.y < pr.y + pr.height && er.y + er.height > pr.y) {
              if (newVel.y >= 0 && (enemy.position.y + TILE_SIZE) <= pr.y) {
                newPos.y = pr.y - TILE_SIZE; newVel.y = 0;
                const nextX = newPos.x + (newVel.x > 0 ? TILE_SIZE : -TILE_SIZE);
                const below = platforms.some(p2 => nextX >= p2.position.x && nextX < p2.position.x + p2.size.x && newPos.y + TILE_SIZE >= p2.position.y && newPos.y + TILE_SIZE < p2.position.y + p2.size.y);
                if (!below) newVel.x *= -1;
              } else if (Math.abs(newPos.y - p.position.y) < TILE_SIZE / 2) {
                newVel.x *= -1;
              }
            }
          }
        }
        return { ...enemy, position: newPos, velocity: newVel };
      });

      for (const enemy of updatedEnemies) {
        if (Math.abs(pos.x - enemy.position.x) < 35 && Math.abs(pos.y - enemy.position.y) < 45) {
          if (enemy.name !== 'plasticbag' && vel.y > 0 && (pos.y + PLAYER_HEIGHT) < (enemy.position.y + 20)) {
            setScore(s => s + 20); vel.y = -8;
            return updatedEnemies.filter(e => e.id !== enemy.id);
          } else {
            setGameState('gameOver'); return updatedEnemies;
          }
        }
      }
      return updatedEnemies;
    });

    if (pos.y > SCREEN_HEIGHT + PLAYER_HEIGHT) setGameState('gameOver');

    setPlayerPosition(pos);
    setPlayerVelocity(vel);
    const targetCameraX = pos.x - SCREEN_WIDTH / 4;
    setCameraX(prevCamX => prevCamX + (targetCameraX - prevCamX) * 0.1);
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerPosition, playerVelocity, platforms, hazards, score, generateChunk, cleanupDistantObjects, isJumping, cameraX]);

  useEffect(() => {
    if (gameState === 'playing') { animationFrameId.current = requestAnimationFrame(gameLoop); }
    else if (animationFrameId.current) { cancelAnimationFrame(animationFrameId.current); }
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [gameState, gameLoop]);

  const renderItem     = (obj: ItemObject)   => { const C = obj.name === 'apple' ? Apple : obj.name === 'banana' ? Banana : PaperBall; return <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><C /></div>; };
  const renderEnemy    = (obj: EnemyObject)  => { const C = obj.name === 'bottle' ? PlasticBottle : obj.name === 'can' ? SodaCan : PlasticBag; return <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><C /></div>; };
  const renderHazard   = (obj: HazardObject) => <div key={obj.id} className="absolute" style={{ left: obj.position.x, top: obj.position.y }}><BrokenGlass /></div>;
  const renderPlatform = (p: Platform) => {
    let PC;
    if (p.type === 'G')      PC = <div style={{ width: TILE_SIZE, height: TILE_SIZE, background: '#16A34A', borderBottom: '4px solid #14532D', borderRight: '2px solid #14532D' }} />;
    else if (p.type === 'D') PC = <div style={{ width: TILE_SIZE, height: TILE_SIZE, background: '#A16207' }} />;
    else if (p.type === 'B') PC = <BrickBlock />;
    else                     PC = <div style={{ width: TILE_SIZE, height: TILE_SIZE, background: '#475569', border: '2px solid #1E293B' }} />;
    return <div key={p.id} className="absolute" style={{ left: p.position.x, top: p.position.y }}>{PC}</div>;
  };

  const visiblePlatforms = useMemo(() => platforms.filter(p => p.position.x > cameraX - TILE_SIZE && p.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [platforms, cameraX]);
  const visibleItems     = useMemo(() => items.filter(i => i.position.x > cameraX - TILE_SIZE && i.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [items, cameraX]);
  const visibleEnemies   = useMemo(() => enemies.filter(e => e.position.x > cameraX - TILE_SIZE && e.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [enemies, cameraX]);
  const visibleHazards   = useMemo(() => hazards.filter(h => h.position.x > cameraX - TILE_SIZE && h.position.x < cameraX + SCREEN_WIDTH + TILE_SIZE), [hazards, cameraX]);

  // ✅ FIX 2: scaled canvas height so wrapper collapses correctly with no overflow
  const scaledW = SCREEN_WIDTH  * scale;
  const scaledH = SCREEN_HEIGHT * scale;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-[#38B6FF] font-mono select-none pt-3 pb-4 px-2">
      <h1 className="text-xl sm:text-3xl font-bold text-white mb-2 text-center"
        style={{ fontFamily: '"Press Start 2P", cursive' }}>
        Eco Hero
      </h1>

      {/* ✅ Outer wrapper exactly matches scaled canvas size — no overflow, no dead space */}
      <div
        ref={wrapperRef}
        style={{
          width:    scaledW,
          height:   scaledH,
          position: 'relative',
          overflow: 'hidden',   // clip anything that bleeds out
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      >
        {/* ✅ Canvas scaled from top-left, wrapper clips it to exact size */}
        <div
          style={{
            width:           SCREEN_WIDTH,
            height:          SCREEN_HEIGHT,
            transformOrigin: 'top left',
            transform:       `scale(${scale})`,
            position:        'absolute',
            top: 0, left: 0,
          }}
          className="bg-[#7dd3fc]"
        >
          {/* Start screen */}
          {gameState === 'start' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white gap-4">
              <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 36 }}>Ready?</h2>
              <p className="text-sm text-green-300 text-center px-8">Collect fruit • Stomp on trash • Avoid glass</p>
              <button onClick={resetGame}
                style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 18 }}
                className="px-8 py-4 bg-green-500 rounded-lg shadow-lg hover:bg-green-600">
                Start Game
              </button>
            </div>
          )}

          {/* Game Over screen */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white gap-4">
              <h2 style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 36, color: '#f87171' }}>Game Over</h2>
              <p style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 20 }}>Score: {score}</p>
              <button onClick={resetGame}
                style={{ fontFamily: '"Press Start 2P", cursive', fontSize: 18 }}
                className="px-8 py-4 bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600">
                Try Again
              </button>
            </div>
          )}

          {/* Clouds */}
          {clouds.map(cloud => (
            <Cloud key={cloud.id} style={{ left: cloud.position.x, top: cloud.position.y, width: cloud.size.x, height: cloud.size.y, opacity: 0.8, zIndex: 0 }} />
          ))}

          {/* Score */}
          <div className="absolute top-4 left-4 text-white text-xl z-20" style={{ fontFamily: '"Press Start 2P", cursive' }}>
            SCORE: {score}
          </div>

          {/* Game world */}
          <div className="absolute z-10" style={{ transform: `translateX(-${cameraX}px)` }}>
            <div className="absolute" style={{ left: playerPosition.x, top: playerPosition.y }}>
              <PlayerCharacter direction={direction} />
            </div>
            {visibleItems.map(renderItem)}
            {visibleEnemies.map(renderEnemy)}
            {visibleHazards.map(renderHazard)}
            {visiblePlatforms.map(renderPlatform)}
          </div>

          {/* Touch controls */}
          {gameState === 'playing' && (
            <TouchControls
              onLeftStart={()  => { keysRef.current['ArrowLeft']  = true;  }}
              onLeftEnd={()    => { keysRef.current['ArrowLeft']  = false; }}
              onRightStart={() => { keysRef.current['ArrowRight'] = true;  }}
              onRightEnd={()   => { keysRef.current['ArrowRight'] = false; }}
              onJump={()       => { keysRef.current['ArrowUp'] = true; setTimeout(() => { keysRef.current['ArrowUp'] = false; }, 150); }}
            />
          )}
        </div>
      </div>

      {/* Controls legend */}
      <div className="text-white mt-3 text-center space-y-1 px-4" style={{ fontSize: Math.max(10, 13 * scale) }}>
        <p>📱 <strong>Mobile:</strong> Use ◀ ▶ to move and ⬆ to jump</p>
        <p>⌨️ <strong>Desktop:</strong> Arrow keys / Space to jump</p>
        <p>🍎 Collect fruit (+10) • 👟 Stomp trash (+20) • 🔪 Avoid glass!</p>
      </div>
    </div>
  );
}