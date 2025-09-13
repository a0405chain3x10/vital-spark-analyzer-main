import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/types/auth';
import { Stethoscope, UserPlus, LogIn, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Registration form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'nurse',
    department: '',
    licenseNumber: '',
    specialization: '',
    shift: 'day'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        onSuccess?.();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const success = await register(registerData);
      if (success) {
        setSuccess('Registration successful! You can now log in with your credentials.');
        setRegisterData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'nurse',
          department: '',
          licenseNumber: '',
          specialization: '',
          shift: 'day'
        });
      } else {
        setError('Registration failed. Email may already be in use.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, 'password'); // Mock password for demo
      if (success) {
        onSuccess?.();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vital Spark Analyzer</h1>
          <p className="text-gray-600">Neonatal Care Management System</p>
        </div>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access the neonatal monitoring dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                {/* Demo Quick Login */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin('dr.smith@hospital.com')}
                      disabled={isLoading}
                      className="text-xs"
                    >
                      Login as Dr. Smith (Doctor)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickLogin('nurse.johnson@hospital.com')}
                      disabled={isLoading}
                      className="text-xs"
                    >
                      Login as Nurse Johnson
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>
                  Register as a medical professional to access the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="john.doe@hospital.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      placeholder="Create a secure password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={registerData.role}
                      onValueChange={(value: 'doctor' | 'nurse') => 
                        setRegisterData(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="NICU, Pediatrics, etc."
                      value={registerData.department}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="MD123456 or RN789012"
                      value={registerData.licenseNumber}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      required
                    />
                  </div>

                  {registerData.role === 'doctor' && (
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="Neonatology, Pediatric Cardiology, etc."
                        value={registerData.specialization}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, specialization: e.target.value }))}
                      />
                    </div>
                  )}

                  {registerData.role === 'nurse' && (
                    <div className="space-y-2">
                      <Label htmlFor="shift">Shift</Label>
                      <Select
                        value={registerData.shift}
                        onValueChange={(value: 'day' | 'night' | 'rotating') => 
                          setRegisterData(prev => ({ ...prev, shift: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day Shift</SelectItem>
                          <SelectItem value="night">Night Shift</SelectItem>
                          <SelectItem value="rotating">Rotating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
