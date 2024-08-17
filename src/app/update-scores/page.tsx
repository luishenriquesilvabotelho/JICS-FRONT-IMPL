"use client";
import React, { useState } from 'react';
import api from '../api/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Match {
  _id: string;
  teamA: { _id: string, name: string };
  teamB: { _id: string, name: string };
  scoreA: number;
  scoreB: number;
}

interface UpdateScoreProps {
  match: Match;
  onUpdate: () => void;
}

const UpdateScore: React.FC<UpdateScoreProps> = ({ match, onUpdate }) => {
  const [scoreA, setScoreA] = useState<number>(match.scoreA);
  const [scoreB, setScoreB] = useState<number>(match.scoreB);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found');
      return;
  }

    try {
      
      await api.post(`/teams/matches/${match._id}/score`, { scoreA, scoreB }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
      setMessage('Score updated successfully!');
      onUpdate();
    } catch (error: any) {
      setMessage(error.response?.data.message || 'Error updating score');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="scoreA">Score A</Label>
          <Input
            id="scoreA"
            type="number"
            value={scoreA}
            onChange={(e) => setScoreA(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="scoreB">Score B</Label>
          <Input
            id="scoreB"
            type="number"
            value={scoreB}
            onChange={(e) => setScoreB(Number(e.target.value))}
            className="flex-1"
          />
        </div>
        <Button type="submit" className="w-full">Update Score</Button>
      </form>
      {message && <p className="mt-2 text-center text-green-600">{message}</p>}
    </div>

  );
};

export default UpdateScore;
