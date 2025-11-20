'use client';

import React, { useState } from 'react';
import EmptyTeamState from '@/components/team/EmptyTeamState';
import CreateTeamModal from '@/components/team/CreateTeamModal';
import MyTeamPage from '@/components/team/MyTeamPage';
import { Team } from '@/types/team';

export default function TeamPage() {
  const [hasTeam, setHasTeam] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [team, setTeam] = useState<Team | null>(null);

  const handleCreateTeam = () => {
    setShowCreateModal(true);
  };

  const handleCreateTeamSubmit = (teamName: string, logo?: File) => {
    // Here you would make an API call to create the team
    // For now, we'll create a mock team
    const newTeam: Team = {
      id: '1',
      name: teamName,
      logo: logo ? URL.createObjectURL(logo) : undefined,
      points: 0,
      budget: 15800000, // $15.8M
      manager: 'Current User', // Would come from auth context
    };

    setTeam(newTeam);
    setHasTeam(true);
    setShowCreateModal(false);
  };

  const handleAppointStarting11 = () => {
    // Navigate to player selection page or open modal
    console.log('Appoint starting 11');
  };

  if (!hasTeam) {
    return (
      <>
        <EmptyTeamState onCreateTeam={handleCreateTeam} />
        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateTeam={handleCreateTeamSubmit}
        />
      </>
    );
  }

  if (!team) {
    return null;
  }

  return <MyTeamPage team={team} onAppointStarting11={handleAppointStarting11} />;
}

