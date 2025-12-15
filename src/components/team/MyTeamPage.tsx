"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { Team, Player, SquadPlayer, PlayerRole } from "@/types/team";
import FootballPitch from "./FootballPitch";
import TeamBoosts, { TeamBoost } from "./TeamBoosts";
import UpcomingFixtures, { Fixture } from "./UpcomingFixtures";
import AssignStarting11Modal from "./AssignStarting11Modal";
import PlayerDetailsModal from "./PlayerDetailsModal";
import SquadManagement from "./SquadManagement";
import Transfers from "./Transfers";
import PlayerRoleMenu from "./PlayerRoleMenu";
import SubstitutionModal from "./SubstitutionModal";
import ReverseSubstitutionModal from "./ReverseSubstitutionModal";
import { teamApi, TeamHistoryEvent } from "@/lib/api";
import { TransferHistoryItem } from "@/lib/api/team";
import toast from "react-hot-toast";
import { Spinner } from "../common/Spinner";

interface MyTeamPageProps {
  team: Team;
  onAppointStarting11: () => void;
  availablePlayers?: Player[];
  initialSquad?: SquadPlayer[];
  onLoadMorePlayers?: () => void;
  canLoadMorePlayers?: boolean;
  isLoadingMorePlayers?: boolean;
  onAssignModalOpen?: () => void;
  onSearchPlayers?: (value: string) => void;
  onPositionChange?: (value: string) => void;
  isPlayersListLoading?: boolean;
}

type TabType = "my-team" | "transfers" | "team-history";
type BoostTabType = "boosts" | "fixtures";

const MyTeamPage: React.FC<MyTeamPageProps> = ({
  team,
  availablePlayers = [],
  initialSquad = [],
  onLoadMorePlayers,
  canLoadMorePlayers = false,
  isLoadingMorePlayers = false,
  onAssignModalOpen,
  onSearchPlayers,
  onPositionChange,
  isPlayersListLoading = false,
}) => {
  const TRANSFER_PAGE_SIZE = 20;
  const [activeTab, setActiveTab] = useState<TabType>("my-team");
  const [activeBoostTab, setActiveBoostTab] = useState<BoostTabType>("boosts");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [squadPlayers, setSquadPlayers] = useState<SquadPlayer[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerDetails, setShowPlayerDetails] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [substitutionPlayer, setSubstitutionPlayer] = useState<SquadPlayer | null>(null);
  const [showReverseSubstitutionModal, setShowReverseSubstitutionModal] = useState(false);
  const [reverseSubstitutionPlayer, setReverseSubstitutionPlayer] = useState<SquadPlayer | null>(null);
  const [roleMenuState, setRoleMenuState] = useState<{
    isOpen: boolean;
    player: SquadPlayer | null;
    position: { x: number; y: number };
  }>({
    isOpen: false,
    player: null,
    position: { x: 0, y: 0 },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelectedPosition, setLocalSelectedPosition] = useState<string>("All");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [boosts, setBoosts] = useState<TeamBoost[]>([]);
  const [isLoadingBoosts, setIsLoadingBoosts] = useState(false);
  const [pendingTransferOut, setPendingTransferOut] = useState<SquadPlayer | null>(null);
  const [transferHistory, setTransferHistory] = useState<TransferHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [transferPlayers, setTransferPlayers] = useState<Player[]>([]);
  const [isLoadingTransferPlayers, setIsLoadingTransferPlayers] = useState(false);
  const [canLoadMoreTransferPlayers, setCanLoadMoreTransferPlayers] = useState(false);
  const [transferPlayersPage, setTransferPlayersPage] = useState(1);
  const [transferSearchTerm, setTransferSearchTerm] = useState("");
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [isSavingLineup, setIsSavingLineup] = useState(false);
  const [teamHistory, setTeamHistory] = useState<
    Array<{
      id: string;
      matchDay: string;
      date: string;
      captain?: string;
      viceCaptain?: string;
      points?: number;
      rank?: number;
      transfers?: number;
    }>
  >([]);
  const [isLoadingTeamHistory, setIsLoadingTeamHistory] = useState(false);

  const normalizePosition = (pos: unknown): Player["position"] => {
    const code = (pos || "").toString().toUpperCase();
    if (code.includes("GK") || code.includes("GOAL")) return "GK";
    if (code.includes("DEF")) return "DEF";
    if (code.includes("MID")) return "MID";
    if (code.includes("FWD") || code.includes("ATT") || code.includes("STR") || code.includes("FOR"))
      return "FWD";
    return "MID";
  };
  useEffect(() => {
    if (initialSquad.length && squadPlayers.length === 0) {
      setSquadPlayers(initialSquad);
    }
  }, [initialSquad, squadPlayers.length]);

  const defaultFixtureId = 0; // TODO: wire actual fixture id when available

  useEffect(() => {
    const loadFixtures = async () => {
      setIsLoadingFixtures(true);
      try {
        const upcoming = await teamApi.getUpcomingFixtures({ limit: 10 });
        const mapped: Fixture[] = (upcoming ?? []).map((fx) => {
          const home = fx.participants?.[0];
          const away = fx.participants?.[1];
          const date = fx.startingAt ? new Date(fx.startingAt) : null;
          return {
            id: String(fx.id ?? Math.random()),
            homeTeam: { name: home?.name || "Home", flag: home?.logo },
            awayTeam: { name: away?.name || "Away", flag: away?.logo },
            matchDay: fx.gameweekId ? `GW ${fx.gameweekId}` : "Upcoming",
            date: date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "TBD",
          };
        });
        setFixtures(mapped);
      } catch (error) {
        toast.error(
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
            (error as { message?: string })?.message ||
            "Failed to load fixtures."
        );
      } finally {
        setIsLoadingFixtures(false);
      }
    };

    loadFixtures();
  }, []);

  const loadTransferHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const history = await teamApi.getTransferHistory();
      setTransferHistory(history);
    } catch (error) {
      // silent fail; history is optional
      console.error("Failed to load transfer history", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadTransferHistory();
  }, [loadTransferHistory]);

  const mapApiPlayersToTransfer = useCallback(
    (apiPlayers?: Array<{ id?: number | string; name?: string; commonName?: string; position?: { code?: string; developer_name?: string; name?: string }; positionId?: number; price?: number; points?: number; rating?: number; image?: string }>): Player[] => {
      return (apiPlayers ?? []).map((p) => {
        const pos = p.position?.code || p.position?.developer_name || p.position?.name || p.positionId;
        return {
          id: String(p.id ?? Math.random()),
          name: p.commonName || p.name || "Player",
          position: normalizePosition(pos),
          country: "",
          price: p.price ?? 0,
          points: p.points ?? 0,
          rating: p.rating ?? 0,
          image: p.image,
          selected: false,
        };
      });
    },
    []
  );

  const fetchTransferPlayers = useCallback(
    async ({ page = 1, append = false, search }: { page?: number; append?: boolean; search?: string } = {}) => {
      setIsLoadingTransferPlayers(true);
      try {
        const { players: apiPlayers, meta } = await teamApi.getPlayers({
          page,
          limit: TRANSFER_PAGE_SIZE,
          search: search || undefined,
        });

        const mapped = mapApiPlayersToTransfer(apiPlayers);
        setTransferPlayers((prev) => (append ? [...prev, ...mapped] : mapped));
        setTransferPlayersPage(page);

        const totalPages = meta?.totalPages ?? null;
        const currentPage = meta?.currentPage ?? page;
        const hasMore =
          (totalPages !== null && currentPage < totalPages) ||
          mapped.length === TRANSFER_PAGE_SIZE;
        setCanLoadMoreTransferPlayers(hasMore);
      } catch (error) {
        console.error("Failed to load transfer players", error);
        setCanLoadMoreTransferPlayers(false);
      } finally {
        setIsLoadingTransferPlayers(false);
      }
    },
    [mapApiPlayersToTransfer]
  );

  const fetchTeamHistory = useCallback(async () => {
    setIsLoadingTeamHistory(true);
    try {
      const events = await teamApi.getTeamHistory();
      const mapped =
        events?.map((evt: TeamHistoryEvent, index: number) => {
          const squad = evt.team?.squads?.[0];
          const gw = squad?.gameweek;
          const ranking = evt.team?.rankings?.find((r) => r.gameweekId === gw?.id) ?? evt.team?.rankings?.[0];
          const captain = squad?.players?.find((p) => p.isCaptain)?.player?.name;
          const viceCaptain = squad?.players?.find((p) => p.isViceCaptain)?.player?.name;
          const date = gw?.firstKickoffAt || evt.createdAt;
          const transfersCount = Array.isArray(evt.team?.transfers) ? evt.team.transfers.length : undefined;

          return {
            id: String(evt.id ?? `history-${index}`),
            matchDay: gw?.name || gw?.code || "Match Day",
            date: date ? new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—",
            captain: captain || "—",
            viceCaptain: viceCaptain || "—",
            points: ranking?.totalPoints ?? undefined,
            rank: ranking?.rank ?? undefined,
            transfers: transfersCount,
          };
        }) ?? [];
      setTeamHistory(mapped);
    } catch (error) {
      console.error("Failed to load team history", error);
      setTeamHistory([]);
    } finally {
      setIsLoadingTeamHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "transfers") return;
    // initial load or refresh on search
    fetchTransferPlayers({ page: 1, append: false, search: transferSearchTerm });
  }, [activeTab, transferSearchTerm, fetchTransferPlayers]);

  useEffect(() => {
    if (activeTab === "team-history" && teamHistory.length === 0 && !isLoadingTeamHistory) {
      fetchTeamHistory();
    }
  }, [activeTab, teamHistory.length, isLoadingTeamHistory, fetchTeamHistory]);

  useEffect(() => {
    const loadBoosts = async () => {
      setIsLoadingBoosts(true);
      try {
        const data = await teamApi.getTeamBoosts();
        const boostDescriptions: Record<string, string> = {
          MAX_CAPTAIN: "Double points for both captain and vice-captain",
          TRIPLE_CAPTAIN: "Triple the points of your captain for one gameweek",
          SAVES_BOOST: "Add 3 points per save to the GK for that game week",
        };

        const mapped: TeamBoost[] = (data ?? []).map((b, idx) => {
          const type = (b.type || "").toUpperCase();
          return {
            id: String(b.id ?? type ?? idx),
            name: type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) || "Boost",
            description: boostDescriptions[type] || "One-time gameweek boost",
            used: Boolean(b.used),
          };
        });
        setBoosts(mapped);
      } catch (error) {
        toast.error(
          (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
            (error as { message?: string })?.message ||
            "Failed to load boosts."
        );
      } finally {
        setIsLoadingBoosts(false);
      }
    };

    loadBoosts();
  }, []);

  const handleUseBoost = async (boostId: string) => {
    try {
      await teamApi.applyTeamBoost(boostId);
      setBoosts((prev) =>
        prev.map((b) => (b.id === boostId ? { ...b, used: true } : b))
      );
      toast.success("Boost applied");
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to apply boost."
      );
    }
  };

  const validateMatchday11 = (players: SquadPlayer[]): { isValid: boolean; errors: string[] } => {
    const starting11 = players.filter((p) => p.inStarting11);
    const bench = players.filter((p) => p.onBench);
    const errors: string[] = [];

    // Validate starting 11 count
    if (starting11.length !== 11) {
      errors.push(`Starting 11 must have exactly 11 players (currently ${starting11.length})`);
      return { isValid: false, errors };
    }

    // Validate bench count
    if (bench.length > 4) {
      errors.push(`Bench cannot exceed 4 players (currently ${bench.length})`);
      return { isValid: false, errors };
    }

    const counts = {
      GK: starting11.filter((p) => p.position === 'GK').length,
      DEF: starting11.filter((p) => p.position === 'DEF').length,
      MID: starting11.filter((p) => p.position === 'MID').length,
      FWD: starting11.filter((p) => p.position === 'FWD').length,
    };

    // Matchday validation rules
    if (counts.GK !== 1) {
      errors.push('Starting 11 must have exactly 1 goalkeeper');
    }
    if (counts.DEF < 3 || counts.DEF > 5) {
      errors.push(`Starting 11 must have between 3 and 5 defenders (currently ${counts.DEF})`);
    }
    if (counts.MID < 2 || counts.MID > 5) {
      errors.push(`Starting 11 must have between 2 and 5 midfielders (currently ${counts.MID})`);
    }
    if (counts.FWD < 1 || counts.FWD > 3) {
      errors.push(`Starting 11 must have between 1 and 3 forwards (currently ${counts.FWD})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const deriveFormation = (players: SquadPlayer[]) => {
    const def = players.filter((p) => p.inStarting11 && p.position === "DEF").length;
    const mid = players.filter((p) => p.inStarting11 && p.position === "MID").length;
    const fwd = players.filter((p) => p.inStarting11 && p.position === "FWD").length;
    return `${def}-${mid}-${fwd}`;
  };

  const syncRolesWithApi = async (players: SquadPlayer[]) => {
    const starters = players.filter((p) => p.inStarting11);
    const toPlayerId = (p?: SquadPlayer) => {
      if (!p) return undefined;
      const parsed = Number(p.id);
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const captainId = toPlayerId(starters.find((p) => p.role === "captain"));
    const viceCaptainId = toPlayerId(starters.find((p) => p.role === "vice-captain"));
    const penaltyTakerId = toPlayerId(starters.find((p) => p.isPenaltyTaker));
    const freeKickTakerId = toPlayerId(starters.find((p) => p.isFreeKickTaker));

    await teamApi.updateRoles({
      captainId,
      viceCaptainId,
      penaltyTakerId,
      freeKickTakerId,
      fixtureId: defaultFixtureId,
    });
  };

  const handleSaveSquad = async (players: Player[]) => {
    // Auto-build a 4-3-3 starting lineup from the selected 15 players
    const gks = players.filter((p) => p.position === "GK");
    const defs = players.filter((p) => p.position === "DEF");
    const mids = players.filter((p) => p.position === "MID");
    const fwds = players.filter((p) => p.position === "FWD");

    const errors: string[] = [];
    if (gks.length < 1) errors.push("You need at least 1 goalkeeper in your squad.");
    if (defs.length < 4) errors.push("You need at least 4 defenders in your squad.");
    if (mids.length < 3) errors.push("You need at least 3 midfielders in your squad.");
    if (fwds.length < 3) errors.push("You need at least 3 forwards in your squad.");

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    const starting11: Player[] = [
      gks[0], // exactly one GK
      ...defs.slice(0, 4),
      ...mids.slice(0, 3),
      ...fwds.slice(0, 3),
    ];

    const starterIds = new Set(starting11.map((p) => String(p.id)));
    const bench: Player[] = players.filter((p) => !starterIds.has(String(p.id))).slice(0, 4);

    // Ensure exactly 11 starting and max 4 bench
    if (starting11.length !== 11) {
      toast.error(`Error: Starting 11 must have exactly 11 players (got ${starting11.length})`);
      return;
    }

    if (bench.length !== 4) {
      toast.error(`Error: Squad must have exactly 4 bench players (got ${bench.length})`);
      return;
    }

    const squad: SquadPlayer[] = [
      ...starting11.map((player) => ({
        ...player,
        inSquad: true,
        inStarting11: true,
        onBench: false,
        squadPosition: "starting" as const,
      })),
      ...bench.map((player) => ({
        ...player,
        inSquad: true,
        inStarting11: false,
        onBench: true,
        squadPosition: "bench" as const,
      })),
    ];

    // Validate matchday 11
    const validation = validateMatchday11(squad);
    if (!validation.isValid) {
      toast.error(validation.errors.join('\n'));
      return;
    }

    try {
      const formation = deriveFormation(squad);

      await teamApi.createSquad({
        formation,
        squad: squad.map((p) => ({
          playerId: Number(p.id),
          isStarting: Boolean(p.inStarting11),
          isCaptain: p.role === "captain",
          isViceCaptain: p.role === "vice-captain",
          isPenaltyTaker: Boolean(p.isPenaltyTaker),
          isFreeKickTaker: Boolean(p.isFreeKickTaker),
        })),
      });

      await teamApi.updateLineup({
        formation,
        startingPlayerIds: squad.filter((p) => p.inStarting11).map((p) => Number(p.id)),
        benchPlayerIds: squad.filter((p) => p.onBench).map((p) => Number(p.id)),
        fixtureId: defaultFixtureId,
      });

      await syncRolesWithApi(squad);

      setSquadPlayers(squad);
      setShowAssignModal(false);
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to save squad. Please try again.";
      toast.error(message);
    }
  };

  const persistLineup = async (updatedSquad: SquadPlayer[]) => {
    setIsSavingLineup(true);
    try {
      const formation = deriveFormation(updatedSquad);
      const toPlayerId = (p: SquadPlayer) => {
        const parsed = Number(p.id);
        if (!Number.isFinite(parsed)) {
          throw new Error(`Invalid player id for lineup: ${p.id}`);
        }
        return parsed;
      };

      await teamApi.updateLineup({
        formation,
        startingPlayerIds: updatedSquad.filter((p) => p.inStarting11).map(toPlayerId),
        benchPlayerIds: updatedSquad.filter((p) => p.onBench).map(toPlayerId),
        fixtureId: defaultFixtureId,
      });
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
          (error as { message?: string })?.message ||
          "Failed to update lineup."
      );
    } finally {
      setIsSavingLineup(false);
    }
  };

  const starting11 = useMemo(() => {
    return squadPlayers.filter((p) => p.inStarting11).slice(0, 11);
  }, [squadPlayers]);

  const bench = useMemo(() => {
    const benchPlayers = squadPlayers.filter((p) => p.onBench).slice(0, 4); // Ensure max 4 bench players
    // Sort bench players: GK always first, then others maintain their order
    return benchPlayers.sort((a, b) => {
      if (a.position === 'GK' && b.position !== 'GK') return -1;
      if (a.position !== 'GK' && b.position === 'GK') return 1;
      return 0; // Maintain original order for non-GK players
    });
  }, [squadPlayers]);

  const handlePlayerClick = (player: Player | SquadPlayer) => {
    setSelectedPlayer(player);
    setShowPlayerDetails(true);
  };

  const handleSendToBench = () => {
    if (!selectedPlayer) return;
    
    // Only show substitution modal if player is in starting 11
    if (selectedPlayer.inStarting11) {
      // Convert Player to SquadPlayer if needed
      const squadPlayer = squadPlayers.find(p => p.id === selectedPlayer.id);
      if (squadPlayer) {
        setReverseSubstitutionPlayer(squadPlayer);
        setShowReverseSubstitutionModal(true);
        setShowPlayerDetails(false);
      }
      return;
    }
    
    // If player is already on bench, just close the modal
    setShowPlayerDetails(false);
    setSelectedPlayer(null);
  };

  const handleSubstituteClick = (player: SquadPlayer) => {
    const currentStarting11 = squadPlayers.filter((p) => p.inStarting11);
    
    // If starting 11 is full, show substitution modal
    if (currentStarting11.length >= 11) {
      setSubstitutionPlayer(player);
      setShowSubstitutionModal(true);
      return;
    }
    
    // Otherwise, use the regular move to starting 11 logic
    handleMoveToStarting11(player);
  };

  const validateSubstitution = (playerOut: SquadPlayer, playerIn: SquadPlayer, currentStarting11: SquadPlayer[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Goalkeeper rules: must always have exactly 1 GK
    if (playerOut.position === 'GK' && playerIn.position !== 'GK') {
      errors.push('Cannot replace goalkeeper with a non-goalkeeper. Must always have exactly 1 goalkeeper.');
      return { isValid: false, errors };
    }
    if (playerIn.position === 'GK' && playerOut.position !== 'GK') {
      errors.push('Cannot replace a non-goalkeeper with a goalkeeper. Must always have exactly 1 goalkeeper.');
      return { isValid: false, errors };
    }

    // Simulate the substitution to check formation rules
    const simulatedStarting11 = currentStarting11.map((p) => {
      if (p.id === playerOut.id) {
        return { ...p, position: playerIn.position };
      }
      return p;
    });

    // Count positions after substitution
    const counts = {
      GK: simulatedStarting11.filter((p) => p.position === 'GK').length,
      DEF: simulatedStarting11.filter((p) => p.position === 'DEF').length,
      MID: simulatedStarting11.filter((p) => p.position === 'MID').length,
      FWD: simulatedStarting11.filter((p) => p.position === 'FWD').length,
    };

    // Validate formation rules
    if (counts.GK !== 1) {
      errors.push('Starting 11 must have exactly 1 goalkeeper');
    }
    if (counts.DEF < 3 || counts.DEF > 5) {
      errors.push(`Starting 11 must have between 3 and 5 defenders (would have ${counts.DEF} after substitution)`);
    }
    if (counts.MID < 2 || counts.MID > 5) {
      errors.push(`Starting 11 must have between 2 and 5 midfielders (would have ${counts.MID} after substitution)`);
    }
    if (counts.FWD < 1 || counts.FWD > 3) {
      errors.push(`Starting 11 must have between 1 and 3 forwards (would have ${counts.FWD} after substitution)`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSubstitute = async (playerOut: SquadPlayer, playerIn: SquadPlayer) => {
    // Validate substitution using formation rules
    const validation = validateSubstitution(playerOut, playerIn, starting11);
    if (!validation.isValid) {
      toast.error(`Cannot perform substitution: ${validation.errors.join(', ')}`);
      return;
    }

    // Perform the substitution
    const updatedSquad = squadPlayers.map((p) => {
      if (p.id === playerOut.id) {
        return { ...p, inStarting11: false, onBench: true, squadPosition: "bench" as const };
      }
      if (p.id === playerIn.id) {
        return { ...p, inStarting11: true, onBench: false, squadPosition: "starting" as const };
      }
      return p;
    });

    // Final validation after substitution
    const finalValidation = validateMatchday11(updatedSquad);
    if (!finalValidation.isValid) {
      toast.error(`Cannot perform substitution: ${finalValidation.errors.join(', ')}`);
      return;
    }

    setSquadPlayers(updatedSquad);
    await persistLineup(updatedSquad);
    setShowSubstitutionModal(false);
    setSubstitutionPlayer(null);
  };

  const handleMoveToStarting11 = async (player: SquadPlayer) => {
    const currentStarting11 = squadPlayers.filter((p) => p.inStarting11);
    const currentBench = squadPlayers.filter((p) => p.onBench);
    
    // Check if we already have 11 players
    if (currentStarting11.length >= 11 && !player.inStarting11) {
      // If bench is full (4 players), we need to swap
      if (currentBench.length >= 4) {
        toast.error('Starting 11 is full and bench is full. You must swap players.');
        return;
      }
      toast.error('Starting 11 is full. Move a player to bench first.');
      return;
    }

    // If moving a GK to starting 11, ensure we don't end up with 2 GKs
    if (player.position === 'GK' && player.onBench) {
      const startingGK = squadPlayers.find(
        (p) => p.position === 'GK' && p.inStarting11
      );
      if (startingGK) {
        // Swap: move current starting GK to bench, move this GK to starting 11
        const updatedSquad = squadPlayers.map((p) => {
          if (p.id === player.id) {
            return { ...p, inStarting11: true, onBench: false, squadPosition: "starting" as const };
          }
          if (p.id === startingGK.id) {
            return { ...p, inStarting11: false, onBench: true, squadPosition: "bench" as const };
          }
          return p;
        });
        
        // Validate matchday 11 after swap (includes bench limit check)
        const validation = validateMatchday11(updatedSquad);
        if (!validation.isValid) {
          toast.error(`Cannot swap goalkeepers: ${validation.errors.join(', ')}`);
          return;
        }
        
        setSquadPlayers(updatedSquad);
        await persistLineup(updatedSquad);
        return;
      }
    }

    // If starting 11 is full, we need to swap with a bench player
    if (currentStarting11.length >= 11 && !player.inStarting11) {
      // Find a player in starting 11 to swap with
      // Prefer non-GK players if moving a non-GK, or handle GK swap above
      const playerToSwap = currentStarting11.find((p) => 
        p.position !== 'GK' || (player.position === 'GK' && p.position === 'GK')
      );
      
      if (playerToSwap) {
        // Swap players
        const updatedSquad = squadPlayers.map((p) => {
          if (p.id === player.id) {
            return { ...p, inStarting11: true, onBench: false, squadPosition: "starting" as const };
          }
          if (p.id === playerToSwap.id) {
            return { ...p, inStarting11: false, onBench: true, squadPosition: "bench" as const };
          }
          return p;
        });
        
        // Validate matchday 11 after swap
        const validation = validateMatchday11(updatedSquad);
        if (!validation.isValid) {
          toast.error(`Cannot swap players: ${validation.errors.join(', ')}`);
          return;
        }
        
        setSquadPlayers(updatedSquad);
        await persistLineup(updatedSquad);
        return;
      }
    }

    const updatedSquad = squadPlayers.map((p) =>
      p.id === player.id
        ? { ...p, inStarting11: true, onBench: false, squadPosition: "starting" as const }
        : p
    );

    // Validate matchday 11 after moving to starting (includes bench limit check)
    const validation = validateMatchday11(updatedSquad);
    if (!validation.isValid) {
      toast.error(`Cannot add player to starting 11: ${validation.errors.join(', ')}`);
      return;
    }

    setSquadPlayers(updatedSquad);
    await persistLineup(updatedSquad);
  };

  const handleAssignRole = async (role: PlayerRole) => {
    const target = roleMenuState.player ?? (selectedPlayer as SquadPlayer | null);
    if (!target) return;
    if (!target.inStarting11) {
      toast.error("Roles can only be assigned to starting players");
      return;
    }
    
    let updatedSquad: SquadPlayer[] = [];

    setSquadPlayers((prev) => {
      const targetPlayerId = target.id;
      const next = prev.map((p) => {
        // If assigning a role (not null), remove it from any other player who has it
        if (role !== null && p.role === role && p.id !== targetPlayerId) {
          return { ...p, role: null };
        }
        // Assign role to target player
        if (p.id === targetPlayerId) {
          return { ...p, role };
        }
        return p;
      });
      updatedSquad = next;
      return next;
    });
    
    setRoleMenuState({ isOpen: false, player: null, position: { x: 0, y: 0 } });
    setShowPlayerDetails(false);

    try {
      if (updatedSquad.length) {
        await syncRolesWithApi(updatedSquad);
      }
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to update roles. Please try again.";
      toast.error(message);
    }
  };

  const handleToggleSpecialist = async (type: "penalty" | "free-kick") => {
    const target = roleMenuState.player ?? (selectedPlayer as SquadPlayer | null);
    if (!target) return;
    if (!target.inStarting11) {
      toast.error("Roles can only be assigned to starting players");
      return;
    }

    let updatedSquad: SquadPlayer[] = [];

    setSquadPlayers((prev) => {
      const targetPlayerId = target.id;
      const next = prev.map((p) => {
        if (p.id === targetPlayerId) {
          return {
            ...p,
            isPenaltyTaker:
              type === "penalty" ? !p.isPenaltyTaker : p.isPenaltyTaker,
            isFreeKickTaker:
              type === "free-kick" ? !p.isFreeKickTaker : p.isFreeKickTaker,
          };
        }

        if (type === "penalty" && p.isPenaltyTaker) {
          return { ...p, isPenaltyTaker: false };
        }
        if (type === "free-kick" && p.isFreeKickTaker) {
          return { ...p, isFreeKickTaker: false };
        }
        return p;
      });

      updatedSquad = next;
      return next;
    });

    setRoleMenuState({ isOpen: false, player: null, position: { x: 0, y: 0 } });
    setShowPlayerDetails(false);

    try {
      if (updatedSquad.length) {
        await syncRolesWithApi(updatedSquad);
      }
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to update roles. Please try again.";
      toast.error(message);
    }
  };

  const handlePlayerRoleMenu = (player: SquadPlayer, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!player.inStarting11) {
      toast.error("Roles can only be assigned to starting players");
      return;
    }
    setRoleMenuState({
      isOpen: true,
      player,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleLoadMoreTransferPlayers = useCallback(() => {
    if (isLoadingTransferPlayers || !canLoadMoreTransferPlayers) return;
    fetchTransferPlayers({ page: transferPlayersPage + 1, append: true, search: transferSearchTerm });
  }, [isLoadingTransferPlayers, canLoadMoreTransferPlayers, fetchTransferPlayers, transferPlayersPage, transferSearchTerm]);

  const handleTransferSearch = useCallback((term: string) => {
    setTransferSearchTerm(term);
  }, []);

  const handleTransferOut = (player: Player) => {
    const squadPlayer = squadPlayers.find((p) => p.id === player.id);
    if (!squadPlayer) {
      toast.error("Player not in squad");
      return;
    }
    setPendingTransferOut(squadPlayer);
  };

  const handleTransferIn = async (player: Player) => {
    if (!pendingTransferOut) {
      toast.error("Select a player to transfer out first");
      return;
    }

    if (player.position !== pendingTransferOut.position) {
      toast.error(`Replacement must be a ${pendingTransferOut.position}`);
      return;
    }

    const currentSpent = squadPlayers.reduce((sum, p) => sum + p.price, 0);
    const newBudget = currentSpent - pendingTransferOut.price + player.price;
    if (newBudget > team.budget) {
      toast.error("Insufficient budget");
      return;
    }

    const transfersUsedThisWeek = transferHistory.filter(
      (t) => t.fixtureId === defaultFixtureId
    ).length;
    const TRANSFER_LIMIT = 4;
    if (transfersUsedThisWeek >= TRANSFER_LIMIT) {
      toast.error("Transfer limit for this gameweek reached (4)");
      return;
    }

    try {
      setIsProcessingTransfer(true);
      await teamApi.makeTransfers({
        fixtureId: defaultFixtureId,
        transfers: [
          {
            playerOutId: Number(pendingTransferOut.id),
            playerInId: Number(player.id),
          },
        ],
      });

      // Swap locally
      setSquadPlayers((prev) => {
        const next = prev
          .filter((p) => p.id !== pendingTransferOut.id)
          .concat({
            ...player,
            inSquad: true,
            inStarting11: pendingTransferOut.inStarting11,
            onBench: pendingTransferOut.onBench,
            squadPosition: pendingTransferOut.squadPosition,
            role: null,
            isPenaltyTaker: false,
            isFreeKickTaker: false,
          });
        return next;
      });

      setPendingTransferOut(null);
      await loadTransferHistory();
      toast.success("Transfer completed");
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to complete transfer.";
      toast.error(message);
    } finally {
      setIsProcessingTransfer(false);
    }
  };

  const allPlayersForSquad = useMemo(() => {
    const squadPlayerIds = new Set(squadPlayers.map((p) => p.id));
    return [
      ...squadPlayers,
      ...availablePlayers.filter((p) => !squadPlayerIds.has(p.id)),
    ];
  }, [squadPlayers, availablePlayers]);

  const availableForTransfer = useMemo(() => {
    const squadPlayerIds = new Set(squadPlayers.map((p) => p.id));
    const source = transferPlayers.length ? transferPlayers : availablePlayers;
    return source.filter((p) => !squadPlayerIds.has(p.id));
  }, [squadPlayers, availablePlayers, transferPlayers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-4">My Team</h1> */}
          <div className="flex justify-end">
            <div className="px-4 py-2 bg-[#F5EBEB] rounded-full">
              <span className="text-[#800000] font-semibold">
                ${(team.budget / 1000000).toFixed(1)}M Budget
              </span>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div className="p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {team.logo ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center text-white font-bold text-xl">
                {team.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {team.name}
              </h2>
              <div className="mt-1">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {team.points} points
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="flex space-x-6 border-b border-gray-200">
              {(["my-team", "transfers", "team-history"] as TabType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-1 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? "text-green-600 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab === "my-team"
                      ? "My Team"
                      : tab === "transfers"
                      ? "Transfers"
                      : "Team History"}
                  </button>
                )
              )}
            </div>
            {/* Appoint Starting 11 Button */}
            {activeTab === "my-team" && squadPlayers.length === 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    onAssignModalOpen?.();
                    setShowAssignModal(true);
                  }}
                  className="px-4 py-1 bg-[#4AA96C] text-white rounded-full font-semibold text-base"
                >
                  Appoint starting 11
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "my-team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Squad Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Layout: Squad Management on left, Pitch on right */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Squad Management */}
                <SquadManagement
                  players={bench}
                  onPlayerClick={handlePlayerClick}
                  onMoveToStarting11={handleSubstituteClick}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedPosition={localSelectedPosition}
                  onPositionChange={(val) => {
                    setLocalSelectedPosition(val);
                    onPositionChange?.(val);
                  }}
                  selectedCountry={selectedCountry}
                  onCountryChange={setSelectedCountry}
                />
                {/* Football Pitch */}
                <div className="">
                  <FootballPitch
                    starting11={starting11}
                    bench={bench}
                    onPlayerClick={handlePlayerClick}
                    onPlayerRoleMenu={handlePlayerRoleMenu}
                  />
                </div>
              </div>
            </div>

        {(isSavingLineup || isProcessingTransfer) && (
          <div className="mb-4 px-4 py-2 rounded-lg border border-[#F1F2F4] bg-white flex items-center gap-2 text-sm text-[#070A11]">
            <Spinner size={16} className="text-[#4AA96C]" />
            <span>{isSavingLineup ? "Updating lineup..." : "Processing transfer..."}</span>
          </div>
        )}

            {/* Right Column - Boosts and Fixtures */}
            <div className="space-y-6">
              {/* Boost/Fixture Tabs */}
              <div className="rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex space-x-6 border-b border-gray-200 mb-4">
                  {(["boosts", "fixtures"] as BoostTabType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveBoostTab(tab)}
                      className={`pb-3 px-1 font-medium text-sm transition-colors ${
                        activeBoostTab === tab
                          ? "text-green-600 border-b-2 border-green-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {tab === "boosts" ? "Team Boosts" : "Upcoming Fixtures"}
                    </button>
                  ))}
                </div>

                {activeBoostTab === "boosts" ? (
                  <TeamBoosts boosts={boosts} onUseBoost={handleUseBoost} isLoading={isLoadingBoosts} />
                ) : (
                  <UpcomingFixtures fixtures={fixtures} isLoading={isLoadingFixtures} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transfers Tab */}
        {activeTab === "transfers" && (
          <div className="space-y-4">
            <Transfers
              squadPlayers={squadPlayers}
              availablePlayers={availableForTransfer}
              budget={team.budget}
              pendingOut={pendingTransferOut}
              onClearPendingOut={() => setPendingTransferOut(null)}
              onTransferIn={handleTransferIn}
              onTransferOut={handleTransferOut}
              transfersUsed={transferHistory.filter((t) => t.fixtureId === defaultFixtureId).length}
              transferLimit={4}
              isLoadingAvailable={isLoadingTransferPlayers}
              onLoadMoreAvailable={handleLoadMoreTransferPlayers}
              canLoadMoreAvailable={canLoadMoreTransferPlayers}
              onSearchAvailable={handleTransferSearch}
              isTransferring={isProcessingTransfer}
            />

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Transfer History</h3>
                {isLoadingHistory && <span className="text-xs text-gray-500">Loading...</span>}
              </div>
              {transferHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No transfers yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-600">Out</th>
                        <th className="px-3 py-2 text-left text-gray-600">In</th>
                        <th className="px-3 py-2 text-left text-gray-600">Type</th>
                        <th className="px-3 py-2 text-left text-gray-600">Fixture</th>
                        <th className="px-3 py-2 text-left text-gray-600">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transferHistory.map((t) => (
                        <tr key={t.id}>
                          <td className="px-3 py-2 text-gray-800">{t.playerOutId ?? '—'}</td>
                          <td className="px-3 py-2 text-gray-800">{t.playerInId ?? '—'}</td>
                          <td className="px-3 py-2 text-gray-600">{t.type ?? 'TRANSFER'}</td>
                          <td className="px-3 py-2 text-gray-600">{t.fixtureId ?? '—'}</td>
                          <td className="px-3 py-2 text-gray-600">
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team History Tab */}
        {activeTab === "team-history" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Team History</h3>
              {isLoadingTeamHistory && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Spinner size={16} className="text-[#4AA96C]" />
                  <span>Loading...</span>
                </div>
              )}
            </div>

            {teamHistory.length === 0 && !isLoadingTeamHistory ? (
              <div className="text-center py-10 text-gray-500">
                <p>No history yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[#F1F2F4] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between text-xs text-[#656E81]">
                      <span className="px-2 py-1 rounded-full bg-[#F5EBEB] text-[#800000] font-semibold">
                        {item.matchDay}
                      </span>
                      <span className="px-2 py-1 rounded-full border border-[#F1F2F4] text-[#656E81]">
                        {item.date}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div>
                        <span className="text-[#656E81]">Captain </span>
                        <span className="font-semibold text-[#070A11]">{item.captain || "—"}</span>
                      </div>
                      <div>
                        <span className="text-[#656E81]">Vice Captain </span>
                        <span className="font-semibold text-[#070A11]">{item.viceCaptain || "—"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#070A11]">
                      <div>
                        <p className="text-xs text-[#656E81]">Points</p>
                        <p className="text-lg font-semibold text-[#800000]">{item.points ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#656E81]">Rank</p>
                        <p className="text-lg font-semibold text-[#800000]">{item.rank ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#656E81]">Transfers</p>
                        <p className="text-lg font-semibold text-[#800000]">{item.transfers ?? 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        <AssignStarting11Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          players={allPlayersForSquad}
          budget={team.budget}
          onSave={handleSaveSquad}
          onLoadMore={onLoadMorePlayers}
          canLoadMore={canLoadMorePlayers}
          isLoadingMore={isLoadingMorePlayers}
          onSearchChange={onSearchPlayers}
          onPositionChange={(val) => {
            setLocalSelectedPosition(val);
            onPositionChange?.(val);
          }}
          selectedPosition={localSelectedPosition}
          isLoadingList={isPlayersListLoading}
        />

        <PlayerDetailsModal
          isOpen={showPlayerDetails}
          onClose={() => {
            setShowPlayerDetails(false);
            setSelectedPlayer(null);
          }}
          player={selectedPlayer}
          onSendToBench={selectedPlayer?.inStarting11 ? handleSendToBench : undefined}
          onAssignRole={handleAssignRole}
          onTogglePenalty={() => handleToggleSpecialist("penalty")}
          onToggleFreeKick={() => handleToggleSpecialist("free-kick")}
          isOnBench={selectedPlayer?.onBench || false}
        />

        <PlayerRoleMenu
          isOpen={roleMenuState.isOpen}
          position={roleMenuState.position}
          onClose={() =>
            setRoleMenuState({ isOpen: false, player: null, position: { x: 0, y: 0 } })
          }
          onSendToBench={
            roleMenuState.player?.inStarting11
              ? () => {
                  if (roleMenuState.player) {
                    setReverseSubstitutionPlayer(roleMenuState.player);
                    setShowReverseSubstitutionModal(true);
                  }
                  setRoleMenuState({
                    isOpen: false,
                    player: null,
                    position: { x: 0, y: 0 },
                  });
                }
              : undefined
          }
          onAssignRole={handleAssignRole}
          onTogglePenalty={() => handleToggleSpecialist("penalty")}
          onToggleFreeKick={() => handleToggleSpecialist("free-kick")}
        />

        <SubstitutionModal
          isOpen={showSubstitutionModal}
          onClose={() => {
            setShowSubstitutionModal(false);
            setSubstitutionPlayer(null);
          }}
          benchPlayer={substitutionPlayer}
          starting11={starting11}
          onSubstitute={handleSubstitute}
          validateSubstitution={validateSubstitution}
        />

        <ReverseSubstitutionModal
          isOpen={showReverseSubstitutionModal}
          onClose={() => {
            setShowReverseSubstitutionModal(false);
            setReverseSubstitutionPlayer(null);
          }}
          playerOut={reverseSubstitutionPlayer}
          benchPlayers={bench}
          onSubstitute={handleSubstitute}
          validateSubstitution={validateSubstitution}
          currentStarting11={starting11}
        />
      </div>
    </div>
  );
};

export default MyTeamPage;
