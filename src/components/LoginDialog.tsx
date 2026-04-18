import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/lib/api";
import { Loader2, Phone } from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LoginFormData {
  email: string;
  password: string;
  name?: string;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "otp">("email");
  const [otpStep, setOtpStep] = useState<"phone" | "verify">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      let result;
      
      if (isRegisterMode) {
        if (!data.name) {
          throw new Error("Name is required");
        }
        result = await apiService.register(data.email, data.password, data.name);
      } else {
        result = await apiService.login(data.email, data.password);
      }

      if (result.user && result.token) {
        login(result.user, result.token);
        toast({
          title: "✅ Success",
          description: isRegisterMode
            ? "Account created successfully!"
            : "Logged in successfully!",
        });
        reset();
        onOpenChange(false);
      }
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : "An error occurred";
      let errorTitle = "❌ Error";

      // Handle specific error cases
      if (isRegisterMode && errorMessage.toLowerCase().includes("already registered")) {
        errorTitle = "Email Already Registered";
        errorMessage = `The email "${data.email}" is already associated with an account. Please log in or use a different email.`;
      } else if (!isRegisterMode && errorMessage.toLowerCase().includes("invalid")) {
        errorTitle = "Login Failed";
        errorMessage = "Invalid email or password. Please try again.";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Get ID token
      const idToken = await result.user.getIdToken();
      const displayName = result.user.displayName || "Google User";
      const email = result.user.email?.toLowerCase();

      if (!email) {
        throw new Error("Email not found in Google account");
      }

      // Create or login user on backend
      try {
        // First try to login with email
        const loginResult = await apiService.login(email, idToken);
        login(loginResult.user, loginResult.token);
      } catch (err) {
        // If login fails, register new user
        try {
          const registerResult = await apiService.register(email, idToken, displayName);
          login(registerResult.user, registerResult.token);
        } catch (regErr: any) {
          // Check if email already exists
          if (regErr.message.includes("already registered")) {
            throw new Error(`This email is already registered. Please log in instead.`);
          }
          throw new Error("Could not create account with Google");
        }
      }

      toast({
        title: "✅ Success",
        description: `Logged in successfully as ${displayName}!`,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Google Sign-In failed";
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      console.error("Google Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
      setIsRegisterMode(false);
      setLoginMethod("email");
      setOtpStep("phone");
      setPhoneNumber("");
      setOtp("");
    }
    onOpenChange(newOpen);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ OTP Sent",
        description: `OTP sent to +91${phoneNumber.slice(-10)}. Demo: Use 123456`,
      });
      setOtpStep("verify");
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification (demo accepts 123456 or any 6-digit code)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (otp === "123456" || /^\d{6}$/.test(otp)) {
        // Create demo user based on phone
        const demoUser = {
          id: `user_${phoneNumber}`,
          email: `user${phoneNumber}@example.com`,
          name: `User ${phoneNumber.slice(-4)}`,
        };

        const demoToken = `token_${Date.now()}`;
        login(demoUser, demoToken);

        toast({
          title: "✅ Success",
          description: "Logged in successfully with OTP!",
        });

        reset();
        setPhoneNumber("");
        setOtp("");
        setOtpStep("phone");
        setLoginMethod("email");
        onOpenChange(false);
      } else {
        throw new Error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "OTP verification failed";
      toast({
        title: "❌ Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isRegisterMode ? "Create Account" : "Sign In"}
          </DialogTitle>
          <DialogDescription>
            {isRegisterMode
              ? "Create a new account to start booking movies"
              : "Enter your credentials to access your account"}
          </DialogDescription>
        </DialogHeader>

        {!isRegisterMode && (
          <div className="flex gap-2 mb-4">
            <Button
              variant={loginMethod === "email" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setLoginMethod("email")}
              disabled={isLoading}
            >
              Email
            </Button>
            <Button
              variant={loginMethod === "otp" ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setLoginMethod("otp")}
              disabled={isLoading}
            >
              <Phone className="h-4 w-4" />
              OTP
            </Button>
          </div>
        )}

        {loginMethod === "email" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegisterMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name", {
                    required: isRegisterMode ? "Name is required" : false,
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : isRegisterMode ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        ) : (
          <div className="space-y-4">
            {otpStep === "phone" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-md text-sm">+91</span>
                    <Input
                      id="phone"
                      placeholder="10-digit number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          setPhoneNumber(value);
                        }
                      }}
                      disabled={isLoading}
                      maxLength={10}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value.length <= 6) {
                        setOtp(value);
                      }
                    }}
                    disabled={isLoading}
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Demo: Use 123456
                  </p>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length < 6}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setOtpStep("phone");
                    setPhoneNumber("");
                    setOtp("");
                  }}
                  disabled={isLoading}
                  className="w-full"
                >
                  Change Number
                </Button>
              </>
            )}
          </div>
        )}

        {loginMethod === "email" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  reset();
                }}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                {isRegisterMode
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
