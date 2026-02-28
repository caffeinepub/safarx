import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Lock, User, ShieldCheck, Loader2, AlertCircle, CheckCircle2, ShieldAlert, KeyRound } from 'lucide-react';
import { useRegisterAdmin, useLoginAdmin, getAdminSessionToken } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type Mode = 'login' | 'register';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { actor, isFetching: actorFetching } = useActor();
    const { identity, loginStatus, login, clear } = useInternetIdentity();
    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';
    const isInitializing = loginStatus === 'initializing';

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

    // If already has a valid admin session token, redirect to admin dashboard
    useEffect(() => {
        const token = getAdminSessionToken();
        if (token) {
            navigate({ to: '/admin' });
        }
    }, [navigate]);

    const handleIILogin = async () => {
        setErrorMsg('');
        try {
            await login();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg === 'User is already authenticated') {
                await clear();
                setTimeout(() => login(), 300);
            } else {
                setErrorMsg('Failed to connect Internet Identity. Please try again.');
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!username.trim() || !password.trim()) {
            setErrorMsg('Please enter both username and password.');
            return;
        }

        if (!actor) {
            setErrorMsg('Backend not ready. Please wait a moment and try again.');
            return;
        }

        try {
            const result = await loginMutation.mutateAsync({ username, password });
            if (result.ok && result.token) {
                navigate({ to: '/admin' });
            } else {
                setErrorMsg(result.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMsg(msg || 'Login failed. Please try again.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!isAuthenticated) {
            setErrorMsg('Please connect your Internet Identity first to register as admin.');
            return;
        }

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

        if (!actor) {
            setErrorMsg('Backend not ready. Please wait a moment and try again.');
            return;
        }

        try {
            const result = await registerMutation.mutateAsync({ username, password });
            if (result.ok) {
                // If a session token was stored during registration, go straight to dashboard
                const token = getAdminSessionToken();
                if (token) {
                    navigate({ to: '/admin' });
                } else {
                    setSuccessMsg('Registration successful! You can now log in.');
                    setMode('login');
                    setUsername('');
                    setPassword('');
                    setConfirmPassword('');
                }
            } else {
                setErrorMsg(result.message || 'Registration failed.');
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setErrorMsg(msg || 'Registration failed. Please try again.');
        }
    };

    const isLoginPending = loginMutation.isPending;
    const isRegisterPending = registerMutation.isPending;
    const principalShort = identity ? identity.getPrincipal().toString().slice(0, 16) + '…' : '';
    const isActorReady = !!actor && !actorFetching;

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

                {/* Actor loading state */}
                {(actorFetching || isInitializing) && (
                    <div className="flex items-center justify-center gap-2 text-sm text-terracotta-500 mb-4 bg-white/80 rounded-lg px-4 py-3 border border-terracotta-100">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Initializing backend connection…
                    </div>
                )}

                {/* Step 1: Internet Identity (only required for registration) */}
                {mode === 'register' && (
                    <Card className="border-terracotta-200 shadow-xl bg-white/90 backdrop-blur-sm mb-4">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isAuthenticated ? 'bg-teal-500' : 'bg-terracotta-400'}`}>
                                    {isAuthenticated ? '✓' : '1'}
                                </div>
                                <CardTitle className="font-display text-lg text-terracotta-900">
                                    Connect Internet Identity
                                </CardTitle>
                            </div>
                            <CardDescription className="font-body text-terracotta-500 text-sm ml-8">
                                Required to register your admin principal on the blockchain.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isInitializing ? (
                                <div className="flex items-center gap-2 text-sm text-terracotta-500 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Checking authentication status…
                                </div>
                            ) : isAuthenticated ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                                        <span className="font-body text-sm text-teal-700 font-medium">
                                            Connected: <span className="font-mono text-xs">{principalShort}</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={async () => { await clear(); }}
                                        className="text-xs text-terracotta-400 hover:text-terracotta-600 underline underline-offset-2 transition-colors"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                        <p className="font-body text-xs text-amber-700">
                                            <strong>Important:</strong> Always use the <strong>same Internet Identity</strong> for admin registration.
                                            The first identity to register becomes the permanent admin principal.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleIILogin}
                                        disabled={isLoggingIn || actorFetching}
                                        className="w-full bg-terracotta-800 hover:bg-terracotta-900 text-ivory-100 font-body font-semibold"
                                    >
                                        {isLoggingIn ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Connecting…
                                            </>
                                        ) : (
                                            <>
                                                <KeyRound className="w-4 h-4 mr-2" />
                                                Connect with Internet Identity
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Login / Register Form */}
                <Card className={`border-terracotta-200 shadow-xl bg-white/90 backdrop-blur-sm transition-opacity ${mode === 'register' && !isAuthenticated ? 'opacity-50 pointer-events-none' : ''}`}>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-terracotta-700">
                                {mode === 'register' ? '2' : '1'}
                            </div>
                            <CardTitle className="font-display text-lg text-terracotta-900">
                                {mode === 'login' ? 'Sign In' : 'Create Admin Account'}
                            </CardTitle>
                        </div>
                        <CardDescription className="font-body text-terracotta-500 text-sm ml-8">
                            {mode === 'login'
                                ? 'Enter your admin credentials to access the dashboard.'
                                : 'Set up your admin username and password.'}
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
                                        disabled={isLoginPending || isRegisterPending || !isActorReady}
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
                                        disabled={isLoginPending || isRegisterPending || !isActorReady}
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
                                            disabled={isRegisterPending || !isActorReady}
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
                                disabled={isLoginPending || isRegisterPending || !isActorReady}
                                className="w-full bg-terracotta-800 hover:bg-terracotta-900 text-ivory-100 font-body font-semibold mt-2"
                            >
                                {(isLoginPending || isRegisterPending) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {mode === 'login' ? 'Signing in…' : 'Registering…'}
                                    </>
                                ) : (
                                    mode === 'login' ? 'Sign In' : 'Create Admin Account'
                                )}
                            </Button>
                        </form>

                        {/* Mode toggle */}
                        <div className="mt-5 text-center">
                            <p className="font-body text-sm text-terracotta-500">
                                {mode === 'login' ? (
                                    <>
                                        No admin account yet?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                                            className="text-terracotta-700 font-semibold hover:underline transition-colors"
                                        >
                                            Register
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                                            className="text-terracotta-700 font-semibold hover:underline transition-colors"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
