import React, { useState, useEffect } from 'react';
import './CatCarousel.css';

// Cat imports
import alien from "../assets/alien.png";
import astronaut from "../assets/astronaut.png";
import bear from "../assets/bear.png";
import cyber from "../assets/cyber.png";
import doctor from "../assets/doctor.png";
import fairy from "../assets/fairy.png";
import frog from "../assets/frog.png";
import holographic from "../assets/holographic.png";
import jellyfish from "../assets/jellyfish.png";
import mermaid from "../assets/mermaid.png";
import moustache from "../assets/moustache.png";
import pirate from "../assets/pirate.png";
import princess from "../assets/princess.png";
import rainbow from "../assets/rainbow.png";
import wizard from "../assets/wizard.png";

interface CatCarouselProps {
  onAddRandomCard: () => Promise<void>;
  isProcessing: boolean;
  lastReceivedCard: number | null;
  isConnected: boolean;
}

const catImages = [
    { id: 0, name: 'Alien', image: alien, rarity: 'legendary' },
    { id: 1, name: 'Astronaut', image: astronaut, rarity: 'rare' },
    { id: 2, name: 'Bear', image: bear, rarity: 'common' },
    { id: 3, name: 'Cyber', image: cyber, rarity: 'rare' },
    { id: 4, name: 'Doctor', image: doctor, rarity: 'common' },
    { id: 5, name: 'Fairy', image: fairy, rarity: 'rare' },
    { id: 6, name: 'Frog', image: frog, rarity: 'common' },
    { id: 7, name: 'Holographic', image: holographic, rarity: 'legendary' },
    { id: 8, name: 'Jellyfish', image: jellyfish, rarity: 'rare' },
    { id: 9, name: 'Mermaid', image: mermaid, rarity: 'legendary' },
    { id: 10, name: 'Moustache', image: moustache, rarity: 'common' },
    { id: 11, name: 'Pirate', image: pirate, rarity: 'rare' },
    { id: 12, name: 'Princess', image: princess, rarity: 'legendary' },
    { id: 13, name: 'Rainbow', image: rainbow, rarity: 'legendary' },
    { id: 14, name: 'Wizard', image: wizard, rarity: 'rare' }
];

const CatCarousel: React.FC<CatCarouselProps> = ({ onAddRandomCard, isProcessing, lastReceivedCard, isConnected }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shouldSpin, setShouldSpin] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Watch for transaction completion and start spinning when successful
  useEffect(() => {
    // If transaction completed successfully and we should start spinning
    if (!isProcessing && lastReceivedCard !== null && shouldSpin) {
      startSpinAnimation(lastReceivedCard);
      setShouldSpin(false);
    }
  }, [isProcessing, lastReceivedCard, shouldSpin]);

  const startSpinAnimation = (finalCatId: number) => {
    setIsSpinning(true);
    
    // Random number of spins (between 3-5 full rotations)
    const spins = Math.floor(Math.random() * 3) + 3;
    const totalSteps = spins * catImages.length;
    
    let currentStep = 0;
    const spinInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % catImages.length);
      currentStep++;
      
      if (currentStep >= totalSteps) {
        clearInterval(spinInterval);
        // Set the carousel to show the exact card we received
        setCurrentIndex(finalCatId % catImages.length);
        setSelectedCat(finalCatId);
        setIsSpinning(false);
        setShowConfetti(true);
      }
    }, 80);
  };

  const handleSpin = async () => {
    if (isSpinning || isProcessing || !isConnected) return;
    
    setSelectedCat(null);
    setShowConfetti(false);
    
    try {
      // Tell the component to start spinning after transaction completes
      setShouldSpin(true);
      // Call the blockchain transaction
      await onAddRandomCard();
    } catch (error) {
      console.error("Error during spinning:", error);
      setShouldSpin(false);
    }
  };

  return (
    <div className="cat-carousel">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ff6b8b', '#ff85a2', '#ffb6c1', '#ffe5e9'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}
      
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isSpinning ? 'transform 0.2s ease' : 'transform 0.5s ease'
          }}
        >
          {catImages.map((cat) => (
            <div key={cat.id} className="cat-card">
              <img src={cat.image} alt={cat.name} />
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <span className={`rarity ${cat.rarity.toLowerCase()}`}>{cat.rarity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning || isProcessing || !isConnected}
      >
        {!isConnected ? 'Connect Wallet First' : (isProcessing ? 'Processing Transaction...' : (isSpinning ? 'Spinning...' : 'Spin for a Cat!'))}
      </button>

      {selectedCat !== null && (
        <div className="selection-banner">
          You got a {catImages.find(cat => cat.id === selectedCat % catImages.length)?.name || `Cat ${selectedCat}`}!
        </div>
      )}
    </div>
  );
};

export default CatCarousel; 