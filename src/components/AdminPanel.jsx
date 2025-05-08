import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';

const AdminContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1a1a1a;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 8px;
  font-family: 'MedievalSharp', cursive;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #d4af37;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #e0e0e0;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
  }
`;

const DaySection = styled.div`
  margin-bottom: 3rem;
`;

const DayHeading = styled.h2`
  color: #d4af37;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const ApplicationCard = styled.div`
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  h3 {
    margin: 0;
    color: #d4af37;
  }

  p {
    margin: 0.3rem 0;
  }
`;

const ErrorMsg = styled.div`
  padding: 1rem;
  background-color: #5c2e2e;
  border: 1px solid #ff4d4d;
  border-radius: 4px;
  color: #ffb3b3;
  margin-bottom: 1rem;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 1rem 0;
  border-radius: 4px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #e0e0e0;
  font-size: 1rem;
`;

const groupByDate = (apps) => {
  return apps.reduce((acc, app) => {
    const date = format(new Date(app.created_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(app);
    return acc;
  }, {});
};

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://89.42.88.48:5200/api/applications', {
        params: { search }
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch applications. Make sure the server is running.');
    }
  };

  useEffect(() => {
    if (authenticated) fetchApplications();
  }, [search, authenticated]);

  const handlePasswordSubmit = () => {
    if (passwordInput === 'caddynsaty@#2025root') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password.');
    }
  };

  if (!authenticated) {
    return (
      <AdminContainer>
        <Header>
          <h1>Admin Login</h1>
        </Header>
        <PasswordInput
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button onClick={handlePasswordSubmit}>Enter</button>
      </AdminContainer>
    );
  }

  const groupedApps = groupByDate(applications);

  return (
    <AdminContainer>
      <Header>
        <h1>Admin Panel - Applications</h1>
      </Header>

      {error && <ErrorMsg>{error}</ErrorMsg>}

      <SearchBar
        type="text"
        placeholder="Search by Discord username or character name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {Object.entries(groupedApps).map(([date, apps]) => (
        <DaySection key={date}>
          <DayHeading>{format(new Date(date), 'MMMM d, yyyy')}</DayHeading>
          {apps.map((app) => (
            <ApplicationCard key={app.id}>
              <h3>{app.character_name}</h3>
              <p><strong>Discord:</strong> {app.discord_username}</p>
              <p><strong>Race:</strong> {app.character_race}</p>
              <p><strong>Age:</strong> {app.character_age}</p>
              <p><strong>Backstory:</strong> {app.character_backstory}</p>
              <p><strong>Experience:</strong> {app.rp_experience}</p>
              <p><strong>Agreed to Rules:</strong> {app.server_rules_agreement ? 'Yes' : 'No'}</p>
            </ApplicationCard>
          ))}
        </DaySection>
      ))}
    </AdminContainer>
  );
};

export default AdminPanel;
