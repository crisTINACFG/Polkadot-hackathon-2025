import { useCallback, useState, useEffect } from "react";
import { Contract, ContractTransactionResponse, BrowserProvider } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

export function useInventoryManager(contractData: ContractData) {
    const [inventory, setInventory] = useState<number[]>(Array(15).fill(0));
    const [hasCard, setHasCard] = useState<boolean>(false);
    const [status, setStatus] = useState<'Initial' | 'Loading' | 'Success' | 'Revert'>('Initial');
    const [lastReceivedCard, setLastReceivedCard] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getInventory = useCallback(async (userAddress: string) => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const signerAddress = await signer.getAddress();
                
                // Make sure we're using the current wallet
                if (signerAddress.toLowerCase() !== userAddress.toLowerCase()) {
                    console.log('Addresses dont match, fetching new signer');
                    await window.ethereum.request({ 
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }]
                    });
                    return;
                }
                
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const userInventory = await contract.getInventory(userAddress);
                const inventoryArray = userInventory.map((num: any) => Number(num));
                setInventory(inventoryArray);
            } catch (e) {
                console.error('Error getting inventory:', e);
            }
        }
    }, [contractData.abi, contractData.address]);

    const connectWallet = useCallback(async () => {
        if (window.ethereum) {
            try {
                // Request account access with explicit permissions
                await window.ethereum.request({ 
                    method: 'wallet_requestPermissions',
                    params: [{ eth_accounts: {} }]
                });
                
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                if (accounts.length > 0) {
                    const address = accounts[0];
                    setCurrentAddress(address);
                    await getInventory(address);
                }
            } catch (error) {
                console.error('Error connecting to wallet:', error);
            }
        }
    }, [getInventory]);

    const checkHasCard = useCallback(async (userAddress: string, cardId: number, amount: number) => {
        if (window.ethereum) {
            try {
                const provider = new BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const hasCardResult = await contract.hasCard(userAddress, cardId, amount);
                setHasCard(hasCardResult);
            } catch (e) {
                console.error('Error checking card:', e);
            }
        }
    }, [contractData.abi, contractData.address]);

    const addRandomCard = useCallback(async () => {
        if (!currentAddress) {
            await connectWallet();
            return;
        }

        if (!isProcessing && window.ethereum) {
            setIsProcessing(true);
            setStatus('Loading');
            setErrorMessage(null);
            
            try {
                // Skip redundant account requests if we already have the current address
                const provider = new BrowserProvider(window.ethereum);
                let selectedAddress = currentAddress;
                
                // Create contract instance
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                // Generate random card ID (0-14 to match our UI cat images)
                const randomCardId = Math.floor(Math.random() * 15);
                console.log('Adding card:', randomCardId, 'for address:', selectedAddress);
                
                // Send the transaction directly without gas estimation
                const response: ContractTransactionResponse = await contract.addCard(
                    selectedAddress,
                    randomCardId
                );
                
                console.log('Transaction sent with hash:', response.hash);
                
                // Wait for transaction confirmation
                await response.wait();
                console.log('Transaction confirmed');
                
                // Update UI after transaction is confirmed
                await getInventory(selectedAddress);
                setLastReceivedCard(randomCardId);
                setStatus('Success');
                
            } catch (e: any) {
                console.error('Error adding random card:', e);
                setStatus('Revert');
                
                // Extract useful error information
                let error = 'Unknown error';
                if (e.message) {
                    if (e.message.includes('insufficient funds')) {
                        error = 'Not enough ETH for gas';
                    } else if (e.message.includes('user rejected')) {
                        error = 'Transaction rejected by user';
                    } else if (e.message.includes('execution reverted')) {
                        error = 'Contract rejected the transaction';
                    } else {
                        error = e.message;
                    }
                }
                
                setErrorMessage(error);
                console.log('Error details:', error);
                
                if (currentAddress) {
                    await getInventory(currentAddress);
                }
            } finally {
                setIsProcessing(false);
            }
        }
    }, [contractData.abi, contractData.address, getInventory, isProcessing, currentAddress, connectWallet]);

    // Handle wallet connection and account changes
    useEffect(() => {
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0) {
                const newAddress = accounts[0];
                console.log('Account changed to:', newAddress);
                setCurrentAddress(newAddress);
                await getInventory(newAddress);
            } else {
                setCurrentAddress(null);
                setInventory(Array(15).fill(0));
            }
        };

        const handleChainChanged = () => {
            console.log('Chain changed, reloading...');
            window.location.reload();
        };

        if (window.ethereum) {
            // @ts-ignore - window.ethereum type is not properly defined
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            // @ts-ignore - window.ethereum type is not properly defined
            window.ethereum.on('chainChanged', handleChainChanged);

            // Get initial account
            // @ts-ignore - window.ethereum type is not properly defined
            window.ethereum.request({ method: 'eth_accounts' })
                .then((accounts: string[]) => {
                    if (accounts.length > 0) {
                        const address = accounts[0];
                        console.log('Initial account:', address);
                        setCurrentAddress(address);
                        getInventory(address);
                    }
                });
        }

        return () => {
            if (window.ethereum) {
                // @ts-ignore - window.ethereum type is not properly defined
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                // @ts-ignore - window.ethereum type is not properly defined
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, [getInventory]);

    return {
        inventory,
        hasCard,
        status,
        lastReceivedCard,
        isProcessing,
        currentAddress,
        errorMessage,
        connectWallet,
        getInventory,
        checkHasCard,
        addRandomCard
    };
} 