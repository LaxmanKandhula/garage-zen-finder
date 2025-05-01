
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Mail, Phone, Lock, AtSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/authStore';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    setTimeout(() => {
      if (loginMethod === 'email') {
        login({ email, name: email.split('@')[0] });
      } else {
        login({ phone, name: `User-${phone.slice(-4)}` });
      }
      
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: "Welcome back to GarageZen!",
      });
      
      navigate('/');
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);

    // Simulating Google OAuth
    setTimeout(() => {
      login({ 
        email: 'user@gmail.com', 
        name: 'Google User', 
        photoUrl: 'https://source.unsplash.com/random/200x200/?person' 
      });
      
      setIsLoading(false);
      toast({
        title: "Google Login",
        description: "Successfully logged in with Google!",
      });
      
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-teal-600">
          <ArrowLeft className="mr-2" size={18} />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-teal-700">GarageZen</h1>
            <p className="text-gray-600 mt-1">Login to find parking for cars and bikes near you</p>
          </div>

          <Button 
            variant="outline" 
            className="w-full mb-4 py-6 flex items-center justify-center gap-2 border-gray-300"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger 
                value="email" 
                onClick={() => setLoginMethod('email')}
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <Mail size={16} className="mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="phone" 
                onClick={() => setLoginMethod('phone')}
                className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700"
              >
                <Phone size={16} className="mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      type="email" 
                      className="pl-10" 
                      placeholder="you@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-email">Password</Label>
                    <a href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password-email" 
                      type="password" 
                      className="pl-10" 
                      placeholder="••••••••" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      type="tel" 
                      className="pl-10" 
                      placeholder="+1 (555) 123-4567" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-phone">Password</Label>
                    <a href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="password-phone" 
                      type="password" 
                      className="pl-10" 
                      placeholder="••••••••" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Tabs>
          
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-teal-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
