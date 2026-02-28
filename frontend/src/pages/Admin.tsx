import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
    LogOut, Trash2, Mail, Phone, MapPin, MessageSquare, Users, BarChart3,
    RefreshCw, Loader2, AlertCircle, ChevronDown, ChevronUp, Search, Shield
} from 'lucide-react';
import {
    useGetAllInquiries,
    useDeleteInquiry,
    useCommunityStats,
    useCommunityUserList,
    getAdminSessionToken,
    clearAdminSessionToken,
} from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';

type SortField = 'destination' | 'name' | 'timestamp';
type SortDir = 'asc' | 'desc';

export default function Admin() {
    const navigate = useNavigate();
    const token = getAdminSessionToken();

    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('timestamp');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [activeTab, setActiveTab] = useState<'inquiries' | 'community'>('inquiries');

    useSEO({
        title: 'Admin Dashboard',
        description:
            'SafarX admin dashboard for managing travel inquiries, community posts, platform users, and content moderation. Restricted access for authorized administrators only.',
    });

    // Redirect if no session token
    useEffect(() => {
        if (!token) {
            navigate({ to: '/admin/login' });
        }
    }, [token, navigate]);

    const {
        data: inquiries = [],
        isLoading: inquiriesLoading,
        error: inquiriesError,
        refetch: refetchInquiries,
    } = useGetAllInquiries();

    const {
        data: communityStats,
        isLoading: statsLoading,
    } = useCommunityStats();

    const {
        data: communityUsers = [],
        isLoading: usersLoading,
    } = useCommunityUserList();

    const deleteInquiry = useDeleteInquiry();

    const handleLogout = () => {
        clearAdminSessionToken();
        navigate({ to: '/admin/login' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this inquiry?')) return;
        try {
            await deleteInquiry.mutateAsync(id);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filtered = inquiries
        .filter((inq) => {
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                inq.name.toLowerCase().includes(q) ||
                inq.email.toLowerCase().includes(q) ||
                inq.destination.toLowerCase().includes(q) ||
                inq.message.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortField === 'destination') cmp = a.destination.localeCompare(b.destination);
            else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
            else cmp = Number(a.timestamp) - Number(b.timestamp);
            return sortDir === 'asc' ? cmp : -cmp;
        });

    if (!token) return null;

    const SortIcon = ({ field }: { field: SortField }) =>
        sortField === field ? (
            sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        ) : null;

    return (
        <div className="min-h-screen bg-terracotta-950 text-ivory-100">
            {/* Header */}
            <header className="bg-terracotta-900/80 border-b border-terracotta-700/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-saffron-400" />
                        </div>
                        <div>
                            <h1 className="font-display font-bold text-base text-ivory-100">SafarX Admin</h1>
                            <p className="font-body text-xs text-ivory-400">Dashboard</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-ivory-400 hover:text-ivory-100 hover:bg-terracotta-700/50 font-body gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-saffron-400' },
                        { label: 'Community Members', value: statsLoading ? '…' : Number(communityStats?.totalMembers ?? 0), icon: Users, color: 'text-teal-400' },
                        { label: 'Community Posts', value: statsLoading ? '…' : Number(communityStats?.totalPosts ?? 0), icon: BarChart3, color: 'text-terracotta-300' },
                        { label: 'Destinations', value: '20+', icon: MapPin, color: 'text-ivory-300' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <Card key={label} className="bg-terracotta-800/60 border-terracotta-700/50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`w-4 h-4 ${color}`} />
                                    <span className="font-body text-xs text-ivory-400">{label}</span>
                                </div>
                                <p className="font-display font-bold text-2xl text-ivory-100">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 bg-terracotta-800/40 rounded-xl p-1 w-fit">
                    {(['inquiries', 'community'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-lg font-body text-sm font-medium capitalize transition-colors ${
                                activeTab === tab
                                    ? 'bg-saffron-500 text-terracotta-900'
                                    : 'text-ivory-400 hover:text-ivory-200'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Inquiries Tab */}
                {activeTab === 'inquiries' && (
                    <div>
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-500" />
                                <Input
                                    placeholder="Search inquiries…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 bg-terracotta-800/40 border-terracotta-700/50 text-ivory-100 placeholder:text-ivory-500 font-body text-sm"
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refetchInquiries()}
                                className="text-ivory-400 hover:text-ivory-100 hover:bg-terracotta-700/50 font-body gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Refresh
                            </Button>
                        </div>

                        {inquiriesLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-6 h-6 animate-spin text-saffron-400" />
                            </div>
                        ) : inquiriesError ? (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-900/20 border border-red-700/30">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                <div>
                                    <p className="font-body text-sm text-red-300 font-medium">Failed to load inquiries</p>
                                    <p className="font-body text-xs text-red-400 mt-0.5">
                                        Admin session expired — please log in again.
                                    </p>
                                </div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20">
                                <MessageSquare className="w-10 h-10 text-ivory-600 mx-auto mb-3" />
                                <p className="font-body text-ivory-400">
                                    {search ? 'No inquiries match your search.' : 'No inquiries yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* Sort bar */}
                                <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-xs font-body text-ivory-500 uppercase tracking-wider">
                                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-ivory-300 transition-colors w-32">
                                        Name <SortIcon field="name" />
                                    </button>
                                    <button onClick={() => toggleSort('destination')} className="flex items-center gap-1 hover:text-ivory-300 transition-colors w-32">
                                        Destination <SortIcon field="destination" />
                                    </button>
                                    <button onClick={() => toggleSort('timestamp')} className="flex items-center gap-1 hover:text-ivory-300 transition-colors ml-auto">
                                        Date <SortIcon field="timestamp" />
                                    </button>
                                </div>

                                {filtered.map((inq) => (
                                    <Card key={inq.id} className="bg-terracotta-800/40 border-terracotta-700/40 hover:border-terracotta-600/60 transition-colors">
                                        <CardContent className="p-5">
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-display font-semibold text-ivory-100">{inq.name}</span>
                                                        <Badge className="bg-saffron-500/20 text-saffron-300 border-saffron-500/30 font-body text-xs">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {inq.destination}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                        <span className="font-body text-xs text-ivory-400 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {inq.email}
                                                        </span>
                                                        {inq.phone && (
                                                            <span className="font-body text-xs text-ivory-400 flex items-center gap-1">
                                                                <Phone className="w-3 h-3" /> {inq.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-body text-sm text-ivory-300 leading-relaxed line-clamp-2">
                                                        {inq.message}
                                                    </p>
                                                    <p className="font-body text-xs text-ivory-500">
                                                        {new Date(Number(inq.timestamp) / 1_000_000).toLocaleString()}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(inq.id)}
                                                    disabled={deleteInquiry.isPending}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
                                                >
                                                    {deleteInquiry.isPending ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Community Tab */}
                {activeTab === 'community' && (
                    <div>
                        {usersLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-6 h-6 animate-spin text-saffron-400" />
                            </div>
                        ) : communityUsers.length === 0 ? (
                            <div className="text-center py-20">
                                <Users className="w-10 h-10 text-ivory-600 mx-auto mb-3" />
                                <p className="font-body text-ivory-400">No community members yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {communityUsers.map((user) => (
                                    <Card key={String(user.userId)} className="bg-terracotta-800/40 border-terracotta-700/40">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-saffron-500/20 border border-saffron-400/30 flex items-center justify-center flex-shrink-0">
                                                    <span className="font-display font-bold text-saffron-400 text-sm">
                                                        {user.displayName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-body font-semibold text-ivory-100 text-sm">{user.displayName}</p>
                                                    <p className="font-body text-xs text-ivory-400">@{user.username}</p>
                                                </div>
                                                <p className="font-body text-xs text-ivory-500 hidden sm:block">
                                                    Joined {new Date(Number(user.joinedAt) / 1_000_000).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
