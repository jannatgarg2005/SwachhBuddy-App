// src/components/RewardsSystem.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Coins, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/PointsContext";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  image: string;
}

interface RewardsSystemProps {
  onBack?: () => void;
  onRedeem?: (points: number, rewardId?: string) => Promise<void> | void;
}

const RewardsSystem: React.FC<RewardsSystemProps> = ({ onBack, onRedeem }) => {
  const { toast } = useToast();
  const { coins, redeem } = usePoints();
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const rewards: RewardItem[] = [
    { id: "mobile-recharge", title: "Mobile Recharge", description: "₹50 Recharge Voucher", points: 500, category: "vouchers", image: "📱" },
    { id: "shopping-voucher", title: "Shopping Voucher", description: "₹100 Shopping Voucher", points: 1000, category: "vouchers", image: "🛒" },
    { id: "tree-plantation", title: "Tree Plantation Certificate", description: "Plant a tree in your name", points: 50, category: "environment", image: "🌱" },
    { id: "eco-bag", title: "Eco-Friendly Bag", description: "Reusable jute shopping bag", points: 300, category: "merchandise", image: "👜" },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vouchers": return "💳";
      case "environment": return "🌍";
      case "merchandise": return "🎁";
      default: return "⭐";
    }
  };

  const handleRedeem = async (reward: RewardItem) => {
    if (coins < reward.points) {
      toast({ title: "Insufficient Points", description: "You don't have enough points.", variant: "destructive" });
      return;
    }

    if (isProcessing[reward.id]) return;
    setIsProcessing((p) => ({ ...p, [reward.id]: true }));

    try {
      await redeem(reward.points);
      if (onRedeem) await onRedeem(reward.points, reward.id);
      toast({ title: "Redeemed!", description: `You've redeemed ${reward.title}.` });
    } catch {
      toast({ title: "Redeem Failed", description: "Try again later.", variant: "destructive" });
    } finally {
      setIsProcessing((p) => ({ ...p, [reward.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Rewards & Achievements</h1>
            <p className="text-muted-foreground">Use your points to redeem offers</p>
          </div>
          <div className="flex items-center gap-4">
            {onBack && <Button variant="outline" onClick={onBack}>Back</Button>}
            <div className="p-3 bg-primary/10 rounded flex items-center gap-3">
              <Coins className="h-6 w-6 text-primary" />
              <div>
                <div className="font-bold text-lg">{coins} pts</div>
                <div className="text-xs text-muted-foreground">Current balance</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid grid-cols-3 gap-2">
            <TabsTrigger value="rewards">Redeem</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((r) => {
                const isAvailable = coins >= r.points;
                return (
                  <Card key={r.id} className={`transition-all duration-200 ${!isAvailable ? "opacity-70" : "hover:scale-105"}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="text-3xl">{r.image}</div>
                        <Badge variant="outline" className="text-xs">{getCategoryIcon(r.category)} {r.category}</Badge>
                      </div>
                      <CardTitle className="text-lg">{r.title}</CardTitle>
                      <CardDescription>{r.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4" />
                          <div className="font-semibold">{r.points} pts</div>
                        </div>
                        {!isAvailable && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <Button
                        onClick={() => handleRedeem(r)}
                        disabled={!isAvailable || !!isProcessing[r.id]}
                        className="w-full"
                        variant={isAvailable ? "default" : "outline"}
                      >
                        {isProcessing[r.id] ? "Processing..." : isAvailable ? (<><Gift className="mr-2 h-4 w-4" /> Redeem</>) : (<><Lock className="mr-2 h-4 w-4" /> Not enough</>)}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="text-center py-10 text-muted-foreground">No achievements yet.</div>
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-10 text-muted-foreground">No redemption history yet.</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RewardsSystem;
