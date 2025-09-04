import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('signin');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to authenticate
      console.log('Login attempt:', formData);
      
      // For demo purposes, we'll create a mock token
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Call the onLogin callback with the token
      if (onLogin) {
        onLogin(mockToken);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Modal Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-8 text-center">
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
            >
              <X size={16} />
            </button>
            
            {/* Logo - Square with Gradient */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
            
            {/* Title and Subtitle */}
            <h1 className="text-white text-2xl font-bold mb-2">Eden AI</h1>
            <p className="text-white text-sm opacity-90">Your intelligent AI assistant</p>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'signin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'signup'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Google Continue Button */}
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-6">
              <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">G</div>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className={`w-full px-4 py-3.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`w-full px-4 py-3.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${
                      errors.password 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-3.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 space-y-3 text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-green-500 hover:text-green-600 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-gray-600">
                <Link
                  to="/forgot-password"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 