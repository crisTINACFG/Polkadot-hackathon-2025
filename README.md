# 🐱 miauD - Blockchain Cat Collectibles

miauD is a decentralized blockchain application (dApp) that implements a rarity-weighted spin-based distribution mechanism for digital asset acquisition. The platform employs a tiered probability system where assets are stratified by rarity classifications (Common, Rare, Legendary), with higher-tier assets having proportionally lower acquisition rates. Users can obtain, manage, and trade these non-fungible collectible assets (cat cards) through a transparent and secure smart contract architecture.

The system leverages blockchain technology to ensure immutable ownership records, verifiable rarity-based distribution algorithms, and secure peer-to-peer trading capabilities. miauD demonstrates practical implementation of on-chain asset management with an intuitive user interface, combining entertainment value with the technical benefits of decentralized asset ownership while maintaining economic balance through carefully calibrated acquisition probabilities.

> **Fun Fact**: The "D" in miauD stands for "Decentralized"! Also, the app provides users with random cat facts during the spinning process - because who doesn't want to learn that cats sleep for 70% of their lives while waiting for blockchain confirmations? 🐱

*This project was created for the Polkadot x EasyA Hackathon 2025.*

## 🌟 Features

- **Cat Card Collection**: Spin to receive random cat cards with different rarities (Common, Rare, Legendary)
- **Personal Gallery**: View your collected cats in a beautifully designed gallery
- **Marketplace**: Trade cat cards with other users
- **Blockchain Integration**: Built on Ethereum, with all cards stored as digital assets on the blockchain
- **Animated UI**: Engaging animations and visual effects for an immersive experience

## 📸 Media Showcase

### Screenshots
![MedalTVScreenRecording20250420114011-tr-edit-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/d7c434ef-5eda-4550-90f5-b18549f72795)
![image](https://github.com/user-attachments/assets/9328bd76-4b6b-42af-baf1-df15e533fec6)
![image](https://github.com/user-attachments/assets/eba791e2-78f9-4ced-8638-26f4a3e9991c)
![image](https://github.com/user-attachments/assets/a43fb56d-8615-488c-a834-203f8f5881ee)




### Video Demonstration

<div align="center">
  </a>(https://youtu.be/78SroANHoPM?si=j_EytivRcFXsWlHt)
  <p><em>Click to watch a full demonstration of miauD's features (YouTube)</em></p>
</div>

## Technologies Used

- **Frontend**:
  - React + TypeScript
  - CSS for styling and animations
  - Ethers.js for blockchain interaction

- **Backend**:
  - Solidity smart contracts
  - Ethereum-compatible Westend Asset Hub testnet (Polkadot)
  - Remix IDE and remixd for contract development

## 📋 Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask wallet browser extension
- Access to Westend Asset Hub testnet

## 🚀 Installation and Setup

To run the project locally:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd miauD

# Install dependencies at the root level
npm install

# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Go back to the root directory and start the frontend
cd ..
pnpm frontend:dev
```

## 🎮 How to Use

**Connect Your Wallet**:
- Click the "Connect Wallet" button in the top-right corner
- Approve the connection in your MetaMask wallet

**Get Your First Cat**:
- Navigate to the "Get Cats" section
- Click "Spin for a Cat!" to receive a random cat card
- The card will be added to your collection after blockchain confirmation

**View Your Collection**:
- Go to the "My Gallery" section to see all your collected cats
- Cards show quantity indicators for duplicates

**Trade Cards**:
- Visit the "Marketplace" section
- Create listings to offer trades with other users
- Accept trades from other users

## 🏗️ Project Architecture

### Frontend Structure

```
frontend/
├── src/
│   ├── assets/         # Cat images and other assets
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks for blockchain interaction
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry point
└── index.html          # HTML template
```

### Key Components

- **CatCarousel**: Handles the spinning mechanism to get new random cats
- **Gallery**: Displays the user's collection of cat cards
- **Marketplace**: Allows users to trade cards with other users

### Smart Contracts

The project uses two main smart contracts:

1. **InventoryManager**: Handles the user's collection, including:
   - Adding new cards to the inventory
   - Checking card ownership
   - Getting the full inventory

2. **CardTrading**: Manages the marketplace functionality, including:
   - Creating trade listings
   - Accepting trades
   - Canceling listings

## 👨‍💻 Developer Information

### Custom Hooks

- `useInventoryManager`: Manages the user's card inventory
- `useCardTrading`: Handles marketplace functionality

## 🙏 Acknowledgements

- **UI Design & Development**: The user interface design, custom React hooks, debugging assistance, and technical research were facilitated by [Claude](https://www.anthropic.com/claude), an AI assistant by Anthropic
- **Artwork Generation**: All cat character illustrations were created using [ChatGPT](https://chat.openai.com/) by OpenAI
- **Blockchain Framework**: Smart contract templates and development environment provided by [Polkadot](https://polkadot.network/)
- **Development Tools**: [Remix IDE](https://remix.ethereum.org/) and remixd for Solidity smart contract development
- **Testing Environment**: [Westend Asset Hub](https://wiki.polkadot.network/docs/learn-guides-westend-asset-hub) testnet for safe and cost-effective contract testing

## 👥 Team

miauD was created by a dedicated team of blockchain enthusiasts and developers:

- [Maryam Karous](https://www.linkedin.com/in/maryam-karous-78b674280)
- [Cristina Gheorghe](https://www.linkedin.com/in/cristina-gheorghe-0a6053285/)
- [Zoey Bou Khalil](https://www.linkedin.com/in/zoey-bou-khalil-a422a4272/)
- [Arani Gnanavalagan](https://www.linkedin.com/in/aranignana)

Follow us on Twitter: [@miauD_UK](https://x.com/miauD_UK)

