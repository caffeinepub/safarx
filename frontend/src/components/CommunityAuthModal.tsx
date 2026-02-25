import { useState, useEffect, useRef } from 'react';
import { X, User, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRegisterUser, useLoginUser, type CommunitySession } from '@/hooks/useQueries';

// Decode a JWT token payload (base64url)
function decodeJwtPayload(token: string): Record<string, unknown> {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return {};
    }
}

interface Props {
    open: boolean;
    onClose: () => void;
    onLoginSuccess: (session: CommunitySession) => void;
}

export default function CommunityAuthModal({ open, onClose, onLoginSuccess }: Props) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState('');

    // Login form state
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Register form state
    const [regDisplayName, setRegDisplayName] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirm, setRegConfirm] = useState('');
    const [regError, setRegError] = useState('');

    const googleButtonRef = useRef<HTMLDivElement>(null);

    const registerMutation = useRegisterUser();
    const loginMutation = useLoginUser();

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

    // Initialize Google Identity Services when modal opens
    useEffect(() => {
        if (!open) return;
        if (!GOOGLE_CLIENT_ID) return;

        const initGoogle = () => {
            if (!window.google?.accounts?.id) return;

            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleCredential,
                cancel_on_tap_outside: true,
                ux_mode: 'popup',
            });

            if (googleButtonRef.current) {
                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'pill',
                    width: '100%',
                });
            }
        };

        // GSI script may still be loading
        if (window.google?.accounts?.id) {
            initGoogle();
        } else {
            const interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(interval);
                    initGoogle();
                }
            }, 200);
            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, GOOGLE_CLIENT_ID]);

    const handleGoogleCredential = async (response: { credential: string }) => {
        setGoogleLoading(true);
        setGoogleError('');

        try {
            const payload = decodeJwtPayload(response.credential);
            const email = payload.email as string;
            const name = (payload.name as string) || email.split('@')[0];

            if (!email) {
                setGoogleError('Could not retrieve email from Google. Please try again.');
                setGoogleLoading(false);
                return;
            }

            const gmailLower = email.toLowerCase();

            // Try to login first (account may already exist)
            const loginResult = await loginMutation.mutateAsync({
                username: gmailLower,
                password: 'GOOGLE_AUTH',
            });

            if (loginResult.ok) {
                onLoginSuccess({
                    userId: loginResult.userId,
                    displayName: loginResult.displayName,
                    username: gmailLower,
                    isGoogleUser: true,
                    password: 'GOOGLE_AUTH',
                });
                resetForms();
                return;
            }

            // Account doesn't exist — auto-register
            const regResult = await registerMutation.mutateAsync({
                username: gmailLower,
                password: 'GOOGLE_AUTH',
                displayName: name,
                isGoogleUser: true,
            });

            if (!regResult.ok) {
                setGoogleError(regResult.message || 'Registration failed. Please try again.');
                setGoogleLoading(false);
                return;
            }

            // Login after registration
            const loginAfterReg = await loginMutation.mutateAsync({
                username: gmailLower,
                password: 'GOOGLE_AUTH',
            });

            if (loginAfterReg.ok) {
                onLoginSuccess({
                    userId: loginAfterReg.userId,
                    displayName: loginAfterReg.displayName,
                    username: gmailLower,
                    isGoogleUser: true,
                    password: 'GOOGLE_AUTH',
                });
                resetForms();
            } else {
                setGoogleError('Login after registration failed. Please try again.');
            }
        } catch {
            setGoogleError('Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const resetForms = () => {
        setLoginUsername('');
        setLoginPassword('');
        setLoginError('');
        setRegDisplayName('');
        setRegUsername('');
        setRegPassword('');
        setRegConfirm('');
        setRegError('');
        setGoogleError('');
        setShowPassword(false);
        setShowConfirm(false);
    };

    const handleClose = () => {
        resetForms();
        onClose();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        if (!loginUsername.trim() || !loginPassword) {
            setLoginError('Please fill in all fields.');
            return;
        }
        try {
            const result = await loginMutation.mutateAsync({
                username: loginUsername.trim(),
                password: loginPassword,
            });
            if (result.ok) {
                onLoginSuccess({
                    userId: result.userId,
                    displayName: result.displayName,
                    username: loginUsername.trim().toLowerCase(),
                    isGoogleUser: false,
                    password: loginPassword,
                });
                resetForms();
            } else {
                setLoginError(result.message || 'Invalid username or password.');
            }
        } catch {
            setLoginError('Something went wrong. Please try again.');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError('');
        if (!regDisplayName.trim() || !regUsername.trim() || !regPassword || !regConfirm) {
            setRegError('Please fill in all fields.');
            return;
        }
        if (regPassword !== regConfirm) {
            setRegError('Passwords do not match.');
            return;
        }
        if (regPassword.length < 6) {
            setRegError('Password must be at least 6 characters.');
            return;
        }
        try {
            const result = await registerMutation.mutateAsync({
                username: regUsername.trim(),
                password: regPassword,
                displayName: regDisplayName.trim(),
                isGoogleUser: false,
            });
            if (result.ok) {
                // Auto-login after registration
                const loginResult = await loginMutation.mutateAsync({
                    username: regUsername.trim(),
                    password: regPassword,
                });
                if (loginResult.ok) {
                    onLoginSuccess({
                        userId: loginResult.userId,
                        displayName: loginResult.displayName,
                        username: regUsername.trim().toLowerCase(),
                        isGoogleUser: false,
                        password: regPassword,
                    });
                    resetForms();
                }
            } else {
                setRegError(result.message || 'Registration failed. Please try again.');
            }
        } catch {
            setRegError('Something went wrong. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="sm:max-w-md bg-ivory-50 border-terracotta-200 p-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Community Authentication</DialogTitle>
                    <DialogDescription>Login or register to join the SafarX community</DialogDescription>
                </DialogHeader>

                {/* Header */}
                <div className="bg-terracotta-800 px-6 py-5 relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-ivory-300 hover:text-ivory-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="font-display text-2xl font-bold text-ivory-100">
                        {mode === 'login' ? 'Welcome Back!' : 'Join the Community'}
                    </h2>
                    <p className="font-body text-ivory-300 text-sm mt-1">
                        {mode === 'login'
                            ? 'Sign in to share your travel stories'
                            : 'Create your account and start exploring'}
                    </p>
                </div>

                {/* Mode Toggle */}
                <div className="flex border-b border-terracotta-200 bg-white">
                    <button
                        onClick={() => { setMode('login'); setLoginError(''); setRegError(''); setGoogleError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-body text-sm font-medium transition-colors ${
                            mode === 'login'
                                ? 'text-saffron-600 border-b-2 border-saffron-500 bg-saffron-50'
                                : 'text-terracotta-500 hover:text-terracotta-700'
                        }`}
                    >
                        <LogIn className="w-4 h-4" />
                        Login
                    </button>
                    <button
                        onClick={() => { setMode('register'); setLoginError(''); setRegError(''); setGoogleError(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 font-body text-sm font-medium transition-colors ${
                            mode === 'register'
                                ? 'text-saffron-600 border-b-2 border-saffron-500 bg-saffron-50'
                                : 'text-terracotta-500 hover:text-terracotta-700'
                        }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Register
                    </button>
                </div>

                <div className="px-6 py-5 space-y-5">
                    {/* Google Sign-In Section */}
                    {GOOGLE_CLIENT_ID ? (
                        <div className="space-y-3">
                            <p className="text-center font-body text-xs text-terracotta-500 font-medium uppercase tracking-wide">
                                Quick Sign-In
                            </p>

                            {googleLoading ? (
                                <div className="flex items-center justify-center gap-2 py-3 px-4 border border-terracotta-200 rounded-full bg-white text-terracotta-600 font-body text-sm">
                                    <span className="w-4 h-4 border-2 border-terracotta-300 border-t-saffron-500 rounded-full animate-spin" />
                                    Signing in with Google...
                                </div>
                            ) : (
                                <div
                                    ref={googleButtonRef}
                                    className="flex justify-center [&>div]:w-full [&>div>div]:w-full"
                                />
                            )}

                            {googleError && (
                                <p className="text-sm text-red-600 font-body bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {googleError}
                                </p>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-terracotta-100" />
                                <span className="font-body text-xs text-terracotta-400">or continue with username</span>
                                <div className="flex-1 h-px bg-terracotta-100" />
                            </div>
                        </div>
                    ) : (
                        /* No Google Client ID configured — show a subtle notice */
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs font-body text-amber-700">
                            <strong>Google Sign-In:</strong> Set <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> in your <code className="bg-amber-100 px-1 rounded">.env</code> file to enable Google login.
                        </div>
                    )}

                    {/* Username / Password Forms */}
                    {mode === 'login' ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="login-username" className="font-body text-terracotta-700 text-sm font-medium">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="login-username"
                                        type="text"
                                        placeholder="your_username"
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                        className="pl-9 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="login-password" className="font-body text-terracotta-700 text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="pl-9 pr-10 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 hover:text-terracotta-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            {loginError && (
                                <p className="text-sm text-red-600 font-body bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {loginError}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body rounded-full mt-2"
                            >
                                {loginMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-terracotta-900/30 border-t-terracotta-900 rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-displayname" className="font-body text-terracotta-700 text-sm font-medium">
                                    Display Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="reg-displayname"
                                        type="text"
                                        placeholder="Your full name"
                                        value={regDisplayName}
                                        onChange={(e) => setRegDisplayName(e.target.value)}
                                        className="pl-9 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-username" className="font-body text-terracotta-700 text-sm font-medium">
                                    Username
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-terracotta-400 font-body text-sm">@</span>
                                    <Input
                                        id="reg-username"
                                        type="text"
                                        placeholder="unique_username"
                                        value={regUsername}
                                        onChange={(e) => setRegUsername(e.target.value)}
                                        className="pl-7 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                        autoComplete="username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-password" className="font-body text-terracotta-700 text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="reg-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        className="pl-9 pr-10 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 hover:text-terracotta-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="reg-confirm" className="font-body text-terracotta-700 text-sm font-medium">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta-400" />
                                    <Input
                                        id="reg-confirm"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        value={regConfirm}
                                        onChange={(e) => setRegConfirm(e.target.value)}
                                        className="pl-9 pr-10 border-terracotta-200 focus:border-saffron-400 focus:ring-saffron-400 font-body"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-terracotta-400 hover:text-terracotta-600"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            {regError && (
                                <p className="text-sm text-red-600 font-body bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                    {regError}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={registerMutation.isPending || loginMutation.isPending}
                                className="w-full bg-saffron-500 hover:bg-saffron-400 text-terracotta-900 font-semibold font-body rounded-full mt-2"
                            >
                                {(registerMutation.isPending || loginMutation.isPending) ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-terracotta-900/30 border-t-terracotta-900 rounded-full animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
