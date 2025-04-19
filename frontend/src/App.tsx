import { contracts } from "contracts";
import { ethersProvider } from "./ethersProvider";
import { GetName } from "./components/GetName";
import { SetName } from "./components/SetName";
import "./App.css";

import polkadotLogo from "./assets/polkadot-logo.svg";
import { useNetworkData } from "./hooks/useNetworkData";

const CONTRACT_ADDRESS = "eb8cc397b758055521da1126d4af987fa1675a51";

function App() {
  if (!(CONTRACT_ADDRESS in contracts)) {
    throw new Error(
      `${CONTRACT_ADDRESS} is missing in contracts; have you build, deployed and exported the contract?`
    );
  }

  const contractData = contracts[CONTRACT_ADDRESS];
  const { storedValue, balance, chainId } = useNetworkData(contractData);

  return (<div>fill this in dawgs</>)
  
}

export default App;