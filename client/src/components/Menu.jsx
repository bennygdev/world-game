function Menu({ mode, setMode }) {
  return (
    <div className="absolute top-20 left-4 flex space-x-4 z-10">
      <button 
        onClick={() => setMode('World')}
        className={`px-4 py-2 rounded shadow transition-colors duration-300 ${
          mode === 'World'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500 border border-blue-500'
        }`}
      >
        World
      </button>
      <button 
        onClick={() => setMode('Asia')}
        className={`px-4 py-2 rounded shadow transition-colors duration-300 ${
          mode === 'Asia'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500 border border-blue-500'
        }`}
      >
        Asia
      </button>
    </div>
  );
}

export default Menu;
