'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { UserType } from '@/domains/user/types';

export default function CreateUser() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [userType, setUserType] = useState<string>(UserType.PLAYER);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [nationality, setNationality] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fideId, setFideId] = useState('');
  const [eloRating, setEloRating] = useState('');
  const [titleId, setTitleId] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Redirect if not a database manager
  useEffect(() => {
    if (user && user.userType !== UserType.MANAGER) {
      router.push('/unauthorized');
    }
  }, [user, router]);
  
  // Fetch titles for players
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        setLoading(true);
        setError(''); // Clear any previous errors
        const res = await fetch('/api/titles');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        let data;
        try {
          data = await res.json();
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          setError('Invalid response format when fetching titles');
          return;
        }
        
        if (data.success) {
          setTitles(data.titles || []);
        } else {
          setError(data.message || 'Failed to fetch titles');
        }
      } catch (err) {
        console.error('Error fetching titles:', err);
        setError('Failed to load titles. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTitles();
  }, []);
  
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setSurname('');
    setNationality('');
    setDateOfBirth('');
    setFideId('');
    setEloRating('');
    setTitleId('');
    setExperienceLevel('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreateLoading(true);
      setError('');
      setSuccess('');
      
      // Build user data based on user type
      const userData: any = {
        username,
        password,
        userType,
        name,
        surname,
        nationality,
      };
      
      // Add type-specific fields
      if (userType === UserType.PLAYER) {
        userData.dateOfBirth = dateOfBirth;
        userData.fideId = fideId;
        userData.eloRating = parseInt(eloRating);
        userData.titleId = titleId ? parseInt(titleId) : null;
      } else if (userType === UserType.ARBITER) {
        userData.experienceLevel = experienceLevel;
      }
      
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        setError('Invalid response format from server');
        return;
      }
      
      if (data.success) {
        setSuccess(`${userType.toLowerCase()} created successfully`);
        resetForm();
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('An error occurred while creating user');
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New User</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading titles...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      
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
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value={UserType.PLAYER}>Player</option>
              <option value={UserType.COACH}>Coach</option>
              <option value={UserType.ARBITER}>Arbiter</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          {/* Player-specific fields */}
          {userType === UserType.PLAYER && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FIDE ID</label>
                  <input
                    type="text"
                    value={fideId}
                    onChange={(e) => setFideId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ELO Rating</label>
                  <input
                    type="number"
                    value={eloRating}
                    onChange={(e) => setEloRating(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                    min="0"
                    max="3000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <select
                  value={titleId}
                  onChange={(e) => setTitleId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select a title (optional)</option>
                  {titles.map((title) => (
                    <option key={title.title_id} value={title.title_id}>
                      {title.title_name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {/* Arbiter-specific fields */}
          {userType === UserType.ARBITER && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select experience level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          )}
          
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 