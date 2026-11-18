'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this local login simulation with your real authentication endpoint: POST /api/auth/login

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '@/service/api';
import useCart from '@/hooks/useCart';

export default function LoginPage() {
  const router = useRouter();
  const { user,setUser,setIsAuthenticated } = useAuth();
  const { notify } = useNotification();
  const { getAllCartItems } = useCart();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
});

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.emailOrUsername = 'Please enter your email or username';
    }
    if (!formData.password) {
      errs.password = 'Please enter your password';
    } else if (formData.password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/user/login",{
        email:formData.email,
        password:formData.password
      })
      console.log(res.data);
      localStorage.setItem("access",res.data.accessToken);
      localStorage.setItem("refresh",res.data.refreshToken);
      setUser(res.data.user);
      setIsAuthenticated(true);
      getAllCartItems();
      notify.success(`welcome back,${res.data.user.username}`);

      
      // router.push('/account');
    } catch (err) {
      setAuthError(err.response?.data?.message ||err.response?.data ||err.message ||
      'Invalid credentials'
    );
    } finally {
      setIsLoading(false);
    }
  };

  // const handleFillDemo = () => {
  //   setFormData({
  //     emailOrUsername: 'julian.sterling@example.com',
  //     password: 'password123',
  //   });
  //   setErrors({});
  // };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-soft-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif text-2xl tracking-[0.2em] font-extrabold text-stone-950 uppercase">
              ATELIER &amp; CO.
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900">Welcome Back</h2>
          <p className="text-xs text-stone-500 mt-1 font-light">
            Sign in to access your personal curation and order history.
          </p>
        </div>

        {/* Demo Credentials Helper Card */}
        {/* <div className="mb-6 p-3.5 rounded-2xl bg-[#FAF8F5] border border-brand-200/60 flex items-center justify-between text-xs text-stone-700">
          <div>
            <p className="font-semibold text-brand-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Demo Credentials Ready
            </p>
            <p className="text-[11px] text-stone-500">julian.sterling@example.com / password123</p>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-bold text-brand-700 hover:underline"
          >
            Auto-fill
          </button>
        </div> */}

        {authError && <Alert type="error" className="mb-6">{authError}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
              label="Email"
              type="email"
              icon={User}
              value={formData.email}
              onChange={(e) => {setFormData({
                  ...formData,
                  email: e.target.value,
                });

                setErrors({
                  ...errors,
                  email: '',
                });
              }}
              error={errors.email}
              placeholder="Enter your email"
              required
            />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              placeholder="••••••••"
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-400 hover:text-stone-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
            />
            <div className="flex justify-end mt-1.5">
              <span className="text-[11px] text-stone-400 hover:text-stone-700 cursor-pointer">
                Forgot password?
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full shadow-md"
            >
              <span>Sign In to Account</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Do not have an account yet?{' '}
            <Link href="/register" className="font-semibold text-brand-700 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
