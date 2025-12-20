'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { LeagueLeaderboard } from '@/components/league';
import { leagueApi } from '@/lib/api/league';
import { teamApi } from '@/lib/api/team';
import { LeagueMember, LeagueStats, UserLeague } from '@/types/league';
import { Spinner } from '@/components/common/Spinner';
import LeaveLeagueModal from '@/components/league/LeaveLeagueModal';
import toast from 'react-hot-toast';

export default function LeagueDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const leagueId = params?.id;

  const [league, setLeague] = useState<UserLeague | null>(null);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [stats, setStats] = useState<LeagueStats>({ globalRank: 0, totalPoints: 0, budgetLeft: '—' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!leagueId) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch leagues, leaderboard, and team data in parallel
        const [leagues, leaderboard, teamData] = await Promise.all([
          leagueApi.getMyLeagues(),
          leagueApi.getLeagueLeaderboard({ leagueId, page: 1, limit: 50 }),
          teamApi.getMyTeam().catch(() => null), // Don't fail if team doesn't exist
        ]);

        setMembers(leaderboard.members);
        const found = leagues.find((l) => l.id === leagueId);
        setLeague(found ?? null);

        // Get budget from team data (same as HomePage)
        let budgetLeft = '—';
        if (teamData?.team?.budgetRemaining != null) {
          const budgetInMillions = teamData.team.budgetRemaining / 1000000;
          budgetLeft = `$${budgetInMillions.toFixed(1)}M`;
        } else if (leaderboard.me?.budgetRemaining !== undefined) {
          budgetLeft = `${leaderboard.me.budgetRemaining}`;
        }

        setStats({
          globalRank: leaderboard.me?.rank ?? leaderboard.members[0]?.rank ?? 0,
          totalPoints:
            leaderboard.me?.totalPoints ??
            leaderboard.members.reduce((sum, m) => sum + (m.totalPoints ?? 0), 0),
          budgetLeft,
        });
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
      toast.error("League owners cannot leave their own league.");
      return;
    }

    setLeaving(true);
    try {
      await leagueApi.leaveLeague(leagueId);
      router.push('/league');
    } catch (err) {
      toast.error(
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
            stats={stats}
            members={members}
            inviteCode={league?.inviteCode}
            isOwner={Boolean(league?.isOwner)}
            leaving={leaving}
            copying={copying}
            onCopyInvite={handleCopy}
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

