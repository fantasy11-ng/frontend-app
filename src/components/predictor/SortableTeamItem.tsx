'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { GripVertical } from 'lucide-react';

interface SortableTeamItemProps {
  id: string;
  position: number;
  teamName: string;
  teamLogo?: string;
  teamShort?: string;
  badge: string; // e.g., '1st'
  highlight?: boolean;
}

export default function SortableTeamItem({ id, position, teamName, badge, highlight }: SortableTeamItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center p-3 rounded-xl border ${
        highlight ? 'border-[#D4D7DD]' : 'border-gray-200'
      } ${isDragging ? 'opacity-70 shadow-md' : ''}`}
    >
      <button
        className="mr-3 cursor-grab active:cursor-grabbing text-gray-400"
        {...attributes}
        {...listeners}
        aria-label={`Drag ${teamName}`}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="w-8 h-8 bg-[#800000] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
        {position}
      </div>

      <div className="flex items-center flex-1">
        {/* {teamLogo ? (
          <div className="w-8 h-8 mr-2 flex-shrink-0">
            <Image
              src={teamLogo}
              alt={teamName}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            {teamShort || teamName.charAt(0)}
          </div>
        )} */}
        <span className="font-medium text-gray-900">{teamName}</span>
      </div>

      <div className="bg-[#F5EBEB] text-[#800000] px-2 py-1 rounded-full text-xs font-medium">
        {badge}
      </div>
    </div>
  );
}
