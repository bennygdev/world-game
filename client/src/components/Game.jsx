import { useState, useEffect } from 'react';

const Game = ({ onCorrectGuess, onGameEnd }) => {
  const [countries, setCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState(new Set());
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        // filter for UN member states
        let gameCountries = data.filter(country => 
          country.unMember === true
        ).map(country => ({
          name: country.name.common.toLowerCase(),
          id: country.cca2,
          alternatives: [
            ...(country.altSpellings || []).map(s => s.toLowerCase()),
            ...(country.name.nativeName ? 
              Object.values(country.name.nativeName).map(n => n.common.toLowerCase())
              : []
            )
          ]
        }));
        
        // add the 5 special cases that might be missing, 192 -> 197
        const specialCases = [
          {
            name: 'kosovo',
            id: 'XK',
            alternatives: ['republic of kosovo', 'косово']
          },
          {
            name: 'palestine',
            id: 'PS',
            alternatives: ['state of palestine', 'palestinian territories']
          },
          {
            name: 'vatican',
            id: 'VA',
            alternatives: ['holy see', 'vatican city', 'vatican city state']
          },
          {
            name: 'taiwan',
            id: 'TW',
            alternatives: ['republic of china', 'chinese taipei']
          },
          {
            name: 'guinea-bissau',
            id: 'GW',
            alternatives: ['guinea bissau', 'republic of guinea-bissau']
          }
        ];
        
        // add special cases if they dont already exist
        specialCases.forEach(special => {
          const exists = gameCountries.some(c => 
            c.name === special.name || 
            c.id === special.id ||
            c.alternatives.includes(special.name)
          );
          
          if (!exists) {
            gameCountries.push(special);
          }
        });
        
        // country name alternatives
        const additionalAlternatives = {
          "CI": ["ivory coast"],
          "CD": ["drc", "congo-kinshasa"],
          "FM": ["micronesia"],
          "LA": ["laos"],
          "MK": ["north macedonia"],
          "PG": ["papua"],
          "TL": ["east timor", "timor"]
        };
        
        // adding name alternatives
        gameCountries = gameCountries.map(country => {
          if (additionalAlternatives[country.id]) {
            return {
              ...country,
              alternatives: [
                ...country.alternatives,
                ...additionalAlternatives[country.id]
              ]
            };
          }
          return country;
        });
        
        if (gameCountries.length !== 197) {
          console.warn(`Expected 197 countries, got ${gameCountries.length}`);
        }
        
        setCountries(gameCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setMessage('Error loading countries data');
        setIsError(true);
      }
    };
    
    fetchCountries();
  }, []);

  const handleGuess = async () => {
    const guess = input.trim().toLowerCase();
    
    if (guess === '') return;
    
    if (guessedCountries.has(guess)) {
      setMessage('You already guessed this country!');
      setIsError(true);
      return;
    }

    const correctCountry = countries.find(country => 
      country.name === guess || country.alternatives.includes(guess)
    );

    if (correctCountry) {
      setGuessedCountries(prev => new Set([...prev, guess]));
      onCorrectGuess(correctCountry.id);
      setMessage('Correct!');
      setIsError(false);
      
      if (guessedCountries.size + 1 === countries.length) {
        handleGameEnd(true);
      }
    } else {
      setMessage('Not a recognized country');
      setIsError(true);
    }
    
    setInput('');
  };

  const handleGameEnd = async (completed) => {
    const stats = {
      completed,
      correctGuesses: guessedCountries.size,
      totalCountries: countries.length
    };
  
    const user = localStorage.getItem('userData');
    
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/saveStats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            game_mode: 'World',
            score: guessedCountries.size
          }),
        });
        
        if (!response.ok) throw new Error('Failed to save stats');
      } catch (error) {
        console.error('Error saving game stats:', error);
        // continue to show modal even if save fails
      }
    }
    
    onGameEnd(stats);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            placeholder="Enter country name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGuess}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Guess
          </button>
          <button
            onClick={() => handleGameEnd(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Give Up
          </button>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Guessed: {guessedCountries.size}</span>
          <span>Remaining: {countries.length - guessedCountries.size}</span>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg ${
            isError 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;