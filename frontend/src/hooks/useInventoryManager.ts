import { useCallback, useState, useEffect } from "react";
import { Contract, ContractTransactionResponse } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

export function useInventoryManager(contractData: ContractData) {
    const [inventory, setInventory] = useState<number[]>(Array(9).fill(0));
    const [hasCard, setHasCard] = useState<boolean>(false);
    const [status, setStatus] = useState<'Initial' | 'Loading' | 'Success' | 'Revert'>('Initial');
    const [lastReceivedCard, setLastReceivedCard] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);

    const getInventory = useCallback(async (userAddress: string) => {
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const userInventory = await contract.getInventory(userAddress);
                // Convert the inventory array to numbers and update state
                const inventoryArray = userInventory.map((num: any) => Number(num));
                setInventory(inventoryArray);
            } catch (e) {
                console.error(e);
            }
        }
    }, [contractData.abi, contractData.address]);

    const checkHasCard = useCallback(async (userAddress: string, cardId: number, amount: number) => {
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                const hasCardResult = await contract.hasCard(userAddress, cardId, amount);
                setHasCard(hasCardResult);
            } catch (e) {
                console.error(e);
            }
        }
    }, [contractData.abi, contractData.address]);

    const addRandomCard = useCallback(async () => {
        if (ethersProvider !== null && !isProcessing && currentAddress) {
            const provider = ethersProvider;
            setIsProcessing(true);
            setStatus('Loading');
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                
                // Generate random card ID (0-8)
                const randomCardId = Math.floor(Math.random() * 9);
                
                // Send the transaction
                const response: ContractTransactionResponse = await contract.addCard(
                    currentAddress,
                    randomCardId
                );
                
                // Wait for transaction confirmation
                await response.wait();
                
                // Update UI after transaction is confirmed
                await getInventory(currentAddress);
                setLastReceivedCard(randomCardId);
                setStatus('Success');
                
            } catch (e) {
                console.error(e);
                setStatus('Revert');
                // Refresh inventory to ensure it's in sync with blockchain
                if (currentAddress) {
                    await getInventory(currentAddress);
                }
            } finally {
                setIsProcessing(false);
            }
        }
    }, [contractData.abi, contractData.address, getInventory, isProcessing, currentAddress]);

    // Handle wallet connection and account changes
    useEffect(() => {
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length > 0) {
                const newAddress = accounts[0];
                setCurrentAddress(newAddress);
                await getInventory(newAddress);
            } else {
                setCurrentAddress(null);
                setInventory(Array(9).fill(0));
            }
        };

        const handleChainChanged = () => {
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
        getInventory,
        checkHasCard,
        addRandomCard
    };
} 