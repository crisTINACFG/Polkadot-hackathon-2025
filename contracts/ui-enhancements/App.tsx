import { useState } from 'react';
import { contracts } from "contracts";
import { ethersProvider } from "./ethersProvider";
//import { StoreNumber } from "./components/StoreNumber";
//import { AddMoney } from "./components/AddMoney";
import "./App.css";
import CatCarousel from './components/CatCarousel';
import Marketplace from './components/Marketplace';
import Gallery from './components/Gallery';

// import polkadotLogo from "./assets/polkadot-logo.svg";
import { useNetworkData } from "./hooks/useNetworkData";

const CONTRACT_ADDRESS = "12d7b1015d6888edbeb19610cfe518310405c685";


function App() {

  const [currentView, setCurrentView] = useState<'spin' | 'marketplace' | 'gallery'>('spin');
  

  // connect to blockchain logic for the addCard() bit, after the user spins the wheel


  if (!(CONTRACT_ADDRESS in contracts)) {
    throw new Error(
      `${CONTRACT_ADDRESS} is missing in contracts; have you build, deployed and exported the contract?`
    );
  }
  const contractData = contracts[CONTRACT_ADDRESS];
  // const { storedValue, balance, chainId } = useNetworkData(contractData);


  return (
    <div className="app-container">
      {/* Polkadot Header (kept minimal)
      <header className="polkadot-header">
        <img src={polkadotLogo} className="logo" alt="Polkadot logo" />
        {ethersProvider ? (
          <div className="wallet-info">
            <span>Chain ID: {chainId}</span>
            <span>Balance: {balance}</span>
          </div>
        ) : (
          <div className="wallet-warning">
            Wallet not connected
          </div>
        )}
      </header> */}

      {/* Main App Navigation */}
      <nav className="app-nav">
        <button 
          onClick={() => setCurrentView('spin')}
          className={currentView === 'spin' ? 'active' : ''}
        >
          Choose Cat
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
        {currentView === 'spin' && <CatCarousel addCard={function (catId: string): void {
          throw new Error('Function not implemented.');
        } } />}
        {currentView === 'marketplace' && <Marketplace />}
        {currentView === 'gallery' && <Gallery />}
      </main>
    </div>
  );
}

export default App;

