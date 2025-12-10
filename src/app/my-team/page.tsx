'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import EmptyTeamState from '@/components/team/EmptyTeamState';
import CreateTeamModal from '@/components/team/CreateTeamModal';
import MyTeamPage from '@/components/team/MyTeamPage';
import { Team, Player, SquadPlayer, PlayerRole } from '@/types/team';
import Image from 'next/image';
import Link from 'next/link';
import { teamApi, authApi } from '@/lib/api';



export default function TeamPage() {
  const [hasTeam, setHasTeam] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [createTeamError, setCreateTeamError] = useState<string | null>(null);
  const [isFetchingTeam, setIsFetchingTeam] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [initialSquad, setInitialSquad] = useState<SquadPlayer[]>([]);
  const [playersPage, setPlayersPage] = useState(1);
  const [playersHasMore, setPlayersHasMore] = useState(true);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [playersLoadedFromApi, setPlayersLoadedFromApi] = useState(false);
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerPosition, setPlayerPosition] = useState('All');
  const isLoadingPlayersRef = useRef(false);
  const ready = true;

  const normalizePosition = (pos?: string | number): Player['position'] => {
    if (typeof pos === 'number') {
      // Handle numeric position IDs from API
      if (pos === 24) return 'GK';
      if (pos === 25) return 'DEF';
      if (pos === 26) return 'MID';
      if (pos === 27) return 'FWD';
    }

    const code = (pos || '').toString().toUpperCase();
    if (code.includes('GK') || code.includes('GOAL')) return 'GK';
    if (code.includes('DEF')) return 'DEF';
    if (code.includes('MID')) return 'MID';
    if (code.includes('FWD') || code.includes('ATT') || code.includes('STR') || code.includes('FOR')) return 'FWD';
    return 'MID';
  };

  const mapApiPlayerToSquad = (sp: {
    id?: string;
    squadId?: string;
    playerId?: number;
    position?: string;
    isStarting?: boolean;
    isCaptain?: boolean;
    isViceCaptain?: boolean;
    isPenaltyTaker?: boolean;
    isFreeKickTaker?: boolean;
    player?: {
      id?: number | string;
      name?: string;
      commonName?: string;
      position?: { code?: string; developer_name?: string; name?: string };
      positionId?: number;
      rating?: number;
      points?: number;
      price?: number;
      image?: string;
    };
  }): SquadPlayer | null => {
    const p = sp.player;
    if (!p) return null;
    const pos =
      p.position?.code ||
      p.position?.developer_name ||
      p.position?.name ||
      sp.position ||
      p.positionId;

    const role: PlayerRole =
      sp.isCaptain ? 'captain' :
      sp.isViceCaptain ? 'vice-captain' :
      sp.isPenaltyTaker ? 'penalty-taker' :
      sp.isFreeKickTaker ? 'free-kick-taker' :
      null;

    return {
      id: String(p.id ?? sp.playerId ?? Math.random()),
      squadEntryId: sp.id ? String(sp.id) : undefined,
      name: p.commonName || p.name || 'Player',
      position: normalizePosition(pos),
      image: p.image,
      country: '',
      price: p.price ?? 0,
      points: p.points ?? 0,
      rating: p.rating ?? 0,
      selected: true,
      inSquad: true,
      inStarting11: Boolean(sp.isStarting),
      onBench: !sp.isStarting,
      squadPosition: sp.isStarting ? 'starting' : 'bench',
      role,
    };
  };

  const fetchMyTeam = async () => {
    setIsFetchingTeam(true);
    setCreateTeamError(null);
    try {
      const data = await teamApi.getMyTeam();
      const apiTeam = data?.team;
      const squadPlayers = data?.currentSquad?.players ?? [];

      if (apiTeam) {
        setTeam({
          id: apiTeam.id,
          name: apiTeam.name,
          logo: apiTeam.logo ?? (apiTeam as { logoUrl?: string }).logoUrl,
          points: (apiTeam as { points?: number }).points ?? 0,
          budget: apiTeam.budgetRemaining ?? apiTeam.budgetTotal ?? 100000000,
          manager: (apiTeam as { owner?: { fullName?: string; email?: string } }).owner?.fullName ||
            (apiTeam as { owner?: { email?: string } }).owner?.email ||
            'Manager',
        });
        setHasTeam(true);
      }

      if (squadPlayers.length > 0) {
        const mappedSquad = squadPlayers
          .map(mapApiPlayerToSquad)
          .filter(Boolean) as SquadPlayer[];

        if (mappedSquad.length > 0) {
          setInitialSquad(mappedSquad);
          setAvailablePlayers(mappedSquad);
        }
      }
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to load team. Please try again.';
      setCreateTeamError(message);
    } finally {
      setIsFetchingTeam(false);
    }
  };

  const fetchPlayers = useCallback(
    async (pageToFetch = 1, reset = false, search = '', position = 'All', isMore = false) => {
      if (isLoadingPlayersRef.current) return;
      isLoadingPlayersRef.current = true;
      setIsLoadingPlayers(true);
      setIsLoadingMore(isMore);
      try {
        const limit = 20; // fetch in small pages lazily on modal scroll
        const positionParam = position === 'All' ? undefined : position;
        const { players: apiPlayers, meta } = await teamApi.getPlayers({
          page: pageToFetch,
          limit,
          search: search || undefined,
          position: positionParam,
        });
        const mappedPlayers: Player[] = (apiPlayers ?? []).map((p) => {
          const pos = p.position?.code || p.position?.developer_name || p.position?.name || p.positionId;
          return {
            id: String(p.id ?? Math.random()),
            name: p.commonName || p.name || 'Player',
            position: normalizePosition(pos),
            country: '',
            price: p.price ?? 0,
            points: p.points ?? 0,
            rating: p.rating ?? 0,
            image: p.image,
            selected: false,
          };
        });

        setAvailablePlayers((prev) => {
          if (reset) {
            return mappedPlayers;
          }
          const existingIds = new Set(prev.map((p) => p.id));
          const deduped = mappedPlayers.filter((p) => !existingIds.has(p.id));
          return prev.concat(deduped);
        });
        setPlayersLoadedFromApi(true);

        const currentPage = meta?.currentPage ?? pageToFetch;
        const totalPages = meta?.totalPages ?? pageToFetch;
        setPlayersPage(currentPage);
        setPlayersHasMore(currentPage < totalPages);

        // If API doesn't return pagination meta, stop when we receive a short page
        if (!meta?.totalPages && (apiPlayers?.length ?? 0) < limit) {
          setPlayersHasMore(false);
        }
      } catch (error) {
        const message =
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          'Failed to load players. Please try again.';
        setCreateTeamError((prev) => prev ?? message);
        setPlayersHasMore(false);
      } finally {
        setIsLoadingPlayers(false);
        setIsLoadingMore(false);
        isLoadingPlayersRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    if (ready) {
      fetchMyTeam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleCreateTeamSubmit = async (teamName: string, logo?: File) => {
    setIsCreatingTeam(true);
    setCreateTeamError(null);
    try {
      let logoUrl: string | undefined;

      if (logo) {
        const upload = await authApi.uploadProfileImage(logo);
        logoUrl = upload.url || upload.path;
      }

      const createdTeam = await teamApi.createTeam({ name: teamName, logoUrl });
      setTeam({
        id: createdTeam.id,
        name: createdTeam.name,
        logo: createdTeam.logo || logoUrl,
        points: createdTeam.points ?? 0,
        budget: createdTeam.budget ?? 100000000,
        manager: createdTeam.manager ?? 'Current User',
      });
      setHasTeam(true);
      setShowCreateModal(false);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to create team. Please try again.';
      setCreateTeamError(message);
    } finally {
      setIsCreatingTeam(false);
    }
  };

  // Ensure budget is always 100M if team exists
  useEffect(() => {
    if (team && team.budget !== 100000000) {
      setTeam({ ...team, budget: 100000000 });
    }
  }, [team]);

  const handleAppointStarting11 = () => {
    // Navigate to player selection page or open modal
    console.log('Appoint starting 11');
  };

  const handleAssignModalOpen = () => {
    if (!playersLoadedFromApi && !isLoadingPlayers) {
      setPlayersPage(0);
      setPlayersHasMore(true);
      fetchPlayers(1, true, playerSearch, playerPosition, false);
    }
  };

  const handleSearchPlayers = (value: string) => {
    setPlayerSearch(value);
  };

  const handlePositionFilter = (value: string) => {
    setPlayerPosition(value);
    setPlayersPage(0);
    setPlayersHasMore(true);
    fetchPlayers(1, true, playerSearch, value, false);
  };

  useEffect(() => {
    // If we haven't loaded once yet and search is empty, skip until first fetch via modal open
    if (!playersLoadedFromApi && playerSearch.trim() === '') return;
    const timer = setTimeout(() => {
      setPlayersPage(0);
      setPlayersHasMore(true);
      fetchPlayers(1, true, playerSearch, playerPosition, false);
    }, 700);
    return () => clearTimeout(timer);
  }, [playerSearch, fetchPlayers, playersLoadedFromApi, playerPosition]);

  if (isFetchingTeam && !hasTeam) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4AA96C] mx-auto mb-3" />
          <p className="text-sm text-[#656E81]">Loading your team...</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="https://res.cloudinary.com/dmfsyau8s/image/upload/v1764948169/CominSoonBlue_b9r5cs.png"
            alt="Coming Soon"
            width={350}
            height={350}
          />
          <Link
            href="/predictor"
            className="bg-[#4AA96C] text-sm inline-flex items-center px-6 py-2 text-white font-medium rounded-full transition-colors"
          >
            Play Our Predictor Now
          </Link>
        </div>
      </div>
    );
  }

  if (!hasTeam) {
    return (
      <>
        <EmptyTeamState onCreateTeam={handleCreateTeam} />
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTeam={handleCreateTeamSubmit}
          isSubmitting={isCreatingTeam}
          errorMessage={createTeamError}
        />
      </>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <MyTeamPage
      team={team}
      onAppointStarting11={handleAppointStarting11}
      availablePlayers={availablePlayers}
      initialSquad={initialSquad}
      onLoadMorePlayers={() => {
        if (playersHasMore && !isLoadingPlayers) {
          fetchPlayers(playersPage + 1, false, playerSearch, playerPosition, true);
        }
      }}
      canLoadMorePlayers={playersHasMore}
      isLoadingMorePlayers={isLoadingMore}
      onAssignModalOpen={handleAssignModalOpen}
      onSearchPlayers={handleSearchPlayers}
      onPositionChange={handlePositionFilter}
      isPlayersListLoading={isLoadingPlayers && !isLoadingMore}
    />
  );
}
