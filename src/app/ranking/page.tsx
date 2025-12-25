"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GlobalRankingsTable from "@/components/ranking/GlobalRankingsTable";
// import AthleteRankingsTable from "@/components/ranking/AthleteRankingsTable";
import { GlobalRanking } from "@/types/ranking";
import { leaderboardApi } from "@/lib/api";
import { Spinner } from "@/components/common/Spinner";
import NoTeamModal from "@/components/common/NoTeamModal";
import { ProtectedRoute } from "@/components/auth";

// Mock global rankings data for testing pagination and sorting
const mockGlobalRankings: GlobalRanking[] = [
];

// Set to true to test with mock data
const USE_MOCK_DATA = false;

type TabType = "global" | "athlete";

function RankingPageContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("global");
  const [globalRankings, setGlobalRankings] = useState<GlobalRanking[]>([]);
  const [loadingGlobal, setLoadingGlobal] = useState<boolean>(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showNoTeamModal, setShowNoTeamModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [meta, setMeta] = useState<{
    totalPages?: number;
    totalItems?: number;
    itemsPerPage?: number;
  }>();
  const ready = true;
  const PAGE_SIZE = 20;

  useEffect(() => {
    let isMounted = true;

    const fetchGlobalLeaderboard = async (page: number) => {
      setLoadingGlobal(true);
      setGlobalError(null);
      
      // Use mock data for testing
      if (USE_MOCK_DATA) {
        if (isMounted) {
          setGlobalRankings(mockGlobalRankings);
          setLoadingGlobal(false);
        }
        return;
      }
      
      try {
        const { items, meta: responseMeta } = await leaderboardApi.getGlobalLeaderboard({
          page,
          limit: PAGE_SIZE,
        });
        if (isMounted) {
          setGlobalRankings(items);
          setMeta({
            totalPages: responseMeta?.totalPages ?? undefined,
            totalItems: responseMeta?.totalItems ?? undefined,
            itemsPerPage: responseMeta?.itemsPerPage ?? PAGE_SIZE,
          });
        }
      } catch (error) {
        const errorResponse = error as {
          response?: { data?: { message?: string; error?: { message?: string } } };
          message?: string;
        };
        const message =
          errorResponse?.response?.data?.error?.message ??
          errorResponse?.response?.data?.message ??
          errorResponse?.message ??
          "Failed to load global leaderboard.";
        
        // Check if the error is because user doesn't have a team
        const isNoTeamError = message.toLowerCase().includes("fantasy team not found") ||
          message.toLowerCase().includes("team not found");
        
        if (isMounted) {
          if (isNoTeamError) {
            setShowNoTeamModal(true);
            setGlobalError(null);
          } else {
            setGlobalError(message);
          }
          setGlobalRankings([]);
          setMeta(undefined);
        }
      } finally {
        if (isMounted) {
          setLoadingGlobal(false);
        }
      }
    };

    fetchGlobalLeaderboard(currentPage);

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  return (
    <>
      <NoTeamModal 
        isOpen={showNoTeamModal} 
        onGoBack={() => router.push("/")}
      />
      {ready ? (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-[1440px] px-4 md:px-12 mx-auto py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ranking</h1>
            </div>

            <div className="mb-8">
              <div className="flex space-x-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("global")}
                  className={`pb-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === "global"
                      ? "text-gray-900 border-b-2 border-green-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Global Rankings
                </button>
                {/* <button
                  onClick={() => setActiveTab("athlete")}
                  className={`pb-4 px-1 text-sm font-medium transition-colors ${
                    activeTab === "athlete"
                      ? "text-gray-900 border-b-2 border-green-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Athlete Rankings
                </button> */}
              </div>
            </div>

            <div>
              {activeTab === "global" && (
                <>
                  {loadingGlobal ? (
                    <div className="flex justify-center py-10">
                      <Spinner size={24} className="text-[#4AA96C]" />
                    </div>
                  ) : globalError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {globalError}
                    </div>
                  ) : globalRankings.length === 0 ? (
                    <p className="text-sm text-[#656E81]">
                      No global leaderboard data available.
                    </p>
                  ) : (
                    <GlobalRankingsTable
                      rankings={globalRankings}
                      itemsPerPage={meta?.itemsPerPage ?? PAGE_SIZE}
                      currentPage={currentPage}
                      totalPages={meta?.totalPages}
                      totalItems={meta?.totalItems}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
              {/* {activeTab === "athlete" && (
                <AthleteRankingsTable rankings={mockAthleteRankings} />
              )} */}
            </div>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default function RankingPage() {
  return (
    <ProtectedRoute>
      <RankingPageContent />
    </ProtectedRoute>
  );
}
