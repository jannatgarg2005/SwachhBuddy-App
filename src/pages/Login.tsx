import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Recycle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { getUserData } from "@/lib/auth";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const { user, error: authError } = await signInWithEmail(formData.email, formData.password);
            if (authError) { setError(authError); return; }
            if (user) {
                toast({ title: "Welcome back!", description: "Successfully logged in." });
                const userData = await getUserData(user.uid);
                if (userData?.role === 'municipal-employee') {
                    navigate('/dashboard/enduser');
                } else {
                    navigate('/dashboard/corporate');
                }
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            const { user, error } = await signInWithGoogle();
            if (error) { setError(error); return; }
            if (user) {
                toast({ title: "Welcome back!", description: "Signed in with Google." });
                navigate('/dashboard/corporate');
            }
        } catch (err) {
            setError("Failed to sign in with Google. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-md mx-auto">

                    {/* Header — FIXED: explicit dark text always visible */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Recycle className="h-8 w-8 text-white" />
                        </div>
                        {/* FIXED: text-gray-900 dark:text-white instead of text-foreground */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Sign in to continue your journey towards a cleaner India
                        </p>
                    </div>

                    {/* Login Card */}
                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                                Sign In
                            </CardTitle>
                            <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email" name="email" type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password" name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required className="h-11 pr-10"
                                        />
                                        <Button
                                            type="button" variant="ghost" size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword
                                                ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button" variant="outline"
                                    className="w-full h-11 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                    onClick={handleGoogleSignIn} disabled={isLoading}
                                >
                                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Continue with Google
                                </Button>
                            </form>

                            <div className="mt-6 text-center text-sm">
                                <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                                <Link to="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign up here
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default Login;
