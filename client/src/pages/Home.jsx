import Navbar from '../components/Navbar';
import WorldMap from '../components/WorldMap';

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-slate-100 lg:bg-[#A3D9EF] flex flex-col">
      <Navbar />
      <main className="flex-1 relative">
        <WorldMap />
      </main>
    </div>
  );
}