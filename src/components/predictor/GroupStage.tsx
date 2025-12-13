/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQueryClient } from '@tanstack/react-query';
import { Crown, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Group, Team } from '@/types/predictor';
import { predictorApi } from '@/lib/api';
import SortableTeamItem from './SortableTeamItem';

interface GroupPredictions {
  [groupName: string]: string[]; // ordered list of team names [1st..4th]
}

interface GroupStageProps {
  groups: Group[];
  predictions: GroupPredictions;
  onUpdate: (predictions: GroupPredictions) => void;
  onSave: () => void;
  onNextStage: () => void;
  stageId?: number; // Stage ID for group stage (default: 1)
}

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export default function GroupStage({ groups, predictions, onUpdate, onSave, onNextStage, stageId = 1 }: GroupStageProps) {
  const [savingGroupId, setSavingGroupId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // Track saved state for each group (what was last saved to API)
  // Also track locally saved states to handle immediate updates
  const [locallySavedStates, setLocallySavedStates] = useState<GroupPredictions>({});
  
  const savedGroupStates = useMemo(() => {
    const saved: GroupPredictions = { ...locallySavedStates };
    groups.forEach((group) => {
      if (group.myPrediction) {
        if (Array.isArray(group.myPrediction)) {
          saved[group.name] = group.myPrediction;
        } else if (group.myPrediction && typeof group.myPrediction === 'object' && 'teams' in group.myPrediction) {
          const orderedTeams = [...group.myPrediction.teams]
            .sort((a, b) => a.index - b.index)
            .map((t) => t.name);
          saved[group.name] = orderedTeams;
        }
      }
    });
    return saved;
  }, [groups, locallySavedStates]);

  // Create a map of group name to teams for easy lookup
  const groupTeamsMap = useMemo(() => {
    const map: Record<string, Team[]> = {};
    groups.forEach((group) => {
      map[group.name] = group.teams;
    });
    return map;
  }, [groups]);

  // Create a map of group name to group for easy lookup
  const groupMap = useMemo(() => {
    const map: Record<string, Group> = {};
    groups.forEach((group) => {
      map[group.name] = group;
    });
    return map;
  }, [groups]);

  // Initialize groups with predictions or default team order
  const initializedGroups = useMemo(() => {
    const initial: GroupPredictions = {};
    groups.forEach((group) => {
      // Use existing prediction from local state if available and complete
      if (predictions[group.name] && Array.isArray(predictions[group.name]) && predictions[group.name]!.length === 4) {
        initial[group.name] = predictions[group.name]!;
      } else if (group.myPrediction) {
        // Handle myPrediction - can be either string[] or GroupPredictionResponse object
        if (Array.isArray(group.myPrediction)) {
          // Old format: array of team names
          initial[group.name] = group.myPrediction;
        } else if (group.myPrediction && typeof group.myPrediction === 'object' && 'teams' in group.myPrediction) {
          // New format: GroupPredictionResponse object with teams array
          const orderedTeams = [...group.myPrediction.teams]
            .sort((a, b) => a.index - b.index)
            .map((t) => t.name);
          initial[group.name] = orderedTeams;
        } else {
          // Fallback to default team order
          initial[group.name] = group.teams.map((team) => team.name);
        }
      } else {
        // No prediction available, use default team order
        initial[group.name] = group.teams.map((team) => team.name);
      }
    });
    return initial;
  }, [groups, predictions]);

  // Create a map of team name to team data for logo lookup
  const teamDataMap = useMemo(() => {
    const map: Record<string, Team> = {};
    groups.forEach((group) => {
      group.teams.forEach((team) => {
        map[team.name] = team;
      });
    });
    return map;
  }, [groups]);

  const isGroupComplete = (groupName: string) => initializedGroups[groupName]?.length === 4;
  const completedGroups = Object.keys(initializedGroups).filter(isGroupComplete);

  // Check if a group has unsaved changes
  const hasUnsavedChanges = (groupName: string): boolean => {
    const current = predictions[groupName] || initializedGroups[groupName] || [];
    const saved = savedGroupStates[groupName] || [];
    
    // If no saved state exists, there are changes if current is complete
    if (saved.length === 0) {
      return current.length === 4;
    }
    
    // Compare current with saved state
    if (current.length !== saved.length) {
      return true;
    }
    
    // Check if order has changed
    return current.some((team, index) => team !== saved[index]);
  };

  const handleReset = (groupName: string) => {
    const defaultOrder = groupTeamsMap[groupName]?.map((team) => team.name) || [];
    // Update with reset order, merging with existing predictions
    const updated = { ...predictions, [groupName]: defaultOrder };
    onUpdate(updated);
  };

  const handleSaveGroup = async (groupName: string) => {
    const group = groupMap[groupName];
    if (!group) return;

    // Use current predictions state (from props) to ensure we have the latest
    const teamNames = predictions[groupName] || initializedGroups[groupName];
    if (!teamNames || teamNames.length !== 4) {
      toast.error('Please rank all 4 teams before saving');
      return;
    }

    setSavingGroupId(group.id);

    try {
      // Build teams array with index based on position (0 = 1st, 1 = 2nd, etc.)
      const teams = teamNames.map((teamName, index) => {
        const team = teamDataMap[teamName];
        if (!team) {
          throw new Error(`Team ${teamName} not found`);
        }
        return {
          id: team.id,
          index: index,
        };
      });

      // Get winner (1st place) and runner-up (2nd place) IDs
      const winnerId = teams[0].id;
      const runnerUpId = teams[1].id;

      // Call API to save prediction
      await predictorApi.saveGroupPrediction({
        teams,
        stageId,
        groupId: group.id,
        winnerId,
        runnerUpId,
      });

      // Invalidate and refetch groups to get updated predictions
      await queryClient.invalidateQueries({ queryKey: ['predictor', 'groups'] });
      await queryClient.invalidateQueries({ queryKey: ['predictor', 'stage', stageId] });

      // Update local predictions with saved data
      const updated = { ...predictions, [groupName]: teamNames };
      onUpdate(updated);

      // Update locally saved state immediately
      setLocallySavedStates(prev => ({
        ...prev,
        [groupName]: [...teamNames] // Create a copy to avoid reference issues
      }));

      // Invalidate groups query to refresh savedGroupStates
      await queryClient.invalidateQueries({ queryKey: ['predictor', 'groups'] });

      toast.success(`${groupName} prediction saved successfully!`);
    } catch (error: any) {
      console.error('Error saving group prediction:', error);
      toast.error(error?.response?.data?.message || 'Failed to save prediction. Please try again.');
    } finally {
      setSavingGroupId(null);
    }
  };

  const handleSaveAllGroups = async () => {
    // Save all completed groups
    const incompleteGroups = groups.filter(
      (group) => !isGroupComplete(group.name)
    );

    if (incompleteGroups.length > 0) {
      toast.error('Please complete all groups before saving');
      return;
    }

    // Save all groups sequentially
    for (const group of groups) {
      await handleSaveGroup(group.name);
    }

    onSave();
  };

  const onDragEnd = (groupName: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Use current predictions state (from props) to ensure we have the latest
    const current = predictions[groupName] || initializedGroups[groupName] || [];
    const oldIndex = current.findIndex((t) => t === active.id);
    const newIndex = current.findIndex((t) => t === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    const reordered = arrayMove(current, oldIndex, newIndex);
    // Update with the new order, merging with existing predictions
    const updated = { ...predictions, [groupName]: reordered };
    onUpdate(updated);
  };

  if (groups.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h2 className="text-base font-medium text-[#070A11]">Group Stage Predictions</h2>
          <p className="text-[#656E81] text-sm mb-3">Drag teams to rank them 1st to 4th in each group. Complete all groups to unlock 3rd Best Teams selection.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSaveAllGroups} 
            className="h-10 px-3 w-fit bg-[#4AA96C] text-sm text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
            disabled={completedGroups.length !== groups.length || savingGroupId !== null}
          >
            {savingGroupId !== null && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Predictions
          </button>
          {completedGroups.length === groups.length && (
            <button onClick={onNextStage} className="px-4 text-sm py-2 bg-[#4AA96C] text-white rounded-full transition-colors font-semibold">Next Stage</button>
          )}
        </div>
      </div>

      <div className="bg-[#FFEDD9] border border-[#FE5E41] rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Crown className="w-5 h-5 text-[#FE5E41] mr-2" />
          <p className="text-[#FE5E41] text-sm"><strong>Tip:</strong> Complete all stages to unlock the full tournament prediction. Each stage unlocks after completing the previous one.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const items = initializedGroups[group.name] || [];
          const isComplete = isGroupComplete(group.name);

          return (
            <div key={group.id} className="border border-[#F1F2F4] active:border-[#4AA96C] hover:border-[#4AA96C] rounded-xl p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-[#070A11]">{group.name}</h3>
                {isComplete && <div className="w-3 h-3 bg-green-500 rounded-full" />}
              </div>
              <p className="text-sm text-[#656E81] mb-4">Rank teams 1st to 4th place</p>

              <DndContext sensors={sensors} onDragEnd={onDragEnd(group.name)}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 mb-6">
                    {items?.map((teamName, index) => {
                      const team = teamDataMap[teamName];
                      return (
                        <SortableTeamItem
                          key={teamName}
                          id={teamName}
                          position={index + 1}
                          teamName={teamName}
                          teamLogo={team?.logo}
                          teamShort={team?.short}
                          badge={getOrdinal(index + 1)}
                          highlight={isComplete}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleReset(group.name)} 
                  className="flex-1 px-2 text-sm py-2 border border-[#4AA96C] text-[#4AA96C] rounded-full hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  disabled={savingGroupId === group.id}
                >
                  Reset Group
                </button>
                <button 
                  onClick={() => handleSaveGroup(group.name)} 
                  className="flex-1 px-2 py-2 bg-green-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-sm"
                  disabled={savingGroupId === group.id || !isComplete || !hasUnsavedChanges(group.name)}
                >
                  {savingGroupId === group.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save Group'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
