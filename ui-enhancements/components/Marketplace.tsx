import React from 'react';
import './Marketplace.css';

export default function Marketplace() {
  return (
    <div className="marketplace-container">
      <h1>🌸 Marketplace 🌸</h1>
      
      <div className="trade-listings">
        {/* Trade Listing 1 */}
        <div className="trade-card">
          <div className="user-header">
            <span className="username">user123</span>
          </div>
          
          <div className="trade-details">
            <div className="trade-column">
              <h3>offering:</h3>
              <div className="rarity-tag legendary">LEGENDARY</div>
              {/* Item images would go here */}
            </div>
            
            <div className="trade-column">
              <h3>looking for:</h3>
              <div className="rarity-tag rare">RARE</div>
              {/* Item images would go here */}
            </div>
          </div>
          
          <button className="trade-button">REQUEST TRADE</button>
        </div>

        {/* Trade Listing 2 */}
        <div className="trade-card">
          <div className="user-header">
            <span className="username">user1234</span>
          </div>
          
          <div className="trade-details">
            <div className="trade-column">
              <h3>offering:</h3>
              {/* Placeholder content */}
              <div className="placeholder-text">etc</div>
            </div>
            
            <div className="trade-column">
              <h3>looking for:</h3>
              {/* Placeholder content */}
              <div className="placeholder-text">etc</div>
            </div>
          </div>
          
          <button className="trade-button">REQUEST TRADE</button>
        </div>

        {/* Trade Listing 3 */}
        <div className="trade-card">
          <div className="user-header">
            <span className="username">user1234</span>
          </div>
          
          <div className="trade-details">
            <div className="trade-column">
              <h3>offering:</h3>
              {/* Placeholder content */}
              <div className="placeholder-text">etc</div>
            </div>
            
            <div className="trade-column">
              <h3>looking for:</h3>
              {/* Placeholder content */}
              <div className="placeholder-text">etc</div>
            </div>
          </div>
          
          <button className="trade-button">REQUEST TRADE</button>
        </div>
      </div>
    </div>
  );
}