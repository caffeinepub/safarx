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
import useSEO from '@/hooks/useSEO';

type Mode = 'login' | 'register';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { actor } = useActor();
    const { login: iiLogin, identity, loginStatus } = useInternetIdentity();
    const loginAdmin = useLoginAdmin();
    const registerAdmin = useRegisterAdmin();

    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useSEO({
        title: 'Admin Login',
        description:
            'Secure administrative login for SafarX platform management. Access the admin dashboard to manage travel inquiries, community content, and platform settings.',
    });

    // Redirect if already logged in
    useEffect(() => {
        const token = getAdminSessionToken();
        if (token) {
            navigate({ to: '/admin' });
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            await loginAdmin.mutateAsync({ username, password });
            setSuccess('Login successful! Redirecting…');
            setTimeout(() => navigate({ to: '/admin' }), 800);
        } catch (err: any) {
            setError(err?.message || 'Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!identity) {
            setError('Please connect with Internet Identity first to register as admin.');
            return;
        }

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            await registerAdmin.mutateAsync({ username, password });
            setSuccess('Admin registered successfully! Redirecting…');
            setTimeout(() => navigate({ to: '/admin' }), 800);
        } catch (err: any) {
            setError(err?.message || 'Registration failed. Please try again.');
        }
    };

    const isLoggingIn = loginStatus === 'logging-in';

    return (
        <div className="min-h-screen bg-gradient-to-br from-terracotta-900 via-terracotta-800 to-terracotta-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron-500/20 border border-saffron-400/30 mb-4">
                        <ShieldCheck className="w-8 h-8 text-saffron-400" />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-ivory-100">SafarX Admin</h1>
                    <p className="font-body text-sm text-ivory-400 mt-1">Secure access portal</p>
                </div>

                <Card className="bg-terracotta-800/60 border-terracotta-700/50 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="pb-4">
                        {/* Mode Toggle */}
                        <div className="flex rounded-xl overflow-hidden border border-terracotta-700/50 mb-2">
                            <button
                                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                className={`flex-1 py-2.5 font-body text-sm font-medium transition-colors ${
                                    mode === 'login'
                                        ? 'bg-saffron-500 text-terracotta-900'
                                        : 'text-ivory-300 hover:text-ivory-100'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                                className={`flex-1 py-2.5 font-body text-sm font-medium transition-colors ${
                                    mode === 'register'
                                        ? 'bg-saffron-500 text-terracotta-900'
                                        : 'text-ivory-300 hover:text-ivory-100'
                                }`}
                            >
                                Register
                            </button>
                        </div>
                        <CardTitle className="font-display text-ivory-100 text-lg">
                            {mode === 'login' ? 'Welcome Back' : 'Register Admin'}
                        </CardTitle>
                        <CardDescription className="font-body text-ivory-400 text-sm">
                            {mode === 'login'
                                ? 'Enter your admin credentials to access the dashboard.'
                                : 'Connect with Internet Identity, then set your admin credentials.'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Register: Internet Identity step */}
                        {mode === 'register' && (
                            <div className="mb-5 p-4 rounded-xl bg-terracotta-700/40 border border-terracotta-600/40">
                                <div className="flex items-center gap-3 mb-3">
                                    <KeyRound className="w-4 h-4 text-saffron-400 flex-shrink-0" />
                                    <p className="font-body text-xs text-ivory-300">
                                        Internet Identity is required to register as admin (one-time setup).
                                    </p>
                                </div>
                                {identity ? (
                                    <div className="flex items-center gap-2 text-teal-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="font-body text-xs font-medium">Connected</span>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={iiLogin}
                                        disabled={isLoggingIn}
                                        className="bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-semibold text-xs rounded-lg border-0 gap-1.5"
                                    >
                                        {isLoggingIn ? (
                                            <><Loader2 className="w-3 h-3 animate-spin" /> Connecting…</>
                                        ) : (
                                            <><ShieldAlert className="w-3 h-3" /> Connect Internet Identity</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        )}

                        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="username" className="font-body text-xs font-medium text-ivory-300 uppercase tracking-wider">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-500" />
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="admin"
                                        className="pl-9 bg-terracotta-700/40 border-terracotta-600/50 text-ivory-100 placeholder:text-ivory-500 font-body text-sm focus:border-saffron-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="font-body text-xs font-medium text-ivory-300 uppercase tracking-wider">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-9 pr-10 bg-terracotta-700/40 border-terracotta-600/50 text-ivory-100 placeholder:text-ivory-500 font-body text-sm focus:border-saffron-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory-500 hover:text-ivory-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/30 border border-red-700/40">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="font-body text-xs text-red-300">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-900/30 border border-teal-700/40">
                                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                                    <p className="font-body text-xs text-teal-300">{success}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={
                                    loginAdmin.isPending ||
                                    registerAdmin.isPending ||
                                    (mode === 'register' && !identity)
                                }
                                className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-body font-bold rounded-xl border-0 h-11 gap-2"
                            >
                                {(loginAdmin.isPending || registerAdmin.isPending) ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                                ) : mode === 'login' ? (
                                    <><ShieldCheck className="w-4 h-4" /> Login to Dashboard</>
                                ) : (
                                    <><ShieldCheck className="w-4 h-4" /> Register as Admin</>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
