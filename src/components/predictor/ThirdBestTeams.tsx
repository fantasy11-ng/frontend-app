/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Check, Loader2, Crown } from 'lucide-react';
import { useThirdPlacedQualifiers } from '@/lib/api';
import { predictorApi } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Group } from '@/types/predictor';

interface ThirdBestTeamsProps {
  predictions: string[]; // selected team names
  groupStage: { [groupName: string]: string[] }; // group stage results
  groups: Group[]; // actual group data with team IDs
  onUpdate: (teams: string[]) => void;
  onSave: () => void;
  onNextStage: () => void | Promise<void>;
  isSubmitting?: boolean;
}

// Team flags
const teamFlags: { [key: string]: string } = {
  'Nigeria': '🇳🇬', 'Burundi': '🇧🇮', 'Senegal': '🇸🇳', 'Algeria': '🇩🇿',
  'Libya': '🇱🇾', 'Togo': '🇹🇬', 'Kenya': '🇰🇪', 'Botswana': '🇧🇼',
  'Sudan': '🇸🇩', 'Zimbabwe': '🇿🇼', 'Ethiopia': '🇪🇹', 'Somalia': '🇸🇴',
  'Gabon': '🇬🇦', 'Liberia': '🇱🇷', 'Burkina Faso': '🇧🇫', 'Seychelles': '🇸🇨',
  'Malawi': '🇲🇼', 'Angola': '🇦🇴', 'Eswatini': '🇸🇿', 'Zambia': '🇿🇲',
  'Eritrea': '🇪🇷', 'Chad': '🇹🇩', 'Gambia': '🇬🇲', 'Niger': '🇳🇪'
};

export default function ThirdBestTeams({ 
  predictions, 
  groupStage, 
  groups,
  onUpdate, 
  onNextStage,
  isSubmitting = false
}: ThirdBestTeamsProps) {
  const queryClient = useQueryClient();
  const { data: savedRanking = [], isLoading: isLoadingSaved } = useThirdPlacedQualifiers(true);
  const [selectedTeams, setSelectedTeams] = useState<string[]>(predictions);

  // Create a map of team name to team ID
  const teamNameToIdMap = useMemo(() => {
    const map: Record<string, number> = {};
    groups.forEach((group) => {
      group.teams.forEach((team) => {
        map[team.name] = team.id;
      });
    });
    return map;
  }, [groups]);

  // Create a map of team ID to team name
  const teamIdToNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    groups.forEach((group) => {
      group.teams.forEach((team) => {
        map[team.id] = team.name;
      });
    });
    return map;
  }, [groups]);

  // Load saved ranking when it's available
  useEffect(() => {
    // Only load if we have groups data and saved ranking, and no current selection
    if (groups.length > 0 && savedRanking.length > 0 && selectedTeams.length === 0 && predictions.length === 0) {
      // Convert team IDs to team names
      const teamNames = savedRanking
        .map((teamId) => teamIdToNameMap[teamId])
        .filter((name): name is string => !!name);
      
      if (teamNames.length > 0) {
        setSelectedTeams(teamNames);
        onUpdate(teamNames);
      }
    }
  }, [savedRanking, teamIdToNameMap, selectedTeams.length, predictions.length, groups.length, onUpdate]);

  // Get all 3rd place teams from completed groups
  const getThirdPlaceTeams = () => {
    const thirdPlaceTeams: { team: string; group: string }[] = [];
    
    Object.entries(groupStage).forEach(([groupName, teams]) => {
      if (teams.length === 4) {
        const thirdPlaceTeam = teams[2]; // 3rd place (index 2)
        thirdPlaceTeams.push({ team: thirdPlaceTeam, group: groupName });
      }
    });
    
    return thirdPlaceTeams;
  };

  const thirdPlaceTeams = getThirdPlaceTeams();
  const isComplete = selectedTeams.length === 4;

  const handleTeamToggle = (teamName: string) => {
    if (selectedTeams.includes(teamName)) {
      // Remove team
      const newSelection = selectedTeams.filter(team => team !== teamName);
      setSelectedTeams(newSelection);
      onUpdate(newSelection);
    } else if (selectedTeams.length < 4) {
      // Add team (only if less than 4 selected)
      const newSelection = [...selectedTeams, teamName];
      setSelectedTeams(newSelection);
      onUpdate(newSelection);
    }
  };

  const handleReset = () => {
    setSelectedTeams([]);
    onUpdate([]);
  };

  const handleSave = async () => {
    if (selectedTeams.length !== 4) {
      toast.error('Please select exactly 4 teams');
      return;
    }

    try {
      // Convert team names to team IDs
      const teamIds = selectedTeams
        .map((teamName) => teamNameToIdMap[teamName])
        .filter((id): id is number => !!id);

      if (teamIds.length !== 4) {
        toast.error('Some teams could not be found. Please try again.');
        return;
      }

      await predictorApi.saveThirdPlacedQualifiers({
        ranking: teamIds,
      });

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['predictor', 'third-placed-qualifiers'] });

      toast.success('Third-placed qualifiers saved successfully!');
    } catch (error: any) {
      console.error('Error saving third-placed qualifiers:', error);
      toast.error(error?.response?.data?.message || 'Failed to save selection. Please try again.');
    }
  };

  const handleNext = async () => {
    if (selectedTeams.length !== 4) {
      toast.error('Please select exactly 4 teams before proceeding');
      return;
    }

    // Save before moving to next stage
    try {
      const teamIds = selectedTeams
        .map((teamName) => teamNameToIdMap[teamName])
        .filter((id): id is number => !!id);

      if (teamIds.length !== 4) {
        toast.error('Some teams could not be found. Please try again.');
        return;
      }

      await predictorApi.saveThirdPlacedQualifiers({
        ranking: teamIds,
      });

      await queryClient.invalidateQueries({ queryKey: ['predictor', 'third-placed-qualifiers'] });

      toast.success('Third-placed qualifiers submitted successfully!');
      
      // Move to next stage
      if (onNextStage) {
        await onNextStage();
      }
    } catch (error: any) {
      console.error('Error submitting third-placed qualifiers:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit selection. Please try again.');
    }
  };

  if (isLoadingSaved) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-medium text-[#070A11]">
            3rd Best Teams Selection
          </h2>
          <p className="text-[#656E81] text-sm">
            Select 4 teams from the 3rd place finishers to complete the Round of 16 lineup.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#4AA96C] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
          >
            Save Predictions
          </button>
          {isComplete && (
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#4AA96C] text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold text-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Next Stage'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tip Banner */}
      <div className="bg-[#FFEDD9] border border-[#FE5E41] rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-[#FE5E41] mr-2" />
          <p className="text-[#FE5E41] text-sm">
            <strong>Tip:</strong> Select exactly 4 teams from the 3rd place finishers. These teams will join the 12 group winners and runners-up to complete the 16-team Round of 16.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Teams Selected: {selectedTeams.length}/4
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((selectedTeams.length / 4) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#4AA96C] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(selectedTeams.length / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {thirdPlaceTeams.map(({ team, group }) => {
          const isSelected = selectedTeams.includes(team);
          const canSelect = selectedTeams.length < 4 || isSelected;
          
          return (
            <button
              key={team}
              onClick={() => handleTeamToggle(team)}
              disabled={!canSelect}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[#4AA96C] bg-green-50'
                  : canSelect
                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{teamFlags[team]}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{team}</div>
                    <div className="text-sm text-gray-500">{group}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Teams Summary */}
      {selectedTeams.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Teams ({selectedTeams.length}/4)
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedTeams.map((team) => (
              <div
                key={team}
                className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200"
              >
                <span className="text-lg">{teamFlags[team]}</span>
                <span className="font-medium text-gray-900">{team}</span>
                <button
                  onClick={() => handleTeamToggle(team)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleReset}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset Selection
        </button>
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Selection
        </button>
      </div>
    </div>
  );
}
