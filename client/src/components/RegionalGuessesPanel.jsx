import React from 'react';

const RegionalGuessesPanel = ({ 
  continentData, 
  correctGuesses, 
  missedCountries, 
  countryNameMapping 
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-lg w-90 max-h-[50vh] overflow-auto">
      {Object.entries(continentData).map(([continent, countryCodes]) => {
        const guessedNames = countryCodes
          .filter(code => correctGuesses.includes(code))
          .map(code => countryNameMapping[code] || code);

        const total = countryCodes.length;

        const missedNames = countryCodes
          .filter(code => missedCountries.includes(code))
          .map(code => countryNameMapping[code] || code);

        return (
          <div key={continent} className="mb-2">
            <div className="font-bold">
              {continent}: {guessedNames.length}/{total}
            </div>
            <div className="text-sm">
              <div>{guessedNames.length > 0 ? guessedNames.join(', ') : 'No guesses yet'}</div>
              {missedNames.length > 0 && (
                <div className="text-red-500">
                  Missed: {missedNames.join(', ')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RegionalGuessesPanel;
