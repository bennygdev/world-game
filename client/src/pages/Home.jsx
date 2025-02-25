import { useState } from 'react';
import WorldMap from '../components/WorldMap';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';
import LeaderboardModal from '../components/modals/LeaderboardModal';
import UserStatsModal from '../components/modals/UserStatsModal';
import FloatingButtons from '../components/FloatingButtons';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const openLoginModal = () => {
    closeAllModals();
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    closeAllModals();
    setShowRegisterModal(true);
  };

  const openLeaderboardModal = () => {
    closeAllModals();
    setShowLeaderboardModal(true);
  };

  const openStatsModal = () => {
    closeAllModals();
    setShowStatsModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowLeaderboardModal(false);
    setShowStatsModal(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 lg:bg-[#A3D9EF] flex flex-col">
      <FloatingButtons 
        onLoginClick={openLoginModal} 
        onRegisterClick={openRegisterModal}
        onLeaderboardClick={openLeaderboardModal}
        onStatsClick={openStatsModal}
      />
      
      <main className="flex-1 relative">
        <WorldMap />
      </main>

      {showLoginModal && (
        <LoginModal 
          onClose={closeAllModals} 
          onRegisterClick={openRegisterModal} 
        />
      )}
      
      {showRegisterModal && (
        <RegisterModal 
          onClose={closeAllModals} 
          onLoginClick={openLoginModal} 
        />
      )}
      
      {showLeaderboardModal && (
        <LeaderboardModal onClose={closeAllModals} />
      )}
      
      {showStatsModal && (
        <UserStatsModal onClose={closeAllModals} />
      )}
    </div>
  );
}