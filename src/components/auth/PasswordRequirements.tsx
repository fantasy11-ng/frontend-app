'use client';

import { Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
}

export default function PasswordRequirements({ requirements }: PasswordRequirementsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {requirements.map((req, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm">
          {req.met ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <X className="w-4 h-4 text-red-600" />
          )}
          <span className={req.met ? 'text-gray-900' : 'text-gray-600'}>
            {req.label}
          </span>
        </div>
      ))}
    </div>
  );
}

