import { useQuery } from '@tanstack/react-query';
import { predictorApi } from '../predictor';
import { Group, GroupPredictionResponse } from '@/types/predictor';
import type {
  Stage,
  RoundCode,
  BracketSeedFixture,
  BracketPrediction,
  CompetitionData,
} from '@/types/predictorStage';

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ['predictor', 'groups'],
    queryFn: () => predictorApi.getGroups(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useStages() {
  return useQuery<Stage[]>({
    queryKey: ['predictor', 'stages'],
    queryFn: () => predictorApi.getStages(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useStagePredictions(stageId: number, enabled: boolean) {
  return useQuery<GroupPredictionResponse[]>({
    queryKey: ['predictor', 'stage', stageId],
    queryFn: () => predictorApi.getStagePredictions(stageId),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ----- Bracket hooks -----

export function useBracketSeed(roundCode: RoundCode, enabled = true) {
  return useQuery<BracketSeedFixture[]>({
    queryKey: ['predictor', 'bracket', roundCode, 'seed'],
    queryFn: () => predictorApi.getBracketSeed(roundCode),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useBracketPredictions(roundCode: RoundCode, enabled = true) {
  return useQuery<BracketPrediction[]>({
    queryKey: ['predictor', 'bracket', roundCode, 'me'],
    queryFn: () => predictorApi.getBracketPredictions(roundCode),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ----- Third-placed qualifiers hooks -----

export function useThirdPlacedQualifiers(enabled = true) {
  return useQuery<number[]>({
    queryKey: ['predictor', 'third-placed-qualifiers', 'me'],
    queryFn: () => predictorApi.getThirdPlacedQualifiers(),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ----- Third-place match hooks -----

export function useThirdPlaceMatchSeed(enabled = true) {
  return useQuery<BracketSeedFixture[]>({
    queryKey: ['predictor', 'bracket', 'third-place', 'seed'],
    queryFn: () => predictorApi.getThirdPlaceMatchSeed(),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useThirdPlaceMatchPrediction(enabled = true) {
  return useQuery<BracketPrediction[]>({
    queryKey: ['predictor', 'bracket', 'third-place', 'me'],
    queryFn: () => predictorApi.getThirdPlaceMatchPrediction(),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ----- Competition hooks -----

export function useCompetition(enabled = true) {
  return useQuery<CompetitionData>({
    queryKey: ['predictor', 'competition'],
    queryFn: () => predictorApi.getCompetition(),
    enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}



