'use client';

import { useMemo } from 'react';
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lightbulb } from 'lucide-react';
import SortableTeamItem from './SortableTeamItem';

interface GroupPredictions {
  [groupName: string]: string[]; // ordered list of team names [1st..4th]
}

interface GroupStageProps {
  predictions: GroupPredictions;
  onUpdate: (predictions: GroupPredictions) => void;
  onSave: () => void;
  onNextStage: () => void;
}

const tournamentGroups: Record<string, string[]> = {
  'Group A': ['Nigeria', 'Burundi', 'Senegal', 'Algeria'],
  'Group B': ['Libya', 'Togo', 'Kenya', 'Botswana'],
  'Group C': ['Sudan', 'Zimbabwe', 'Ethiopia', 'Somalia'],
  'Group D': ['Gabon', 'Liberia', 'Burkina Faso', 'Seychelles'],
  'Group E': ['Malawi', 'Angola', 'Eswatini', 'Zambia'],
  'Group F': ['Eritrea', 'Chad', 'Gambia', 'Niger']
};

const teamFlags: { [key: string]: string } = {
  'Nigeria': '🇳🇬', 'Burundi': '🇧🇮', 'Senegal': '🇸🇳', 'Algeria': '🇩🇿',
  'Libya': '🇱🇾', 'Togo': '🇹🇬', 'Kenya': '🇰🇪', 'Botswana': '🇧🇼',
  'Sudan': '🇸🇩', 'Zimbabwe': '🇿🇼', 'Ethiopia': '🇪🇹', 'Somalia': '🇸🇴',
  'Gabon': '🇬🇦', 'Liberia': '🇱🇷', 'Burkina Faso': '🇧🇫', 'Seychelles': '🇸🇨',
  'Malawi': '🇲🇼', 'Angola': '🇦🇴', 'Eswatini': '🇸🇿', 'Zambia': '🇿🇲',
  'Eritrea': '🇪🇷', 'Chad': '🇹🇩', 'Gambia': '🇬🇲', 'Niger': '🇳🇪'
};

const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export default function GroupStage({ predictions, onUpdate, onSave, onNextStage }: GroupStageProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const groups = useMemo(() => {
    const initial: GroupPredictions = {};
    Object.entries(tournamentGroups).forEach(([group, teams]) => {
      initial[group] = predictions[group] && predictions[group]!.length === 4 ? predictions[group]! : teams;
    });
    return initial;
  }, [predictions]);

  const isGroupComplete = (groupName: string) => groups[groupName].length === 4;
  const completedGroups = Object.keys(groups).filter(isGroupComplete);

  const handleReset = (groupName: string) => {
    const next = { ...groups, [groupName]: tournamentGroups[groupName] };
    onUpdate(next);
  };

  const handleSaveGroup = () => {
    // no-op: saving handled at page level, but keep for UX
    onUpdate({ ...groups });
  };

  const onDragEnd = (groupName: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const current = groups[groupName];
    const oldIndex = current.findIndex((t) => t === active.id);
    const newIndex = current.findIndex((t) => t === over.id);
    const reordered = arrayMove(current, oldIndex, newIndex);
    onUpdate({ ...groups, [groupName]: reordered });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Group Stage Predictions</h2>
          <p className="text-gray-600">Drag teams to rank them 1st to 4th in each group. Complete all groups to unlock Round of 16.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={onSave} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Save Predictions</button>
          {completedGroups.length === 6 && (
            <button onClick={onNextStage} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Next Stage &gt;</button>
          )}
        </div>
      </div>

      <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-orange-600 mr-2" />
          <p className="text-orange-800 text-sm"><strong>Tip:</strong> Complete all stages to unlock the full tournament prediction. Each stage unlocks after completing the previous one.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(groups).map((groupName) => {
          const items = groups[groupName];
          const isComplete = isGroupComplete(groupName);

          return (
            <div key={groupName} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{groupName}</h3>
                {isComplete && <div className="w-3 h-3 bg-green-500 rounded-full" />}
              </div>
              <p className="text-sm text-gray-600 mb-4">Rank teams 1st to 4th place</p>

              <DndContext sensors={sensors} onDragEnd={onDragEnd(groupName)}>
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 mb-6">
                    {items.map((team, index) => (
                      <SortableTeamItem
                        key={team}
                        id={team}
                        position={index + 1}
                        teamName={team}
                        flag={teamFlags[team]}
                        badge={getOrdinal(index + 1)}
                        highlight={isComplete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="flex space-x-2">
                <button onClick={() => handleReset(groupName)} className="flex-1 px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">Reset Group</button>
                <button onClick={handleSaveGroup} className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Save Group</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
