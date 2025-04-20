import { useCallback, useState, useEffect } from "react";
import { Contract, ContractTransactionResponse } from "ethers";
import { ContractData } from "contracts";
import { ethersProvider } from "../ethersProvider";

export function useInventoryManager(contractData: ContractData) {
    const [inventory, setInventory] = useState<number[]>(Array(9).fill(0));
    const [hasCard, setHasCard] = useState<boolean>(false);
    const [status, setStatus] = useState<'Initial' | 'Loading' | 'Success' | 'Revert'>('Initial');

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
        if (ethersProvider !== null) {
            const provider = ethersProvider;
            setStatus('Loading');
            try {
                const signer = await provider.getSigner();
                const contract = new Contract(contractData.address, contractData.abi, signer);
                const userAddress = await signer.getAddress();
                
                // Generate random card ID (0-8)
                const randomCardId = Math.floor(Math.random() * 9);
                
                // Optimistically update the UI
                const newInventory = [...inventory];
                newInventory[randomCardId] += 1;
                setInventory(newInventory);
                
                // Send the transaction
                const response: ContractTransactionResponse = await contract.addCard(
                    userAddress,
                    randomCardId
                );
                
                // Update status to success as soon as transaction is sent
                setStatus('Success');
                
                // Refresh inventory in the background
                response.wait().then(() => {
                    getInventory(userAddress);
                }).catch((e) => {
                    console.error(e);
                    // Revert optimistic update if transaction failed
                    getInventory(userAddress);
                });
                
            } catch (e) {
                console.error(e);
                setStatus('Revert');
                // Revert optimistic update if transaction failed
                if (window.ethereum) {
                    // @ts-ignore - window.ethereum type is not properly defined
                    const userAddress = window.ethereum.selectedAddress;
                    if (userAddress) {
                        getInventory(userAddress);
                    }
                }
            }
        }
    }, [contractData.abi, contractData.address, getInventory, inventory]);

    // Initialize inventory when the component mounts
    useEffect(() => {
        if (window.ethereum) {
            // @ts-ignore - window.ethereum type is not properly defined
            const userAddress = window.ethereum.selectedAddress;
            if (userAddress) {
                getInventory(userAddress);
            }
        }
    }, [getInventory]);

    return {
        inventory,
        hasCard,
        status,
        getInventory,
        checkHasCard,
        addRandomCard
    };
} 