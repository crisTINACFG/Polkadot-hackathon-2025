import React from 'react';
import './Gallery.css';

// Cat images import
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

interface GalleryProps {
  inventory: number[];
  onAddRandomCard: () => Promise<void>;
  isConnected: boolean;
  setCurrentView: (view: 'spin' | 'marketplace' | 'gallery') => void;
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

// Helper function to get rarity based on card ID
const getRarity = (cardId: number): string => {
  if (cardId % 3 === 0) return 'legendary';
  if (cardId % 3 === 1) return 'rare';
  return 'common';
};

export default function Gallery({ inventory, onAddRandomCard, isConnected, setCurrentView }: GalleryProps) {
  // Create a map of owned cards and their quantities
  const ownedCardMap = inventory.reduce((acc, quantity, index) => {
    if (quantity > 0) {
      acc[index] = quantity;
    }
    return acc;
  }, {} as Record<number, number>);
  
  // Debug: Log inventory and owned cards for debugging
  console.log("Inventory array:", inventory);
  console.log("Owned card map:", ownedCardMap);

  return (
    <div className="gallery-container">
      <h1><span className="sakura-emoji">🌸</span> Pawsome Collection <span className="sakura-emoji">🌸</span></h1>
      
      <div className="gallery-grid">
        {catImages.map((cat) => {
          const isOwned = ownedCardMap[cat.id] > 0;
          const quantity = ownedCardMap[cat.id] || 0;
          const rarity = getRarity(cat.id);
          
          return (
            <div 
              key={cat.id} 
              className={`gallery-item ${rarity} ${isOwned ? 'owned' : 'locked'}`}
            >
              {isOwned ? (
                <img src={cat.image} alt={cat.name} className="cat-image" />
              ) : (
                <div className="question-mark-container">
                  <div className="question-mark">?</div>
                </div>
              )}
              <div className="cat-name">{cat.name}</div>
              <div className="rarity-label">{rarity.toUpperCase()}</div>
              {quantity > 1 && (
                <div className="quantity">{quantity}</div>
              )}
            </div>
          );
        })}
      </div>

      {inventory.every(qty => qty === 0) && (
        <div className="empty-gallery-message">
          <p>You don't have any cats in your collection yet.</p>
          {isConnected ? (
            <button onClick={() => setCurrentView('spin')}>Get Your First Cat!</button>
          ) : (
            <p>Connect your wallet to start collecting!</p>
          )}
        </div>
      )}
    </div>
  );
} 