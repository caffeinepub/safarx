import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Lock, User, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useIsAdminRegistered, useRegisterAdmin, useLoginAdmin } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Mode = 'login' | 'register';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { data: isRegistered, isLoading: checkingRegistration } = useIsAdminRegistered();

    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loginMutation = useLoginAdmin();
    const registerMutation = useRegisterAdmin();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!username.trim() || !password.trim()) {
            setErrorMsg('Please enter both username and password.');
            return;
        }

        try {
            const result = await loginMutation.mutateAsync({ username, password });
            if (result.ok) {
                localStorage.setItem('adminSession', 'true');
                navigate({ to: '/admin' });
            } else {
                setErrorMsg(result.token || 'Invalid credentials. Please try again.');
            }
        } catch {
            setErrorMsg('Login failed. Please try again.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!username.trim() || !password.trim()) {
            setErrorMsg('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters.');
            return;
        }

        try {
            const result = await registerMutation.mutateAsync({ username, password });
            if (result.ok) {
                setSuccessMsg('Registration successful! You can now log in.');
                setMode('login');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setErrorMsg(result.message || 'Registration failed.');
            }
        } catch {
            setErrorMsg('Registration failed. Please try again.');
        }
    };

    const isLoginPending = loginMutation.isPending;
    const isRegisterPending = registerMutation.isPending;

    return (
        <main className="min-h-screen bg-ivory-100 flex items-center justify-center px-4 py-16">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-saffron-200/30 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-terracotta-800 shadow-lg mb-4">
                        <ShieldCheck className="w-8 h-8 text-saffron-400" />
                    </div>
                    <h1 className="font-display font-black text-3xl text-terracotta-900">SafarX.in</h1>
                    <p className="font-body text-sm text-terracotta-500 mt-1">Admin Portal</p>
                </div>

                <Card className="border-terracotta-200 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="font-display text-xl text-terracotta-900">
                            {mode === 'login' ? 'Welcome Back' : 'Create Admin Account'}
                        </CardTitle>
                        <CardDescription className="font-body text-terracotta-500">
                            {mode === 'login'
                                ? 'Sign in to access the admin dashboard.'
                                : 'Set up your admin credentials to get started.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Success message */}
                        {successMsg && (
                            <div className="flex items-start gap-2 bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <p className="font-body text-sm text-teal-700">{successMsg}</p>
                            </div>
                        )}

                        {/* Error message */}
                        {errorMsg && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                <p className="font-body text-sm text-red-600">{errorMsg}</p>
                            </div>
                        )}

                        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                            {/* Username */}
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="font-body text-sm text-terracotta-800 font-medium">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-9 border-terracotta-200 focus:border-saffron-500 focus:ring-saffron-500 font-body"
                                        autoComplete="username"
                                        disabled={isLoginPending || isRegisterPending}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="font-body text-sm text-terracotta-800 font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9 pr-10 border-terracotta-200 focus:border-saffron-500 focus:ring-saffron-500 font-body"
                                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        disabled={isLoginPending || isRegisterPending}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 hover:text-terracotta-600 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (register only) */}
                            {mode === 'register' && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="font-body text-sm text-terracotta-800 font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-9 pr-10 border-terracotta-200 focus:border-saffron-500 focus:ring-saffron-500 font-body"
                                            autoComplete="new-password"
                                            disabled={isRegisterPending}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 hover:text-terracotta-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submit button */}
                            <Button
                                type="submit"
                                disabled={isLoginPending || isRegisterPending || checkingRegistration}
                                className="w-full bg-terracotta-800 hover:bg-terracotta-900 text-ivory-100 font-body font-semibold mt-2"
                            >
                                {(isLoginPending || isRegisterPending) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {mode === 'login' ? 'Signing in…' : 'Registering…'}
                                    </>
                                ) : (
                                    mode === 'login' ? 'Sign In' : 'Create Account'
                                )}
                            </Button>
                        </form>

                        {/* Toggle between login and register */}
                        {!checkingRegistration && (
                            <div className="mt-5 pt-4 border-t border-terracotta-100 text-center">
                                {mode === 'login' && !isRegistered && (
                                    <p className="font-body text-sm text-terracotta-600">
                                        No admin account yet?{' '}
                                        <button
                                            onClick={() => {
                                                setMode('register');
                                                setErrorMsg('');
                                                setSuccessMsg('');
                                            }}
                                            className="text-saffron-600 hover:text-saffron-700 font-semibold underline underline-offset-2 transition-colors"
                                        >
                                            Register here
                                        </button>
                                    </p>
                                )}
                                {mode === 'register' && (
                                    <p className="font-body text-sm text-terracotta-600">
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => {
                                                setMode('login');
                                                setErrorMsg('');
                                                setSuccessMsg('');
                                            }}
                                            className="text-saffron-600 hover:text-saffron-700 font-semibold underline underline-offset-2 transition-colors"
                                        >
                                            Sign in
                                        </button>
                                    </p>
                                )}
                                {mode === 'login' && isRegistered && (
                                    <p className="font-body text-xs text-terracotta-400">
                                        Admin account is already set up.
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <p className="text-center font-body text-xs text-terracotta-400 mt-6">
                    SafarX.in Admin Portal · Secure Access
                </p>
            </div>
        </main>
    );
}
