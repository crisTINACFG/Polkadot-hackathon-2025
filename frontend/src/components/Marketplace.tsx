import React, { useState } from 'react';
import './Marketplace.css';
import { Status } from '../hooks/useCardTrading';

// Import cat images for consistency with Gallery component
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

// Cat data array for consistent use across components
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

interface MarketplaceProps {
  listings: Array<{
    id: number;
    seller: string;
    offerCardId: number;
    requestCardId: number;
    active: boolean;
  }>;
  createListing: () => void;
  acceptListing: (index: number) => void;
  cancelListing: (index: number) => void;
  setOfferCardId: (id: number) => void;
  setRequestCardId: (id: number) => void;
  status: Status;
  currentAddress: string | null;
  tradingErrorMessage: string | null;
  isConnected: boolean;
  isCardInActiveListing: (address: string, cardId: number) => boolean;
}

export default function Marketplace({
  listings,
  createListing,
  acceptListing,
  cancelListing,
  setOfferCardId,
  setRequestCardId,
  status,
  currentAddress,
  tradingErrorMessage,
  isConnected,
  isCardInActiveListing
}: MarketplaceProps) {
  const [offerCard, setOfferCard] = useState<string>('0');
  const [requestCard, setRequestCard] = useState<string>('0');
  
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setOfferCardId(Number(offerCard));
    setRequestCardId(Number(requestCard));
    createListing();
  };

  // Helper function to get rarity class based on card ID
  const getRarityClass = (cardId: number): string => {
    if (cardId % 3 === 0) return 'legendary';
    if (cardId % 3 === 1) return 'rare';
    return 'common';
  };

  // Helper function to get rarity text
  const getRarityText = (cardId: number): string => {
    if (cardId % 3 === 0) return 'LEGENDARY';
    if (cardId % 3 === 1) return 'RARE';
    return 'COMMON';
  };

  // Helper function to get cat name from ID
  const getCatName = (cardId: number): string => {
    const cat = catImages.find(cat => cat.id === cardId);
    return cat ? cat.name : `Card ${cardId}`;
  };

  // Check if user has this card in an active listing
  const userHasActiveListingWithCard = (cardId: number): boolean => {
    if (!currentAddress) return false;
    return isCardInActiveListing(currentAddress, cardId);
  };

  return (
    <div className="marketplace-container">
      <h1>🌸 Cat Trading Marketplace 🌸</h1>
      
      {isConnected && (
        <div className="create-listing-form">
          <h2 className="form-title">Create New Listing</h2>
          <form onSubmit={handleCreateListing}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="offerCard">Card You're Offering:</label>
                <select 
                  id="offerCard"
                  value={offerCard}
                  onChange={e => setOfferCard(e.target.value)}
                  required
                  className="cat-select"
                >
                  {catImages.map(cat => {
                    const isInActiveListing = userHasActiveListingWithCard(cat.id);
                    return (
                      <option 
                        key={cat.id} 
                        value={cat.id.toString()}
                        disabled={isInActiveListing}
                      >
                        {cat.name} ({getRarityText(cat.id)})
                        {isInActiveListing ? ' - Already in a listing' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="requestCard">Card You Want:</label>
                <select 
                  id="requestCard"
                  value={requestCard}
                  onChange={e => setRequestCard(e.target.value)}
                  required
                  className="cat-select"
                >
                  {catImages.map(cat => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name} ({getRarityText(cat.id)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={status === Status.Loading || !isConnected || userHasActiveListingWithCard(Number(offerCard))}
            >
              {status === Status.Loading ? "Creating..." : "Create Listing"}
            </button>
            
            {userHasActiveListingWithCard(Number(offerCard)) && (
              <div className="warning-message">
                This card is already in an active listing. Cancel your existing listing first.
              </div>
            )}
          </form>
          
          {status === Status.Revert && tradingErrorMessage && (
            <div className="error-message">
              Failed to create listing: {tradingErrorMessage}
            </div>
          )}
        </div>
      )}
      
      <div className="trade-listings">
        {listings.length === 0 ? (
          <div className="trade-card">
            <p style={{ textAlign: 'center', padding: '20px' }}>No active listings found. Be the first to create one!</p>
          </div>
        ) : (
          listings.map((listing) => {
            const isUserListing = currentAddress && listing.seller.toLowerCase() === currentAddress.toLowerCase();
            
            return (
              <div key={listing.id} className="trade-card">
                <div className="user-header">
                  <span className="username">
                    <span className="seller-label">Seller:</span> 
                    {listing.seller.substring(0, 6)}...{listing.seller.substring(listing.seller.length - 4)}
                  </span>
                  {isUserListing && <span className="user-badge">Your Listing</span>}
                </div>
                
                <div className="trade-details">
                  <div className={`trade-column ${getRarityClass(listing.offerCardId)}-container`}>
                    <h3>offering:</h3>
                    <div className="cat-card-preview">
                      <img 
                        src={catImages.find(cat => cat.id === listing.offerCardId)?.image || ''}
                        alt={getCatName(listing.offerCardId)}
                        className="cat-preview-image"
                      />
                      <div className={`rarity-tag ${getRarityClass(listing.offerCardId)}`}>
                        {getRarityText(listing.offerCardId)}
                      </div>
                      <div className="cat-name-preview">
                        {getCatName(listing.offerCardId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="trade-divider">
                    <div className="trade-arrow">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 20H8" stroke="#ff6b8b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 14L8 20L14 26" stroke="#ff6b8b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M26 14L32 20L26 26" stroke="#ff6b8b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className={`trade-column ${getRarityClass(listing.requestCardId)}-container`}>
                    <h3>looking for:</h3>
                    <div className="cat-card-preview">
                      <img 
                        src={catImages.find(cat => cat.id === listing.requestCardId)?.image || ''}
                        alt={getCatName(listing.requestCardId)}
                        className="cat-preview-image"
                      />
                      <div className={`rarity-tag ${getRarityClass(listing.requestCardId)}`}>
                        {getRarityText(listing.requestCardId)}
                      </div>
                      <div className="cat-name-preview">
                        {getCatName(listing.requestCardId)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons">
                  {isUserListing ? (
                    <button
                      className="cancel-button"
                      onClick={() => cancelListing(listing.id)}
                      disabled={status === Status.Loading}
                    >
                      {status === Status.Loading ? "Processing..." : "Cancel Listing"}
                    </button>
                  ) : (
                    <button
                      className="trade-button"
                      onClick={() => acceptListing(listing.id)}
                      disabled={status === Status.Loading || !isConnected}
                    >
                      {status === Status.Loading ? "Processing..." : "Request Trade"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Status Messages */}
      {status === Status.Success && (
        <div className="success-message">
          Transaction successful!
        </div>
      )}
      {status === Status.Revert && (
        <div className="error-message">
          Transaction failed: {tradingErrorMessage || 'Please try again.'}
        </div>
      )}
    </div>
  );
} 