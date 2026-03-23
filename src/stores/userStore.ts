import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { updateUserCoinsAndPoints, getUserPoints, getUserCoins, updateUserCoins } from '@/services/referral';

interface UserStore {
  points: number;
  coins: number;
  isLoading: boolean;
  loadUserData: (uid: string) => Promise<void>;
  earnPoints: (uid: string, points: number) => Promise<void>;
  spendCoins: (uid: string, coins: number) => Promise<boolean>;
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      points: 0,
      coins: 0,
      isLoading: false,
      loadUserData: async (uid: string) => {
        set({ isLoading: true });
        try {
          const [points, coins] = await Promise.all([getUserPoints(uid), getUserCoins(uid)]);
          set({ points, coins, isLoading: false });
        } catch (error) {
          console.error('Failed to load user data:', error);
          set({ isLoading: false });
        }
      },
      earnPoints: async (uid: string, points: number) => {
        set({ isLoading: true });
        try {
          const currentPoints = get().points || 0;
          const currentCoins = get().coins || 0;
          const deltaPoints = points;
          const newPoints = currentPoints + deltaPoints;
          const newCoins = currentCoins + deltaPoints; // Assuming 1:1 points-to-coins ratio
          // updateUserCoinsAndPoints expects a delta to add
          await updateUserCoinsAndPoints(uid, deltaPoints);
          set({ points: newPoints, coins: newCoins, isLoading: false });
        } catch (error) {
          console.error('Failed to earn points:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      spendCoins: async (uid: string, coins: number) => {
        set({ isLoading: true });
        try {
          const currentCoins = get().coins || 0;
          if (currentCoins < coins) {
            throw new Error('Insufficient coins');
          }
          const newCoins = currentCoins - coins;
          // Use updateUserCoins with negative delta to decrement
          await updateUserCoins(uid, -coins);
          set({ coins: newCoins, isLoading: false });
          return true;
        } catch (error) {
          console.error('Failed to spend coins:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      reset: () => set({ points: 0, coins: 0, isLoading: false }),
    }),
    {
      name: 'user-store',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);

export const useUserPoints = () => useUserStore((state) => state.points);
export const useUserCoins = () => useUserStore((state) => state.coins);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const clearUserStorePersistence = () => useUserStore.persist.clearStorage();