'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { LeagueLeaderboard } from '@/components/league';
import { leagueApi } from '@/lib/api/league';
import { LeagueMember, UserLeague } from '@/types/league';
import { Spinner } from '@/components/common/Spinner';
import LeaveLeagueModal from '@/components/league/LeaveLeagueModal';

export default function LeagueDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const leagueId = params?.id;

  const [league, setLeague] = useState<UserLeague | null>(null);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!leagueId) return;
      setLoading(true);
      setError(null);
      try {
        const [leagues, leaderboard] = await Promise.all([
          leagueApi.getMyLeagues(),
          leagueApi.getLeagueLeaderboard({ leagueId, page: 1, limit: 50 }),
        ]);

        setMembers(leaderboard);
        const found = leagues.find((l) => l.id === leagueId);
        setLeague(found ?? null);
      } catch (err) {
        setError(
          (err as { message?: string })?.message ??
            'Failed to load league leaderboard. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [leagueId]);

  const handleCopy = async () => {
    if (!league?.inviteCode) return;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(league.inviteCode);
    } catch (err) {
      console.error('Copy failed', err);
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  const handleLeaveLeague = async () => {
    if (!leagueId || !league) return;
    if (league.isOwner) {
      setLeaveError("League owners cannot leave their own league.");
      return;
    }

    setLeaving(true);
    setLeaveError(null);
    try {
      await leagueApi.leaveLeague(leagueId);
      router.push('/league');
    } catch (err) {
      setLeaveError(
        (err as { message?: string })?.message ??
          'Failed to leave league. Please try again.'
      );
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-6">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => router.push('/league')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#070A11] hover:text-[#4AA96C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to leagues
          </button>
        </div>

        {!loading && <div className="bg-white border border-[#F1F2F4] rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#070A11]">
                {league?.name ?? 'League'}
              </h1>
              <p className="text-sm text-[#656E81]">
                {league?.participantCount ?? '—'} participant
                {league?.participantCount === 1 ? '' : 's'}
                {league?.maxParticipants ? ` / ${league.maxParticipants}` : ''}
              </p>
            </div>

            {league?.inviteCode && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#070A11] font-mono bg-gray-100 px-3 py-1 rounded-full">
                  {league.inviteCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-[#4AA96C] hover:text-[#3c8b58] transition-colors"
                >
                  {copying ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}

            {!league?.isOwner && (
              <button
                onClick={() => setShowLeaveModal(true)}
                disabled={leaving}
                className={`rounded-full h-10 px-4 text-sm font-semibold text-white transition-colors ${
                  leaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#d02f2f] hover:bg-[#b52828]'
                }`}
              >
                {leaving ? 'Leaving...' : 'Leave League'}
              </button>
            )}
          </div>

          {leaveError && (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {leaveError}
            </div>
          )}
        </div>}

        {loading ? (
          <div className="flex justify-center py-12 items-center">
            <Spinner size={24} className="text-[#4AA96C]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <LeagueLeaderboard
            leagueName={league?.name ?? 'League Leaderboard'}
            stats={{
              globalRank: 0,
              totalPoints: members.reduce((sum, m) => sum + (m.totalPoints ?? 0), 0),
              budgetLeft: '—',
            }}
            members={members}
            onLeaveLeague={() => setShowLeaveModal(true)}
          />
        )}
      </div>

      <LeaveLeagueModal
        isOpen={showLeaveModal}
        onClose={() => {
          if (leaving) return;
          setShowLeaveModal(false);
        }}
        onConfirmLeave={async () => {
          setShowLeaveModal(false);
          await handleLeaveLeague();
        }}
        leagueName={league?.name}
      />
    </div>
  );
}

