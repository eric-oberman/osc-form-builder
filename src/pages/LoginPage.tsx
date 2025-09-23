import { useState } from 'react';
import { Building2, Lock, User as UserIcon, Shield, CheckCircle } from 'lucide-react';
import { useFormBuilderStore } from '../stores/useFormBuilderStore';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@osc.ny.gov');
  const [password, setPassword] = useState('demo123');
  const { login } = useFormBuilderStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo login - in real app would authenticate with backend
    const demoUser = {
      id: '1',
      name: 'Demo Administrator',
      email: email,
      role: 'admin' as const,
      status: 'active' as const,
      lastActive: new Date(),
    };

    login(demoUser);
  };

  const features = [
    { icon: Shield, title: 'Enterprise Security', description: 'HIPAA compliant with advanced encryption' },
    { icon: Building2, title: 'Government Ready', description: 'Designed for NY State requirements' },
    { icon: CheckCircle, title: 'Fully Featured', description: 'Complete form building and analytics suite' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Side - Branding and Features */}
          <div className="flex flex-col justify-center py-12 lg:px-8">
            <div className="max-w-md mx-auto lg:max-w-lg">
              {/* Logo and Header */}
              <div className="text-center lg:text-left mb-12">
                <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-osc-navy to-blue-600 rounded-2xl flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-900">OSC Form Builder</h1>
                    <p className="text-sm text-gray-600">Electronic Fillable Form Creation & Hosting</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="heading-1">Welcome to the Future of Forms</h2>
                  <p className="text-subtitle">
                    Streamline your workflow with our enterprise-grade form building platform designed
                    specifically for New York State government agencies.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-body">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Demo Badge */}
              <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">Demo Environment</span>
                </div>
                <p className="text-sm text-blue-700">
                  Experience the full capabilities of our form builder platform in this
                  interactive demonstration environment.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center py-12 lg:px-8 bg-white lg:bg-transparent">
            <div className="max-w-md mx-auto w-full">
              <div className="card">
                <div className="card-body">
                  <div className="text-center mb-8">
                    <h2 className="heading-2">Sign In</h2>
                    <p className="text-subtitle">Access your OSC Form Builder account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-input pl-10 w-full"
                          placeholder="admin@osc.ny.gov"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="form-input pl-10 w-full"
                          placeholder="demo123"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full"
                    >
                      Sign In to Demo
                    </button>
                  </form>

                  {/* Demo Credentials Info */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Credentials</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-mono text-gray-900">admin@osc.ny.gov</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Password:</span>
                        <span className="font-mono text-gray-900">demo123</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      This demonstration showcases the complete OSC Form Builder experience
                      with sample data and full functionality.
                    </p>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secured by enterprise-grade encryption</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 text-sm text-gray-500">
                <p>&copy; 2024 New York State Office of the State Comptroller</p>
                <p className="mt-1">Electronic Form Builder Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;