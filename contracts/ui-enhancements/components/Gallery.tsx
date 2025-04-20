import React from 'react';
import './Gallery.css';

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

const catImages = [
  { id: 'cat_alien', name: 'Alien', image: alien, rarity: 'legendary' },
  { id: 'cat_astronaut', name: 'Astronaut', image: astronaut, rarity: 'rare' },
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

export default function Gallery() {
    return (
      <div className="gallery-container">
        <h1>MY GALLERY</h1>
        
        <div className="gallery-grid">
          {catImages.map((cat) => (
            <div key={cat.id} className={`gallery-item ${cat.rarity}`}>
              <img src={cat.image} alt={cat.name} className="cat-image" />
              <div className="rarity-label">{cat.rarity.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  