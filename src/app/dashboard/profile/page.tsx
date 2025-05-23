'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';

interface PlayerProfile {
  fideId: string;
  eloRating: number;
  dateOfBirth: string;
  titleName: string | null;
}

interface ArbiterProfile {
  experienceLevel: string;
}

interface CoachProfile {
  teamName: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<PlayerProfile | ArbiterProfile | CoachProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: '',
    surname: '',
    nationality: '',
    // Player-specific
    eloRating: '',
    // Arbiter-specific
    experienceLevel: '',
  });

  // Check if user has profile fields (not Manager)
  const hasProfileFields = user?.userType !== UserType.MANAGER;
  const userName = user && hasProfileFields && 'name' in user ? user.name : '';
  const userSurname = user && hasProfileFields && 'surname' in user ? user.surname : '';
  const userNationality = user && hasProfileFields && 'nationality' in user ? user.nationality : '';

  // Fetch profile data based on user type
  useEffect(() => {
    if (!user) return;
    
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        let endpoint = '';
        
        if (user.userType === UserType.PLAYER) {
          // Get player-specific data
          const response = await fetch('/api/profile/player');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setProfileData(data.profile);
            }
          }
        } else if (user.userType === UserType.ARBITER) {
          // Get arbiter-specific data
          const response = await fetch('/api/profile/arbiter');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setProfileData(data.profile);
            }
          }
        } else if (user.userType === UserType.COACH) {
          // Get coach's team data
          const response = await fetch('/api/teams/coach');
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setProfileData({
                teamName: data.team?.team_name || null,
              });
            }
          }
        }
        
        // Initialize edit form with current user data
        setEditForm({
          name: userName || '',
          surname: userSurname || '',
          nationality: userNationality || '',
          eloRating: '',
          experienceLevel: '',
        });
        
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, userName, userSurname, userNationality]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't allow editing for managers
    if (user?.userType === UserType.MANAGER) {
      setError('Manager profiles cannot be edited from this interface');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          surname: editForm.surname,
          nationality: editForm.nationality,
          ...(user?.userType === UserType.PLAYER && editForm.eloRating && {
            eloRating: parseInt(editForm.eloRating)
          }),
          ...(user?.userType === UserType.ARBITER && editForm.experienceLevel && {
            experienceLevel: editForm.experienceLevel
          }),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Profile updated successfully');
        setEditing(false);
        // Refresh the page to get updated data
        window.location.reload();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-4">Please log in to view your profile</div>;
  }

  if (loading && !profileData) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {!editing && hasProfileFields && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          {editing && hasProfileFields ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={editForm.surname}
                  onChange={(e) => setEditForm({...editForm, surname: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input
                  type="text"
                  value={editForm.nationality}
                  onChange={(e) => setEditForm({...editForm, nationality: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              {user.userType === UserType.PLAYER && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ELO Rating</label>
                  <input
                    type="number"
                    value={editForm.eloRating}
                    onChange={(e) => setEditForm({...editForm, eloRating: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    max="3000"
                  />
                </div>
              )}

              {user.userType === UserType.ARBITER && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    value={editForm.experienceLevel}
                    onChange={(e) => setEditForm({...editForm, experienceLevel: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select experience level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{user.username}</span>
              </div>
              {hasProfileFields && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Name:</span>
                    <span className="font-medium">{userName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Name:</span>
                    <span className="font-medium">{userSurname || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nationality:</span>
                    <span className="font-medium">{userNationality || 'N/A'}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{user.userType}</span>
              </div>
            </div>
          )}
        </div>

        {/* Role-specific Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            {user.userType === UserType.PLAYER && 'Player Information'}
            {user.userType === UserType.COACH && 'Team Information'}
            {user.userType === UserType.ARBITER && 'Arbiter Information'}
            {user.userType === UserType.MANAGER && 'Manager Information'}
          </h2>
          
          {user.userType === UserType.PLAYER && profileData && 'fideId' in profileData && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">FIDE ID:</span>
                <span className="font-medium">{profileData.fideId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ELO Rating:</span>
                <span className="font-medium">{profileData.eloRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium">{profileData.titleName || 'No title'}</span>
              </div>
            </div>
          )}

          {user.userType === UserType.COACH && profileData && 'teamName' in profileData && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Team:</span>
                <span className="font-medium">{profileData.teamName || 'No team assigned'}</span>
              </div>
            </div>
          )}

          {user.userType === UserType.ARBITER && profileData && 'experienceLevel' in profileData && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience Level:</span>
                <span className="font-medium">{profileData.experienceLevel}</span>
              </div>
            </div>
          )}

          {user.userType === UserType.MANAGER && (
            <div className="space-y-3">
              <div className="text-gray-600">
                As a database manager, you have access to:
              </div>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Create and manage users</li>
                <li>Manage tournament halls</li>
                <li>Access all system data</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 