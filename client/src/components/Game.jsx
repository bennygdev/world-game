import { useState, useEffect } from 'react';
import GiveUpConfirmModal from './modals/GiveUpConfirmModal';

function Game({ onCorrectGuess, onGameEnd, mode, onResetGame }) {
  const [countries, setCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState(new Set());
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  
  // Regional game modes
  const northAmericaCountries = [
    'CA', 'US', 'MX', // Main countries
    'BZ', 'CR', 'CU', 'DO', 'GT', 'HN', 'HT', 'NI', 'PA', 'SV', // Central America
    'AG', 'BB', 'BS', 'DM', 'GD', 'JM', 'KN', 'LC', 'TT', 'VC' // Caribbean islands (independent countries only)
  ];

  const southAmericaCountries = [
    'AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PE', 'PY', 'SR', 'UY', 'VE'
  ];

  const europeCountries = [
    'AD', 'AL', 'AT', 'BA', 'BE', 'BG', 'BY', 'CH', 'CY', 'CZ', 
    'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GB', 'GR', 'HR', 'HU', 
    'IE', 'IS', 'IT', 'LI', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 
    'MK', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'RS', 'RU', 'SE', 
    'SI', 'SK', 'SM', 'UA', 'VA', 'XK'
  ];

  const asiaCountries = [
    'AE', 'AF', 'AM', 'AZ', 'BD', 'BH', 'BN', 'BT', 'CN', 'GE', 
    'ID', 'IL', 'IN', 'IQ', 'IR', 'JO', 'JP', 'KG', 'KH', 'KP', 
    'KR', 'KW', 'KZ', 'LA', 'LB', 'LK', 'MM', 'MN', 'MV', 'MY', 
    'NP', 'OM', 'PH', 'PK', 'PS', 'QA', 'SA', 'SG', 'SY', 'TH', 
    'TJ', 'TL', 'TM', 'TW', 'UZ', 'VN', 'YE', 'TR'
  ];

  const africaCountries = [
    'AO', 'BF', 'BI', 'BJ', 'BW', 'CD', 'CF', 'CG', 'CI', 'CM', 
    'CV', 'DJ', 'DZ', 'EG', 'ER', 'ET', 'GA', 'GH', 'GM', 'GN', 
    'GQ', 'GW', 'KE', 'KM', 'LR', 'LS', 'LY', 'MA', 'MG', 'ML', 
    'MR', 'MU', 'MW', 'MZ', 'NA', 'NE', 'NG', 'RW', 'SC', 'SD', 
    'SL', 'SN', 'SO', 'SS', 'ST', 'SZ', 'TD', 'TG', 'TN', 'TZ', 
    'UG', 'ZA', 'ZM', 'ZW'
  ];

  const oceaniaCountries = [
    'AU', 'FJ', 'FM', 'KI', 'MH', 'NR', 'NZ', 'PG', 'PW', 'SB', 
    'TO', 'TV', 'VU', 'WS'
  ];

  // when mode changes reset game state and fetch countries accordingly
  useEffect(() => {
    setGuessedCountries(new Set());
    setInput('');
    setMessage('');
    setIsError(false);
    setGameOver(false);
    fetchCountries();
  }, [mode]);
  
  // msg display
  useEffect(() => {
    let timer;
    if (message) {
      setShowMessage(true);
      timer = setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => setMessage(''), 300);
      }, 3000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [message]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      
      // filter for UN member states
      let gameCountries = data.filter(country => country.unMember === true).map(country => ({
        name: country.name.common.toLowerCase(),
        id: country.cca2,
        alternatives: [
          ...(country.altSpellings || []).map(s => s.toLowerCase()),
          ...(country.name.nativeName
            ? Object.values(country.name.nativeName).map(n => n.common.toLowerCase())
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
        "TL": ["east timor", "timor", "timor leste"],
        "CZ": ["czech", "czech republic"],
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

      if (mode === 'Asia') {
        // only countries that are in the asia list
        gameCountries = gameCountries.filter(country => asiaCountries.includes(country.id));
      } else if (mode === 'North America') {
        gameCountries = gameCountries.filter(country => northAmericaCountries.includes(country.id));
      } else if (mode === 'South America') {
        gameCountries = gameCountries.filter(country => southAmericaCountries.includes(country.id));
      } else if (mode === 'Africa') {
        gameCountries = gameCountries.filter(country => africaCountries.includes(country.id));
      } else if (mode === 'Europe') {
        gameCountries = gameCountries.filter(country => europeCountries.includes(country.id));
      } else if (mode === 'Oceania') {
        gameCountries = gameCountries.filter(country => oceaniaCountries.includes(country.id));
      }
      
      if (mode !== 'Asia' && mode !== 'North America' && mode !== 'South America' && mode !== 'Africa' && mode !== 'Europe' && mode !== 'Oceania' && gameCountries.length !== 197) {
        console.warn(`Expected 197 countries, got ${gameCountries.length}`);
      }
      
      setCountries(gameCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setMessage('Error loading countries data');
      setIsError(true);
    }
  };

  const handleGuess = async () => {
    const guess = input.trim().toLowerCase();
    
    if (guess === '') return;

    const correctCountry = countries.find(country => 
      country.name === guess || country.alternatives.includes(guess)
    );

    if (correctCountry) {
      // check if this country's path is already filled by checking if already registered a correct guess for this country ID
      const alreadyGuessed = Array.from(guessedCountries).some(guessedName => {
        const matchingCountry = countries.find(c => 
          c.name === guessedName || c.alternatives.includes(guessedName)
        );
        return matchingCountry && matchingCountry.id === correctCountry.id;
      });

      if (alreadyGuessed) {
        setMessage('You already guessed this country!');
        setIsError(true);
        setInput('');
        return;
      }

      const newGuessed = new Set(guessedCountries);
      newGuessed.add(guess);
      setGuessedCountries(newGuessed);
      onCorrectGuess(correctCountry.id);
      setMessage('Correct!');
      setIsError(false);
      
      // calculate new count
      const newSize = newGuessed.size;
      if (newSize === countries.length) {
        // all countries have been guessed then win
        handleGameEnd(true, newSize);
      }
    } else {
      // setMessage('Not a recognized country');
      // setIsError(true);

      // smarter message handler
      const validCountries = {
        "North America": northAmericaCountries,
        "South America": southAmericaCountries,
        "Europe": europeCountries,
        "Asia": asiaCountries,
        "Africa": africaCountries,
        "Oceania": oceaniaCountries
      };
    
      if (mode !== "World" && !validCountries[mode]?.some(c => c.toLowerCase() === guess)) {
        setMessage(`This country is not in ${mode}`);
      } else {
        setMessage('Not a recognized country');
      }
      setIsError(true);
    }
    
    setInput('');
  };

  const promptGiveUp = () => {
    setShowGiveUpModal(true);
  };

  const cancelGiveUp = () => {
    setShowGiveUpModal(false);
  };

  const confirmGiveUp = () => {
    setShowGiveUpModal(false);
    handleGameEnd(false);
  };

  const handleGameEnd = async (completed, finalSize = guessedCountries.size) => {
    const stats = {
      completed,
      correctGuesses: finalSize,
      totalCountries: countries.length,
      isWinner: completed && finalSize === countries.length
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
            game_mode: mode,
            score: finalSize
          }),
        });
        if (!response.ok) throw new Error('Failed to save stats');
      } catch (error) {
        console.error('Error saving game stats:', error);
      }
    }
    
    setGameOver(true);
    onGameEnd(stats);
  };

  const resetGame = () => {
    setGuessedCountries(new Set());
    setInput('');
    setMessage('');
    setIsError(false);
    setGameOver(false);

    onResetGame();
    
    //window.location.reload(); // reset everything
    fetchCountries();
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !gameOver && handleGuess()}
              placeholder="Enter country name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
              disabled={gameOver}
            />
            
            {!gameOver ? (
              <>
                <button
                  onClick={handleGuess}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Guess
                </button>
                <button
                  onClick={promptGiveUp}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Give Up
                </button>
              </>
            ) : (
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Play Again
              </button>
            )}
          </div>
          
          {/* Message with fade animation */}
          <div className="h-4 flex">
            {message && (
              <p 
                className={`text-sm transition-opacity duration-300 ${
                  isError ? 'text-red-600' : 'text-green-600'
                } ${showMessage ? 'opacity-100' : 'opacity-0'}`}
              >
                {message}
              </p>
            )}
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Guessed: {guessedCountries.size}</span>
            <span>Remaining: {countries.length - guessedCountries.size}</span>
          </div>
        </div>
      </div>
  
      {showGiveUpModal && (
        <GiveUpConfirmModal 
          onConfirm={confirmGiveUp} 
          onCancel={cancelGiveUp} 
        />
      )}
    </>
  );
};

export default Game;