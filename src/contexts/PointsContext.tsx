// src/contexts/PointsContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Replace the mock backend functions with your real backend (Firestore / REST API).
 * I included small localStorage mocks so this will work for local dev.
 */

async function mockGetUserCoins(uid: string): Promise<number> {
  try {
    const persisted = localStorage.getItem(`mock_coins_${uid}`);
    return persisted ? Number(persisted) : 0;
  } catch {
    return 0;
  }
}

async function mockUpdateUserCoins(uid: string, delta: number): Promise<number> {
  try {
    const cur = await mockGetUserCoins(uid);
    const updated = Math.max(0, cur + delta);
    localStorage.setItem(`mock_coins_${uid}`, String(updated));
    // simulate network latency
    await new Promise((r) => setTimeout(r, 200));
    return updated;
  } catch (err) {
    throw err;
  }
}

type PointsContextType = {
  coins: number;
  loading: boolean;
  earn: (amount: number, meta?: any) => Promise<number>;
  redeem: (amount: number, meta?: any) => Promise<number>;
  refresh: () => Promise<void>;
};

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setCoins(0);
      setLoading(false);
      return;
    }
    try {
      const c = await mockGetUserCoins(user.uid);
      setCoins(c);
    } catch (err) {
      console.error("Points refresh error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Earn points with optimistic update
  const earn = useCallback(
    async (amount: number, meta?: any) => {
      if (!user) throw new Error("Not authenticated");
      // optimistic
      setCoins((p) => p + amount);

      try {
        const updated = await mockUpdateUserCoins(user.uid, amount);
        setCoins(updated);
        toast({
          title: "Points Earned!",
          description: `+${amount} points${meta?.source ? ` (${meta.source})` : ""}`,
        });
        return updated;
      } catch (err) {
        console.error("earn error:", err);
        // revert by re-fetching authoritative value
        await refresh();
        toast({
          title: "Sync failed",
          description: "Couldn't sync earned points. They will be retried.",
          variant: "destructive",
        });
        throw err;
      }
    },
    [refresh, toast, user]
  );

  // Redeem points with optimistic update
  const redeem = useCallback(
    async (amount: number, meta?: any) => {
      if (!user) throw new Error("Not authenticated");
      // optimistic
      setCoins((p) => Math.max(0, p - amount));

      try {
        const updated = await mockUpdateUserCoins(user.uid, -amount);
        setCoins(updated);
        toast({
          title: "Redeemed",
          description: `-${amount} points`,
        });
        return updated;
      } catch (err) {
        console.error("redeem error:", err);
        await refresh();
        toast({
          title: "Redeem failed",
          description: "Couldn't process redemption. Try again later.",
          variant: "destructive",
        });
        throw err;
      }
    },
    [refresh, toast, user]
  );

  return (
    <PointsContext.Provider value={{ coins, loading, earn, redeem, refresh }}>
      {children}
    </PointsContext.Provider>
  );
};

export function usePoints(): PointsContextType {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used inside PointsProvider");
  return ctx;
}
