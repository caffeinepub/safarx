import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  useGetAllInquiries,
  useDeleteInquiry,
  useCommunityStats,
  useCommunityUserList,
  clearAdminSessionToken,
} from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Trash2,
  LogOut,
  Users,
  FileText,
  AlertCircle,
  Loader2,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

function formatDate(timestamp: bigint | number): string {
  const ms = typeof timestamp === 'bigint' ? Number(timestamp) / 1_000_000 : timestamp;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Admin() {
  const navigate = useNavigate();
  const { isFetching: actorFetching } = useActor();

  // Check localStorage admin session token
  const [hasAdminSession, setHasAdminSession] = useState(() => {
    return !!localStorage.getItem('adminSession');
  });

  useEffect(() => {
    if (!hasAdminSession) {
      navigate({ to: '/admin/login' });
    }
  }, [hasAdminSession, navigate]);

  const {
    data: inquiries,
    isLoading: inquiriesLoading,
    error: inquiriesError,
    refetch: refetchInquiries,
  } = useGetAllInquiries();

  const {
    data: communityStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useCommunityStats();

  const {
    data: communityUsers,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useCommunityUserList();

  const deleteInquiry = useDeleteInquiry();

  const handleLogout = () => {
    clearAdminSessionToken();
    setHasAdminSession(false);
    navigate({ to: '/admin/login' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await deleteInquiry.mutateAsync(id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleRefreshAll = () => {
    refetchInquiries();
    refetchStats();
    refetchUsers();
  };

  if (!hasAdminSession) return null;

  // Detect session-expired errors
  const isSessionError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    return (
      msg.toLowerCase().includes('session expired') ||
      msg.toLowerCase().includes('unauthorized') ||
      msg.toLowerCase().includes('only admin')
    );
  };

  const handleSessionExpired = () => {
    clearAdminSessionToken();
    navigate({ to: '/admin/login' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.98 0.01 80)' }}>
      {/* Header */}
      <header className="text-white shadow-md" style={{ background: 'oklch(0.65 0.18 55)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">SafarX Admin</h1>
            <p className="text-sm opacity-80">Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            {actorFetching ? (
              <span className="flex items-center gap-2 text-sm opacity-70">
                <Loader2 className="w-4 h-4 animate-spin" />
                Initializing…
              </span>
            ) : (
              <span className="flex items-center gap-2 text-sm opacity-80">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:block text-xs">Admin Session Active</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Initializing notice */}
        {actorFetching && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'oklch(0.65 0.18 55)' }} />
            <p className="text-sm" style={{ color: 'oklch(0.45 0.05 55)' }}>
              Connecting to backend…
            </p>
          </div>
        )}

        {/* ── Enquiries Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ background: 'oklch(0.92 0.08 55)' }}>
              <MessageSquare className="w-5 h-5" style={{ color: 'oklch(0.50 0.18 55)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display" style={{ color: 'oklch(0.30 0.05 55)' }}>
                Travel Enquiries
              </h2>
              <p className="text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>
                {inquiries
                  ? `${inquiries.length} enquir${inquiries.length === 1 ? 'y' : 'ies'} received`
                  : inquiriesLoading
                  ? 'Loading…'
                  : 'Enquiries submitted via the contact form'}
              </p>
            </div>
            <button
              onClick={() => refetchInquiries()}
              className="ml-auto text-sm px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: 'oklch(0.80 0.05 55)', color: 'oklch(0.45 0.10 55)' }}
            >
              Refresh
            </button>
          </div>

          {/* Loading skeletons */}
          {inquiriesLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between mb-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {inquiriesError && !inquiriesLoading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-700">Failed to load enquiries</p>
                <p className="text-sm text-red-600 mt-1">
                  {isSessionError(inquiriesError)
                    ? 'Admin session expired — please log in again.'
                    : (inquiriesError as Error).message}
                </p>
                {isSessionError(inquiriesError) ? (
                  <button
                    onClick={handleSessionExpired}
                    className="mt-2 text-sm text-red-700 font-medium underline hover:no-underline"
                  >
                    Go to login
                  </button>
                ) : (
                  <button
                    onClick={() => refetchInquiries()}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!inquiriesLoading && !inquiriesError && inquiries && inquiries.length === 0 && (
            <div
              className="text-center py-16 rounded-xl border-2 border-dashed"
              style={{ borderColor: 'oklch(0.85 0.05 55)' }}
            >
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium" style={{ color: 'oklch(0.50 0.05 55)' }}>No enquiries yet</p>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.03 55)' }}>
                Enquiries submitted via the contact form will appear here.
              </p>
            </div>
          )}

          {/* Enquiry cards */}
          {!inquiriesLoading && !inquiriesError && inquiries && inquiries.length > 0 && (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg" style={{ color: 'oklch(0.25 0.05 55)' }}>
                        {inquiry.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {inquiry.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {inquiry.phone || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={{ background: 'oklch(0.92 0.08 55)', color: 'oklch(0.40 0.15 55)' }}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {inquiry.destination}
                      </Badge>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={deleteInquiry.isPending}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete enquiry"
                      >
                        {deleteInquiry.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'oklch(0.40 0.03 55)' }}>
                    {inquiry.message}
                  </p>

                  <div className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.60 0.03 55)' }}>
                    <Clock className="w-3 h-3" />
                    {formatDate(inquiry.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Community Stats Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ background: 'oklch(0.90 0.06 200)' }}>
              <BarChart3 className="w-5 h-5" style={{ color: 'oklch(0.40 0.12 200)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display" style={{ color: 'oklch(0.30 0.05 55)' }}>
                Community Stats
              </h2>
              <p className="text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>
                Overview of registered members and posts
              </p>
            </div>
            <button
              onClick={handleRefreshAll}
              className="ml-auto text-sm px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
              style={{ borderColor: 'oklch(0.80 0.05 55)', color: 'oklch(0.45 0.10 55)' }}
            >
              Refresh
            </button>
          </div>

          {/* Stat Cards — loading */}
          {statsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          )}

          {/* Stat Cards — error */}
          {statsError && !statsLoading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-700">Failed to load community stats</p>
                <p className="text-sm text-red-600 mt-1">
                  {isSessionError(statsError)
                    ? 'Admin session expired — please log in again.'
                    : (statsError as Error).message}
                </p>
                {isSessionError(statsError) ? (
                  <button
                    onClick={handleSessionExpired}
                    className="mt-2 text-sm text-red-700 font-medium underline hover:no-underline"
                  >
                    Go to login
                  </button>
                ) : (
                  <button
                    onClick={() => refetchStats()}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stat Cards — data */}
          {!statsLoading && !statsError && communityStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'oklch(0.90 0.06 200)' }}>
                  <Users className="w-6 h-6" style={{ color: 'oklch(0.40 0.12 200)' }} />
                </div>
                <div>
                  <p className="text-3xl font-bold font-display" style={{ color: 'oklch(0.25 0.05 55)' }}>
                    {Number(communityStats.totalMembers)}
                  </p>
                  <p className="text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>Total Members</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: 'oklch(0.92 0.08 55)' }}>
                  <FileText className="w-6 h-6" style={{ color: 'oklch(0.50 0.18 55)' }} />
                </div>
                <div>
                  <p className="text-3xl font-bold font-display" style={{ color: 'oklch(0.25 0.05 55)' }}>
                    {Number(communityStats.totalPosts)}
                  </p>
                  <p className="text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>Total Posts</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Community Users Section ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg" style={{ background: 'oklch(0.90 0.06 200)' }}>
              <Users className="w-5 h-5" style={{ color: 'oklch(0.40 0.12 200)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display" style={{ color: 'oklch(0.30 0.05 55)' }}>
                Community Members
              </h2>
              <p className="text-sm" style={{ color: 'oklch(0.50 0.05 55)' }}>
                {communityUsers
                  ? `${communityUsers.length} registered member${communityUsers.length === 1 ? '' : 's'}`
                  : usersLoading
                  ? 'Loading…'
                  : 'All registered community users'}
              </p>
            </div>
          </div>

          {/* Loading */}
          {usersLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {usersError && !usersLoading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-red-700">Failed to load community members</p>
                <p className="text-sm text-red-600 mt-1">
                  {isSessionError(usersError)
                    ? 'Admin session expired — please log in again.'
                    : (usersError as Error).message}
                </p>
                {isSessionError(usersError) ? (
                  <button
                    onClick={handleSessionExpired}
                    className="mt-2 text-sm text-red-700 font-medium underline hover:no-underline"
                  >
                    Go to login
                  </button>
                ) : (
                  <button
                    onClick={() => refetchUsers()}
                    className="mt-2 text-sm text-red-700 underline hover:no-underline"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Empty */}
          {!usersLoading && !usersError && communityUsers && communityUsers.length === 0 && (
            <div
              className="text-center py-12 rounded-xl border-2 border-dashed"
              style={{ borderColor: 'oklch(0.85 0.05 200)' }}
            >
              <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium" style={{ color: 'oklch(0.50 0.05 55)' }}>No members yet</p>
              <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.03 55)' }}>
                Community members will appear here once they register.
              </p>
            </div>
          )}

          {/* User list */}
          {!usersLoading && !usersError && communityUsers && communityUsers.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: 'oklch(0.96 0.02 55)' }}>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: 'oklch(0.40 0.08 55)' }}>
                        Member
                      </th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: 'oklch(0.40 0.08 55)' }}>
                        Username
                      </th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: 'oklch(0.40 0.08 55)' }}>
                        Joined
                      </th>
                      <th className="text-left px-5 py-3 font-semibold" style={{ color: 'oklch(0.40 0.08 55)' }}>
                        ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {communityUsers.map((user, idx) => (
                      <tr
                        key={Number(user.userId)}
                        className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: `oklch(${0.55 + (idx % 3) * 0.1} 0.15 ${55 + (idx % 5) * 40})` }}
                            >
                              {user.displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium" style={{ color: 'oklch(0.30 0.05 55)' }}>
                              {user.displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'oklch(0.50 0.05 55)' }}>
                          @{user.username}
                        </td>
                        <td className="px-5 py-3" style={{ color: 'oklch(0.55 0.03 55)' }}>
                          {formatDate(user.joinedAt)}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs" style={{ color: 'oklch(0.65 0.03 55)' }}>
                          #{Number(user.userId)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
