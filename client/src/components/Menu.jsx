function Menu({ mode, setMode }) {
  const continents = [
    { id: 'World' },
    { id: 'North America' },
    { id: 'South America' },
    { id: 'Europe' },
    { id: 'Asia' },
    { id: 'Africa' },
    { id: 'Oceania' }
  ];

  return (
    <div className="absolute top-20 left-4 z-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-48">
        <div className="p-3 font-medium text-center">
          Game Mode
        </div>
        <div className="flex flex-col">
          {continents.map((continent) => (
            <button 
              key={continent.id}
              onClick={() => setMode(continent.id)}
              className={`flex items-center px-4 py-3 text-left transition-colors text-sm duration-200 hover:bg-blue-50 ${
                mode === continent.id
                  ? 'bg-blue-100 text-blue-700 font-medium border-l-4 border-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {continent.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;