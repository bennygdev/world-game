import { useState, useEffect } from 'react';
import WorldMap from '../components/WorldMap';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';
import LeaderboardModal from '../components/modals/LeaderboardModal';
import UserStatsModal from '../components/modals/UserStatsModal';
import OnboardingModal from '../components/modals/OnboardingModal';
import LogoCard from '../components/LogoCard';
import FloatingButtons from '../components/FloatingButtons';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    // check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('onboardingModal');
    if (!hasVisitedBefore) {
      setShowOnboardingModal(true);
    }
  }, []);

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

  const openOnboardingModal = () => {
    closeAllModals();
    setShowOnboardingModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setShowLeaderboardModal(false);
    setShowStatsModal(false);
    setShowOnboardingModal(false);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 lg:bg-[#A3D9EF] flex flex-col">
      <LogoCard onClick={openOnboardingModal} />

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

      {showOnboardingModal && (
        <OnboardingModal onClose={closeAllModals} allowReopen={true} />
      )}
    </div>
  );
}