import { useState, useEffect } from 'react';

function OnboardingModal({ onClose, allowReopen = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // auto-close if not allowed to reopen
    if (!allowReopen) {
      const hasVisitedBefore = localStorage.getItem('onboardingModal');
      
      if (!hasVisitedBefore) {
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
      } else {
        onClose();
      }
    } else {
      // if reopening is allowed simply start the animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [onClose, allowReopen]);

  const handleClose = () => {
    localStorage.setItem('onboardingModal', 'true');
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
      ></div>
      
      <div 
        className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative transform transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">Welcome to World Game!</h2>
        <h3 className="text-xl text-center mb-6 text-gray-600">Your Global Geography Adventure</h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Embark on a journey to identify every nation on Earth! World Game challenges your geographic knowledge in a relaxed, engaging way.
          </p>
          
          <p>
            With no countdown ticking away, you're free to explore at your own pace. Simply type country names in the search box - when you get one right, it will light up on the map!
          </p>
          
          <p>
            Navigate around using the map controls to zoom in on tricky regions or get a better view of smaller countries. Your progress is saved as you go.
          </p>
          
          <p>
            How many of the world's nations can you name? Start your expedition now and find out!
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={handleClose}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Begin My Journey
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModal;