// src/components/DashboardHeader.tsx
import React from "react";
import { Trophy, TrendingUp, Flame, Medal, Target, Star } from "lucide-react";

interface StatItem {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  highlight?: boolean;
}

interface DashboardHeaderProps {
  name: string;
  subtitle: string;
  role: "citizen" | "employee";
  stats: StatItem[];
  levelBadge?: string;
}

const DashboardHeader = ({
  name,
  subtitle,
  role,
  stats,
  levelBadge = "Level 1",
}: DashboardHeaderProps) => {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const emoji = role === "citizen" ? "👋" : "👷";

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-accent text-white">

      {/* ── Decorative background shapes ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Large circle top-right */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        {/* Medium circle bottom-left */}
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
        {/* Small accent dot cluster */}
        <div className="absolute top-8 left-1/2 w-3 h-3 rounded-full bg-white/20" />
        <div className="absolute top-14 left-[55%] w-2 h-2 rounded-full bg-white/15" />
        <div className="absolute top-6 left-[60%] w-1.5 h-1.5 rounded-full bg-white/10" />
        {/* Diagonal shimmer line */}
        <div className="absolute inset-0 opacity-10"
          style={{
            background: "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-5 md:py-7">

        {/* ── Top row: greeting + level badge ── */}
        <div className="flex items-start justify-between mb-5 md:mb-6">
          <div className="flex-1 min-w-0">
            {/* Greeting pill */}
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white/90 mb-2 border border-white/20">
              <Star className="h-3 w-3 fill-white/80 text-white/80" />
              {greeting}
            </div>
            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
              {name} {emoji}
            </h1>
            {/* Subtitle */}
            <p className="text-white/75 text-xs md:text-sm mt-1 truncate">{subtitle}</p>
          </div>

          {/* Level badge */}
          <div className="ml-3 flex-shrink-0 flex flex-col items-center gap-1">
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-3 py-2 flex items-center gap-2 shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Trophy className="h-4 w-4 text-yellow-300" />
              </div>
              <div>
                <p className="text-xs text-white/70 leading-none">Rank</p>
                <p className="text-sm font-bold leading-tight">{levelBadge}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 5)}, minmax(0, 1fr))` }}>
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`
                relative rounded-2xl px-3 py-3 md:px-4 md:py-4 text-center overflow-hidden
                transition-transform duration-200 hover:scale-105
                ${stat.highlight
                  ? "bg-white/25 border border-white/40 shadow-lg"
                  : "bg-white/12 border border-white/20"
                }
              `}
            >
              {/* Icon top */}
              <div className="flex justify-center mb-1.5">
                <div className={`rounded-lg p-1 ${stat.highlight ? "bg-white/25" : "bg-white/15"}`}>
                  {stat.icon}
                </div>
              </div>
              {/* Value */}
              <div className="text-lg md:text-2xl font-bold leading-tight text-white">
                {stat.value}
              </div>
              {/* Label */}
              <p className="text-xs text-white/75 mt-0.5 leading-tight">{stat.label}</p>

              {/* Subtle inner glow for highlight */}
              {stat.highlight && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div className="mt-4 md:mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-white/80" />
              <span className="text-xs font-medium text-white/80">Weekly Goal</span>
            </div>
            <span className="text-xs font-bold text-white">70%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 progress-bar"
              style={{
                width: "70%",
                background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
              }}
            />
          </div>
          <p className="text-xs text-white/60 mt-1">You're 150 points away from your weekly goal!</p>
        </div>

      </div>
    </div>
  );
};

export default DashboardHeader;