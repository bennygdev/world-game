function LogoCard({ onClick }) {
  return (
    <div 
      className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md px-4 py-3 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <h1 className="text-xl font-bold text-blue-600">World Game</h1>
    </div>
  );
}

export default LogoCard;