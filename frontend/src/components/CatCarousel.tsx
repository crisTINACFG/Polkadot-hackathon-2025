import React, { useState, useEffect, useRef } from 'react';
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

// Preload images to prevent glitchy appearance
const preloadImages = () => {
  catImages.forEach(cat => {
    const img = new Image();
    img.src = cat.image;
  });
};

const CatCarousel: React.FC<CatCarouselProps> = ({ onAddRandomCard, isProcessing, lastReceivedCard, isConnected }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shouldSpin, setShouldSpin] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState(200);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinStepsRef = useRef(0);
  const totalStepsRef = useRef(0);
  const targetCardRef = useRef<number | null>(null);

  // Preload all images when component mounts
  useEffect(() => {
    preloadImages();
  }, []);

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

  // Cleanup effect to clear any spinning intervals on unmount
  useEffect(() => {
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  const startSpinAnimation = (finalCatId: number) => {
    setIsSpinning(true);
    
    // Clear any existing intervals
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    
    // Reduced number of spins (between 2-3 full rotations)
    const spins = Math.floor(Math.random() * 2) + 1.5;
    
    // Store the total steps and target card for reference
    totalStepsRef.current = Math.floor(spins * catImages.length + 
      ((finalCatId - currentIndex + catImages.length) % catImages.length));
    spinStepsRef.current = 0;
    targetCardRef.current = finalCatId % catImages.length;
    
    // Faster starting speed
    setSpinSpeed(50);
    
    // Start the spinning animation
    spinStep();
  };

  const spinStep = () => {
    // Check if we've completed the required steps
    if (spinStepsRef.current >= totalStepsRef.current) {
      // Set to final position
      if (targetCardRef.current !== null) {
        setCurrentIndex(targetCardRef.current);
        setSelectedCat(targetCardRef.current);
      }
      setIsSpinning(false);
      setShowConfetti(true);
      return;
    }
    
    // Move to next card
    setCurrentIndex(prev => (prev + 1) % catImages.length);
    spinStepsRef.current++;
    
    // Calculate the next delay - faster progression with quicker slowdown
    let nextDelay: number;
    const progress = spinStepsRef.current / totalStepsRef.current;
    
    if (progress < 0.6) {
      // Fast spinning for most of the animation - faster than before
      nextDelay = 50;
    } else if (progress < 0.8) {
      // Start slowing down - faster than before
      nextDelay = 80;
    } else if (progress < 0.9) {
      // Even slower - faster than before
      nextDelay = 120;
    } else {
      // Final slowdown - faster than before
      nextDelay = 180;
    }
    
    // Schedule the next step with the calculated delay
    spinIntervalRef.current = setTimeout(spinStep, nextDelay);
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

  // Add a dynamic className based on spinning state for CSS animations
  const carouselTrackClass = `carousel-track ${isSpinning ? 'spinning' : ''}`;

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
          className={carouselTrackClass}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
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
          You got a {catImages.find(cat => cat.id === selectedCat)?.name || `Cat ${selectedCat}`}!
        </div>
      )}
    </div>
  );
};

export default CatCarousel; 