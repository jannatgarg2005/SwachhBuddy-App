import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
    Copy,
    Share2,
    Users,
    Gift,
    ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { generateReferralCode, getReferralStats } from "@/services/referral";

interface ReferAndEarnProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReferralStats {
    totalReferrals: number;
    totalEarnings: number;
    pendingReferrals: number;
}

const ReferAndEarn = ({ isOpen, onClose }: ReferAndEarnProps) => {
    const [referralCode, setReferralCode] = useState("");
    const [referralLink, setReferralLink] = useState("");
    const [stats, setStats] = useState<ReferralStats>({
        totalReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0,
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!isOpen || !user) return;

        const loadReferralData = async () => {
            try {
                setLoading(true);

                const code = await generateReferralCode(user.uid);

                if (code && code.trim()) {
                    setReferralCode(code);
                    const link = `${window.location.origin}/signup?ref=${code}`;
                    setReferralLink(link);
                } else {
                    // Fallback: derive a temporary code from the UID so the user
                    // always has something to share even if Firestore is slow.
                    const fallbackCode = `TEMP${user.uid.substring(0, 6).toUpperCase()}`;
                    setReferralCode(fallbackCode);
                    setReferralLink(`${window.location.origin}/signup?ref=${fallbackCode}`);
                }

                const referralStats = await getReferralStats(user.uid);
                setStats(referralStats);
            } catch (error) {
                const isOffline =
                    error instanceof Error &&
                    (error.message.includes("offline") ||
                        error.message.includes("Failed to get document"));

                if (isOffline) {
                    const fallbackCode = `TEMP${user.uid.substring(0, 6).toUpperCase()}`;
                    setReferralCode(fallbackCode);
                    setReferralLink(`${window.location.origin}/signup?ref=${fallbackCode}`);
                    setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0 });

                    toast({
                        title: "Offline Mode",
                        description:
                            "Using a temporary referral code. Full features available when back online.",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load referral information. Please try again.",
                        variant: "destructive",
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        loadReferralData();
    }, [isOpen, user, toast]);

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: "Copied!", description: `${label} copied to clipboard` });
        } catch {
            toast({
                title: "Error",
                description: `Failed to copy ${label.toLowerCase()}`,
                variant: "destructive",
            });
        }
    };

    const shareReferralLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Join Swachh Buddy — Gamified Waste Management",
                    text: `Join me on Swachh Buddy and help make India cleaner! Use my referral code: ${referralCode}`,
                    url: referralLink,
                });
            } catch {
                // User cancelled the share sheet — no action needed.
            }
        } else {
            copyToClipboard(referralLink, "Referral link");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Refer &amp; Earn
                    </DialogTitle>
                    <DialogDescription>
                        Invite friends and earn 10 coins for each successful referral!
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* How it works */}
                        <Card>
                            <CardContent className="p-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    How it works
                                </h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {[
                                        "Share your referral code with friends",
                                        "They sign up using your code",
                                        "Both of you get 10 coins instantly!",
                                    ].map((step) => (
                                        <div key={step} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                            <span>{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Referral Code */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Your Referral Code</label>
                            <div className="flex gap-2">
                                <Input
                                    value={referralCode || "Generating…"}
                                    readOnly
                                    className="font-mono text-center text-lg font-bold"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(referralCode, "Referral code")}
                                    disabled={!referralCode}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Referral Link */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Referral Link</label>
                            <div className="flex gap-2">
                                <Input
                                    value={referralLink || "Generating…"}
                                    readOnly
                                    className="text-xs"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(referralLink, "Referral link")}
                                    disabled={!referralLink}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Share Button */}
                        <Button onClick={shareReferralLink} className="w-full" size="lg">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share with Friends
                        </Button>

                        {/* Test Referral Link */}
                        <Button
                            onClick={() => window.open(referralLink, "_blank")}
                            variant="outline"
                            className="w-full"
                            size="sm"
                            disabled={!referralLink}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Test Referral Link
                        </Button>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">
                                    {stats.totalReferrals}
                                </div>
                                <div className="text-xs text-muted-foreground">Total Referrals</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.totalEarnings}
                                </div>
                                <div className="text-xs text-muted-foreground">Coins Earned</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {stats.pendingReferrals}
                                </div>
                                <div className="text-xs text-muted-foreground">Pending</div>
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="text-xs text-muted-foreground text-center">
                            Coins are awarded when your referred friend completes their first QR scan.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReferAndEarn;