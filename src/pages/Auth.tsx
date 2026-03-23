// src/pages/Auth.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/auth";

const Auth = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { userType } = (location.state as { userType: string }) || { userType: "citizen" };

  const [isLogin, setIsLogin]     = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError]         = useState("");
  const [formData, setFormData]   = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();

  const getDashboardRoute = () =>
    userType === "employee" ? "/dashboard/enduser" : "/dashboard/corporate";

  const roleLabel = userType === "employee" ? "Municipal Employee" : "Citizen";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── Email / Password ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        const { user, error: authError } = await signInWithEmail(formData.email, formData.password);
        if (authError) { setError(authError); return; }
        if (user) {
          toast({ title: "Welcome back! 👋", description: `Logged in as ${roleLabel}.` });
          navigate(getDashboardRoute(), { replace: true });
        }
      } else {
        if (formData.password.length < 8) { setError("Password must be at least 8 characters."); return; }
        const role     = userType === "employee" ? "municipal-employee" : "citizen";
        const nameParts = formData.name.trim().split(" ");
        const { user, error: authError } = await signUpWithEmail(
          formData.email, formData.password,
          { displayName: formData.name, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" ") || "", role: role as "citizen" | "municipal-employee" }
        );
        if (authError) { setError(authError); return; }
        if (user) {
          toast({ title: "Account created! 🎉", description: `Welcome to Swachh Buddy as ${roleLabel}!` });
          navigate(getDashboardRoute(), { replace: true });
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const { user, error: authError } = await signInWithGoogle();
      if (authError) { setError(authError); return; }
      if (user) {
        toast({
          title: isLogin ? "Welcome back! 👋" : "Account created! 🎉",
          description: `Signed in with Google as ${roleLabel}.`,
        });
        navigate(getDashboardRoute(), { replace: true });
      }
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-background dark:to-background p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl">{userType === "employee" ? "👷" : "🌱"}</span>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back!" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin ? `Sign in as ${roleLabel}` : `Register as ${roleLabel}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* ── Google Button ── */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-muted/40 font-medium"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              /* Google SVG logo */
              <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </Button>

          {/* ── Divider ── */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-3 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* ── Email / Password form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name" name="name" type="text"
                  placeholder="Enter your full name"
                  value={formData.name} onChange={handleChange}
                  required className="h-11 mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" name="email" type="email"
                placeholder="Enter your email"
                value={formData.email} onChange={handleChange}
                required className="h-11 mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" name="password" type="password"
                placeholder={isLogin ? "Enter your password" : "Min. 8 characters"}
                value={formData.password} onChange={handleChange}
                required className="h-11 mt-1"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading || isGoogleLoading}>
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />{isLogin ? "Signing in..." : "Creating account..."}</>
                : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* ── Toggle login / register ── */}
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => { setIsLogin(!isLogin); setError(""); setFormData({ name: "", email: "", password: "" }); }}
              className="text-primary"
            >
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;