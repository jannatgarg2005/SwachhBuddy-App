import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Recycle, AlertCircle, Users, Building2, CheckCircle, Gift } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { validateReferralCode, processReferralSignup } from "@/services/referral";

const Signup = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        employeeId: "",
        department: "",
        referralCode: searchParams.get('ref') || "",
        agreeToTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [referralValidation, setReferralValidation] = useState<{ isValid: boolean; message: string }>({ isValid: false, message: "" });
    const navigate = useNavigate();
    const { toast } = useToast();

    const roles = [
        {
            id: "citizen",
            title: "Citizen",
            description: "Join as a community member to contribute to waste management",
            icon: <Users className="h-6 w-6" />,
            features: ["Report waste issues", "Learn waste segregation", "Earn rewards", "Track progress"]
        },
        {
            id: "municipal-employee",
            title: "Municipal Employee",
            description: "Official waste management personnel and administrators",
            icon: <Building2 className="h-6 w-6" />,
            features: ["Manage waste collection", "Monitor operations", "Generate reports", "Admin dashboard"]
        }
    ];

    useEffect(() => {
        const validateReferral = async () => {
            if (formData.referralCode.trim()) {
                try {
                    const validation = await validateReferralCode(formData.referralCode);
                    setReferralValidation({
                        isValid: validation.isValid,
                        message: validation.isValid
                            ? "Valid referral code! You'll both earn 10 coins."
                            : "Invalid referral code."
                    });
                } catch {
                    setReferralValidation({ isValid: false, message: "Could not validate referral code." });
                }
            } else {
                setReferralValidation({ isValid: false, message: "" });
            }
        };
        const timer = setTimeout(validateReferral, 500);
        return () => clearTimeout(timer);
    }, [formData.referralCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
        if (formData.password.length < 8) { setError("Password must be at least 8 characters long"); return; }
        if (!formData.role) { setError("Please select a role"); return; }
        if (!formData.agreeToTerms) { setError("Please agree to the terms and conditions"); return; }
        if (formData.role === "municipal-employee" && !formData.employeeId) {
            setError("Employee ID is required for municipal employees"); return;
        }

        setIsLoading(true);
        try {
            const userData = {
                displayName: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role as 'citizen' | 'municipal-employee',
                ...(formData.role === "municipal-employee" && {
                    employeeId: formData.employeeId,
                    department: formData.department
                })
            };

            const { user, error: authError } = await signUpWithEmail(formData.email, formData.password, userData);
            if (authError) { setError(authError); return; }

            if (user) {
                if (formData.referralCode.trim()) {
                    await processReferralSignup(user.uid, formData.referralCode);
                }
                toast({ title: "Welcome to Swachh Buddy! 🎉", description: "Your account has been created successfully." });
                if (formData.role === "municipal-employee") {
                    navigate('/dashboard/enduser');
                } else {
                    navigate('/dashboard/corporate');
                }
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            const { user, error } = await signInWithGoogle();
            if (error) { setError(error); return; }
            if (user) {
                toast({ title: "Welcome to Swachh Buddy! 🎉", description: "Account created with Google." });
                navigate('/dashboard/corporate');
            }
        } catch {
            setError("Failed to sign up with Google.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        // FIXED: dark mode background + explicit text colors throughout
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="max-w-2xl mx-auto">

                    {/* Header — FIXED: always visible in both themes */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <Recycle className="h-8 w-8 text-white" />
                        </div>
                        {/* FIXED: explicit colors instead of text-foreground */}
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Join Swachh Buddy
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Create your account and start contributing to a cleaner India
                        </p>
                    </div>

                    {/* Signup Card — FIXED: explicit background */}
                    <Card className="shadow-xl border-0 bg-white dark:bg-gray-900">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                                Create Account
                            </CardTitle>
                            <CardDescription className="text-center text-gray-500 dark:text-gray-400">
                                Choose your role and fill in your details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {searchParams.get('ref') && (
                                <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                    <Gift className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800 dark:text-green-300">
                                        🎉 You've been referred! Complete signup and both of you earn 10 coins.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Role Selection */}
                                <div className="space-y-4">
                                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                                        Select Your Role
                                    </Label>
                                    <RadioGroup value={formData.role} onValueChange={(v) => setFormData(prev => ({ ...prev, role: v }))}>
                                        <div className="grid gap-4">
                                            {roles.map((role) => (
                                                <div key={role.id} className="relative">
                                                    <RadioGroupItem value={role.id} id={role.id} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={role.id}
                                                        className="flex flex-col space-y-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="text-primary">{role.icon}</div>
                                                            <div className="flex-1">
                                                                {/* FIXED: explicit font colors */}
                                                                <div className="font-medium text-foreground">{role.title}</div>
                                                                <div className="text-sm text-muted-foreground">{role.description}</div>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                            {role.features.map((feature, i) => (
                                                                <div key={i} className="flex items-center space-x-1">
                                                                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                                    <span>{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300">First Name</Label>
                                        <Input id="firstName" name="firstName" placeholder="John"
                                            value={formData.firstName} onChange={handleInputChange} required className="h-11" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300">Last Name</Label>
                                        <Input id="lastName" name="lastName" placeholder="Doe"
                                            value={formData.lastName} onChange={handleInputChange} required className="h-11" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                                    <Input id="email" name="email" type="email" placeholder="your.email@example.com"
                                        value={formData.email} onChange={handleInputChange} required className="h-11" />
                                </div>

                                {/* Employee Fields */}
                                {formData.role === "municipal-employee" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="employeeId" className="text-gray-700 dark:text-gray-300">Employee ID</Label>
                                            <Input id="employeeId" name="employeeId" placeholder="EMP001"
                                                value={formData.employeeId} onChange={handleInputChange} required className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
                                            <Input id="department" name="department" placeholder="Waste Management"
                                                value={formData.department} onChange={handleInputChange} className="h-11" />
                                        </div>
                                    </>
                                )}

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">Password</Label>
                                    <div className="relative">
                                        <Input id="password" name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={formData.password} onChange={handleInputChange} required className="h-11 pr-10" />
                                        <Button type="button" variant="ghost" size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Minimum 8 characters</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm Password</Label>
                                    <div className="relative">
                                        <Input id="confirmPassword" name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword} onChange={handleInputChange} required className="h-11 pr-10" />
                                        <Button type="button" variant="ghost" size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Referral Code */}
                                <div className="space-y-2">
                                    <Label htmlFor="referralCode" className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Gift className="h-4 w-4 text-primary" /> Referral Code (Optional)
                                    </Label>
                                    <Input id="referralCode" name="referralCode" placeholder="Enter referral code"
                                        value={formData.referralCode} onChange={handleInputChange} className="h-11" />
                                    {referralValidation.message && (
                                        <p className={`text-xs ${referralValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                                            {referralValidation.message}
                                        </p>
                                    )}
                                </div>

                                {/* Terms */}
                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))}
                                        className="mt-0.5"
                                    />
                                    <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                        I agree to the Terms of Service and Privacy Policy
                                    </Label>
                                </div>

                                <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                                    {isLoading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white dark:bg-gray-900 px-2 text-gray-400">Or continue with</span>
                                    </div>
                                </div>

                                <Button type="button" variant="outline"
                                    className="w-full h-11 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                    onClick={handleGoogleSignUp} disabled={isLoading}>
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
                                <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
                                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                    Sign in here
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Signup;
