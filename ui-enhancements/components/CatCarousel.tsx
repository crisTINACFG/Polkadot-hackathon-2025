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
  addCard: (catId: string) => void;
}

const catImages = [
    { id: 'cat_astronaut', name: 'Astronaut', image: astronaut, rarity: 'rare' },
    { id: 'cat_alien', name: 'Alien', image: alien, rarity: 'legendary' },
    { id: 'cat_bear', name: 'Bear', image: bear, rarity: 'common' },
    { id: 'cat_cyber', name: 'Cyber', image: cyber, rarity: 'rare' },
    { id: 'cat_doctor', name: 'Doctor', image: doctor, rarity: 'common' },
    { id: 'cat_fairy', name: 'Fairy', image: fairy, rarity: 'rare' },
    { id: 'cat_frog', name: 'Frog', image: frog, rarity: 'common' },
    { id: 'cat_holographic', name: 'Holographic', image: holographic, rarity: 'legendary' },
    { id: 'cat_jellyfish', name: 'Jellyfish', image: jellyfish, rarity: 'rare' },
    { id: 'cat_mermaid', name: 'Mermaid', image: mermaid, rarity: 'legendary' },
    { id: 'cat_moustache', name: 'Moustache', image: moustache, rarity: 'common' },
    { id: 'cat_pirate', name: 'Pirate', image: pirate, rarity: 'rare' },
    { id: 'cat_princess', name: 'Princess', image: princess, rarity: 'legendary' },
    { id: 'cat_rainbow', name: 'Rainbow', image: rainbow, rarity: 'legendary' },
    { id: 'cat_wizard', name: 'Wizard', image: wizard, rarity: 'rare' }
];

const CatCarousel: React.FC<CatCarouselProps> = ({ addCard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedCat(null);
    setShowConfetti(false);
    
    // Random number of spins (between 3-5 full rotations)
    const spins = Math.floor(Math.random() * 3) + 3;
    const totalSteps = spins * catImages.length;
    
    let currentStep = 0;
    const spinInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % catImages.length);
      currentStep++;
      
      if (currentStep >= totalSteps) {
        clearInterval(spinInterval);
        const finalIndex = Math.floor(Math.random() * catImages.length);
        setCurrentIndex(finalIndex);
        setSelectedCat(catImages[finalIndex].id);
        setIsSpinning(false);
        addCard(catImages[finalIndex].id);
        setShowConfetti(true);
      }
    }, 80); // Changed from 50ms to 80ms for a slightly slower spin
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
            transition: isSpinning ? 'none' : 'transform 0.3s ease'
          }}
        >
          {catImages.map((cat, index) => (
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
        disabled={isSpinning}
      >
        {isSpinning ? 'Spinning...' : 'Spin for a Cat!'}
      </button>

      {selectedCat && (
        <div className="selection-banner">
          You got a {catImages.find(cat => cat.id === selectedCat)?.name}!
        </div>
      )}
    </div>
  );
};

export default CatCarousel; 