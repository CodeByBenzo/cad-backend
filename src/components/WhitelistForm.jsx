import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1a1a1a;
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #e0e0e0;
  font-family: 'MedievalSharp', cursive;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;

  h2 {
    color: #d4af37;
    font-size: 2.2rem;
    margin: 0;
  }

  p {
    margin: 0.5rem 0 0;
    font-style: italic;
    color: #aaa;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: bold;
    color: #d4af37;
  }

  input, select, textarea {
    padding: 0.75rem;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 4px;
    color: #e0e0e0;
    font-family: inherit;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: #d4af37;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: auto;
  }

  label {
    font-weight: normal;
    color: #e0e0e0;
  }
`;

const WordCount = styled.span`
  font-size: 0.8rem;
  color: #aaa;
  text-align: right;
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background-color: ${props => props.disabled ? '#6b6b6b' : '#d4af37'};
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  font-family: 'MedievalSharp', cursive;

  &:hover {
    background-color: ${props => props.disabled ? '#6b6b6b' : '#c9a227'};
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;

  h2 {
    color: #d4af37;
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #5c2e2e;
  border: 1px solid #ff4d4d;
  border-radius: 4px;
  color: #ffb3b3;
  margin-bottom: 1rem;
`;

// Main Component
const WhitelistForm = () => {
  const [formData, setFormData] = useState({
    discordUsername: '',
    characterName: '',
    characterBackstory: '',
    characterRace: '',
    characterAge: '',
    rpExperience: '',
    serverRulesAgreement: false
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const wordCount = formData.characterBackstory.split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      setError('Character backstory must be at least 50 words');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://89.42.88.48:5200/api/applications',
        {
          discordUsername: formData.discordUsername,
          characterName: formData.characterName,
          characterBackstory: formData.characterBackstory,
          characterRace: formData.characterRace,
          characterAge: formData.characterAge,
          rpExperience: formData.rpExperience,
          serverRulesAgreement: formData.serverRulesAgreement
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(
        err.response?.data?.message || 
        'Failed to submit application. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <FormContainer>
        <SuccessMessage>
          <h2>Application Submitted!</h2>
          <p>Your whitelist application has been received. Our staff will review it shortly.</p>
          <p>You'll be contacted via Discord at {formData.discordUsername} with the result.</p>
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormHeader>
        <h2>Whitelist Application</h2>
        <p>Join our immersive roleplay experience</p>
      </FormHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="discordUsername">Discord Username (including tag)</label>
          <input
            type="text"
            id="discordUsername"
            name="discordUsername"
            value={formData.discordUsername}
            onChange={handleChange}
            required
            placeholder="Example: YourName#1234"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="characterName">Character Full Name</label>
          <input
            type="text"
            id="characterName"
            name="characterName"
            value={formData.characterName}
            onChange={handleChange}
            required
            placeholder="First and Last name"
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="characterRace">Character </label>
          <select
            id="characterRace"
            name="characterRace"
            value={formData.characterRace}
            onChange={handleChange}
            required
          >
            <option value="">Roleplay Mode</option>
            <option value="Human">Illegal</option>
            <option value="Elf">Legal</option>
            <option value="Dwarf">Police</option>
            <option value="Orc">Just Chilling</option>
            <option value="Custom">Custom (explain in backstory)</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label htmlFor="characterAge">Character Age</label>
          <input
            type="number"
            id="characterAge"
            name="characterAge"
            min="16"
            max="150"
            value={formData.characterAge}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <label htmlFor="characterBackstory">Character Backstory (Minimum 200 words)</label>
          <textarea
            id="characterBackstory"
            name="characterBackstory"
            value={formData.characterBackstory}
            onChange={handleChange}
            rows="8"
            required
            placeholder="Describe your character's history, personality, motivations..."
          />
          <WordCount>
            {formData.characterBackstory.split(/\s+/).filter(Boolean).length} words
            {formData.characterBackstory.split(/\s+/).filter(Boolean).length < 200 && 
              ` (${50 - formData.characterBackstory.split(/\s+/).filter(Boolean).length} more required)`}
          </WordCount>
        </FormGroup>

        <FormGroup>
          <label htmlFor="rpExperience">Roleplay Experience</label>
          <textarea
            id="rpExperience"
            name="rpExperience"
            value={formData.rpExperience}
            onChange={handleChange}
            rows="5"
            required
            placeholder="Describe your previous RP experience..."
          />
        </FormGroup>

        <FormGroup>
          <CheckboxContainer>
            <input
              type="checkbox"
              id="serverRulesAgreement"
              name="serverRulesAgreement"
              checked={formData.serverRulesAgreement}
              onChange={handleChange}
              required
            />
            <label htmlFor="serverRulesAgreement">
              I have read and agree to abide by the server rules
            </label>
          </CheckboxContainer>
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Application'}
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default WhitelistForm;