import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Mail, Lock, User as UserIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<'student' | 'teacher'>("student");
  
  const { login, signup, user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setLocation(user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard');
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = login(email);
        if (!result) {
          toast({ title: "Login Failed", description: "Account not found. Please sign up.", variant: "destructive" });
        } else {
          toast({ title: "Success", description: "Logged in successfully." });
        }
      } else {
        if (!name || !email || !password) {
          toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
          return;
        }
        signup(name, email, role);
        toast({ title: "Account Created", description: "Welcome to Clarity Loop!" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Seed mock accounts if none exist for easy testing
  const seedDemoAccounts = () => {
    try {
      signup("Demo Student", "student@demo.com", "student");
      toast({ title: "Demo Student Created", description: "Logging you in..." });
    } catch {
      login("student@demo.com");
    }
  };

  const seedTeacherAccount = () => {
    try {
      signup("Demo Teacher", "teacher@demo.com", "teacher");
      toast({ title: "Demo Teacher Created", description: "Logging you in..." });
    } catch {
      login("teacher@demo.com");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden p-4">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-multiply -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] mix-blend-multiply -z-10" />

      <div className="w-full max-w-md bg-card p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-border/50 relative">
        <div className="absolute top-8 right-8">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 font-display">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className="text-muted-foreground mb-8 text-sm">
          {isLogin ? "Enter your details to access your dashboard." : "Start your learning journey today."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" className="pl-9 h-12 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@example.com" className="pl-9 h-12 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="••••••••" className="pl-9 h-12 rounded-xl bg-muted/30 border-transparent focus-visible:border-primary" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-3 pt-2">
              <Label>I am a...</Label>
              <RadioGroup value={role} onValueChange={(v: 'student'|'teacher') => setRole(v)} className="flex gap-4">
                <div className="flex items-center space-x-2 border rounded-xl p-3 flex-1 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                  <RadioGroupItem value="student" id="r1" />
                  <Label htmlFor="r1" className="cursor-pointer font-medium">Student</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-xl p-3 flex-1 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                  <RadioGroupItem value="teacher" id="r2" />
                  <Label htmlFor="r2" className="cursor-pointer font-medium">Teacher</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button type="submit" className="w-full h-12 rounded-xl text-md font-bold mt-4 shadow-lg shadow-primary/20">
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-primary font-bold hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {/* Demo Helpers */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-bold">Quick Demo Access</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={seedDemoAccounts} className="rounded-full text-xs">Student Login</Button>
            <Button variant="outline" size="sm" onClick={seedTeacherAccount} className="rounded-full text-xs">Teacher Login</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
