import React, { useEffect, useState } from "react";
import { contracts } from "contracts";
import { useCardTrading, Status } from "./hooks/useCardTrading";
import { useInventoryManager } from "./hooks/useInventoryManager";
import "./App.css";
import CatCarousel from "./components/CatCarousel";
import Marketplace from "./components/Marketplace";
import Gallery from "./components/Gallery";
import { Sparkles } from "./components/Sparkles";

// Update to the correctly deployed addresses in lowercase to match export
const CARD_TRADING_ADDRESS = "3e904ff32afbac3450da5689a1238e7d9752a98a";
const INVENTORY_MANAGER_ADDRESS = "48a1fb9ff1b9f414283e6512ec3ebf38fd70b7a0";

function App() {
  if (!(CARD_TRADING_ADDRESS in contracts) || !(INVENTORY_MANAGER_ADDRESS in contracts)) {
    throw new Error(
      "Contract addresses are missing in contracts; have you built, deployed and exported the contracts?"
    );
  }

  const cardTradingData = contracts[CARD_TRADING_ADDRESS];
  const inventoryManagerData = contracts[INVENTORY_MANAGER_ADDRESS];
  const [currentView, setCurrentView] = useState<'spin' | 'marketplace' | 'gallery'>('spin');

  const { 
    status, 
    listings, 
    errorMessage: tradingErrorMessage, 
    setOfferCardId, 
    setRequestCardId, 
    createListing, 
    acceptListing, 
    cancelListing,
    fetchListings,
    isCardInActiveListing
  } = useCardTrading(cardTradingData);

  const { 
    inventory, 
    hasCard, 
    status: inventoryStatus, 
    lastReceivedCard, 
    isProcessing, 
    currentAddress, 
    errorMessage, 
    connectWallet, 
    getInventory, 
    checkHasCard, 
    addRandomCard 
  } = useInventoryManager(inventoryManagerData);

  // Refresh listings when current address changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings, currentAddress]);

  // Handle manual wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Handle getting a random card
  const handleGetRandomCard = async () => {
    try {
      await addRandomCard();
    } catch (error) {
      console.error("Error getting random card:", error);
    }
  };

  return (
    <div className="app-container">
      {/* Sparkles effect - always visible now */}
      <Sparkles />
      
      <div className="app-header">
        {/* Wallet Status - Now part of header layout */}
        <div className="wallet-status-left">
          {currentAddress ? (
            <div className="wallet-connected">
              <div className="wallet-icon">🐱</div>
              <div className="wallet-text">
                <span className="wallet-label">Purrfectly Connected Wallet:</span>
                <span className="wallet-address">{currentAddress.substring(0, 6)}...{currentAddress.substring(currentAddress.length - 4)}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="connect-wallet-button"
            >
              <span className="wallet-connect-icon">🐾</span>
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Main App Navigation */}
      <nav className="app-nav">
        <button 
          onClick={() => setCurrentView('spin')}
          className={currentView === 'spin' ? 'active' : ''}
        >
          Get Cats
        </button>
        <button 
          onClick={() => setCurrentView('marketplace')}
          className={currentView === 'marketplace' ? 'active' : ''}
        >
          Marketplace
        </button>
        <button 
          onClick={() => setCurrentView('gallery')}
          className={currentView === 'gallery' ? 'active' : ''}
        >
          My Gallery
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'spin' && (
          <CatCarousel 
            onAddRandomCard={handleGetRandomCard}
            isProcessing={isProcessing}
            lastReceivedCard={lastReceivedCard}
            isConnected={Boolean(currentAddress)}
          />
        )}
        
        {currentView === 'marketplace' && (
          <Marketplace 
            listings={listings}
            createListing={createListing}
            acceptListing={acceptListing}
            cancelListing={cancelListing}
            setOfferCardId={setOfferCardId}
            setRequestCardId={setRequestCardId}
            status={status}
            currentAddress={currentAddress}
            tradingErrorMessage={tradingErrorMessage}
            isConnected={Boolean(currentAddress)}
            isCardInActiveListing={isCardInActiveListing}
          />
        )}
        
        {currentView === 'gallery' && (
          <Gallery 
            inventory={inventory}
            onAddRandomCard={handleGetRandomCard}
            isConnected={Boolean(currentAddress)}
            setCurrentView={setCurrentView}
          />
        )}
      </main>

      {/* Error Messages */}
      {inventoryStatus === 'Revert' && (
        <div style={{ color: '#F87171', margin: '20px 0', textAlign: 'center', fontWeight: 'bold' }}>
          Error: {errorMessage || 'Something went wrong. Please try again.'}
        </div>
      )}
    </div>
  );
}

export default App;
