import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // Loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Handle login input change
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle register input change
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      setIsLoggingIn(true);
      const response = await auth.login(loginData.email, loginData.password);
      toast.success("Logged in successfully!");
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Handle register submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (registerData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setIsRegistering(true);
      await auth.register(registerData.name, registerData.email, registerData.password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Welcome to TranspaCharity</CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <Input
                      name="password"
                      type="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      name="name"
                      type="text"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <Input
                      name="password"
                      type="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600"
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
