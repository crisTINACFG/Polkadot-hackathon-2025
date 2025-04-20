import React, { useEffect, useState } from "react";
import { contracts } from "contracts";
import { useCardTrading, Status } from "./hooks/useCardTrading";
import { useInventoryManager } from "./hooks/useInventoryManager";
import "./App.css";

const CARD_TRADING_ADDRESS = "39bd199fbf6f4f0f584e71ed6c5617791750e60b";
const INVENTORY_MANAGER_ADDRESS = "ac953a8f481cef16961174d4d5dbac47b0035a0a";

function App() {
  if (!(CARD_TRADING_ADDRESS in contracts) || !(INVENTORY_MANAGER_ADDRESS in contracts)) {
    throw new Error(
      "Contract addresses are missing in contracts; have you built, deployed and exported the contracts?"
    );
  }

  const cardTradingData = contracts[CARD_TRADING_ADDRESS];
  const inventoryManagerData = contracts[INVENTORY_MANAGER_ADDRESS];
  const [userAddress, setUserAddress] = useState<string>("");
  const [flashingCard, setFlashingCard] = useState<number | null>(null);

  const { status, listings, setOfferCardId, setRequestCardId, createListing, acceptListing, fetchListings } = useCardTrading(cardTradingData);
  const { inventory, hasCard, status: inventoryStatus, lastReceivedCard, isProcessing, currentAddress, getInventory, checkHasCard, addRandomCard } = useInventoryManager(inventoryManagerData);

  // Handle flashing animation
  useEffect(() => {
    if (lastReceivedCard !== null) {
      setFlashingCard(lastReceivedCard);
      const timer = setTimeout(() => {
        setFlashingCard(null);
      }, 1000); // Match this with the animation duration
      return () => clearTimeout(timer);
    }
  }, [lastReceivedCard]);

  // Fetch listings on mount
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Card Trading DApp</h1>
      
      {/* Wallet Status */}
      <div className="mb-4">
        {currentAddress ? (
          <p className="text-sm text-gray-600">Connected: {currentAddress}</p>
        ) : (
          <p className="text-sm text-red-600">Please connect your wallet</p>
        )}
      </div>

      {/* Inventory Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Your Inventory</h2>
          <button
            className={`px-4 py-2 rounded ${
              isProcessing || !currentAddress
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white`}
            onClick={addRandomCard}
            disabled={isProcessing || !currentAddress}
          >
            {!currentAddress ? 'Connect Wallet' : (isProcessing ? 'Processing...' : 'Get Random Card')}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {inventory.map((quantity, cardId) => (
            <div 
              key={cardId} 
              className={`p-2 border rounded ${lastReceivedCard === cardId && inventoryStatus === 'Success' ? 'flash-card' : ''}`}
            >
              <p>Card {cardId}: <strong>{quantity}</strong></p>
            </div>
          ))}
        </div>
        {inventoryStatus === 'Success' && lastReceivedCard !== null && (
          <div className="text-green-500 mt-2">Got Card {lastReceivedCard}!</div>
        )}
        {inventoryStatus === 'Revert' && (
          <div className="text-red-500 mt-2">Failed to get a card. Please try again.</div>
        )}
      </div>

      {/* Create Listing Section */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Create New Listing</h2>
        <div className="flex gap-4 mb-2">
          <div>
            <label className="block mb-1">Offer Card ID:</label>
            <input
              type="number"
              min="0"
              max="8"
              className="border rounded p-1"
              onChange={(e) => setOfferCardId(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1">Request Card ID:</label>
            <input
              type="number"
              min="0"
              max="8"
              className="border rounded p-1"
              onChange={(e) => setRequestCardId(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={createListing}
          disabled={status === Status.Loading}
        >
          {status === Status.Loading ? "Creating..." : "Create Listing"}
        </button>
      </div>

      {/* Active Listings Section */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Active Listings</h2>
        <div className="grid gap-4">
          {listings.map((listing, index) => {
            const isUserListing = listing.seller.toLowerCase() === userAddress.toLowerCase();
            return (
              <div key={index} className="p-4 border rounded">
                <p>Seller: {listing.seller}</p>
                <p>Offering: Card {listing.offerCardId}</p>
                <p>Requesting: Card {listing.requestCardId}</p>
                <button
                  className={`mt-2 px-4 py-2 rounded ${
                    isUserListing
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  onClick={() => !isUserListing && acceptListing(index)}
                  disabled={status === Status.Loading || isUserListing}
                >
                  {isUserListing ? "Your Listing" : (status === Status.Loading ? "Processing..." : "Accept Trade")}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Messages */}
      {status === Status.Success && (
        <div className="text-green-500 mb-4">Transaction successful!</div>
      )}
      {status === Status.Revert && (
        <div className="text-red-500 mb-4">Transaction failed. Please try again.</div>
      )}
    </div>
  );
}

export default App;
