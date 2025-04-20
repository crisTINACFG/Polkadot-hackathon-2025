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

// Generate fun cat facts
const catFacts = [
  "Did you know? Cats have 5 toes on their front paws but only 4 on their back paws!",
  "Cats sleep for 70% of their lives - that's 16 hours a day!",
  "A group of cats is called a 'clowder'!",
  "Cats can't taste sweetness!",
  "Cats can make over 100 different vocal sounds!",
  "Purring helps cats heal bones and muscles!",
  "Cats can jump up to 6 times their length!",
  "The record for the longest cat was 48.5 inches!",
  "A cat's nose print is as unique as a human's fingerprint!",
  "Meowing is how cats communicate with humans, not other cats!"
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
  const [currentFact, setCurrentFact] = useState(0);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinStepsRef = useRef(0);
  const totalStepsRef = useRef(0);
  const targetCardRef = useRef<number | null>(null);
  
  // Rotate cat facts every 8 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % catFacts.length);
    }, 8000);
    
    return () => clearInterval(factInterval);
  }, []);

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

  const startSpinAnimation = (finalCatId: number) => {
    setIsSpinning(true);
    
    // Clear any existing intervals
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
    }
    
    // Reduced number of spins (between 1-2 full rotations for faster experience)
    const spins = Math.floor(Math.random() * 1) + 1;
    
    // Store the total steps and target card for reference
    totalStepsRef.current = Math.floor(spins * catImages.length + 
      ((finalCatId - currentIndex + catImages.length) % catImages.length));
    spinStepsRef.current = 0;
    targetCardRef.current = finalCatId % catImages.length;
    
    // Faster starting speed
    setSpinSpeed(40);
    
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
      // Fast spinning for most of the animation - even faster
      nextDelay = 30;
    } else if (progress < 0.8) {
      // Start slowing down - faster
      nextDelay = 60;
    } else if (progress < 0.9) {
      // Even slower - faster
      nextDelay = 90;
    } else {
      // Final slowdown - faster
      nextDelay = 120;
    }
    
    // Schedule the next step with the calculated delay
    spinIntervalRef.current = setTimeout(spinStep, nextDelay);
  };

  // Handle clicking on a preview cat
  const handlePreviewClick = (catId: number) => {
    setCurrentIndex(catId);
  };

  // Add a dynamic className based on spinning state for CSS animations
  const carouselTrackClass = `carousel-track ${isSpinning ? 'spinning' : ''}`;

  // Get 6 random cats for the preview (ensuring they're different each time)
  const getPreviewCats = () => {
    const shuffled = [...catImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

  // Memoize the preview cats so they don't change on every render
  const previewCats = React.useMemo(() => getPreviewCats(), []);

  // We'll use all cat images for the preview instead of random ones
  const allCats = React.useMemo(() => catImages, []);

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
                backgroundColor: ['#ff6b8b', '#ff85a2', '#ffb6c1', '#ffe5e9'][Math.floor(Math.random() * 4)],
                animationDuration: `${2 + Math.random() * 2}s`, // Randomize duration for smoother effect
                width: `${5 + Math.random() * 7}px`, // Randomize size
                height: `${5 + Math.random() * 7}px` // Randomize size
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main carousel when spinning */}
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

      {/* Cat fact banner */}
      <div className="cat-tagline">
        {catFacts[currentFact]}
      </div>
      
      {/* Cat showcase preview (always visible now) */}
      <div className="cat-showcase-container">
        <div className="cat-showcase">
          {allCats.map((cat, index) => (
            <div 
              key={cat.id} 
              className="preview-cat"
              onClick={() => handlePreviewClick(cat.id)}
              style={{ 
                '--cat-delay': (index * 0.2).toString(),
                '--cat-rotate': (Math.random() * 10 - 5).toString()
              } as React.CSSProperties}
            >
              <img src={cat.image} alt={cat.name} />
              <div className="preview-cat-name">{cat.name}</div>
              <div className={`preview-cat-rarity ${cat.rarity}`}>
                {cat.rarity}
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
    </div>
  );
};

export default CatCarousel; 